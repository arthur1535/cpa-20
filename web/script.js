const state = {
  allQuestions: [],
  currentQuestions: [],
  currentIndex: 0,
  answers: [],
  wrongPool: [],
};

/**
 * Fetches questions from the local JSON file and prepares them for use.
 */
async function loadQuestions() {
  const response = await fetch('questoes_cpa20.json');
  if (!response.ok) {
    throw new Error('Não foi possível carregar o banco de questões.');
  }
  const data = await response.json();
  state.allQuestions = data;
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTheme(theme) {
  const map = {
    fundos: 'Fundos de Investimento',
    renda_fixa: 'Renda Fixa',
    renda_variavel: 'Renda Variável',
    pld: 'Compliance e PLD',
    tributacao: 'Tributação',
    previdencia: 'Previdência',
  };
  return map[theme] || theme;
}

function resetQuizView() {
  document.getElementById('quiz-card').hidden = true;
  document.getElementById('result-card').hidden = true;
  document.getElementById('setup-card').hidden = false;
}

function startQuiz(filteredQuestions) {
  state.currentQuestions = filteredQuestions;
  state.currentIndex = 0;
  state.answers = [];
  state.wrongPool = [];
  document.getElementById('setup-card').hidden = true;
  document.getElementById('result-card').hidden = true;
  document.getElementById('quiz-card').hidden = false;
  renderQuestion();
}

function renderQuestion() {
  const question = state.currentQuestions[state.currentIndex];
  const progressText = `Questão ${state.currentIndex + 1} de ${state.currentQuestions.length}`;

  document.getElementById('quiz-progress').textContent = progressText;
  document.getElementById('quiz-theme').textContent = formatTheme(question.tema);
  document.getElementById('question-text').textContent = question.enunciado;
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';

  const percentage = Math.round((state.currentIndex / state.currentQuestions.length) * 100);
  document.getElementById('progress-pill').textContent = `${percentage}% concluído`;

  const optionsContainer = document.getElementById('alternatives');
  optionsContainer.innerHTML = '';

  question.alternativas.forEach((alt, idx) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.type = 'button';
    button.dataset.index = idx;
    button.innerHTML = `
      <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
      <span>${alt}</span>
    `;
    button.addEventListener('click', () => handleAnswer(button, idx));
    optionsContainer.appendChild(button);
  });

  const nextBtn = document.getElementById('next-btn');
  nextBtn.disabled = true;
  nextBtn.textContent = state.currentIndex === state.currentQuestions.length - 1 ? 'Ver resultado' : 'Próxima';
  nextBtn.onclick = () => goToNext();
}

function handleAnswer(button, selectedIndex) {
  const question = state.currentQuestions[state.currentIndex];
  const options = Array.from(document.querySelectorAll('.option-btn'));

  options.forEach((opt) => {
    opt.disabled = true;
    opt.classList.remove('correct', 'incorrect');
  });

  const isCorrect = Number(question.resposta_correta) === selectedIndex;
  button.classList.add(isCorrect ? 'correct' : 'incorrect');

  const correctBtn = options[Number(question.resposta_correta)];
  if (correctBtn && correctBtn !== button) {
    correctBtn.classList.add('correct');
  }

  const feedback = document.getElementById('feedback');
  if (isCorrect) {
    feedback.textContent = 'Resposta correta!';
    feedback.classList.add('success');
  } else {
    feedback.textContent = 'Resposta incorreta. Revise e tente novamente.';
    feedback.classList.add('error');
  }

  state.answers.push({
    id: question.id,
    tema: question.tema,
    correct: isCorrect,
  });

  if (!isCorrect) {
    state.wrongPool.push(question);
  }

  document.getElementById('next-btn').disabled = false;
}

function goToNext() {
  const isLast = state.currentIndex === state.currentQuestions.length - 1;
  if (isLast) {
    showResults();
    return;
  }
  state.currentIndex += 1;
  renderQuestion();
}

function summarizeErrors() {
  const counts = {};
  state.answers
    .filter((a) => !a.correct)
    .forEach((a) => {
      counts[a.tema] = (counts[a.tema] || 0) + 1;
    });
  return counts;
}

function showResults() {
  const total = state.answers.length;
  const correct = state.answers.filter((a) => a.correct).length;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  const errorsByTheme = summarizeErrors();

  document.getElementById('quiz-card').hidden = true;
  document.getElementById('result-card').hidden = false;

  document.getElementById('score-title').textContent = percent >= 80 ? 'Ótimo trabalho!' : 'Continue praticando';
  document.getElementById('score-subtitle').textContent = `Você acertou ${correct} de ${total} questões.`;
  document.getElementById('score-percentage').textContent = `${percent}%`;
  document.getElementById('score-count').textContent = `${correct} / ${total}`;
  document.getElementById('wrong-count').textContent = `${total - correct}`;

  const list = document.getElementById('error-list');
  list.innerHTML = '';
  if (Object.keys(errorsByTheme).length === 0) {
    const item = document.createElement('li');
    item.textContent = 'Sem erros. Excelente!';
    list.appendChild(item);
  } else {
    Object.entries(errorsByTheme).forEach(([theme, qty]) => {
      const item = document.createElement('li');
      item.innerHTML = `<span>${formatTheme(theme)}</span><strong>${qty}</strong>`;
      list.appendChild(item);
    });
  }
}

function filterQuestions(theme, quantity) {
  const pool = theme === 'todos'
    ? [...state.allQuestions]
    : state.allQuestions.filter((q) => q.tema === theme);

  const selected = shuffle(pool).slice(0, quantity);
  return selected;
}

function handleStart(event) {
  event.preventDefault();
  const quantity = Number(document.getElementById('question-count').value);
  const theme = document.getElementById('theme').value;
  const filtered = filterQuestions(theme, quantity);

  if (filtered.length === 0) {
    alert('Não há questões para o filtro escolhido.');
    return;
  }
  startQuiz(filtered);
}

function handleReviewErrors() {
  if (state.wrongPool.length === 0) {
    alert('Não há erros para revisar nesta sessão.');
    return;
  }
  startQuiz(shuffle(state.wrongPool));
}

function handleNewQuiz() {
  resetQuizView();
}

function bindUI() {
  document.getElementById('setup-form').addEventListener('submit', handleStart);
  document.getElementById('review-errors').addEventListener('click', handleReviewErrors);
  document.getElementById('new-quiz').addEventListener('click', handleNewQuiz);
}

async function init() {
  try {
    await loadQuestions();
    bindUI();
  } catch (error) {
    alert(error.message);
  }
}

document.addEventListener('DOMContentLoaded', init);

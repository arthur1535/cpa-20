// ================== ESTADO ==================

let state = {
  allQuestions: [],
  currentQuestions: [],
  currentIndex: 0,
  answers: [],
  wrongPool: [],
};

// ================== UTILITÁRIOS ==================

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
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

// ================== CARREGAR QUESTÕES ==================

async function loadQuestions() {
  try {
    const response = await fetch('questoes_cpa20.json');
    if (!response.ok) throw new Error('Erro ao carregar questões');
    state.allQuestions = await response.json();
    updateQuestionStatus(`${state.allQuestions.length} questões carregadas`);
    renderQuestionList(state.allQuestions);
    renderOverviewStats();
  } catch (err) {
    console.error(err);
    updateQuestionStatus('Erro ao carregar questões: ' + err.message);
  }
}

function updateQuestionStatus(text) {
  const el = document.getElementById('questionStatus');
  if (el) el.textContent = text;
}

function renderQuestionList(questions) {
  const listEl = document.getElementById('questionList');
  if (!listEl) return;

  if (!questions.length) {
    listEl.innerHTML = '<p>Nenhuma questão disponível.</p>';
    return;
  }

  listEl.innerHTML = questions.slice(0, 5).map(q => `
    <article class="question-card">
      <div class="question-meta">
        <span class="pill">${formatTheme(q.tema)}</span>
      </div>
      <h4>${q.enunciado}</h4>
      <ul>
        ${q.alternativas.map((alt, idx) => 
          `<li>${String.fromCharCode(65 + idx)}) ${alt}</li>`
        ).join('')}
      </ul>
    </article>
  `).join('');
}

// ================== QUIZ ==================

function filterQuestions(theme, quantity) {
  let pool = theme === 'todos' 
    ? [...state.allQuestions] 
    : state.allQuestions.filter(q => q.tema === theme);
  
  return shuffle(pool).slice(0, quantity);
}

function startQuiz(questions) {
  state.currentQuestions = questions;
  state.currentIndex = 0;
  state.answers = [];
  state.wrongPool = [];

  document.getElementById('setup-card').hidden = true;
  document.getElementById('quiz-card').hidden = false;
  
  const resultCard = document.getElementById('result-card');
  if (resultCard) resultCard.hidden = true;

  renderQuestion();
}

function renderQuestion() {
  const question = state.currentQuestions[state.currentIndex];
  const total = state.currentQuestions.length;
  const current = state.currentIndex + 1;

  document.getElementById('quiz-progress').textContent = `Questão ${current} de ${total}`;
  document.getElementById('quiz-theme').textContent = formatTheme(question.tema);
  document.getElementById('question-text').textContent = question.enunciado;
  
  const percentage = Math.round((state.currentIndex / total) * 100);
  document.getElementById('progress-pill').textContent = `${percentage}% concluído`;

  // Limpar feedback
  const feedback = document.getElementById('feedback');
  feedback.textContent = '';
  feedback.className = 'feedback';

  // Renderizar alternativas
  const optionsContainer = document.getElementById('alternatives');
  optionsContainer.innerHTML = '';

  question.alternativas.forEach((alt, idx) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.type = 'button';
    button.innerHTML = `
      <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
      <span>${alt}</span>
    `;
    button.addEventListener('click', () => handleAnswer(button, idx));
    optionsContainer.appendChild(button);
  });

  // Botão próximo
  const nextBtn = document.getElementById('next-btn');
  nextBtn.disabled = true;
  nextBtn.textContent = current === total ? 'Ver resultado' : 'Próxima';
}

function handleAnswer(button, selectedIndex) {
  const question = state.currentQuestions[state.currentIndex];
  const options = Array.from(document.querySelectorAll('.option-btn'));
  const correctIndex = question.resposta_correta;
  const isCorrect = correctIndex === selectedIndex;

  // Desabilitar todas
  options.forEach(opt => {
    opt.disabled = true;
    opt.classList.remove('correct', 'incorrect');
  });

  // Marcar selecionada
  button.classList.add(isCorrect ? 'correct' : 'incorrect');

  // Marcar correta se errou
  if (!isCorrect && options[correctIndex]) {
    options[correctIndex].classList.add('correct');
  }

  // Feedback
  const feedback = document.getElementById('feedback');
  if (isCorrect) {
    feedback.textContent = '✅ Resposta correta!';
    feedback.className = 'feedback success';
  } else {
    feedback.textContent = '❌ Resposta incorreta. ' + (question.explicacao || '');
    feedback.className = 'feedback error';
  }

  // Salvar resposta
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
  if (state.currentIndex === state.currentQuestions.length - 1) {
    showResults();
  } else {
    state.currentIndex++;
    renderQuestion();
  }
}

function showResults() {
  const total = state.answers.length;
  const correct = state.answers.filter(a => a.correct).length;
  const percent = total ? Math.round((correct / total) * 100) : 0;

  document.getElementById('quiz-card').hidden = true;
  
  // Criar card de resultado se não existir
  let resultCard = document.getElementById('result-card');
  if (!resultCard) {
    resultCard = document.createElement('section');
    resultCard.id = 'result-card';
    resultCard.className = 'card';
    document.querySelector('main').appendChild(resultCard);
  }

  resultCard.hidden = false;
  resultCard.innerHTML = `
    <div class="result-content">
      <h1>${percent >= 70 ? '🎉 Ótimo trabalho!' : '📚 Continue praticando!'}</h1>
      <div class="score-display">
        <div class="score-circle ${percent >= 70 ? 'success' : 'warning'}">
          <span class="score-percent">${percent}%</span>
        </div>
      </div>
      <p class="score-detail">Você acertou <strong>${correct}</strong> de <strong>${total}</strong> questões</p>
      
      ${state.wrongPool.length > 0 ? `
        <div class="errors-summary">
          <h3>❌ Questões erradas por tema:</h3>
          <ul>
            ${Object.entries(summarizeErrors()).map(([tema, qty]) => 
              `<li><span>${formatTheme(tema)}</span> <strong>${qty}</strong></li>`
            ).join('')}
          </ul>
        </div>
      ` : '<p class="success-msg">✅ Sem erros! Excelente!</p>'}

      <div class="result-actions">
        ${state.wrongPool.length > 0 ? 
          '<button id="review-errors" class="btn btn--primary">Refazer apenas os erros</button>' : ''
        }
        <button id="new-quiz" class="btn btn--ghost">Novo simulado</button>
      </div>
    </div>
  `;

  // Event listeners
  const reviewBtn = document.getElementById('review-errors');
  if (reviewBtn) {
    reviewBtn.addEventListener('click', () => {
      startQuiz([...state.wrongPool]);
    });
  }

  document.getElementById('new-quiz').addEventListener('click', () => {
    resultCard.hidden = true;
    document.getElementById('setup-card').hidden = false;
  });
}

function summarizeErrors() {
  const counts = {};
  state.answers
    .filter(a => !a.correct)
    .forEach(a => {
      counts[a.tema] = (counts[a.tema] || 0) + 1;
    });
  return counts;
}

// ================== ESTATÍSTICAS ==================

function renderOverviewStats() {
  const statsEl = document.getElementById('overviewStats');
  if (!statsEl) return;

  const themes = [...new Set(state.allQuestions.map(q => q.tema))];
  
  statsEl.innerHTML = `
    <div class="stat">
      <span class="stat-value">${state.allQuestions.length}</span>
      <span class="stat-label">Questões</span>
    </div>
    <div class="stat">
      <span class="stat-value">${themes.length}</span>
      <span class="stat-label">Temas</span>
    </div>
  `;
}

// ================== INICIALIZAÇÃO ==================

function init() {
  // Carregar questões
  loadQuestions();

  // Form de setup
  const setupForm = document.getElementById('setup-form');
  if (setupForm) {
    setupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const quantity = parseInt(document.getElementById('question-count').value);
      const theme = document.getElementById('theme').value;
      const questions = filterQuestions(theme, quantity);
      
      if (questions.length === 0) {
        alert('Nenhuma questão encontrada para este tema. Tente "Todos os temas".');
        return;
      }
      
      startQuiz(questions);
    });
  }

  // Botão próximo
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', goToNext);
  }

  // Botões de foco
  const focusWeakBtn = document.getElementById('focusWeakBtn');
  if (focusWeakBtn) {
    focusWeakBtn.addEventListener('click', () => {
      document.getElementById('theme').value = 'pld';
      document.getElementById('setup-form').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Modo revisão
  const revisionModeBtn = document.getElementById('revisionModeBtn');
  if (revisionModeBtn) {
    revisionModeBtn.addEventListener('click', () => {
      if (state.wrongPool.length > 0) {
        startQuiz([...state.wrongPool]);
      } else {
        alert('Faça um simulado primeiro para ter questões erradas para revisar.');
      }
    });
  }

  // Reset
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Limpar todo o progresso?')) {
        state.wrongPool = [];
        state.answers = [];
        document.getElementById('quiz-card').hidden = true;
        const resultCard = document.getElementById('result-card');
        if (resultCard) resultCard.hidden = true;
        document.getElementById('setup-card').hidden = false;
        alert('Progresso limpo!');
      }
    });
  }

  // Botões questões padrão/revisão
  const defaultQuestionsBtn = document.getElementById('defaultQuestionsBtn');
  if (defaultQuestionsBtn) {
    defaultQuestionsBtn.addEventListener('click', () => {
      renderQuestionList(state.allQuestions);
      updateQuestionStatus(`${state.allQuestions.length} questões carregadas`);
    });
  }

  const revisionQuestionsBtn = document.getElementById('revisionQuestionsBtn');
  if (revisionQuestionsBtn) {
    revisionQuestionsBtn.addEventListener('click', () => {
      if (state.wrongPool.length > 0) {
        renderQuestionList(state.wrongPool);
        updateQuestionStatus(`${state.wrongPool.length} questões para revisão`);
      } else {
        updateQuestionStatus('Faça um simulado primeiro para ter questões para revisar.');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', init);

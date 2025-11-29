const topics = [
  {
    id: 'fundos',
    title: 'Fundos de Investimento',
    weight: '25-35% da prova',
    description: 'Classificação CVM, tributação (come-cotas), papeis de administrador/gestor/custodiante e IOF.',
    focus: [
      'Come-cotas em maio e novembro',
      'Alíquotas curto x longo prazo e fundos de ações',
      'Papéis: administrador, gestor, custodiante, distribuidor',
    ],
    checklist: [
      'Identifica percentual mínimo (RF 80%, Ações 67%, Cambial 80%)',
      'Sabe quando não há come-cotas (fundos de ações)',
      'Tabela regressiva no resgate (22,5% → 15%)',
    ],
    numbers: ['80% RF', '67% ações', '15%/20% come-cotas', 'Mai+Nov come-cotas'],
    link: '../estudos/resumo-executivo-temas.md#3-fundos-de-investimento-%EF%B8%8F-tema-principal-25-35',
  },
  {
    id: 'pld',
    title: 'Compliance e PLD',
    weight: 'Muito cobrado',
    description: 'Fases da lavagem, obrigações de cadastro, COAF e suitability.',
    focus: [
      '3 fases: colocação → ocultação → integração',
      'Comunicação ao COAF e guarda de registros por 5 anos',
      'Suitability: objetivo + prazo + conhecimento + finanças + risco',
    ],
    checklist: [
      'Consegue definir insider trading e front running',
      'Sabe quais operações devem ser comunicadas ao COAF',
      'Domina formulários e periodicidade de atualização cadastral',
    ],
    numbers: ['5 anos registros', 'Suitability obrigatório'],
    link: '../estudos/resumo-executivo-temas.md#2-compliance-e-pld-%EF%B8%8F-muito-importante',
  },
  {
    id: 'renda-fixa',
    title: 'Renda Fixa',
    weight: 'Títulos públicos e privados',
    description: 'Tesouro (LFT, LTN, NTN-B, NTN-F), FGC e títulos privados com tributação.',
    focus: [
      'Limites do FGC e produtos cobertos',
      'Diferenças entre LFT, LTN, NTN-B e NTN-F',
      'Isenção de IR para LCI/LCA/CRI/CRA',
    ],
    checklist: [
      'Sabe explicar come-cotas x IOF (até 30 dias)',
      'Diferencia debêntures incentivadas das comuns',
      'Recorda tetos: R$ 250k por instituição, R$ 1 mi em 4 anos',
    ],
    numbers: ['R$250k FGC', 'R$1mi/4 anos', 'IOF 30 dias'],
    link: '../estudos/resumo-executivo-temas.md#4-renda-fixa',
  },
  {
    id: 'renda-variavel',
    title: 'Renda Variável',
    weight: 'Ações, FIIs e eventos',
    description: 'Tipos de ações, tributação, isenção até R$ 20 mil, FIIs e eventos corporativos.',
    focus: [
      'Diferença ON x PN x Units',
      'IR: 15% swing trade, 20% day trade, dividendos isentos',
      'FIIs: dividendos isentos, ganho de capital 20%',
    ],
    checklist: [
      'Recorda gatilho de isenção em ações (R$ 20k/mês vendido)',
      'Sabe tratar JCP (15% na fonte)',
      'Identifica eventos: split, inplit, tag along',
    ],
    numbers: ['15% swing', '20% day trade', 'R$20k isenção'],
    link: '../estudos/resumo-executivo-temas.md#5-renda-vari%C3%A1vel',
  },
  {
    id: 'previdencia',
    title: 'Previdência Complementar',
    weight: 'PGBL x VGBL',
    description: 'Diferenças de base de cálculo, dedução e tabelas regressiva/progressiva.',
    focus: [
      'PGBL deduz até 12% da renda bruta (declaração completa)',
      'VGBL tributa apenas rendimento (declaração simplificada)',
      'Tabelas regressiva (35% → 10%) e progressiva',
    ],
    checklist: [
      'Consegue indicar quando usar portabilidade sem IR',
      'Relaciona tempo de aporte com alíquota na regressiva',
      'Explica diferença de base tributável PGBL x VGBL',
    ],
    numbers: ['12% dedução', 'Regressiva 35%→10%'],
    link: '../estudos/resumo-executivo-temas.md#6-previd%C3%AAncia-complementar',
  },
  {
    id: 'derivativos',
    title: 'Derivativos',
    weight: 'Opções, futuros e swaps',
    description: 'Direitos e obrigações de calls/puts, ajuste diário e trocas de indexadores.',
    focus: [
      'Titular tem direito; lançador tem obrigação',
      'Futuros: ajuste diário e contratos padronizados',
      'Swaps: troca CDI, dólar, IPCA para hedge',
    ],
    checklist: [
      'Sabe diferença entre call e put para titular e lançador',
      'Explica ajuste diário e margem de garantia',
      'Indica uso de swaps para proteção',
    ],
    numbers: ['Ajuste diário', 'Margem'],
    link: '../estudos/resumo-executivo-temas.md#7-derivativos',
  },
  {
    id: 'economia',
    title: 'Economia e Indicadores',
    weight: 'PIB, IPCA, SELIC, CDI',
    description: 'Relações básicas de política monetária e impactos em renda fixa/variável.',
    focus: [
      'Como a alta de juros afeta inflação e câmbio',
      'Frequência das reuniões do COPOM (45 dias)',
      'Relação juros x valorização do real',
    ],
    checklist: [
      'Sabe explicar IPCA como inflação oficial',
      'Conecta SELIC aos rendimentos de títulos pós-fixados',
      'Relaciona cenário macro a estratégias de carteira',
    ],
    numbers: ['COPOM a cada 45 dias'],
    link: '../estudos/resumo-executivo-temas.md#8-economia',
  },
  {
    id: 'riscos',
    title: 'Gestão de Riscos',
    weight: 'Mercado, crédito, liquidez, operacional, legal',
    description: 'Classificação dos principais riscos e ferramentas de mitigação.',
    focus: [
      'Diversificação e correlação negativa',
      'Hedge para reduzir exposição',
      'Diferença entre risco de mercado x crédito x liquidez',
    ],
    checklist: [
      'Consegue dar exemplo de cada tipo de risco',
      'Sabe quando o risco operacional predomina',
      'Explica como hedge protege preço ou câmbio',
    ],
    numbers: ['Hedge', 'Correlação'],
    link: '../estudos/resumo-executivo-temas.md#9-riscos',
  },
  {
    id: 'comportamental',
    title: 'Finanças Comportamentais',
    weight: 'Vieses e comportamento',
    description: 'Principais vieses que afetam decisões e o atendimento a clientes.',
    focus: [
      'Ancoragem, disponibilidade e excesso de confiança',
      'Aversão à perda e efeito manada',
      'Como endereçar vieses em recomendações',
    ],
    checklist: [
      'Consegue dar exemplo prático de cada viés',
      'Sabe como o viés afeta suitability',
      'Aplica técnicas para neutralizar decisões emocionais',
    ],
    numbers: ['Vieses: ancoragem, disponibilidade, manada'],
    link: '../estudos/resumo-executivo-temas.md#10-financas-comportamentais',
  },
];

const checklistItems = [
  '3 fases da lavagem de dinheiro',
  'Funções de CMN, BACEN e CVM',
  'Percentuais mínimos dos fundos (RF, Ações, Cambial)',
  'Datas e alíquotas do come-cotas',
  'Produtos cobertos e limites do FGC',
  'Diferenças entre PGBL e VGBL',
  'Isenção em LCI/LCA/CRI/CRA',
  'Diferença entre ações ON e PN',
  'Tratamento de dividendos e JCP',
  'Titular versus lançador em opções',
];

const storageKey = 'cpa20-tracker-v1';
const defaultQuestionSource = {
  label: 'conjunto padrão',
  type: 'json',
  path: '../data/questions/questions-sample.json',
};

const revisionQuestionSource = {
  label: 'modo revisão',
  type: 'csv',
  path: '../dados/questoes_para_revisao.csv',
};

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseCsvContent(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines.length) return [];

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce((acc, header, idx) => {
      acc[header] = values[idx] ?? '';
      return acc;
    }, {});
  });
}

function normalizeQuestion(data) {
  const alternativas =
    data.alternativas ||
    ['alternativa_a', 'alternativa_b', 'alternativa_c', 'alternativa_d']
      .map((key) => data[key])
      .filter(Boolean);

  const correta = (() => {
    if (typeof data.resposta_correta === 'number') return data.resposta_correta;
    const numeric = Number(data.resposta_correta);
    if (Number.isFinite(numeric) && data.resposta_correta !== '') return numeric;
    const letter = (data.correta || '').toString().trim().toUpperCase();
    const index = ['A', 'B', 'C', 'D'].indexOf(letter);
    return index >= 0 ? index : null;
  })();

  return {
    id: data.id,
    tema: data.tema || data.topic || '',
    enunciado: data.enunciado || data.pergunta || data.question || '',
    alternativas,
    correta,
    dificuldade: data.nivel || data.dificuldade || '',
    taxaErro:
      data.taxa_erro === undefined || data.taxa_erro === ''
        ? null
        : Number(data.taxa_erro),
  };
}

function renderQuestionList(questions, contextLabel) {
  const statusEl = document.getElementById('questionStatus');
  const listEl = document.getElementById('questionList');

  if (!questions.length) {
    statusEl.textContent = `Nenhuma questão carregada para ${contextLabel}.`;
    listEl.innerHTML = '';
    return;
  }

  statusEl.textContent = `${questions.length} questões carregadas (${contextLabel}).`;

  listEl.innerHTML = questions
    .map((q) => {
      const alternativas = (q.alternativas || []).map(
        (alt, idx) => `<li>${String.fromCharCode(65 + idx)}) ${alt}</li>`,
      );

      const meta = [
        q.tema && `<span class="pill">Tema: ${q.tema}</span>`,
        q.dificuldade && `<span class="pill">Nível: ${q.dificuldade}</span>`,
        Number.isFinite(q.taxaErro) && `<span class="pill">Taxa de erro: ${(Number(q.taxaErro) * 100).toFixed(0)}%</span>`,
      ]
        .filter(Boolean)
        .join('');

      return `
        <article class="question-card">
          <div class="question-meta">${meta}</div>
          <h4>${q.enunciado}</h4>
          <ul>${alternativas.join('')}</ul>
        </article>
      `;
    })
    .join('');
}

async function loadQuestionBank(source) {
  const statusEl = document.getElementById('questionStatus');
  const listEl = document.getElementById('questionList');
  statusEl.textContent = `Carregando ${source.label}...`;
  listEl.innerHTML = '';

  try {
    const response = await fetch(source.path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    let questions = [];

    if (source.type === 'json') {
      questions = JSON.parse(text).map(normalizeQuestion);
    } else {
      const rows = parseCsvContent(text);
      questions = rows.map(normalizeQuestion);
    }

    renderQuestionList(questions, source.label);
  } catch (err) {
    statusEl.textContent = `Não foi possível carregar ${source.label}: ${err.message}`;
  }
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return saved;
  } catch (err) {
    console.error('Erro ao carregar progresso', err);
    return {};
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

  const loadRevision = () => loadQuestionBank(revisionQuestionSource);
  document.getElementById('revisionModeBtn').addEventListener('click', loadRevision);
  document.getElementById('revisionQuestionsBtn').addEventListener('click', loadRevision);
  document
    .getElementById('defaultQuestionsBtn')
    .addEventListener('click', () => loadQuestionBank(defaultQuestionSource));

  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Apagar progresso salvo?')) {
      localStorage.removeItem(storageKey);
      window.location.reload();
    }
  });
}

function init() {
  const state = loadState();
  bindActions(state);
  renderStats(state);
  renderTopics(state);
  renderChecklist(state);
  loadQuestionBank(defaultQuestionSource);
}

document.addEventListener('DOMContentLoaded', init);

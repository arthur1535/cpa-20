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

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return saved;
  } catch (err) {
    console.error('Erro ao carregar progresso', err);
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function classify(score) {
  if (score >= 80) return { label: 'Forte', className: 'badge--strong' };
  if (score >= 50) return { label: 'Em progresso', className: 'badge--medium' };
  return { label: 'Precisa reforço', className: 'badge--weak' };
}

function renderStats(state) {
  const statsEl = document.getElementById('overviewStats');
  const scores = topics.map((t) => state[t.id]?.score ?? 40);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const weak = scores.filter((s) => s < 50).length;
  const medium = scores.filter((s) => s >= 50 && s < 80).length;
  const strong = scores.filter((s) => s >= 80).length;

  statsEl.innerHTML = `
    <div class="stat">
      <div class="stat__label">Confiança média</div>
      <div class="stat__value">${avg}%</div>
    </div>
    <div class="stat stat--bad">
      <div class="stat__label">Precisa reforço</div>
      <div class="stat__value">${weak}</div>
    </div>
    <div class="stat stat--warn">
      <div class="stat__label">Em progresso</div>
      <div class="stat__value">${medium}</div>
    </div>
    <div class="stat stat--good">
      <div class="stat__label">Fortes</div>
      <div class="stat__value">${strong}</div>
    </div>
  `;
}

function renderTopics(state) {
  const grid = document.getElementById('topicGrid');
  const showWeak = document.getElementById('showOnlyWeak').checked;
  const showMedium = document.getElementById('showOnlyMedium').checked;

  grid.innerHTML = '';

  topics.forEach((topic) => {
    const topicState = state[topic.id] || { score: 40, notes: '' };
    const { label, className } = classify(topicState.score);

    if (showWeak && topicState.score >= 50) return;
    if (showMedium && (topicState.score < 50 || topicState.score >= 80)) return;

    const card = document.createElement('article');
    card.className = 'topic-card';

    card.innerHTML = `
      <div class="topic-card__header">
        <div>
          <p class="tag">${topic.weight}</p>
          <h3>${topic.title}</h3>
          <p>${topic.description}</p>
        </div>
        <div class="meta">
          <span class="badge ${className}">${label}</span>
        </div>
      </div>
      <div class="meta">Pontos críticos: ${topic.focus.join(' · ')}</div>
      <ul class="list">${topic.focus.map((f) => `<li>${f}</li>`).join('')}</ul>
      <div class="meta">Números-chave: ${topic.numbers.join(' • ')}</div>
      <a class="resource-link" href="${topic.link}">Rever no material</a>
      <div class="control">
        <div class="slider-row">
          <label for="score-${topic.id}">Confiança</label>
          <input type="range" min="0" max="100" step="5" id="score-${topic.id}" value="${topicState.score}" />
          <span class="value-chip" id="value-${topic.id}">${topicState.score}%</span>
        </div>
        <textarea class="notes" id="notes-${topic.id}" placeholder="Notas rápidas, pontos fracos, gatilhos de revisão...">${topicState.notes || ''}</textarea>
      </div>
    `;

    grid.appendChild(card);

    const slider = card.querySelector(`#score-${topic.id}`);
    const valueChip = card.querySelector(`#value-${topic.id}`);
    const notes = card.querySelector(`#notes-${topic.id}`);

    slider.addEventListener('input', () => {
      const score = Number(slider.value);
      valueChip.textContent = `${score}%`;
      state[topic.id] = { ...(state[topic.id] || {}), score };
      saveState(state);
      renderStats(state);
      renderTopics(state);
    });

    notes.addEventListener('change', () => {
      state[topic.id] = { ...(state[topic.id] || {}), notes: notes.value };
      saveState(state);
    });
  });
}

function renderChecklist(state) {
  const board = document.getElementById('checklistBoard');
  const saved = state.checklist || {};
  board.innerHTML = '';

  checklistItems.forEach((item, idx) => {
    const row = document.createElement('label');
    row.className = 'checklist-item';
    const id = `chk-${idx}`;
    const checked = Boolean(saved[id]);
    row.innerHTML = `
      <input type="checkbox" id="${id}" ${checked ? 'checked' : ''}/>
      <span>${item}</span>
    `;

    row.querySelector('input').addEventListener('change', (e) => {
      saved[id] = e.target.checked;
      state.checklist = saved;
      saveState(state);
    });

    board.appendChild(row);
  });
}

function bindActions(state) {
  document.getElementById('focusWeakBtn').addEventListener('click', () => {
    document.getElementById('showOnlyWeak').checked = true;
    document.getElementById('showOnlyMedium').checked = false;
    renderTopics(state);
  });

  document.getElementById('showOnlyWeak').addEventListener('change', () => renderTopics(state));
  document.getElementById('showOnlyMedium').addEventListener('change', () => renderTopics(state));

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
}

document.addEventListener('DOMContentLoaded', init);

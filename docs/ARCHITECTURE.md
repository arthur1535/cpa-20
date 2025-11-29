# Arquitetura proposta

A organização foi pensada em torno de quatro pilares: banco de questões, simulador em terminal, interface web de quiz e análises de desempenho.

## Visão geral de pastas

- `data/questions/`
  - `questions-sample.json`: modelo de banco de questões em JSON. Adicionar mais arquivos por disciplina/nível.
- `cli/`
  - `simulator.py`: script de terminal que carrega o banco de questões e executa quizzes rápidos.
  - `README.md`: instruções de uso e contribuição.
- `web/`
  - Interface estática existente (radar de estudos). Reservar subpasta futura `web/quiz/` caso o quiz web seja separado.
  - `README.md`: descreve como servir e estender a interface de quiz.
- `scripts/analytics/`
  - `performance_template.py`: script base para ingestão de resultados e geração de estatísticas.
  - `README.md`: orientações para uso e extensão.
- `docs/`
  - Documentação de arquitetura e design.
- `estudos/`
  - Conteúdo teórico já produzido (resumos, flashcards, cronogramas).

## Fluxo de dados

1. **Questões**: mantidas em `data/questions/*.json` seguindo o esquema descrito abaixo.
2. **Simulador de terminal** (`cli/simulator.py`): lê o JSON, seleciona questões aleatórias, calcula pontuação e grava um log de sessão.
3. **Interface web** (`web/`): pode consumir o mesmo JSON via fetch ou build estático para exibir quizzes no navegador.
4. **Análises** (`scripts/analytics/`): consomem logs de simulados (ex.: `storage/sessions/*.jsonl`) para gerar métricas e gráficos.

## Modelo de questão (JSON)

```json
{
  "id": "fundos-001",
  "tema": "Fundos de Investimento",
  "enunciado": "Qual é a periodicidade do come-cotas?",
  "alternativas": [
    "Mensal",
    "Semestral (maio e novembro)",
    "Anual",
    "A cada trimestre"
  ],
  "resposta_correta": 1,
  "explicacao": "O come-cotas incide duas vezes por ano: maio e novembro.",
  "dificuldade": "facil",
  "fonte": "Apostila CPA-20"
}
```

## Convenções

- Use `snake-case` para IDs de questões e arquivos.
- Inclua `explicacao` para reforçar feedback ao aluno.
- Mantenha pesos/estatísticas em scripts de análise, não dentro do modelo de questão.
- Logs de sessão podem ser guardados em `storage/sessions/YYYYMMDD-HHMM.jsonl` (não versionados).

## Próximos passos sugeridos

- Conectar o web quiz a um endpoint simples (FastAPI/Flask) que sirva `questions-sample.json`.
- Adicionar exportação do simulador para CSV com desempenho por tema.
- Criar testes automatizados para validar integridade do banco de questões (IDs únicos, índices válidos).

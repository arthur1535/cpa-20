# Análises de desempenho

Scripts para medir progresso e identificar temas com menor taxa de acerto.

## Fluxo sugerido

1. Rodar simulados via `cli/simulator.py` com `--log storage/sessions/YYYYMMDD.jsonl`.
2. Usar `performance_template.py` para ler os logs e gerar estatísticas por tema.

## Requisitos

- Python 3.9+
- Bibliotecas padrão (json, collections). Pode-se adicionar `pandas`/`matplotlib` conforme necessidade.

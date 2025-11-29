# Simulador de questões no terminal

Ferramenta rápida para praticar questões da CPA-20 direto no terminal.

## Uso rápido

```bash
python cli/simulator.py --questions data/questions/questions-sample.json --total 3
```

Opções principais:

- `--questions`: caminho para um arquivo JSON seguindo o modelo descrito em `docs/ARCHITECTURE.md`.
- `--total`: número de questões a sortear (padrão: 5).
- `--log`: caminho opcional para registrar resultados em JSONL (ex.: `storage/sessions/2024-logs.jsonl`).

## Fluxo

1. Carrega o arquivo de questões e valida índices de respostas.
2. Sorteia questões aleatórias e interativas.
3. Ao final, exibe resumo de acertos e grava estatísticas se `--log` for fornecido.

"""Exemplo simples de agregação de resultados de simulados.

Esperado um arquivo JSONL onde cada linha corresponde ao resultado
retornado por `cli/simulator.py`. Exemplo:
{
  "respondidas": 5,
  "acertos": 4,
  "pontuacao": 80.0,
  "timestamp": "2024-05-01T12:00:00Z"
}
"""

import json
from collections import Counter
from pathlib import Path
from typing import Iterable, Dict


def read_sessions(log_path: Path) -> Iterable[Dict]:
    with log_path.open("r", encoding="utf-8") as f:
        for line in f:
            yield json.loads(line)


def summarize(log_path: Path) -> Dict[str, float]:
    sessions = list(read_sessions(log_path))
    if not sessions:
        return {"total_sessoes": 0, "media_pontuacao": 0.0}

    total = len(sessions)
    media = sum(s["pontuacao"] for s in sessions) / total
    distrib = Counter(round(s["pontuacao"] // 10 * 10) for s in sessions)
    return {
        "total_sessoes": total,
        "media_pontuacao": round(media, 2),
        "distribuicao_faixas": dict(distrib),
    }


def main() -> None:
    log_path = Path("storage/sessions/ultimo-log.jsonl")
    if not log_path.exists():
        print("Nenhum log encontrado em storage/sessions/ultimo-log.jsonl")
        return

    stats = summarize(log_path)
    print("Resumo de desempenho:")
    print(json.dumps(stats, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

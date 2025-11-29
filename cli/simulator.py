import argparse
import json
import random
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any


Question = Dict[str, Any]


def load_questions(path: Path) -> List[Question]:
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise ValueError("Arquivo de questões deve conter uma lista de objetos")

    for item in data:
        if not 0 <= item["resposta_correta"] < len(item.get("alternativas", [])):
            raise ValueError(f"Índice de resposta inválido na questão {item.get('id')}")
    return data


def ask_question(question: Question) -> bool:
    print("\n" + question["enunciado"])
    for idx, alt in enumerate(question["alternativas"]):
        print(f"  {idx + 1}. {alt}")

    while True:
        raw = input("Sua resposta (1-{n}): ".format(n=len(question["alternativas"])))
        if raw.isdigit():
            choice = int(raw) - 1
            if 0 <= choice < len(question["alternativas"]):
                break
        print("Entrada inválida. Digite o número da alternativa.")

    correct = choice == question["resposta_correta"]
    feedback = "✔️ Correto!" if correct else "❌ Incorreto."
    print(feedback)
    print(f"Explicação: {question.get('explicacao', 'Sem explicação disponível.')}")
    return correct


def run_quiz(questions: List[Question], total: int) -> Dict[str, Any]:
    selected = random.sample(questions, k=min(total, len(questions)))
    hits = 0
    for q in selected:
        if ask_question(q):
            hits += 1
    return {
        "respondidas": len(selected),
        "acertos": hits,
        "pontuacao": round(100 * hits / len(selected), 1),
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


def persist_log(log_path: Path, session: Dict[str, Any]) -> None:
    log_path.parent.mkdir(parents=True, exist_ok=True)
    with log_path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(session, ensure_ascii=False) + "\n")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Simulador de questões CPA-20")
    parser.add_argument("--questions", type=Path, default=Path("data/questions/questions-sample.json"),
                        help="Arquivo JSON com as questões")
    parser.add_argument("--total", type=int, default=5, help="Número de questões a sortear")
    parser.add_argument("--log", type=Path, help="Arquivo JSONL para registrar resultados (opcional)")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    questions = load_questions(args.questions)
    result = run_quiz(questions, args.total)
    print("\nResumo: {acertos}/{respondidas} acertos ({pontuacao}% )".format(**result))
    if args.log:
        persist_log(args.log, result)
        print(f"Sessão registrada em {args.log}")


if __name__ == "__main__":
    main()

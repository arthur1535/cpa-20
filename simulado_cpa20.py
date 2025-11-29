"""Simulador de questões da CPA-20 em modo terminal.

Requisitos principais:
- leitura do banco de questões em CSV
- filtros por tema e nível
- embaralhamento opcional
- registro das respostas no histórico
"""

from __future__ import annotations

import argparse
import csv
import random
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, List, Optional

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_DATASET = BASE_DIR / "dados" / "questoes_cpa20.csv"
HISTORICO_PATH = BASE_DIR / "dados" / "historico_respostas.csv"
REVISAO_DATASET = BASE_DIR / "dados" / "questoes_para_revisao.csv"

VALID_ALTERNATIVES = ("A", "B", "C", "D")


@dataclass
class Questao:
    id: str
    tema: str
    nivel: str
    enunciado: str
    alternativa_a: str
    alternativa_b: str
    alternativa_c: str
    alternativa_d: str
    correta: str

    @classmethod
    def from_row(cls, row: Dict[str, str]) -> Optional["Questao"]:
        required_fields = {
            "id",
            "tema",
            "nivel",
            "enunciado",
            "alternativa_a",
            "alternativa_b",
            "alternativa_c",
            "alternativa_d",
            "correta",
        }
        if not required_fields.issubset(row):
            return None

        correta = (row.get("correta") or "").strip().upper()
        if correta not in VALID_ALTERNATIVES:
            return None

        return cls(
            id=row.get("id", "").strip(),
            tema=row.get("tema", "").strip(),
            nivel=row.get("nivel", "").strip(),
            enunciado=row.get("enunciado", "").strip(),
            alternativa_a=row.get("alternativa_a", "").strip(),
            alternativa_b=row.get("alternativa_b", "").strip(),
            alternativa_c=row.get("alternativa_c", "").strip(),
            alternativa_d=row.get("alternativa_d", "").strip(),
            correta=correta,
        )

    def alternativas(self) -> Dict[str, str]:
        return {
            "A": self.alternativa_a,
            "B": self.alternativa_b,
            "C": self.alternativa_c,
            "D": self.alternativa_d,
        }


def parse_bool(value: str) -> bool:
    truthy = {"1", "true", "t", "yes", "y", "sim"}
    falsy = {"0", "false", "f", "no", "n", "nao", "não"}
    value_clean = value.strip().lower()
    if value_clean in truthy:
        return True
    if value_clean in falsy:
        return False
    raise argparse.ArgumentTypeError("Use true/false para o parâmetro --aleatorio.")


def carregar_questoes(caminho: Path) -> List[Questao]:
    if not caminho.exists():
        raise FileNotFoundError(f"Arquivo de questões não encontrado: {caminho}")

    questoes: List[Questao] = []
    with caminho.open("r", encoding="utf-8", newline="") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            questao = Questao.from_row(row)
            if questao:
                questoes.append(questao)

    if not questoes:
        raise ValueError("Nenhuma questão válida encontrada no arquivo informado.")

    return questoes


def filtrar_questoes(
    questoes: Iterable[Questao], tema: Optional[str], nivel: Optional[str]
) -> List[Questao]:
    tema_norm = tema.lower() if tema else None
    nivel_norm = nivel.lower() if nivel else None

    filtradas = []
    for q in questoes:
        if tema_norm and q.tema.lower() != tema_norm:
            continue
        if nivel_norm and q.nivel.lower() != nivel_norm:
            continue
        filtradas.append(q)
    return filtradas


def solicitar_resposta() -> str:
    while True:
        resposta = input("Sua resposta (A/B/C/D): ").strip().upper()
        if resposta in VALID_ALTERNATIVES:
            return resposta
        print("Entrada inválida. Digite apenas A, B, C ou D.")


def registrar_historico(respostas: List[Dict[str, str]]) -> None:
    HISTORICO_PATH.parent.mkdir(parents=True, exist_ok=True)
    escrever_header = not HISTORICO_PATH.exists()

    with HISTORICO_PATH.open("a", encoding="utf-8", newline="") as csvfile:
        campos = [
            "data_hora",
            "id_questao",
            "tema",
            "nivel",
            "gabarito",
            "resposta_usuario",
            "acerto",
        ]
        writer = csv.DictWriter(csvfile, fieldnames=campos)
        if escrever_header:
            writer.writeheader()
        writer.writerows(respostas)


def exibir_resumo(respostas: List[Dict[str, str]]) -> None:
    total = len(respostas)
    acertos = sum(1 for r in respostas if r["acerto"] is True)
    erros = total - acertos
    percentual = (acertos / total * 100) if total else 0

    print("\n===== Resumo do Simulado =====")
    print(f"Total de questões: {total}")
    print(f"Acertos: {acertos}")
    print(f"Erros: {erros}")
    print(f"Percentual de acerto: {percentual:.1f}%")

    acertos_por_tema: Dict[str, Dict[str, int]] = {}
    for r in respostas:
        tema = r.get("tema", "")
        acertos_por_tema.setdefault(tema, {"acertos": 0, "total": 0})
        acertos_por_tema[tema]["total"] += 1
        if r["acerto"] is True:
            acertos_por_tema[tema]["acertos"] += 1

    if acertos_por_tema:
        print("\nAcertos por tema:")
        for tema, dados in sorted(acertos_por_tema.items()):
            total_tema = dados["total"]
            acertos_tema = dados["acertos"]
            percentual_tema = (acertos_tema / total_tema * 100) if total_tema else 0
            print(
                f"- {tema}: {acertos_tema}/{total_tema} acertos "
                f"({percentual_tema:.1f}%)"
            )


def executar_simulado(questoes: List[Questao], quantidade: int, embaralhar: bool) -> List[Dict[str, str]]:
    questoes_selecionadas = list(questoes)
    if embaralhar:
        random.shuffle(questoes_selecionadas)

    questoes_selecionadas = questoes_selecionadas[:quantidade]
    respostas: List[Dict[str, str]] = []

    for indice, questao in enumerate(questoes_selecionadas, start=1):
        print("\n" + "-" * 40)
        print(f"Questão {indice}: {questao.enunciado}")
        for letra, texto in questao.alternativas().items():
            print(f"  {letra}) {texto}")

        resposta_usuario = solicitar_resposta()
        acerto = resposta_usuario == questao.correta

        if acerto:
            print("✔️  Resposta correta!")
        else:
            print(f"❌  Resposta incorreta. Gabarito: {questao.correta}")

        respostas.append(
            {
                "data_hora": datetime.now().isoformat(timespec="seconds"),
                "id_questao": questao.id,
                "tema": questao.tema,
                "nivel": questao.nivel,
                "gabarito": questao.correta,
                "resposta_usuario": resposta_usuario,
                "acerto": acerto,
            }
        )

    return respostas


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Simulador CPA-20 em terminal")
    parser.add_argument(
        "--qtd",
        type=int,
        default=20,
        help="Quantidade de questões do simulado (padrão: 20)",
    )
    parser.add_argument(
        "--tema",
        type=str,
        help="Filtrar por tema específico (opcional)",
    )
    parser.add_argument(
        "--nivel",
        type=str,
        choices=["basico", "intermediario", "avancado"],
        help="Filtrar por nível (basico/intermediario/avancado)",
    )
    parser.add_argument(
        "--aleatorio",
        type=parse_bool,
        default=True,
        help="Embaralhar questões (true/false). Padrão: true",
    )
    parser.add_argument(
        "--arquivo",
        type=Path,
        default=DEFAULT_DATASET,
        help="Caminho do CSV de questões",
    )
    parser.add_argument(
        "--revisao",
        action="store_true",
        help="Carrega apenas as questões mais erradas (dados/questoes_para_revisao.csv)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    dataset = REVISAO_DATASET if args.revisao else args.arquivo

    try:
        if args.revisao:
            print("Modo revisão ativado: carregando questões mais erradas.")
        questoes = carregar_questoes(dataset)
    except Exception as exc:  # noqa: BLE001 - feedback amigável
        if args.revisao and not dataset.exists():
            print(
                "Arquivo de revisão não encontrado. Gere-o com o script analise_desempenho.py"
            )
        print(f"Erro ao carregar questões: {exc}")
        return

    questoes_filtradas = filtrar_questoes(questoes, args.tema, args.nivel)
    if not questoes_filtradas:
        print("Nenhuma questão encontrada com os filtros aplicados.")
        return

    quantidade = min(args.qtd, len(questoes_filtradas)) if args.qtd > 0 else len(questoes_filtradas)
    if quantidade == 0:
        print("Quantidade de questões deve ser maior que zero.")
        return

    respostas = executar_simulado(questoes_filtradas, quantidade, args.aleatorio)
    exibir_resumo(respostas)

    try:
        registrar_historico(respostas)
    except Exception as exc:  # noqa: BLE001 - feedback amigável
        print(f"Não foi possível registrar o histórico de respostas: {exc}")
    else:
        print(f"Histórico salvo em: {HISTORICO_PATH}")


if __name__ == "__main__":
    main()

"""Script de análise de desempenho com base no histórico de respostas da CPA-20."""
from __future__ import annotations

import sys
from pathlib import Path
from typing import Dict

# Dependências opcionais
try:
    import pandas as pd
except ImportError as exc:  # pragma: no cover - dependência externa
    print(
        "Erro: o pacote 'pandas' é necessário para executar este script.\n"
        "Instale com `pip install pandas` e tente novamente.",
        file=sys.stderr,
    )
    raise SystemExit(1) from exc

# matplotlib é opcional para geração de gráficos
try:  # pragma: no cover - dependência externa
    import matplotlib.pyplot as plt
except ImportError:  # pragma: no cover - dependência externa
    plt = None


def carregar_historico(caminho: Path) -> pd.DataFrame:
    """Lê o CSV de histórico e retorna um DataFrame preparado.

    Args:
        caminho: caminho para o arquivo CSV.

    Raises:
        SystemExit: se o arquivo não existir ou estiver vazio.
    """
    if not caminho.exists():
        print(f"Arquivo não encontrado: {caminho}", file=sys.stderr)
        raise SystemExit(1)

    try:
        df = pd.read_csv(caminho)
    except Exception as exc:  # pragma: no cover - leitura robusta
        print(f"Não foi possível ler o arquivo {caminho}: {exc}", file=sys.stderr)
        raise SystemExit(1)

    if df.empty:
        print("O histórico está vazio. Responda algumas questões antes de gerar o relatório.", file=sys.stderr)
        raise SystemExit(1)

    if "acerto" not in df.columns:
        print("Coluna 'acerto' ausente no histórico.", file=sys.stderr)
        raise SystemExit(1)

    df = df.copy()
    df["acerto_bool"] = df["acerto"].map(lambda x: str(x).strip().lower() == "true")
    return df


def calcular_taxas(df: pd.DataFrame) -> Dict[str, object]:
    """Calcula estatísticas de acerto gerais e por grupos."""
    total = len(df)
    acertos = int(df["acerto_bool"].sum())
    taxa_geral = (acertos / total) * 100 if total else None

    por_tema = (
        df.groupby("tema")["acerto_bool"].mean().sort_values(ascending=False) * 100
        if "tema" in df.columns
        else pd.Series(dtype=float)
    )
    por_nivel = (
        df.groupby("nivel")["acerto_bool"].mean().sort_values(ascending=False) * 100
        if "nivel" in df.columns
        else pd.Series(dtype=float)
    )

    return {
        "total": total,
        "acertos": acertos,
        "taxa_geral": taxa_geral,
        "por_tema": por_tema,
        "por_nivel": por_nivel,
    }


def gerar_relatorio(destino: Path, stats: Dict[str, object]) -> None:
    conteudo = [
        "Resumo de desempenho CPA-20",
        "============================",
        f"Total de questões respondidas: {stats['total']}",
        f"Acertos: {stats['acertos']}",
        f"Taxa de acerto geral: {stats['taxa_geral']:.2f}%" if stats["taxa_geral"] is not None else "Taxa de acerto geral: N/A",
        "",
        "Taxa de acerto por tema:",
    ]

    if stats["por_tema"].empty:
        conteudo.append("  (sem dados)")
    else:
        conteudo.extend([f"  - {tema}: {valor:.2f}%" for tema, valor in stats["por_tema"].items()])

    conteudo.append("")
    conteudo.append("Taxa de acerto por nível:")

    if stats["por_nivel"].empty:
        conteudo.append("  (sem dados)")
    else:
        conteudo.extend([f"  - {nivel}: {valor:.2f}%" for nivel, valor in stats["por_nivel"].items()])

    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text("\n".join(conteudo), encoding="utf-8")


def exibir_resumo(stats: Dict[str, object]) -> None:
    print("Resumo de desempenho")
    print("-" * 24)
    print(f"Total respondidas: {stats['total']}")
    print(f"Acertos: {stats['acertos']}")
    if stats["taxa_geral"] is not None:
        print(f"Taxa de acerto geral: {stats['taxa_geral']:.2f}%")
    else:
        print("Taxa de acerto geral: N/A")

    print("\nTaxa de acerto por tema:")
    if stats["por_tema"].empty:
        print("  (sem dados)")
    else:
        for tema, valor in stats["por_tema"].items():
            print(f"  - {tema}: {valor:.2f}%")

    print("\nTaxa de acerto por nível:")
    if stats["por_nivel"].empty:
        print("  (sem dados)")
    else:
        for nivel, valor in stats["por_nivel"].items():
            print(f"  - {nivel}: {valor:.2f}%")


def salvar_graficos(stats: Dict[str, object], pasta: Path) -> None:
    if plt is None:
        print("matplotlib não disponível; gráficos não serão gerados.")
        return

    pasta.mkdir(parents=True, exist_ok=True)

    if not stats["por_tema"].empty:
        fig, ax = plt.subplots()
        stats["por_tema"].plot(kind="bar", ax=ax, color="#4C8BFF")
        ax.set_ylabel("Taxa de acerto (%)")
        ax.set_title("Acerto por tema")
        ax.set_ylim(0, 100)
        fig.tight_layout()
        fig.savefig(pasta / "acertos_por_tema.png")
        plt.close(fig)

    if not stats["por_nivel"].empty:
        fig, ax = plt.subplots()
        stats["por_nivel"].plot(kind="bar", ax=ax, color="#3BB273")
        ax.set_ylabel("Taxa de acerto (%)")
        ax.set_title("Acerto por nível")
        ax.set_ylim(0, 100)
        fig.tight_layout()
        fig.savefig(pasta / "acertos_por_nivel.png")
        plt.close(fig)


def main() -> None:
    base_dir = Path(__file__).parent
    caminho_historico = base_dir / "dados" / "historico_respostas.csv"

    df = carregar_historico(caminho_historico)
    stats = calcular_taxas(df)

    exibir_resumo(stats)

    relatorio_path = base_dir / "relatorios" / "resumo_desempenho.txt"
    gerar_relatorio(relatorio_path, stats)

    salvar_graficos(stats, relatorio_path.parent)


if __name__ == "__main__":
    main()

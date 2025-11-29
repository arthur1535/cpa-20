import argparse
import csv
import json
from pathlib import Path
from typing import Dict, Iterable, List, Optional

SAMPLE_QUESTIONS: List[Dict[str, str]] = [
    {
        "id": "sample-fundos-001",
        "tema": "fundos",
        "nivel": "basico",
        "enunciado": "Qual é o objetivo principal de um fundo DI?",
        "alternativa_a": "Replicar a variação do CDI investindo em títulos públicos de curto prazo",
        "alternativa_b": "Alcançar ganhos com ações de empresas de crescimento",
        "alternativa_c": "Maximizar retornos por meio de derivativos de alto risco",
        "alternativa_d": "Investir apenas em debêntures incentivadas de infraestrutura",
        "correta": "A",
        "fonte": "simulado_exemplo",
    },
    {
        "id": "sample-renda-fixa-001",
        "tema": "renda_fixa",
        "nivel": "basico",
        "enunciado": "Qual é a característica principal de um título prefixado do Tesouro Direto?",
        "alternativa_a": "Remuneração atrelada ao IPCA",
        "alternativa_b": "Remuneração conhecida no momento da aplicação",
        "alternativa_c": "Rentabilidade variável conforme o CDI",
        "alternativa_d": "Isenção total de imposto de renda",
        "correta": "B",
        "fonte": "simulado_exemplo",
    },
    {
        "id": "sample-pld-001",
        "tema": "pld",
        "nivel": "intermediario",
        "enunciado": "Qual documento comprova a diligência na identificação do beneficiário final?",
        "alternativa_a": "Termo de confidencialidade do cliente",
        "alternativa_b": "Contrato social atualizado ou documentação equivalente",
        "alternativa_c": "Comprovante de residência do administrador",
        "alternativa_d": "Declaração anual de imposto de renda",
        "correta": "B",
        "fonte": "material_treinamento",
    },
    {
        "id": "sample-tributacao-001",
        "tema": "tributacao",
        "nivel": "intermediario",
        "enunciado": "Qual é a alíquota de IOF para resgates em aplicações de renda fixa realizados no mesmo dia da aplicação?",
        "alternativa_a": "0%",
        "alternativa_b": "3% sobre o rendimento",
        "alternativa_c": "6% sobre o rendimento",
        "alternativa_d": "99% sobre o rendimento",
        "correta": "D",
        "fonte": "material_treinamento",
    },
    {
        "id": "sample-previdencia-001",
        "tema": "previdencia",
        "nivel": "intermediario",
        "enunciado": "Na tabela regressiva do PGBL, qual é a alíquota de IR após 10 anos de aplicação?",
        "alternativa_a": "35%",
        "alternativa_b": "20%",
        "alternativa_c": "15%",
        "alternativa_d": "10%",
        "correta": "D",
        "fonte": "manual_previdencia",
    },
    {
        "id": "sample-suitability-001",
        "tema": "suitability",
        "nivel": "basico",
        "enunciado": "Qual fator NÃO faz parte do processo de suitability?",
        "alternativa_a": "Objetivos de investimento",
        "alternativa_b": "Perfil de risco",
        "alternativa_c": "Prazo de investimento",
        "alternativa_d": "Escolha do gerente responsável",
        "correta": "D",
        "fonte": "manual_comercial",
    },
    {
        "id": "sample-compliance-001",
        "tema": "compliance",
        "nivel": "intermediario",
        "enunciado": "Qual é o canal recomendado para reporte de desvios éticos?",
        "alternativa_a": "Contato informal com colegas",
        "alternativa_b": "Linha ética ou canal de denúncias independente",
        "alternativa_c": "Redes sociais da instituição",
        "alternativa_d": "Comunicação direta com o cliente",
        "correta": "B",
        "fonte": "codigo_conduta",
    },
    {
        "id": "sample-cambial-001",
        "tema": "cambial",
        "nivel": "intermediario",
        "enunciado": "O que é hedge cambial em um fundo multimercado?",
        "alternativa_a": "Estratégia de potencializar ganhos com exposição em moeda estrangeira",
        "alternativa_b": "Proteção para reduzir impactos da variação cambial",
        "alternativa_c": "Obrigação de investir 100% no exterior",
        "alternativa_d": "Mecanismo para eliminar a marcação a mercado",
        "correta": "B",
        "fonte": "simulado_exemplo",
    },
    {
        "id": "sample-derivativos-001",
        "tema": "derivativos",
        "nivel": "avancado",
        "enunciado": "Qual instrumento é mais adequado para travar o preço futuro de uma commodity?",
        "alternativa_a": "Swap de taxas de juros",
        "alternativa_b": "Opção de compra",
        "alternativa_c": "Contrato futuro",
        "alternativa_d": "Debênture conversível",
        "correta": "C",
        "fonte": "material_derivativos",
    },
    {
        "id": "sample-renda-variavel-001",
        "tema": "renda_variavel",
        "nivel": "intermediario",
        "enunciado": "Qual é a principal diferença entre ações ordinárias e preferenciais no Brasil?",
        "alternativa_a": "Preferenciais sempre têm voto, ordinárias não",
        "alternativa_b": "Ordinárias garantem voto, preferenciais priorizam dividendos",
        "alternativa_c": "Preferenciais são isentas de IR, ordinárias não",
        "alternativa_d": "Ordinárias são negociadas apenas no mercado de balcão",
        "correta": "B",
        "fonte": "material_rv",
    },
    {
        "id": "sample-liquidacao-001",
        "tema": "liquidacao",
        "nivel": "basico",
        "enunciado": "Qual é o prazo padrão de liquidação financeira de uma operação com ações à vista (D+)?",
        "alternativa_a": "D+0",
        "alternativa_b": "D+1",
        "alternativa_c": "D+2",
        "alternativa_d": "D+3",
        "correta": "C",
        "fonte": "manual_operacional",
    },
    {
        "id": "sample-risco-001",
        "tema": "gestao_de_risco",
        "nivel": "intermediario",
        "enunciado": "Qual indicador mede a perda máxima projetada de uma carteira em determinado horizonte e nível de confiança?",
        "alternativa_a": "Sharpe",
        "alternativa_b": "VaR",
        "alternativa_c": "Tracking Error",
        "alternativa_d": "Beta",
        "correta": "B",
        "fonte": "material_risco",
    },
    {
        "id": "sample-cri-001",
        "tema": "securitizacao",
        "nivel": "intermediario",
        "enunciado": "Um CRA é lastreado em recebíveis de qual setor?",
        "alternativa_a": "Imobiliário",
        "alternativa_b": "Agronegócio",
        "alternativa_c": "Infraestrutura",
        "alternativa_d": "Setor público",
        "correta": "B",
        "fonte": "material_credito",
    },
    {
        "id": "sample-fundos-002",
        "tema": "fundos",
        "nivel": "avancado",
        "enunciado": "Qual dispositivo limita o número de cotistas a partir do qual um fundo pode ser considerado exclusivo?",
        "alternativa_a": "Regulamento do fundo",
        "alternativa_b": "Contrato de administração",
        "alternativa_c": "Instrução da CVM",
        "alternativa_d": "Ata de assembleia de cotistas",
        "correta": "C",
        "fonte": "norma_cvm",
    },
    {
        "id": "sample-renda-fixa-002",
        "tema": "renda_fixa",
        "nivel": "intermediario",
        "enunciado": "Qual risco é mais associado a debêntures de infraestrutura?",
        "alternativa_a": "Risco de crédito do emissor",
        "alternativa_b": "Risco de liquidez derivado da isenção fiscal",
        "alternativa_c": "Risco cambial elevado",
        "alternativa_d": "Ausência de marcação a mercado",
        "correta": "A",
        "fonte": "simulado_exemplo",
    },
    {
        "id": "sample-pld-002",
        "tema": "pld",
        "nivel": "basico",
        "enunciado": "Qual comportamento é considerado alerta de lavagem de dinheiro em operações de investimento?",
        "alternativa_a": "Aplicações recorrentes compatíveis com renda",
        "alternativa_b": "Resgates e aportes fracionados para evitar reporte",
        "alternativa_c": "Atualização cadastral anual",
        "alternativa_d": "Assinatura de termo de ciência de risco",
        "correta": "B",
        "fonte": "material_pld",
    },
    {
        "id": "sample-tributacao-002",
        "tema": "tributacao",
        "nivel": "basico",
        "enunciado": "Qual é a alíquota inicial de IR na tabela regressiva de fundos de curto prazo?",
        "alternativa_a": "15%",
        "alternativa_b": "20%",
        "alternativa_c": "22,5%",
        "alternativa_d": "25%",
        "correta": "C",
        "fonte": "manual_fundos",
    },
    {
        "id": "sample-previdencia-002",
        "tema": "previdencia",
        "nivel": "avancado",
        "enunciado": "No VGBL, qual é a base de cálculo do IR no resgate?",
        "alternativa_a": "Todo o saldo acumulado",
        "alternativa_b": "Apenas os aportes realizados",
        "alternativa_c": "Somente os rendimentos",
        "alternativa_d": "Metade do saldo",
        "correta": "C",
        "fonte": "manual_previdencia",
    },
    {
        "id": "sample-governanca-001",
        "tema": "governanca",
        "nivel": "intermediario",
        "enunciado": "Qual órgão interno costuma aprovar a política de risco de uma instituição financeira?",
        "alternativa_a": "Conselho de administração",
        "alternativa_b": "Comitê de auditoria externa",
        "alternativa_c": "Ouvidoria",
        "alternativa_d": "Área de operações",
        "correta": "A",
        "fonte": "codigo_governanca",
    },
    {
        "id": "sample-anbima-001",
        "tema": "autorregulacao",
        "nivel": "basico",
        "enunciado": "Qual é o objetivo principal dos códigos ANBIMA de regulação?",
        "alternativa_a": "Substituir a legislação federal",
        "alternativa_b": "Estabelecer boas práticas e padrões para o mercado",
        "alternativa_c": "Aumentar a carga tributária sobre fundos",
        "alternativa_d": "Definir limites de crédito para bancos públicos",
        "correta": "B",
        "fonte": "codigo_anbima",
    },
    {
        "id": "sample-esg-001",
        "tema": "esg",
        "nivel": "intermediario",
        "enunciado": "Qual fator ESG está associado à gestão de resíduos e eficiência energética?",
        "alternativa_a": "Social",
        "alternativa_b": "Governança",
        "alternativa_c": "Ambiental",
        "alternativa_d": "Controle interno",
        "correta": "C",
        "fonte": "material_esg",
    },
]


def normalize_tema(raw_tema: Optional[str]) -> str:
    if not raw_tema:
        return "indefinido"
    return raw_tema.strip().lower().replace(" ", "_")


def map_dificuldade_to_nivel(raw: Optional[str]) -> str:
    if not raw:
        return "intermediario"
    normalized = raw.strip().lower()
    mapping = {
        "facil": "basico",
        "fácil": "basico",
        "basico": "basico",
        "básico": "basico",
        "media": "intermediario",
        "média": "intermediario",
        "intermediario": "intermediario",
        "intermediário": "intermediario",
        "dificil": "avancado",
        "difícil": "avancado",
        "avancado": "avancado",
        "avançado": "avancado",
    }
    return mapping.get(normalized, "intermediario")


def to_letter(value) -> str:
    letters = ["A", "B", "C", "D"]
    if isinstance(value, str):
        upper = value.strip().upper()
        if upper in letters:
            return upper
        try:
            value = int(upper)
        except ValueError:
            return ""
    if isinstance(value, int) and 0 <= value < len(letters):
        return letters[value]
    return ""


def convert_question(raw: Dict) -> Dict[str, str]:
    alternativas: Iterable[str] = raw.get("alternativas", []) or []
    alt_list = list(alternativas) + [""] * (4 - len(alternativas))
    correta_letter = to_letter(raw.get("resposta_correta"))
    return {
        "id": str(raw.get("id", "")).strip() or "sem-id",
        "tema": normalize_tema(raw.get("tema")),
        "nivel": map_dificuldade_to_nivel(raw.get("dificuldade")),
        "enunciado": str(raw.get("enunciado", "")).strip(),
        "alternativa_a": alt_list[0],
        "alternativa_b": alt_list[1],
        "alternativa_c": alt_list[2],
        "alternativa_d": alt_list[3],
        "correta": correta_letter,
        "fonte": str(raw.get("fonte", "desconhecida")).strip() or "desconhecida",
    }


def load_questions_from_json(path: Path) -> List[Dict[str, str]]:
    with path.open("r", encoding="utf-8") as fp:
        data = json.load(fp)
    if not isinstance(data, list):
        return []
    return [convert_question(item) for item in data]


def gather_questions(inputs: List[Path]) -> List[Dict[str, str]]:
    converted: Dict[str, Dict[str, str]] = {}
    for input_path in inputs:
        if input_path.is_file() and input_path.suffix == ".json":
            for question in load_questions_from_json(input_path):
                converted[question["id"]] = question
    return list(converted.values())


def write_csv(output_path: Path, questions: Iterable[Dict[str, str]]) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "id",
        "tema",
        "nivel",
        "enunciado",
        "alternativa_a",
        "alternativa_b",
        "alternativa_c",
        "alternativa_d",
        "correta",
        "fonte",
    ]
    with output_path.open("w", encoding="utf-8", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for question in questions:
            writer.writerow({key: question.get(key, "") for key in fieldnames})


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Converte bancos de questões existentes para o formato padronizado CSV."
    )
    parser.add_argument(
        "--input",
        dest="inputs",
        action="append",
        type=Path,
        default=[],
        help="Arquivos ou diretórios contendo questões em JSON no formato antigo.",
    )
    parser.add_argument(
        "--output",
        dest="output",
        type=Path,
        default=Path("dados/questoes_cpa20.csv"),
        help="Caminho do CSV de saída padronizado.",
    )
    parser.add_argument(
        "--include-sample",
        action="store_true",
        help="Inclui o conjunto de questões fictícias de exemplo no CSV final.",
    )
    args = parser.parse_args()

    input_paths: List[Path] = []
    if not args.inputs:
        default_dir = Path("data/questions")
        if default_dir.exists():
            input_paths.extend(sorted(default_dir.glob("*.json")))
    else:
        for entry in args.inputs:
            if entry.is_dir():
                input_paths.extend(sorted(entry.glob("*.json")))
            elif entry.is_file():
                input_paths.append(entry)

    converted_questions = gather_questions(input_paths)

    if args.include_sample:
        for sample in SAMPLE_QUESTIONS:
            converted_questions.append(sample)

    # Ordena por id para facilitar conferência e reprodutibilidade
    converted_questions.sort(key=lambda item: item.get("id", ""))

    write_csv(args.output, converted_questions)
    print(f"Arquivo CSV gerado em: {args.output}")
    print(f"Total de questões exportadas: {len(converted_questions)}")


if __name__ == "__main__":
    main()

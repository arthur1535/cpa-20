"""
Script para extrair questões de imagens de simulados CPA-20.

REQUISITOS:
1. Instalar Tesseract OCR: 
   - Windows: https://github.com/UB-Mannheim/tesseract/wiki
   - Adicionar ao PATH ou definir pytesseract.pytesseract.tesseract_cmd
   
2. Instalar pacotes Python:
   pip install pytesseract Pillow

USO:
   python scripts/extrair_questoes_imagens.py
"""

import os
import re
import json
from pathlib import Path

try:
    import pytesseract
    from PIL import Image
except ImportError:
    print("Instale os pacotes: pip install pytesseract Pillow")
    exit(1)

# Configuração do Tesseract no Windows
TESSERACT_PATHS = [
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
    r"C:\Tesseract-OCR\tesseract.exe",
]

for path in TESSERACT_PATHS:
    if os.path.exists(path):
        pytesseract.pytesseract.tesseract_cmd = path
        break

# Diretórios
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
IMAGES_DIR = PROJECT_DIR / "imagens"
OUTPUT_FILE = PROJECT_DIR / "web" / "questoes_cpa20.json"


def extrair_texto_imagem(image_path):
    """Extrai texto de uma imagem usando OCR."""
    try:
        img = Image.open(image_path)
        # Configuração para português
        texto = pytesseract.image_to_string(img, lang='por')
        return texto
    except Exception as e:
        print(f"Erro ao processar {image_path}: {e}")
        return ""


def classificar_tema(texto):
    """Tenta identificar o tema da questão pelo conteúdo."""
    texto_lower = texto.lower()
    
    if any(p in texto_lower for p in ['fundo', 'cota', 'come-cotas', 'administrador', 'gestor', 'custodiante']):
        return 'fundos'
    elif any(p in texto_lower for p in ['lavagem', 'coaf', 'pld', 'compliance', 'insider', 'suitability']):
        return 'pld'
    elif any(p in texto_lower for p in ['lft', 'ltn', 'ntn', 'cdb', 'lci', 'lca', 'debênture', 'fgc', 'tesouro']):
        return 'renda_fixa'
    elif any(p in texto_lower for p in ['ação', 'ações', 'dividendo', 'day trade', 'fii', 'bolsa']):
        return 'renda_variavel'
    elif any(p in texto_lower for p in ['pgbl', 'vgbl', 'previdência', 'aposentadoria']):
        return 'previdencia'
    elif any(p in texto_lower for p in ['ir ', 'imposto', 'tribut', 'iof', 'alíquota']):
        return 'tributacao'
    else:
        return 'outros'


def parsear_questao(texto, num_questao):
    """Tenta extrair estrutura da questão do texto."""
    # Padrões comuns
    # Buscar enunciado (texto antes das alternativas)
    # Buscar alternativas (a), b), c), d) ou A), B), C), D))
    
    alternativas = []
    enunciado = ""
    
    # Tentar extrair alternativas
    padrao_alt = r'[(\[]?\s*([a-dA-D])\s*[)\]\.]\s*(.+?)(?=(?:[(\[]?\s*[a-dA-D]\s*[)\]\.])|$)'
    matches = re.findall(padrao_alt, texto, re.DOTALL)
    
    if matches:
        alternativas = [m[1].strip() for m in matches[:4]]
        # Enunciado é o texto antes da primeira alternativa
        primeiro_match = re.search(padrao_alt, texto)
        if primeiro_match:
            enunciado = texto[:primeiro_match.start()].strip()
    else:
        # Se não encontrou alternativas, usar o texto todo como enunciado
        enunciado = texto.strip()
    
    if not enunciado or len(enunciado) < 20:
        return None
    
    return {
        "id": f"img-{num_questao:03d}",
        "tema": classificar_tema(texto),
        "enunciado": enunciado[:500],  # Limitar tamanho
        "alternativas": alternativas if len(alternativas) == 4 else ["A", "B", "C", "D"],
        "resposta_correta": 0,  # Precisa ser preenchido manualmente
        "explicacao": "Questão extraída do simulado - revisar resposta correta"
    }


def processar_imagens():
    """Processa todas as imagens e extrai questões."""
    if not IMAGES_DIR.exists():
        print(f"Pasta de imagens não encontrada: {IMAGES_DIR}")
        return []
    
    imagens = sorted(IMAGES_DIR.glob("*.jpg"))
    print(f"Encontradas {len(imagens)} imagens")
    
    todas_questoes = []
    textos_brutos = []
    
    for i, img_path in enumerate(imagens, 1):
        print(f"Processando {i}/{len(imagens)}: {img_path.name}")
        
        texto = extrair_texto_imagem(img_path)
        if texto:
            textos_brutos.append({
                "arquivo": img_path.name,
                "texto": texto
            })
            
            # Tentar extrair questões
            # Dividir por números de questão (1., 2., etc)
            partes = re.split(r'\n\s*(\d{1,3})\s*[.)]\s*', texto)
            
            for j in range(1, len(partes), 2):
                if j + 1 < len(partes):
                    num = partes[j]
                    conteudo = partes[j + 1]
                    questao = parsear_questao(conteudo, int(num))
                    if questao:
                        todas_questoes.append(questao)
    
    # Salvar textos brutos para revisão manual
    textos_file = PROJECT_DIR / "dados" / "textos_extraidos.json"
    textos_file.parent.mkdir(exist_ok=True)
    with open(textos_file, 'w', encoding='utf-8') as f:
        json.dump(textos_brutos, f, ensure_ascii=False, indent=2)
    print(f"Textos brutos salvos em: {textos_file}")
    
    return todas_questoes


def salvar_questoes(questoes):
    """Salva questões no arquivo JSON."""
    # Carregar questões existentes
    existentes = []
    if OUTPUT_FILE.exists():
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            existentes = json.load(f)
    
    # Adicionar novas (evitar duplicatas por ID)
    ids_existentes = {q['id'] for q in existentes}
    novas = [q for q in questoes if q['id'] not in ids_existentes]
    
    todas = existentes + novas
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(todas, f, ensure_ascii=False, indent=2)
    
    print(f"Total de questões: {len(todas)} ({len(novas)} novas)")
    return todas


def main():
    print("=" * 50)
    print("EXTRATOR DE QUESTÕES - CPA-20")
    print("=" * 50)
    
    # Verificar Tesseract
    try:
        pytesseract.get_tesseract_version()
        print("✅ Tesseract OCR encontrado")
    except Exception:
        print("❌ Tesseract OCR não encontrado!")
        print("\nInstale em: https://github.com/UB-Mannheim/tesseract/wiki")
        print("Depois de instalar, execute este script novamente.")
        return
    
    questoes = processar_imagens()
    
    if questoes:
        salvar_questoes(questoes)
        print("\n✅ Extração concluída!")
        print("⚠️  IMPORTANTE: Revise as questões extraídas e corrija:")
        print("   - Respostas corretas (resposta_correta)")
        print("   - Enunciados truncados")
        print("   - Alternativas mal formatadas")
    else:
        print("\n⚠️  Nenhuma questão extraída. Verifique as imagens.")


if __name__ == "__main__":
    main()

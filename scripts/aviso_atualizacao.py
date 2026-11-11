"""Monta o comentário do aviso de atualização, que a publicação posta marcando a jogadora (o GitHub manda o email).

Uso (no workflow publicar):
    python scripts/aviso_atualizacao.py <comentarios-ja-postados.txt> <mensagem-do-commit.txt> <endereço da página> <sha>

Leva as novidades de dados/novidades.js que ainda não foram avisadas (cada uma deixa uma marca invisível no
comentário). Sem novidade nova, avisa com o título da mudança. Imprime o corpo do comentário.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


def carregar(arquivo: Path, prefixo: str) -> dict:
    texto = arquivo.read_text(encoding="utf-8").strip()
    return json.loads(texto[len(prefixo) : -1])


def titulo_da_mudanca(mensagem: str) -> str:
    """No merge de um PR, o assunto é "Merge pull request #N…" e o título do PR vem na linha seguinte."""
    linhas = [l.strip() for l in mensagem.splitlines() if l.strip()]
    if not linhas:
        return "o guia foi atualizado"
    if linhas[0].startswith("Merge pull request") and len(linhas) > 1:
        return linhas[1]
    return linhas[0]


def data_curta(d: str) -> str:
    return f"{d[8:10]}/{d[5:7]}" if len(d) == 10 else d


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[union-attr]
    ja_postados = Path(sys.argv[1]).read_text(encoding="utf-8-sig") if Path(sys.argv[1]).exists() else ""
    mensagem = Path(sys.argv[2]).read_text(encoding="utf-8-sig") if Path(sys.argv[2]).exists() else ""
    pagina, sha = sys.argv[3].rstrip("/") + "/", sys.argv[4]
    guia = carregar(RAIZ / "dados" / "guia.js", "window.GUIA =")
    novidades = carregar(RAIZ / "dados" / "novidades.js", "window.NOVIDADES =")
    login = guia["jogadora"]["github"]
    nome = guia["jogadora"].get("nome", login)

    novas = [n for n in novidades.get("lista", []) if f"<!-- novidade:{n['id']} -->" not in ja_postados]
    linhas = [
        f"<!-- aviso:{sha} -->",
        f"@{login}, {nome}, o guia de estudo foi atualizado.",
        "",
        "**Se a página estiver aberta, atualize a tela (F5).** O que você marcou e escreveu continua salvo no seu navegador.",
        "",
    ]
    if novas:
        linhas.append("**O que mudou:**")
        linhas.append("")
        for n in novas:
            link = n.get("link", "")
            endereco = pagina + link if link.startswith("#/") else link
            linhas.append(f"- **{data_curta(n.get('em', ''))}: {n['titulo']}** {n.get('texto', '')}" + (f" [Abrir]({endereco})" if endereco else ""))
            linhas.append(f"  <!-- novidade:{n['id']} -->")
    else:
        linhas.append(f"**O que mudou:** {titulo_da_mudanca(mensagem)}")
    linhas += ["", f"Abrir o guia: {pagina}", "", "_Aviso automático da publicação. Sem dados pessoais e sem chaves._"]
    print("\n".join(linhas))
    return 0


if __name__ == "__main__":
    sys.exit(main())

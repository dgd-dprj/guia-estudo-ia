"""Confere dados/guia.js antes de abrir a plataforma.

Uso, na pasta do guia:
    python scripts/verificar_dados.py

O arquivo é `window.GUIA = { ...JSON... };`. O script tira o começo e o fim, lê o JSON e confere
os campos de cada parte. Sai com código 1 e lista os problemas, se houver.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ARQUIVO = Path(__file__).resolve().parent.parent / "dados" / "guia.js"
CAMPOS_MODULO = ["id", "semana", "titulo", "objetivo", "ponte", "tempo", "estudar", "checar", "praticar", "tarefa", "pronto"]
CAMPOS_TAREFA = ["titulo", "issues", "descricao", "onde", "como_testar", "cuidado"]


def carregar() -> dict:
    texto = ARQUIVO.read_text(encoding="utf-8").strip()
    prefixo = "window.GUIA ="
    if not texto.startswith(prefixo) or not texto.endswith(";"):
        raise SystemExit(f"{ARQUIVO.name} precisa começar com '{prefixo}' e terminar com ';'")
    return json.loads(texto[len(prefixo) : -1])


def link_valido(link: str) -> bool:
    return isinstance(link, str) and (link.startswith("https://") or link.startswith("#/"))


def verificar(g: dict) -> list[str]:
    problemas: list[str] = []
    for campo in ("titulo", "perfil", "maria", "regras", "modulos", "glossario", "repositorio_maria", "jogadora", "xp", "niveis"):
        if campo not in g:
            problemas.append(f"falta '{campo}' no topo")
    for tipo in ("estudar", "checar", "praticar", "tarefa", "pronto", "quiz"):
        if not isinstance(g.get("xp", {}).get(tipo), int):
            problemas.append(f"xp: falta o valor de '{tipo}'")
    limites = [n.get("xp") for n in g.get("niveis", [])]
    if limites != sorted(limites) or (limites and limites[0] != 0):
        problemas.append("niveis: o XP precisa começar em 0 e crescer")
    ids = [m.get("id") for m in g.get("modulos", [])]
    repetidos = {i for i in ids if ids.count(i) > 1}
    if repetidos:
        problemas.append(f"ids de módulo repetidos: {sorted(repetidos)}")
    for m in g.get("modulos", []):
        nome = m.get("id", "?")
        for campo in CAMPOS_MODULO:
            if not m.get(campo):
                problemas.append(f"{nome}: falta '{campo}'")
        for e in m.get("estudar", []):
            if not e.get("titulo") or not link_valido(e.get("link")):
                problemas.append(f"{nome}: item de estudo sem título ou com link que não é https nem interno: {e}")
        tarefa = m.get("tarefa", {})
        for campo in CAMPOS_TAREFA:
            if campo not in tarefa:
                problemas.append(f"{nome}: a tarefa não tem '{campo}'")
        if not all(isinstance(n, int) for n in tarefa.get("issues", [])):
            problemas.append(f"{nome}: os números de issue precisam ser inteiros")
        conquista = m.get("conquista", {})
        if not conquista.get("emoji") or not conquista.get("nome"):
            problemas.append(f"{nome}: falta a conquista (emoji e nome)")
        quiz = m.get("quiz", [])
        if not quiz:
            problemas.append(f"{nome}: falta o quiz")
        for k, q in enumerate(quiz, 1):
            opcoes = q.get("opcoes", [])
            if not q.get("pergunta") or len(opcoes) < 2 or not q.get("explicacao"):
                problemas.append(f"{nome}, pergunta {k}: precisa de pergunta, 2 opções ou mais e explicação")
            if not isinstance(q.get("correta"), int) or not 0 <= q["correta"] < len(opcoes):
                problemas.append(f"{nome}, pergunta {k}: 'correta' precisa ser o índice de uma opção (começa em 0)")
    for r in g.get("regras", []):
        if not r.get("titulo") or not r.get("texto"):
            problemas.append(f"regra incompleta: {r}")
    return problemas


def main() -> int:
    g = carregar()
    problemas = verificar(g)
    if problemas:
        print("Problemas encontrados:")
        for p in problemas:
            print(" -", p)
        return 1
    print(f"OK: {len(g['modulos'])} módulos, {len(g['regras'])} regras, {len(g['glossario'])} termos no glossário.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

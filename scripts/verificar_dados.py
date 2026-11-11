"""Confere dados/guia.js e dados/tarefas.js antes de abrir a plataforma.

Uso, na pasta do guia:
    python scripts/verificar_dados.py

Os arquivos são `window.GUIA = { ...JSON... };` e `window.TAREFAS = { ...JSON... };`. O script tira
o começo e o fim, lê o JSON e confere os campos de cada parte. Sai com código 1 e lista os
problemas, se houver.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

DADOS = Path(__file__).resolve().parent.parent / "dados"
ARQUIVO = DADOS / "guia.js"
ARQUIVO_TAREFAS = DADOS / "tarefas.js"
CAMPOS_MODULO = ["id", "semana", "titulo", "objetivo", "ponte", "tempo", "estudar", "checar", "praticar", "tarefa", "pronto"]
CAMPOS_TAREFA = ["titulo", "issues", "descricao", "onde", "como_testar", "cuidado"]
CAMPOS_TAREFA_LANCADA = ["id", "titulo", "fase", "descricao", "lancada_por", "lancada_em", "prazo", "status", "entrega", "avaliacao"]
STATUS = {"lancada", "em_andamento", "entregue", "refazer", "avaliada"}
PRIORIDADES = {"maxima", "alta", "normal"}
DATA = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def carregar(arquivo: Path = ARQUIVO, prefixo: str = "window.GUIA =") -> dict:
    texto = arquivo.read_text(encoding="utf-8").strip()
    if not texto.startswith(prefixo) or not texto.endswith(";"):
        raise SystemExit(f"{arquivo.name} precisa começar com '{prefixo}' e terminar com ';'")
    return json.loads(texto[len(prefixo) : -1])


def data_ok(valor, opcional: bool = False) -> bool:
    if valor is None:
        return opcional
    return isinstance(valor, str) and bool(DATA.match(valor))


def verificar_tarefas(t: dict, ids_modulo: set[str]) -> list[str]:
    problemas: list[str] = []
    criterios = t.get("criterios")
    if not isinstance(criterios, dict) or not criterios:
        problemas.append("tarefas.js: falta 'criterios' (chave e nome de cada critério)")
        criterios = {}
    ids = [x.get("id") for x in t.get("tarefas", [])]
    repetidos = {i for i in ids if ids.count(i) > 1}
    if repetidos:
        problemas.append(f"tarefas.js: ids repetidos: {sorted(repetidos)}")
    for x in t.get("tarefas", []):
        nome = f"tarefa {x.get('id', '?')}"
        for campo in CAMPOS_TAREFA_LANCADA:
            if campo not in x:
                problemas.append(f"{nome}: falta '{campo}'")
        if not re.match(r"^T\d+$", str(x.get("id", ""))):
            problemas.append(f"{nome}: o id precisa ser T seguido de número (T1, T2...)")
        if x.get("fase") and x["fase"] not in ids_modulo:
            problemas.append(f"{nome}: a fase '{x['fase']}' não existe no guia")
        if x.get("status") not in STATUS:
            problemas.append(f"{nome}: status precisa ser um de {sorted(STATUS)}")
        if not data_ok(x.get("lancada_em")):
            problemas.append(f"{nome}: 'lancada_em' precisa ser AAAA-MM-DD")
        if not data_ok(x.get("prazo"), opcional=True):
            problemas.append(f"{nome}: 'prazo' precisa ser AAAA-MM-DD ou null")
        if not all(isinstance(n, int) for n in x.get("issues_maria", [])):
            problemas.append(f"{nome}: os números em 'issues_maria' precisam ser inteiros")
        if "urgente" in x and not isinstance(x["urgente"], bool):
            problemas.append(f"{nome}: 'urgente' precisa ser true ou false")
        if x.get("prazo_hora") is not None and not re.match(r"^([01]\d|2[0-3]):[0-5]\d$", str(x["prazo_hora"])):
            problemas.append(f"{nome}: 'prazo_hora' precisa ser HH:MM")
        if "prioridade" in x and x["prioridade"] not in PRIORIDADES:
            problemas.append(f"{nome}: 'prioridade' precisa ser um de {sorted(PRIORIDADES)}")
        for dep in x.get("depende_de", []):
            if dep not in ids or dep == x.get("id"):
                problemas.append(f"{nome}: 'depende_de' cita '{dep}', que não é outra tarefa da lista")
        for i in x.get("identificadores", []):
            if not all(isinstance(i.get(c), str) and i[c].strip() for c in ("nome", "onde", "como")):
                problemas.append(f"{nome}: cada identificador precisa de 'nome', 'onde' e 'como'")
        for c in x.get("casos_teste", []):
            if not c.get("relato") or not c.get("esperado"):
                problemas.append(f"{nome}: cada caso de teste precisa de 'relato' e 'esperado'")
        ids_campos = [c.get("id") for c in x.get("campos_entrega", [])]
        if len(ids_campos) != len(set(ids_campos)) or not all(ids_campos):
            problemas.append(f"{nome}: os campos de entrega precisam de 'id' único")
        for c in x.get("campos_entrega", []):
            if not c.get("rotulo"):
                problemas.append(f"{nome}: o campo de entrega '{c.get('id')}' precisa de 'rotulo'")
        for campo in ("objetivo", "contexto", "tempo", "entregavel"):
            if campo in x and not (isinstance(x[campo], str) and x[campo].strip()):
                problemas.append(f"{nome}: '{campo}' precisa ser um texto")
        for campo in ("passos", "pronto_quando", "cuidados"):
            if campo in x and not (isinstance(x[campo], list) and all(isinstance(i, str) and i.strip() for i in x[campo])):
                problemas.append(f"{nome}: '{campo}' precisa ser uma lista de textos")
        for d in x.get("issues_detalhe", []):
            if not isinstance(d.get("numero"), int) or not d.get("titulo"):
                problemas.append(f"{nome}: cada item de 'issues_detalhe' precisa de 'numero' (inteiro) e 'titulo'")
            for campo in ("olhar", "perguntas"):
                if campo in d and not (isinstance(d[campo], list) and all(isinstance(i, str) for i in d[campo])):
                    problemas.append(f"{nome}, issue {d.get('numero')}: '{campo}' precisa ser uma lista de textos")
        entrega = x.get("entrega") or {}
        if not data_ok(entrega.get("em"), opcional=True):
            problemas.append(f"{nome}: 'entrega.em' precisa ser AAAA-MM-DD ou null")
        link = entrega.get("link")
        if link is not None and not (isinstance(link, str) and link.startswith("https://")):
            problemas.append(f"{nome}: 'entrega.link' precisa começar com https:// ou ser null")
        avaliacao = x.get("avaliacao") or {}
        if not data_ok(avaliacao.get("em"), opcional=True):
            problemas.append(f"{nome}: 'avaliacao.em' precisa ser AAAA-MM-DD ou null")
        for chave, nota in (avaliacao.get("criterios") or {}).items():
            if chave not in criterios:
                problemas.append(f"{nome}: o critério '{chave}' não está em 'criterios'")
            if nota is not None and not (isinstance(nota, int) and 1 <= nota <= 5):
                problemas.append(f"{nome}: a nota de '{chave}' precisa ser de 1 a 5 ou null")
        if x.get("status") == "avaliada" and not any(isinstance(v, int) for v in (avaliacao.get("criterios") or {}).values()):
            problemas.append(f"{nome}: status 'avaliada' sem nenhuma nota")
    return problemas


def link_valido(link: str) -> bool:
    return isinstance(link, str) and (link.startswith("https://") or link.startswith("#/"))


def verificar(g: dict) -> list[str]:
    problemas: list[str] = []
    for campo in ("titulo", "perfil", "maria", "regras", "modulos", "glossario", "repositorio_maria", "repositorio_guia", "jogadora", "xp", "niveis"):
        if campo not in g:
            problemas.append(f"falta '{campo}' no topo")
    if not re.match(r"^[\w.-]+/[\w.-]+$", str(g.get("repositorio_guia", ""))):
        problemas.append("repositorio_guia precisa ser 'dono/repositorio'")
    if not re.match(r"^[A-Za-z0-9-]+$", str(g.get("jogadora", {}).get("github", ""))):
        problemas.append("jogadora: falta o 'github' (login de quem envia o progresso)")
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
    t = carregar(ARQUIVO_TAREFAS, "window.TAREFAS =")
    problemas = verificar(g) + verificar_tarefas(t, {m.get("id") for m in g.get("modulos", [])})
    if problemas:
        print("Problemas encontrados:")
        for p in problemas:
            print(" -", p)
        return 1
    print(f"OK: {len(g['modulos'])} módulos, {len(g['regras'])} regras, {len(g['glossario'])} termos no glossário, {len(t['tarefas'])} tarefas lançadas.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

# Guia de Estudo IA — Jornada IA da Marcelle

Plataforma de estudo para desenvolvimento de IA, feita para equilibrar **estudo** e **tarefas reais da Maria**, a assistente da Defensoria Pública do RJ.

É um jogo de aventura 2D retrô, com pixel art original (sem personagens nem símbolos de outros jogos):

- **Mapa do mundo:** cada fase é um lugar no caminho. A Marcelle aparece na fase atual.
- **Coruja Bit:** a guia. Fala em caixas de diálogo curtas, com o texto em partes: clique na fala para mostrar tudo de uma vez.
- **Fases em telas curtas:** Missão, Ponte, Baú (estudo), Quiz, Pensar, Treino, Maria (a tarefa real), Chefão (critérios de pronto) e Diário. Avance com "Próximo ▶" ou com as setas ← → do teclado.
- **Quiz:** libera quando todo o baú de estudo da fase está marcado. Dá a explicação na hora e pode ser refeito; os pontos são recalculados, não somam duas vezes.
- **XP e níveis:** estudar e pensar 10, acertar o quiz 15, treino 30, cada critério de pronto 20, missão na Maria 100. Sete níveis, de "Aprendiz de IA" a "Desenvolvedora de IA".
- **Insígnias:** uma por fase completa (todos os itens e o quiz), com confete.
- **Sequência de dias:** 🔥 conta os dias seguidos com algum avanço.
- **Menos movimento:** quem pede menos animação no sistema não vê confete nem texto animado.

Cada módulo leva cerca de uma semana e tem:

1. **Estudar:** leituras e documentações oficiais, com o porquê de cada uma.
2. **Conferir se entendeu:** perguntas para checar.
3. **Praticar:** um exercício pequeno.
4. **Tarefa na Maria:** uma issue real, com onde mexer, como testar e os cuidados.
5. **Pronto quando:** os critérios de entrega.

A trilha parte do que a pessoa já sabe (Docker, AWS, SOLID, Clean Architecture, SDD e RAG) e foca no que falta para trabalhar com IA em produção.

## Como abrir

Abra o arquivo `index.html` no navegador, com dois cliques. Não precisa instalar nada.

Se o navegador bloquear algo por ser um arquivo local, rode na pasta do guia:

```bash
python -m http.server 8000
```

E abra `http://localhost:8000`.

## O progresso

- **Onde fica:** as caixas marcadas e as anotações ficam salvas **no navegador** de quem estuda, e não neste repositório.
- **Para mandar à Nicole ou trocar de computador:** use **"Baixar meu progresso"**, que gera um arquivo `.json`, e **"Carregar progresso"** do outro lado.
- **Cuidado:** limpar os dados do navegador apaga o progresso. Baixe o arquivo de vez em quando.

## Como editar o conteúdo

Todo o conteúdo está em `dados/guia.js`, em JSON, dentro de `window.GUIA = { ... };`.

- **Módulos:** a lista `modulos`. Cada módulo tem `id`, `semana`, `titulo`, `objetivo`, `ponte`, `tempo`, `estudar`, `checar`, `praticar`, `tarefa` e `pronto`.
- **Links:** só `https://...` ou rotas internas (`#/maria`, `#/regras`). Outros endereços aparecem como texto, sem link.
- **Depois de editar, confira:**

  ```bash
  python scripts/verificar_dados.py
  ```

## Estrutura

| Arquivo | O que é |
|---|---|
| `index.html` | A página |
| `estilo.css` | O visual, com tema claro e escuro automático |
| `app.js` | Monta as páginas a partir dos dados e guarda o progresso |
| `dados/guia.js` | Perfil, mapa da Maria, regras, módulos e glossário |
| `scripts/verificar_dados.py` | Confere os dados antes de abrir |

## Privacidade

- Este guia não guarda dado pessoal de ninguém.
- As tarefas usam **só dados inventados**. As regras da equipe estão na página "Regras da equipe".
- Não coloque chave, senha ou dado de assistido neste repositório.

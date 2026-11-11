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

## O menu

Cada botão do menu tem o ícone e o nome:

| Botão | O que tem |
|---|---|
| 🗺️ Mapa | O mapa das fases e, embaixo, a legenda com o nome e o % de cada fase |
| ✅ Tarefas | As tarefas lançadas pela Nicole e pelo Ícaro, com prazo, status e avaliação |
| 📊 Painel | O painel da equipe, com o desempenho no estudo e nas tarefas |
| 🎒 Inventário | Os poderes que a Marcelle já tem, o envio do progresso e a cópia de segurança |
| 🏅 Conquistas | Insígnias das fases e níveis |
| 📘 Maria | O livro da Maria: camadas, ambientes e por onde começar a ler |
| 📜 Regras | As regras da equipe |
| 📖 Glossário | As palavras que aparecem no dia a dia |

## O progresso

- **Onde fica:** as caixas marcadas e as anotações ficam salvas **no navegador** de quem estuda, e não neste repositório.
- **Para a equipe acompanhar:** no Inventário, **"📤 Enviar progresso"** abre uma issue neste repositório, já preenchida, com o título `[progresso] Marcelle — data`. É só confirmar no GitHub.
  - O envio leva só contagens: XP, nível, dias com avanço, o XP de cada dia e, por fase, o que foi marcado e os acertos do quiz.
  - **Não leva as anotações do diário.**
  - A issue é pública e é fechada na hora pelo workflow `organizar-envios`, com a etiqueta `progresso`.
- **Para trocar de computador:** use **"💾 Salvar progresso"**, que gera um arquivo `.json`, e **"📂 Carregar"** do outro lado.
- **Cuidado:** limpar os dados do navegador apaga o progresso. Salve o arquivo de vez em quando: o envio à equipe leva só contagens e não serve para recuperar o progresso.
- **Na página:** o painel "💾 Como seu progresso fica salvo", embaixo do mapa, explica isso para a Marcelle. O botão "💾 Como salva", na fala da Coruja, leva direto a ele.

## As tarefas

As tarefas ficam em `dados/tarefas.js`, em JSON, dentro de `window.TAREFAS = { ... };`.

- **Para lançar:** copie um item da lista `tarefas`, troque o `id` (T2, T3...) e preencha os campos.

  | Campo | O que é |
  |---|---|
  | `id`, `titulo`, `descricao` | Identificação e o que fazer |
  | `fase` | O módulo ligado (`m0` a `m10`) |
  | `issues_maria` | Números das issues da Maria, se houver |
  | `lancada_por`, `lancada_em`, `prazo` | Quem lançou, quando e até quando (datas `AAAA-MM-DD`) |
  | `status` | `lancada`, `em_andamento`, `entregue`, `refazer` ou `avaliada` |
  | `entrega` | `em` (data), `link` (PR ou issue, `https://`) e `observacao` |
  | `avaliacao` | `por` (quem avaliou), `em`, uma nota de 1 a 5 para cada critério e `comentario` |
  | Opcionais, para detalhar | `objetivo`, `tempo`, `passos` (lista), `issues_detalhe` (por issue: `numero`, `titulo`, `resumo`, `olhar` e `perguntas`), `entregavel`, `pronto_quando` (lista) e `cuidados` (lista) |
  | Opcionais, para prioridade e ordem | `urgente` (`true`), `prioridade` (`maxima`, `alta` ou `normal`), `depende_de` (ids das tarefas que vêm antes) e `identificadores` (por item: `nome`, `onde` e `como`, os nomes exatos de campos e rotas) |

  Com `issues_detalhe`, o "📬 Avisar entrega" abre a issue já com um bloco por issue para a Marcelle preencher.

- **Critérios:** qualidade da entrega, testes, prazo, comunicação e autonomia. Os nomes ficam em `criterios`, no mesmo arquivo.
- **Entrega:** na página de tarefas, a Marcelle usa **"📬 Avisar entrega"**, que abre uma issue `[entrega] T1 — título` com a etiqueta `entrega`. Depois, a Nicole ou o Ícaro atualizam a tarefa no arquivo, com a data, o link e a avaliação.
- **Salvar em arquivo:** cada tarefa tem **"💾 Salvar em arquivo (para o Ícaro)"**, que baixa um `.md` com a tarefa inteira, os passos marcados, o que foi anotado na entrega e o que falta. No topo da página, **"💾 Salvar todas as tarefas em aberto num arquivo"** junta todas num arquivo só. Serve para passar a tarefa adiante quando não der para terminar.

## O painel da equipe

O **📊 Painel** lê, pela API pública do GitHub, as issues `[progresso]` e `[entrega]` abertas pela Marcelle (login em `jogadora.github`). Issues de outras pessoas são ignoradas.

Ele mostra:

- **Resumo:** nível, % da jornada, estudo, acerto do quiz na 1ª tentativa, prática, tarefas entregues e atrasadas, avaliação média, ritmo em XP por semana com a previsão de término e constância (dias com avanço e sequência).
- **Evolução do XP:** linha do XP acumulado por dia, com as faixas de nível. Tem a versão em tabela.
- **Dias de estudo:** calendário das últimas 12 semanas, com o XP de cada dia.
- **Detalhe por fase:** progresso, baú, perguntas para pensar, quiz (1ª tentativa e agora), treino, missão, critérios de pronto, XP e data de conclusão.
- **Tarefas lançadas:** prazo, status, situação (no prazo, atrasada) e a avaliação por critério.
- **Envios:** a lista das issues de progresso.

Sem envio, o painel mostra o progresso guardado no próprio navegador. O botão **"💻 Este navegador"** troca para ele a qualquer momento.

O GitHub aceita 60 consultas por hora sem login, por rede. Se passar disso, o painel avisa e é só tentar de novo mais tarde.

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
| `dados/tarefas.js` | Tarefas lançadas pela equipe, com prazo, entrega e avaliação |
| `scripts/verificar_dados.py` | Confere os dois arquivos de dados antes de abrir |
| `.github/workflows/organizar-envios.yml` | Etiqueta as issues de progresso e de entrega |

## Privacidade

- Este guia não guarda dado pessoal de ninguém.
- O progresso enviado e as avaliações das tarefas ficam **públicos**, neste repositório. Foi uma decisão da equipe.
- As tarefas usam **só dados inventados**. As regras da equipe estão na página "Regras da equipe".
- Não coloque chave, senha ou dado de assistido neste repositório.

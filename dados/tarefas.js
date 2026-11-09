window.TAREFAS = {
  "explicacao": "Para lançar uma tarefa, copie um item da lista, troque o id (T2, T3...) e preencha os campos. Datas no formato AAAA-MM-DD. Status: lancada, em_andamento, entregue, refazer ou avaliada. Os campos objetivo, tempo, passos, issues_detalhe, entregavel, pronto_quando e cuidados são opcionais: use para detalhar o que precisa ser feito. Na avaliação, cada critério vai de 1 a 5; deixe null o que ainda não foi avaliado. Nunca coloque dado pessoal de assistido nem chave: este arquivo é público.",
  "criterios": {
    "qualidade": "Qualidade da entrega",
    "testes": "Testes",
    "prazo": "Prazo",
    "comunicacao": "Comunicação",
    "autonomia": "Autonomia"
  },
  "tarefas": [
    {
      "id": "T1",
      "titulo": "Ler e explicar 3 issues de IA",
      "fase": "m0",
      "descricao": "Ler três problemas reais de IA da Maria e explicar cada um: o problema, onde fica no código, como você mexeria e como saberia que resolveu. Não precisa corrigir nada.",
      "objetivo": "Conhecer o código da Maria por três problemas reais de IA, cada um de um tipo: a pergunta que a IA escreve para a pessoa (#414), o relato que a IA não consegue encaixar em nenhum fluxo (#299) e a resposta da IA que ninguém confere (#212). A meta é entender e saber explicar. A correção fica para as próximas tarefas.",
      "tempo": "Hoje, até o fim do dia: cerca de 4 a 5 horas",
      "issues_maria": [
        414,
        299,
        212
      ],
      "passos": [
        "Prepare o ambiente: clone o repositório da Maria, rode `uv sync` e depois `uv run pytest tests/orquestrador`. Os testes devem passar. Se travar aqui, avise a Nicole: resolver o ambiente faz parte da tarefa.",
        "Leia o README do repositório, o CLAUDE.md da pasta src/maria/ia e, no docs/contrato-tykhe.md, a parte do orquestrador (POST /atendimentos/orquestrador). Juntos, eles mostram o caminho de um relato até o fluxo certo.",
        "Faça uma issue por vez, na ordem #414, #299 e #212. Leia a issue inteira, abra os arquivos de \"Onde olhar\" e responda às perguntas-guia num rascunho.",
        "Escreva a explicação de cada issue seguindo o modelo de \"O que entregar\".",
        "Releia como se fosse alguém da equipe que não programa: daria para entender? Corte o que for enfeite.",
        "Entregue pelo botão \"📬 Avisar entrega\". A issue já abre com o modelo; preencha cada bloco e confirme."
      ],
      "issues_detalhe": [
        {
          "numero": 414,
          "titulo": "A pergunta de desambiguação sai confusa",
          "resumo": "Quando o relato serve para mais de um caminho, a IA escreve uma pergunta para a pessoa escolher. Em 5 testes, só 1 pergunta ficou clara, e as piores vieram dos relatos escritos de jeito informal.",
          "olhar": [
            "src/maria/ia/desambiguar.py: o texto de instrução (sistema) e o formato da resposta pedida à IA.",
            "src/maria/orquestrador/graph.py: em que momento a desambiguação é chamada."
          ],
          "perguntas": [
            "Em que momento da conversa essa pergunta aparece para a pessoa?",
            "Por que a mesma instrução gera perguntas tão diferentes nas 5 chamadas da tabela da issue?",
            "Das soluções propostas na issue, qual você testaria primeiro? Como mediria se melhorou?"
          ]
        },
        {
          "numero": 299,
          "titulo": "Relato vago vai direto para \"outros\"",
          "resumo": "Quem escreve só \"preciso de ajuda\" é mandado para \"outros\" e cai no atendimento humano, sem a Maria perguntar mais nada. A issue pede uma decisão: manter assim ou perguntar antes.",
          "olhar": [
            "src/maria/api/orquestrador.py: o ramo \"fluxo não identificado\" (comentário #225).",
            "src/maria/orquestrador/graph.py: quando a desambiguação roda e quando não roda."
          ],
          "perguntas": [
            "O que acontece hoje, passo a passo, com o relato \"preciso de ajuda\"?",
            "Para quem está do outro lado, qual o risco de cada opção: manter ou perguntar antes?",
            "Que dado você pediria antes de decidir?"
          ]
        },
        {
          "numero": 212,
          "titulo": "A resposta da IA não é conferida",
          "resumo": "O código pede à IA uma resposta num formato fechado, por exemplo um parentesco de uma lista, mas não confere o que volta. Um valor inventado pelo modelo passaria adiante.",
          "olhar": [
            "src/maria/ia/_estruturado.py: o comentário do topo explica por que a conferência ficou de fora de propósito.",
            "src/maria/ia/classificar.py: uma função que confia na resposta da IA.",
            "src/maria/ia/classificar_necessidades.py: a função _validar, que já confere. Compare as duas."
          ],
          "perguntas": [
            "O que pode chegar à Tykhe se o modelo inventar um valor?",
            "Por que a migração para Python manteve o defeito de propósito? (Procure \"régua\" no MIGRACAO.md.)",
            "Como você faria a conferência, e que teste provaria que funciona?"
          ]
        }
      ],
      "entregavel": "Um texto na issue de entrega, com um bloco por issue. Cada bloco tem 4 itens: 1) O problema, em 2 ou 3 frases, como se explicasse para alguém da equipe que não programa. 2) Onde no código: os arquivos e as funções. 3) Como você mexeria: a mudança em poucas linhas, sem escrever o código. 4) Como saberia que resolveu: o teste ou a medida. No fim, uma dúvida que ficou.",
      "pronto_quando": [
        "As 3 issues explicadas, cada uma com os 4 itens.",
        "Cada \"Onde no código\" cita arquivos e funções que existem hoje na develop.",
        "Cada \"Como saberia que resolveu\" tem um teste ou uma medida concreta, e não só \"testar\".",
        "Entregue pela issue [entrega] até o prazo."
      ],
      "cuidados": [
        "Não rode os testes da pasta tests/integracao: eles chamam a IA paga (Bedrock). Os outros testes usam uma IA simulada e não custam nada.",
        "Nesta tarefa não precisa mexer no código, abrir PR nem comentar nas issues da Maria: a entrega é só a explicação.",
        "O repositório do guia é público: na entrega, use só exemplos inventados, nunca dado de assistido nem chave."
      ],
      "lancada_por": "Nicole",
      "lancada_em": "2026-11-09",
      "prazo": "2026-11-09",
      "status": "lancada",
      "entrega": {
        "em": null,
        "link": null,
        "observacao": ""
      },
      "avaliacao": {
        "por": [],
        "em": null,
        "criterios": {
          "qualidade": null,
          "testes": null,
          "prazo": null,
          "comunicacao": null,
          "autonomia": null
        },
        "comentario": ""
      }
    }
  ]
};

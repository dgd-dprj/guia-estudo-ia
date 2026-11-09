window.TAREFAS = {
  "explicacao": "Para lançar uma tarefa, copie um item da lista, troque o id (T2, T3...) e preencha os campos. Datas no formato AAAA-MM-DD. Status: lancada, em_andamento, entregue, refazer ou avaliada. Os campos urgente, prazo_hora (HH:MM), objetivo, contexto, tempo, passos, issues_detalhe, casos_teste, campos_entrega, entregavel, pronto_quando e cuidados são opcionais: use para detalhar o que precisa ser feito. Na avaliação, cada critério vai de 1 a 5; deixe null o que ainda não foi avaliado. Nunca coloque dado pessoal de assistido nem chave: este arquivo é público.",
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
      "tempo": "Cerca de 6 horas, ao longo da semana",
      "issues_maria": [
        414,
        299,
        212
      ],
      "passos": [
        "Prepare o ambiente: clone o repositório da Maria, rode `uv sync` e depois `uv run pytest tests/orquestrador`. Os testes devem passar. Se travar aqui, avise a Nicole: resolver o ambiente faz parte da tarefa.",
        "Leia o README do repositório, o CLAUDE.md da pasta src/maria/ia e, no docs/contrato-tykhe.md, a parte do orquestrador (POST /atendimentos/orquestrador). Juntos, eles mostram o caminho de um relato até o fluxo certo.",
        "Faça uma issue por vez, na ordem #414, #299 e #212. Leia a issue inteira, abra os arquivos de \"Onde olhar\" e responda às perguntas-guia num rascunho, ou direto nos campos da seção \"Entrega\".",
        "Escreva a explicação de cada issue no campo dela, na seção \"Entrega\" deste cartão. Fica salvo enquanto você escreve.",
        "Releia como se fosse alguém da equipe que não programa: daria para entender? Corte o que for enfeite.",
        "Entregue pela seção \"Entrega\" deste cartão: marque os passos, preencha os campos e clique em \"📬 Enviar entrega\". A issue abre já preenchida; é só confirmar."
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
      "entregavel": "Preencha os campos da seção \"Entrega\" deste cartão, um por issue, com os 4 itens: 1) o problema, em 2 ou 3 frases, como se explicasse para alguém da equipe que não programa; 2) onde no código: os arquivos e as funções; 3) como você mexeria, em poucas linhas, sem escrever o código; 4) como saberia que resolveu: o teste ou a medida. No fim, uma dúvida que ficou. Depois, clique em \"Enviar entrega\".",
      "pronto_quando": [
        "As 3 issues explicadas, cada uma com os 4 itens.",
        "Cada \"Onde no código\" cita arquivos e funções que existem hoje na develop.",
        "Cada \"Como saberia que resolveu\" tem um teste ou uma medida concreta, e não só \"testar\".",
        "Entregue pela seção \"Entrega\" até o prazo."
      ],
      "cuidados": [
        "Não rode os testes da pasta tests/integracao: eles chamam a IA paga (Bedrock). Os outros testes usam uma IA simulada e não custam nada.",
        "Nesta tarefa não precisa mexer no código, abrir PR nem comentar nas issues da Maria: a entrega é só a explicação.",
        "O repositório do guia é público: na entrega, use só exemplos inventados, nunca dado de assistido nem chave."
      ],
      "lancada_por": "Nicole",
      "lancada_em": "2026-11-09",
      "prazo": "2026-11-16",
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
      },
      "campos_entrega": [
        {
          "id": "i414",
          "rotulo": "#414: o problema, onde no código, como mexeria e como saberia que resolveu"
        },
        {
          "id": "i299",
          "rotulo": "#299: o problema, onde no código, como mexeria e como saberia que resolveu"
        },
        {
          "id": "i212",
          "rotulo": "#212: o problema, onde no código, como mexeria e como saberia que resolveu"
        },
        {
          "id": "duvida",
          "rotulo": "Uma dúvida que ficou"
        }
      ]
    },
    {
      "id": "T2",
      "titulo": "Multi-fluxo na Tykhe: atender todos os assuntos do relato",
      "urgente": true,
      "fase": "m0",
      "descricao": "Ajustar o fluxo da Tykhe para que a pessoa que conta mais de um problema seja atendida em todos, e não só no primeiro. A Maria já entrega tudo pronto; falta a Tykhe usar.",
      "objetivo": "Hoje, quando a pessoa conta dois problemas, a Tykhe atende só o primeiro. A Maria já propõe a ordem, atende o primeiro assunto e devolve os outros prontos para continuar (#435 e #442). Esta tarefa liga essa parte do lado da Tykhe.",
      "contexto": "O identificador do multi-fluxo é o campo assuntosPendentes: ele só vem quando o relato tem mais de um assunto, e só no release. Cada item da lista traz o nome do assunto, se é urgente e o flowId (fluxo da Maria) ou o tipoCaso (fluxo da Tykhe). Os itens com flowId podem trazer também dadosConhecidos: o que a pessoa já contou, como o parentesco e o CPF, para não perguntar de novo.",
      "tempo": "Urgente: entregar hoje até as 16h",
      "issues_maria": [
        435,
        442
      ],
      "passos": [
        "Antes de tudo, confira se você tem acesso ao construtor de fluxos da Tykhe e o endereço do release da Maria. Se faltar algum, avise a Nicole na hora: não espere.",
        "Leia no docs/contrato-tykhe.md da Maria a parte \"Vários assuntos no mesmo relato\" e a tabela \"Como distinguir os desfechos do orquestrador\" (cerca de 15 minutos).",
        "Na Tykhe, duplique o fluxo do orquestrador e trabalhe só na cópia, com os nós de API apontando para o release. Não mexa no fluxo que a equipe usa.",
        "Botões no \"Pode ser assim?\": quando o orquestrador responder com status em_andamento, sem flowId e com tipoResposta sim_nao, mostre a pergunta num nó de opções com Sim e Não. Mande \"true\" ou \"false\" de volta para POST /atendimentos/orquestrador, com o mesmo chatId.",
        "Guardar a lista: na resposta final do 1º assunto (status concluido ou handoff_humano), guarde o assuntosPendentes numa variável. Se ele não vier ou vier vazio, encerre como hoje.",
        "Abrir o próximo assunto: pegue o 1º item da lista. Com flowId, chame POST /atendimentos com esse flowId, um chatId novo e o dadosConhecidos do item. Com tipoCaso, mande para o fluxo da Tykhe daquele tipo, como já acontece no redirecionado.",
        "Repetir: quando esse assunto terminar, olhe de novo o assuntosPendentes da nova resposta final e siga até a lista acabar.",
        "Teste no release os 3 casos abaixo, anotando o chatId e o resultado de cada um.",
        "Entregue pela seção \"Entrega\" deste cartão: preencha os campos e clique em \"📬 Enviar entrega\"."
      ],
      "casos_teste": [
        {
          "relato": "meu irmão foi preso ontem e o plano de saúde negou a cirurgia da minha mãe",
          "esperado": "Aparece \"Pode ser assim?\" com os botões Sim e Não. Depois do 1º assunto, o 2º abre sozinho e não pergunta de novo o que a pessoa já disse (o parentesco, o CPF)."
        },
        {
          "relato": "meu filho foi preso e eu queria saber como está o meu processo de pensão",
          "esperado": "A Maria atende o assunto da pessoa presa. Depois, o do processo vai para o fluxo da Tykhe (tipoCaso)."
        },
        {
          "relato": "o plano negou a minha cirurgia",
          "esperado": "Igual a hoje: sem \"Pode ser assim?\" e sem próximo assunto."
        }
      ],
      "campos_entrega": [
        {
          "id": "fluxo",
          "rotulo": "Nome da cópia do fluxo que você alterou na Tykhe"
        },
        {
          "id": "caso1",
          "rotulo": "Caso 1 (dois assuntos da Maria): chatId e o que aconteceu"
        },
        {
          "id": "caso2",
          "rotulo": "Caso 2 (um da Maria e um da Tykhe): chatId e o que aconteceu"
        },
        {
          "id": "caso3",
          "rotulo": "Caso 3 (um assunto só): chatId e o que aconteceu"
        },
        {
          "id": "pendente",
          "rotulo": "O que não deu certo ou ficou faltando"
        }
      ],
      "entregavel": "Preencha os campos da seção \"Entrega\" deste cartão: o nome da cópia do fluxo, o resultado de cada um dos 3 casos com o chatId usado (a Nicole confere nos logs) e o que ficou faltando. Depois, clique em \"Enviar entrega\". Se quiser mandar prints, cole na issue antes de confirmar, conferindo que nenhum mostra a chave da API.",
      "pronto_quando": [
        "Os botões aparecem no \"Pode ser assim?\" e a resposta volta como true ou false.",
        "No caso 1, o 2º assunto abre sozinho, sem perguntar de novo o que a pessoa já disse.",
        "No caso 2, o 2º assunto vai para o fluxo da Tykhe.",
        "No caso 3, nada muda em relação a hoje.",
        "O fluxo que a equipe usa não foi alterado.",
        "Entrega enviada até as 16h."
      ],
      "cuidados": [
        "Nunca coloque na entrega a chave da API da Maria, nem print do nó de API com o cabeçalho: o repositório do guia é público.",
        "Teste só no release. Não altere o fluxo da produção nem o fluxo que a equipe usa.",
        "Use só relatos inventados e os CPFs de teste da lista da equipe (peça à Nicole). Nunca invente CPF nem use um real.",
        "Travou mais de 30 minutos num passo? Avise a Nicole e siga para o próximo."
      ],
      "lancada_por": "Nicole",
      "lancada_em": "2026-11-09",
      "prazo": "2026-11-09",
      "prazo_hora": "16:00",
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

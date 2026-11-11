window.TAREFAS = {
  "explicacao": "Para lançar uma tarefa, copie um item da lista, troque o id (T2, T3...) e preencha os campos. Datas no formato AAAA-MM-DD. Status: lancada, em_andamento, entregue, refazer ou avaliada. Os campos urgente, prioridade (maxima, alta ou normal), prazo_hora (HH:MM), objetivo, contexto, tempo, depende_de (ids de outras tarefas), identificadores (nome, onde e como), passos, issues_detalhe, casos_teste, campos_entrega, entregavel, pronto_quando e cuidados são opcionais: use para detalhar o que precisa ser feito. Na avaliação, cada critério vai de 1 a 5; deixe null o que ainda não foi avaliado. Nunca coloque dado pessoal de assistido nem chave: este arquivo é público.",
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
      "titulo": "Tykhe 1/7: preparar o acesso, o release e a cópia do fluxo",
      "urgente": true,
      "prioridade": "maxima",
      "fase": "m0",
      "descricao": "Deixar tudo pronto para as tarefas T3 a T8: o acesso ao construtor de fluxos da Tykhe, o endereço e a chave do release da Maria e uma cópia do fluxo do orquestrador só para testar.",
      "objetivo": "Ter um lugar seguro para testar o multi-fluxo sem mexer no que a equipe e as pessoas usam: uma cópia do fluxo, ligada só ao release.",
      "contexto": "O multi-fluxo é a Maria atender a pessoa que conta mais de um problema na mesma mensagem. Ele existe só no release, o ambiente de teste; na produção, nada muda. Desde 10/11, a Maria reconhece a pessoa pelo idUsuario que a Tykhe manda e não pede mais o CPF no começo. Essa versão de 10/11 ainda precisa entrar no release: o passo 4 confere isso.",
      "tempo": "Cerca de 1 hora. Faça primeiro: as outras dependem desta.",
      "issues_maria": [
        451,
        450
      ],
      "depende_de": [],
      "identificadores": [
        {
          "nome": "release",
          "onde": "O endereço da Maria para teste",
          "como": "A Nicole passa o endereço e a chave. Todas as chamadas destas tarefas vão para ele, nunca para a produção."
        },
        {
          "nome": "Authorization: Bearer <chave>",
          "onde": "O cabeçalho de todo nó de API que chama a Maria",
          "como": "A chave do release. Fica só na configuração do nó da Tykhe; nunca em print, entrega ou arquivo."
        },
        {
          "nome": "GET /docs",
          "onde": "A página de documentação da Maria, no endereço do release",
          "como": "Mostra os campos de cada rota. Serve para conferir a versão."
        },
        {
          "nome": "idUsuario",
          "onde": "No /docs, no corpo de POST /atendimentos/orquestrador",
          "como": "Se o campo aparece, a versão de 10/11 já está no release."
        },
        {
          "nome": "TESTE MULTIFLUXO",
          "onde": "O começo do nome da cópia do fluxo na Tykhe",
          "como": "Assim todo mundo sabe que é a cópia de teste, e não o fluxo da equipe."
        }
      ],
      "passos": [
        "Confira se você tem acesso ao construtor de fluxos da Tykhe. Sem acesso, peça à Nicole agora: sem ele, nenhuma outra tarefa anda.",
        "Peça à Nicole o endereço do release da Maria e a chave da API do release. Guarde a chave só na configuração do nó de API da Tykhe.",
        "Na Tykhe, duplique o fluxo do orquestrador e dê à cópia um nome que comece por TESTE MULTIFLUXO. Aponte todos os nós de API da cópia para o endereço do release.",
        "Abra o endereço do release com /docs no fim e procure a rota POST /atendimentos/orquestrador. Se o corpo tiver o campo idUsuario, a versão de 10/11 já está no ar. Se não tiver, avise a Nicole: a T3 e a T5 dependem dela. Até lá, o release ainda pergunta o CPF logo depois da 1ª mensagem: responda com um CPF de teste da lista da equipe.",
        "Pela cópia, mande o relato inventado \"o plano negou a minha cirurgia\" e confira que a Maria responde. Anote o chatId.",
        "Terminou? Preencha os campos da seção \"Entrega\" e clique em \"📬 Enviar entrega\".",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "casos_teste": [
        {
          "relato": "o plano negou a minha cirurgia",
          "esperado": "A Maria responde com a 1ª pergunta do fluxo do plano de saúde (\"O atendimento é para você?\"), sem \"Pode ser assim?\"."
        }
      ],
      "campos_entrega": [
        {
          "id": "fluxo",
          "rotulo": "Nome da cópia do fluxo na Tykhe"
        },
        {
          "id": "versao",
          "rotulo": "O campo idUsuario aparece no /docs do release? (sim ou não)"
        },
        {
          "id": "chamada",
          "rotulo": "chatId da chamada de teste e o que a Maria respondeu"
        },
        {
          "id": "pendente",
          "rotulo": "O que não deu certo ou ficou faltando"
        }
      ],
      "entregavel": "Preencha os campos da seção \"Entrega\": o nome da cópia, se a versão de 10/11 está no release, o chatId do teste e o que ficou faltando.",
      "pronto_quando": [
        "Você tem acesso ao construtor da Tykhe.",
        "A cópia TESTE MULTIFLUXO existe, com todos os nós de API apontando para o release.",
        "A versão do release foi conferida no /docs.",
        "Uma chamada de teste pela cópia foi respondida, com o chatId anotado."
      ],
      "cuidados": [
        "Teste só no release e só na cópia do fluxo (TESTE MULTIFLUXO). Não altere o fluxo da produção nem o fluxo que a equipe usa.",
        "Nunca coloque na entrega nem no arquivo salvo a chave da API da Maria, nem print do nó de API com o cabeçalho Authorization: o repositório do guia é público.",
        "Use só relatos inventados. O idUsuario de teste também é inventado (por exemplo, teste-marcelle-1). Nunca use CPF, telefone nem o id de uma pessoa real.",
        "Travou mais de 30 minutos num passo? Avise a Nicole e siga para o próximo.",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "lancada_por": "Nicole",
      "lancada_em": "2026-11-11",
      "prazo": "2026-11-13",
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
    },
    {
      "id": "T3",
      "titulo": "Tykhe 2/7: mandar o idUsuario na 1ª chamada",
      "urgente": true,
      "prioridade": "maxima",
      "fase": "m0",
      "descricao": "Incluir o id da pessoa na Tykhe no corpo da 1ª chamada ao orquestrador. É ele que faz a Maria guardar os assuntos para quando a pessoa voltar.",
      "objetivo": "Sem o idUsuario, a conversa funciona, mas nada fica guardado: quando a pessoa volta outro dia, a Maria não sabe que ela tinha um assunto pendente.",
      "contexto": "O idUsuario é o identificador da pessoa no sistema da Tykhe, o mesmo em todas as conversas dela. O chatId muda a cada conversa; o idUsuario não. Ele vai só na 1ª chamada, junto com chatId e mensagem. Nas respostas seguintes não precisa mandar de novo, e mandar outro não troca o da conversa. Pode ser texto ou número, com até 200 caracteres. Nunca use o CPF nem o telefone como idUsuario: são dados pessoais.",
      "tempo": "Cerca de 1 hora",
      "issues_maria": [
        450,
        451
      ],
      "depende_de": [
        "T2"
      ],
      "identificadores": [
        {
          "nome": "idUsuario",
          "onde": "Corpo da 1ª chamada a POST /atendimentos/orquestrador",
          "como": "Campo novo. Valor: o id da pessoa na Tykhe. Só no release."
        },
        {
          "nome": "chatId",
          "onde": "Corpo de todas as chamadas",
          "como": "O id da conversa. Muda a cada conversa."
        },
        {
          "nome": "mensagem",
          "onde": "Corpo da 1ª chamada",
          "como": "O relato da pessoa. É a chamada que leva o idUsuario."
        },
        {
          "nome": "resposta",
          "onde": "Corpo das chamadas seguintes ({ chatId, resposta })",
          "como": "Não leva idUsuario. Esses nós ficam como estão."
        }
      ],
      "passos": [
        "Pergunte ao Ícaro qual variável da Tykhe guarda o id da pessoa e se ele é o mesmo em todas as conversas dela. Se for o telefone ou o CPF, pare e avise a Nicole: esse não pode ser usado.",
        "Na cópia do fluxo, abra o nó de API da 1ª chamada a POST /atendimentos/orquestrador e acrescente ao corpo o campo idUsuario com essa variável. O corpo fica assim: {\"chatId\": \"…\", \"mensagem\": \"…\", \"idUsuario\": \"…\"}.",
        "Não mexa nos nós que mandam { chatId, resposta }: eles continuam iguais.",
        "Rode os dois casos abaixo e anote o chatId de cada um. A Nicole confere no release se o assunto ficou guardado.",
        "Terminou? Preencha os campos da seção \"Entrega\" e clique em \"📬 Enviar entrega\".",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "casos_teste": [
        {
          "relato": "meu filho foi preso e eu queria saber como está o meu processo de pensão (com o idUsuario teste-marcelle-1)",
          "esperado": "Sem pergunta de CPF no começo (se a versão de 10/11 já estiver no release). Aparece \"Pode ser assim?\". O assunto do processo fica guardado para esse idUsuario."
        },
        {
          "relato": "o mesmo relato, sem o idUsuario",
          "esperado": "A conversa segue igual, mas nada fica guardado."
        }
      ],
      "campos_entrega": [
        {
          "id": "variavel",
          "rotulo": "Nome da variável da Tykhe usada como idUsuario (só o nome, nunca o valor de uma pessoa real)"
        },
        {
          "id": "caso1",
          "rotulo": "Caso 1 (com idUsuario): chatId e o que aconteceu"
        },
        {
          "id": "caso2",
          "rotulo": "Caso 2 (sem idUsuario): chatId e o que aconteceu"
        },
        {
          "id": "pendente",
          "rotulo": "O que não deu certo ou ficou faltando"
        }
      ],
      "entregavel": "Preencha os campos da seção \"Entrega\": o nome da variável, o chatId e o resultado dos dois casos e o que ficou faltando.",
      "pronto_quando": [
        "A 1ª chamada ao orquestrador leva o idUsuario.",
        "As chamadas { chatId, resposta } não mudaram.",
        "Os dois casos rodados, com o chatId anotado.",
        "O idUsuario não é CPF nem telefone."
      ],
      "cuidados": [
        "O idUsuario é dado da pessoa: não aparece em log, print, entrega nem arquivo. Para teste, use só ids inventados.",
        "Teste só no release e só na cópia do fluxo (TESTE MULTIFLUXO). Não altere o fluxo da produção nem o fluxo que a equipe usa.",
        "Nunca coloque na entrega nem no arquivo salvo a chave da API da Maria, nem print do nó de API com o cabeçalho Authorization: o repositório do guia é público.",
        "Use só relatos inventados. O idUsuario de teste também é inventado (por exemplo, teste-marcelle-1). Nunca use CPF, telefone nem o id de uma pessoa real.",
        "Travou mais de 30 minutos num passo? Avise a Nicole e siga para o próximo.",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "lancada_por": "Nicole",
      "lancada_em": "2026-11-11",
      "prazo": "2026-11-13",
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
    },
    {
      "id": "T4",
      "titulo": "Tykhe 3/7: botões na ordem dos assuntos (\"Pode ser assim?\")",
      "urgente": true,
      "prioridade": "maxima",
      "fase": "m0",
      "descricao": "Mostrar com os botões Sim e Não a pergunta da ordem dos assuntos e tratar a pergunta \"Qual você quer resolver primeiro?\".",
      "objetivo": "Quando a pessoa conta mais de um problema, ela precisa conseguir aceitar ou trocar a ordem com um toque, sem digitar.",
      "contexto": "Quando o relato tem dois assuntos ou mais, antes de abrir qualquer fluxo a Maria propõe a ordem: \"Entendi. Você falou de duas coisas: … Vou começar pela … Pode ser assim?\". A pergunta chega no mesmo formato da desambiguação de hoje, sem flowId, e a resposta volta para a mesma rota. A ordem padrão é saúde, violência doméstica, pessoa presa e depois o resto. Com Não e três assuntos ou mais, a Maria pergunta qual vem primeiro. Com Não e dois assuntos, ela troca a ordem.",
      "tempo": "Cerca de 2 horas",
      "issues_maria": [
        435,
        451
      ],
      "depende_de": [
        "T2"
      ],
      "identificadores": [
        {
          "nome": "status: \"em_andamento\", sem flowId",
          "onde": "Resposta de POST /atendimentos/orquestrador",
          "como": "É uma pergunta do orquestrador, e não de um fluxo. A resposta da pessoa volta para a mesma rota, com o mesmo chatId."
        },
        {
          "nome": "tipoResposta: \"sim_nao\" e opcoes: [\"Sim\", \"Não\"]",
          "onde": "Na mesma resposta",
          "como": "É a pergunta da ordem: mostrar os dois botões."
        },
        {
          "nome": "_links.responder.href: \"/atendimentos/orquestrador\"",
          "onde": "Na mesma resposta",
          "como": "Para onde mandar o que a pessoa escolher."
        },
        {
          "nome": "\"true\" e \"false\"",
          "onde": "Campo resposta da chamada seguinte",
          "como": "Sim vira \"true\"; Não vira \"false\"."
        },
        {
          "nome": "tipoResposta: \"texto\", sem flowId",
          "onde": "Resposta com \"Qual você quer resolver primeiro?\" (ou a desambiguação de hoje)",
          "como": "Mostrar o texto e mandar o que a pessoa escrever, na mesma rota."
        },
        {
          "nome": "flowId",
          "onde": "Resposta depois do Sim",
          "como": "O fluxo da Maria abriu, com \"Combinado. Vamos começar pela …\". Daí em diante, as respostas vão para POST /atendimentos/respostas."
        }
      ],
      "passos": [
        "Na cópia, depois do nó da 1ª chamada, crie a condição: status em_andamento, sem flowId e tipoResposta sim_nao.",
        "Nesse caminho, mostre o texto do campo resposta num nó de opções com os botões do campo opcoes (Sim e Não).",
        "Mande o botão escolhido para POST /atendimentos/orquestrador: {\"chatId\": \"<o mesmo>\", \"resposta\": \"true\"} para Sim e \"false\" para Não.",
        "Se a pessoa escrever em vez de tocar no botão, mande o texto como veio: a Maria entende \"pode\", \"ok\", \"não\" e o nome do assunto.",
        "Para tipoResposta texto sem flowId (\"Qual você quer resolver primeiro?\" e a desambiguação de hoje), mostre o texto e mande o que a pessoa escrever, do mesmo jeito.",
        "Quando a resposta vier com flowId, siga como hoje, pelo fluxo da Maria (POST /atendimentos/respostas).",
        "Rode os três casos abaixo e anote o chatId de cada um.",
        "Terminou? Preencha os campos da seção \"Entrega\" e clique em \"📬 Enviar entrega\".",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "casos_teste": [
        {
          "relato": "meu irmão foi preso ontem e o plano de saúde negou a cirurgia da minha mãe (tocar em Sim)",
          "esperado": "Aparece \"Pode ser assim?\" com Sim e Não. Com Sim, abre o plano de saúde, começando por \"Combinado. Vamos começar pelo plano de saúde.\""
        },
        {
          "relato": "o mesmo relato (tocar em Não)",
          "esperado": "Com dois assuntos, a Maria troca a ordem e começa pela pessoa presa."
        },
        {
          "relato": "meu irmão foi preso, o plano negou a cirurgia da minha mãe e quero remarcar meu horário (tocar em Não)",
          "esperado": "Aparece \"Tudo bem. Qual você quer resolver primeiro?\" com a lista. Respondendo \"o horário\", a Maria começa por ele."
        }
      ],
      "campos_entrega": [
        {
          "id": "caso1",
          "rotulo": "Caso 1 (Sim): chatId e o que aconteceu"
        },
        {
          "id": "caso2",
          "rotulo": "Caso 2 (Não, dois assuntos): chatId e o que aconteceu"
        },
        {
          "id": "caso3",
          "rotulo": "Caso 3 (Não, três assuntos): chatId e o que aconteceu"
        },
        {
          "id": "pendente",
          "rotulo": "O que não deu certo ou ficou faltando"
        }
      ],
      "entregavel": "Preencha os campos da seção \"Entrega\" com o chatId e o resultado de cada caso e o que ficou faltando.",
      "pronto_quando": [
        "Os botões Sim e Não aparecem no \"Pode ser assim?\".",
        "A escolha volta para a Maria como \"true\" ou \"false\", com o mesmo chatId.",
        "\"Qual você quer resolver primeiro?\" aparece e a resposta da pessoa volta para a mesma rota.",
        "Um relato de um assunto só continua igual a hoje."
      ],
      "cuidados": [
        "Teste só no release e só na cópia do fluxo (TESTE MULTIFLUXO). Não altere o fluxo da produção nem o fluxo que a equipe usa.",
        "Nunca coloque na entrega nem no arquivo salvo a chave da API da Maria, nem print do nó de API com o cabeçalho Authorization: o repositório do guia é público.",
        "Use só relatos inventados. O idUsuario de teste também é inventado (por exemplo, teste-marcelle-1). Nunca use CPF, telefone nem o id de uma pessoa real.",
        "Travou mais de 30 minutos num passo? Avise a Nicole e siga para o próximo.",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "lancada_por": "Nicole",
      "lancada_em": "2026-11-11",
      "prazo": "2026-11-13",
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
    },
    {
      "id": "T5",
      "titulo": "Tykhe 4/7: pergunta dos assuntos guardados",
      "urgente": true,
      "prioridade": "maxima",
      "fase": "m0",
      "descricao": "Mostrar como botões a pergunta que a Maria faz quando a pessoa volta numa conversa nova e tem um assunto guardado.",
      "objetivo": "Quem deixou um assunto para depois precisa ser lembrado quando volta, e escolher com um toque se quer falar dele ou do que acabou de contar.",
      "contexto": "Com o idUsuario (T3), os assuntos que ficaram para depois são guardados por 30 dias. Numa conversa nova da mesma pessoa, antes de seguir, a Maria pergunta: \"Você tem um assunto guardado: … Quer falar dele agora ou do que você acabou de contar?\". Com assuntos urgentes e menos urgentes guardados, a mensagem separa os dois grupos (\"Urgente:\" e \"Menos urgente:\"), e os urgentes vêm primeiro nas opções. A primeira opção é sempre \"O que acabei de contar\".",
      "tempo": "Cerca de 2 horas",
      "issues_maria": [
        450,
        451
      ],
      "depende_de": [
        "T2",
        "T3"
      ],
      "identificadores": [
        {
          "nome": "status: \"em_andamento\", sem flowId",
          "onde": "Resposta de POST /atendimentos/orquestrador",
          "como": "É uma pergunta do orquestrador, e não de um fluxo. A resposta da pessoa volta para a mesma rota, com o mesmo chatId."
        },
        {
          "nome": "tipoResposta: \"opcoes\"",
          "onde": "Na mesma resposta, logo na 1ª chamada da conversa",
          "como": "É a pergunta dos assuntos guardados: mostrar cada item de opcoes como botão ou lista."
        },
        {
          "nome": "\"O que acabei de contar\"",
          "onde": "Sempre a 1ª opção",
          "como": "Segue com o relato novo, como uma conversa normal."
        },
        {
          "nome": "As outras opções (\"A pessoa presa\", \"O seu processo\")",
          "onde": "Da 2ª opção em diante",
          "como": "Os assuntos guardados. Escolher um abre esse assunto nesta conversa."
        },
        {
          "nome": "\"Agora vamos falar …\"",
          "onde": "Começo da resposta seguinte",
          "como": "O assunto guardado abriu. Pode vir com flowId (fluxo da Maria) ou com status: \"redirecionado\" e tipoCaso (assunto da Tykhe)."
        },
        {
          "nome": "assuntosPendentes",
          "onde": "Na resposta que abre o assunto guardado",
          "como": "O que a pessoa acabou de contar virou pendente, para depois."
        }
      ],
      "passos": [
        "Na cópia, crie a condição: status em_andamento, sem flowId e tipoResposta opcoes.",
        "Mostre o texto do campo resposta inteiro (ele pode ter quebras de linha e os grupos Urgente e Menos urgente) e as opções como botões ou lista.",
        "Mande o texto exato do botão escolhido para POST /atendimentos/orquestrador, com o mesmo chatId. O número da opção (1, 2, 3) também vale.",
        "Se a resposta seguinte vier com flowId, siga pelo fluxo da Maria. Se vier com status redirecionado, siga pelo tipoCaso, como hoje.",
        "Rode os casos abaixo e anote o chatId de cada conversa.",
        "Terminou? Preencha os campos da seção \"Entrega\" e clique em \"📬 Enviar entrega\".",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "casos_teste": [
        {
          "relato": "Conversa A, com o idUsuario teste-marcelle-2: \"meu filho foi preso e eu queria saber como está o meu processo de pensão\". Toque em Sim e leve o assunto da pessoa presa até o fim.",
          "esperado": "No fim, a mensagem diz \"Ficou para depois: o seu processo. Vou guardar esse assunto por até 30 dias para a gente continuar depois.\""
        },
        {
          "relato": "Conversa B, chatId novo e o mesmo idUsuario: \"quero remarcar meu horário\"",
          "esperado": "Aparece \"Você tem um assunto guardado: o seu processo. Quer falar dele agora ou do que você acabou de contar?\", com as opções \"O que acabei de contar\" e \"O seu processo\". Escolhendo \"O seu processo\", vem redirecionado com tipoCaso andamento-processo."
        },
        {
          "relato": "Conversa C, chatId novo e o mesmo idUsuario: \"quero remarcar meu horário\", escolhendo \"O que acabei de contar\"",
          "esperado": "Segue com o relato novo, como uma conversa normal."
        },
        {
          "relato": "Conversa D, com outro idUsuario: \"quero remarcar meu horário\"",
          "esperado": "A pergunta dos guardados não aparece."
        }
      ],
      "campos_entrega": [
        {
          "id": "conversaA",
          "rotulo": "Conversa A: chatId e a mensagem do fim"
        },
        {
          "id": "conversaB",
          "rotulo": "Conversa B: chatId, a pergunta que apareceu e o resultado da escolha"
        },
        {
          "id": "conversaC",
          "rotulo": "Conversa C: chatId e o que aconteceu"
        },
        {
          "id": "conversaD",
          "rotulo": "Conversa D: chatId e o que aconteceu"
        },
        {
          "id": "pendente",
          "rotulo": "O que não deu certo ou ficou faltando"
        }
      ],
      "entregavel": "Preencha os campos da seção \"Entrega\" com o chatId e o resultado de cada conversa e o que ficou faltando.",
      "pronto_quando": [
        "A pergunta dos guardados aparece com as opções como botões ou lista.",
        "A escolha volta para a Maria com o texto do botão e o mesmo chatId.",
        "Escolher o guardado abre o assunto certo; escolher \"O que acabei de contar\" segue com o relato novo.",
        "Com outro idUsuario, a pergunta não aparece."
      ],
      "cuidados": [
        "Esta tarefa precisa da versão de 10/11 no release (confira na T2). Sem ela, a Maria ainda pede o CPF para reconhecer a pessoa.",
        "Teste só no release e só na cópia do fluxo (TESTE MULTIFLUXO). Não altere o fluxo da produção nem o fluxo que a equipe usa.",
        "Nunca coloque na entrega nem no arquivo salvo a chave da API da Maria, nem print do nó de API com o cabeçalho Authorization: o repositório do guia é público.",
        "Use só relatos inventados. O idUsuario de teste também é inventado (por exemplo, teste-marcelle-1). Nunca use CPF, telefone nem o id de uma pessoa real.",
        "Travou mais de 30 minutos num passo? Avise a Nicole e siga para o próximo.",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "lancada_por": "Nicole",
      "lancada_em": "2026-11-11",
      "prazo": "2026-11-13",
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
    },
    {
      "id": "T6",
      "titulo": "Tykhe 5/7: no fim do assunto, guardar a lista e ler a urgência",
      "urgente": true,
      "prioridade": "maxima",
      "fase": "m0",
      "descricao": "Na resposta final de cada assunto, guardar a lista assuntosPendentes e decidir, pela urgência do 1º item, se o próximo assunto abre agora ou fica para depois.",
      "objetivo": "O assunto urgente não pode esperar a pessoa voltar outro dia. O menos urgente não deve ser aberto sem a pessoa querer.",
      "contexto": "Quando um assunto termina, a resposta final traz, além da mensagem, a lista dos outros assuntos (assuntosPendentes), na ordem em que devem ser atendidos. Cada item tem o campo urgencia, com dois valores: urgente (saúde, plano de saúde, violência doméstica, pessoa presa, ou qualquer assunto com sinal de risco no relato) e menos_urgente (o resto). A mensagem final já avisa a pessoa: \"Ainda falta um assunto urgente: … Vamos falar dele agora.\" ou \"Ficou para depois: …\". A Tykhe só precisa mostrar a mensagem e seguir o caminho certo.",
      "tempo": "Cerca de 2 horas",
      "issues_maria": [
        450,
        451
      ],
      "depende_de": [
        "T2",
        "T4"
      ],
      "identificadores": [
        {
          "nome": "status: \"concluido\"",
          "onde": "Resposta final do fluxo da Maria",
          "como": "O assunto terminou bem. Só aqui a Tykhe pode abrir o próximo."
        },
        {
          "nome": "status: \"handoff_humano\"",
          "onde": "Resposta final",
          "como": "A pessoa vai para o atendimento humano. Não abrir o próximo; mostrar os nomes da lista na nota para quem vai atender."
        },
        {
          "nome": "status: \"expirado\"",
          "onde": "Resposta final",
          "como": "A conversa parou. Não abrir o próximo."
        },
        {
          "nome": "assuntosPendentes",
          "onde": "Resposta final, só no release e só com outro assunto",
          "como": "A lista dos outros assuntos. Sem ela, ou vazia, encerre como hoje."
        },
        {
          "nome": "assuntosPendentes[0].urgencia",
          "onde": "O 1º item da lista",
          "como": "\"urgente\": abrir o próximo agora (T7). \"menos_urgente\": encerrar; o assunto fica guardado."
        },
        {
          "nome": "nome",
          "onde": "Cada item da lista",
          "como": "O nome simples do assunto (\"a pessoa presa\"), para mostrar."
        },
        {
          "nome": "urgente",
          "onde": "Cada item da lista",
          "como": "Só o sinal de risco do relato. Para decidir, use urgencia, e não urgente."
        },
        {
          "nome": "flowId ou tipoCaso",
          "onde": "Cada item da lista",
          "como": "Diz se o assunto é de um fluxo da Maria ou da Tykhe. A Tykhe não precisa usar: a rota do próximo assunto resolve (T7)."
        }
      ],
      "passos": [
        "Na cópia, no ponto em que o fluxo da Maria termina, crie uma variável e guarde nela o assuntosPendentes da resposta final.",
        "Mostre sempre o texto do campo resposta inteiro: ele já traz os avisos \"Ainda falta…\" e \"Ficou para depois…\".",
        "Crie a condição: status concluido e a lista existe e não está vazia.",
        "Dentro dela, leia urgencia do 1º item. Com \"urgente\", siga para o caminho \"abrir o próximo\" (feito na T7). Com \"menos_urgente\", encerre como hoje.",
        "Com status handoff_humano e a lista não vazia, não abra nada: escreva os nomes da lista na nota para o atendimento humano.",
        "Rode os casos abaixo e anote o chatId de cada um.",
        "Terminou? Preencha os campos da seção \"Entrega\" e clique em \"📬 Enviar entrega\".",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "casos_teste": [
        {
          "relato": "meu filho foi preso e eu queria saber como está o meu processo de pensão (Sim; leve a pessoa presa até o fim)",
          "esperado": "A resposta final, concluido, termina com \"Ficou para depois: o seu processo.\". O 1º item vem com urgencia menos_urgente, e a Tykhe encerra."
        },
        {
          "relato": "meu marido me ameaçou ontem e meu irmão foi preso semana passada (Sim; leve o 1º assunto até o fim)",
          "esperado": "Se o 1º assunto terminar em concluido, a mensagem traz \"Ainda falta um assunto urgente: a pessoa presa. Vamos falar dele agora.\", o 1º item vem com urgencia urgente e a Tykhe segue para \"abrir o próximo\". Se terminar em handoff_humano, anote."
        },
        {
          "relato": "meu irmão foi preso e o plano negou a cirurgia da minha mãe (Sim; no plano, responda 3 vezes sem mandar a foto da carteirinha)",
          "esperado": "Termina em handoff_humano. A Tykhe não abre o próximo e mostra \"a pessoa presa\" na nota do atendimento humano."
        }
      ],
      "campos_entrega": [
        {
          "id": "caso1",
          "rotulo": "Caso 1 (menos urgente): chatId e o que aconteceu"
        },
        {
          "id": "caso2",
          "rotulo": "Caso 2 (urgente): chatId, o status do fim e o que aconteceu"
        },
        {
          "id": "caso3",
          "rotulo": "Caso 3 (atendimento humano): chatId e o que aconteceu"
        },
        {
          "id": "pendente",
          "rotulo": "O que não deu certo ou ficou faltando"
        }
      ],
      "entregavel": "Preencha os campos da seção \"Entrega\" com o chatId e o resultado de cada caso e o que ficou faltando.",
      "pronto_quando": [
        "A lista assuntosPendentes fica guardada numa variável no fim de cada assunto.",
        "Com concluido e 1º item urgente, o fluxo segue para \"abrir o próximo\".",
        "Com menos_urgente, o fluxo encerra como hoje.",
        "Com handoff_humano, nada abre, e os nomes da lista vão na nota para o atendimento humano.",
        "A mensagem final aparece inteira para a pessoa."
      ],
      "cuidados": [
        "Teste só no release e só na cópia do fluxo (TESTE MULTIFLUXO). Não altere o fluxo da produção nem o fluxo que a equipe usa.",
        "Nunca coloque na entrega nem no arquivo salvo a chave da API da Maria, nem print do nó de API com o cabeçalho Authorization: o repositório do guia é público.",
        "Use só relatos inventados. O idUsuario de teste também é inventado (por exemplo, teste-marcelle-1). Nunca use CPF, telefone nem o id de uma pessoa real.",
        "Travou mais de 30 minutos num passo? Avise a Nicole e siga para o próximo.",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "lancada_por": "Nicole",
      "lancada_em": "2026-11-11",
      "prazo": "2026-11-13",
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
    },
    {
      "id": "T7",
      "titulo": "Tykhe 6/7: abrir o próximo assunto pela rota da Maria",
      "urgente": true,
      "prioridade": "maxima",
      "fase": "m0",
      "descricao": "Quando o próximo assunto for urgente, chamar POST /atendimentos/proximo-assunto e continuar a conversa com o chatId novo que a Maria devolve.",
      "objetivo": "Atender o assunto urgente que ficou na fila, na mesma conversa, sem a pessoa repetir o que já contou.",
      "contexto": "Desde a #450, quem cria o chatId do próximo assunto é a Maria, e não a Tykhe. A Tykhe só manda o chatId da conversa. A Maria pega o próximo item da lista, cria o chatId dele (<chatId>-assunto-2, -assunto-3), abre o fluxo com o que a pessoa já disse e devolve a 1ª pergunta, começando por \"Agora vamos falar …\". Isso substitui a montagem antiga, em que a Tykhe chamava POST /atendimentos com um chatId novo.",
      "tempo": "Cerca de 3 horas",
      "issues_maria": [
        450,
        451
      ],
      "depende_de": [
        "T6"
      ],
      "identificadores": [
        {
          "nome": "POST /atendimentos/proximo-assunto",
          "onde": "Rota nova, só no release",
          "como": "Corpo: {\"chatId\": \"<chatId da conversa>\"}. É o chatId da conversa, e não o de um assunto."
        },
        {
          "nome": "chatId (na resposta)",
          "onde": "Resposta da rota",
          "como": "O chatId do assunto (<chatId>-assunto-2). Use esse daí em diante, em todas as chamadas desse assunto."
        },
        {
          "nome": "flowId e _links.responder.href: \"/atendimentos/respostas\"",
          "onde": "Resposta da rota",
          "como": "Assunto da Maria: siga como um fluxo normal, com o chatId novo."
        },
        {
          "nome": "status: \"redirecionado\" e tipoCaso",
          "onde": "Resposta da rota",
          "como": "Assunto da Tykhe: mande para o fluxo da Tykhe daquele tipo, como no redirecionado de hoje."
        },
        {
          "nome": "404 {\"erro\": \"nenhum assunto pendente nesta conversa\"}",
          "onde": "Resposta da rota",
          "como": "Não há mais assunto: encerre."
        },
        {
          "nome": "assuntosPendentes",
          "onde": "Na resposta e no fim do novo assunto",
          "como": "Os que ainda faltam depois deste."
        },
        {
          "nome": "Chamar duas vezes",
          "onde": "A mesma rota, para a mesma conversa",
          "como": "Não abre dois atendimentos: devolve o mesmo assunto. Pode repetir se a chamada falhar."
        }
      ],
      "passos": [
        "Crie o nó de API POST /atendimentos/proximo-assunto, apontando para o release, com o corpo {\"chatId\": \"<chatId da conversa>\"}.",
        "Ligue esse nó ao caminho \"abrir o próximo\" da T6 (fim concluido, 1º item urgente).",
        "Guarde o chatId que vem na resposta numa variável própria e use essa variável em todas as chamadas seguintes desse assunto.",
        "Resposta com flowId: mostre o texto (começa por \"Agora vamos falar …\") e siga pelas respostas desse fluxo, com o chatId novo.",
        "Resposta com status redirecionado: siga pelo tipoCaso, como no redirecionado de hoje.",
        "Resposta 404: encerre a conversa normalmente.",
        "Quando esse assunto terminar, volte à regra da T6 com a lista da nova resposta final: só abra de novo se o 1º item for urgente.",
        "Rode os casos abaixo e anote os chatId.",
        "Terminou? Preencha os campos da seção \"Entrega\" e clique em \"📬 Enviar entrega\".",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "casos_teste": [
        {
          "relato": "meu marido me ameaçou ontem e meu irmão foi preso semana passada (Sim; leve o 1º assunto até o fim)",
          "esperado": "Se o 1º terminar em concluido, a Tykhe chama a rota sozinha. Aparece \"Agora vamos falar da pessoa presa.\", com o chatId terminado em -assunto-2, e o fluxo não pergunta de novo o parentesco."
        },
        {
          "relato": "o mesmo caso, chamando a rota duas vezes seguidas",
          "esperado": "As duas respostas trazem o mesmo chatId -assunto-2, sem abrir outro atendimento."
        },
        {
          "relato": "o plano negou a minha cirurgia (um assunto só), chamando a rota no fim",
          "esperado": "A rota responde 404: \"nenhum assunto pendente nesta conversa\"."
        }
      ],
      "campos_entrega": [
        {
          "id": "caso1",
          "rotulo": "Caso 1: chatId da conversa, chatId do 2º assunto e o que aconteceu"
        },
        {
          "id": "caso2",
          "rotulo": "Caso 2 (duas chamadas): o que voltou em cada uma"
        },
        {
          "id": "caso3",
          "rotulo": "Caso 3 (um assunto só): chatId e o que voltou"
        },
        {
          "id": "pendente",
          "rotulo": "O que não deu certo ou ficou faltando"
        }
      ],
      "entregavel": "Preencha os campos da seção \"Entrega\" com os chatId e o resultado de cada caso e o que ficou faltando.",
      "pronto_quando": [
        "A Tykhe chama POST /atendimentos/proximo-assunto quando o 1º pendente é urgente e o assunto terminou em concluido.",
        "O chatId devolvido pela Maria é usado em todas as chamadas do novo assunto.",
        "O redirecionado segue pelo tipoCaso, e o 404 encerra a conversa.",
        "Chamar duas vezes não abre dois atendimentos."
      ],
      "cuidados": [
        "Teste só no release e só na cópia do fluxo (TESTE MULTIFLUXO). Não altere o fluxo da produção nem o fluxo que a equipe usa.",
        "Nunca coloque na entrega nem no arquivo salvo a chave da API da Maria, nem print do nó de API com o cabeçalho Authorization: o repositório do guia é público.",
        "Use só relatos inventados. O idUsuario de teste também é inventado (por exemplo, teste-marcelle-1). Nunca use CPF, telefone nem o id de uma pessoa real.",
        "Travou mais de 30 minutos num passo? Avise a Nicole e siga para o próximo.",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "lancada_por": "Nicole",
      "lancada_em": "2026-11-11",
      "prazo": "2026-11-13",
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
    },
    {
      "id": "T8",
      "titulo": "Tykhe 7/7: teste completo no release e entrega",
      "urgente": true,
      "prioridade": "maxima",
      "fase": "m0",
      "descricao": "Rodar seis conversas de ponta a ponta na cópia do fluxo e anotar o resultado, para a Nicole conferir nos registros e o Ícaro levar para a produção quando for aprovado.",
      "objetivo": "Mostrar que o multi-fluxo funciona inteiro na Tykhe: a ordem, os assuntos guardados, a urgência, o próximo assunto e os casos de sempre.",
      "contexto": "As tarefas T3 a T7 montam cada parte. Esta junta tudo num roteiro só, do jeito que a pessoa usaria pelo WhatsApp. Use um idUsuario inventado novo (teste-marcelle-3), para começar sem assuntos guardados de testes anteriores.",
      "tempo": "Cerca de 3 horas",
      "issues_maria": [
        451,
        450,
        435,
        442
      ],
      "depende_de": [
        "T3",
        "T4",
        "T5",
        "T6",
        "T7"
      ],
      "identificadores": [
        {
          "nome": "teste-marcelle-3",
          "onde": "O idUsuario inventado deste teste",
          "como": "Comece com ele, sem assuntos guardados. No caso 4, use outro (teste-marcelle-4)."
        },
        {
          "nome": "chatId e <chatId>-assunto-N",
          "onde": "Cada conversa e cada próximo assunto",
          "como": "Anote todos: a Nicole confere cada um nos registros do release."
        },
        {
          "nome": "#451",
          "onde": "A issue da Tykhe na Maria",
          "como": "Onde os chatId do teste ficam registrados. Nunca escreva ali dado pessoal nem a chave."
        }
      ],
      "passos": [
        "Confira se as tarefas T2 a T7 estão feitas. O que não ficou pronto, marque no campo \"pendente\" desta entrega.",
        "Rode os seis casos abaixo, um de cada vez, do começo ao fim, pela cópia TESTE MULTIFLUXO.",
        "Em cada caso, anote o chatId da conversa (e o -assunto-N, quando houver), o que apareceu e se foi igual ao esperado.",
        "Compare as mensagens com a coluna \"Esperado\". Diferença de texto também é achado: anote.",
        "Comente os chatId na issue #451 da Maria, sem nenhum dado pessoal e sem a chave.",
        "Terminou? Preencha os campos da seção \"Entrega\" e clique em \"📬 Enviar entrega\".",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "casos_teste": [
        {
          "relato": "1. meu marido me ameaçou ontem e meu irmão foi preso semana passada",
          "esperado": "Sem CPF no começo; \"Pode ser assim?\" com botões; 1º assunto até o fim; se terminar em concluido, \"Ainda falta um assunto urgente: a pessoa presa\" e o 2º assunto abre sozinho, com o chatId -assunto-2."
        },
        {
          "relato": "2. meu filho foi preso e eu queria saber como está o meu processo de pensão",
          "esperado": "A pessoa presa até o fim; a mensagem final diz \"Ficou para depois: o seu processo. Vou guardar esse assunto por até 30 dias…\"; a Tykhe não abre o próximo."
        },
        {
          "relato": "3. Conversa nova com o mesmo idUsuario: quero remarcar meu horário",
          "esperado": "A pergunta dos guardados aparece com \"O seu processo\"; escolhendo, vem redirecionado com tipoCaso andamento-processo."
        },
        {
          "relato": "4. O caso 2 com outro idUsuario e depois uma conversa nova com ele",
          "esperado": "Funciona igual, e na conversa nova a pergunta dos guardados aparece só para esse idUsuario."
        },
        {
          "relato": "5. meu irmão foi preso e o plano negou a cirurgia da minha mãe (no plano, 3 respostas sem a foto)",
          "esperado": "Termina em handoff_humano; a Tykhe não abre o próximo e mostra \"a pessoa presa\" para o atendimento humano."
        },
        {
          "relato": "6. o plano negou a minha cirurgia",
          "esperado": "Igual a hoje: sem \"Pode ser assim?\" e sem próximo assunto."
        }
      ],
      "campos_entrega": [
        {
          "id": "caso1",
          "rotulo": "Caso 1: chatId (e -assunto-2) e o resultado"
        },
        {
          "id": "caso2",
          "rotulo": "Caso 2: chatId e o resultado"
        },
        {
          "id": "caso3",
          "rotulo": "Caso 3: chatId e o resultado"
        },
        {
          "id": "caso4",
          "rotulo": "Caso 4: chatId e o resultado"
        },
        {
          "id": "caso5",
          "rotulo": "Caso 5: chatId e o resultado"
        },
        {
          "id": "caso6",
          "rotulo": "Caso 6: chatId e o resultado"
        },
        {
          "id": "pendente",
          "rotulo": "O que não deu certo, o que ficou faltando e quais tarefas (T2 a T7) não terminou"
        }
      ],
      "entregavel": "Preencha um campo por caso, com o chatId e o resultado, e o campo \"pendente\". Depois, clique em \"Enviar entrega\". Se faltar alguma tarefa, salve também \"💾 Salvar todas as tarefas em aberto num arquivo\", no topo da página de tarefas, e mande ao Ícaro.",
      "pronto_quando": [
        "Os seis casos rodados no release, com os chatId anotados aqui e na #451.",
        "Cada diferença do esperado anotada.",
        "O fluxo da produção e o que a equipe usa não foram alterados.",
        "Entregue até sexta (13/11), ou com o arquivo das tarefas em aberto enviado ao Ícaro."
      ],
      "cuidados": [
        "Teste só no release e só na cópia do fluxo (TESTE MULTIFLUXO). Não altere o fluxo da produção nem o fluxo que a equipe usa.",
        "Nunca coloque na entrega nem no arquivo salvo a chave da API da Maria, nem print do nó de API com o cabeçalho Authorization: o repositório do guia é público.",
        "Use só relatos inventados. O idUsuario de teste também é inventado (por exemplo, teste-marcelle-1). Nunca use CPF, telefone nem o id de uma pessoa real.",
        "Travou mais de 30 minutos num passo? Avise a Nicole e siga para o próximo.",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "lancada_por": "Nicole",
      "lancada_em": "2026-11-11",
      "prazo": "2026-11-13",
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

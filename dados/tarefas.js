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
      "contexto": "O multi-fluxo é a Maria atender a pessoa que conta mais de um problema na mesma mensagem. Ele existe só no release, o ambiente de teste; na produção, nada muda. Desde 11/11, no release, a Maria reconhece a pessoa pelo idUsuario que a Tykhe manda e não pergunta mais o CPF no começo. Os assuntos em aberto (a lista e os botões do fim de cada assunto) entram no release quando o PR #455 for mergeado: o passo 4 confere.",
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
          "como": "Já está no release desde 11/11. A Tykhe manda na 1ª chamada (T3)."
        },
        {
          "nome": "TESTE MULTIFLUXO",
          "onde": "O começo do nome da cópia do fluxo na Tykhe",
          "como": "Assim todo mundo sabe que é a cópia de teste, e não o fluxo da equipe."
        },
        {
          "nome": "POST /atendimentos/assuntos-em-aberto",
          "onde": "No /docs do release, na lista de rotas",
          "como": "Se a rota aparece, os assuntos em aberto (T5 a T7) já estão no release."
        }
      ],
      "passos": [
        "Confira se você tem acesso ao construtor de fluxos da Tykhe. Sem acesso, peça à Nicole agora: sem ele, nenhuma outra tarefa anda.",
        "Peça à Nicole o endereço do release da Maria e a chave da API do release. Guarde a chave só na configuração do nó de API da Tykhe.",
        "Na Tykhe, duplique o fluxo do orquestrador e dê à cópia um nome que comece por TESTE MULTIFLUXO. Aponte todos os nós de API da cópia para o endereço do release.",
        "Abra o endereço do release com /docs no fim. Confira duas coisas: o corpo de POST /atendimentos/orquestrador tem o campo idUsuario (já deve ter), e existe a rota POST /atendimentos/assuntos-em-aberto. Se a rota não aparecer, avise a Nicole: a T5 a T7 dependem dela, e você pode adiantar a T3 e a T4 enquanto isso.",
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
          "rotulo": "A rota POST /atendimentos/assuntos-em-aberto aparece no /docs do release? (sim ou não)"
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
      "entregavel": "Preencha os campos da seção \"Entrega\": o nome da cópia, se a rota dos assuntos em aberto aparece no /docs do release, o chatId do teste e o que ficou faltando.",
      "pronto_quando": [
        "Você tem acesso ao construtor da Tykhe.",
        "A cópia TESTE MULTIFLUXO existe, com todos os nós de API apontando para o release.",
        "O /docs do release foi conferido (idUsuario e a rota dos assuntos em aberto).",
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
          "esperado": "Sem pergunta de CPF no começo. Aparece \"Pode ser assim?\". O assunto do processo fica guardado para esse idUsuario."
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
      "atualizada_em": "2026-11-11",
      "atualizacao": "sem a pergunta do CPF no começo; a Maria reconhece a pessoa pelo idUsuario",
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
      "contexto": "Quando o relato tem dois assuntos ou mais, antes de abrir qualquer fluxo a Maria propõe a ordem: \"Entendi. Você falou de duas coisas: … Vou começar pela … Pode ser assim?\". A pergunta chega no mesmo formato da desambiguação de hoje, sem flowId, e a resposta volta para a mesma rota. A ordem padrão é saúde, violência doméstica, pessoa presa e depois o resto. Com Não e três assuntos ou mais, a Maria pergunta qual vem primeiro. Com Não e dois assuntos, ela troca a ordem. Atualizado em 12/11, depois da sua entrega: o nó de sim/não da Tykhe não aceita texto livre, então a pessoa usa só os botões no \"Pode ser assim?\" e digita o assunto só na pergunta \"Qual você quer resolver primeiro?\". Esse caminho já funcionou no seu caso 3. Nada muda na Maria.",
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
        "Não se aplica na Tykhe (atualizado em 12/11): o nó de sim/não só aceita os botões. Pode marcar este passo como feito; a pessoa escolhe a ordem pelo \"Não\" e pela pergunta do passo 5.",
        "Para tipoResposta texto sem flowId (\"Qual você quer resolver primeiro?\" e a desambiguação de hoje), use um nó de texto comum: mostre o texto e mande o que a pessoa escrever para POST /atendimentos/orquestrador, com o mesmo chatId.",
        "Quando a resposta vier com flowId, siga como hoje, pelo fluxo da Maria (POST /atendimentos/respostas).",
        "Rode os três casos abaixo e anote o chatId de cada um. Falta só isto da sua entrega de 11/11: os três casos já funcionaram.",
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
          "esperado": "Aparece \"Tudo bem. Qual você quer resolver primeiro?\" com a lista, num nó de texto. Escrevendo \"o horário\", a Maria começa por ele. No \"Pode ser assim?\", a pessoa só toca nos botões: escrever ali dá \"Não encontrei uma opção adequada\" na Tykhe, e isso é esperado."
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
      "atualizada_em": "2026-11-12",
      "atualizacao": "no \"Pode ser assim?\", só os botões; o passo 4 não se aplica na Tykhe",
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
      "titulo": "Tykhe 4/7: conversa nova sem pergunta, retomada e lista dos assuntos em aberto",
      "urgente": true,
      "prioridade": "maxima",
      "fase": "m0",
      "descricao": "Preparar a cópia para a conversa nova de quem já tem assunto guardado: a Maria não pergunta nada no começo, retoma sozinha o assunto guardado e mostra a lista quando a pessoa pede.",
      "objetivo": "A pessoa vem resolver alguma coisa. A Maria segue com o que ela contou e só mostra os assuntos em aberto quando ela pede ou quando um assunto termina (T6 e T7).",
      "contexto": "Mudou em 11/11 (PR #455): a pergunta dos assuntos guardados no começo saiu. Agora, com o idUsuario (T3): se o que a pessoa contou é um assunto que já estava guardado, a Maria retoma esse assunto, e a 1ª pergunta do fluxo vem depois de \"Você já tinha esse assunto com a gente: … Vamos continuar.\". Se a pessoa pede para ver os assuntos (\"quero ver meus assuntos\", \"o que ficou pendente\"), a Maria mostra a lista \"Qual você quer resolver agora?\". Na Tykhe, quase tudo já funciona com o que a T4 montou: falta tratar a lista (tipoResposta opcoes) e o pedido do assunto novo.",
      "tempo": "Cerca de 2 horas",
      "issues_maria": [
        450,
        451
      ],
      "depende_de": [
        "T2",
        "T3",
        "T4"
      ],
      "identificadores": [
        {
          "nome": "status: \"em_andamento\", sem flowId",
          "onde": "Resposta de POST /atendimentos/orquestrador",
          "como": "É uma pergunta do orquestrador, e não de um fluxo. A resposta volta para a mesma rota, com o mesmo chatId."
        },
        {
          "nome": "tipoResposta: \"opcoes\"",
          "onde": "Na mesma resposta, quando a pessoa pediu para ver os assuntos",
          "como": "É a lista \"Qual você quer resolver agora?\": mostrar cada item de opcoes como botão ou lista."
        },
        {
          "nome": "\"Nenhum, quero um assunto novo\"",
          "onde": "Sempre a última opção da lista",
          "como": "A Maria pergunta \"Pode me contar o que você precisa?\"."
        },
        {
          "nome": "\"Pode me contar o que você precisa?\"",
          "onde": "Resposta com tipoResposta: \"texto\", sem flowId, no começo da conversa",
          "como": "Mostrar e mandar o que a pessoa escrever para POST /atendimentos/orquestrador, com o MESMO chatId (como na desambiguação)."
        },
        {
          "nome": "\"Você já tinha esse assunto com a gente\"",
          "onde": "Começo do campo resposta, com flowId",
          "como": "A Maria retomou um assunto guardado. Na Tykhe, nada muda: é um fluxo da Maria como os outros."
        },
        {
          "nome": "\"Agora vamos falar …\"",
          "onde": "Começo do campo resposta, depois de escolher na lista",
          "como": "O assunto escolhido abriu. Pode vir com flowId (fluxo da Maria) ou com status \"redirecionado\" e tipoCaso (assunto da Tykhe)."
        }
      ],
      "passos": [
        "Na cópia, confira que a 1ª mensagem de quem já tem assunto guardado segue direto, sem pergunta: nada a montar, só testar (casos 1 e 2).",
        "Para a lista, crie a condição: status em_andamento, sem flowId e tipoResposta opcoes. Mostre o texto do campo resposta inteiro (ele pode ter os grupos \"Urgente:\" e \"Menos urgente:\") e as opções como botões ou lista.",
        "Mande o texto exato do botão escolhido para POST /atendimentos/orquestrador, com o mesmo chatId. O número da opção (1, 2, 3) também vale.",
        "Se a resposta seguinte vier com flowId, siga pelo fluxo da Maria; se vier com status redirecionado, siga pelo tipoCaso, como hoje.",
        "\"Pode me contar o que você precisa?\" no começo da conversa é uma pergunta de texto do orquestrador: mostre e mande a resposta da pessoa para a mesma rota, com o mesmo chatId.",
        "Rode os casos abaixo e anote o chatId de cada conversa.",
        "Terminou? Preencha os campos da seção \"Entrega\" e clique em \"📬 Enviar entrega\".",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "casos_teste": [
        {
          "relato": "Conversa A, com o idUsuario teste-marcelle-2: \"meu filho foi preso e eu queria saber como está o meu processo de pensão\". Toque em Sim e leve a pessoa presa até o fim.",
          "esperado": "No fim, o resumo da conversa (\"Resumo da nossa conversa: • A pessoa presa: dados confirmados e encaminhados (código …)\") e \"Ainda em aberto: • O seu processo · menos urgente · em aberto até dd/mm · ainda não começou\" (os botões são da T6)."
        },
        {
          "relato": "Conversa B, chatId novo e o mesmo idUsuario: \"queria saber como está o meu processo\"",
          "esperado": "Sem pergunta: a Maria retoma o assunto guardado e devolve redirecionado com tipoCaso andamento-processo."
        },
        {
          "relato": "Conversa C, chatId novo e o mesmo idUsuario teste-marcelle-2, depois de refazer a conversa A: \"quero ver meus assuntos\"",
          "esperado": "Aparece \"Qual você quer resolver agora?\" com \"O seu processo\" e \"Nenhum, quero um assunto novo\". Escolhendo \"O seu processo\", vem redirecionado com tipoCaso andamento-processo."
        },
        {
          "relato": "Conversa D: \"quero ver meus assuntos\" e depois \"Nenhum, quero um assunto novo\"",
          "esperado": "Aparece \"Pode me contar o que você precisa?\". A resposta segue como uma conversa nova (por exemplo, \"meu irmão foi preso\" abre a pessoa presa)."
        },
        {
          "relato": "Conversa E, com um idUsuario sem nada guardado: \"quero ver meus assuntos\"",
          "esperado": "Aparece \"Você não tem assuntos em aberto. Pode me contar o que você precisa?\"."
        }
      ],
      "campos_entrega": [
        {
          "id": "conversaA",
          "rotulo": "Conversa A: chatId e a mensagem do fim"
        },
        {
          "id": "conversaB",
          "rotulo": "Conversa B: chatId e o que aconteceu"
        },
        {
          "id": "conversaC",
          "rotulo": "Conversa C: chatId, a lista que apareceu e o resultado da escolha"
        },
        {
          "id": "conversaD",
          "rotulo": "Conversa D: chatId e o que aconteceu"
        },
        {
          "id": "conversaE",
          "rotulo": "Conversa E: chatId e o que aconteceu"
        },
        {
          "id": "pendente",
          "rotulo": "O que não deu certo ou ficou faltando"
        }
      ],
      "entregavel": "Preencha os campos da seção \"Entrega\" com o chatId e o resultado de cada conversa e o que ficou faltando.",
      "pronto_quando": [
        "A conversa nova de quem tem assunto guardado segue sem pergunta.",
        "O assunto guardado do mesmo tipo é retomado sozinho.",
        "A lista aparece com as opções, e a escolha volta para a Maria com o mesmo chatId.",
        "\"Nenhum\" leva ao \"Pode me contar o que você precisa?\", e a resposta abre o assunto novo."
      ],
      "cuidados": [
        "Esta tarefa precisa do PR #455 no release (confira na T2). Sem ele, a Maria ainda faz a pergunta antiga dos guardados no começo.",
        "Teste só no release e só na cópia do fluxo (TESTE MULTIFLUXO). Não altere o fluxo da produção nem o fluxo que a equipe usa.",
        "Nunca coloque na entrega nem no arquivo salvo a chave da API da Maria, nem print do nó de API com o cabeçalho Authorization: o repositório do guia é público.",
        "Use só relatos inventados. O idUsuario de teste também é inventado (por exemplo, teste-marcelle-1). Nunca use CPF, telefone nem o id de uma pessoa real.",
        "Travou mais de 30 minutos num passo? Avise a Nicole e siga para o próximo.",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "lancada_por": "Nicole",
      "lancada_em": "2026-11-11",
      "atualizada_em": "2026-11-11",
      "atualizacao": "a conversa nova não começa com pergunta, e a Maria retoma sozinha o assunto guardado",
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
      "titulo": "Tykhe 5/7: no fim do assunto, a urgência, o resumo da conversa e os botões",
      "urgente": true,
      "prioridade": "maxima",
      "fase": "m0",
      "descricao": "Na resposta final de cada assunto, ler a urgência do próximo e, quando vierem, mostrar os botões de opcoesDoFim: um por assunto em aberto, \"Falar de um assunto novo\" e \"Encerrar a conversa\".",
      "objetivo": "O assunto urgente da conversa abre logo. Quando não há urgente na vez, a pessoa vê, uma vez só e no fim, o resumo do que foi atendido e o que ainda está em aberto, e escolhe: continuar um assunto, falar de um novo ou encerrar.",
      "contexto": "Quando um assunto termina em concluido, a resposta final pode trazer assuntosPendentes (os outros assuntos desta conversa, cada um com urgencia). Com um urgente na vez, o texto avisa \"Ainda falta um assunto urgente: … Vamos falar dele agora.\", e o fim da conversa fica para o fim dele. Sem urgente na vez, vem o fim da conversa: o texto traz \"Resumo da nossa conversa:\" (cada assunto atendido, com o desfecho e um código de 6 letras e números), \"Quer continuar com algum desses assuntos ou encerrar a conversa?\" e \"Ainda em aberto:\" (urgência, \"em aberto até dd/mm\" e a fase). Os campos: resumoDaConversa, assuntosEmAberto (só quando há) e opcoesDoFim (sempre). Sem nada em aberto, a pergunta é \"Quer falar de um assunto novo ou encerrar a conversa?\", e os botões são só esses dois.",
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
          "como": "O assunto terminou bem. Só aqui vêm a abertura do urgente e os botões."
        },
        {
          "nome": "status: \"handoff_humano\"",
          "onde": "Resposta final",
          "como": "A pessoa vai para o atendimento humano. Não abrir nada; mostrar os nomes de assuntosPendentes na nota para quem vai atender."
        },
        {
          "nome": "assuntosPendentes[0].urgencia",
          "onde": "Resposta final, só com outro assunto nesta conversa",
          "como": "\"urgente\": abrir o próximo agora (T7). Nesse caso não vêm os botões."
        },
        {
          "nome": "opcoesDoFim",
          "onde": "Resposta final concluido, sem urgente na vez",
          "como": "Os botões, na ordem: um por assunto em aberto (por exemplo, \"O seu processo\"), \"Falar de um assunto novo\" e, por último, \"Encerrar a conversa\". Mostrar como botões; o que cada um faz está na T7."
        },
        {
          "nome": "assuntosEmAberto",
          "onde": "Junto de opcoesDoFim, quando há assunto em aberto",
          "como": "A lista das pendências, na ordem dos botões: nome, urgencia, chatIdAssunto (o id do assunto), codigo, fase e venceEm (a data em que o guardado vence). Guardar numa variável; a T7 usa."
        },
        {
          "nome": "chatIdAssunto",
          "onde": "Cada item de assuntosEmAberto",
          "como": "O id do assunto (por exemplo, <chatId>-assunto-2). É o que abre aquele assunto na rota do próximo assunto (T7)."
        },
        {
          "nome": "resumoDaConversa",
          "onde": "Resposta final concluido, sem urgente na vez",
          "como": "O resumo, um item por assunto atendido: nome, desfecho e codigo. O texto já vem em resposta; o campo serve para a nota do atendimento, se quiser. O codigo (6 letras e números) leva a equipe ao assunto."
        }
      ],
      "passos": [
        "Na cópia, no ponto em que o fluxo da Maria termina, guarde numa variável o assuntosPendentes, o opcoesDoFim, o assuntosEmAberto e o resumoDaConversa da resposta final.",
        "Mostre sempre o texto do campo resposta inteiro: ele já traz o resumo, o que está em aberto e a pergunta.",
        "Crie a condição: status concluido e assuntosPendentes[0].urgencia igual a \"urgente\". Nesse caminho, siga para \"abrir o próximo\" (T7).",
        "Crie a condição: status concluido e opcoesDoFim existe. Nesse caminho, mostre um botão para cada item de opcoesDoFim, na ordem. O que cada botão faz segue na T7.",
        "Sem urgente e sem opcoesDoFim (atendimento que não passou pelo orquestrador), encerre como hoje.",
        "Com status handoff_humano, não abra nada: escreva os nomes de assuntosPendentes na nota para o atendimento humano.",
        "Rode os casos abaixo e anote o chatId de cada um.",
        "Terminou? Preencha os campos da seção \"Entrega\" e clique em \"📬 Enviar entrega\".",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "casos_teste": [
        {
          "relato": "meu filho foi preso e eu queria saber como está o meu processo de pensão (Sim; leve a pessoa presa até o fim)",
          "esperado": "Fim concluido com \"Resumo da nossa conversa: • A pessoa presa: dados confirmados e encaminhados (código …)\", \"Quer continuar com algum desses assuntos ou encerrar a conversa?\" e \"Ainda em aberto: • O seu processo · menos urgente · em aberto até dd/mm · ainda não começou\". Aparecem três botões: \"O seu processo\", \"Falar de um assunto novo\" e \"Encerrar a conversa\"."
        },
        {
          "relato": "meu marido me ameaçou ontem e meu irmão foi preso semana passada (Sim; leve o 1º assunto até o fim)",
          "esperado": "Se o 1º terminar em concluido: \"Ainda falta um assunto urgente: a pessoa presa. Vamos falar dele agora.\", sem resumo e sem botões, e a Tykhe segue para \"abrir o próximo\". O resumo (com os dois assuntos) e os botões vêm no fim da pessoa presa. A violência doméstica aparece como \"a situação que você contou\", sem a palavra violência."
        },
        {
          "relato": "meu irmão foi preso e o plano negou a cirurgia da minha mãe (Sim; no plano, responda 3 vezes sem mandar a foto da carteirinha)",
          "esperado": "Termina em handoff_humano: nada abre, sem botões, e \"a pessoa presa\" vai na nota do atendimento humano."
        }
      ],
      "campos_entrega": [
        {
          "id": "caso1",
          "rotulo": "Caso 1 (resumo e botões): chatId e o que aconteceu"
        },
        {
          "id": "caso2",
          "rotulo": "Caso 2 (urgente na vez): chatId, o status do fim e o que aconteceu"
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
        "Com concluido e um urgente na vez, o fluxo segue para \"abrir o próximo\", sem botões.",
        "Com opcoesDoFim, aparece um botão por item, com \"Encerrar a conversa\" por último.",
        "Com handoff_humano, nada abre, e os nomes vão na nota.",
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
      "atualizada_em": "2026-11-11",
      "atualizacao": "resumo da conversa no fim e um botão por assunto em aberto, mais \"Encerrar a conversa\"",
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
      "titulo": "Tykhe 6/7: abrir o próximo assunto, os botões do fim e o encerrar",
      "urgente": true,
      "prioridade": "maxima",
      "fase": "m0",
      "descricao": "Ligar os caminhos que saem do fim do assunto: o urgente abre pela rota do próximo assunto; o botão de um assunto em aberto abre esse assunto; \"Falar de um assunto novo\" começa outra conversa; \"Encerrar a conversa\" fecha.",
      "objetivo": "A pessoa resolve o que ainda falta sem repetir o que já contou, escolhendo um assunto em aberto, começando um assunto novo ou encerrando a conversa.",
      "contexto": "Quem cria o chatId de cada assunto é a Maria (<chatId>-assunto-2, -3). A Tykhe só manda o chatId da conversa. Os botões do fim e o próximo urgente vão todos para POST /atendimentos/proximo-assunto: sem resposta, abre o próximo da fila; com \"resposta\" igual ao texto do botão, abre o assunto escolhido ou, com \"Encerrar a conversa\", fecha. O assunto novo é uma conversa nova no orquestrador, com chatId novo e o mesmo idUsuario. A rota POST /atendimentos/assuntos-em-aberto continua existindo para mostrar a lista em outro momento, mas os botões do fim não precisam dela.",
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
          "onde": "Rota, só no release",
          "como": "Corpo {\"chatId\": \"<chatId da conversa>\"} abre o próximo da fila (o urgente da T6). Com \"resposta\": \"<texto do botão>\" (ou \"assunto\": \"<chatIdAssunto>\"), abre o escolhido."
        },
        {
          "nome": "chatId (na resposta)",
          "onde": "Resposta da rota do próximo assunto",
          "como": "O chatId do assunto aberto. Use esse daí em diante, em todas as chamadas desse assunto."
        },
        {
          "nome": "\"Encerrar a conversa\"",
          "onde": "Último botão de opcoesDoFim",
          "como": "POST /atendimentos/proximo-assunto com {\"chatId\": \"<chatId da conversa>\", \"resposta\": \"Encerrar a conversa\"}. A Maria devolve \"Combinado. … Quando quiser, é só voltar a falar com a gente.\", com status concluido e sem _links.responder: mostrar e encerrar. Os assuntos guardados continuam guardados."
        },
        {
          "nome": "POST /atendimentos/assuntos-em-aberto",
          "onde": "Rota, só no release (opcional)",
          "como": "Corpo {\"chatId\": \"<chatId da conversa>\"}. Devolve a lista \"Qual você quer resolver agora?\". Os botões do fim não precisam dela; serve se a Tykhe quiser mostrar a lista em outro momento."
        },
        {
          "nome": "_links.responder.href: \"/atendimentos/proximo-assunto\"",
          "onde": "Resposta da lista (rota dos assuntos em aberto)",
          "como": "A escolha da pessoa vai para a rota do próximo assunto, com \"resposta\": o texto do botão."
        },
        {
          "nome": "\"Nenhum, quero um assunto novo\"",
          "onde": "Última opção da lista (rota dos assuntos em aberto)",
          "como": "A Maria devolve \"Pode me contar o que você precisa?\" com _links.responder.href \"/atendimentos/orquestrador\": abrir uma CONVERSA NOVA."
        },
        {
          "nome": "Conversa nova",
          "onde": "Botão \"Falar de um assunto novo\" (ou \"Nenhum\" na lista)",
          "como": "POST /atendimentos/orquestrador com chatId NOVO, o texto da pessoa como mensagem e o mesmo idUsuario."
        },
        {
          "nome": "status: \"redirecionado\" e tipoCaso",
          "onde": "Resposta da rota do próximo assunto",
          "como": "Assunto da Tykhe: mandar para o fluxo da Tykhe daquele tipo, como hoje."
        },
        {
          "nome": "404 e 409",
          "onde": "Resposta da rota do próximo assunto",
          "como": "404: nada a abrir (encerre). 409: assunto já atendido (encerre ou mostre a lista de novo)."
        }
      ],
      "passos": [
        "Crie o nó de API POST /atendimentos/proximo-assunto no release, com o corpo {\"chatId\": \"<chatId da conversa>\"}. Ligue ao caminho \"abrir o próximo\" da T6 (urgente na vez).",
        "Guarde o chatId que vem na resposta numa variável própria e use em todas as chamadas desse assunto. Com flowId, siga pelo fluxo; com redirecionado, pelo tipoCaso; com 404, encerre.",
        "Ligue os botões de assunto da T6 (todos menos os dois últimos) a POST /atendimentos/proximo-assunto com {\"chatId\": \"<chatId da conversa>\", \"resposta\": \"<texto do botão>\"}. Depois, igual ao passo 2.",
        "Ligue o botão \"Encerrar a conversa\" à mesma rota, com \"resposta\": \"Encerrar a conversa\". Mostre a resposta e encerre a conversa na Tykhe.",
        "Se a resposta for \"Pode me contar o que você precisa?\" (_links.responder para o orquestrador), ou se a pessoa tocar em \"Falar de um assunto novo\": mostre a pergunta e mande a resposta como conversa nova, POST /atendimentos/orquestrador com chatId novo, \"mensagem\" e o mesmo idUsuario.",
        "Quando o assunto aberto terminar, volte à T6 com a nova resposta final.",
        "Rode os casos abaixo e anote os chatId.",
        "Terminou? Preencha os campos da seção \"Entrega\" e clique em \"📬 Enviar entrega\".",
        "Não terminou até sexta (13/11)? Clique em \"💾 Salvar em arquivo (para o Ícaro)\", no fim deste cartão, e mande o arquivo ao Ícaro. Ele leva os passos que você marcou, o que você anotou e o que falta."
      ],
      "casos_teste": [
        {
          "relato": "meu marido me ameaçou ontem e meu irmão foi preso semana passada (Sim; leve o 1º assunto até o fim)",
          "esperado": "Se o 1º terminar em concluido, a Tykhe chama a rota sozinha: \"Agora vamos falar da pessoa presa.\", com o chatId terminado em -assunto-2, sem perguntar de novo o parentesco."
        },
        {
          "relato": "meu filho foi preso e eu queria saber como está o meu processo de pensão (Sim; pessoa presa até o fim; tocar no botão \"O seu processo\")",
          "esperado": "Vem redirecionado com tipoCaso andamento-processo e o chatId -assunto-2."
        },
        {
          "relato": "o mesmo caso, tocando em \"Falar de um assunto novo\" e escrevendo \"quero remarcar meu horário\"",
          "esperado": "A Tykhe abre uma conversa nova (chatId novo, mesmo idUsuario), e a Maria redireciona para agendamentos."
        },
        {
          "relato": "o mesmo caso, chamando a rota do próximo assunto duas vezes com a mesma escolha",
          "esperado": "As duas respostas trazem o mesmo chatId, sem abrir outro atendimento."
        },
        {
          "relato": "o mesmo caso, com um idUsuario de teste, tocando em \"Encerrar a conversa\"",
          "esperado": "\"Combinado. Seus assuntos em aberto ficam guardados por até 30 dias. Quando quiser, é só voltar a falar com a gente.\", com status concluido. Numa conversa nova com o mesmo idUsuario, \"quero ver meus assuntos\" ainda mostra \"O seu processo\"."
        }
      ],
      "campos_entrega": [
        {
          "id": "caso1",
          "rotulo": "Caso 1 (urgente): chatId da conversa, chatId do 2º assunto e o que aconteceu"
        },
        {
          "id": "caso2",
          "rotulo": "Caso 2 (botão de um assunto): chatId e o que aconteceu"
        },
        {
          "id": "caso3",
          "rotulo": "Caso 3 (assunto novo): chatId da conversa nova e o que aconteceu"
        },
        {
          "id": "caso4",
          "rotulo": "Caso 4 (duas chamadas): o que voltou em cada uma"
        },
        {
          "id": "caso5",
          "rotulo": "Caso 5 (encerrar): chatId e o que aconteceu"
        },
        {
          "id": "pendente",
          "rotulo": "O que não deu certo ou ficou faltando"
        }
      ],
      "entregavel": "Preencha os campos da seção \"Entrega\" com os chatId e o resultado de cada caso e o que ficou faltando.",
      "pronto_quando": [
        "O urgente abre pela rota do próximo assunto, e o chatId devolvido é usado daí em diante.",
        "O botão de um assunto em aberto abre o assunto certo.",
        "\"Falar de um assunto novo\" abre uma conversa nova com o mesmo idUsuario.",
        "\"Encerrar a conversa\" fecha, e os assuntos guardados continuam guardados.",
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
      "atualizada_em": "2026-11-11",
      "atualizacao": "o botão de cada assunto abre direto, e entrou o \"Encerrar a conversa\"",
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
          "esperado": "Sem pergunta no começo; \"Pode ser assim?\" com botões; 1º assunto até o fim; se concluido, \"Ainda falta um assunto urgente: a pessoa presa\" e o 2º abre sozinho, com o chatId -assunto-2."
        },
        {
          "relato": "2. meu filho foi preso e eu queria saber como está o meu processo de pensão",
          "esperado": "A pessoa presa até o fim; o resumo da conversa, \"Ainda em aberto: • O seu processo · menos urgente · em aberto até dd/mm · ainda não começou\" e os botões \"O seu processo\", \"Falar de um assunto novo\" e \"Encerrar a conversa\"."
        },
        {
          "relato": "3. No fim do caso 2, tocar em \"O seu processo\" (e, numa repetição do caso 2, em \"Encerrar a conversa\")",
          "esperado": "\"O seu processo\": vem redirecionado com tipoCaso andamento-processo. \"Encerrar a conversa\": \"Combinado. Seus assuntos em aberto ficam guardados por até 30 dias…\"."
        },
        {
          "relato": "4. Conversa nova com o mesmo idUsuario, depois de refazer o caso 2: \"queria saber como está o meu processo\"",
          "esperado": "Sem pergunta: a Maria retoma o assunto guardado e redireciona para andamento-processo."
        },
        {
          "relato": "5. meu irmão foi preso e o plano negou a cirurgia da minha mãe (no plano, 3 respostas sem a foto)",
          "esperado": "Termina em handoff_humano; nada abre, sem botões, e \"a pessoa presa\" vai para o atendimento humano."
        },
        {
          "relato": "6. o plano negou a minha cirurgia (com um idUsuario sem nada guardado)",
          "esperado": "Sem \"Pode ser assim?\" e sem próximo assunto. Se terminar em concluido, o resumo com um assunto e \"Quer falar de um assunto novo ou encerrar a conversa?\", com esses dois botões. Se terminar em handoff_humano, como hoje."
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
      "atualizada_em": "2026-11-11",
      "atualizacao": "os casos 2, 3 e 6 esperam o fim novo da conversa",
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

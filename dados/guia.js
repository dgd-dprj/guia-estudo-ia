window.GUIA = {
  "versao": "2026-11-09-jogo",
  "titulo": "Jornada IA da Marcelle",
  "subtitulo": "Estude, pratique e suba de nível com missões reais da Maria",
  "repositorio_maria": "https://github.com/dgd-dprj/maria-langgraph-pp",
  "perfil": {
    "objetivo": "Trabalhar com desenvolvimento de IA: aplicações com LLMs que funcionam em produção, com custo, qualidade e segurança medidos.",
    "ritmo": "Cada módulo leva cerca de uma semana: metade estudo, metade tarefa. O ritmo pode mudar depois da conversa com a Nicole.",
    "ja_sabe": [
      {
        "tema": "Docker",
        "uso_aqui": "A Maria roda em contêiner. Você vai ler o Dockerfile e o deploy no ECS."
      },
      {
        "tema": "AWS: S3, Lambda, ECR e Bedrock",
        "uso_aqui": "A Maria usa o Bedrock (Claude Haiku 4.5), guarda a imagem no ECR e manda o e-mail do NUDECON por uma Lambda."
      },
      {
        "tema": "SOLID",
        "uso_aqui": "Funções pequenas e com uma responsabilidade, como em orquestrador/fila.py e shared/parentesco.py."
      },
      {
        "tema": "Clean Architecture",
        "uso_aqui": "As pastas da Maria seguem camadas: rotas (api), casos de uso (orquestrador e fluxos), adaptadores (ia e integracoes)."
      },
      {
        "tema": "SDD (desenvolvimento guiado por especificação)",
        "uso_aqui": "A equipe escreve a issue com critérios e a spec antes do código. Você vai fazer isso em toda tarefa."
      },
      {
        "tema": "RAG",
        "uso_aqui": "Ponto de partida do módulo 6: RAG em produção, com busca híbrida e avaliação da recuperação."
      }
    ],
    "a_desenvolver": [
      "Python tipado, assíncrono e testado (pytest)",
      "LLMs na prática: tokens, custo, saída estruturada e uso de ferramentas",
      "Engenharia de prompt para quem escreve informal e com erros",
      "LangGraph: conversas com estado, pausa e retomada",
      "Avaliação de IA: conjunto de teste, métricas, variação entre rodadas",
      "RAG em produção: busca híbrida e avaliação da recuperação",
      "Observabilidade e confiabilidade de IA (logs, latência, falhas)",
      "Segurança de IA e LGPD",
      "Agentes, ferramentas e MCP: quando a IA decide e quando o código decide",
      "Git e GitHub no fluxo da equipe (issue, branch, PR, revisão)"
    ]
  },
  "maria": {
    "o_que_e": "A Maria é a assistente da Defensoria Pública do RJ. A pessoa conversa pelo WhatsApp, por meio da Tykhe (a plataforma de atendimento). A Tykhe chama a API da Maria, que entende o relato, escolhe o fluxo certo e faz as perguntas até encaminhar o caso.",
    "stack": [
      "Python",
      "FastAPI",
      "LangGraph",
      "Amazon Bedrock (Claude Haiku 4.5)",
      "Postgres (checkpoint e pgvector)",
      "ECS Fargate e ECR",
      "Terraform",
      "GitHub Actions"
    ],
    "camadas": [
      {
        "pasta": "src/maria/api",
        "papel": "Rotas HTTP e contrato com a Tykhe (como os controllers da Clean Architecture)."
      },
      {
        "pasta": "src/maria/orquestrador",
        "papel": "Triagem do relato: classifica, desambigua e monta a fila de assuntos do multi-fluxo."
      },
      {
        "pasta": "src/maria/fluxos",
        "papel": "Um grafo por fluxo: pessoa presa, violência doméstica e plano de saúde (este só no release)."
      },
      {
        "pasta": "src/maria/ia",
        "papel": "Chamadas à IA: classificação, desambiguação, sumarização e necessidades, sempre com saída estruturada."
      },
      {
        "pasta": "src/maria/integracoes",
        "papel": "Sistemas de fora: o Verde (sistema da Defensoria) e o e-mail do NUDECON."
      },
      {
        "pasta": "src/maria/shared",
        "papel": "Peças comuns: leitura de sim e não, parentesco, logger, checkpoint."
      },
      {
        "pasta": "tests",
        "papel": "Testes automatizados. A IA é simulada; os testes com a IA de verdade ficam em tests/integracao e só rodam com custo aprovado."
      },
      {
        "pasta": "docs",
        "papel": "Contrato com a Tykhe, guia de teste da homologação, fluxos."
      }
    ],
    "ambientes": [
      {
        "nome": "develop",
        "papel": "Dev: onde entram os PRs. Hoje ainda atualiza o release."
      },
      {
        "nome": "staging",
        "papel": "QA: vai alimentar o release (homologação) quando a #427 for ligada."
      },
      {
        "nome": "main",
        "papel": "Produção: atendimento real. Só por promoção, no horário combinado."
      }
    ],
    "comecar_por": [
      {
        "arquivo": "README.md",
        "porque": "Visão geral e variáveis de ambiente."
      },
      {
        "arquivo": "CONTRIBUTING.md",
        "porque": "Branches, PRs e proteções."
      },
      {
        "arquivo": "docs/contrato-tykhe.md",
        "porque": "O que a Tykhe manda e recebe."
      },
      {
        "arquivo": "docs/fluxo-orquestrador.md",
        "porque": "Como a triagem funciona."
      },
      {
        "arquivo": "docs/rodar-localmente.md",
        "porque": "Como subir a Maria na sua máquina."
      }
    ]
  },
  "regras": [
    {
      "titulo": "Nunca dado real de assistido",
      "texto": "Use só relatos, nomes e dados inventados. CPF de teste só da lista da equipe ou do Verde de homologação, nunca gerado ao acaso. A homologação do Verde tem dados reais."
    },
    {
      "titulo": "O repositório é público",
      "texto": "Nunca coloque chave, senha, token ou dado pessoal em issue, PR, commit ou comentário."
    },
    {
      "titulo": "Custo de IA medido antes",
      "texto": "Antes de qualquer chamada paga, meça o tamanho real com count_tokens (não gera resposta nem cobra). Leve à Nicole o número de chamadas, os tokens medidos e o custo. Se o custo real passar do aprovado, pare e avise."
    },
    {
      "titulo": "Nada direto na produção",
      "texto": "Toda mudança vai por PR para a develop, com testes, ruff e mypy verdes. A produção só recebe na promoção, no horário combinado."
    },
    {
      "titulo": "PR só com código",
      "texto": "Mudança só de texto (documentação, índice, specs) vai junto do próximo PR com código, num commit :books: docs:."
    },
    {
      "titulo": "Logs sem dado pessoal",
      "texto": "Nunca registre o texto do relato, CPF, e-mail, telefone ou link de imagem no log."
    },
    {
      "titulo": "Na dúvida, pergunte",
      "texto": "Regra que não ficou clara, ou mudança que muda o que a pessoa vê: fale com a Nicole antes."
    }
  ],
  "modulos": [
    {
      "id": "m0",
      "semana": "Semana 1",
      "titulo": "Conhecer a Maria",
      "objetivo": "Entender o que a Maria faz, como o código se organiza e como a equipe trabalha.",
      "ponte": "Use a Clean Architecture para ler as pastas da Maria (veja \"Mapa da Maria\") e o SDD para ler as issues: cada uma tem contexto, critérios de aceitação e o que fica de fora.",
      "tempo": "Estudo ~8 h · tarefa ~8 h",
      "estudar": [
        {
          "titulo": "Mapa da Maria (nesta plataforma)",
          "link": "#/maria",
          "porque": "Camadas, ambientes e por onde começar."
        },
        {
          "titulo": "README e CONTRIBUTING da Maria",
          "link": "https://github.com/dgd-dprj/maria-langgraph-pp",
          "porque": "Visão geral, branches e PRs."
        },
        {
          "titulo": "Contrato com a Tykhe (docs/contrato-tykhe.md)",
          "link": "https://github.com/dgd-dprj/maria-langgraph-pp/blob/develop/docs/contrato-tykhe.md",
          "porque": "O que entra e o que sai da API."
        },
        {
          "titulo": "Pro Git, capítulos 1 a 3",
          "link": "https://git-scm.com/book/pt-br/v2",
          "porque": "Commit, branch e merge, se ainda não usa no dia a dia."
        }
      ],
      "checar": [
        "Qual a diferença entre o release e a produção?",
        "Por que existe o orquestrador antes dos fluxos?",
        "O que a Tykhe manda em dadosConhecidos?",
        "O que acontece com um assunto que a Maria não atende?"
      ],
      "praticar": "Subir a Maria na sua máquina (docs/rodar-localmente.md) e rodar a suíte de testes com uv run pytest.",
      "tarefa": {
        "titulo": "Ler e explicar 3 issues de IA",
        "issues": [
          414,
          299,
          212
        ],
        "descricao": "Para cada issue, escreva em poucas linhas: o problema, onde no código você mexeria e como saberia que resolveu. É um treino de SDD: sem código ainda.",
        "onde": "src/maria/ia e src/maria/orquestrador",
        "como_testar": "A Nicole revisa o seu texto.",
        "cuidado": "Nada de comentar nas issues ainda: mande o texto para a Nicole."
      },
      "pronto": [
        "A suíte de testes rodou verde na sua máquina.",
        "O texto das 3 issues foi revisado pela Nicole."
      ],
      "conquista": {
        "emoji": "🧭",
        "nome": "Exploradora da Maria"
      },
      "quiz": [
        {
          "pergunta": "Onde a equipe testa uma mudança antes da produção?",
          "opcoes": [
            "Na main",
            "No release (homologação)",
            "Direto no WhatsApp da produção",
            "No celular de quem é atendido"
          ],
          "correta": 1,
          "explicacao": "O release é a homologação. A main é a produção e só recebe na promoção, no horário combinado."
        },
        {
          "pergunta": "O que o orquestrador faz?",
          "opcoes": [
            "Envia o e-mail ao NUDECON",
            "Lê o relato e escolhe o fluxo, ou manda para a Tykhe",
            "Guarda as fotos da carteirinha",
            "Gera a chave da API"
          ],
          "correta": 1,
          "explicacao": "O orquestrador é a triagem: entende o relato e decide para onde a conversa vai."
        },
        {
          "pergunta": "Num teste, qual CPF você pode usar?",
          "opcoes": [
            "Um CPF gerado num site",
            "O CPF de alguém da família",
            "Só os CPFs de teste da equipe ou do Verde de homologação",
            "Qualquer CPF que passe na validação"
          ],
          "correta": 2,
          "explicacao": "Um CPF gerado ao acaso pode ser de uma pessoa real, e a homologação do Verde tem dados reais."
        }
      ]
    },
    {
      "id": "m1",
      "semana": "Semana 2",
      "titulo": "Python para IA, com testes",
      "objetivo": "Escrever Python tipado, assíncrono e testado, do jeito da Maria.",
      "ponte": "SOLID na prática: veja como orquestrador/fila.py separa ordem, texto e leitura da resposta em funções pequenas, cada uma com seus testes.",
      "tempo": "Estudo ~8 h · tarefa ~8 h",
      "estudar": [
        {
          "titulo": "Tutorial do Python (capítulos 4, 5 e 9)",
          "link": "https://docs.python.org/pt-br/3/tutorial/",
          "porque": "Controle de fluxo, estruturas de dados e classes."
        },
        {
          "titulo": "typing: TypedDict, Literal e NotRequired",
          "link": "https://docs.python.org/3/library/typing.html",
          "porque": "O estado dos grafos da Maria é TypedDict."
        },
        {
          "titulo": "asyncio, o básico",
          "link": "https://docs.python.org/3/library/asyncio.html",
          "porque": "As chamadas à IA e ao Verde são assíncronas."
        },
        {
          "titulo": "pytest: primeiros passos",
          "link": "https://docs.pytest.org/en/stable/getting-started.html",
          "porque": "Todos os testes da Maria."
        },
        {
          "titulo": "pytest: parametrize",
          "link": "https://docs.pytest.org/en/stable/how-to/parametrize.html",
          "porque": "Testar muitos relatos com um teste só."
        },
        {
          "titulo": "pytest: monkeypatch",
          "link": "https://docs.pytest.org/en/stable/how-to/monkeypatch.html",
          "porque": "Simular a IA e o Verde nos testes."
        }
      ],
      "checar": [
        "Quando usar TypedDict em vez de uma classe?",
        "O que o monkeypatch troca, e por que isso deixa o teste sem custo?",
        "Como um teste com parametrize ajuda a cobrir relatos com erro de digitação?"
      ],
      "praticar": "Escrever 10 casos novos de teste para src/maria/shared/respostas.py (sim e não escritos de jeitos diferentes) e rodar com pytest.",
      "tarefa": {
        "titulo": "Mensagem vazia no orquestrador",
        "issues": [
          303
        ],
        "descricao": "Hoje, mensagem vazia ou só de espaços vai para outros. Entenda o comportamento, escreva a spec curta do que deveria acontecer e implemente com testes.",
        "onde": "src/maria/api/orquestrador.py e tests/api",
        "como_testar": "uv run pytest, uv run ruff check e uv run mypy verdes.",
        "cuidado": "Muda o que a Tykhe recebe: combine com a Nicole antes de abrir o PR."
      },
      "pronto": [
        "Spec curta aprovada pela Nicole.",
        "PR para a develop com testes, ruff e mypy verdes."
      ],
      "conquista": {
        "emoji": "🐍",
        "nome": "Encantadora de Python"
      },
      "quiz": [
        {
          "pergunta": "Para que serve o monkeypatch nos testes da Maria?",
          "opcoes": [
            "Deixar o Python mais rápido",
            "Trocar a IA e o Verde por versões simuladas durante o teste",
            "Corrigir erros de digitação",
            "Abrir o PR"
          ],
          "correta": 1,
          "explicacao": "Com a IA e o Verde simulados, o teste roda sem custo e sem depender de sistema de fora."
        },
        {
          "pergunta": "O que o @pytest.mark.parametrize faz?",
          "opcoes": [
            "Roda o mesmo teste com vários valores de entrada",
            "Pula o teste",
            "Mede o tempo do teste",
            "Gera dados aleatórios"
          ],
          "correta": 0,
          "explicacao": "É o jeito de testar muitos relatos (com e sem erro de digitação) com um teste só."
        },
        {
          "pergunta": "Por que o estado dos grafos da Maria é um TypedDict?",
          "opcoes": [
            "Porque é mais rápido",
            "Porque o LangGraph cria um canal para cada chave declarada, e chave fora dele é descartada",
            "Porque o JSON exige",
            "Por causa do Docker"
          ],
          "correta": 1,
          "explicacao": "Na #442, um campo novo só funcionou depois de declarado no TypedDict do estado."
        }
      ]
    },
    {
      "id": "m2",
      "semana": "Semana 3",
      "titulo": "LLMs na prática: tokens, custo e Bedrock",
      "objetivo": "Entender o que custa e o que demora numa chamada de IA, e como a Maria força a IA a responder em formato fixo.",
      "ponte": "Você já usou o Bedrock: agora vai olhar por dentro a Converse API, o uso de ferramentas (tool use) para saída estruturada e a contagem de tokens.",
      "tempo": "Estudo ~8 h · tarefa ~8 h",
      "estudar": [
        {
          "titulo": "Bedrock: Converse API",
          "link": "https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html",
          "porque": "É a API que a Maria usa."
        },
        {
          "titulo": "Bedrock: uso de ferramentas (tool use)",
          "link": "https://docs.aws.amazon.com/bedrock/latest/userguide/tool-use.html",
          "porque": "A Maria usa uma ferramenta para obrigar a IA a devolver JSON."
        },
        {
          "titulo": "Claude: uso de ferramentas",
          "link": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview",
          "porque": "A mesma ideia, explicada por quem faz o modelo."
        },
        {
          "titulo": "Bedrock: cache de prompt",
          "link": "https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html",
          "porque": "Base da tarefa desta semana."
        },
        {
          "titulo": "Preços do Bedrock",
          "link": "https://aws.amazon.com/bedrock/pricing/",
          "porque": "Para converter tokens em reais."
        },
        {
          "titulo": "Código: src/maria/ia/_estruturado.py",
          "link": "https://github.com/dgd-dprj/maria-langgraph-pp/blob/develop/src/maria/ia/_estruturado.py",
          "porque": "Como a Maria chama a IA e lê os tokens gastos."
        }
      ],
      "checar": [
        "Qual a diferença entre tokens de entrada e de saída, e qual custa mais?",
        "Por que a Maria obriga a IA a usar uma ferramenta em vez de responder texto?",
        "Por que estimar tokens pelo número de caracteres não serve? (Veja o caso de 05/11 no CLAUDE.md da equipe: 1.200 estimados, 2.040 reais.)"
      ],
      "praticar": "Um script que mede, com count_tokens, o prompt da classificação para 5 relatos inventados. count_tokens não gera resposta nem cobra.",
      "tarefa": {
        "titulo": "Cache de prompt na classificação",
        "issues": [],
        "descricao": "A classificação nova usa cerca de 3.400 tokens por relato, quase todos de instrução repetida. Confirme se o Bedrock oferece cache de prompt para o Claude Haiku 4.5, calcule a economia com números medidos e escreva a proposta como spec.",
        "onde": "src/maria/ia/classificar_necessidades.py e src/maria/ia/_estruturado.py",
        "como_testar": "Números de count_tokens e cálculo de custo antes e depois.",
        "cuidado": "Nenhuma chamada paga sem a aprovação da Nicole, com o custo medido antes."
      },
      "pronto": [
        "Proposta com tokens medidos, custo por relato hoje e com cache.",
        "A Nicole aprovou (ou não) seguir para a implementação."
      ],
      "conquista": {
        "emoji": "🪙",
        "nome": "Contadora de Tokens"
      },
      "quiz": [
        {
          "pergunta": "No Claude Haiku 4.5, o que costuma custar mais por token?",
          "opcoes": [
            "Os tokens de entrada",
            "Os tokens de saída",
            "Custam igual",
            "Nenhum dos dois custa"
          ],
          "correta": 1,
          "explicacao": "A saída custa várias vezes mais que a entrada. Por isso a Maria pede respostas curtas e estruturadas."
        },
        {
          "pergunta": "Como medir o tamanho real de uma chamada sem pagar?",
          "opcoes": [
            "Contar os caracteres e dividir por 4",
            "Usar o count_tokens do Bedrock",
            "Rodar a chamada e olhar a fatura",
            "Perguntar à própria IA"
          ],
          "correta": 1,
          "explicacao": "O count_tokens mede com o prompt exato, sem gerar resposta. Estimar por caracteres já errou feio: 1.200 estimados, 2.040 reais."
        },
        {
          "pergunta": "Por que a Maria obriga a IA a usar uma ferramenta (tool use)?",
          "opcoes": [
            "Para a IA navegar na internet",
            "Para a resposta vir em JSON no formato fixo, fácil de validar",
            "Para sempre gastar menos tokens",
            "Para a IA lembrar conversas antigas"
          ],
          "correta": 1,
          "explicacao": "A ferramenta tem um JSON Schema; a resposta chega no formato certo e o código consegue conferir."
        }
      ]
    },
    {
      "id": "m3",
      "semana": "Semana 4",
      "titulo": "Engenharia de prompt e saída estruturada",
      "objetivo": "Escrever prompts que funcionam para quem escreve informal e com erros, e validar o que a IA devolve.",
      "ponte": "No SDD, a spec diz o que é certo antes do código. Aqui, os critérios de sucesso e os casos de teste vêm antes do prompt.",
      "tempo": "Estudo ~6 h · tarefa ~10 h",
      "estudar": [
        {
          "titulo": "Claude: engenharia de prompt (visão geral)",
          "link": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
          "porque": "Clareza, exemplos, papéis e formato."
        },
        {
          "titulo": "JSON Schema, passo a passo",
          "link": "https://json-schema.org/learn/getting-started-step-by-step",
          "porque": "A saída da IA na Maria é definida por JSON Schema."
        },
        {
          "titulo": "Código: src/maria/ia/desambiguar.py",
          "link": "https://github.com/dgd-dprj/maria-langgraph-pp/blob/develop/src/maria/ia/desambiguar.py",
          "porque": "O prompt da tarefa."
        },
        {
          "titulo": "Código: src/maria/ia/classificar_necessidades.py",
          "link": "https://github.com/dgd-dprj/maria-langgraph-pp/blob/develop/src/maria/ia/classificar_necessidades.py",
          "porque": "Um prompt longo com regras e a função _validar, que confere a saída."
        }
      ],
      "checar": [
        "Por que a saída da IA precisa ser validada antes de usar (#212)?",
        "Qual a diferença entre um prompt que classifica e um que gera texto para a pessoa?",
        "Como testar um prompt com relatos com erro de digitação?"
      ],
      "praticar": "Reescrever o prompt de desambiguação e comparar, em 10 relatos inventados e informais, a pergunta de antes e a de depois. Meça os tokens antes de rodar.",
      "tarefa": {
        "titulo": "Desambiguação clara para relato informal",
        "issues": [
          414,
          415,
          416
        ],
        "descricao": "A pergunta de desambiguação que a IA escreve confunde quem escreve informal. Use rótulos curtos por opção e um texto que não cite opções que a pessoa não vê.",
        "onde": "src/maria/ia/desambiguar.py, src/maria/orquestrador/graph.py",
        "como_testar": "Testes com a IA simulada e uma comparação com a IA de verdade em relatos inventados, com custo aprovado.",
        "cuidado": "Muda o que a pessoa lê: atualize o guia de teste e combine o horário com a Nicole."
      },
      "pronto": [
        "Comparação antes e depois com relatos inventados.",
        "PR com testes, guia de teste atualizado."
      ],
      "conquista": {
        "emoji": "✍️",
        "nome": "Domadora de Prompts"
      },
      "quiz": [
        {
          "pergunta": "A IA devolveu um id que não existe no catálogo. O que a classificação por necessidades faz?",
          "opcoes": [
            "Usa assim mesmo",
            "Descarta o item na validação (_validar)",
            "Derruba a API",
            "Pergunta para a pessoa"
          ],
          "correta": 1,
          "explicacao": "Saída de IA não é confiável por padrão: o código confere e joga fora o que não faz sentido (#212)."
        },
        {
          "pergunta": "Qual é o primeiro passo antes de mudar um prompt?",
          "opcoes": [
            "Trocar de modelo",
            "Definir os critérios de sucesso e os casos de teste",
            "Aumentar a temperatura",
            "Publicar no release"
          ],
          "correta": 1,
          "explicacao": "É o SDD aplicado à IA: primeiro o que é certo e como medir, depois o prompt."
        },
        {
          "pergunta": "Por que testar prompts com relatos informais e com erros?",
          "opcoes": [
            "Porque é assim que as pessoas escrevem no WhatsApp",
            "Para gastar menos",
            "Porque a IA só entende texto com erro",
            "Não precisa testar assim"
          ],
          "correta": 0,
          "explicacao": "No teste da Nicole, \"ta peso\" no lugar de \"preso\" e \"rodou\" no lugar de \"foi preso\" apareceram de verdade."
        }
      ]
    },
    {
      "id": "m4",
      "semana": "Semana 5",
      "titulo": "LangGraph: conversas com estado",
      "objetivo": "Entender grafos com estado, pausa para esperar a pessoa (interrupt) e retomada, como nos fluxos da Maria.",
      "ponte": "Na Clean Architecture, cada grafo é um caso de uso. A spec do fluxo (as perguntas e os desfechos) vem antes do grafo.",
      "tempo": "Estudo ~8 h · tarefa ~8 h",
      "estudar": [
        {
          "titulo": "LangGraph: conceitos (estado, nós, arestas)",
          "link": "https://langchain-ai.github.io/langgraph/concepts/low_level/",
          "porque": "A base de todos os fluxos."
        },
        {
          "titulo": "LangGraph: pessoa no meio do caminho (interrupt)",
          "link": "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/",
          "porque": "Cada pergunta da Maria é um interrupt."
        },
        {
          "titulo": "LangGraph: persistência (checkpointer)",
          "link": "https://langchain-ai.github.io/langgraph/concepts/persistence/",
          "porque": "Como a conversa continua entre mensagens."
        },
        {
          "titulo": "Código: src/maria/orquestrador/graph.py",
          "link": "https://github.com/dgd-dprj/maria-langgraph-pp/blob/develop/src/maria/orquestrador/graph.py",
          "porque": "Triagem e a pergunta \"Pode ser assim?\" do multi-fluxo."
        }
      ],
      "checar": [
        "O que acontece com o código antes de um interrupt quando a conversa é retomada?",
        "Por que uma chave que não está no TypedDict do estado some?",
        "Como o teste de topologia protege o desenho do grafo?"
      ],
      "praticar": "Desenhar em Mermaid o grafo do orquestrador e conferir com obter_grafo().get_graph().",
      "tarefa": {
        "titulo": "Relato vago ganha uma pergunta de esclarecimento",
        "issues": [
          299
        ],
        "descricao": "Hoje, relato muito vago vai direto para outros. Escreva a spec e implemente uma pergunta de esclarecimento antes de desistir, só no release.",
        "onde": "src/maria/orquestrador/graph.py e tests/orquestrador",
        "como_testar": "Testes do grafo com a IA simulada e o teste de topologia atualizado.",
        "cuidado": "Só no release (fluxo_em_teste_liga). A produção não pode mudar: escreva um teste que prove isso."
      },
      "pronto": [
        "Spec aprovada.",
        "PR com testes, incluindo o que prova que a produção não mudou."
      ],
      "conquista": {
        "emoji": "🕸️",
        "nome": "Tecelã de Grafos"
      },
      "quiz": [
        {
          "pergunta": "O que é um interrupt na Maria?",
          "opcoes": [
            "Um erro do grafo",
            "A pausa do grafo para esperar a resposta da pessoa",
            "O fim do atendimento",
            "Um alerta do CloudWatch"
          ],
          "correta": 1,
          "explicacao": "Cada pergunta da Maria é um interrupt: o grafo para, guarda o estado e espera."
        },
        {
          "pergunta": "Quando a conversa é retomada, o que acontece com o nó que tinha o interrupt?",
          "opcoes": [
            "Continua da linha seguinte, sem rodar nada de novo",
            "O nó roda de novo desde o começo, e o interrupt devolve a resposta",
            "O grafo recomeça do início",
            "Nada acontece"
          ],
          "correta": 1,
          "explicacao": "Por isso o código antes do interrupt não pode ter efeito colateral que não possa repetir."
        },
        {
          "pergunta": "O que o checkpointer guarda?",
          "opcoes": [
            "As senhas",
            "O estado da conversa entre uma mensagem e outra",
            "Os logs",
            "As fotos"
          ],
          "correta": 1,
          "explicacao": "É o que permite a pessoa responder horas depois e a conversa continuar de onde parou."
        }
      ]
    },
    {
      "id": "m5",
      "semana": "Semana 6",
      "titulo": "Avaliar IA: dados, métricas e variação",
      "objetivo": "Medir se a IA acerta, com conjunto de teste, rótulos e mais de uma rodada.",
      "ponte": "No SDD, os critérios de aceitação dizem quando está pronto. Na IA, eles viram métricas medidas num conjunto de casos.",
      "tempo": "Estudo ~6 h · tarefa ~10 h",
      "estudar": [
        {
          "titulo": "Claude: definir critérios de sucesso",
          "link": "https://docs.anthropic.com/en/docs/test-and-evaluate/define-success",
          "porque": "O que medir antes de mudar um prompt."
        },
        {
          "titulo": "Claude: criar avaliações",
          "link": "https://docs.anthropic.com/en/docs/test-and-evaluate/develop-tests",
          "porque": "Conjuntos de teste, avaliação por código e por outro modelo."
        },
        {
          "titulo": "Código: tests/integracao/ia/test_classificacao_necessidades.py",
          "link": "https://github.com/dgd-dprj/maria-langgraph-pp/blob/develop/tests/integracao/ia/test_classificacao_necessidades.py",
          "porque": "Um teste com a IA de verdade, com custo medido."
        }
      ],
      "checar": [
        "Por que rodar a mesma avaliação mais de uma vez? (Na Maria, a mesma frase sobre prótese foi uma vez para a Tykhe e outra para o plano.)",
        "Quando vale usar outro modelo como juiz, e qual o risco?",
        "Qual a diferença entre acurácia, precisão e recall numa classificação?"
      ],
      "praticar": "Calcular o acerto por fluxo de uma rodada gravada (a Nicole te passa o arquivo).",
      "tarefa": {
        "titulo": "Calibração e avaliação com relatos informais",
        "issues": [
          279,
          418
        ],
        "descricao": "Conferir os 20 casos de calibração e rodar a avaliação com os relatos informais (versão 2), com custo medido e aprovado. Entregar um relatório com o acerto por fluxo e os erros mais comuns.",
        "onde": "Material da Nicole (multi-fluxo, fora do repositório) e tests/integracao",
        "como_testar": "Relatório com números, custo real e exemplos de erro (sempre inventados).",
        "cuidado": "Custo aprovado antes. Se o real passar, pare e avise."
      },
      "pronto": [
        "Relatório com acerto por fluxo, erros típicos e custo real.",
        "Sugestão de 1 a 3 melhorias de prompt, com o efeito esperado."
      ],
      "conquista": {
        "emoji": "📊",
        "nome": "Juíza de Modelos"
      },
      "quiz": [
        {
          "pergunta": "A mesma frase foi classificada de um jeito numa rodada e de outro na seguinte. O que isso mostra?",
          "opcoes": [
            "Que o teste está errado",
            "Que a IA varia, e vale rodar mais de uma vez e medir a variação",
            "Que o Bedrock caiu",
            "Que o prompt está perfeito"
          ],
          "correta": 1,
          "explicacao": "Aconteceu na Maria com \"a amil n quer pagar a protese\": uma rodada mandou para a Tykhe, outra para o plano."
        },
        {
          "pergunta": "O recall de uma classe responde:",
          "opcoes": [
            "De tudo que a IA disse ser da classe, quanto estava certo",
            "De tudo que era da classe, quanto a IA achou",
            "Quanto custou",
            "Quanto demorou"
          ],
          "correta": 1,
          "explicacao": "A primeira opção é a precisão. As duas juntas mostram onde o classificador erra."
        },
        {
          "pergunta": "Qual é um risco de usar outro modelo como juiz?",
          "opcoes": [
            "Ele nunca erra",
            "Ele tem vieses e precisa ser conferido com uma amostra feita à mão",
            "Ele é de graça",
            "Ele não lê texto"
          ],
          "correta": 1,
          "explicacao": "Por isso a calibração dos 20 casos à mão vem antes da avaliação grande."
        }
      ]
    },
    {
      "id": "m6",
      "semana": "Semana 7",
      "titulo": "RAG em produção",
      "objetivo": "Levar o RAG que você conhece para produção: busca híbrida, avaliação da recuperação e resposta segura quando não acha.",
      "ponte": "Você já sabe montar um RAG. Agora o foco é medir se ele traz o trecho certo e o que fazer quando não traz.",
      "tempo": "Estudo ~8 h · tarefa ~8 h",
      "estudar": [
        {
          "titulo": "pgvector",
          "link": "https://github.com/pgvector/pgvector",
          "porque": "O banco de vetores da Maria."
        },
        {
          "titulo": "Embeddings do Titan no Bedrock",
          "link": "https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html",
          "porque": "O modelo de embeddings usado."
        },
        {
          "titulo": "Fusão de rankings (RRF)",
          "link": "https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html",
          "porque": "Busca por palavra junto com a busca por sentido (#353)."
        },
        {
          "titulo": "Código: src/maria/shared/embeddings_fluxos.py",
          "link": "https://github.com/dgd-dprj/maria-langgraph-pp/blob/develop/src/maria/shared/embeddings_fluxos.py",
          "porque": "Como a Maria busca as opções do catálogo."
        }
      ],
      "checar": [
        "O que é recall@k e por que medir antes de mexer no prompt?",
        "Quando a busca por palavra acerta e a por sentido erra?",
        "O que a resposta deve dizer quando o RAG não acha nada?"
      ],
      "praticar": "Medir recall@3 numa base pequena de dúvidas inventadas, com e sem busca por palavra.",
      "tarefa": {
        "titulo": "Contribuir com o plano do RAG",
        "issues": [
          418,
          353
        ],
        "descricao": "Medir a recuperação na base de dúvidas do protótipo e propor como entra no src/ (a parte de dúvidas no meio da conversa).",
        "onde": "Protótipo da Nicole (rag) e src/maria/shared/embeddings_fluxos.py",
        "como_testar": "Números de recall@k e exemplos inventados.",
        "cuidado": "Embedding também custa: meça e peça aprovação."
      },
      "pronto": [
        "Recall medido com e sem busca híbrida.",
        "Proposta revisada pela Nicole."
      ],
      "conquista": {
        "emoji": "📚",
        "nome": "Bibliotecária do RAG"
      },
      "quiz": [
        {
          "pergunta": "O que o recall@3 mede?",
          "opcoes": [
            "Se o trecho certo está entre os 3 primeiros resultados",
            "O custo de 3 chamadas",
            "A nota da resposta final",
            "Quantos documentos existem"
          ],
          "correta": 0,
          "explicacao": "Se a busca não traz o trecho certo, nenhum prompt conserta a resposta."
        },
        {
          "pergunta": "Quando a busca por palavra ajuda a busca por sentido?",
          "opcoes": [
            "Com nomes próprios, siglas e termos exatos",
            "Nunca",
            "Só em inglês",
            "Só com imagens"
          ],
          "correta": 0,
          "explicacao": "Siglas como NUDECON ou SEEU são o caso clássico. A fusão dos dois rankings (RRF) é a #353."
        },
        {
          "pergunta": "Se o RAG não acha nada parecido, a resposta deve:",
          "opcoes": [
            "Inventar uma resposta plausível",
            "Ser segura, sem inventar, e deixar a dúvida para a equipe",
            "Repetir a pergunta da pessoa",
            "Mostrar o documento inteiro"
          ],
          "correta": 1,
          "explicacao": "Inventar é o pior erro num serviço público: a pessoa age com base na resposta."
        }
      ]
    },
    {
      "id": "m7",
      "semana": "Semana 8",
      "titulo": "IA em produção: observabilidade e confiabilidade",
      "objetivo": "Saber o que a IA está fazendo em produção (tempo, tokens, falhas) e o que acontece quando ela cai.",
      "ponte": "Você conhece AWS: aqui entram CloudWatch Logs Insights, o deploy no ECS a partir do ECR e o que fazer quando o Bedrock limita ou cai.",
      "tempo": "Estudo ~6 h · tarefa ~10 h",
      "estudar": [
        {
          "titulo": "CloudWatch Logs Insights",
          "link": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html",
          "porque": "Consultar os eventos da Maria sem ler dado pessoal."
        },
        {
          "titulo": "GitHub Actions",
          "link": "https://docs.github.com/pt/actions",
          "porque": "O CI e o deploy da Maria (pasta .github/workflows)."
        },
        {
          "titulo": "Docker: primeiros passos",
          "link": "https://docs.docker.com/get-started/",
          "porque": "Revisão rápida para ler o Dockerfile da Maria."
        }
      ],
      "checar": [
        "Por que a falha do Bedrock que vira \"não identificado\" sem alerta é perigosa (#248)?",
        "O que acontece quando a resposta passa de 30 s (#344)?",
        "Que campos um evento de log precisa ter para medir custo e tempo sem expor ninguém?"
      ],
      "praticar": "Uma consulta no Logs Insights que conta as conversas do release por fluxo num dia (com a Nicole, só leitura).",
      "tarefa": {
        "titulo": "Medir o tempo e os tokens das chamadas à IA",
        "issues": [
          311,
          340
        ],
        "descricao": "Registrar a duração de cada chamada ao Bedrock e separar os tokens de entrada e de saída nos eventos do orquestrador.",
        "onde": "src/maria/ia, src/maria/api/orquestrador.py",
        "como_testar": "Testes de log e a conferência com os logs gravados (fixtures de contrato).",
        "cuidado": "Mexer em log muda as fixtures de contrato: leia como a equipe trata isso antes (MIGRACAO.md). Nunca texto do relato no log."
      },
      "pronto": [
        "PR com os campos novos e testes.",
        "Uma consulta no Logs Insights que usa os campos novos."
      ],
      "conquista": {
        "emoji": "🔭",
        "nome": "Vigia da Produção"
      },
      "quiz": [
        {
          "pergunta": "O que nunca pode ir para o log da Maria?",
          "opcoes": [
            "O nome do evento",
            "O texto do relato, CPF, e-mail e telefone",
            "A duração da chamada",
            "O id do fluxo"
          ],
          "correta": 1,
          "explicacao": "Log é lido por várias pessoas e guardado por muito tempo. Dado pessoal fica fora."
        },
        {
          "pergunta": "Por que é perigoso a falha do Bedrock virar \"não identificado\" sem alerta (#248)?",
          "opcoes": [
            "Porque todo relato passa a ir para \"outros\" e ninguém fica sabendo",
            "Porque fica mais barato",
            "Porque o release desliga",
            "Não é perigoso"
          ],
          "correta": 0,
          "explicacao": "Falha silenciosa é a mais cara: a Maria parece funcionar, mas não entende ninguém."
        },
        {
          "pergunta": "O que acontece quando a resposta da Maria passa de 30 s (#344)?",
          "opcoes": [
            "Nada",
            "A resposta não chega à pessoa, e a conversa costuma parar",
            "A Maria responde duas vezes",
            "O Verde reinicia"
          ],
          "correta": 1,
          "explicacao": "91,6% dessas conversas param. Medir a latência (#300, #311) é o primeiro passo para resolver."
        }
      ]
    },
    {
      "id": "m8",
      "semana": "Semana 9",
      "titulo": "Segurança de IA e LGPD",
      "objetivo": "Reconhecer os riscos de uma aplicação com IA (injeção de prompt, vazamento de dado) e o que a LGPD exige com dado de saúde.",
      "ponte": "Na Clean Architecture, a validação fica na borda. Na IA, a validação da saída e o filtro do que vai para o log são a borda.",
      "tempo": "Estudo ~8 h · tarefa ~8 h",
      "estudar": [
        {
          "titulo": "OWASP Top 10 para aplicações com LLM",
          "link": "https://genai.owasp.org/llm-top-10/",
          "porque": "Injeção de prompt, vazamento de dado, agência excessiva."
        },
        {
          "titulo": "LGPD (Lei 13.709)",
          "link": "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
          "porque": "Artigos 5, 6 e 11: dado pessoal sensível, como o de saúde."
        },
        {
          "titulo": "Guardrails do Bedrock",
          "link": "https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html",
          "porque": "Filtros prontos, e quando eles ajudam."
        }
      ],
      "checar": [
        "Por que dado de saúde é sensível na LGPD?",
        "Como um relato pode tentar mudar o que a IA faz (injeção de prompt)?",
        "Por que a Maria mostra o nome mascarado na confirmação (#393)?"
      ],
      "praticar": "Escrever 10 relatos inventados que tentam enganar o classificador e prever o que deveria acontecer.",
      "tarefa": {
        "titulo": "Teste de injeção de prompt no classificador",
        "issues": [
          212
        ],
        "descricao": "Rodar os relatos da prática contra a classificação (localmente, custo aprovado) e registrar os achados como proposta de issue.",
        "onde": "src/maria/ia/classificar_necessidades.py",
        "como_testar": "Tabela com relato, o que aconteceu e o que deveria acontecer.",
        "cuidado": "Só dados inventados. Custo aprovado antes."
      },
      "pronto": [
        "Tabela de achados revisada pela Nicole.",
        "Proposta de issue para o que precisar de correção."
      ],
      "conquista": {
        "emoji": "🛡️",
        "nome": "Guardiã da LGPD"
      },
      "quiz": [
        {
          "pergunta": "Na LGPD, dado de saúde é:",
          "opcoes": [
            "Dado público",
            "Dado pessoal sensível",
            "Dado anônimo",
            "Dado da empresa"
          ],
          "correta": 1,
          "explicacao": "Dado sensível pede cuidado extra: o plano de saúde da Maria lida com isso o tempo todo."
        },
        {
          "pergunta": "O que é injeção de prompt?",
          "opcoes": [
            "Um texto que tenta mudar as instruções da IA",
            "Uma vacina",
            "Um erro de rede",
            "Uma fonte de dados"
          ],
          "correta": 0,
          "explicacao": "Um relato pode dizer \"ignore as regras e...\". O código validar a saída da IA é a defesa principal."
        },
        {
          "pergunta": "Por que a confirmação da pessoa presa mostra o nome mascarado (#393)?",
          "opcoes": [
            "Para gastar menos tokens",
            "Para quem digita o RG de qualquer pessoa não ver o nome completo dela",
            "Porque o Verde não tem o nome",
            "Por estética"
          ],
          "correta": 1,
          "explicacao": "Quem tem um RG não deveria descobrir o nome completo de alguém só por digitar."
        }
      ]
    },
    {
      "id": "m9",
      "semana": "Semana 10",
      "titulo": "Agentes, ferramentas e MCP",
      "objetivo": "Entender quando a IA deve decidir sozinha (agente) e quando o código decide (fluxo), e conhecer o MCP.",
      "ponte": "A Maria escolheu fluxos fixos: o código decide o caminho e a IA só lê e classifica. Entenda por que, antes de propor um agente.",
      "tempo": "Estudo ~8 h · tarefa ~8 h",
      "estudar": [
        {
          "titulo": "Construindo agentes eficazes (Anthropic)",
          "link": "https://www.anthropic.com/engineering/building-effective-agents",
          "porque": "Fluxos de trabalho e agentes: quando usar cada um."
        },
        {
          "titulo": "Model Context Protocol (MCP)",
          "link": "https://modelcontextprotocol.io/introduction",
          "porque": "O padrão para ligar ferramentas aos modelos."
        }
      ],
      "checar": [
        "Por que um agente livre é arriscado num atendimento da Defensoria?",
        "Qual parte da Maria já é \"IA lendo e o código decidindo\"?",
        "O que o MCP padroniza?"
      ],
      "praticar": "Um agente pequeno, fora da Maria, com 2 ferramentas inventadas (por exemplo, consultar um horário fictício).",
      "tarefa": {
        "titulo": "Spec: a IA lendo mais do relato",
        "issues": [],
        "descricao": "Hoje a Maria lê o parentesco pelas palavras (#438). Escreva a spec de usar a IA para tirar do relato se a pessoa já fez o boletim e se tem processo, com o ganho (perguntas a menos) e o custo medido.",
        "onde": "src/maria/shared/parentesco.py e o protótipo multi-fluxo",
        "como_testar": "Spec com números medidos.",
        "cuidado": "É uma proposta: a decisão de usar IA aqui é da Nicole."
      },
      "pronto": [
        "Spec com ganho e custo medidos.",
        "Decisão registrada pela Nicole."
      ],
      "conquista": {
        "emoji": "🤖",
        "nome": "Mestra dos Agentes"
      },
      "quiz": [
        {
          "pergunta": "Na Maria, quem decide o caminho da conversa?",
          "opcoes": [
            "A IA, livremente",
            "O código, com fluxos fixos; a IA lê e classifica",
            "A Tykhe",
            "A pessoa, digitando comandos"
          ],
          "correta": 1,
          "explicacao": "Num atendimento público, o caminho previsível é mais seguro e mais fácil de testar."
        },
        {
          "pergunta": "Quando vale começar com um fluxo simples em vez de um agente?",
          "opcoes": [
            "Sempre que um fluxo previsível resolve a tarefa",
            "Nunca",
            "Só em inglês",
            "Quando o custo não importa"
          ],
          "correta": 0,
          "explicacao": "É a recomendação do texto da Anthropic: comece simples e só aumente a autonomia quando precisar."
        },
        {
          "pergunta": "O que o MCP padroniza?",
          "opcoes": [
            "Como os modelos se conectam a ferramentas e dados",
            "O formato do CPF",
            "O deploy no ECS",
            "O tema desta página"
          ],
          "correta": 0,
          "explicacao": "Com o MCP, a mesma ferramenta serve a vários modelos e aplicações."
        }
      ]
    },
    {
      "id": "m10",
      "semana": "Semanas 11 e 12",
      "titulo": "Projeto final: uma melhoria de IA de ponta a ponta",
      "objetivo": "Fazer sozinha o caminho completo: spec, testes, implementação, avaliação com a IA de verdade, PR e teste no release.",
      "ponte": "Junta tudo: SDD na spec, Clean Architecture no lugar do código, avaliação para provar que melhorou e observabilidade para acompanhar.",
      "tempo": "~32 h",
      "estudar": [
        {
          "titulo": "Revisar os módulos anteriores",
          "link": "#/inicio",
          "porque": "Voltar ao que ficou com dúvida."
        }
      ],
      "checar": [
        "Como você vai saber, com números, que a melhoria funcionou?",
        "O que pode quebrar para quem já usa a Maria?"
      ],
      "praticar": "Escolher a melhoria com a Nicole.",
      "tarefa": {
        "titulo": "Escolher uma melhoria",
        "issues": [],
        "descricao": "Sugestões: a IA lendo boletim e processo do relato (spec do módulo 9); uma revisão de linguagem acessível das mensagens; as dúvidas no meio da conversa respondidas pelo RAG.",
        "onde": "Combinado com a Nicole",
        "como_testar": "Testes automatizados, avaliação com custo aprovado e o caso no guia de teste da homologação.",
        "cuidado": "Tudo primeiro no release. A produção só recebe na promoção, no horário combinado."
      },
      "pronto": [
        "Spec aprovada.",
        "PR mergeado na develop com testes e avaliação.",
        "Testado no release e registrado no guia de teste."
      ],
      "conquista": {
        "emoji": "🏆",
        "nome": "Desenvolvedora de IA"
      },
      "quiz": [
        {
          "pergunta": "Qual é a ordem do caminho completo de uma melhoria?",
          "opcoes": [
            "Código, depois spec, depois teste",
            "Spec, testes, implementação, avaliação, PR e teste no release",
            "PR direto na main",
            "Avaliar só depois da produção"
          ],
          "correta": 1,
          "explicacao": "É o caminho que a equipe seguiu no multi-fluxo (#435): spec na issue, testes, avaliação com custo aprovado, PR e release."
        },
        {
          "pergunta": "Uma melhoria que muda o que a pessoa lê precisa de:",
          "opcoes": [
            "Nada além do código",
            "Guia de teste atualizado e horário combinado",
            "Só um commit",
            "Deploy direto na produção"
          ],
          "correta": 1,
          "explicacao": "A equipe precisa saber o que mudou para testar e para não estranhar o atendimento."
        },
        {
          "pergunta": "Antes da avaliação com a IA de verdade, você:",
          "opcoes": [
            "Roda sem pensar no custo",
            "Mede o custo com count_tokens e pede a aprovação da Nicole",
            "Usa CPFs reais",
            "Desliga os testes"
          ],
          "correta": 1,
          "explicacao": "Regra da equipe: custo medido, aprovado, e parar se o real passar do aprovado."
        }
      ]
    }
  ],
  "glossario": [
    {
      "termo": "Orquestrador",
      "texto": "A parte da Maria que lê o relato e escolhe o fluxo (ou manda para a Tykhe)."
    },
    {
      "termo": "Fluxo",
      "texto": "Uma conversa guiada para um assunto: pessoa presa, violência doméstica, plano de saúde."
    },
    {
      "termo": "Tykhe",
      "texto": "A plataforma de atendimento que fala com a pessoa no WhatsApp e chama a API da Maria."
    },
    {
      "termo": "Verde",
      "texto": "O sistema da Defensoria. A homologação do Verde tem dados reais: só CPF de teste."
    },
    {
      "termo": "Release",
      "texto": "O ambiente de homologação da Maria, onde a equipe testa antes da produção."
    },
    {
      "termo": "dadosConhecidos",
      "texto": "O que a Tykhe já sabe da pessoa (CPF, nome, endereço) e manda para a Maria."
    },
    {
      "termo": "assuntosPendentes",
      "texto": "Os outros assuntos do relato, no multi-fluxo, para a Tykhe seguir depois."
    },
    {
      "termo": "Interrupt",
      "texto": "A pausa do grafo para esperar a resposta da pessoa."
    },
    {
      "termo": "Checkpoint",
      "texto": "O estado da conversa guardado entre uma mensagem e outra."
    },
    {
      "termo": "count_tokens",
      "texto": "Contagem de tokens do Bedrock: mede o tamanho da chamada sem gerar resposta e sem custo."
    },
    {
      "termo": "Saída estruturada",
      "texto": "A IA devolve JSON num formato fixo (JSON Schema), em vez de texto livre."
    },
    {
      "termo": "Fixture de contrato",
      "texto": "Respostas e logs gravados que os testes comparam byte a byte, para nada mudar sem querer."
    },
    {
      "termo": "SDD",
      "texto": "Desenvolvimento guiado por especificação: a spec com critérios vem antes do código."
    }
  ],
  "jogadora": {
    "nome": "Marcelle"
  },
  "xp": {
    "estudar": 10,
    "checar": 10,
    "praticar": 30,
    "tarefa": 100,
    "pronto": 20,
    "quiz": 15
  },
  "niveis": [
    {
      "xp": 0,
      "nome": "Aprendiz de IA",
      "emoji": "🌱"
    },
    {
      "xp": 250,
      "nome": "Exploradora da Maria",
      "emoji": "🧭"
    },
    {
      "xp": 600,
      "nome": "Domadora de Prompts",
      "emoji": "✨"
    },
    {
      "xp": 1000,
      "nome": "Arquiteta de Grafos",
      "emoji": "🕸️"
    },
    {
      "xp": 1500,
      "nome": "Mestra da Avaliação",
      "emoji": "📊"
    },
    {
      "xp": 2100,
      "nome": "Guardiã da Produção",
      "emoji": "🛡️"
    },
    {
      "xp": 2600,
      "nome": "Desenvolvedora de IA",
      "emoji": "🚀"
    }
  ]
};

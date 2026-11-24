window.NOVIDADES = {
  "explicacao": "A cada atualização do guia, acrescente uma entrada no topo da lista: id único (data e um nome curto), em (AAAA-MM-DD), titulo, texto e link (https:// ou rota interna, como #/tarefas). A página mostra à Marcelle as entradas que ela ainda não viu, e a publicação manda o aviso por email (menção no GitHub). Nunca coloque dado pessoal de assistido nem chave: este arquivo é público.",
  "lista": [
    {
      "id": "2026-11-24-tarefas-t12-t13",
      "em": "2026-11-24",
      "titulo": "Suas tarefas novas: T12 (testar a leitura de risco) e T13 (o RAG que admite quando não sabe)",
      "texto": "Aprovadas pela Nicole em 24/11. T12 (até 01/12): 40 relatos inventados num teste pytest, medindo quantas vezes a IA marca risco sem perigo e ajustando o pedido até zerar os alarmes falsos. T13 (até 08/12): um modo do RAG para as dúvidas da pessoa, com um segundo agente que confere a resposta, medido com as 48 perguntas da T10 no Qwen em São Paulo. A T1, a T9, a T10 e a T11 foram encerradas. Cada cartão novo tem o bloco \"📚 O que estudar\", com os estudos novos dos módulos 1, 3 e 9.",
      "link": "#/tarefas"
    },
    {
      "id": "2026-11-24-estudo-pytest-agentes-prompt",
      "em": "2026-11-24",
      "titulo": "Três estudos novos: testes em Python, engenharia de prompt e agentes",
      "texto": "Indicações da Nicole. No módulo 1, a playlist \"Testes Unitários em Python\": comece por ela, mesmo sem saber Python a fundo, porque toda mudança na Maria vem com teste. No módulo 3, o Guia de Engenharia de Prompt da DAIR.AI em português (o básico, os elementos de um prompt, as técnicas e os riscos). No módulo 9, o curso de IA Agêntica da Escola de Inteligência Artificial: agentes com RAG, vários agentes trabalhando juntos e observabilidade. Cada um está no baú de estudo do módulo, com a ordem sugerida.",
      "link": "#/modulo/m1/0"
    },
    {
      "id": "2026-11-16-tarefas-t9-a-t11",
      "em": "2026-11-16",
      "titulo": "Suas tarefas novas: T9, T10 e T11, com o que estudar em cada uma (a Tykhe passou para o Ícaro)",
      "texto": "Decisão da Nicole de 16/11: a configuração da Tykhe (T2 a T8) passou para o Ícaro, para acelerar. Você não precisa terminar nem enviar nada delas; os cartões ficam no fim da lista, com o selo \"Passou para o Ícaro\". Suas tarefas agora, na ordem: T9 (prioridade máxima, até 19/11), um banco de cerca de 100 respostas inventadas para a pergunta do RG e do CPF, a base da próxima correção do RG; T10 (até 25/11), os documentos da base do RAG e as perguntas de avaliação; T11 (até 27/11), as mensagens da Maria em linguagem simples. Cada cartão tem o bloco novo \"📚 O que estudar para esta tarefa\", com os baús do guia e a documentação para ler antes de começar.",
      "link": "#/tarefas"
    },
    {
      "id": "2026-11-13-campos-flowid-tipocaso",
      "em": "2026-11-13",
      "titulo": "T6 e T7: o assunto vai nos campos \"flowId\" ou \"tipoCaso\"",
      "texto": "Ajuste do mesmo dia (PR #495 da Maria): para abrir um assunto na rota do próximo assunto, mande o mesmo campo do item de assuntosEmAberto, \"flowId\" (assunto da Maria) ou \"tipoCaso\" (assunto da Tykhe), e não mais \"assunto\". Exemplo: {\"chatId\": \"<conversa>\", \"tipoCaso\": \"agendamentos\"}. O que você já montou com \"assunto\" não quebra: ele continua aceito. Vale no release quando o PR chegar lá; a Nicole avisa.",
      "link": "#/tarefas"
    },
    {
      "id": "2026-11-13-assunto-pelo-flowid",
      "em": "2026-11-13",
      "titulo": "T4 a T8 atualizadas: o assunto pelo flowId, a ordem nova e as listas numeradas",
      "texto": "Decisões da Nicole de 13/11 (PR #485 da Maria). Valem no release quando o PR chegar lá; a Nicole avisa. 1) Em assuntosEmAberto, o id do assunto é o flowId (assunto da Maria) ou o tipoCaso (assunto da Tykhe); o chatIdAssunto saiu. Para abrir um assunto direto, mande esse valor em \"assunto\" na rota do próximo assunto (os ids estão na T6 e na T7). 2) A ordem dos assuntos agora é violência doméstica, pessoa presa e saúde. 3) Todas as listas de escolha vêm numeradas, com \"Responda com o número da opção.\", e os botões levam o número (\"1. O seu processo\"). \"Qual você quer resolver primeiro?\" passa a vir com botões. 4) A lista dos assuntos em aberto ganhou \"Encerrar a conversa\". 5) No atendimento humano, o texto avisa \"Também ficou para depois: …\". Se você já tinha marcado passos da T4 a T8, confira de novo.",
      "link": "#/tarefas"
    },
    {
      "id": "2026-11-12-tarefa-atualizada",
      "em": "2026-11-12",
      "titulo": "Os cartões mostram quando a tarefa foi atualizada",
      "texto": "Cada tarefa que mudou depois do lançamento ganhou o selo roxo \"Atualizada em\", visível mesmo com o cartão minimizado, e a ficha \"Atualizada em\" diz o que mudou. A T4 foi atualizada em 12/11; a T3 e as T5 a T8, em 11/11.",
      "link": "#/tarefas"
    },
    {
      "id": "2026-11-12-t4-botoes",
      "em": "2026-11-12",
      "titulo": "T4 ajustada depois da sua entrega: no \"Pode ser assim?\", só os botões",
      "texto": "Você achou que o nó de sim/não da Tykhe não aceita texto livre. Decisão da Nicole: a Maria não muda. No \"Pode ser assim?\", a pessoa usa só os botões Sim e Não; o assunto é digitado só na pergunta \"Qual você quer resolver primeiro?\", num nó de texto comum. O passo 4 virou \"não se aplica na Tykhe\". Falta só anotar o chatId dos três casos, que já funcionaram.",
      "link": "#/tarefas"
    },
    {
      "id": "2026-11-11-fim-da-conversa",
      "em": "2026-11-11",
      "titulo": "T6, T7 e T8 atualizadas: resumo no fim da conversa e botão de encerrar",
      "texto": "O fim de cada assunto mudou de novo. Sem urgente na vez, a Maria mostra o resumo da conversa (cada assunto atendido, com o desfecho e um código), o que ainda está em aberto e a pergunta \"Quer continuar com algum desses assuntos ou encerrar a conversa?\". Saiu o botão \"Ver os assuntos em aberto\": agora vem um botão por assunto em aberto, que abre o assunto direto, mais \"Falar de um assunto novo\" e \"Encerrar a conversa\". Identificadores novos: resumoDaConversa, codigo, fase e venceEm. Se você já tinha marcado passos da T6 a T8, confira de novo.",
      "link": "#/tarefas"
    },
    {
      "id": "2026-11-11-assuntos-em-aberto",
      "em": "2026-11-11",
      "titulo": "Tarefas da Tykhe atualizadas: sem CPF no começo e com os assuntos em aberto",
      "texto": "A pergunta do CPF no começo saiu do release: a Maria reconhece a pessoa pelo idUsuario (T3). A T5, a T6 e a T7 mudaram: a conversa nova não começa com pergunta, a Maria retoma sozinha o assunto guardado e, no fim de cada assunto, oferece \"Ver os assuntos em aberto\" ou \"Falar de um assunto novo\". Cada tarefa tem os identificadores novos (opcoesDoFim, assuntosEmAberto, chatIdAssunto e a rota /atendimentos/assuntos-em-aberto). Se você já tinha marcado passos da T5 a T8, confira de novo: os passos mudaram.",
      "link": "#/tarefas"
    },
    {
      "id": "2026-11-11-tarefas-tykhe",
      "em": "2026-11-11",
      "titulo": "7 tarefas novas da Tykhe, com prioridade máxima até sexta (13/11)",
      "texto": "As tarefas T2 a T8 montam o multi-fluxo na Tykhe, uma parte por vez e na ordem. Cada uma tem os identificadores exatos, o passo a passo, os casos de teste e o botão \"💾 Salvar em arquivo (para o Ícaro)\", para mandar ao Ícaro o que não der tempo de terminar. Os cartões agora podem ser minimizados.",
      "link": "#/tarefas"
    }
  ]
};

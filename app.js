// Jornada IA — aventura 2D retrô original. Monta tudo a partir de dados/guia.js.
// Progresso no navegador. Texto dos dados sempre como texto (textContent), nunca como HTML.
(function () {
  "use strict";

  const G = window.GUIA;
  const CHAVE = "guia-estudo-ia-v1";
  const XP = G.xp;
  const conteudo = document.getElementById("conteudo");
  const CORES = ["#8a4fff", "#ff5fa2", "#2ce8f5", "#ff9f1c", "#3ec54a", "#ffd23f", "#5b8cff", "#1fd1a5", "#e43b44", "#b46bff", "#38bdf8"];
  const menosMovimento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Pixel art (desenhos originais, em grade) ───────────────────────────────────
  const SPRITES = {
    // A Marcelle: cabelo escuro, blusa roxa com crachá.
    marcelle: {
      cores: { h: "#3b2416", s: "#f2c39b", e: "#1b1b2f", r: "#c2410c", p: "#8a4fff", w: "#ffd23f", b: "#1e3a8a", f: "#3f2a1d" },
      linhas: ["...hhhh...", "..hhhhhh..", ".hhsssshh.", ".hsessesh.", ".hssssssh.", ".hhsrrshh.", "..pppppp..",
        ".pppwwppp.", "spppppppps", "s.pppppp.s", "..bbbbbb..", "..bb..bb..", "..bb..bb..", ".fff..fff."],
    },
    // A Coruja Bit, guia da jornada.
    coruja: {
      cores: { o: "#8b5a2b", l: "#e8c39e", w: "#ffffff", k: "#1b1b2f", y: "#ffd23f", g: "#2ce8f5" },
      // A linha 4 tem os óculos (g) em volta dos olhos.
      linhas: [".o......o.", ".oo....oo.", ".oooooooo.", "oggggggggo", "owkwoowkwo", "oowwyywwoo",
        "oolllllloo", "oolllllloo", ".ollllllo.", "..y....y.."],
    },
    arvore: {
      cores: { g: "#1e7a2a", G: "#3ec54a", t: "#7c4a1e" },
      linhas: ["..gggg..", ".gGGGGg.", "gGGgGGGg", "gGGGGgGg", ".gGGGGg.", "..gggg..", "...tt...", "...tt...", "..tttt.."],
    },
    pedra: {
      cores: { c: "#8d93ad", d: "#5c6178", l: "#c9cde0" },
      linhas: ["........", "..cccc..", ".clcccc.", "cllccccd", "ccccccdd", ".ccccdd.", "..dddd..", "........"],
    },
  };

  function sprite(nome, titulo) {
    const s = SPRITES[nome];
    const largura = s.linhas[0].length;
    const altura = s.linhas.length;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 " + largura + " " + altura);
    svg.setAttribute("shape-rendering", "crispEdges");
    if (titulo) { svg.setAttribute("role", "img"); svg.setAttribute("aria-label", titulo); } else svg.setAttribute("aria-hidden", "true");
    s.linhas.forEach((linha, y) => {
      [...linha].forEach((c, x) => {
        if (!s.cores[c]) return;
        const r = document.createElementNS(ns, "rect");
        r.setAttribute("x", x); r.setAttribute("y", y); r.setAttribute("width", 1); r.setAttribute("height", 1);
        r.setAttribute("fill", s.cores[c]);
        svg.appendChild(r);
      });
    });
    return svg;
  }

  // ── Progresso ─────────────────────────────────────────────────────────────────
  function lerProgresso() {
    try {
      const p = JSON.parse(localStorage.getItem(CHAVE) || "{}");
      return { marcados: p.marcados || {}, notas: p.notas || {}, quiz: p.quiz || {}, dias: p.dias || [] };
    } catch (e) {
      return { marcados: {}, notas: {}, quiz: {}, dias: [] };
    }
  }
  let progresso = lerProgresso();
  function dataDe(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function hoje() { return dataDe(new Date()); }
  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(progresso)); } catch (e) { /* segue sem salvar */ }
    atualizarHud();
  }

  // ── Elementos ─────────────────────────────────────────────────────────────────
  function el(tag, atributos, filhos) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(atributos || {})) {
      if (v == null) continue;
      if (k === "classe") n.className = v;
      else if (k === "texto") n.textContent = v;
      else n.setAttribute(k, v);
    }
    for (const f of [].concat(filhos || [])) {
      if (f == null) continue;
      n.appendChild(typeof f === "string" ? document.createTextNode(f) : f);
    }
    return n;
  }
  function linkSeguro(texto, href) {
    if (typeof href === "string" && (href.startsWith("https://") || href.startsWith("#/"))) {
      const a = el("a", { href: href, texto: texto });
      if (href.startsWith("https://")) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      return a;
    }
    return el("span", { texto: texto });
  }
  function linkIssue(n) { return linkSeguro("#" + n, G.repositorio_maria + "/issues/" + n); }

  // ── Pontos, níveis, sequência ──────────────────────────────────────────────────
  function itensDoModulo(m) {
    const itens = [];
    m.estudar.forEach((_, i) => itens.push([m.id + ":estudar:" + i, XP.estudar]));
    m.checar.forEach((_, i) => itens.push([m.id + ":checar:" + i, XP.checar]));
    itens.push([m.id + ":praticar", XP.praticar]);
    itens.push([m.id + ":tarefa", XP.tarefa]);
    m.pronto.forEach((_, i) => itens.push([m.id + ":pronto:" + i, XP.pronto]));
    return itens;
  }
  const respostasQuiz = (m) => progresso.quiz[m.id] || {};
  const acertosQuiz = (m) => m.quiz.filter((q, i) => respostasQuiz(m)[i] === q.correta).length;
  const todos = (lista, prefixo) => lista.every((_, i) => progresso.marcados[prefixo + i]);
  const estudoCompleto = (m) => todos(m.estudar, m.id + ":estudar:");
  function pctModulo(m) {
    const itens = itensDoModulo(m);
    const feitos = itens.filter(([k]) => progresso.marcados[k]).length + Object.keys(respostasQuiz(m)).length;
    return Math.round((100 * feitos) / (itens.length + m.quiz.length));
  }
  const xpModulo = (m) => itensDoModulo(m).reduce((s, [k, v]) => s + (progresso.marcados[k] ? v : 0), 0) + acertosQuiz(m) * XP.quiz;
  const xpTotal = () => G.modulos.reduce((s, m) => s + xpModulo(m), 0);
  function nivelDe(xp) { let i = 0; G.niveis.forEach((n, k) => { if (xp >= n.xp) i = k; }); return i; }
  function diasSeguidos() {
    const dias = new Set(progresso.dias);
    const d = new Date();
    if (!dias.has(hoje())) d.setDate(d.getDate() - 1);
    let n = 0;
    while (dias.has(dataDe(d))) { n += 1; d.setDate(d.getDate() - 1); }
    return n;
  }
  const moduloAtual = () => G.modulos.find((m) => pctModulo(m) < 100) || G.modulos[G.modulos.length - 1];

  function atualizarHud() {
    const xp = xpTotal();
    const i = nivelDe(xp);
    const nivel = G.niveis[i];
    const prox = G.niveis[i + 1];
    document.getElementById("hud-nivel").textContent = "Nv " + (i + 1);
    document.getElementById("hud-nivel").parentElement.title = nivel.nome;
    document.getElementById("hud-nivel-emoji").textContent = nivel.emoji;
    document.getElementById("hud-xp").textContent = prox ? xp + "/" + prox.xp + " XP" : xp + " XP";
    const pct = prox ? Math.round((100 * (xp - nivel.xp)) / (prox.xp - nivel.xp)) : 100;
    document.getElementById("hud-xp-barra").style.width = Math.max(0, Math.min(100, pct)) + "%";
    document.getElementById("hud-dias").textContent = String(diasSeguidos());
  }

  // ── Avisos e festa ─────────────────────────────────────────────────────────────
  function avisar(texto, grande) {
    const a = el("div", { classe: "aviso" + (grande ? " grande" : ""), texto: texto });
    document.getElementById("avisos").appendChild(a);
    setTimeout(() => a.remove(), 2700);
  }
  function confete() {
    if (menosMovimento) return;
    for (let i = 0; i < 70; i++) {
      const c = el("div", { classe: "confete" });
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = CORES[i % CORES.length];
      c.style.animationDuration = 1.4 + Math.random() * 1.4 + "s";
      c.style.animationDelay = Math.random() * 0.4 + "s";
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3400);
    }
  }
  function comAvisos(acao) {
    const antesXp = xpTotal();
    const antesNivel = nivelDe(antesXp);
    const antesCompletos = new Set(G.modulos.filter((m) => pctModulo(m) === 100).map((m) => m.id));
    acao();
    if (!progresso.dias.includes(hoje())) progresso.dias.push(hoje());
    salvar();
    const ganho = xpTotal() - antesXp;
    if (ganho > 0) avisar("+" + ganho + " XP");
    G.modulos.forEach((m) => {
      if (pctModulo(m) === 100 && !antesCompletos.has(m.id)) {
        confete();
        avisar(m.conquista.emoji + " Conquista: " + m.conquista.nome + "!", true);
      }
    });
    const depois = nivelDe(xpTotal());
    if (depois > antesNivel) { confete(); avisar("⬆ Nível " + (depois + 1) + ": " + G.niveis[depois].nome + "!", true); }
  }

  // ── Fala da Coruja (texto aparece aos poucos; clique mostra tudo) ──────────────
  let digitando = null;
  function falar(alvo, texto) {
    if (digitando) clearInterval(digitando);
    const cursor = el("span", { classe: "cursor", "aria-hidden": "true" });
    if (menosMovimento) { alvo.replaceChildren(texto); return; }
    let i = 0;
    alvo.replaceChildren("", cursor);
    const terminar = () => { clearInterval(digitando); digitando = null; alvo.replaceChildren(texto); };
    digitando = setInterval(() => {
      i += 2;
      alvo.firstChild.textContent = texto.slice(0, i);
      if (i >= texto.length) terminar();
    }, 18);
    alvo.addEventListener("click", terminar, { once: true });
    alvo.setAttribute("aria-label", texto);
  }
  function dialogo(texto, extras, quem) {
    const fala = el("p", { classe: "fala-texto" });
    const caixa = el("div", { classe: "painel dialogo" }, [
      el("div", { classe: "retrato" }, [
        el("div", { classe: "retrato-quadro" }, [sprite(quem === "marcelle" ? "marcelle" : "coruja")]),
        el("div", { classe: "retrato-nome", texto: quem === "marcelle" ? G.jogadora.nome : "Coruja Bit" }),
      ]),
      el("div", { classe: "fala" }, [fala, ...[].concat(extras || [])]),
    ]);
    requestAnimationFrame(() => falar(fala, texto));
    return caixa;
  }

  function caixa(chave, rotulo, detalhe, aoMudar) {
    const id = "c-" + chave.replace(/[^a-z0-9]/gi, "-");
    const entrada = el("input", { type: "checkbox", id: id });
    entrada.checked = !!progresso.marcados[chave];
    const li = el("li", { classe: entrada.checked ? "feito" : null });
    entrada.addEventListener("change", () => {
      comAvisos(() => {
        if (entrada.checked) progresso.marcados[chave] = true;
        else delete progresso.marcados[chave];
      });
      li.classList.toggle("feito", entrada.checked);
      if (aoMudar) aoMudar();
    });
    li.append(entrada, el("div", {}, [el("label", { for: id }, [rotulo]), detalhe ? el("div", { classe: "detalhe" }, [detalhe]) : null]));
    return li;
  }

  // ── Quiz ──────────────────────────────────────────────────────────────────────
  function blocoQuiz(m, aoMudar) {
    const area = el("div");
    function desenhar() {
      area.replaceChildren();
      if (!estudoCompleto(m)) {
        area.appendChild(el("p", { classe: "quiz-trancado" }, [el("span", { texto: "🔒" }), "Abra todo o baú de estudo para liberar o quiz."]));
        return;
      }
      const r = respostasQuiz(m);
      m.quiz.forEach((q, i) => {
        const respondida = r[i] !== undefined;
        const opcoes = el("div", { classe: "quiz-opcoes" });
        q.opcoes.forEach((op, k) => {
          let classe = "quiz-opcao";
          if (respondida && k === q.correta) classe += " certa";
          else if (respondida && k === r[i]) classe += " errada";
          const b = el("button", { classe: classe, type: "button" }, [op]);
          b.disabled = respondida;
          b.addEventListener("click", () => {
            comAvisos(() => { progresso.quiz[m.id] = Object.assign({}, progresso.quiz[m.id], { [i]: k }); });
            avisar(k === q.correta ? "✔ Acertou!" : "✘ Quase! Leia a dica.");
            desenhar();
            if (aoMudar) aoMudar();
          });
          opcoes.appendChild(b);
        });
        area.appendChild(el("div", { classe: "quiz-pergunta" }, [
          el("p", {}, [el("strong", { texto: (i + 1) + ". " + q.pergunta })]),
          opcoes,
          respondida ? el("p", { classe: "quiz-explicacao" + (r[i] === q.correta ? "" : " nao") }, [q.explicacao]) : null,
        ]));
      });
      if (Object.keys(r).length === m.quiz.length) {
        const acertos = acertosQuiz(m);
        const refazer = el("button", { classe: "botao secundario", type: "button", texto: "↻ Refazer" });
        refazer.addEventListener("click", () => { comAvisos(() => { delete progresso.quiz[m.id]; }); desenhar(); if (aoMudar) aoMudar(); });
        area.appendChild(el("div", { classe: "quiz-placar" }, [
          el("strong", { texto: acertos === m.quiz.length ? "🌟 Gabaritou!" : "🎯 " + acertos + "/" + m.quiz.length + " certas" }), refazer,
        ]));
      }
    }
    desenhar();
    return { elemento: area, redesenhar: desenhar };
  }

  // ── Mapa do mundo ──────────────────────────────────────────────────────────────
  const COLUNAS = 14, LINHAS = 9;
  const POSICOES = [[1, 7], [3, 7], [5, 6], [7, 7], [9, 6], [11, 7], [12, 4], [10, 2], [7, 2], [4, 2], [1, 1]];
  function montarMundo() {
    const atual = moduloAtual();
    const chave = (c, l) => c + "," + l;
    const caminho = new Set();
    for (let i = 0; i < POSICOES.length - 1; i++) {
      let [c, l] = POSICOES[i];
      const [c2, l2] = POSICOES[i + 1];
      while (c !== c2) { caminho.add(chave(c, l)); c += Math.sign(c2 - c); }
      while (l !== l2) { caminho.add(chave(c, l)); l += Math.sign(l2 - l); }
      caminho.add(chave(c2, l2));
    }
    const locais = new Map(POSICOES.map((p, i) => [chave(p[0], p[1]), i]));
    const agua = (c, l) => (c >= 12 && l <= 1) || (c === 13 && l <= 2) || (c <= 1 && l >= 8) || (c >= 6 && c <= 8 && l === 4 && !caminho.has(chave(c, l)));
    const mundo = el("div", { classe: "mundo", style: "grid-template-columns:repeat(" + COLUNAS + ",1fr)", role: "group", "aria-label": "Mapa das fases" });
    for (let l = 0; l < LINHAS; l++) {
      for (let c = 0; c < COLUNAS; c++) {
        const k = chave(c, l);
        const bloco = el("div", { classe: "bloco" });
        if (locais.has(k)) {
          const i = locais.get(k);
          const m = G.modulos[i];
          const pct = pctModulo(m);
          bloco.classList.add("caminho");
          const estado = pct === 100 ? " feito" : m.id === atual.id ? " atual" : "";
          bloco.appendChild(el("a", { classe: "local" + estado, href: "#/modulo/" + m.id + "/0", title: m.titulo + " · " + pct + "%", "aria-label": "Fase " + (i + 1) + ": " + m.titulo + ", " + pct + "%" }, [
            el("span", { classe: "numero", texto: String(i + 1) }), pct === 100 ? "🏁" : m.conquista.emoji,
          ]));
          if (m.id === atual.id) bloco.appendChild(el("div", { classe: "jogadora" }, [sprite("marcelle", G.jogadora.nome)]));
        } else if (caminho.has(k)) bloco.classList.add("caminho");
        else if (agua(c, l)) bloco.classList.add("agua");
        else {
          bloco.classList.add("grama");
          if ((c + l) % 2) bloco.classList.add("b");
          if ((c * 7 + l * 3) % 6 === 0) { bloco.classList.add("arvore"); bloco.appendChild(sprite("arvore")); }
          else if ((c * 5 + l * 11) % 17 === 0) { bloco.classList.add("pedra"); bloco.appendChild(sprite("pedra")); }
        }
        mundo.appendChild(bloco);
      }
    }
    return mundo;
  }

  // ── Telas ─────────────────────────────────────────────────────────────────────
  function paginaInicio() {
    const atual = moduloAtual();
    const n = G.modulos.indexOf(atual) + 1;
    const completos = G.modulos.filter((m) => pctModulo(m) === 100).length;
    const fala = completos === G.modulos.length
      ? "Incrível, " + G.jogadora.nome + "! Você completou a jornada inteira. 🏆"
      : (completos ? "Bem-vinda de volta, " : "Olá, ") + G.jogadora.nome + "! Eu sou a Coruja Bit.\nSua próxima fase é a " + n + ": " + atual.titulo + ".";
    return [
      dialogo(fala, el("div", { classe: "acoes" }, [
        el("a", { classe: "botao", href: "#/modulo/" + atual.id + "/0", texto: "▶ Jogar fase " + n }),
        el("a", { classe: "botao secundario", href: "#/inventario", texto: "🎒 Inventário" }),
      ])),
      montarMundo(),
      el("div", { classe: "legenda" }, [
        el("span", { classe: "l-feito", texto: "fase completa" }),
        el("span", { classe: "l-atual", texto: "você está aqui" }),
        el("span", { classe: "l-proximo", texto: "a explorar" }),
        el("span", { texto: "· " + completos + "/" + G.modulos.length + " fases · " + xpTotal() + " XP" }),
      ]),
    ];
  }

  const PASSOS = ["Missão", "Ponte", "Baú", "Quiz", "Pensar", "Treino", "Maria", "Chefão", "Diário"];
  function passoFeito(m, k) {
    return [
      null, null,
      estudoCompleto(m),
      Object.keys(respostasQuiz(m)).length === m.quiz.length,
      todos(m.checar, m.id + ":checar:"),
      !!progresso.marcados[m.id + ":praticar"],
      !!progresso.marcados[m.id + ":tarefa"],
      todos(m.pronto, m.id + ":pronto:"),
      null,
    ][k];
  }

  function paginaModulo(id, passo) {
    const i = G.modulos.findIndex((m) => m.id === id);
    if (i < 0) return paginaInicio();
    const m = G.modulos[i];
    const k = Math.max(0, Math.min(PASSOS.length - 1, Number.isFinite(passo) ? passo : 0));
    const cor = CORES[i % CORES.length];
    const t = m.tarefa;
    const base = "#/modulo/" + m.id + "/";

    const trilha = el("nav", { classe: "trilha-passos", "aria-label": "Partes da fase" }, PASSOS.map((nome, j) =>
      el("a", { classe: "passo" + (j === k ? " atual" : passoFeito(m, j) ? " feito" : ""), href: base + j, texto: (passoFeito(m, j) ? "✓ " : "") + nome })
    ));
    const atualizarTrilha = () => {
      trilha.querySelectorAll(".passo").forEach((a, j) => {
        a.className = "passo" + (j === k ? " atual" : passoFeito(m, j) ? " feito" : "");
        a.textContent = (passoFeito(m, j) ? "✓ " : "") + PASSOS[j];
      });
    };
    const titulo = (texto, xp) => el("div", { classe: "tela-titulo" }, [texto, xp ? el("span", { classe: "xp-tag", texto: xp }) : null]);

    let tela;
    if (k === 0) {
      tela = dialogo("Nova missão, " + G.jogadora.nome + "!\n" + m.objetivo, el("p", { classe: "meta", texto: "⏱ " + m.tempo + " · 🏅 " + m.conquista.nome }));
    } else if (k === 1) {
      tela = dialogo("Você já tem poderes para isso:\n" + m.ponte);
    } else if (k === 2) {
      tela = el("div", {}, [
        dialogo("Abra o baú: estude cada item e marque ao terminar. O quiz libera depois!"),
        el("div", { classe: "painel tela" }, [
          titulo("📦 Baú de estudo", "+" + XP.estudar + " XP cada"),
          el("ul", { classe: "lista-check" }, m.estudar.map((e, j) => caixa(m.id + ":estudar:" + j, linkSeguro(e.titulo, e.link), e.porque, atualizarTrilha))),
        ]),
      ]);
    } else if (k === 3) {
      const quiz = blocoQuiz(m, atualizarTrilha);
      tela = el("div", {}, [
        dialogo("Hora do desafio! Cada acerto vale +" + XP.quiz + " XP."),
        el("div", { classe: "painel tela" }, [titulo("🧠 Quiz da fase", "+" + XP.quiz + " XP por acerto"), quiz.elemento]),
      ]);
    } else if (k === 4) {
      tela = el("div", {}, [
        dialogo("Pense nestas perguntas. Marque quando souber responder."),
        el("div", { classe: "painel tela" }, [titulo("🤔 Para pensar", "+" + XP.checar + " XP cada"),
          el("ul", { classe: "lista-check" }, m.checar.map((c, j) => caixa(m.id + ":checar:" + j, c, null, atualizarTrilha)))]),
      ]);
    } else if (k === 5) {
      tela = el("div", {}, [
        dialogo("Treine aqui antes da missão de verdade."),
        el("div", { classe: "painel tela" }, [titulo("🛠️ Treino", "+" + XP.praticar + " XP"),
          el("ul", { classe: "lista-check" }, [caixa(m.id + ":praticar", m.praticar, null, atualizarTrilha)])]),
      ]);
    } else if (k === 6) {
      tela = el("div", {}, [
        dialogo("Missão real na Maria: " + t.titulo + "!"),
        el("div", { classe: "painel tela", style: "border-color:" + cor }, [
          titulo("⚔️ " + t.titulo, "+" + XP.tarefa + " XP"),
          el("p", { texto: t.descricao }),
          t.issues.length ? el("p", { classe: "meta" }, ["Issues: ", ...t.issues.flatMap((n, j) => (j ? [", ", linkIssue(n)] : [linkIssue(n)]))]) : null,
          el("details", {}, [
            el("summary", { texto: "📍 Onde, como testar e cuidados" }),
            el("p", {}, [el("strong", { texto: "Onde: " }), t.onde]),
            el("p", {}, [el("strong", { texto: "Como testar: " }), t.como_testar]),
            el("p", { classe: "cuidado" }, [el("strong", { texto: "⚠ Cuidado: " }), t.cuidado]),
          ]),
          el("ul", { classe: "lista-check", style: "margin-top:12px" }, [caixa(m.id + ":tarefa", "Missão entregue", null, atualizarTrilha)]),
        ]),
      ]);
    } else if (k === 7) {
      const livre = pctModulo(m) === 100;
      tela = el("div", {}, [
        dialogo(livre ? "Você venceu esta fase! " + m.conquista.emoji + " " + m.conquista.nome : "Chefão final: cumpra tudo para ganhar " + m.conquista.emoji + " " + m.conquista.nome + "!"),
        el("div", { classe: "painel tela" }, [titulo("🏁 Pronto quando", "+" + XP.pronto + " XP cada"),
          el("ul", { classe: "lista-check" }, m.pronto.map((p, j) => caixa(m.id + ":pronto:" + j, p, null, atualizarTrilha)))]),
      ]);
    } else {
      const notas = el("textarea", { "aria-label": "Diário desta fase", placeholder: "O que aprendi, dúvidas, links…" });
      notas.value = progresso.notas[m.id] || "";
      notas.addEventListener("input", () => { progresso.notas[m.id] = notas.value; salvar(); });
      tela = el("div", {}, [dialogo("Anote no diário o que aprendeu e suas dúvidas.", null, "marcelle"), el("div", { classe: "tela" }, [notas])]);
    }

    const anterior = k > 0 ? el("a", { classe: "botao secundario", href: base + (k - 1), texto: "◀ Voltar" })
      : el("a", { classe: "botao secundario", href: "#/inicio", texto: "🗺️ Mapa" });
    const proximo = k < PASSOS.length - 1 ? el("a", { classe: "botao", href: base + (k + 1), texto: "Próximo ▶" })
      : i < G.modulos.length - 1 ? el("a", { classe: "botao", href: "#/modulo/" + G.modulos[i + 1].id + "/0", texto: "Fase " + (i + 2) + " ▶" })
        : el("a", { classe: "botao", href: "#/conquistas", texto: "🏆 Conquistas" });

    return [
      el("div", { classe: "fase-cabeca" }, [
        el("div", { classe: "fase-icone", style: "background:" + cor, texto: m.conquista.emoji }),
        el("div", {}, [el("h2", { texto: "Fase " + (i + 1) + ": " + m.titulo }), el("div", { classe: "meta", texto: m.semana + " · " + pctModulo(m) + "% · " + xpModulo(m) + " XP" })]),
      ]),
      trilha,
      tela,
      el("div", { classe: "controles" }, [anterior, el("span", { classe: "dica-teclado", texto: "← → no teclado" }), proximo]),
    ];
  }

  function paginaInventario() {
    const p = G.perfil;
    const baixar = el("button", { classe: "botao", type: "button", texto: "💾 Salvar progresso" });
    baixar.addEventListener("click", () => {
      const resumo = { guia: G.versao, xp: xpTotal(), nivel: G.niveis[nivelDe(xpTotal())].nome, ...progresso };
      const arquivo = new Blob([JSON.stringify(resumo, null, 2)], { type: "application/json" });
      const a = el("a", { href: URL.createObjectURL(arquivo), download: "progresso-guia-ia.json" });
      document.body.appendChild(a); a.click(); a.remove();
    });
    const entrada = el("input", { type: "file", accept: "application/json" });
    entrada.addEventListener("change", (ev) => {
      const f = ev.target.files && ev.target.files[0];
      if (!f) return;
      f.text().then((t) => {
        try {
          const d = JSON.parse(t);
          progresso = { marcados: d.marcados || {}, notas: d.notas || {}, quiz: d.quiz || {}, dias: d.dias || [] };
          salvar(); render(); avisar("📂 Progresso carregado!");
        } catch (e) { avisar("Arquivo inválido."); }
      });
    });
    return [
      dialogo("Seu inventário: os poderes que você já tem e as habilidades que vai ganhar.", null, "marcelle"),
      el("h3", { texto: "⚡ Poderes" }),
      el("div", { classe: "slots" }, p.ja_sabe.map((s) => el("div", { classe: "slot livre", title: s.uso_aqui }, [
        el("span", { classe: "icone", texto: "⚡" }), el("h4", { texto: s.tema }), el("p", { texto: s.uso_aqui }),
      ]))),
      el("h3", { texto: "🔒 Habilidades a ganhar" }),
      el("div", { classe: "slots" }, p.a_desenvolver.map((t) => el("div", { classe: "slot bloqueado" }, [el("span", { classe: "icone", texto: "✨" }), el("p", { texto: t })]))),
      el("h3", { texto: "💾 Progresso" }),
      el("p", { classe: "meta", texto: "Salve um arquivo para mandar à Nicole ou trocar de computador." }),
      el("div", { classe: "acoes" }, [baixar, el("label", { classe: "botao secundario botao-arquivo" }, ["📂 Carregar", entrada])]),
    ];
  }

  function paginaConquistas() {
    const nivelAtual = nivelDe(xpTotal());
    return [
      dialogo("Complete uma fase inteira, com quiz e tudo, para ganhar a insígnia dela."),
      el("h3", { texto: "🏅 Insígnias" }),
      el("div", { classe: "slots" }, G.modulos.map((m, i) => {
        const livre = pctModulo(m) === 100;
        return el("a", { classe: "slot " + (livre ? "livre" : "bloqueado"), href: "#/modulo/" + m.id + "/0" }, [
          el("span", { classe: "icone", texto: livre ? m.conquista.emoji : "🔒" }),
          el("h4", { texto: m.conquista.nome }),
          el("p", { texto: "Fase " + (i + 1) + " · " + pctModulo(m) + "%" }),
        ]);
      })),
      el("h3", { texto: "📈 Níveis" }),
      el("div", { classe: "slots" }, G.niveis.map((n, k) => el("div", { classe: "slot " + (k <= nivelAtual ? "livre" : "bloqueado") }, [
        el("span", { classe: "icone", texto: n.emoji }), el("h4", { texto: "Nv " + (k + 1) }), el("p", { texto: n.nome + " · " + n.xp + " XP" }),
      ]))),
    ];
  }

  function paginaMaria() {
    const M = G.maria;
    return [
      dialogo("Este é o Livro da Maria: o que ela é e como o código se organiza.\n" + M.o_que_e),
      el("h3", { texto: "🏛️ Camadas" }),
      el("div", { classe: "slots" }, M.camadas.map((c) => el("div", { classe: "slot" }, [el("h4", {}, [el("code", { texto: c.pasta })]), el("p", { texto: c.papel })]))),
      el("h3", { texto: "🌍 Ambientes" }),
      el("div", { classe: "slots" }, M.ambientes.map((a) => el("div", { classe: "slot" }, [el("h4", { texto: a.nome }), el("p", { texto: a.papel })]))),
      el("h3", { texto: "👣 Comece lendo" }),
      el("div", { classe: "painel" }, [el("ul", {}, M.comecar_por.map((c) => el("li", {}, [linkSeguro(c.arquivo, G.repositorio_maria + "/blob/develop/" + c.arquivo), " — " + c.porque])))]),
      el("p", { classe: "meta" }, ["🧰 ", M.stack.join(" · ")]),
    ];
  }

  function paginaRegras() {
    return [
      dialogo("Todo jogo tem regras. Estas protegem as pessoas atendidas e a equipe."),
      el("div", { classe: "pergaminho" }, [el("ol", {}, G.regras.map((r) => el("li", {}, [el("h4", { texto: r.titulo }), r.texto])))]),
    ];
  }

  function paginaGlossario() {
    return [
      dialogo("Palavras que você vai ouvir na equipe. Passe por cada uma!"),
      el("div", { classe: "slots" }, G.glossario.map((g) => el("div", { classe: "slot" }, [el("h4", { texto: g.termo }), el("p", { texto: g.texto })]))),
    ];
  }

  // ── Rotas e teclado ────────────────────────────────────────────────────────────
  function rotaAtual() { return location.hash.replace(/^#\//, "") || "inicio"; }
  function render() {
    const rota = rotaAtual();
    const partes = rota.split("/");
    let pagina;
    if (partes[0] === "modulo") pagina = paginaModulo(partes[1], parseInt(partes[2] || "0", 10));
    else if (rota === "inventario") pagina = paginaInventario();
    else if (rota === "conquistas") pagina = paginaConquistas();
    else if (rota === "maria") pagina = paginaMaria();
    else if (rota === "regras") pagina = paginaRegras();
    else if (rota === "glossario") pagina = paginaGlossario();
    else pagina = paginaInicio();
    conteudo.replaceChildren(...pagina);
    document.querySelectorAll(".hud-menu a").forEach((a) => a.classList.toggle("ativo", a.getAttribute("href") === "#/" + partes[0]));
    conteudo.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    atualizarHud();
  }
  document.addEventListener("keydown", (ev) => {
    if (/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(document.activeElement && document.activeElement.tagName)) return;
    const partes = rotaAtual().split("/");
    if (partes[0] !== "modulo") return;
    const k = parseInt(partes[2] || "0", 10);
    if (ev.key === "ArrowRight" && k < PASSOS.length - 1) location.hash = "#/modulo/" + partes[1] + "/" + (k + 1);
    if (ev.key === "ArrowLeft" && k > 0) location.hash = "#/modulo/" + partes[1] + "/" + (k - 1);
  });

  document.getElementById("hud-avatar").appendChild(sprite("marcelle"));
  document.getElementById("hud-nome").textContent = G.jogadora.nome;
  document.title = G.titulo;
  window.addEventListener("hashchange", render);
  render();
})();

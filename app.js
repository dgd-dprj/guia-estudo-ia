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
  // historico: XP ao fim de cada dia com avanço. quizPrimeira: 1ª resposta de cada pergunta.
  // concluidas: data em que cada fase chegou a 100%.
  function normalizar(p) {
    p = p && typeof p === "object" ? p : {};
    return {
      marcados: p.marcados || {}, notas: p.notas || {}, quiz: p.quiz || {}, dias: p.dias || [],
      historico: p.historico || {}, quizPrimeira: p.quizPrimeira || {}, concluidas: p.concluidas || {},
    };
  }
  function lerProgresso() {
    try {
      return normalizar(JSON.parse(localStorage.getItem(CHAVE) || "{}"));
    } catch (e) {
      return normalizar({});
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
    const novas = G.modulos.filter((m) => pctModulo(m) === 100 && !antesCompletos.has(m.id));
    novas.forEach((m) => { if (!progresso.concluidas[m.id]) progresso.concluidas[m.id] = hoje(); });
    progresso.historico[hoje()] = xpTotal();
    salvar();
    const ganho = xpTotal() - antesXp;
    if (ganho > 0) avisar("+" + ganho + " XP");
    novas.forEach((m) => {
      confete();
      avisar(m.conquista.emoji + " Conquista: " + m.conquista.nome + "!", true);
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
            comAvisos(() => {
              progresso.quiz[m.id] = Object.assign({}, progresso.quiz[m.id], { [i]: k });
              const primeira = progresso.quizPrimeira[m.id] || {};
              if (primeira[i] === undefined) progresso.quizPrimeira[m.id] = Object.assign({}, primeira, { [i]: k });
            });
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
      el("h3", { texto: "🗺️ Legenda do mapa" }),
      el("ol", { classe: "legenda-fases" }, G.modulos.map((m, i) => {
        const pct = pctModulo(m);
        const estado = pct === 100 ? " feito" : m.id === atual.id ? " atual" : "";
        return el("li", {}, [el("a", { classe: "fase-item" + estado, href: "#/modulo/" + m.id + "/0" }, [
          el("span", { classe: "numero", texto: String(i + 1) }),
          el("span", { classe: "emoji", "aria-hidden": "true", texto: pct === 100 ? "🏁" : m.conquista.emoji }),
          el("span", { classe: "nome", texto: m.titulo }),
          el("span", { classe: "pct", texto: pct + "%" }),
        ])]);
      })),
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
          progresso = normalizar(d);
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
      el("h3", { texto: "📤 Enviar à equipe" }),
      el("p", { classe: "meta", texto: "Abre uma issue no GitHub já preenchida com seu progresso. É só confirmar. O envio é público e não leva as anotações do diário." }),
      el("div", { classe: "acoes" }, [botaoEnviar(), el("a", { classe: "botao secundario", href: "#/painel", texto: "📊 Ver o painel" })]),
      el("h3", { texto: "💾 Cópia de segurança" }),
      el("p", { classe: "meta", texto: "Salve um arquivo para trocar de computador ou guardar uma cópia." }),
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

  // ── Datas e números ────────────────────────────────────────────────────────────
  const RE_DATA = /^\d{4}-\d{2}-\d{2}$/;
  const dataValida = (d) => typeof d === "string" && RE_DATA.test(d);
  function diaNum(d) { const [a, b, c] = d.split("-").map(Number); return Math.round(new Date(a, b - 1, c).getTime() / 864e5); }
  function dataDeNum(n) { return dataDe(new Date(1970, 0, 1 + n)); }
  const dataCurta = (d) => (dataValida(d) ? d.slice(8, 10) + "/" + d.slice(5, 7) : "—");
  const dataLonga = (d) => (dataValida(d) ? dataCurta(d) + "/" + d.slice(0, 4) : "—");
  const fmt = (n) => Math.round(n).toLocaleString("pt-BR");
  const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
  const plural = (n, um, varios) => fmt(n) + " " + (n === 1 ? um : varios);
  const nomeFase = (id) => {
    const i = G.modulos.findIndex((m) => m.id === id);
    return i < 0 ? "—" : "Fase " + (i + 1) + ": " + G.modulos[i].titulo;
  };
  function linkNovaIssue(titulo, corpo) {
    return "https://github.com/" + G.repositorio_guia + "/issues/new?title=" + encodeURIComponent(titulo) + "&body=" + encodeURIComponent(corpo);
  }
  function linkExterno(texto, href, classe) {
    const a = linkSeguro(texto, href);
    if (classe) a.className = classe;
    return a;
  }

  // ── Tarefas lançadas pela equipe (dados/tarefas.js) ──────────────────────────
  const T = window.TAREFAS || { tarefas: [], criterios: {} };
  const STATUS = {
    lancada: { icone: "📌", nome: "Lançada", classe: "neutro" },
    em_andamento: { icone: "⏳", nome: "Em andamento", classe: "andamento" },
    entregue: { icone: "📬", nome: "Entregue", classe: "entregue" },
    refazer: { icone: "↺", nome: "Ajustar e reenviar", classe: "refazer" },
    avaliada: { icone: "✅", nome: "Avaliada", classe: "bom" },
  };
  const foiEntregue = (t) => t.status === "entregue" || t.status === "avaliada";
  function situacaoPrazo(t, ref) {
    if (!dataValida(t.prazo)) return { texto: "sem prazo", classe: "neutro", atraso: 0 };
    const em = t.entrega && dataValida(t.entrega.em) ? t.entrega.em : null;
    if (em) {
      const atraso = diaNum(em) - diaNum(t.prazo);
      return atraso > 0
        ? { texto: "⚠ entregue " + plural(atraso, "dia", "dias") + " depois do prazo", classe: "atraso", atraso: atraso }
        : { texto: "✓ entregue no prazo", classe: "bom", atraso: 0, noPrazo: true };
    }
    if (foiEntregue(t)) return { texto: "entregue (sem data)", classe: "neutro", atraso: 0 };
    const falta = diaNum(t.prazo) - diaNum(ref);
    if (falta < 0) return { texto: "⚠ atrasada " + plural(-falta, "dia", "dias"), classe: "critico", atraso: -falta, atrasada: true };
    return { texto: falta === 0 ? "⏰ vence hoje" : "⏳ faltam " + plural(falta, "dia", "dias"), classe: "neutro", atraso: 0 };
  }
  function notasDe(t) {
    const c = (t.avaliacao || {}).criterios || {};
    return Object.keys(T.criterios || {}).map((k) => c[k]).filter((v) => Number.isInteger(v) && v >= 1 && v <= 5);
  }
  function notaMedia(t) { const v = notasDe(t); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; }
  const fmtNota = (x) => (x == null ? "—" : x.toFixed(1).replace(".", ",") + "/5");
  function seloStatus(st) {
    const s = STATUS[st] || STATUS.lancada;
    return el("span", { classe: "selo " + s.classe }, [s.icone + " " + s.nome]);
  }
  function notaPixels(v) {
    const caixa = el("span", { classe: "nota-pixels", "aria-hidden": "true" });
    for (let i = 1; i <= 5; i++) caixa.appendChild(el("i", { classe: v != null && i <= v ? "cheio" : null }));
    return caixa;
  }
  function blocoAvaliacao(t) {
    const a = t.avaliacao || {};
    const c = a.criterios || {};
    if (!notasDe(t).length && !a.comentario) return el("p", { classe: "meta", texto: "Ainda sem avaliação." });
    return el("div", { classe: "avaliacao" }, [
      el("ul", { classe: "criterios" }, Object.entries(T.criterios || {}).map(([k, nome]) => {
        const v = Number.isInteger(c[k]) ? c[k] : null;
        return el("li", {}, [el("span", { texto: nome }), notaPixels(v), el("strong", { texto: v == null ? "—" : v + "/5" })]);
      })),
      a.comentario ? el("p", { classe: "comentario" }, ["💬 ", a.comentario]) : null,
      el("p", { classe: "meta", texto: "Avaliada por " + ((a.por || []).join(" e ") || "—") + (dataValida(a.em) ? " em " + dataLonga(a.em) : "") + " · média " + fmtNota(notaMedia(t)) }),
    ]);
  }
  const ficha = (rotulo, valor) => el("div", {}, [el("dt", { texto: rotulo }), el("dd", {}, [valor])]);
  function issuesDaMaria(lista) {
    return (lista || []).length ? el("span", {}, lista.flatMap((n, j) => (j ? [", ", linkIssue(n)] : [linkIssue(n)]))) : "—";
  }
  function cartaoTarefa(t) {
    const prazo = situacaoPrazo(t, hoje());
    const corpo = "Tarefa: " + t.id + " — " + t.titulo + "\n\nLink do PR ou da issue: \n\nO que fiz: \n\nComo testei: \n\nDúvidas: \n\n(Sem dados pessoais de assistidos e sem chaves.)";
    const entrega = t.entrega || {};
    return el("article", { classe: "painel tarefa-cartao" }, [
      el("div", { classe: "tarefa-topo" }, [el("span", { classe: "tarefa-id", texto: t.id }), el("h3", { texto: t.titulo }), seloStatus(t.status)]),
      el("p", { texto: t.descricao }),
      el("dl", { classe: "fichas" }, [
        ficha("Fase", t.fase ? linkSeguro(nomeFase(t.fase), "#/modulo/" + t.fase + "/6") : "—"),
        ficha("Lançada por", (t.lancada_por || "—") + " em " + dataLonga(t.lancada_em)),
        ficha("Prazo", el("span", {}, [dataLonga(t.prazo) + " ", el("span", { classe: "prazo " + prazo.classe, texto: prazo.texto })])),
        ficha("Issues da Maria", issuesDaMaria(t.issues_maria)),
        ficha("Entrega", entrega.link ? linkSeguro("abrir a entrega", entrega.link) : dataValida(entrega.em) ? dataLonga(entrega.em) : "—"),
      ]),
      entrega.observacao ? el("p", { classe: "meta" }, ["📝 ", entrega.observacao]) : null,
      el("h4", { texto: "⭐ Avaliação" }),
      blocoAvaliacao(t),
      foiEntregue(t) ? null : el("div", { classe: "acoes" }, [
        linkExterno("📬 Avisar entrega", linkNovaIssue("[entrega] " + t.id + " — " + t.titulo, corpo), "botao"),
      ]),
    ]);
  }
  function paginaTarefas() {
    const lista = T.tarefas || [];
    const abertas = lista.filter((t) => !foiEntregue(t)).length;
    const fala = !lista.length ? "Ainda não há tarefas lançadas. Quando a Nicole ou o Ícaro lançarem, elas aparecem aqui."
      : "Estas são as tarefas que a Nicole e o Ícaro lançaram para você.\n" + (abertas ? "Em aberto: " + abertas + ". Ao terminar, use \"Avisar entrega\"." : "Tudo entregue! 🎉");
    return [
      dialogo(fala),
      el("div", { classe: "legenda" }, Object.values(STATUS).map((s) => el("span", { classe: "selo " + s.classe, texto: s.icone + " " + s.nome }))),
      ...lista.slice().reverse().map(cartaoTarefa),
      el("details", { classe: "como-lancar" }, [
        el("summary", { texto: "🧭 Como lançar uma tarefa (Nicole e Ícaro)" }),
        el("p", { texto: T.explicacao || "" }),
        el("p", {}, [linkSeguro("✏️ Editar dados/tarefas.js no GitHub", "https://github.com/" + G.repositorio_guia + "/edit/main/dados/tarefas.js")]),
      ]),
    ];
  }

  // ── Resumo para a equipe (nunca leva o diário) ────────────────────────────────
  const xpMaximo = () => G.modulos.reduce((s, m) => s + itensDoModulo(m).reduce((a, [, v]) => a + v, 0) + m.quiz.length * XP.quiz, 0);
  const contar = (lista, prefixo) => [lista.filter((_, i) => progresso.marcados[prefixo + i]).length, lista.length];
  function resumoParaEquipe(dias) {
    const xp = xpTotal();
    const datas = Object.keys(progresso.historico).sort().slice(-dias);
    return {
      v: 1, guia: G.versao, xp: xp, xpMax: xpMaximo(), nivel: nivelDe(xp) + 1,
      historico: datas.map((d) => d + ":" + progresso.historico[d]).join(","),
      dias: progresso.dias.slice().sort().slice(-dias).join(","),
      fases: G.modulos.map((m) => {
        const primeira = progresso.quizPrimeira[m.id] || {};
        return {
          id: m.id, pct: pctModulo(m), xp: xpModulo(m),
          estudo: contar(m.estudar, m.id + ":estudar:"), pensar: contar(m.checar, m.id + ":checar:"),
          treino: progresso.marcados[m.id + ":praticar"] ? 1 : 0, missao: progresso.marcados[m.id + ":tarefa"] ? 1 : 0,
          pronto: contar(m.pronto, m.id + ":pronto:"),
          // respondidas, acertos agora, acertos de primeira, respondidas de primeira, total
          quiz: [Object.keys(respostasQuiz(m)).length, acertosQuiz(m), m.quiz.filter((q, i) => primeira[i] === q.correta).length, Object.keys(primeira).length, m.quiz.length],
          fim: progresso.concluidas[m.id] || null,
        };
      }),
    };
  }
  function urlEnvio() {
    let url = "";
    for (const dias of [120, 60, 30, 7]) {
      const corpo = "Progresso da Jornada IA, enviado pela página do guia.\nAs anotações do diário não vão neste envio.\n\n" +
        "Não edite o bloco abaixo: o painel da equipe lê dele.\n\n```json\n" + JSON.stringify(resumoParaEquipe(dias)) + "\n```\n";
      url = linkNovaIssue("[progresso] " + G.jogadora.nome + " — " + dataLonga(hoje()), corpo);
      if (url.length < 7500) break;
    }
    return url;
  }
  function botaoEnviar() {
    const a = linkExterno("📤 Enviar progresso", urlEnvio(), "botao");
    a.addEventListener("click", () => { a.href = urlEnvio(); });
    return a;
  }

  // ── Leitura dos envios (issues públicas do repositório do guia) ───────────────
  let envios = { estado: "nada", lista: [], entregas: {}, erro: null };
  let fontePainel = null; // null: último envio, se houver; "local": este navegador
  function lerResumo(s, data, link) {
    if (!s || typeof s !== "object" || !Array.isArray(s.fases)) return null;
    const n = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);
    const par = (a) => (Array.isArray(a) ? [n(a[0]), n(a[1])] : [0, 0]);
    const pares = (txt) => (typeof txt === "string" && txt ? txt.split(",").map((p) => p.split(":")).filter((p) => dataValida(p[0])) : []);
    return {
      data: data, link: link, xp: n(s.xp), xpMax: n(s.xpMax) || xpMaximo(), nivel: nivelDe(n(s.xp)) + 1,
      historico: Object.fromEntries(pares(s.historico).map((p) => [p[0], n(p[1])])),
      dias: pares(s.dias).map((p) => p[0]),
      fases: s.fases.map((f) => ({
        id: String(f.id || ""), pct: n(f.pct), xp: n(f.xp), estudo: par(f.estudo), pensar: par(f.pensar),
        treino: n(f.treino), missao: n(f.missao), pronto: par(f.pronto),
        quiz: [0, 1, 2, 3, 4].map((i) => n((f.quiz || [])[i])), fim: dataValida(f.fim) ? f.fim : null,
      })),
    };
  }
  function resumoLocal() { return lerResumo(resumoParaEquipe(365), hoje(), null); }
  function buscarEnvios() {
    envios = { estado: "carregando", lista: [], entregas: {}, erro: null };
    const login = String(G.jogadora.github || "").toLowerCase();
    const url = "https://api.github.com/repos/" + G.repositorio_guia + "/issues?state=all&per_page=100&sort=created&direction=asc&creator=" + encodeURIComponent(login);
    fetch(url, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 403 ? "o GitHub limitou as consultas por agora; tente de novo daqui a pouco" : "o GitHub respondeu " + r.status);
        return r.json();
      })
      .then((itens) => {
        const lista = [];
        const entregas = {};
        // Só vale o que a própria jogadora abriu: o repositório é público.
        itens.filter((i) => !i.pull_request && i.user && String(i.user.login).toLowerCase() === login).forEach((i) => {
          const titulo = String(i.title || "");
          const data = dataDe(new Date(i.created_at));
          if (titulo.startsWith("[progresso]")) {
            const bloco = /```json\s*([\s\S]*?)```/.exec(i.body || "");
            let s = null;
            try { s = bloco && JSON.parse(bloco[1]); } catch (e) { s = null; }
            const r = lerResumo(s, data, i.html_url);
            if (r) lista.push(r);
          } else if (titulo.startsWith("[entrega]")) {
            const id = (/^\[entrega\]\s*(T\d+)/.exec(titulo) || [])[1];
            if (id) entregas[id] = { data: data, link: i.html_url };
          }
        });
        envios = { estado: "pronto", lista: lista, entregas: entregas, erro: null };
      })
      .catch((e) => { envios = { estado: "erro", lista: [], entregas: {}, erro: e.message }; })
      .then(() => { if (rotaAtual() === "painel") render(); });
  }

  // ── Gráficos (SVG à mão, sem biblioteca) ───────────────────────────────────────
  const NS = "http://www.w3.org/2000/svg";
  function svgEl(tag, atributos, filhos) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(atributos || {})) if (v != null) n.setAttribute(k, v);
    for (const f of [].concat(filhos || [])) if (f != null) n.appendChild(typeof f === "string" ? document.createTextNode(f) : f);
    return n;
  }
  function mostrarDica(dica, caixa, texto, x, y) {
    dica.textContent = texto;
    dica.hidden = false;
    const largura = caixa.clientWidth;
    dica.style.left = Math.max(70, Math.min(largura - 70, x)) + "px";
    dica.style.top = y + "px";
  }
  function tabelaSimples(cabecas, linhas, classe) {
    return el("div", { classe: "tabela-rolagem" }, [el("table", { classe: "tabela " + (classe || "") }, [
      el("thead", {}, [el("tr", {}, cabecas.map((c) => el("th", { scope: "col", texto: c })))]),
      el("tbody", {}, linhas.map((l) => el("tr", {}, l.map((c, j) => (j === 0 ? el("th", { scope: "row" }, [c]) : el("td", {}, [c])))))),
    ])]);
  }

  // Linha única do XP acumulado, com as faixas de nível como grade.
  function graficoEvolucao(pontos) {
    const caixa = el("div", { classe: "grafico" });
    if (pontos.length < 2) {
      caixa.appendChild(el("p", { classe: "meta", texto: "A curva aparece quando houver avanço em pelo menos dois dias." }));
      return caixa;
    }
    const L = Math.max(320, Math.min(940, (conteudo.clientWidth || 900) - 70));
    const A = 260, me = 54, md = 20, mc = 18, mb = 34;
    const t0 = diaNum(pontos[0].data), t1 = diaNum(pontos[pontos.length - 1].data);
    const maior = Math.max(...pontos.map((p) => p.xp));
    const prox = G.niveis.find((nv) => nv.xp > maior);
    const topo = prox ? prox.xp : Math.max(100, maior);
    const x = (d) => me + ((L - me - md) * (diaNum(d) - t0)) / Math.max(1, t1 - t0);
    const y = (v) => A - mb - ((A - mb - mc) * v) / topo;
    const ultimo = pontos[pontos.length - 1];
    const svg = svgEl("svg", {
      viewBox: "0 0 " + L + " " + A, class: "svg-grafico", role: "img",
      "aria-label": "XP acumulado de " + dataLonga(pontos[0].data) + " a " + dataLonga(ultimo.data) + ": de " + fmt(pontos[0].xp) + " a " + fmt(ultimo.xp) + " XP",
    });
    G.niveis.forEach((nv, k) => {
      if (nv.xp > topo) return;
      svg.appendChild(svgEl("line", { x1: me, x2: L - md, y1: y(nv.xp), y2: y(nv.xp), class: k === 0 ? "eixo" : "grade" }));
      svg.appendChild(svgEl("text", { x: me - 8, y: y(nv.xp) + 4, "text-anchor": "end", class: "rotulo" }, "Nv " + (k + 1)));
    });
    const marcas = [pontos[0].data];
    if (t1 - t0 >= 8) marcas.push(dataDeNum(Math.round((t0 + t1) / 2)));
    marcas.push(ultimo.data);
    marcas.forEach((d, j) => svg.appendChild(svgEl("text", {
      x: x(d), y: A - 10, class: "rotulo", "text-anchor": j === 0 ? "start" : j === marcas.length - 1 ? "end" : "middle",
    }, dataCurta(d))));
    svg.appendChild(svgEl("path", { d: pontos.map((p, i) => (i ? "L" : "M") + x(p.data).toFixed(1) + " " + y(p.xp).toFixed(1)).join(" "), class: "linha" }));
    svg.appendChild(svgEl("circle", { cx: x(ultimo.data), cy: y(ultimo.xp), r: 5, class: "ponto" }));
    svg.appendChild(svgEl("text", { x: x(ultimo.data) - 10, y: y(ultimo.xp) - 12, "text-anchor": "end", class: "rotulo-forte" }, fmt(ultimo.xp) + " XP"));
    const guia = svgEl("line", { y1: mc, y2: A - mb, class: "guia", visibility: "hidden" });
    const foco = svgEl("circle", { r: 6, class: "ponto foco", visibility: "hidden" });
    const area = svgEl("rect", { x: me - 10, y: 0, width: L - me - md + 20, height: A - mb, fill: "transparent" });
    svg.append(guia, foco, area);
    const dica = el("div", { classe: "dica-grafico", hidden: "" });
    area.addEventListener("pointermove", (ev) => {
      const r = svg.getBoundingClientRect();
      const esc = r.width / L;
      const px = (ev.clientX - r.left) / esc;
      let i = 0;
      pontos.forEach((p, k) => { if (Math.abs(x(p.data) - px) < Math.abs(x(pontos[i].data) - px)) i = k; });
      const p = pontos[i];
      const ganho = i ? p.xp - pontos[i - 1].xp : p.xp;
      ["x1", "x2"].forEach((a) => guia.setAttribute(a, x(p.data)));
      foco.setAttribute("cx", x(p.data)); foco.setAttribute("cy", y(p.xp));
      guia.setAttribute("visibility", "visible"); foco.setAttribute("visibility", "visible");
      mostrarDica(dica, caixa, dataLonga(p.data) + " · " + fmt(p.xp) + " XP (" + (ganho >= 0 ? "+" : "") + fmt(ganho) + ") · Nv " + (nivelDe(p.xp) + 1), x(p.data) * esc, y(p.xp) * esc);
    });
    area.addEventListener("pointerleave", () => { guia.setAttribute("visibility", "hidden"); foco.setAttribute("visibility", "hidden"); dica.hidden = true; });
    caixa.append(svg, dica, el("details", { classe: "ver-tabela" }, [
      el("summary", { texto: "Ver em tabela" }),
      tabelaSimples(["Dia", "XP", "Ganho", "Nível"], pontos.map((p, i) => [dataLonga(p.data), fmt(p.xp), (i ? "+" + fmt(p.xp - pontos[i - 1].xp) : fmt(p.xp)), "Nv " + (nivelDe(p.xp) + 1)])),
    ]));
    return caixa;
  }

  // Calendário das últimas semanas: um quadrado por dia, mais escuro = menos XP.
  const FAIXAS = [
    { ate: 0, nome: "sem avanço" }, { ate: 40, nome: "até 40 XP" }, { ate: 100, nome: "41 a 100" },
    { ate: 200, nome: "101 a 200" }, { ate: Infinity, nome: "mais de 200" },
  ];
  function calendarioAtividade(ganhos, estudou, ref) {
    const semanas = 12;
    const fim = diaNum(ref);
    const [a, b, c] = ref.split("-").map(Number);
    const semanaDia = (new Date(a, b - 1, c).getDay() + 6) % 7; // 0 = segunda
    const inicio = fim - semanaDia - (semanas - 1) * 7;
    const caixa = el("div", { classe: "grafico" });
    const dica = el("div", { classe: "dica-grafico", hidden: "" });
    const grade = el("div", { classe: "calendario", role: "img", "aria-label": "Dias com avanço nas últimas " + semanas + " semanas" });
    let ativos = 0;
    for (let n = inicio; n < inicio + semanas * 7; n++) {
      if (n > fim) { grade.appendChild(el("span", { classe: "dia futuro" })); continue; }
      const data = dataDeNum(n);
      const g = ganhos[data] || 0;
      const foi = estudou.has(data) || g > 0;
      if (foi) ativos += 1;
      const faixa = !foi ? 0 : FAIXAS.findIndex((f, k) => k > 0 && g <= f.ate);
      const texto = dataLonga(data) + ": " + (foi ? "+" + fmt(g) + " XP" : "sem avanço");
      const q = el("span", { classe: "dia n" + faixa, "aria-label": texto });
      q.addEventListener("pointerenter", () => {
        const r = q.getBoundingClientRect(), rc = caixa.getBoundingClientRect();
        mostrarDica(dica, caixa, texto, r.left - rc.left + r.width / 2, r.top - rc.top);
      });
      q.addEventListener("pointerleave", () => { dica.hidden = true; });
      grade.appendChild(q);
    }
    caixa.append(
      el("div", { classe: "calendario-moldura" }, [
        el("div", { classe: "calendario-dias", "aria-hidden": "true" }, ["seg", "", "qua", "", "sex", "", "dom"].map((d) => el("span", { texto: d }))),
        grade,
      ]),
      dica,
      el("div", { classe: "legenda legenda-calor" }, [
        ...FAIXAS.map((f, k) => el("span", { classe: "amostra n" + k, texto: f.nome })),
      ]),
      el("p", { classe: "meta", texto: plural(ativos, "dia", "dias") + " com avanço em " + semanas + " semanas, até " + dataLonga(ref) + "." }),
    );
    return caixa;
  }

  // ── Painel da equipe ──────────────────────────────────────────────────────────
  function cartaoNumero(rotulo, valor, detalhe, classe) {
    return el("div", { classe: "kpi" + (classe ? " " + classe : "") }, [
      el("span", { classe: "kpi-rotulo", texto: rotulo }), el("strong", { classe: "kpi-valor", texto: valor }), el("span", { classe: "kpi-detalhe", texto: detalhe }),
    ]);
  }
  function sequenciaAte(diasSet, ref) {
    let n = diaNum(ref);
    if (!diasSet.has(dataDeNum(n))) n -= 1;
    let s = 0;
    while (diasSet.has(dataDeNum(n))) { s += 1; n -= 1; }
    return s;
  }
  function medidor(valor) {
    return el("span", { classe: "medidor" + (valor === 100 ? " cheio-total" : "") }, [
      el("span", { classe: "medidor-barra", "aria-hidden": "true" }, [el("span", { style: "width:" + Math.max(0, Math.min(100, valor)) + "%" })]),
      el("span", { classe: "medidor-texto", texto: (valor === 100 ? "🏁 " : "") + valor + "%" }),
    ]);
  }
  function secao(titulo, explicacao, filhos) {
    return el("section", { classe: "painel secao-painel" }, [el("h3", { texto: titulo }), explicacao ? el("p", { classe: "meta", texto: explicacao }) : null, ...[].concat(filhos)]);
  }

  function paginaPainel() {
    if (envios.estado === "nada") buscarEnvios();
    const temEnvio = envios.lista.length > 0;
    const usarEnvio = temEnvio && fontePainel !== "local";
    const r = usarEnvio ? envios.lista[envios.lista.length - 1] : resumoLocal();
    const ref = r.data;

    // Fonte dos dados
    const botaoFonte = (nome, texto, ativo, desligado) => {
      const b = el("button", { type: "button", classe: "botao secundario fonte" + (ativo ? " ativo" : ""), texto: texto, "aria-pressed": String(ativo) });
      b.disabled = !!desligado;
      b.addEventListener("click", () => { fontePainel = nome; render(); });
      return b;
    };
    const atualizar = el("button", { type: "button", classe: "botao secundario", texto: "↻ Atualizar" });
    atualizar.addEventListener("click", () => { buscarEnvios(); render(); });
    let estadoTexto;
    if (envios.estado === "carregando") estadoTexto = "Buscando os envios no GitHub…";
    else if (envios.estado === "erro") estadoTexto = "Não consegui ler os envios: " + envios.erro + ". Mostrando o progresso deste navegador.";
    else if (!temEnvio) estadoTexto = G.jogadora.nome + " ainda não enviou o progresso. Mostrando o deste navegador.";
    else if (usarEnvio) estadoTexto = "Mostrando o envio de " + dataLonga(r.data) + " (" + plural(envios.lista.length, "envio", "envios") + " no total).";
    else estadoTexto = "Mostrando o progresso guardado neste navegador.";

    // Números gerais
    const soma = (f) => r.fases.reduce((s, x) => s + f(x), 0);
    const somaPar = (k) => [soma((x) => x[k][0]), soma((x) => x[k][1])];
    const estudo = somaPar("estudo"), pensar = somaPar("pensar"), pronto = somaPar("pronto");
    const quizAcertoPrimeira = soma((x) => x.quiz[2]), quizTentadas = soma((x) => x.quiz[3]), quizTotal = soma((x) => x.quiz[4]);
    const completas = r.fases.filter((x) => x.pct === 100).length;
    const treinos = soma((x) => x.treino), missoes = soma((x) => x.missao);
    const nivel = G.niveis[Math.max(0, Math.min(G.niveis.length - 1, r.nivel - 1))];
    const proxNivel = G.niveis[r.nivel];

    // Histórico: junta todos os envios (o mais novo vale) ou o deste navegador
    const historico = {};
    (usarEnvio ? envios.lista : [r]).forEach((e) => { Object.assign(historico, e.historico); if (e.link) historico[e.data] = Math.max(historico[e.data] || 0, e.xp); });
    if (!usarEnvio) historico[ref] = Math.max(historico[ref] || 0, r.xp);
    const datasHist = Object.keys(historico).filter((d) => diaNum(d) <= diaNum(ref)).sort();
    const pontos = datasHist.map((d) => ({ data: d, xp: historico[d] }));
    const ganhos = {};
    datasHist.forEach((d, i) => { ganhos[d] = Math.max(0, historico[d] - (i ? historico[datasHist[i - 1]] : 0)); });
    const diasSet = new Set([...(usarEnvio ? envios.lista.flatMap((e) => e.dias) : r.dias), ...datasHist.filter((d) => ganhos[d] > 0)]);
    const dias = [...diasSet].sort();
    const primeiro = dias[0], ultimoDia = dias[dias.length - 1];
    const semanas = primeiro ? Math.max(1, (diaNum(ref) - diaNum(primeiro) + 1) / 7) : 1;
    const porSemana = r.xp / semanas;
    const faltam = Math.max(0, r.xpMax - r.xp);
    const previsao = porSemana > 0 && faltam > 0 ? Math.ceil(faltam / porSemana) : null;

    // Tarefas
    const tarefas = T.tarefas || [];
    const sit = tarefas.map((t) => situacaoPrazo(t, ref));
    const entregues = tarefas.filter(foiEntregue).length;
    const atrasadas = sit.filter((s) => s.atrasada).length;
    const noPrazo = sit.filter((s) => s.noPrazo).length;
    const comDataEntrega = sit.filter((s) => s.noPrazo || s.classe === "atraso").length;
    const medias = tarefas.map(notaMedia).filter((v) => v != null);
    const mediaGeral = medias.length ? medias.reduce((a, b) => a + b, 0) / medias.length : null;

    const kpis = el("div", { classe: "kpis" }, [
      cartaoNumero("Nível", nivel.emoji + " Nv " + r.nivel, nivel.nome + (proxNivel ? " · faltam " + fmt(proxNivel.xp - r.xp) + " XP para o próximo" : " · nível máximo")),
      cartaoNumero("Jornada", pct(r.xp, r.xpMax) + "%", fmt(r.xp) + " de " + fmt(r.xpMax) + " XP · " + completas + "/" + r.fases.length + " fases completas"),
      cartaoNumero("Estudo", estudo[0] + "/" + estudo[1], "itens do baú · para pensar " + pensar[0] + "/" + pensar[1]),
      cartaoNumero("Quiz de primeira", quizTentadas ? pct(quizAcertoPrimeira, quizTentadas) + "%" : "—",
        quizTentadas ? quizAcertoPrimeira + " de " + quizTentadas + " acertadas na 1ª tentativa · " + quizTentadas + "/" + quizTotal + " respondidas" : "nenhuma pergunta respondida ainda"),
      cartaoNumero("Prática", treinos + "/" + r.fases.length, "treinos feitos · missões das fases " + missoes + "/" + r.fases.length + " · pronto " + pronto[0] + "/" + pronto[1]),
      cartaoNumero("Tarefas lançadas", entregues + "/" + tarefas.length, "entregues · " + plural(atrasadas, "atrasada", "atrasadas") + (comDataEntrega ? " · " + noPrazo + "/" + comDataEntrega + " no prazo" : ""), atrasadas ? "alerta" : null),
      cartaoNumero("Avaliação média", fmtNota(mediaGeral), medias.length ? "de " + plural(medias.length, "tarefa avaliada", "tarefas avaliadas") : "nenhuma tarefa avaliada ainda"),
      cartaoNumero("Ritmo", primeiro ? fmt(porSemana) + " XP/sem" : "—",
        previsao ? "no ritmo atual, termina em cerca de " + plural(previsao, "semana", "semanas") : faltam ? "sem avanço registrado ainda" : "jornada concluída 🏆"),
      cartaoNumero("Constância", plural(dias.length, "dia", "dias"),
        primeiro ? "🔥 " + sequenciaAte(diasSet, ref) + " seguidos · último avanço " + (diaNum(ref) - diaNum(ultimoDia) === 0 ? (usarEnvio ? "no dia do envio" : "hoje") :"há " + plural(diaNum(ref) - diaNum(ultimoDia), "dia", "dias")) : "nenhum dia com avanço ainda"),
    ]);

    // Detalhe por fase
    const linhasFase = r.fases.map((f) => {
      const i = G.modulos.findIndex((m) => m.id === f.id);
      const m = G.modulos[i];
      const nome = m ? el("a", { href: "#/modulo/" + m.id + "/0" }, [(i + 1) + ". " + m.conquista.emoji + " " + m.titulo]) : f.id;
      const q = f.quiz;
      return [
        nome, medidor(f.pct), f.estudo[0] + "/" + f.estudo[1], f.pensar[0] + "/" + f.pensar[1],
        q[3] ? q[2] + "/" + q[4] + " · " + q[1] + "/" + q[4] : "—",
        f.treino ? "✓ feito" : "—", f.missao ? "✓ entregue" : "—", f.pronto[0] + "/" + f.pronto[1], fmt(f.xp), f.fim ? dataLonga(f.fim) : "—",
      ];
    });

    // Tarefas lançadas
    const linhasTarefa = tarefas.map((t, k) => {
      const aviso = envios.entregas[t.id];
      return [
        el("span", {}, [el("strong", { texto: t.id + " " }), t.titulo]),
        t.fase ? el("a", { href: "#/modulo/" + t.fase + "/6", texto: nomeFase(t.fase).split(":")[0] }) : "—",
        dataLonga(t.lancada_em), dataLonga(t.prazo),
        el("span", {}, [seloStatus(t.status), aviso && !foiEntregue(t) ? el("span", { classe: "meta" }, [" · avisou em " + dataCurta(aviso.data) + " ", linkSeguro("(issue)", aviso.link)]) : null]),
        el("span", { classe: "prazo " + sit[k].classe, texto: sit[k].texto }),
        fmtNota(notaMedia(t)),
      ];
    });
    const avaliacoes = tarefas.filter((t) => notasDe(t).length || (t.avaliacao || {}).comentario).map((t) => el("details", { classe: "avaliacao-tarefa" }, [
      el("summary", { texto: t.id + " · " + t.titulo + " · média " + fmtNota(notaMedia(t)) }), blocoAvaliacao(t),
    ]));

    return [
      dialogo("Painel da equipe: o desempenho de " + G.jogadora.nome + " no estudo e nas tarefas, para a Nicole e o Ícaro acompanharem."),
      el("div", { classe: "painel fonte-painel" }, [
        el("div", { classe: "acoes" }, [
          botaoFonte(null, "📨 Último envio", usarEnvio, !temEnvio),
          botaoFonte("local", "💻 Este navegador", !usarEnvio),
          atualizar,
          r.link ? linkExterno("Abrir o envio no GitHub", r.link, "botao secundario") : null,
        ]),
        el("p", { classe: "meta", texto: estadoTexto }),
      ]),
      el("h3", { texto: "📌 Resumo" }),
      kpis,
      secao("📈 Evolução do XP", "XP acumulado por dia com avanço. As linhas horizontais marcam onde começa cada nível. Passe o mouse para ver o dia.", graficoEvolucao(pontos)),
      secao("🗓️ Dias de estudo", "Cada quadrado é um dia; quanto mais claro, mais XP no dia.", calendarioAtividade(ganhos, diasSet, ref)),
      secao("🧩 Detalhe por fase", "Quiz: acertos na 1ª tentativa · acertos agora (o quiz pode ser refeito). Missão: a tarefa real da fase, marcada pela própria " + G.jogadora.nome + ".",
        tabelaSimples(["Fase", "Progresso", "Baú", "Pensar", "Quiz (1ª · agora)", "Treino", "Missão", "Pronto", "XP", "Concluída em"], linhasFase, "tabela-fases")),
      secao("✅ Tarefas lançadas pela equipe", "Lançadas e avaliadas em dados/tarefas.js. Situação do prazo em " + dataLonga(ref) + ".", [
        tarefas.length ? tabelaSimples(["Tarefa", "Fase", "Lançada", "Prazo", "Status", "Situação", "Nota"], linhasTarefa) : el("p", { classe: "meta", texto: "Nenhuma tarefa lançada ainda." }),
        ...avaliacoes,
        el("p", {}, [el("a", { href: "#/tarefas", texto: "Ver as tarefas em detalhe ▶" })]),
      ]),
      usarEnvio ? secao("📨 Envios", "Cada envio é uma issue pública aberta por " + G.jogadora.nome + " a partir da página.",
        tabelaSimples(["Data", "XP", "Fases completas", "Issue"], envios.lista.slice().reverse().map((e) => [dataLonga(e.data), fmt(e.xp), e.fases.filter((f) => f.pct === 100).length + "/" + e.fases.length, linkSeguro("abrir", e.link)]))) : null,
      el("p", { classe: "meta", texto: "🔒 O painel é público. Os envios não levam as anotações do diário nem dado pessoal; só contagens de progresso." }),
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
    else if (rota === "tarefas") pagina = paginaTarefas();
    else if (rota === "painel") pagina = paginaPainel();
    else pagina = paginaInicio();
    conteudo.replaceChildren(...pagina.filter(Boolean));
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

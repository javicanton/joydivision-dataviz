/* Unknown Pleasures (Joy Division) · reportaje con datos
   Cada línea es una canción y su relieve es un dato medido sobre el audio. Mientras una canción suena,
   su línea se convierte en su vúmetro: el espectro precalculado (data/vu/NN.bin) sincronizado con la
   reproducción. El texto del reportaje (js/i18n.js) cambia el estado del gráfico al hacer scroll. */
(async function () {
  "use strict";

  const params = new URLSearchParams(location.search);
  const STEPS = window.STEPS;
  const METRICS = ["loudness", "brightness", "bass", "onset"];

  // ---------- Geometría ----------
  const narrowMq = window.matchMedia("(max-width: 820px)"), NARROW = narrowMq.matches;
  const G = NARROW
    ? { W: 420, X0: 28, X1: 380, GAP: 27, SIDE_GAP: 22, AMP: 74, VU: 92 }
    : { W: 760, X0: 210, X1: 680, GAP: 40, SIDE_GAP: 30, AMP: 110, VU: 140 };
  const { W, X0, X1, GAP, SIDE_GAP, AMP } = G;
  const TOP = AMP + 36;

  const data = await d3.json("data/unknown-pleasures.json");
  const tracks = data.tracks;
  const byId = new Map(tracks.map(d => [d.id, d]));
  const maxS = d3.max(tracks, d => d.mp3_seconds);
  const base = d => TOP + (d.n - 1) * GAP + (d.side === 2 ? SIDE_GAP : 0);
  const H = base(tracks[tracks.length - 1]) + 40;

  const state = {
    lang: params.get("lang") === "en" || (!params.get("lang") && !(navigator.language || "es").toLowerCase().startsWith("es")) ? "en" : "es",
    metric: "loudness", mode: "equal", focus: [], feature: null, step: null, hover: null
  };
  const T = () => window.I18N[state.lang];
  const fmt = (v, k = 2) => v.toFixed(k).replace(".", state.lang === "es" ? "," : ".");
  const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const pad = n => String(n).padStart(2, "0");

  const svg = d3.select("#viz").attr("viewBox", `0 0 ${W} ${H}`);
  const tip = d3.select("#tip");

  // ---------- Escalas ----------
  const xEnd = d => (state.mode === "real" ? X0 + (X1 - X0) * d.mp3_seconds / maxS : X1);
  const prof = d => d.profiles[state.metric];
  const xAt = (d, i, n) => X0 + (xEnd(d) - X0) * i / (n - 1);
  const line = d3.line().curve(d3.curveBasis);
  const ptsData = d => prof(d).map((v, i, a) => [xAt(d, i, a.length), base(d) - v * AMP]);
  const linePath = pts => line(pts);
  const fillPath = (pts, d) => line(pts) + `L${xEnd(d)},${base(d)}L${X0},${base(d)}Z`;

  // ---------- Dibujo ----------
  const axis = svg.append("g").attr("class", "axis");
  const labels = svg.append("g");
  const ridges = svg.selectAll(".ridge").data(tracks).join("g").attr("class", "ridge").attr("data-id", d => d.id);
  ridges.append("line").attr("class", "base").attr("x1", X0).attr("y1", base).attr("y2", base);
  ridges.append("path").attr("class", "fill");
  ridges.append("path").attr("class", "line");
  ridges.append("line").attr("class", "prog").attr("y1", base).attr("y2", base).style("display", "none");
  ridges.append("line").attr("class", "head").style("display", "none");
  ridges.append("text").attr("class", "htime").style("display", "none");
  ridges.append("text").attr("class", "num").attr("x", 0).attr("y", d => base(d) - 4).text(d => pad(d.n));
  if (!NARROW) ridges.append("text").attr("class", "name").attr("x", 30).attr("y", d => base(d) - 4).text(d => d.title.toUpperCase());
  ridges.append("text").attr("class", "dur num").attr("x", W).attr("y", d => base(d) - 4).attr("text-anchor", "end");
  ridges.append("line").attr("class", "cursor").style("display", "none");
  ridges.append("circle").attr("class", "dot").attr("r", 2.6).style("display", "none");
  ridges.append("rect").attr("class", "hit").attr("x", 0).attr("width", W)
    .attr("y", d => base(d) - GAP).attr("height", GAP).attr("tabindex", 0).attr("role", "button");

  function geometry(animate) {
    const sel = animate ? ridges.transition().duration(700).ease(d3.easeCubicInOut) : ridges;
    sel.select(".base").attr("x2", xEnd);
    // la línea que suena la dibuja el vúmetro
    const idle = animate ? ridges.filter(d => d.id !== vuId()).transition().duration(700).ease(d3.easeCubicInOut) : ridges.filter(d => d.id !== vuId());
    idle.select(".line").attr("d", d => linePath(ptsData(d)));
    idle.select(".fill").attr("d", d => fillPath(ptsData(d), d));
    updateFeature();
  }

  function updateFeature() {
    const f = state.feature, t = T();
    ridges.select(".dur").text(d => (f ? fmt(d.features[f]) : NARROW ? "" : mmss(d.mp3_seconds)))
      .classed("fval", !!f);
    labels.select(".col-label").text(f ? t.features[f] : "");
  }

  function renderLabels() {
    const t = T();
    labels.selectAll("*").remove();
    if (!NARROW) [1, 2].forEach(s => {
      const first = tracks.find(d => d.side === s);
      labels.append("text").attr("class", "side-label").attr("x", NARROW ? 0 : 30).attr("y", base(first) - GAP + 2).text(t.sides[s]);
    });
    labels.append("text").attr("class", "col-label").attr("x", W).attr("y", base(tracks[0]) - GAP + 2).attr("text-anchor", "end");
    renderAxis();
  }
  function renderAxis() {
    const t = T(), y = H - 10;
    axis.selectAll("*").remove();
    if (state.mode === "equal") {
      axis.append("text").attr("x", X0).attr("y", y).text(t.start);
      axis.append("text").attr("x", X1).attr("y", y).attr("text-anchor", "end").text(t.end);
      return;
    }
    const x = d3.scaleLinear([0, maxS], [X0, X1]);
    d3.range(0, maxS + 1, 60).forEach(s => {
      axis.append("line").attr("x1", x(s)).attr("x2", x(s)).attr("y1", y - 16).attr("y2", y - 10);
      axis.append("text").attr("x", x(s)).attr("y", y).attr("text-anchor", s ? "middle" : "start").text(s ? s / 60 : `0 ${t.min}`);
    });
  }

  function updateFocus() {
    const f = new Set(state.focus);
    svg.classed("focused", f.size > 0 || !!state.hover);
    ridges.classed("on", d => f.has(d.id)).classed("hover", d => d.id === state.hover);
  }

  // ---------- Controles del gráfico ----------
  function renderControls() {
    const t = T();
    d3.select("#metric").attr("aria-label", "Dato").html(METRICS.map(m =>
      `<button type="button" data-m="${m}" aria-pressed="${state.metric === m}" title="${t.metrics[m][1]}">${t.metrics[m][0]}</button>`).join(""));
    d3.select("#mode").html(["equal", "real"].map(m =>
      `<button type="button" data-mode="${m}" aria-pressed="${state.mode === m}">${t.modes[m]}</button>`).join(""));
    d3.selectAll("#metric button").on("click", function () { setChart({ metric: this.dataset.m }); });
    d3.selectAll("#mode button").on("click", function () { setChart({ mode: this.dataset.mode }); });
    renderCaption();
  }
  function renderCaption() {
    const t = T(), cur = player.id ? byId.get(player.id) : null;
    const m = t.metrics[state.metric];
    d3.select("#caption").html(cur
      ? `<b>${t.playing}: ${pad(cur.n)} ${cur.title}</b> · ${t.vuHint}`
      : `<b>${m[0]}</b>: ${m[1]}.`);
  }
  function setChart(next, animate = true) {
    const modeChanged = next.mode && next.mode !== state.mode;
    Object.assign(state, next);
    renderControls();
    if (modeChanged) renderAxis();
    geometry(animate);
    updateFocus();
  }

  // ---------- Lectura con el puntero ----------
  const fracAt = (d, mx) => Math.max(0, Math.min(1, (mx - X0) / (xEnd(d) - X0)));
  function showCursor(d, mx, ev) {
    const f = fracAt(d, mx), g = ridges.filter(r => r === d), t = T();
    hideCursor(true);
    if (d.id === vuId()) {
      if (ev) showTip(`${pad(d.n)} ${d.title} <span>→</span> ${mmss(f * d.mp3_seconds)}`, ev);
      return;
    }
    const a = prof(d), i = Math.round(f * (a.length - 1)), x = xAt(d, i, a.length), y = base(d) - a[i] * AMP;
    g.select(".cursor").attr("x1", x).attr("x2", x).attr("y1", base(d)).attr("y2", y).style("display", null);
    g.select(".dot").attr("cx", x).attr("cy", y).style("display", null);
    if (ev) showTip(`${pad(d.n)} ${d.title} <span>· ${mmss(f * d.mp3_seconds)} ·</span> ${t.metrics[state.metric][0]} ${fmt(a[i])}<br><span>${t.tipPlay}</span>`, ev);
  }
  function showTip(html, ev) {
    tip.html(html).attr("hidden", null);
    const w = tip.node().offsetWidth;
    tip.style("left", Math.min(innerWidth - w - 8, ev.clientX + 14) + "px").style("top", Math.max(4, ev.clientY - 48) + "px");
  }
  function hideCursor(keepTip) {
    if (!keepTip) tip.attr("hidden", "");
    ridges.select(".cursor").style("display", "none"); ridges.select(".dot").style("display", "none");
  }

  ridges.select(".hit")
    .on("pointermove", function (ev, d) {
      if (state.hover !== d.id) { state.hover = d.id; updateFocus(); }
      showCursor(d, d3.pointer(ev, svg.node())[0], ev.pointerType === "touch" ? null : ev);
    })
    .on("pointerleave", () => { state.hover = null; updateFocus(); hideCursor(); })
    .on("click", function (ev, d) { player.play(d.id, fracAt(d, d3.pointer(ev, svg.node())[0])); })
    .on("keydown", function (ev, d) {
      if (ev.key === "Enter") { ev.preventDefault(); player.play(d.id); }
      if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
        ev.preventDefault();
        const k = (d.n - 1 + (ev.key === "ArrowDown" ? 1 : -1) + tracks.length) % tracks.length;
        ridges.filter(r => r === tracks[k]).select(".hit").node().focus();
      }
    })
    .on("focus", (ev, d) => { state.hover = d.id; updateFocus(); })
    .on("blur", () => { state.hover = null; updateFocus(); });

  // ---------- Reproductor: MP3 locales o Spotify ----------
  // En local (carpeta audio/ con los MP3, que no se publica) se usan los MP3. En la web, Spotify:
  // con sesión iniciada suena la canción completa; sin ella, un fragmento.
  const audio = document.getElementById("audio");
  const player = {
    source: null, id: null, playing: false, frac: 0, dur: 0, stamp: 0, ctrl: null, creating: false, ended: false, preview: false, error: false,
    async detect() {
      const forced = params.get("source");
      if (forced === "spotify") return (this.source = "spotify");
      try {
        const r = await fetch("audio/" + encodeURIComponent(tracks[0].mp3), { method: "HEAD" });
        this.source = r.ok ? "local" : "spotify";
      } catch (e) { this.source = "spotify"; }
      return this.source;
    },
    play(id, frac) {
      const d = byId.get(id || tracks[0].id);
      if (this.id === d.id) {
        if (frac == null) return this.toggle();
        return this.seek(frac);
      }
      this.id = d.id; this.frac = frac || 0; this.dur = 0; this.ended = false; this.playing = false;
      loadVu(d);
      startVu(d);
      if (this.source === "local") {
        audio.src = "audio/" + encodeURIComponent(d.mp3);
        audio.addEventListener("loadedmetadata", () => { if (frac) audio.currentTime = frac * audio.duration; }, { once: true });
        audio.play().catch(() => { this.playing = false; updatePlayerUI(); });
      } else this.spotifyLoad(d, frac);
      updatePlayerUI();
    },
    toggle() {
      if (!this.id) return this.play(tracks[0].id);
      if (this.source === "local") { if (audio.paused) audio.play(); else audio.pause(); }
      else if (this.ctrl) { if (this.ended) { this.ended = false; this.ctrl.restart(); } else this.ctrl.togglePlay(); }
    },
    seek(frac) {
      if (this.source === "local") { if (audio.duration) audio.currentTime = frac * audio.duration; if (audio.paused) audio.play(); }
      else if (this.ctrl) { this.ctrl.seek(Math.floor(frac * (this.dur || byId.get(this.id).spotify_ms) / 1000)); if (!this.playing) this.ctrl.resume(); }
    },
    step(k) {
      const i = this.id ? byId.get(this.id).n - 1 : -1;
      const j = Math.min(tracks.length - 1, Math.max(0, i + k));
      if (j !== i) this.play(tracks[j].id);
    },
    next() { const d = byId.get(this.id); if (d && d.n < tracks.length) this.play(tracks[d.n].id); else { this.playing = false; updatePlayerUI(); } },
    // posición actual como fracción de la canción (0-1)
    position() {
      if (this.source === "local") return audio.duration ? audio.currentTime / audio.duration : this.frac;
      if (!this.dur) return this.frac;
      const ms = this.frac * this.dur + (this.playing ? performance.now() - this.stamp : 0);
      // con un fragmento de 30 segundos se toma como el principio de la canción completa
      return Math.min(1, ms / (this.preview ? byId.get(this.id).spotify_ms : this.dur));
    },
    spotifyLoad(d, frac) {
      const startAt = frac && !this.preview ? Math.floor(frac * d.spotify_ms / 1000) : 0;
      d3.select("#p-embed").attr("hidden", null);
      if (this.ctrl) { this.ctrl.loadUri("spotify:track:" + d.spotify_id, false, startAt); this.ctrl.play(); return; }
      if (this.creating) return;
      this.creating = true;
      loadSpotifyApi().then(api => api.createController(document.getElementById("embed"),
        { uri: "spotify:track:" + byId.get(this.id).spotify_id, width: "100%", height: 80, theme: "dark" }, ctrl => {
          this.ctrl = ctrl; this.creating = false;
          ctrl.addListener("playback_update", e => this.onSpotify(e.data || {}));
          ctrl.play();
        })).catch(() => { this.creating = false; this.error = true; updatePlayerUI(); });
    },
    onSpotify(s) {
      const cur = byId.get(this.id);
      if (!cur || (s.playingURI && s.playingURI !== "spotify:track:" + cur.spotify_id)) return;
      this.dur = s.duration || 0; this.playing = !s.isPaused; this.stamp = performance.now();
      this.preview = this.dur > 0 && this.dur <= 35000;
      this.frac = this.dur ? (s.position || 0) / this.dur : 0;
      const ended = this.dur > 0 && s.position >= this.dur - 400;
      if (ended && !this.ended) { this.ended = true; this.playing = false; this.next(); return; }
      updatePlayerUI();
    }
  };
  function loadSpotifyApi() {
    if (!loadSpotifyApi.p) {
      loadSpotifyApi.p = new Promise((resolve, reject) => {
        window.onSpotifyIframeApiReady = api => resolve(api);
        const s = document.createElement("script");
        s.src = "https://open.spotify.com/embed/iframe-api/v1"; s.async = true;
        s.onerror = reject;
        setTimeout(() => reject(new Error("timeout")), 8000);
        document.head.appendChild(s);
      });
    }
    return loadSpotifyApi.p;
  }
  audio.addEventListener("play", () => { player.playing = true; updatePlayerUI(); });
  audio.addEventListener("pause", () => { player.playing = false; updatePlayerUI(); });
  audio.addEventListener("ended", () => player.next());

  function updatePlayerUI() {
    const t = T(), cur = player.id ? byId.get(player.id) : null;
    d3.select("#player").attr("hidden", cur ? null : "");
    if (cur) {
      d3.select("#p-toggle").text(player.playing ? "❚❚" : "▶").attr("aria-label", player.playing ? t.pause : t.play);
      d3.select("#p-title").text(`${pad(cur.n)} ${cur.title}`);
    }
    d3.select("#p-note").text(player.error ? t.playerError : player.source === "spotify" && (player.preview || !player.dur) ? t.spotifyNote : "");
    d3.selectAll("[data-action=album]").text(player.playing ? t.pauseAlbum : t.listenAlbum);
    ridges.classed("playing", d => d.id === player.id);
    renderCaption();
  }
  d3.select("#p-toggle").on("click", () => player.toggle());
  d3.select("#p-prev").on("click", () => player.step(-1));
  d3.select("#p-next").on("click", () => player.step(1));

  // ---------- Vúmetro ----------
  const VU = data.vu, vuCache = new Map();
  let vu = null;                       // { id, frames, smooth }
  const vuId = () => (vu ? vu.id : null);
  function loadVu(d) {
    if (!vuCache.has(d.id)) vuCache.set(d.id, fetch(`data/vu/${pad(d.n)}.bin`).then(r => r.arrayBuffer()).then(b => new Uint8Array(b)));
    return vuCache.get(d.id);
  }
  function startVu(d) {
    const prev = vu;
    vu = { id: d.id, frames: null, smooth: new Float32Array(VU.bands) };
    loadVu(d).then(f => { if (vu && vu.id === d.id) vu.frames = f; });
    if (prev && prev.id !== d.id) {         // la canción anterior vuelve a mostrar su dato
      const g = ridges.filter(r => r.id === prev.id);
      g.select(".line").transition().duration(600).attr("d", r => linePath(ptsData(r)));
      g.select(".fill").transition().duration(600).attr("d", r => fillPath(ptsData(r), r));
      g.selectAll(".prog, .head, .htime").style("display", "none");
    }
    ridges.filter(r => r.id === d.id).raise();
  }
  function drawVu() {
    if (!vu) return;
    const d = byId.get(vu.id), g = ridges.filter(r => r.id === vu.id);
    const frac = player.position(), x1 = xEnd(d), B = VU.bands;
    if (vu.frames) {
      const nf = vu.frames.length / B, pos = Math.min(nf - 1.001, frac * d.mp3_seconds * VU.fps);
      const i = Math.floor(pos), k = pos - i;
      for (let b = 0; b < B; b++) {
        const v = ((1 - k) * vu.frames[i * B + b] + k * vu.frames[(i + 1) * B + b]) / 255;
        // subida inmediata y caída lenta, como la aguja de un vúmetro
        vu.smooth[b] = player.playing ? Math.max(v, vu.smooth[b] * 0.9) : vu.smooth[b];
      }
    }
    const pts = [[X0, base(d)]];
    for (let b = 0; b < B; b++) pts.push([X0 + (x1 - X0) * (b + 0.5) / B, base(d) - Math.pow(vu.smooth[b], 1.6) * G.VU]);
    pts.push([x1, base(d)]);
    g.select(".line").interrupt().attr("d", linePath(pts));
    g.select(".fill").interrupt().attr("d", fillPath(pts, d));
    // progreso sobre la línea base
    const hx = X0 + (x1 - X0) * frac;
    g.select(".prog").attr("x1", X0).attr("x2", hx).style("display", null);
    g.select(".head").attr("x1", hx).attr("x2", hx).attr("y1", base(d) - 5).attr("y2", base(d) + 5).style("display", null);
    g.select(".htime").attr("x", hx).attr("y", base(d) + 16).attr("text-anchor", frac > 0.85 ? "end" : "middle")
      .text(mmss(frac * d.mp3_seconds)).style("display", null);
    d3.select("#p-time").text(`${mmss(frac * d.mp3_seconds)} / ${mmss(d.mp3_seconds)}`);
  }
  (function tick() {
    if (vu && !document.hidden) drawVu();
    requestAnimationFrame(tick);
  })();

  // ---------- Reportaje ----------
  function renderSteps() {
    const t = T();
    d3.select("#steps").selectAll(".step").data(STEPS, s => s.id).join(enter => {
      const s = enter.append("section").attr("class", "step").attr("data-step", s => s.id);
      s.append("div").attr("class", "card");
      return s;
    }).select(".card").html(s => t.steps[s.id]);
    d3.selectAll("[data-action=album]").on("click", () => player.toggle());
    d3.select("#source-note").text(player.source === "local" ? t.sourceLocal : t.spotifyNote);
    if (state.step) d3.selectAll(".step").classed("active", s => s.id === state.step);
    updatePlayerUI();
  }
  function applyStep(id) {
    if (state.step === id) return;
    state.step = id;
    d3.selectAll(".step").classed("active", s => s.id === id);
    const s = STEPS.find(x => x.id === id);
    setChart({ metric: s.metric, mode: s.mode, focus: s.focus || [], feature: s.feature || null });
  }
  function observeSteps() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) applyStep(e.target.dataset.step); });
    }, { rootMargin: NARROW ? "-60% 0px -30% 0px" : "-45% 0px -45% 0px" });
    document.querySelectorAll(".step").forEach(el => io.observe(el));
  }

  function renderEnd() {
    const t = T(), es = window.I18N.es;
    d3.select("#method").html(`<h2>${t.methodTitle}</h2>${t.method}`);
    d3.select("#sources").html(`<h2>${t.sourcesTitle}</h2><ol>` +
      (t.sources || es.sources).map(([name, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${name}</a></li>`).join("") + "</ol>");
    d3.select("#credits").html(t.credits);
  }

  function renderAll() {
    const t = T();
    document.documentElement.lang = state.lang;
    document.title = t.pageTitle;
    d3.select("#viz-title").text(t.vizTitle);
    d3.selectAll(".lang button").attr("aria-pressed", function () { return this.dataset.lang === state.lang; });
    ridges.select(".hit").attr("aria-label", d => `${d.n}. ${d.title}. ${t.sideName[d.side]} (${t.sides[d.side]}). ${mmss(d.mp3_seconds)}`);
    renderLabels(); renderControls(); updateFeature(); renderSteps(); renderEnd();
  }

  // ---------- Eventos globales ----------
  d3.selectAll(".lang button").on("click", function () { state.lang = this.dataset.lang; renderAll(); });
  document.addEventListener("keydown", ev => {
    if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
    const interactive = ev.target.closest && ev.target.closest("button, a, input, [role=button]");
    if (ev.key === " " && !interactive) { ev.preventDefault(); player.toggle(); }
    else if ((ev.key === "ArrowRight" || ev.key === "ArrowLeft") && player.id) { ev.preventDefault(); player.step(ev.key === "ArrowRight" ? 1 : -1); }
  });
  window.addEventListener("scroll", () => tip.attr("hidden", ""), { passive: true });
  narrowMq.addEventListener("change", () => location.reload());

  // ---------- Inicio ----------
  await player.detect();
  geometry(false);
  renderAll();
  applyStep(STEPS[0].id);
  observeSteps();
  // Para probar el vúmetro sin audio: ?debug y, en la consola, __up.fake("shadowplay", 0.4)
  if (params.has("debug")) {
    window.__up = {
      player, state, applyStep,
      fake(id, frac) {
        const d = byId.get(id); player.id = id; player.source = "fake"; player.playing = true; player.dur = d.spotify_ms;
        player.frac = frac; player.stamp = performance.now(); player.position = () => frac;
        startVu(d); updatePlayerUI();
      }
    };
  }
})().catch(err => {
  console.error(err);
  document.querySelector("main").insertAdjacentHTML("afterbegin",
    '<p style="padding:2rem">No se han podido cargar los datos. Si has abierto el archivo directamente, usa un servidor local (ver README).</p>');
});

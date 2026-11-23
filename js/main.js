/* Unknown Pleasures (Joy Division) · reportaje con datos
   Cada línea es una canción y su relieve es un dato medido sobre el audio. Mientras una canción suena,
   su línea se convierte en su vúmetro: el espectro precalculado (data/vu/NN.bin.gz) sincronizado con la
   reproducción. Como en la portada, las líneas son planas a los lados y la canción se levanta en el centro. El texto del reportaje (js/i18n.js) cambia el estado del gráfico al hacer scroll. */
(async function () {
  "use strict";

  const params = new URLSearchParams(location.search);
  const STEPS = window.STEPS;
  const METRICS = ["wave", "loudness", "brightness", "bass", "onset"];
  const FEATURES = ["energy", "valence", "danceability", "instrumentalness", "acousticness"];

  // ---------- Geometría ----------
  const narrowMq = window.matchMedia("(max-width: 820px)"), NARROW = narrowMq.matches;
  // W: anchura de cada línea (plana de 0 a W) · ZW: anchura de la zona central donde se levanta la canción
  const G = NARROW
    ? { W: 420, ZW: 300, GAP: 25, SIDE_GAP: 20, AMP: 80, VU: 96 }
    : { W: 760, ZW: 410, GAP: 38, SIDE_GAP: 28, AMP: 105, VU: 150 };
  const { W, ZW, GAP, SIDE_GAP, AMP } = G;
  const CX = W / 2;
  const TOP = AMP + 40;

  const [data, cp1919] = await Promise.all([
    d3.json("data/unknown-pleasures.json"),
    d3.json("data/cp1919.json")
  ]);
  const tracks = data.tracks;
  const byId = new Map(tracks.map(d => [d.id, d]));
  const maxS = d3.max(tracks, d => d.mp3_seconds);
  const base = d => TOP + (d.n - 1) * GAP + (d.side === 2 ? SIDE_GAP : 0);
  const H = base(tracks[tracks.length - 1]) + 40;

  const state = {
    lang: params.get("lang") === "en" || (!params.get("lang") && !(navigator.language || "es").toLowerCase().startsWith("es")) ? "en" : "es",
    metric: "wave", mode: "equal", focus: [], feature: null, step: null, hover: null, view: "songs"
  };
  const T = () => window.I18N[state.lang];
  const fmt = (v, k = 2) => v.toFixed(k).replace(".", state.lang === "es" ? "," : ".");
  const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const pad = n => String(n).padStart(2, "0");

  const svg = d3.select("#viz").attr("viewBox", `0 0 ${W} ${H}`);
  const tip = d3.select("#tip");

  // ---------- Escalas ----------
  // zona central de cada canción: misma anchura para todas o proporcional a su duración, siempre centrada
  const zoneW = d => (state.mode === "real" ? ZW * d.mp3_seconds / maxS : ZW);
  const xStart = d => CX - zoneW(d) / 2;
  const xEnd = d => CX + zoneW(d) / 2;
  const prof = d => d.profiles[state.metric];
  const xAt = (d, i, n) => xStart(d) + zoneW(d) * i / (n - 1);
  const line = d3.line().curve(d3.curveLinear);
  // cada línea: tramo plano, la canción y otro tramo plano. Siempre el mismo número de puntos,
  // para que las transiciones entre datos y modos interpolen bien.
  const withFlats = (pts, d) => [[0, base(d)], [xStart(d), base(d)], ...pts, [xEnd(d), base(d)], [W, base(d)]];
  const ptsData = d => withFlats(prof(d).map((v, i, a) => [xAt(d, i, a.length), base(d) - v * AMP]), d);
  const linePath = pts => line(pts);
  const fillPath = (pts, d) => line(pts) + `L${W},${base(d) + 1}L0,${base(d) + 1}Z`;

  // ---------- Dibujo ----------
  // capas: el gráfico de CP 1919 (80 pulsos, o uno solo) y las diez canciones
  const chartLayer = svg.append("g").attr("class", "cp-layer").style("opacity", 0);
  const songsLayer = svg.append("g").attr("class", "songs-layer");
  const axis = songsLayer.append("g").attr("class", "axis");
  const labels = songsLayer.append("g");
  const ridges = songsLayer.selectAll(".ridge").data(tracks).join("g").attr("class", "ridge").attr("data-id", d => d.id);
  ridges.append("path").attr("class", "fill");
  ridges.append("path").attr("class", "line");
  ridges.append("line").attr("class", "prog").style("display", "none");
  ridges.append("line").attr("class", "head").style("display", "none");
  ridges.append("text").attr("class", "htime").style("display", "none");
  ridges.append("text").attr("class", "num").attr("x", 0).attr("y", d => base(d) - 5).text(d => pad(d.n));
  if (!NARROW) ridges.append("text").attr("class", "name").attr("x", 24).attr("y", d => base(d) - 5).text(d => d.title.toUpperCase());
  ridges.append("text").attr("class", "dur num").attr("x", W).attr("y", d => base(d) - 5).attr("text-anchor", "end");
  ridges.append("path").attr("class", "peak").style("display", "none");
  // barra del atributo de ReccoBeats, sobre el tramo plano de la derecha
  const FX0 = CX + ZW / 2 + (NARROW ? 8 : 16), FW = W - FX0 - (NARROW ? 26 : 44);
  ridges.append("line").attr("class", "fbar").attr("x1", FX0).attr("x2", FX0).attr("y1", d => base(d)).attr("y2", d => base(d));
  ridges.append("line").attr("class", "cursor").style("display", "none");
  ridges.append("circle").attr("class", "dot").attr("r", 2.6).style("display", "none");
  ridges.append("rect").attr("class", "hit").attr("x", 0).attr("width", W)
    .attr("y", d => base(d) - GAP).attr("height", GAP).attr("tabindex", 0).attr("role", "button");

  function geometry(animate) {
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
    ridges.select(".fbar").transition().duration(600).ease(d3.easeCubicOut)
      .attr("x2", d => FX0 + (f ? d.features[f] * FW : 0));
    labels.select(".col-label").text(f ? t.features[f] : "");
  }

  function renderLabels() {
    const t = T();
    labels.selectAll("*").remove();
    if (!NARROW) [1, 2].forEach(s => {
      const first = tracks.find(d => d.side === s);
      labels.append("text").attr("class", "side-label").attr("x", 24).attr("y", base(first) - GAP + 4).text(t.sides[s]);
    });
    labels.append("text").attr("class", "col-label").attr("x", W).attr("y", base(tracks[0]) - GAP + 4).attr("text-anchor", "end");
    renderAxis();
  }
  function renderAxis() {
    const t = T(), y = H - 10;
    axis.selectAll("*").remove();
    if (state.mode === "equal") {
      axis.append("text").attr("x", CX - ZW / 2).attr("y", y).attr("text-anchor", "middle").text(t.start);
      axis.append("text").attr("x", CX + ZW / 2).attr("y", y).attr("text-anchor", "middle").text(t.end);
      return;
    }
    // con la duración real, una barra de escala de un minuto
    const w = ZW * 60 / maxS;
    axis.append("line").attr("x1", CX - w / 2).attr("x2", CX + w / 2).attr("y1", y - 14).attr("y2", y - 14);
    axis.append("line").attr("x1", CX - w / 2).attr("x2", CX - w / 2).attr("y1", y - 18).attr("y2", y - 10);
    axis.append("line").attr("x1", CX + w / 2).attr("x2", CX + w / 2).attr("y1", y - 18).attr("y2", y - 10);
    axis.append("text").attr("x", CX).attr("y", y).attr("text-anchor", "middle").text(t.oneMin);
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
    d3.select("#feature-label").text(t.featureLabel);
    d3.select("#feature").attr("aria-label", t.featureNone).html(
      FEATURES.map(f => `<button type="button" data-f="${f}" aria-pressed="${state.feature === f}">${t.features[f]}</button>`).join(""));
    d3.selectAll("#feature button").on("click", function () {
      setChart({ feature: state.feature === this.dataset.f ? null : this.dataset.f });
    });
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
    const viewChanged = next.view && next.view !== state.view;
    Object.assign(state, next);
    renderControls();
    if (modeChanged) renderAxis();
    geometry(animate);
    updateFocus();
    if (viewChanged || !animate) showView(animate);
  }

  // ---------- CP 1919: 80 pulsos, un pulso, y el paso a las canciones ----------
  // El gráfico ocupa casi todo el recuadro. Cada pulso es un grupo: al pasar el puntero se lee
  // su intensidad, y un seno muy pequeño lo mueve. En el primer paso las demás líneas se van
  // y queda un pulso real, que late con el periodo de la estrella. Luego vuelven las 80,
  // y al pasar a las canciones el bloque se acerca a su zona y se funde con ellas.
  const PERIOD = 1.3373;
  const CP_SCALE = 0.2;
  const FOCUS = 27; // un pulso alto de la serie, para que al quedar solo se lea bien
  const BW = ZW, BX0 = CX - ZW / 2, BY0 = TOP - AMP;
  let pulseK = 0, pulseTarget = 0, holdPulse = true, cpClock = 0;
  let moveShown = 0, centerShown = 0, leftHome = null, leftViz = null, endOn = false;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function cpGeom(box) {
    const pulses = cp1919.pulses, nP = pulses.length, nS = pulses[0].length;
    let mn = Infinity;
    for (const row of pulses) for (const v of row) if (v < mn) mn = v;
    let top = 0;
    for (let i = 0; i < nP; i++) {
      let m = -Infinity;
      for (const v of pulses[i]) if (v > m) m = v;
      top = Math.min(top, i - (m - mn) * CP_SCALE);
    }
    const gap = (box.y1 - box.y0) / ((nP - 1) - top);
    const rows = pulses.map((row, i) => {
      const baseY = box.y0 + (i - top) * gap;
      let d = "";
      const ys = new Array(nS);
      for (let j = 0; j < nS; j++) {
        const x = box.x0 + (box.x1 - box.x0) * j / (nS - 1);
        ys[j] = -((row[j] - mn) * CP_SCALE * gap);
        d += (j ? "L" : "M") + x.toFixed(1) + "," + ys[j].toFixed(1);
      }
      return { i, baseY, ys, row, d, fill: `${d}L${box.x1.toFixed(1)},0L${box.x0.toFixed(1)},0Z` };
    });
    return { rows, gap, nS, box };
  }
  function mountCp(parent, geom) {
    const g = parent.append("g").attr("class", "cp-lines");
    const nodes = geom.rows.map(row => {
      const pulse = g.append("g").attr("class", "pulse").attr("data-i", row.i);
      const inner = pulse.append("g").attr("class", "pulse-geom");
      inner.append("path").attr("class", "pfill").attr("d", row.fill);
      inner.append("path").attr("class", "pline").attr("d", row.d);
      return { row, pulse, inner };
    });
    const hit = g.append("rect").attr("class", "cp-hit")
      .attr("x", geom.box.x0).attr("y", geom.box.y0)
      .attr("width", geom.box.x1 - geom.box.x0).attr("height", geom.box.y1 - geom.box.y0);
    const dot = g.append("circle").attr("class", "cp-dot").attr("r", 3.2).style("display", "none");
    const mount = { g, geom, nodes, hit, dot, hot: null };
    hit.on("pointermove pointerdown", ev => readCp(mount, ev))
      .on("pointerleave", () => hideCp(mount));
    return mount;
  }
  function layoutCp(mount, now, k, center) {
    const beat = 0.62 + 0.38 * Math.exp(-((now / 1000) % PERIOD) / PERIOD * 7);
    mount.nodes.forEach(({ row, pulse, inner }) => {
      const focus = row.i === FOCUS;
      const drift = (1 - k) * mount.drift * Math.sin(now / 1100 + row.i * 0.47);
      const y = row.baseY + drift + (center == null ? 0 : k * (focus ? center - row.baseY : 0));
      const dx = drift * 0.35;
      // las otras líneas se aplanan; al final se ocultan y queda un pulso que late
      const sy = Math.max(0.001, focus ? (1 - k) + k * beat * 2.2 : (1 - k));
      inner.attr("transform", `translate(${dx.toFixed(2)},${y.toFixed(2)}) scale(1,${sy.toFixed(3)})`);
      pulse.style("display", !focus && k > 0.92 ? "none" : null);
      row._y = y;
      row._sy = sy;
      row._dx = dx;
    });
  }
  function hideCp(mount) {
    mount.dot.style("display", "none");
    mount.g.classed("is-hover", false);
    if (mount.hot != null) mount.nodes[mount.hot].pulse.classed("is-on", false);
    mount.hot = null;
    tip.attr("hidden", "");
  }
  function readCp(mount, ev) {
    const k = mount === vizMount ? pulseK : 0;
    const [mx, my] = d3.pointer(ev, mount.g.node());
    const { box, nS, rows, gap } = mount.geom;
    if (mx < box.x0 || mx > box.x1 || my < box.y0 - gap || my > box.y1 + gap) { hideCp(mount); return; }
    let best = null, bestD = Infinity;
    if (k > 0.4) best = rows[FOCUS];
    else for (const row of rows) {
      const dist = Math.abs(my - row._y);
      if (dist < bestD) { bestD = dist; best = row; }
    }
    if (!best || (k <= 0.4 && bestD > gap * 1.35)) { hideCp(mount); return; }
    const j = Math.max(0, Math.min(nS - 1, Math.round((mx - box.x0) / (box.x1 - box.x0) * (nS - 1))));
    const x = box.x0 + (box.x1 - box.x0) * j / (nS - 1) + (best._dx || 0);
    const y = best._y + best.ys[j] * best._sy;
    mount.dot.attr("cx", x).attr("cy", y).style("display", null);
    mount.g.classed("is-hover", true);
    if (mount.hot !== best.i) {
      if (mount.hot != null) mount.nodes[mount.hot].pulse.classed("is-on", false);
      mount.nodes[best.i].pulse.classed("is-on", true);
      mount.hot = best.i;
    }
    const t = T();
    showTip(`${t.cpPulse} ${best.i + 1}<span> · ${t.cpValue}</span> ${fmt(best.row[j])}`, ev);
  }
  const headerMount = mountCp(d3.select("#cover-svg"), cpGeom({ x0: 36, x1: 964, y0: 22, y1: 978 }));
  headerMount.drift = headerMount.geom.gap * 0.2;
  const vizBox = { x0: NARROW ? 10 : 18, x1: W - (NARROW ? 10 : 18), y0: 14, y1: H - 28 };
  const chartMove = chartLayer.append("g").attr("class", "cp-move");
  const vizMount = mountCp(chartMove, cpGeom(vizBox));
  vizMount.drift = vizMount.geom.gap * 0.18;
  const chartLabel = chartLayer.append("text").attr("class", "plabel").attr("x", CX).attr("y", H - 8).attr("text-anchor", "middle");
  layoutCp(headerMount, 0, 0, null);
  layoutCp(vizMount, 0, 0, null);
  const songZoom = (() => {
    const b = vizBox, s = BW / (b.x1 - b.x0);
    const songMid = (BY0 + (H - 36)) / 2, chartMid = (b.y0 + b.y1) / 2;
    return `translate(${(BX0 - b.x0 * s).toFixed(1)},${(songMid - chartMid * s).toFixed(1)}) scale(${s.toFixed(4)})`;
  })();
  const REST = "translate(0,0) scale(1)";
  function syncPulseLabel() {
    chartLabel.text(pulseTarget > 0 ? T().pulsarLabel : T().cpHint);
  }
  function revealPulse() {
    holdPulse = false;
    pulseTarget = 1;
    if (moveShown >= 0.999) pulseK = 1;
    syncPulseLabel();
  }
  function showView(animate) {
    const v = state.view, dur = animate ? 1100 : 0, ease = d3.easeCubicInOut;
    const stack = v === "chart" || v === "pulsar";
    if (v === "pulsar" && !holdPulse) { pulseTarget = 1; if (moveShown >= 0.999 || !animate) pulseK = 1; }
    else if (v !== "pulsar") pulseTarget = 0;
    if (!animate && !holdPulse) pulseK = pulseTarget;
    chartLayer.style("pointer-events", stack ? "auto" : "none")
      .interrupt().transition().duration(dur).style("opacity", stack ? 1 : 0);
    chartMove.interrupt().transition().duration(dur).ease(ease).attr("transform", v === "songs" ? songZoom : REST);
    syncPulseLabel();
    songsLayer.style("pointer-events", v !== "songs" ? "none" : null).transition().duration(dur).style("opacity", v === "songs" ? 1 : 0);
    d3.select(".fig figcaption").style("visibility", v === "songs" ? null : "hidden");
  }
  function tickCp(now) {
    const dt = cpClock ? Math.min(48, now - cpClock) : 16;
    cpClock = now;
    const coverK = document.getElementById("cover-svg").classList.contains("is-travel")
      ? Math.min(1, moveShown / 0.45) : 0;
    if (coverK > 0 && moveShown < 0.999) {
      pulseTarget = 1;
      pulseK = coverK;
    } else {
      pulseK += (pulseTarget - pulseK) * (1 - Math.exp(-dt / 340));
      if (Math.abs(pulseK - pulseTarget) < 0.001) pulseK = pulseTarget;
    }
    layoutCp(headerMount, now, coverK, 500);
    layoutCp(vizMount, now, pulseK, H / 2);
  }

  // ---------- Lectura con el puntero ----------
  const fracAt = (d, mx) => Math.max(0, Math.min(1, (mx - xStart(d)) / zoneW(d)));
  function showCursor(d, mx, ev) {
    const f = fracAt(d, mx), g = ridges.filter(r => r === d), t = T();
    hideCursor(true);
    if (d.id === vuId()) {
      if (ev) showTip(`${pad(d.n)} ${d.title} <span>→</span> ${mmss(f * d.mp3_seconds)}`, ev);
      return;
    }
    const mxIn = mx >= xStart(d) && mx <= xEnd(d);
    if (!mxIn) { if (ev) showTip(`${pad(d.n)} ${d.title} <span>· ${mmss(d.mp3_seconds)}</span>`, ev); return; }
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
    .on("click", function (ev, d) {
      // sobre la canción se salta a ese punto; sobre los tramos planos, desde el principio
      const mx = d3.pointer(ev, svg.node())[0], inside = mx >= xStart(d) && mx <= xEnd(d);
      if (inside) player.play(d.id, fracAt(d, mx));
      else if (player.id === d.id) player.toggle();
      else player.play(d.id, 0);
    })
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
      if (this.source === "local") this.localLoad(d, frac);
      else this.spotifyLoad(d, frac);
      updatePlayerUI();
    },
    // El MP3 se carga entero como blob: así se puede saltar a cualquier punto aunque el servidor local
    // no admita peticiones parciales (python -m http.server no las admite)
    localLoad(d, frac) {
      const id = d.id;
      if (!this.blobs) this.blobs = new Map();
      if (!this.blobs.has(id)) this.blobs.set(id, fetch("audio/" + encodeURIComponent(d.mp3)).then(r => r.blob()).then(b => URL.createObjectURL(b)));
      this.blobs.get(id).then(url => {
        if (this.id !== id) return;
        audio.src = url;
        audio.addEventListener("loadedmetadata", () => { if (frac) audio.currentTime = frac * audio.duration; }, { once: true });
        audio.play().catch(() => { this.playing = false; updatePlayerUI(); });
      });
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
  // Espectro precalculado: VU.fps fotogramas por segundo y VU.bands bandas logarítmicas por fotograma,
  // un byte por banda, comprimido con gzip. Entre dos fotogramas se interpola; cada banda sube al
  // instante y cae despacio, como la aguja de un vúmetro, y una segunda línea retiene los picos.
  const VU = data.vu, vuCache = new Map();
  const HOLD_MS = 600, PEAK_FALL = 0.012, RELEASE = 0.86, GAMMA = 1.35;
  let vu = null;                       // { id, frames, smooth, peak, held, last }
  const vuId = () => (vu ? vu.id : null);
  async function gunzip(buf) {
    const u8 = new Uint8Array(buf);
    // si el servidor ya lo ha descomprimido (Content-Encoding: gzip), los datos llegan en claro
    if (u8[0] !== 0x1f || u8[1] !== 0x8b || typeof DecompressionStream === "undefined") return u8;
    const out = await new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
    return new Uint8Array(out);
  }
  function loadVu(d) {
    if (!vuCache.has(d.id)) {
      vuCache.set(d.id, fetch(VU.file.replace("{nn}", pad(d.n))).then(r => r.arrayBuffer()).then(gunzip)
        .catch(() => { vuCache.delete(d.id); return null; }));
    }
    return vuCache.get(d.id);
  }
  function startVu(d) {
    const prev = vu, B = VU.bands;
    vu = { id: d.id, frames: null, smooth: new Float32Array(B), peak: new Float32Array(B), held: new Float64Array(B), last: 0 };
    loadVu(d).then(f => { if (vu && vu.id === d.id) vu.frames = f; });
    if (d.n < tracks.length) loadVu(tracks[d.n]);          // la siguiente, por adelantado
    if (prev && prev.id !== d.id) {         // la canción anterior vuelve a mostrar su dato
      const g = ridges.filter(r => r.id === prev.id);
      g.select(".line").transition().duration(600).attr("d", r => linePath(ptsData(r)));
      g.select(".fill").transition().duration(600).attr("d", r => fillPath(ptsData(r), r));
      g.selectAll(".prog, .head, .htime, .peak").style("display", "none");
    }
    ridges.filter(r => r.id === d.id).raise();
  }
  function drawVu(now) {
    if (!vu) return;
    const d = byId.get(vu.id), g = ridges.filter(r => r.id === vu.id);
    const frac = player.position(), B = VU.bands, x0 = xStart(d), zw = zoneW(d), y0 = base(d);
    const dt = vu.last ? Math.min(100, now - vu.last) : 16; vu.last = now;
    const k60 = dt / 16.7;                  // pasos de 60 fps, para que la caída no dependa de la pantalla
    if (vu.frames && player.playing) {
      const nf = vu.frames.length / B, pos = Math.max(0, Math.min(nf - 1.001, frac * d.mp3_seconds * VU.fps));
      const i = Math.floor(pos), k = pos - i;
      for (let b = 0; b < B; b++) {
        const v = ((1 - k) * vu.frames[i * B + b] + k * vu.frames[(i + 1) * B + b]) / 255;
        vu.smooth[b] = Math.max(v, vu.smooth[b] * Math.pow(RELEASE, k60));
        if (vu.smooth[b] >= vu.peak[b]) { vu.peak[b] = vu.smooth[b]; vu.held[b] = now; }
        else if (now - vu.held[b] > HOLD_MS) vu.peak[b] = Math.max(vu.smooth[b], vu.peak[b] - PEAK_FALL * k60);
      }
    }
    const xb = b => x0 + zw * (b + 0.5) / B, yv = v => y0 - Math.pow(v, GAMMA) * G.VU;
    const pts = [];
    for (let b = 0; b < B; b++) pts.push([xb(b), yv(vu.smooth[b])]);
    const full = withFlats(pts, d);
    g.select(".line").interrupt().attr("d", linePath(full));
    g.select(".fill").interrupt().attr("d", fillPath(full, d));
    let pk = "";
    for (let b = 0; b < B; b++) pk += (b ? "L" : "M") + xb(b).toFixed(1) + "," + yv(vu.peak[b]).toFixed(1);
    g.select(".peak").attr("d", pk).style("display", null);
    // progreso sobre la línea base de la canción
    const hx = x0 + zw * frac;
    g.select(".prog").attr("x1", x0).attr("x2", hx).attr("y1", y0).attr("y2", y0).style("display", null);
    g.select(".head").attr("x1", hx).attr("x2", hx).attr("y1", y0 - 5).attr("y2", y0 + 5).style("display", null);
    g.select(".htime").attr("x", hx).attr("y", y0 + 16).attr("text-anchor", "middle")
      .text(mmss(frac * d.mp3_seconds)).style("display", null);
    d3.select("#p-time").text(`${mmss(frac * d.mp3_seconds)} / ${mmss(d.mp3_seconds)}`);
  }
  (function tick(now) {
    const t = now || performance.now();
    updateTravels();
    if (vu && !document.hidden) drawVu(t);
    if (!document.hidden) tickCp(t);
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
    syncStage();
  }
  // Al llegar al último paso el gráfico pasa al centro y se usa como reproductor.
  // El desplazamiento lo marca el scroll: corto, y se aparta cuando entran el método y las fuentes.
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function easeOut(t) { return 1 - (1 - t) * (1 - t); }
  function mixBox(a, b, t) {
    return {
      left: a.left + (b.left - a.left) * t,
      top: a.top + (b.top - a.top) * t,
      width: a.width + (b.width - a.width) * t,
      height: a.height + (b.height - a.height) * t
    };
  }
  function smoothToward(cur, goal) {
    if (reduceMotion || Math.abs(goal - cur) < 0.004) return goal;
    return cur + (goal - cur) * 0.62;
  }
  // El gráfico de la portada se desplaza a la columna izquierda y se queda en un pulso.
  function coverHome() {
    const slot = document.getElementById("cover-slot");
    const live = slot.getBoundingClientRect();
    const moveStart = slot.offsetTop - 8;
    return {
      left: live.left,
      top: slot.offsetTop - moveStart,
      width: live.width,
      height: live.height
    };
  }
  function travelTargets() {
    const slot = document.getElementById("cover-slot");
    if (!slot) return { move: 0 };
    const moveStart = slot.offsetTop - 8;
    const moveSpan = innerHeight * 0.42;
    return { move: clamp01((scrollY - moveStart) / moveSpan) };
  }
  // Después de Joyplot: el gráfico de las canciones se desplaza al centro.
  function centerTarget() {
    const card = document.querySelector('[data-step="ridgeline"] .card');
    if (!card) return 0;
    const span = innerHeight * 0.34;
    const passed = 12 - card.getBoundingClientRect().bottom;
    return clamp01(passed / span);
  }
  function rememberLeft() {
    const scrolly = document.querySelector(".scrolly");
    if (scrolly.classList.contains("is-gliding") || scrolly.classList.contains("stage") || scrolly.classList.contains("yield")) return;
    const viz = document.getElementById("viz");
    const cap = document.querySelector("#fig figcaption");
    if (!viz || !cap) return;
    const vr = viz.getBoundingClientRect();
    const cr = cap.getBoundingClientRect();
    const fig = document.getElementById("fig");
    const fr = fig.getBoundingClientRect();
    const stuckTop = vr.top - fr.top;
    if (vr.width < 20 || stuckTop < -200) return;
    leftViz = { left: vr.left, top: stuckTop, width: vr.width, height: vr.height };
    leftHome = { left: vr.left, top: stuckTop, width: vr.width, height: Math.max(vr.height + 8, cr.bottom - vr.top) };
  }
  let stageMeasure = null;
  function stageRoom() {
    if (stageMeasure && stageMeasure.w === innerWidth && stageMeasure.h === innerHeight && stageMeasure.player === !document.getElementById("player").hidden) return stageMeasure;
    const card = document.querySelector('[data-step="listen"] .card');
    const cap = document.querySelector("#fig figcaption");
    let cardH = NARROW ? 160 : 210;
    if (card) {
      card.classList.add("is-measure");
      cardH = card.offsetHeight;
      card.classList.remove("is-measure");
    }
    let capH = 112;
    if (cap) {
      const prev = cap.style.width;
      cap.style.width = "640px";
      capH = Math.ceil(cap.offsetHeight + 8);
      cap.style.width = prev;
    }
    const player = document.getElementById("player");
    const playerOn = player && !player.hidden;
    const playerH = playerOn ? Math.ceil(player.getBoundingClientRect().height + 28) : 16;
    stageMeasure = { w: innerWidth, h: innerHeight, player: playerOn, topPad: (NARROW ? 48 : 52) + cardH + 8, capH, playerH };
    return stageMeasure;
  }
  function centerBox() {
    const room = stageRoom();
    const maxH = Math.max(160, innerHeight - room.topPad - room.playerH - room.capH);
    const aspect = W / H;
    let h = maxH, w = h * aspect;
    const maxW = Math.min(innerWidth - (NARROW ? 20 : 64), 980);
    if (w > maxW) { w = maxW; h = w / aspect; }
    const left = (innerWidth - w) / 2;
    const gap = innerHeight - room.topPad - room.playerH - room.capH - h;
    const top = room.topPad + Math.max(0, gap / 2);
    return { left, top, width: w, height: h + room.capH };
  }
  function placeBox(el, box) {
    el.style.left = box.left + "px";
    el.style.top = box.top + "px";
    el.style.width = box.width + "px";
    el.style.height = box.height + "px";
  }
  function clearBox(el) {
    el.style.left = el.style.top = el.style.width = el.style.height = "";
  }
  function applyEnter() {
    const svg = document.getElementById("cover-svg");
    const slot = document.getElementById("cover-slot");
    const viz = document.getElementById("viz");
    if (!svg || !slot || !viz) return;
    const cover = document.getElementById("cover");
    if (NARROW) {
      if (cover) cover.classList.remove("is-aside");
      svg.classList.remove("is-travel");
      clearBox(svg);
      viz.style.opacity = "";
      return;
    }
    const moving = moveShown > 0.001;
    const arrived = moveShown >= 0.999;
    const live = viz.getBoundingClientRect();
    const dest = leftViz;
    const caught = !!dest && live.top <= dest.top + 8 && live.top > -80;
    if (cover) cover.classList.toggle("is-aside", moving && !caught && centerShown < 0.02);
    if (!moving || centerShown > 0.02 || (arrived && caught)) {
      svg.classList.remove("is-travel");
      clearBox(svg);
      viz.style.opacity = "";
      if (moveShown > 0.9 && centerShown < 0.02 && state.view === "pulsar") {
        holdPulse = false;
        pulseTarget = 1;
        pulseK = 1;
      }
      return;
    }
    const goal = dest || coverHome();
    const home = coverHome();
    const mp = easeOut(moveShown);
    svg.classList.add("is-travel");
    placeBox(svg, mixBox(home, goal, mp));
    viz.style.opacity = "0";
    if (mp > 0.7 && state.view === "pulsar") {
      holdPulse = false;
      pulseTarget = 1;
      pulseK = Math.max(pulseK, mp);
    }
  }
  function applyCenter(q) {
    const fig = document.getElementById("fig");
    const scrolly = document.querySelector(".scrolly");
    if (!fig || !leftHome) return;
    const gliding = q > 0.02 && q < 0.98 && !endOn;
    if (!gliding) { clearBox(fig); return; }
    scrolly.classList.add("is-gliding");
    const dest = centerBox();
    placeBox(fig, mixBox(leftHome, dest, easeOut(q)));
  }
  function updateTravels() {
    const travel = travelTargets();
    moveShown = smoothToward(moveShown, travel.move);
    centerShown = smoothToward(centerShown, endOn ? 1 : centerTarget());
    rememberLeft();
    applyEnter();
    applyCenter(centerShown);
    syncStage();
  }
  function syncStage() {
    const scrolly = document.querySelector(".scrolly");
    const q = centerShown;
    const on = q >= 0.98 && !endOn;
    const gliding = q > 0.02 && q < 0.98 && !endOn;
    scrolly.classList.toggle("stage", on);
    scrolly.classList.toggle("is-gliding", gliding);
    scrolly.classList.toggle("yield", endOn && q > 0.5);
    if (!on) { scrolly.classList.remove("stage-tight"); return; }
    const card = scrolly.querySelector('.step[data-step="listen"] .card');
    const cap = scrolly.querySelector("figcaption");
    const player = document.getElementById("player");
    const playerH = player && !player.hidden ? Math.ceil(player.getBoundingClientRect().height + 28) : 16;
    const fit = () => {
      const top = Math.ceil(card.getBoundingClientRect().bottom + 8);
      const capH = Math.ceil((cap ? cap.getBoundingClientRect().height : 120) + 8);
      scrolly.style.setProperty("--stage-top", top + "px");
      scrolly.style.setProperty("--stage-pad", playerH + "px");
      scrolly.style.setProperty("--stage-bot", capH + "px");
      return innerHeight - top - playerH - capH;
    };
    if (!NARROW) scrolly.classList.remove("stage-tight");
    if (NARROW || (card && fit() < 300)) scrolly.classList.add("stage-tight");
    if (card) fit();
  }
  function applyStep(id) {
    if (state.step === id) return;
    state.step = id;
    d3.selectAll(".step").classed("active", s => s.id === id);
    const s = STEPS.find(x => x.id === id);
    setChart({ metric: s.metric, mode: s.mode, focus: s.focus || [], feature: s.feature || null, view: s.view || "songs" });
    syncStage();
  }
  function observeSteps() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        if (e.target.dataset.step === "pulsar") revealPulse();
        applyStep(e.target.dataset.step);
      });
    }, { rootMargin: NARROW ? "-60% 0px -30% 0px" : "-45% 0px -45% 0px" });
    document.querySelectorAll(".step").forEach(el => io.observe(el));
    // El gráfico se aparta cuando el método entra en la mitad alta de la pantalla.
    const readEnd = () => {
      const top = document.querySelector(".end").getBoundingClientRect().top;
      const next = top < innerHeight * 0.45;
      if (next === endOn) return;
      endOn = next;
      syncStage();
    };
    window.addEventListener("scroll", readEnd, { passive: true });
    readEnd();
    new ResizeObserver(() => syncStage()).observe(document.getElementById("player"));
  }

  function renderEnd() {
    const t = T(), es = window.I18N.es;
    d3.select("#method").html(`<h2>${t.methodTitle}</h2>${t.method}`);
    d3.select("#sources").html(`<h2>${t.sourcesTitle}</h2><ol>` +
      (t.sources || es.sources).map(([name, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${name}</a></li>`).join("") + "</ol>");
    d3.select("#credits").html(t.credits);
  }

  // ---------- Portada ----------
  function renderCover() {
    const c = T().cover;
    syncPulseLabel();
    d3.select("#c-kicker").html(c.kicker); d3.select("#c-title").html(c.title); d3.select("#c-dek").text(c.dek);
    d3.select("#c-byline").text(c.byline); d3.select("#cover-caption").text(c.caption); d3.select("#c-scroll").text(c.scroll);
  }

  function renderAll() {
    const t = T();
    renderCover();
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

/* "Follow the money": a scroll-driven unit chart. One square = $100.
   Canvas stage + DOM labels; IntersectionObserver picks the scene; each narrative step names its scene with data-scene. */
(function () {
  const R = window.REPORT;
  const stage = document.getElementById("stage");
  if (!stage) return;
  const canvas = stage.querySelector("canvas");
  const labelsEl = stage.querySelector(".stage-labels");
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrowMQ = window.matchMedia("(max-width: 900px)");

  const STUDENTS = Math.round(R.accounts.gaming.grant.value / R.rates.gamingPerStudent); // about 1,035 (grant ÷ rate)
  const GRANT = Math.round(R.accounts.gaming.grant.value / 100);              // 207
  const depts = R.wishlist.departments.map(d => ({ name: d.name, n: Math.max(1, Math.round(d.requested / 100)), v: d.requested }));
  const REQ = depts.reduce((a, d) => a + d.n, 0);                            // 215
  const APPROVED = Math.round(R.wishlist.approved.value / 100);               // 194
  const DAG = Math.round(R.accounts.dag.committed.value / 100);               // 20
  const FAMILY = Math.round(R.accounts.operating.raisedReportedTotal.value / 100); // squares of $100 raised by April 8 (reported total)
  const money = window.PACViz.money;
  const SCHOLAR_SET = R.headline.find(h => h.key === "scholar").value;
  const SCHOLAR_GOAL = R.appeal.goals.find(g => g.label.startsWith("Grade 12")).target;
  const POOL = Math.max(REQ, APPROVED + DAG + 40, 260);

  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  let C = {};
  const readColors = () => { C = { gaming: css("--gaming"), operating: css("--operating"), dag: css("--dag"), ink2: css("--ink-2") }; };

  const mk = () => ({ x: 0, y: 0, s: 0, a: 0, tx: 0, ty: 0, ts: 0, ta: 0, delay: 0, color: "gaming", hollow: false, dashed: false });
  const dots = Array.from({ length: STUDENTS }, mk);
  const tiles = Array.from({ length: POOL }, mk);
  let W = 0, H = 0, dpr = 1, step = null, raf = 0;

  function size() {
    const r = stage.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(260, r.width); H = Math.max(260, r.height);
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
  }
  const gridPos = (i, c, t, g, x0, y0) => [x0 + (i % c) * (t + g), y0 + Math.floor(i / c) * (t + g)];
  function fitBlock(n, maxW, maxH, gapRatio, capT) {
    let best = { t: 2, c: n };
    for (let c = 1; c <= n; c++) {
      const rows = Math.ceil(n / c);
      const t = Math.min(maxW / (c + (c - 1) * gapRatio), maxH / (rows + (rows - 1) * gapRatio), capT || 1e9);
      if (t > best.t + 0.01) best = { t, c };
    }
    best.g = best.t * gapRatio;
    best.w = best.c * best.t + (best.c - 1) * best.g;
    best.h = Math.ceil(n / best.c) * best.t + (Math.ceil(n / best.c) - 1) * best.g;
    return best;
  }
  function setLabels(list) {
    labelsEl.innerHTML = "";
    list.forEach(l => {
      const d = document.createElement("div");
      d.className = "sl " + (l.cls || "");
      d.style.left = l.x + "px"; d.style.top = l.y + "px";
      if (l.w) d.style.width = l.w + "px";
      d.innerHTML = l.html;
      labelsEl.appendChild(d);
    });
  }
  function hideAll() {
    [...dots, ...tiles].forEach(o => { o.ta = 0; o.ts = 0; o.tx = W / 2; o.ty = H / 2; o.delay = 0; o.hollow = false; o.dashed = false; });
  }

  function layout(key) {
    readColors();
    const narrow = W < 560;
    const pad = narrow ? 16 : Math.min(40, W * 0.06);
    const top = pad + (narrow ? 44 : 34);
    const availW = W - pad * 2, availH = H - top - pad - 44;
    // one unit size for every "$100" square, so sizes compare across steps
    const U = fitBlock(APPROVED + DAG + 30, availW, availH, 0.18, 26);
    const T = U.t, G = T * 0.18;
    const vy = h => narrow ? top : top + Math.max(0, (availH - h) / 2);        // vertical placement
    const block = (n, cols) => { const c = cols || U.c; const rows = Math.ceil(n / c); return { c, w: c * T + (c - 1) * G, h: rows * T + (rows - 1) * G }; };
    const L = [];
    hideAll();

    if (key === "students") {
      const b = fitBlock(STUDENTS, availW, availH, 0.6);
      const x0 = pad + (availW - b.w) / 2, y0 = vy(b.h);
      dots.forEach((d, i) => { const [x, y] = gridPos(i, b.c, b.t, b.g, x0, y0); Object.assign(d, { tx: x + b.t / 2, ty: y + b.t / 2, ts: b.t / 2, ta: 1 }); });
      L.push({ x: x0, y: y0 - 30, w: availW, cls: "wr", html: `About <b>${STUDENTS.toLocaleString("en-CA")}</b> students counted for the grant · one dot each` });
    }
    if (key === "grant") {
      const b = block(GRANT, Math.min(U.c, Math.ceil(Math.sqrt(GRANT * 2.2))));
      const x0 = pad + (availW - b.w) / 2, y0 = vy(b.h);
      dots.forEach((d, i) => { const k = Math.floor(i / 5); const [x, y] = gridPos(k, b.c, T, G, x0, y0); Object.assign(d, { tx: x + T / 2, ty: y + T / 2, ts: 0, ta: 0, delay: (k % b.c) * 0.4 }); });
      tiles.slice(0, GRANT).forEach((t, i) => { const [x, y] = gridPos(i, b.c, T, G, x0, y0); Object.assign(t, { tx: x, ty: y, ts: T, ta: 1, color: "gaming", delay: (i % b.c) * 0.5 + 6 }); });
      L.push({ x: x0, y: y0 - 30, w: availW, cls: "wr", html: `<b>${money(R.accounts.gaming.grant.value, 0)}</b> gaming grant · 1 square = $100` });
    }
    if (key === "asks") {
      // one cluster per school group, flowed into rows, centred vertically
      let t = Math.min(T, 22), placed, tries = 0, bottom = 0;
      do {
        placed = []; let x = pad, y = top, rowH = 0; const g = t * 0.18;
        for (const d of depts) {
          const c = Math.max(2, Math.ceil(Math.sqrt(d.n * 1.4)));
          const rows = Math.ceil(d.n / c), w = c * t + (c - 1) * g, h = rows * t + (rows - 1) * g;
          const cellW = Math.max(w, narrow ? 96 : 118);
          if (x + cellW > W - pad && x > pad) { x = pad; y += rowH + 52; rowH = 0; }
          placed.push({ d, c, x, y, w, h, g });
          x += cellW + (narrow ? 12 : 22); rowH = Math.max(rowH, h);
        }
        bottom = y + rowH + 40;
        if (bottom <= H - pad || tries > 14) break;
        t *= 0.9; tries++;
      } while (true);
      const dy = narrow ? 0 : Math.max(0, (H - pad - bottom) / 2);
      let k = 0;
      placed.forEach(p => {
        for (let i = 0; i < p.d.n; i++, k++) {
          const [x, y] = gridPos(i, p.c, t, p.g, p.x, p.y + dy);
          Object.assign(tiles[k], { tx: x, ty: y, ts: t, ta: 1, color: "gaming", hollow: true, delay: i * 0.3 });
        }
        L.push({ x: p.x, y: p.y + dy + p.h + 6, w: narrow ? 100 : 150, cls: "small", html: `${p.d.name}<br><span>$${Math.round(p.d.v).toLocaleString("en-CA")}</span>` });
      });
      L.push({ x: pad, y: top + dy - 30, w: availW, cls: "wr", html: `<b>${money(R.wishlist.requested.value, 0)}</b> asked for by ${R.wishlist.groups} school groups` });
    }
    if (key === "approved" || key === "promised") {
      const skip = (U.c - (APPROVED % U.c)) % U.c;               // start Dry After Grad on a new row
      const total = key === "approved" ? APPROVED + 20 : APPROVED + skip + DAG;
      const b = block(total);
      const x0 = pad + (availW - b.w) / 2, y0 = vy(b.h);
      for (let i = 0; i < APPROVED; i++) { const [x, y] = gridPos(i, U.c, T, G, x0, y0); Object.assign(tiles[i], { tx: x, ty: y, ts: T, ta: 1, color: "gaming" }); }
      if (key === "approved") {
        for (let i = APPROVED; i < APPROVED + 20; i++) { const [x, y] = gridPos(i, U.c, T, G, x0, y0); Object.assign(tiles[i], { tx: x, ty: y, ts: T, ta: 0.35, color: "gaming", hollow: true }); }
        L.push({ x: x0, y: y0 - 30, w: availW, cls: "wr", html: `<b>${money(R.wishlist.approved.value, 0)}</b> approved for the wish list` });
      } else {
        for (let i = 0; i < DAG; i++) { const [x, y] = gridPos(APPROVED + skip + i, U.c, T, G, x0, y0); Object.assign(tiles[APPROVED + i], { tx: x, ty: y, ts: T, ta: 1, color: "dag", delay: i * 0.6 }); }
        L.push({ x: x0, y: y0 - 30, w: availW, cls: "wr", html: `<b>${money(R.wishlist.approved.value + R.accounts.dag.committed.value, 0)}</b> promised · wish list <i class="k g"></i> + Dry After Grad <i class="k d"></i>` });
        L.push({ x: x0, y: y0 + b.h + 12, w: Math.min(availW, 460), cls: "small wr", html: `The 2025–26 grant was <b>${money(R.accounts.gaming.grant.value, 0)}</b>. Interest and money from earlier years cover the difference.` });
      }
    }
    if (key === "family") {
      const b = block(FAMILY, 6);
      const x0 = pad + (availW - b.w) / 2, y0 = vy(b.h);
      for (let i = 0; i < FAMILY; i++) { const [x, y] = gridPos(i, 6, T, G, x0, y0); Object.assign(tiles[i], { tx: x, ty: y, ts: T, ta: 1, color: "operating", delay: i * 0.8 }); }
      L.push({ x: x0, y: y0 - 30, w: availW, cls: "wr", html: `About <b>${money(FAMILY * 100, 0)}</b> from families by April 8` });
    }
    if (key === "scholarSet" || key === "scholarGoal") {
      const groups = key === "scholarSet" ? 3 : 5;
      const t = Math.max(T, Math.min(40, (availW - (groups - 1) * 28) / (groups * 2.2)));   // bigger squares, same for both steps
      const g = t * 0.18, gw = 2 * t + g, gh = 3 * t + 2 * g;
      const gap = Math.min(34, Math.max(12, (availW - groups * gw) / Math.max(1, groups - 1)));
      const spacing = gw + gap, totalW = groups * gw + (groups - 1) * gap;
      const x0 = pad + (availW - totalW) / 2, y0 = vy(gh + 40);
      let k = 0;
      for (let s = 0; s < groups; s++) {
        for (let i = 0; i < 5; i++, k++) {
          const [x, y] = gridPos(i, 2, t, g, x0 + s * spacing, y0);
          const filled = key === "scholarSet";
          Object.assign(tiles[k], { tx: x, ty: y, ts: t, ta: filled ? 1 : 0.9, color: "operating", hollow: !filled, dashed: !filled, delay: s * 3 + i * 0.4 });
        }
        L.push({ x: x0 + s * spacing, y: y0 + gh + 10, w: spacing, cls: "small", html: key === "scholarSet" ? `2025–26<br><span>${money(R.rates.scholarship, 0)}</span>` : `No. ${s + 1}<br><span class="w">To fund</span>` });
      }
      L.push({ x: x0, y: y0 - 30, w: availW, cls: "wr", html: key === "scholarSet" ? `<b>${money(SCHOLAR_SET, 0)}</b> set aside · three ${money(R.rates.scholarship, 0)} scholarships` : `Proposed 2026–27 goal <b>${money(SCHOLAR_GOAL, 0)}</b> · five scholarships` });
    }
    setLabels(L);
    if (reduce) { [...dots, ...tiles].forEach(o => { o.x = o.tx; o.y = o.ty; o.s = o.ts; o.a = o.ta; o.delay = 0; }); draw(); }
    else start();
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C.ink2;
    for (const d of dots) {
      if (d.a < 0.01 || d.s < 0.2) continue;
      ctx.globalAlpha = d.a * 0.8;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.s, 0, Math.PI * 2); ctx.fill();
    }
    for (const t of tiles) {
      if (t.a < 0.01 || t.s < 0.5) continue;
      ctx.globalAlpha = t.a;
      const col = C[t.color] || C.gaming, r = Math.min(3, t.s * 0.18);
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(t.x, t.y, t.s, t.s, r); else ctx.rect(t.x, t.y, t.s, t.s);
      if (t.hollow) { ctx.setLineDash(t.dashed ? [3, 3] : []); ctx.lineWidth = 1.25; ctx.strokeStyle = col; ctx.stroke(); ctx.setLineDash([]); }
      else { ctx.fillStyle = col; ctx.fill(); }
    }
    ctx.globalAlpha = 1;
  }
  function tick() {
    let moving = false;
    for (const o of dots.concat(tiles)) {
      if (o.delay > 0) { o.delay -= 1; moving = true; continue; }
      for (const [c, t] of [["x", "tx"], ["y", "ty"], ["s", "ts"], ["a", "ta"]]) {
        const dv = o[t] - o[c];
        if (Math.abs(dv) > 0.05) { o[c] += dv * 0.14; moving = true; } else o[c] = o[t];
      }
    }
    draw();
    raf = moving ? requestAnimationFrame(tick) : 0;
  }
  function start() { if (!raf) raf = requestAnimationFrame(tick); }
  const snap = () => { [...dots, ...tiles].forEach(o => { o.x = o.tx; o.y = o.ty; o.s = o.ts; o.a = o.ta; o.delay = 0; }); draw(); };

  const stepsEls = [...document.querySelectorAll(".scrolly .step")];
  const bar = document.getElementById("scrollyProgress");
  const setStep = key => {
    if (key === step) return;
    step = key;
    let idx = 0;
    stepsEls.forEach((el, i) => { const on = el.dataset.scene === key; el.classList.toggle("on", on); if (on) idx = i; });
    if (bar) bar.style.transform = `scaleX(${(idx + 1) / stepsEls.length})`;
    layout(key);
  };
  let io;
  const observe = () => {
    if (io) io.disconnect();
    io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) setStep(e.target.dataset.scene); }); },
      { rootMargin: narrowMQ.matches ? "-72% 0px -18% 0px" : "-45% 0px -45% 0px", threshold: 0 });
    stepsEls.forEach(s => io.observe(s));
  };
  observe();
  narrowMQ.addEventListener && narrowMQ.addEventListener("change", observe);

  size(); readColors(); setStep(stepsEls[0].dataset.scene); snap();
  let rt;
  new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => { size(); const s = step; step = null; setStep(s); snap(); }, 100); }).observe(stage);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener && mq.addEventListener("change", () => { readColors(); draw(); });
  new MutationObserver(() => { readColors(); draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();

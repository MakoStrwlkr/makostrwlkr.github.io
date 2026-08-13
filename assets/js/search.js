/* ═══════════════════════════════════════════════════════════════════
   search.js — the whole search engine, in-browser.
   Fetches search-index.json (one entry per note/post/resource) and
   filters it live by free text, content type, and category koma.
   Deep-linkable: search.html?q=…&type=note&cat=math prefills the UI.
   No backend, no dependencies.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  const CATEGORIES = [
    { key: "shogi", koma: "将" }, { key: "gaming", koma: "遊" },
    { key: "anime", koma: "ア" }, { key: "netslang", koma: "笑" },
    { key: "math", koma: "数" }, { key: "quantum", koma: "量" },
    { key: "security", koma: "鍵" },
  ];
  const komaFor = (k) => (CATEGORIES.find((c) => c.key === k) || { koma: "?" }).koma;
  const fmt = (iso) => (iso ? iso.replaceAll("-", ".") : "");
  const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const qEl = document.getElementById("q");
  const countEl = document.getElementById("count");
  const listEl = document.getElementById("results");
  const emptyEl = document.getElementById("empty");
  const typeEl = document.getElementById("types");
  const komaEl = document.getElementById("komas");

  const params = new URLSearchParams(location.search);
  let state = {
    q: params.get("q") || "",
    type: params.get("type") || "all",     // all | note | post | resource
    cat: params.get("cat") || null,
  };
  qEl.value = state.q;

  // build type toggle
  [["all", "all"], ["note", "notes"], ["post", "blog"], ["resource", "files"]].forEach(([val, label]) => {
    const b = document.createElement("button");
    b.textContent = label;
    b.setAttribute("aria-pressed", state.type === val);
    b.onclick = () => { state.type = val; syncType(); render(); };
    b.dataset.val = val;
    typeEl.appendChild(b);
  });
  function syncType() { [...typeEl.children].forEach((b) => b.setAttribute("aria-pressed", b.dataset.val === state.type)); }

  // build koma filters
  CATEGORIES.forEach((c) => {
    const b = document.createElement("button");
    b.className = "koma";
    b.setAttribute("aria-pressed", state.cat === c.key);
    b.innerHTML = '<span class="tile" aria-hidden="true">' + c.koma + "</span>" + c.key;
    b.onclick = () => { state.cat = state.cat === c.key ? null : c.key; syncKoma(); render(); };
    b.dataset.key = c.key;
    komaEl.appendChild(b);
  });
  function syncKoma() { [...komaEl.children].forEach((b) => b.setAttribute("aria-pressed", b.dataset.key === state.cat)); }
  syncType(); syncKoma();

  let ENTRIES = [];
  fetch("search-index.json")
    .then((r) => r.json())
    .then((data) => {
      ENTRIES = data
        .map((e) => ({ ...e, _text: [e.title, e.type, e.cat, (e.tags || []).join(" "), e.excerpt, e.text].join(" ").toLowerCase() }))
        .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      render();
    })
    .catch(() => { listEl.innerHTML = '<p class="r-ex">Could not load the search index. If you opened this file directly, serve the folder instead (see README).</p>'; });

  qEl.addEventListener("input", () => { state.q = qEl.value; render(); });

  function render() {
    const q = state.q.trim().toLowerCase();
    let shown = 0;
    listEl.innerHTML = "";
    ENTRIES.forEach((e) => {
      const hit =
        (state.type === "all" || e.type === state.type) &&
        (!state.cat || e.cat === state.cat) &&
        (!q || e._text.includes(q));
      if (!hit) return;
      shown++;
      const badge = e.type === "note" ? "note" : e.type === "post" ? "post" : "resource";
      const tags = (e.tags || []).map((t) => '<span class="tag">' + esc(t) + "</span>").join(" ");
      const row = document.createElement("div");
      row.className = "result";
      row.innerHTML =
        '<span class="tile" aria-hidden="true">' + komaFor(e.cat) + "</span>" +
        '<div class="r-body"><h3><a href="' + esc(e.url) + '">' + esc(e.title) + "</a></h3>" +
        '<div class="r-meta"><span class="badge ' + badge + '">' + badge + "</span> &middot; " +
        (e.date ? fmt(e.date) + " &middot; " : "") + esc(e.cat || "") + (tags ? " &middot; " + tags : "") + "</div>" +
        (e.excerpt ? '<p class="r-ex">' + esc(e.excerpt) + "</p>" : "") +
        "</div>";
      listEl.appendChild(row);
    });
    countEl.textContent = shown + (shown === 1 ? " result" : " results");
    emptyEl.classList.toggle("show", shown === 0);
  }
})();

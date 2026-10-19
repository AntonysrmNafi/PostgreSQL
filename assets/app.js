(() => {
  const doc = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const SQL_KW = ["SELECT", "FROM", "WHERE", "GROUP", "BY", "HAVING", "ORDER", "LIMIT", "OFFSET", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "RETURNING", "CREATE", "ALTER", "DROP", "TABLE", "DATABASE", "INDEX", "UNIQUE", "VIEW", "MATERIALIZED", "REFRESH", "CONCURRENTLY", "ADD", "COLUMN", "CONSTRAINT", "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "CHECK", "DEFAULT", "NOT", "NULL", "AND", "OR", "IN", "IS", "AS", "ON", "JOIN", "LEFT", "RIGHT", "INNER", "FULL", "OUTER", "WITH", "OVER", "PARTITION", "RANGE", "FOR", "TO", "BETWEEN", "CASCADE", "RESTRICT", "CONFLICT", "DO", "BEGIN", "COMMIT", "ROLLBACK", "TRANSACTION", "ISOLATION", "LEVEL", "REPEATABLE", "READ", "USING", "GIN", "EXPLAIN", "ANALYZE", "BUFFERS", "VACUUM", "FUNCTION", "RETURNS", "LANGUAGE", "TRIGGER", "BEFORE", "EACH", "ROW", "EXECUTE", "ROLE", "LOGIN", "PASSWORD", "GRANT", "REVOKE", "CONNECT", "PUBLIC", "ALL", "GENERATED", "ALWAYS", "IDENTITY", "NEW", "EXCLUDED", "VALID", "VALIDATE", "OF", "DESC", "ASC", "DISTINCT", "EXISTS", "UNION", "CASE", "WHEN", "THEN", "ELSE", "END", "TRUE", "FALSE", "SERIALIZABLE", "COMMITTED", "RENAME", "SCHEMA", "SEQUENCE", "START", "RECURSIVE", "DECLARE", "LOOP", "IF", "ELSIF", "RAISE", "NOTICE", "EXCEPTION", "PROCEDURE", "CALL", "POLICY", "ENABLE", "SECURITY", "FORCE", "INTO", "STORED", "REPLACE"];
  const SQL_TY = ["BIGINT", "INTEGER", "SMALLINT", "TEXT", "NUMERIC", "BOOLEAN", "TIMESTAMPTZ", "TIMESTAMP", "JSONB", "UUID", "DATE", "VARCHAR", "SERIAL", "BIGSERIAL", "VECTOR", "TSVECTOR", "RECORD"];
  const sqlRe = new RegExp(
    "(--[^\\n]*)|('(?:[^']|'')*')|(\\$\\$)|(\\b\\d+(?:\\.\\d+)?\\b)|(\\b(?:" + SQL_KW.join("|") + ")\\b)|(\\b(?:" + SQL_TY.join("|") + ")\\b)|(\\b[a-z_][a-z0-9_]*(?=\\())",
    "gi"
  );
  const shRe = /(#[^\n]*)|(\s--?[a-zA-Z][\w-]*)|(\b(?:sudo|brew|apt|pg_dump|pg_restore|psql|install|services|start)\b)/g;

  function highlight(code) {
    const lang = code.dataset.lang === "sh" ? "sh" : "sql";
    const src = code.textContent ?? "";
    const re = lang === "sh" ? shRe : sqlRe;
    const cls = lang === "sh" ? ["c", "n", "k"] : ["c", "s", "k", "n", "k", "t", "f"];
    let out = "", last = 0, m;
    re.lastIndex = 0;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index));
      const gi = m.slice(1).findIndex((g) => g !== undefined);
      out += `<span class="${cls[gi] ?? ""}">${esc(m[0])}</span>`;
      last = m.index + m[0].length;
      if (m[0].length === 0) re.lastIndex++;
    }
    code.innerHTML = out + esc(src.slice(last));
  }
  $$("pre code").forEach(highlight);

  // Theme
  const themeBtn = $("#theme");
  themeBtn?.addEventListener("click", () => {
    const next = doc.dataset.theme === "dark" ? "light" : "dark";
    doc.dataset.theme = next;
    try { localStorage.setItem("pgdocs-theme", next); } catch (_) { /* storage unavailable */ }
  });

  // Copy buttons
  $$(".copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = $("code", btn.closest(".code"))?.textContent ?? "";
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = Object.assign(document.createElement("textarea"), { value: text });
        document.body.append(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (__) { /* ignore */ }
        ta.remove();
      }
      const label = btn.textContent;
      btn.textContent = doc.dataset.copied ?? "Copied";
      btn.classList.add("done");
      setTimeout(() => { btn.textContent = label; btn.classList.remove("done"); }, 1600);
    });
  });

  // Reading progress
  const bar = $(".progress");
  let ticking = false;
  const updateBar = () => {
    const max = doc.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(updateBar); } }, { passive: true });
  updateBar();

  // Reveal on scroll
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); reveal.unobserve(e.target); } });
  }, { threshold: 0.08 });
  $$(".reveal").forEach((el) => reveal.observe(el));

  // Scroll spy
  const links = new Map($$(".syllabus a").map((a) => [a.getAttribute("href").slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.remove("active"));
      const a = links.get(e.target.id);
      a?.classList.add("active");
      a?.scrollIntoView({ block: "nearest" });
    });
  }, { rootMargin: "-35% 0px -60% 0px" });
  $$(".module").forEach((s) => spy.observe(s));

  // Sidebar search
  $("#q")?.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    $$(".syllabus li").forEach((li) => { li.hidden = q !== "" && !li.textContent.toLowerCase().includes(q); });
  });

  // Mobile drawer
  const closeNav = () => document.body.classList.remove("nav-open");
  $("#menu")?.addEventListener("click", () => document.body.classList.toggle("nav-open"));
  $(".scrim")?.addEventListener("click", closeNav);
  links.forEach((a) => a.addEventListener("click", closeNav));
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });
})();

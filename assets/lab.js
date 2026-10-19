
(() => {
  const $ = (s) => document.querySelector(s);
  const ed = $("#lab-sql");
  if (!ed) return;
  const T = JSON.parse($("#lab").dataset.t || "{}");
  const out = $("#lab-out");
  const status = $("#lab-status");
  const SAMPLE = `DROP TABLE IF EXISTS enrollments, courses, students CASCADE;
CREATE TABLE students (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, full_name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, gpa NUMERIC(3,2) CHECK (gpa BETWEEN 0 AND 4), enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE courses (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, code TEXT NOT NULL UNIQUE, title TEXT NOT NULL, credits SMALLINT NOT NULL CHECK (credits > 0));
CREATE TABLE enrollments (student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE, course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE RESTRICT, grade NUMERIC(3,2), PRIMARY KEY (student_id, course_id));
INSERT INTO students (full_name, email, gpa) VALUES ('Ayesha Rahman','ayesha@uni.edu',3.80),('Tanvir Hasan','tanvir@uni.edu',3.40),('Nusrat Jahan','nusrat@uni.edu',3.95),('Rafi Ahmed','rafi@uni.edu',2.60),('Mim Akter','mim@uni.edu',3.10),('Sabbir Khan','sabbir@uni.edu',NULL);
INSERT INTO courses (code, title, credits) VALUES ('CS101','Intro to CS',3),('MA201','Linear Algebra',4),('PH110','Physics I',3),('EN105','Academic Writing',2);
INSERT INTO enrollments (student_id, course_id, grade) VALUES (1,1,3.7),(1,2,3.5),(2,1,3.0),(2,3,3.3),(3,1,4.0),(3,2,3.9),(3,3,3.8),(4,1,2.4),(5,2,3.2),(5,3,2.9);
SELECT 'students' AS tbl, count(*) AS n FROM students UNION ALL SELECT 'courses', count(*) FROM courses UNION ALL SELECT 'enrollments', count(*) FROM enrollments;`;
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const fmt = (v) => v === null ? "NULL" : v instanceof Date ? v.toISOString()
    : typeof v === "object" ? JSON.stringify(v, (_, x) => typeof x === "bigint" ? x.toString() : x) : String(v);
  const err = (m) => { out.innerHTML = `<div class="err">${esc(m)}</div>`; };
  let dbp = null;

  function boot() {
    dbp ??= (async () => {
      status.textContent = T.loading;
      let mod;
      try { mod = await import("https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.2.17/dist/index.js"); }
      catch (_) { mod = await import("https://cdn.jsdelivr.net/npm/@electric-sql/pglite/dist/index.js"); }
      let db;
      try { db = new mod.PGlite("idb://pgdocs-lab"); await db.waitReady; }
      catch (_) { db = new mod.PGlite(); await db.waitReady; }
      status.textContent = T.ready;
      return db;
    })().catch((e) => { dbp = null; status.textContent = T.offline; throw e; });
    return dbp;
  }

  function meta(sql) {
    if (/^\\dt\b/.test(sql)) return "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY 1";
    const m = sql.match(/^\\d\s+(\w+)/);
    return m ? `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = '${m[1].toLowerCase()}' ORDER BY ordinal_position` : null;
  }

  function table(r) {
    const head = r.fields.map((f) => `<th>${esc(f.name)}</th>`).join("");
    const rows = r.rows.map((row) => "<tr>" + r.fields.map((f) => `<td>${esc(fmt(row[f.name]))}</td>`).join("") + "</tr>").join("");
    return `<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table><div class="ok">${r.rows.length} ${T.rows}</div>`;
  }

  async function run() {
    let sql = ed.value.trim();
    if (!sql) return;
    let db;
    try { db = await boot(); } catch (_) { return err(T.offlineMsg); }
    if (sql.startsWith("\\")) {
      sql = meta(sql);
      if (!sql) return err(T.metaMsg);
    }
    const t0 = performance.now();
    try {
      const res = await db.exec(sql);
      const shown = res.filter((r) => r.fields?.length);
      const affected = res.reduce((a, r) => a + (r.affectedRows || 0), 0);
      const done = res.length - shown.length;
      out.innerHTML = (done ? `<div class="ok">OK · ${done}${affected ? " · " + affected + " " + T.rows : ""}</div>` : "")
        + shown.map(table).join("") + `<div class="ok">${Math.round(performance.now() - t0)} ms</div>`;
    } catch (e) { err(e?.message ?? e); }
  }

  const open = () => { document.body.classList.add("lab-open"); ed.focus({ preventScroll: true }); boot().catch(() => {}); };
  ["#lab-open", "#lab-open2"].forEach((s) => $(s)?.addEventListener("click", open));
  $("#lab-close").addEventListener("click", () => document.body.classList.remove("lab-open"));
  $("#lab-run").addEventListener("click", run);
  $("#lab-sample").addEventListener("click", () => { ed.value = SAMPLE; run(); });
  $("#lab-reset").addEventListener("click", async () => {
    if (!confirm(T.confirm)) return;
    try {
      const db = await boot();
      await db.exec("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
      out.innerHTML = `<div class="ok">${esc(T.resetDone)}</div>`;
    } catch (e) { err(e?.message ?? e); }
  });
  ed.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); }
    else if (e.key === "Tab") { e.preventDefault(); ed.setRangeText("    ", ed.selectionStart, ed.selectionEnd, "end"); }
  });
  document.querySelectorAll(".tryb").forEach((b) => b.addEventListener("click", () => {
    ed.value = b.closest(".code").querySelector("code").textContent;
    open();
  }));
})();

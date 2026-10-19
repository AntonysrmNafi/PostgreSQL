# PostgreSQL, Zero to Advanced

A free, class style PostgreSQL course that assumes you know **nothing**. No coding background and no database background needed. You start from "what is data?" and finish with recursive queries, PL/pgSQL, row level security, replication and vector search.

[![Open the website](https://img.shields.io/badge/OPEN-THE%20WEBSITE-FFD23F?style=for-the-badge&labelColor=111111)](https://antonysrmnafi.github.io/PostgreSQL/)
[![Bangla edition](https://img.shields.io/badge/%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE-EDITION-FF7AB6?style=for-the-badge&labelColor=111111)](https://antonysrmnafi.github.io/PostgreSQL/bn/)

**Live site:** https://antonysrmnafi.github.io/PostgreSQL/

---

## What you will learn

The site has **23 modules** in four levels. Read them in order, like classes.

### Foundations (modules 01 to 08)

| # | Module | You will learn |
|---|--------|----------------|
| 01 | Start Here: Class Zero | What data, a database, a table, SQL and a server are, explained with everyday examples |
| 02 | Introduction and Setup | How a cluster, database, schema and table fit together, plus installing on Linux and macOS |
| 03 | Install PostgreSQL on Windows | Step by step installer guide, `winget`, Docker, and fixes for common errors |
| 04 | SQL Basics: Your First Statements | SQL grammar, statement anatomy, the five command groups, reading error messages |
| 05 | Tables and Data Types | Choosing the right type, keys, defaults and checks |
| 06 | CRUD | `INSERT`, `SELECT`, `UPDATE`, `DELETE`, `RETURNING` and upserts |
| 07 | Querying | Filters, sorting, aggregates, `GROUP BY`, `HAVING` and every join type |
| 08 | Functions and Expressions | Text, number, date and `NULL` handling, casting |

### Intermediate (modules 09 to 14)

| # | Module | You will learn |
|---|--------|----------------|
| 09 | Constraints, Relationships, Normalization | Primary and foreign keys, one to many and many to many, 1NF to 3NF |
| 10 | Changing Structure | `ALTER TABLE`, schemas and sequences |
| 11 | Subqueries, Set Operations, CASE | Scalar, `IN` and `EXISTS` subqueries, `UNION`, `INTERSECT`, `EXCEPT` |
| 12 | Indexes and Query Plans | B-tree, GIN, GiST, BRIN, partial indexes and reading `EXPLAIN ANALYZE` |
| 13 | Pattern Matching and Full Text Search | `LIKE`, regular expressions, `tsvector`, ranking |
| 14 | Transactions, MVCC and Locking | ACID, isolation levels, row locks and deadlocks |

### Advanced (modules 15 to 22)

| # | Module | You will learn |
|---|--------|----------------|
| 15 | Advanced SQL | CTEs, window functions, JSONB and materialized views |
| 16 | Recursive Queries and Hierarchies | Org charts, trees and graphs with recursive CTEs |
| 17 | PL/pgSQL Programming | Functions, procedures, variables, loops and exception handling |
| 18 | Functions, Triggers, Partitioning | Triggers, range partitioning and keyset pagination |
| 19 | Replication, Extensions, Tuning | Streaming and logical replication, extensions, first tuning settings |
| 20 | Security, Backup and Production | Roles, least privilege, `pg_dump`, WAL, pooling and safe migrations |
| 21 | Row Level Security | Policies for multi tenant data |
| 22 | Modern PostgreSQL | Docker Compose and `pgvector` similarity search |

### Reference (module 23)

Cheat sheet, `psql` commands, glossary and next steps.

---

## Features

- **Practice Lab.** A real PostgreSQL running inside your browser (WebAssembly). Write any SQL you like, press `Ctrl + Enter` to run it, load ready made sample data, and use `\dt` and `\d table`. Tables survive a page refresh.
- **Try button** on every SQL example, which sends the code straight into the lab.
- **Practice questions** with hidden solutions.
- **Two editions.** English and Bangla explanations, with the code always in English.
- **Retro neubrutalism design** with a syllabus sidebar, search, reading progress bar, dark mode and a print stylesheet.

> The Practice Lab downloads PostgreSQL from a CDN the first time you open it, so it needs an internet connection. `pgvector` and `pg_trgm` are not available in the browser lab, so run those two examples in Docker.

---

## Project structure

```
.
├── index.html          English edition
├── bn/
│   └── index.html      Bangla edition, served at /bn
└── assets/
    ├── style.css       Design system
    ├── app.js          Sidebar, theme, progress, copy button, syntax highlighting
    ├── lab.js          Practice Lab
    └── theme.js        Applies the saved theme before the page paints
```

## Run it locally

No build step and no dependencies.

```bash
git clone https://github.com/AntonysrmNafi/PostgreSQL.git
cd PostgreSQL
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly in a browser also works for reading.

## Host it on GitHub Pages

1. Push the files to the repository root.
2. Open **Settings**, then **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select your main branch and the `/ (root)` folder, then save.
4. The site goes live at `https://<username>.github.io/<repository>/`.

---

## Author

Made by **Antonysrm Nafi** ([@AntonysrmNafi](https://github.com/AntonysrmNafi)).

If this course helped you, give the repository a star.

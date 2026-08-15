# Hallim — Content Extraction

Structured content extraction from a batch of real Korean-learning / TOPIK exam-prep PDFs, for **Hallim**, a TOPIK (Test of Proficiency in Korean) exam-prep web app. This repo is the data + documentation side of that work — not the app itself.

See **[PROGRESS.md](PROGRESS.md)** for the full detailed log: what was done, methodology, exact completion status per source, known issues, and precise instructions for continuing this on another machine.

## Quick status

| Source | Status | Items |
|---|---|---|
| TOPIK II full mock exam (4 rounds) | ✅ Complete, verified | 434 |
| TOPIK I full mock exam (10 rounds) | ✅ Complete, verified | 700 |
| TOPIK II writing book (Task 53/54 + model essays) | ✅ Complete, verified | 35 |
| TOPIK essay model-essays compilation | ✅ Complete, verified | 58 |
| Yonsei TOPIK II Reading practice book | 🟡 In progress — 336/~450 items, page 177 of 254 | 336 so far |
| PDF inventory (91 unique source files reviewed) | ✅ Complete | — |
| Homepage UI (in-app dashboard) | ✅ Complete, standalone component handoff | — |

## Structure

```
data/
  reading/     — extracted TOPIK I & II mock-exam questions + Yonsei reading practice book (JSON/JSONL)
  writing/     — extracted TOPIK II writing prompts + model essays (JSON/JSONL)
inventory/     — PDF inventory pass: what every source PDF actually contains, categorized
homepage-ui/   — the Hallim in-app homepage: React/Next.js component + theme CSS (separate earlier deliverable)
```

## Important: source PDFs are NOT in this repo

The original textbook/exam-prep PDFs (copyrighted commercial and semi-commercial Korean-language materials) are **not included here** — only the structured data extracted from them. To continue extraction work, the source PDFs need to be present locally (see PROGRESS.md for exact filenames and where they were sourced from). Do not commit them to this repo, public or private.

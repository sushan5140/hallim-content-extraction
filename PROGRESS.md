# Hallim Content Extraction — Full Progress Log

## Project context

**Hallim** is a TOPIK (Test of Proficiency in Korean) exam-prep web app, modeled loosely on an HSK exam-prep app called "Super Test" but for Korean instead of Chinese. Core sections: Listening, Reading, Vocab training, Real mock exams, Mock exam sets, Incorrect-answers review bank, and a "Companion" structured learning path (units/lessons with Vocab/Grammar/Drill/Listening sub-sections).

TOPIK has two tiers:
- **TOPIK I** (levels 1-2): listening + reading only, multiple choice, 70 questions per round (listening then reading, no fixed sub-ranges enforced as strictly as TOPIK II).
- **TOPIK II** (levels 3-6): listening + reading + writing. Reading has a real fixed question-position structure (different ranges test different task types). Writing has two types: a short data-interpretation response (Task 53, 200-300자) and a longer argumentative essay (Task 54, 600-800자 depending on level).

The user had a batch of ~94 real Korean-learning PDFs (textbooks, workbooks, vocab dictionaries, and — most importantly — actual TOPIK mock-exam books) sitting in their Downloads folder, all dated the same day. The task: inventory every file, figure out what it actually contains, and deep-extract the highest-value ones (confirmed going in: **Reading passages and full mock exams were the weakest area** of whatever content existed before this work).

## Phase 1 — Inventory (complete)

94 PDFs found in Downloads, 2.8GB total. 3 were exact byte-identical duplicates (removed), leaving **91 unique files**. Split into 4 batches, each inventoried by a parallel agent: page count, text-layer quality (via `pdftotext`), content classification (Vocabulary / Grammar / Reading-mock-exam / Writing / general coursebook / reference / irrelevant), and — critically — visual spot-checks of actual pages (not just filename guessing) to confirm what task-type/question-range each Reading/mock-exam candidate really contained.

Full results: `inventory/batch1.md` through `batch4.md` (per-file detail) and `inventory/CONSOLIDATED-REPORT.md` (synthesis).

**Headline finding**: 12 sources turned out to contain genuine TOPIK-format passages with real numbered questions (confirmed by direct page inspection) — a real, closeable gap, not a lost cause. But 9 of those 12 were scanned image-only PDFs with zero extractable text layer, meaning they needed full visual transcription, not simple text extraction.

**Also found**: Grammar and Vocabulary are *oversupplied* (10+ overlapping vocab dictionaries, a full "Korean Grammar in Use" trilogy, etc.) — that category needs deduplication, not more sourcing. Writing turned out better-covered than expected. **Listening has no audio anywhere in the corpus** — only transcripts embedded inside mock-exam books, and only once those are OCR'd/transcribed. This remains an open gap (see "Remaining gaps" below).

Files flagged as unusable/irrelevant during inventory (do not re-process):
- `혼자 있고 싶은데 외로운 건 싫어.pdf` — unrelated pop-psychology book, not a learning resource
- `548194904-Korean-Book.pdf` — only a 17-page preview excerpt, not the full book
- `453834419-0804850038-lk-181024180344.pdf` — a fake "download gate" decoy file (legitimate-looking title page, blurred lorem-ipsum body)
- `770048548-Eps-Topik-English-Book-2-PDF.pdf` — wrong exam entirely: EPS-TOPIK (migrant-worker employment exam), not the National TOPIK Hallim targets
- `TOPIK-I-1671.pdf` — filename looks like a real exam paper ID but it's just a plain vocab list

## Phase 2 — Deep extraction (mostly complete)

### Methodology

- **Environment note**: this machine has `pdftotext` but not `pdfinfo`/`pdftoppm` (poppler). Page counts came from `pypdf` (`pip install pypdf`). Visual page rendering — required for every scanned/image-only PDF, which was most of them — came from `pymupdf` (`pip install pymupdf`), rendering pages to PNG at 150-200 DPI, then reading them with Claude's vision (the Read tool), since the Read tool's native PDF viewer depends on the missing `pdftoppm`. **If setting this up fresh, install `pymupdf` and `pypdf` via pip first.**
- **Transcription approach**: real OCR engines (Tesseract etc.) were deliberately not used — these are complex mixed Korean/English layouts (multiple-choice options, boxed passages, charts, wongoji/manuscript grids) that a raw OCR pass handles poorly. Every question was visually read and transcribed by an agent, one page-range at a time.
- **Critical lesson learned — save incrementally, one item at a time**: early extraction attempts held many extracted items in memory and wrote them out in one large batch at the end. This machine had *frequent* interruptions during this work — Claude session usage limits, weekly usage caps, and outright connection drops ("stream idle timeout", "connection closed mid-response") — sometimes multiple times per hour. Any attempt that batched its saves lost significant completed work when interrupted. **Every extraction agent from partway through this project onward was instructed to append each single extracted item to its output file immediately (load → append one item → write back to disk → repeat), never holding more than one item unsaved at a time.** This is why the later files show clean incremental resume points and the earlier ones had a rockier start. **Keep this discipline for any continuation work.**
- **Boundary-splitting lesson**: splitting a large book across two parallel agents by an arbitrary page-number guess (e.g. "you take pages 1-155, you take 156-302") reliably created a real content gap in the middle, because neither agent knew what the other had actually finished before its own session ended. The fix that worked: do a quick manual visual recon first (render and read ~8-10 sample pages spread across the book) to find real round/section boundaries, *then* assign scope — or better, run one agent sequentially with frequent incremental saves and just resume it repeatedly rather than pre-splitting blind.
- **Verification discipline**: every "complete" claim in this log was independently re-verified by directly loading the JSON/JSONL file, checking it parses without error, checking the raw byte tail isn't truncated mid-object, and — most importantly — checking *distinct question numbers per round* against the expected count (e.g. "50 items" can hide duplicates; "50 distinct question numbers, 1-50, none missing" cannot). Never trust an agent's own completion summary at face value — re-derive the count from the file.

### Schema

**Reading / mock-exam questions** (one JSON object per question):
```json
{
  "sourceFile": "722119942-Topik-II-실전모의고사.pdf",
  "sourceType": "full_paper",
  "examLevel": "II",
  "skillArea": "listening | reading | writing",
  "mockSetLabel": "제1회 실전 모의고사 (the book's own round label)",
  "questionNumber": 34,
  "questionNumberRangeLabel": "34-35 (if a shared passage covers multiple questions)",
  "taskType": "plain-language description of the actual observed task, not a forced taxonomy",
  "passageOrScriptKorean": "full transcribed Korean text, or null if audio-only listening script wasn't printed",
  "questionTextKorean": "...",
  "choices": ["1) ...", "2) ...", "3) ...", "4) ..."],
  "correctAnswer": "if determinable from the source pages, else null",
  "explanation": "if present, else null",
  "pageNumberInSource": 47,
  "extractionConfidence": "high | medium | low",
  "notes": "anything uncertain, illegible, or noteworthy"
}
```
(TOPIK I items additionally carry a `pointValue` field, e.g. `"2점"`/`"3점"`, when shown.)

**Writing prompts + model essays**:
```json
{
  "sourceFile": "722111849-쓰기-100점-받자-PDF.pdf",
  "examLevel": "II",
  "taskNumber": 53,
  "examRoundLabel": "if cited, else null",
  "requiredWordCount": "200~300자",
  "promptKorean": "...",
  "suppliedData": "description of chart/graph/table content, else null",
  "modelAnswerKorean": "full model essay text, or null if not present in source",
  "modelAnswerWordCountApprox": 287,
  "pageNumberInSource": 65,
  "extractionConfidence": "high | medium | low",
  "notes": "..."
}
```

### Source-by-source status

#### ✅ TOPIK II full mock exam — COMPLETE, verified
**Source**: `722119942-Topik-II-실전모의고사.pdf` (302 pages, 2021 edition, 시대고시기획 publisher, zero text layer). 4 complete real rounds (listening+reading+writing) plus a full answer/explanation section.

**Output files** (combine all 3 for the complete dataset):
- `data/reading/topik2-siljeon-mogosa-part1.json` — 54 items (Round 1 listening+writing)
- `data/reading/topik2-siljeon-mogosa-gapfill.jsonl` — 296 items (Round 1 reading + all of Rounds 2 and 3 + start of Round 4)
- `data/reading/topik2-siljeon-mogosa-part2.jsonl` — 84 items (rest of Round 4 + some Round-1 answer-key backfill)

**Verified**: 434 total items. Every round has exactly 50 distinct listening questions, 50 distinct reading questions, 4 distinct writing tasks (checked by real question-number sets, not just counts). Zero duplicate items across the 3 files at their boundaries.

**Known cosmetic issue**: Round 1's label appears as both `"제1회 실전 모의고사"` (with a space) and `"제1회 실전모의고사"` (without) across the different extraction passes — same round, just an inconsistent string. Normalize before loading into the app.

#### ✅ TOPIK I full mock exam — COMPLETE, verified
**Source**: `New_TOPIK_MASTER_Final_TOPIK__8544__Basic_-_Book.pdf` (393 pages, "New TOPIK MASTER TOPIK I Basic — Final 실전모의고사 Actual Tests," zero text layer). 10 complete rounds, 70 questions each (listening then reading, no writing section for TOPIK I).

**Output files** (combine all 4 for the complete dataset):
- `data/reading/topik1-master-basic-part1.json` — 70 items (Round 1)
- `data/reading/topik1-master-basic-gapfill.jsonl` — 490 items (Rounds 2-8, all complete)
- `data/reading/topik1-master-basic-part2.jsonl` — 122 items (Round 9 complete + Round 10 partial, Q1-52)
- `data/reading/topik1-master-basic-round10-finish.jsonl` — 18 items (Round 10 Q53-70)

**Verified**: 700 total items = exactly 10 rounds × 70 questions. Every round has exactly 70 distinct question numbers, 1-70, none missing. Zero duplicate items across all 4 files. Label format is perfectly consistent across all 10 rounds this time (`"실전모의고사 TOPIK I 제N회 (문제집)"`).

#### ✅ TOPIK II writing book — COMPLETE, verified
**Source**: `722111849-쓰기-100점-받자-PDF.pdf` (199 pages, 시대고시기획 "TOPIK II 쓰기," zero text layer). Full theory + practice + real model essays in wongoji (manuscript-grid) format.

**Output**: `data/writing/ssseugi-100jeom.json` — **35 items** (20 Task 53 + 15 Task 54). Every single item has a full model answer (verified — 0 of 35 have `modelAnswerKorean: null`). Page range 65-183; pages 1-64 are theory/instructions with no standalone extractable prompts, pages 187-199 are backmatter (idiom appendix + back cover).

#### ✅ TOPIK essay model-essays compilation — COMPLETE, verified
**Sources**: `349006977-TOPIK-Essay-Writing-Topics-Model-Essays - Copy.pdf` and `...-Model-Essays_copy.pdf` — **confirmed byte-identical in extracted text** (44/44 pages, 30,278 chars each), so only one was actually processed; the other is a redundant re-download, not separate content.

**Output**: `data/writing/topik-essay-model-essays.jsonl` — **58 items**, rounds 10-37 and 41. Important nuance preserved in every affected item's `notes` field: only the first 8 items (rounds 35/36/37/41) are genuine modern chart-based Task 53/54 content. The remaining 50 are from a **pre-2014 "old format" essay track** bundled into the same book (personal-narrative/opinion prompts with bullet points, no chart, different word-count bands: 400-600자 and 700-800자 depending on level) — tagged `taskNumber: 53` only because that's the schema default, but they are NOT current-exam Task 53/54 content. Treat as a distinct legacy question type if loading into the app. 30 of the 58 items have no model answer in the source (prompt-only, confirmed not an extraction gap — the source book simply doesn't include one for those rounds).

#### 🟡 Yonsei TOPIK II Reading practice book — IN PROGRESS
**Source**: `521064083-korea-book-yonsei-topik-2-읽기.pdf` — "연세 토픽 II 읽기" (Yonsei University Language Institute's official TOPIK II Reading book, subtitle "유형과 실전" / "Types and Actual Practice"), 254 pages, partial/garbled-but-present text layer. Organized by question-type (유형) with real passages, 4-choice questions, and answer-key explanations, covering the real 1-50 reading structure.

**Output so far**: `data/reading/yonsei-topik2-reading.json` — **336 items**, pages 11-177 of 254. This is the single remaining incomplete source from the original extraction plan.

**To continue**: this file uses a plain JSON array (not JSONL) — read the last few entries to find the exact last `pageNumberInSource` (currently 177), then resume an agent scoped to the remaining pages (178-254) with the same schema and the same one-item-at-a-time incremental save discipline described above. See "How to continue" below for the exact resume prompt pattern that worked repeatedly throughout this project.

### Combined so far
**1,227 individually-verified real exam/practice items** across the 5 sources above (434 + 700 + 35 + 58 = 1,227, plus 336 more in-progress from Yonsei not yet in that total). This was the explicitly weakest-confirmed area going into this project and is now the strongest.

## Remaining gaps (not started / out of scope so far)

1. **Finish Yonsei TOPIK II Reading** (see above — ~76 pages / roughly 100-150 more items estimated).
2. **Vocabulary dedup**: 10+ overlapping vocab dictionaries exist in the original 91-file inventory (2000 Essential Korean Words ×2 levels, TOPIK in 30 Days, Mindmap TOPIK Vocab 2300, Yonsei Vocabulary Practice Advanced, etc.), plus the 5-volume "Vitamin Korean" (비타민 한국어) coursebook series appears to be uploaded under two different naming conventions for overlapping levels. None of this has been deep-extracted yet — it needs a comparison/dedup pass first to pick canonical sources rather than extracting all of them wholesale. See `inventory/CONSOLIDATED-REPORT.md` §4 for the full file list.
3. **Grammar dedup**: the full Darakwon "Korean Grammar in Use" trilogy (Beginner/Intermediate/Advanced) plus several other grammar sources exist but are unextracted — same story, needs a canonical-source decision, not more sourcing. See `inventory/CONSOLIDATED-REPORT.md` §3.
4. **Listening audio**: no audio exists anywhere in the 91-file corpus — only transcripts embedded inside the mock-exam books (and only for the ones already extracted above, where scripts happened to be printed rather than audio-only). This needs a separate sourcing plan entirely (licensed audio, TTS generation from the extracted transcripts, or another source) before Hallim's Listening section can have anything to actually play.
5. **Other Reading/mock-exam sources not yet deep-extracted**, confirmed genuine during inventory but not touched in Phase 2: `735876229-Hot-Topik-New-...Giải.pdf` (5 rounds, TOPIK II), `663178932-TOPIK-MASTER-TOPIK-2-해설집.pdf` (10 mock tests, TOPIK II), `550780563-Perfect-TOPIK.pdf` (2 mock exams, TOPIK II), `744471923-Complete-Guide-to-the-TOPIK-II.pdf` (2 mock exams, TOPIK II), `615946003-Complete-Guide-to-the-TOPIK-Ⅱ-Intermediate-Advanced.pdf` (worked practice, TOPIK II), `520512048-TOPIK-II-2.pdf` (answer-key-only companion, lower priority), `556019951-Complete-Guide-to-the-TOPIK-Ⅰ-New-Edition-Basic.pdf` (TOPIK I), `706253157-Complete-Guide-to-the-TOPIK-I-Basic(1).pdf` (TOPIK I), `29th TOPIK Papers Intermediate_copy.pdf` (genuine old-format scanned exam paper, pre-2014 numbering). These would meaningfully expand the Reading/mock-exam bank further if pursued.

## How to continue on another machine

1. **Get the source PDFs.** They are NOT in this repo (copyright). They were originally in the user's Downloads folder. The user will need to make the specific files named above available locally again (same filenames, ideally same paths) before any extraction agent can run.
2. **Install dependencies**: `pip install pypdf pymupdf`. Confirm `pdftotext` is available (it's part of the xpdf/poppler tools; on Windows via Git Bash it was already present at `/mingw64/bin/pdftotext`, but `pdftoppm`/`pdfinfo` were NOT — pymupdf covers the rendering gap).
3. **To finish Yonsei TOPIK II Reading**: read the last few entries of `data/reading/yonsei-topik2-reading.json` to confirm the current last `pageNumberInSource`, then launch an extraction pass scoped to the remaining page range, using the exact schema above, with the **one-item-at-a-time incremental save** discipline. Expect to need to resume this multiple times if this machine also has session/usage limits or connection instability — that turned out to be the norm on the original machine, not the exception. Always re-verify a "complete" claim by loading the file directly and checking distinct question-number coverage, don't trust the completion summary alone.
4. **For the other Reading/mock-exam sources listed under "Remaining gaps"**: same pattern — inventory already exists (see `inventory/`), so start straight at deep extraction using the schema above.
5. **For Vocab/Grammar**: do a comparison pass across the overlapping sources first (check page counts, sample content, and — for the Vitamin Korean dual-naming situation — whether the two naming conventions are actually the same scans or different ones) before committing to full extraction, to avoid redundant work.

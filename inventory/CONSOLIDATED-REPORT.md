# Hallim PDF Inventory — Consolidated Report

Source: `C:\Users\DELL\Downloads\`, files dated 2026-07-17. 94 PDFs found, 2.8GB total; 3 exact byte-identical duplicates excluded before processing, leaving **91 unique files inventoried** across 4 parallel batches (`batch1.md`–`batch4.md` in this folder — full per-file detail there).

This is an **inventory pass only**: page count, text-layer quality, and content classification, with visual spot-checks (not full line-by-line extraction). Full structured extraction is the next phase, scoped below.

Environment note: this machine has `pdftotext` but not `pdfinfo`/`pdftoppm` (poppler). Page counts came from `pypdf` (installed via pip); visual sampling came from `pymupdf` (also installed via pip) rendering pages to PNG, since the Read tool's native PDF viewer depends on the missing `pdftoppm`. Both are now available for the next phase.

---

## 1. Reading passages / full mock exams — the stated priority gap

**Good news: this gap is largely closeable.** 12 sources contain genuine TOPIK-format passages with real numbered questions, confirmed by direct visual inspection (not filename guessing):

| # | File | Level | What's confirmed | Text layer |
|---|---|---|---|---|
| 1 | `722119942-Topik-II-실전모의고사.pdf` | II | **Best find overall.** 4 complete real papers (listening+reading+writing), confirmed Q34-35, Q48-50, writing 51-54, plus full answer/explanation section | None — needs OCR |
| 2 | `521064083-korea-book-yonsei-topik-2-읽기.pdf` | II | Yonsei University's official Reading book, real passages across the full 50-question structure, confirmed Q16-18/41/42-43/46-47 | Partial (garbled but present) |
| 3 | `735876229-Hot-Topik-New-đỏ-sach-Giải.pdf` | II | "HOT TOPIK II Actual Test" explanation book, 5 full mock rounds incl. listening transcripts | Partial |
| 4 | `663178932-TOPIK-MASTER-TOPIK-2-해설집.pdf` | II (Interm-Adv) | 10 mock tests, confirmed Q33-34 + a full model essay | None — needs OCR |
| 5 | `550780563-Perfect-TOPIK.pdf` | II | 2 full mock exams (listening+writing+reading), confirmed Q19-20 | None — needs OCR (180MB) |
| 6 | `744471923-Complete-Guide-to-the-TOPIK-II.pdf` | II | Confirmed Q9-12, 2 full mock exams in Part 3, English explanations | None — needs OCR |
| 7 | `615946003-Complete-Guide-to-the-TOPIK-Ⅱ-Intermediate-Advanced.pdf` | II | Worked practice by question-type (not a full timed paper), confirmed Q33 | None — needs OCR |
| 8 | `520512048-TOPIK-II-2.pdf` | II | **Explanation-only** companion (not a blank paper), confirmed listening 13-16 / reading 45-50; some pages badly faded | None |
| 9 | `New_TOPIK_MASTER_Final_TOPIK__8544__Basic_-_Book.pdf` | I | 10 full actual-test papers, confirmed Q65-70 (TOPIK I's real reading range is 31-70) | None — needs OCR |
| 10 | `556019951-Complete-Guide-to-the-TOPIK-Ⅰ-New-Edition-Basic...pdf` | I | Real passages organized by question type, confirmed Q43-45 | None — needs OCR |
| 11 | `706253157-Complete-Guide-to-the-TOPIK-I-Basic(1).pdf` | I | Confirmed Q46-48 "choosing the main idea"; companion to #6 | None — needs OCR |
| 12 | `29th TOPIK Papers Intermediate_copy.pdf` | Old 3-tier format (pre-2014) | Genuine scanned sat exam with handwritten pencil answers; numbering won't map 1:1 to current TOPIK II | Good (real text, some Korean drops) |

**The catch: almost every one of these is a scanned, image-only PDF with no usable text layer.** Only #2, #3, and #12 have any real (if imperfect) extractable text. The rest — including the single best file, #1 — will need OCR before any structured question/passage extraction can happen. None of these PDFs contain audio; where a mock exam includes a listening section, only the transcript text exists once OCR'd, not actual audio.

## 2. Writing — better covered than expected (bonus find)

6 sources have genuine Task 53/54-style prompts **with model answers**, not just theory:

- `588613293-Cracking-the-TOPIK-2-Writing.pdf` — 5 mock writing tests
- `753971008-All-About-Korean-TOPIK-Writing-New.pdf` — confirmed Task 53 prompt + structured model answer
- `722111849-쓰기-100점-받자-PDF.pdf` — confirmed ~300-char Task 53 and ~700-char Task 54 model essays in real answer-sheet (원고지) grids
- `349006977-TOPIK-Essay-Writing-Topics-Model-Essays - Copy.pdf` and `..._copy.pdf` — **two separate near-duplicate uploads** of the same TOPIKGUIDE.com compilation, real past prompts by exam round (제15회–제41회) + model essays. Compare before extracting both.
- `415985246-Hot-TOPIK-II-Writing-pdf.pdf` — 25-day Q53 mistake-correction drills; text layer is corrupted/garbled, needs OCR

## 3. Grammar — well covered, likely redundant

Strong, well-known sources: the full Darakwon "Korean Grammar in Use" trilogy (Beginner/Intermediate/Advanced, explicitly TOPIK-level-tagged), "TOPIK Essential Grammar 150" (ranked by exam frequency, cites real past-exam question IDs per point), a compact 66-point `TOPIK-Ⅱ-Grammar.pdf.pdf` reference table, "Korean Grammar for Speaking," and the 3-volume "Korean Made Simple" workbook series. This category doesn't need more sourcing — it needs deduplication and a decision on which one or two become canonical.

## 4. Vocabulary — the most oversupplied category

At least 10 general vocabulary dictionaries (2000 Essential Korean Words ×2 levels, New TOPIK II 2000 words, Mindmap TOPIK Vocab 2300, TOPIK in 30 Days ~2200 words, TOPIK I Vocabulary 40 Days, Korean Vocabulary Practice Advanced, My First 500 Words, Korean Picture Dictionary, plus several small 8-12-page thematic lists) almost certainly overlap heavily. Before extracting all of them, they need cross-comparison to find which is most complete/cleanest per level, rather than merging 10 overlapping word lists wholesale.

**Also worth noting**: the 5-volume "비타민 한국어 (Vitamin Korean)" coursebook series appears to be uploaded under two different naming conventions (`vitamin_1.pdf`...`vitamin_6.pdf` short names, and separately `512550032-비타민-한국어-3...pdf` / `516280341-Vitamin-Korean-6.pdf` / `524755884-Vitamin-Korean-4.pdf` / `524755915-Vitamin-Korean-5.pdf` long names) for overlapping levels 3-6. File sizes are close but not byte-identical, so these are probably different scans of the same books, not true duplicates — worth a direct comparison before double-processing. `581697817-Vitamin-Korean-eBook-1.pdf` is also a visibly lower-quality capture (baked-in browser chrome from a flipbook viewer) compared to the others.

## 5. Listening — still a real gap after this pass

No dedicated listening-only source exists in this corpus. Listening content only appears embedded inside the combined-skill mock-exam books above (as scripts, once OCR'd) — there is **no audio anywhere in this upload**. Even after OCR'ing the priority Reading/mock-exam files, Hallim's Listening section will have transcripts but nothing to actually play. This needs a separate sourcing plan (licensed audio, TTS generation from the extracted transcripts, or another source entirely) — flagging clearly rather than pretending the gap is closed.

## 6. Set aside / unusable

- `혼자 있고 싶은데 외로운 건 싫어.pdf` — unrelated Korean-language pop-psychology book (translated "The Science of Introverts"), not a learning resource
- `548194904-Korean-Book.pdf` — only a 17-page preview excerpt, not the full book its own TOC implies
- `453834419-0804850038-lk-181024180344.pdf` — a fake/decoy "download gate" file; legitimate-looking title page, blurred lorem-ipsum body, do not use
- `770048548-Eps-Topik-English-Book-2-PDF.pdf` — wrong exam entirely: EPS-TOPIK (migrant-worker employment exam), not the National TOPIK Hallim targets
- `TOPIK-I-1671.pdf` — filename looks like a real paper ID but it's just a plain vocabulary list

## 7. Duplicates found

Exact byte-identical (excluded from processing):
- `232589960-2000-Essential-Korean-Words-for-Beginners - Copy.pdf` = `...-Beginners.pdf`
- `topik-2662 (1).pdf` = `topik-2662.pdf`
- `Complete_Guide_to_the_TOPIK__8544__Basic.pdf` = `556019951-Complete-Guide-to-the-TOPIK-Ⅰ-New-Edition-Basic...pdf`

Likely-same-content, different scans (not byte-identical — verify before double-extracting): the two TOPIK-Essay-Writing-Topics files (§2), and the Vitamin Korean dual-naming set (§4).

---

## Bottom line

The Reading/mock-exam gap you flagged going in has **12 real candidate sources**, which is a genuinely good outcome — but 9 of the 12 need OCR before any of that content becomes usable JSON, including the single best file. Writing is better-covered than expected. Grammar and Vocabulary have more than enough raw material already and need deduplication, not more sourcing. Listening has no audio at all in this corpus and needs a separate plan.

**Suggested next step**: an OCR + structured-extraction pass focused on the 12 Reading/mock-exam files and 6 Writing files first (18 files, the highest-value and highest-effort content), before touching Vocab/Grammar dedup — since Reading was the stated priority and is also the most technically blocked. Say the word and I'll scope that as the next phase.

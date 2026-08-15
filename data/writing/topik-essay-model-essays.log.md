# TOPIK II Writing Essay Compilation — Extraction Log

## Prior-attempt recovery
Found a prior crashed session's scratch files at `.../writing/`: `copy1.txt`/`copy2.txt`
(a poor pdftotext-style extraction with dropped Hangul) and `copy1_fitz.txt`/`copy2_fitz.txt`
(a good PyMuPDF extraction, 44 pages, 68,495 bytes). No `topik-essay-model-essays.jsonl`
existed yet, so no second attempt had started writing output — extraction began fresh.
A `pages/` subfolder and a `ssseugi-100jeom.json` file in the same directory turned out to
belong to an **unrelated** prior task (a different book, "TOPIK II 쓰기 100점" by 정은화,
시대고시기획 2018) and were ignored. The top-level `page_01.png`…`page_08.png`,
`page_23.png`, `page_30.png` (2-digit filenames) *were* legitimate renders of our actual
target PDF from the earlier crashed attempt and were reused/re-verified.

## Step 1: duplicate-check finding
**The two files are exact duplicates.** Verified independently (not just trusting the old
scratch files) by opening both PDFs fresh with PyMuPDF and comparing `get_text()` across
all pages: both are 44 pages, and the concatenated extracted text is **byte-for-byte
identical** (30,278 characters, `t1 == t2` True). Extraction was therefore done once, from
`349006977-TOPIK-Essay-Writing-Topics-Model-Essays - Copy.pdf` (arbitrary pick since both
are equally legible); `..._copy.pdf` was skipped as a confirmed exact duplicate.

## Document structure discovered
The compilation is not a flat list of Task-53 items — it has three distinct sections:

1. **"New format" TOPIK II Writing (pages 1–8), rounds 제35회/36회/37회/41회.**
   Each round contains a genuine **Task 53** item (chart/diagram-based, 200~300자, 30점)
   *and* a **Task 54** item (600~700자, 50점 argumentative essay) — 8 items total, all with
   full model essays. Critically, PyMuPDF's text layer **drops the "※ [53]/[54] ..."
   instruction line and all chart/diagram labels** (they're vector-drawn graphics, not
   selectable text) — only the flowing prose model essay survives text extraction. To
   recover the real prompts and chart data (word-count requirements, survey %, diagram
   labels), pages 1–8 were rendered to PNG and read visually. This is the only part of the
   document requiring image-based reading; the rest is plain, fully-selectable text.

2. **"Old format" Intermediate essays (pages 8–22), 다음을 읽고 400~600자로 글을 쓰십시오
   (30점), rounds 제34회 down to 제10회 (25 rounds).** Personal-narrative/opinion titles
   with 2–3 guiding bullet points. The source explicitly flags these as "from the old
   format TOPIK papers" (pre-2014 exam structure), not the modern chart-based Task 53.
   Rounds 34–24 mostly have full model essays; round 26 has a prompt only (blank in
   source); rounds 23 down to 10 (headed "More Intermediate Essay Topics") are prompt-only
   with no model essay anywhere in the source.

3. **"Old format" Advanced essays (pages 23–44), 다음을 읽고 700~800자로 글을 쓰십시오
   (30점), rounds 제34회 down to 제10회 again (25 rounds), same round numbers as section 2
   but a harder/longer argumentative task.** Same pattern: 34–24 mostly have model essays
   (round 26 again blank), 23 down to 10 (headed "More Advanced Essay Topics:") are
   prompt-only. Rounds 11 and 10 explicitly override the word count to "800~900자 내외" in
   their own prompt text — captured and flagged in `requiredWordCount`.

**taskNumber caveat:** the schema's example fixes `taskNumber: 53`. For section 1's 4 true
chart items this is accurate; its 4 Task-54 items are tagged `54`. For all 50 old-format
items (sections 2 & 3), `taskNumber` is set to the schema default `53` per instructions, but
every such item's `notes` field explicitly flags that it is **not** a genuine chart-based
Task 53 — it's a distinct pre-2014 legacy essay type (personal/opinion title + bullet
points, no chart). Downstream consumers should filter/relabel using the `notes` field and
`requiredWordCount` (400~600자 vs 700~800자) if they need strict Task-53-only content.

## Extraction method
- Verified duplicate finding + recovered true prompts for section 1 via PyMuPDF page
  renders (`verify/real_page_01.png` … `real_page_08.png`).
- Programmatically segmented sections 2 & 3 with a Python script (`extract_old_format.py`):
  split on section boundaries, then on `제N회:` headers, then split each round's block into
  prompt vs. model-essay using (a) an explicit `<모범 답안 예시>` marker where present, or
  (b) a heuristic (text after the last numbered outline point, if substantial, is the
  essay; otherwise no essay). Cross-checked the script's per-round page numbers and
  essay-presence flags against a full manual read of the entire 44-page text — they matched
  exactly.
- Two rounds (제11회, 제10회 in the Intermediate section) had a known heuristic artifact —
  the numbered outline point's continuation text (on the next line after a bare "1.") was
  mis-classified as essay content. Manually corrected in `MANUAL_FIXES`; both are
  prompt-only in the source (no model essay), consistent with all other rounds 23–10 in
  both sections.
- All Korean text preserved verbatim from the source (including the source's own apparent
  typos, e.g. "모법 답안 예시" instead of "모범 답안 예시" in a couple of spots, and "이가는"
  instead of "이라는" in 제27회's prompt) — not corrected, per "never fabricate" instruction.
- PDF line-wrap artifacts (mid-sentence newlines from the original page layout) were
  normalized to spaces for the 50 programmatically-extracted old-format items so the JSON
  strings read as continuous prose/lists rather than ragged multi-line text.

## Totals
- **58 items** written to `topik-essay-model-essays.jsonl`.
- **28 items have a full model essay**; **30 are prompt-only** (no model essay exists in
  the source for that round — not a gap in extraction).
- Exam rounds covered: 제10회 through 제37회, plus 제41회 (rounds 38–40 do not appear
  anywhere in the source; not an extraction gap).
- taskNumber 53: 54 items (4 genuine chart-based + 50 old-format tagged per schema default);
  taskNumber 54: 4 items (all genuine, new-format section only).

## Nothing illegible / nothing skipped
No text in the document was illegible or fabricated. The only content not present in the
PDF's text layer (the 4 new-format chart prompts + diagram data) was recovered accurately
by reading the rendered page images, not guessed. Every prompt-only item's absent model
essay reflects the actual source content (confirmed both by automated blank-content
detection and manual visual page review), not a missed extraction.

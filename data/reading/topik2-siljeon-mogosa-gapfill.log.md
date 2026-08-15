# Gap-fill extraction log — 722119942-Topik-II-실전모의고사.pdf, pages 139-155

## Scope completed
Extracted pages 139-155 of the source PDF (pymupdf render at 200 dpi, read visually — pdftoppm/Read-tool-pages was unavailable in this environment, `poppler-utils` not installed). Appended incrementally to the same gap-fill file used by the prior pass, in batches of 4-9 items as instructed, so no work was at risk of being lost.

## Combined gapfill file status
`topik2-siljeon-mogosa-gapfill.jsonl` now has **296 lines total** (all validated as parseable JSON, zero malformed lines). This pass added 47 new lines on top of the 249 that existed before this run (Q37-41 from the prior pass).

## Round 3 Reading — confirmed complete (Q1-50)
This pass extracted Round 3 (제3회 실전모의고사) Reading Q42 through Q50 — the final 9 questions of Round 3, all long inference-heavy passages as expected:
- Q42-43 (page 139 / printed p.125): literary excerpt, child narrator (박옥희) recalling deceased father; emotion + content-matching questions.
- Q44-45 (page 140 / printed p.126): "flipped classroom" (거꾸로 수업) passage — topic + blank-fill.
- Q46-47 (page 141 / printed p.127): essay on the value of literature (문학) — author's attitude + content-matching.
- Q48-50 (page 142 / printed p.128): local festival culture problems (지역 축제) — purpose + blank-fill + content-matching.

Combined with the prior pass's Q1-41, **Round 3 Reading (Q1-50) is now fully extracted.**

One flagged uncertainty: Q42 choice 4 (몸음 "걱정스럽다" vs "격정스럽다") — the scan glyph was ambiguous between these two visually similar words; transcribed as 걱정스럽다 (far more common TOPIK vocabulary / better fits "worried" tone of the passage) with a note attached. Flagged `extractionConfidence: medium`.

## Round 4 content found in 139-155 (before the page-156 handoff)
Pages 143-155 turned out to contain a substantial amount of Round 4 (제4회 실전모의고사) content — confirming the recon note that Round 4 starts well before page 156:

- Page 143 (printed p.129): Round 4 title page.
- Page 144 (printed p.130): standard 유의사항/Information instructions page.
- Page 145 (printed p.131): Round 4 Listening Q1 (image-based picture-choice question).
- Pages 146-155 (printed pp.132-141): Round 4 Listening Q2 through Q36, continuous.

All of Q1-36 were extracted. **Q37 (page 156 / printed p.142) is exactly where `topik2-siljeon-mogosa-part2.jsonl` already begins** — verified by reading part2's first two entries (Q37-38, shared 웃음/laughter dialogue, page 156). Extraction was stopped at Q36 to avoid duplicating part2's content. No gap remains between Round 3's end and part2's start.

## Notes / caveats
- Round 4 Listening Q1-36: audio scripts are not printed in the booklet (listening-only sections) — only answer choices are given, consistent with the existing part2 file's convention. Q1-3 have illustration/graph answer choices rather than text; these were transcribed as brief image/chart descriptions since the real choices are pictures, matching the schema's `choices` field as closely as possible without fabricating text.
- Two non-question front-matter entries were included (Round 4 title page, instructions page) for navigational continuity; they carry `questionNumber: null` and `skillArea: "N/A"`.
- No illegible or fabricated content — all Korean text was transcribed directly from the visual scan.

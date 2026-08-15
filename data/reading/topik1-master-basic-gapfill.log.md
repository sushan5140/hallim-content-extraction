# TOPIK I Master Basic — Gap-fill extraction log

## Status: Round 8 (제8회) COMPLETE — file finished

- Total items in `topik1-master-basic-gapfill.jsonl`: **490**
- Rounds 2, 3, 4, 5, 6, 7, 8: ALL COMPLETE (70/70 each) — verified by scanning
  the file for questionNumber coverage 1–70 per round with no missing and no
  duplicate numbers.
- Round 9, 10: already extracted elsewhere (`topik1-master-basic-part2.jsonl`).
  Round 9 Q1 (listening) confirmed at page 201.

## This session's work

Resumed from the confirmed last saved item (Q49, page 190) and extracted the
remaining Round 8 reading items Q50–Q70 (21 items), appending each one
immediately to `topik1-master-basic-gapfill.jsonl` as it was transcribed.

### Round 8 reading page map (this session)
- Q49 (previously saved): page 190
- Q50–52: page 191
- Q53–56: pages 192–193
- Q57–58: page 193
- Q59–62: pages 194–195
- Q63–64: page 195 (email-format passage)
- Q65–68: pages 196–197
- Q69–70 (final questions of Round 8): page 197

### Round 9 boundary verification
- Page 198: blank divider page (confirmed visually).
- Page 199: Round 9 title/cover page ("제9회 실전 모의고사 / The 9th Final Actual
  Test").
- Cross-checked `topik1-master-basic-part2.jsonl`: Round 9's first item
  (Q1, listening) is recorded at `pageNumberInSource: 201`, consistent with
  198=divider, 199=title, 200=instructions, 201=Q1 start. No overlap, no gap.
  Extraction correctly stopped at Round 8 Q70 (page 197).

## Total items per round (final)
- Round 2: 70 — COMPLETE
- Round 3: 70 — COMPLETE
- Round 4: 70 — COMPLETE
- Round 5: 70 — COMPLETE
- Round 6: 70 — COMPLETE
- Round 7: 70 — COMPLETE
- Round 8: 70 — COMPLETE (Q1-49 from earlier pass + Q50-70 this session)
- Round 9, 10: complete in separate file (`topik1-master-basic-part2.jsonl`)

## Notes on methodology (carried over + this session)
- Listening items (1-30 per round): audio script not printed in book, only 4
  printed answer choices are visible on the page. correctAnswer recorded as
  null, passageOrScriptKorean as null, per established pattern.
- Reading items (31-70): passage + choices transcribed verbatim; correctAnswer
  determined via Korean reasoning where no printed answer key was visible.
  extractionConfidence "high" for all Q50-70 items this session; no illegible
  text encountered.
- Anomaly (this session): Round 8 Q66 — answer choices are printed in the
  source in the unusual order ①③②④ (not ①②③④); transcribed exactly as
  printed, flagged in the item's `notes` field. (Similar anomalies were
  previously documented for Round 7 Q57 and Q62.)
- Working PNG renders for this session stored in
  `reading/pages/page_190.png` through `page_199.png` (200dpi via PyMuPDF/fitz).

## Gap-fill file: DONE
All rounds this file is responsible for (2 through 8) are now fully extracted
and verified at 70/70. No further action needed on this file unless a new gap
is identified elsewhere.

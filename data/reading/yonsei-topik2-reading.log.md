# Yonsei TOPIK II Reading — extraction log

## Status (checkpoint, in progress)
- Total items in batch1.json: 205
- Last page fully processed: PDF page 118 (printed page 109)
- Next page to process: PDF page 119

## Question-type sections covered so far
- 유형06, 07, 08, 09, 10 — COMPLETE, all answers backfilled.
- 유형11 글 단위 간의 관계 추론하기 II (Q39-41, "find where the <보기> sentence fits" — passage has 4 marked positions ㉠㉡㉢㉣, choices are the position letters not content) — COMPLETE, all 5 연습 sets (연습1-5), all answers/explanations backfilled (pages 109-118).
- Next up: 유형12 (not yet seen — will appear with its own pill banner on PDF page ~119).

## Important structural/process notes for continuing
1. Each 유형 shows its numbered pill banner ("유형 NN 제목") only ONCE, on the first page of that type's content.
2. Answer keys ("정답 및 문제 풀이") are consolidated after ALL 연습 sets of a 유형 are presented (typically 5 연습 sets per 유형 so far), spanning several answer-key pages. Backfill correctAnswer/explanation into already-saved items by matching (pageNumberInSource, questionNumber) once the relevant answer-key page is found.
3. Book structure: 제1부 유형편 (Part 1, by-type; still in progress) then likely 제2부 실전편 (Part 2, full mock tests) later in the book — not yet reached.
4. pageNumberInSource in JSON = PDF page number = 0-indexed doc position + 1. Printed page numbers run roughly ~11 less than PDF page number in this range (e.g. PDF p.118 = printed p.109).
5. Item shape varies by 유형: most types have passage + 4 content choices. 유형11 is special — passage embeds 4 position markers (㉠㉡㉢㉣, transcribed as circled-hangul-jamo equivalents) and a separate <보기> sentence is given in questionTextKorean; the 4 choices are just the position labels.
6. Workflow: render PDF pages via fitz to `reading/pages/page_N.png` (dpi=200) in batches of ~10, Read each PNG, write a small one-off python script per page (or page-pair) that either appends new item(s) or updates existing items in place by (page, questionNumber) match, run immediately — one page's worth of DB writes per script run, saved to disk immediately every time.

## Next steps to resume
1. Render PDF pages 119-128 (0-indexed range(118,128)) via fitz to `reading/pages/`.
2. Read page 119 — expect a new 유형 banner (likely 유형12) starting a new question-type section. Extract its instruction block and first practice question(s).
3. Continue sequentially through remaining 유형 sections in 제1부, then into 제2부 실전편 (full mock tests, if present) through page 254.
4. Keep appending one item at a time (or updating existing items when answer keys appear), and update this log + total count periodically (e.g. every ~10-20 pages or when a session is likely to end).

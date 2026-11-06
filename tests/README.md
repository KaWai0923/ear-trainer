# Local regression tests (no git / publishing / browser automation)

Runtime remains plain static files; test dependencies belong outside the deploy folder.

Tested with Node 24.22.1, jsdom 31.0.0, node-web-audio-api 2.2.0:

```sh
npm install --prefix /tmp/soundcheck-test-deps jsdom@31.0.0 node-web-audio-api@2.2.0
NODE_PATH=/tmp/soundcheck-test-deps/node_modules node tests/batch2.cjs
```

This also runs all 11 batch-one regression groups and all 45 Sunny examples / 75 numeric checks. Results are written to `batch1-test-results.json` and `batch2-test-results.json`.

`batch2.cjs` tests cache budgets/reservations/leases, rejecting long audio BEFORE reading/decoding, synthesis chunks, scalar calibration caching/serialisation, context interrupted/resume/timeout, scoped versioned PWA install/failure/offline/ranges, complete precache assets, deterministic weak-area sampling, spaced reviews/Toronto DST/day boundaries/goals/rest, keyboard/ARIA/focus and selected contrast pairs, backup migration and reset. It also renders the actual app AudioWorklets with a real Node OfflineAudioContext, tests 36 EQ probes at each of 44.1/48 kHz, 15 compressor static cases and rough attack/release, and checks unchanged output against compact v1.6 DSP golden checkpoints.

Limitations: Node's Web Audio engine is not Chromium or Safari. DOM/canvas geometry and most UI AudioNodes are mocks; the PWA Cache API is a model, not a browser-installed worker. Contrast checks cover selected documented pairs, not a full WCAG certification. Physical iPhone/Android RAM, CPU, interruptions, Bluetooth, VoiceOver and installed-PWA storage eviction still require device tests. Existing PNG screenshots predate v1.7.

## v1.8 / Batch 3 — run all tests

`NODE_PATH=/path/to/node_modules node tests/batch3.cjs`

Includes batch1 and batch2, then verifies all six four-step scenarios (wrong-answer blocking, numerical tolerance, progression, no fabricated training scores), all six Moss lessons at 320/390/1440 mock DOM widths, formulas/TF/reference/coherence, Dante transport assumptions, quiz/calculator/answer draft persistence, explicit practice/return navigation, no autoplay, legacy backups/reset/unsafe data, pure idempotent manual merges and v1.8 offline assets. The fixture reads script order from index.html instead of duplicating the runtime module list.

New report: `batch3-test-results.json`. No Chromium, real layout or screenshots in this environment; device/PA/RF/network safety is NOT validated by these tests.

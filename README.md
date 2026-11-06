# Current release: v1.6 · Batch 1

Items 1–6 are implemented. No git actions or publishing. Static deployment still has no build step; upload the complete folder, including new `training-logic.js` and `batch1.js`. Changed asset references use `?v=1.6` to avoid mixing old cached UI scripts with this release.

- EQ wrong-sign / flat answers cannot pass; Level 2 also checks per-skill mastery. Legacy scores remain visible, but cannot falsely establish new EQ mastery.
- Ring-out has 31 live filter nodes; band controls, ±1 dB, clear and bypass change the current audition without a restart. Scoring reads the actual matched-filter math, or native `getFrequencyResponse` in compatibility mode. Tone-damage penalty is separate. Practice is untimed; Challenge speed counts only successful, bounded audition time.
- First Play preserves the question and controls. Session countdown starts only after successful playback; explicit pause and background pause are supported.
- Four labelled entry points, optional safety-gated A/B onboarding, and contextual return-to-lesson navigation.
- Compact mobile channel folds/jumps, sticky shared transport, scrollable graph background and 44 px node-only touch targets. Q uses the existing slider or Alt+wheel. Mobile ring-out uses band buttons plus ±1 dB instead of the long fader bank.
- Autosaved Teaching/Sunny form and calculator drafts, pending Training answers, Explore state/snapshots, and last view. No automatic playback after reload.
- Unified all-progress reset; versioned, validated JSON export/import with unsafe keys/ranges rejected. Imported audio and separately imported course JSON are deliberately NOT embedded; retain those original files. Local progress remains origin-specific until exported/imported.

## v1.6 verification status

`tests/batch1.cjs` runs 11 Node + jsdom regression groups, including all 45 Sunny formula fixtures / 75 numeric checks. Audio nodes/canvas are mocks: the suite verifies state, wiring, AudioParam updates, scoring and interaction handlers, NOT audible sound, real layout or phone CPU. Results: `batch1-test-results.json`.

Re-run without adding runtime dependencies to the app:

```sh
npm install --prefix /tmp/soundcheck-tests jsdom
NODE_PATH=/tmp/soundcheck-tests/node_modules node tests/batch1.cjs
```

No permitted browser/desktop automation tool was available for this batch. Chromium and fresh desktop/mobile screenshots were therefore NOT run/captured. Existing screenshot PNGs and earlier Chromium reports below predate v1.6; do not treat them as current validation. Browser acceptance still needed: desktop 1440 px and mobile 390/320 px, real node drag/scroll, audible live GEQ, iOS audio, console/network errors and fresh screenshots.

The earlier release notes below are historical.

---

# Soundcheck Lab · Live Sound 練耳室 v1

無 backend／build step。請用 HTTP(S) static server：例如喺呢個資料夾用 `python3 -m http.server 8000`，再開 `http://localhost:8000`。唔好用 file://（JSON fetch / AudioWorklet 需要正確 origin）；worklet 要 HTTPS 或 localhost。首次主動播放先啟動 Web Audio。呢個交付無 git 操作、無公開部署。

## 功能
- 繁中／廣東話 + English，手機 band buttons + 單一 cut 控制。
- 六個模組：Frequency ID、EQ、31-band feedback ring-out、Compression A/B、Comb/polarity、Vocal problems。
- 每個模組有 Learn / Practice / Challenge；Learn 顯示答案，Practice 提示，Challenge 隱藏提示直至交卷。Learn 不計進度。
- 5 / 10 分鐘 session；首次播放亦自動開始 session；到時停聲。
- 原聲、題目及使用者答案均可重播；交卷後可再改控制做實驗，但不重複計分。
- Pink noise 使用 Paul Kellet 7-state filter；合成人聲及鼓，沒有第三方音樂。可本機 decodeAudioData 載入 ≤80MB 音檔及選 loop。
- Compression A 係 light / fast，B 隨機 amount 同 attack/release；離線 render、共同固定 RMS target（不是 LUFS），不靠較響取勝。自動揀鼓來源，除非已選自己音檔。
- Comb 真正用 DelayNode + 正／負 gain。正常 polarity first null=1/(2Δt)；反相時 DC null，第一個非零 null=1/Δt。揭曉顯示 c=343 m/s 路徑差。
- Vocal：mud、boxy、nasal、harsh、sibilance、boom、no problem；問題 + 處理方法分開評分。
- localStorage 儲存模組平均分及弱頻段；最近 20 題 ≥80% 到 Level 2。Frequency/EQ/feedback 的中心頻率由 octave 加至 1/3-octave；其他模組保留同一組 v1 題型。

## 音訊安全
低預設音量、70ms 淡入、200ms 淡出、每段約 4 秒；大 Stop、頁面隱藏停聲並 suspend AudioContext。DynamicsCompressor 後再接有界 tanh waveshaper，提供最終數位 amplitude ceiling。無 microphone input、無真實 feedback loop。實體聲壓由你嘅裝置／耳機／音量決定；唔可以用呢個 limiter 保證聽力安全。

## v1 限制
- Vocal-ish 係諧波／formant／噪音合成，唔係真人說話。齒音處理答案回放用靜態 EQ 示意，唔係 dynamic de-esser；boom 用低頻 bell boost 示範。
- Compression 以線性 RMS 配對，唔係感知響度 LUFS 配對；極端高峰值素材可能觸發 master safety chain 而改變 envelope。合成鼓最適合 attack/release 練習。
- GEQ 評分係頻率／cut 深度近似模型，唔係量測房間；目標 −6dB 只係練習規則。自動化測試未能代替人耳主觀驗證。
- 音檔只喺記憶體，重新載入要再揀。進度限目前瀏覽器／origin，唔會跨裝置同步；file:// 儲存行為由瀏覽器決定。
- 已測 headless Linux Chromium，未喺實體 iPhone/Android、耳機／PA 測試。Web Audio、OfflineAudioContext、DynamicsCompressor 要現代瀏覽器支援。

## 驗證
`node --check app.js` 通過。
Headless Chromium 實測六模組 A/B/答案播放、Reveal、三種模式、390px mobile 無橫向溢出、本機 WAV 解碼／loop、localStorage 保留、正確答案 100%、20題升級、Stop／visibilitychange／session 到時停聲。冇 JavaScript pageerror／console error。RMS matching 有程式數值核對。結果在 `test-results.json`、`edge-test-results.json`；`mobile-screenshot.png` 係測試畫面。

## Real sample library (v1.1)

12 locally hosted, CC0 1.0 recordings; 44.1 kHz stereo MP3 at 128 kbps.
Serve the complete folder over HTTP(S) (fetching built-in MP3 files is not supported from file://).
Audio is decoded lazily, cached in memory; no user files leave the browser.
Each non-tone module has its own remembered-in-session picker and fitting default.
The original synthetic sources and local file importer remain available.

### Provenance

- `samples/female-sung.mp3` — owstu; CC0 1.0; https://freesound.org/people/owstu/sounds/508814/
  Short improvised notes, repeated. Trimmed/repeated, loudness normalized to -23 LUFS target, peak ceiling -3 dBTP, edge fades, 44.1 kHz MP3 128 kbps.
- `samples/male-sung.mp3` — Hajisounds; CC0 1.0; https://freesound.org/people/Hajisounds/sounds/679210/
  Processed sung F note: autotune, phasing and reverb; repeated. Not a dry vocal. Trimmed/repeated, loudness normalized to -23 LUFS target, peak ceiling -3 dBTP, edge fades, 44.1 kHz MP3 128 kbps.
- `samples/female-spoken.mp3` — pyro13djt; CC0 1.0; https://freesound.org/people/pyro13djt/sounds/367425/
  Welcome to Lazare Edits; phrase with pauses. Trimmed/repeated, loudness normalized to -23 LUFS target, peak ceiling -3 dBTP, edge fades, 44.1 kHz MP3 128 kbps.
- `samples/male-spoken.mp3` — germanio; CC0 1.0; https://freesound.org/people/germanio/sounds/369908/
  Audio signal processing for music applications; repeated. Trimmed/repeated, loudness normalized to -23 LUFS target, peak ceiling -3 dBTP, edge fades, 44.1 kHz MP3 128 kbps.
- `samples/kick.mp3` — Sound_Bar_KK; CC0 1.0; https://freesound.org/people/Sound_Bar_KK/sounds/685865/
  Acoustic kick one-shot repeated with a 0.75 s beat interval. Trimmed/repeated, loudness normalized to -23 LUFS target, peak ceiling -3 dBTP, edge fades, 44.1 kHz MP3 128 kbps.
- `samples/snare.mp3` — KEVOY; CC0 1.0; https://freesound.org/people/KEVOY/sounds/82249/
  DW custom shop snare one-shot repeated with a 0.75 s beat interval. Trimmed/repeated, loudness normalized to -23 LUFS target, peak ceiling -3 dBTP, edge fades, 44.1 kHz MP3 128 kbps.
- `samples/drum-kit.mp3` — esares; CC0 1.0; https://freesound.org/people/esares/sounds/431874/
  Acoustic drums performed by Pedro Galindo. Trimmed/repeated, loudness normalized to -23 LUFS target, peak ceiling -3 dBTP, edge fades, 44.1 kHz MP3 128 kbps.
- `samples/bass.mp3` — josefpres; CC0 1.0; https://freesound.org/people/josefpres/sounds/483131/
  Electric bass guitar phrase repeated. Trimmed/repeated, loudness normalized to -23 LUFS target, peak ceiling -3 dBTP, edge fades, 44.1 kHz MP3 128 kbps.
- `samples/acoustic-guitar.mp3` — deadrobotmusic; CC0 1.0; https://freesound.org/people/deadrobotmusic/sounds/628766/
  Strummed loop at 155 BPM. Trimmed/repeated, loudness normalized to -23 LUFS target, peak ceiling -3 dBTP, edge fades, 44.1 kHz MP3 128 kbps.
- `samples/electric-guitar.mp3` — loudernoises; CC0 1.0; https://freesound.org/people/loudernoises/sounds/453384/
  Gibson Les Paul Junior DI; strumming and arpeggiation. No effects. Trimmed/repeated, loudness normalized to -23 LUFS target, peak ceiling -3 dBTP, edge fades, 44.1 kHz MP3 128 kbps.
- `samples/piano.mp3` — amandajbono; CC0 1.0; https://freesound.org/people/amandajbono/sounds/146165/
  Improvised acoustic piano excerpt. Trimmed/repeated, loudness normalized to -23 LUFS target, peak ceiling -3 dBTP, edge fades, 44.1 kHz MP3 128 kbps.
- `samples/full-mix.mp3` — German OER Community (Jointly), 2017; CC0 1.0; https://jointly.info/oer-song/
  30–50 s excerpt of Share for Free; vocals and band. Credits: Annett Zobel, Britta Radig, Christian Rotzoll, Jan Rieger, Lia Orr, Matthias Hupfer, Petra Amasreiter, Philipp von Böselager, Stephan Clemenz, Steffen Hippeli, Tobias Westphal, Torsten Simon. Excerpt, normalized -23 LUFS target / -3 dBTP, fades, MP3 128 kbps.

Limitations: Freesound HQ previews are lossy originals for this build. Short phrases/hits are repeated to make training loops. Male singing is already processed (not dry); there are no long dry sung stems. Loop joins are faded but not guaranteed beat-perfect. Real iOS/device listening still required.

### Validation for sample update
Headless Google Chrome: all 12 MP3s fetched and decoded (nonzero RMS, 10–20 s), all six modules played original/question/answer, synthetic and local import paths passed, delayed fetch + STOP cancelled correctly. Zero console/page errors. No horizontal overflow for all five sample-based modules at widths 320, 390, 768, 1280. See `sample-test-results.json` and `samples-mobile-screenshot.png`. No real iOS or human listening validation performed.


## DSP channel-strip GUI update

New `dsp.js` must be deployed alongside app.js, samples.js, style.css and samples/.
No libraries, build step or external requests were added for DSP.

- EQ and Vocal exercises: responsive log-frequency 20 Hz–20 kHz / ±18 dB canvas, actual combined matched-filter response (shared worklet/graph math; native getFrequencyResponse in compatibility mode). Pointer/touch-drag frequency/gain; wheel or Q slider. EQ canvas is an answer input, synchronized with continuous numeric Hz/gain/Q controls. Practice/Challenge hide the correct curve until Reveal; Learn shows it. Correct curve is amber/dashed against green user curve. Vocal graph is the correction curve (not the problem boost); a custom EQ audition is optional. Vocal scoring remains problem category + treatment, not the custom curve.
- Feedback: 31 vertical cut faders, horizontally scrollable on phones, with combined response matching the existing Q=4.318 peaking-filter processing. Existing band buttons / selected-band control and reset are synchronized.
- DSP Sandbox: unscored, sample picker including real/synthetic/imported audio, 4-band PEQ, switchable 12 dB/oct HPF/LPF, compressor and 20-second playback. EQ and compressor parameter changes update the live audio path; enabling/disabling a pass filter stops audio for an intentional restart. Existing master volume/limiter/soft ceiling remain active.
- Compressor: threshold, ratio, knee, attack, release, makeup; soft-knee transfer illustration; actual live custom-worklet reduction meter (native node.reduction in fallback) and peak input/output dBFS meters, pre-master. Custom processing and transfer graph share the same quadratic gain computer; the native compatibility curve remains approximate and accounts for Blink-style hidden auto gain. Compression exercise hides all DSP detail until Reveal (or Learn) to avoid answer leakage. A/B remains RMS-matched via offline calibration followed by live compression; calibration gain is displayed separately from makeup. Revealed B settings can be tweaked; original A remains Light/Fast.
- Live spectrum is now available behind the EQ curve in Sandbox / Reveal / Learn; hidden before a scored question is revealed. Its independent display scale is −100 to −10 dBFS. Audio meters are signal meters, not physical SPL or hearing-safety measurements.

Validation: headless Chromium tested mouse dragging, touch dragging via CDP, Q slider, faders/reset, playback, live EQ gain and compressor threshold/ratio wiring, HPF topology, actual nonzero gain reduction, hidden-answer/reveal states. No console/page errors. No horizontal page overflow at 320/390/768/1280 px across all seven modules. Existing sample decoding/import/STOP-during-load tests also rerun. See `dsp-test-results.json`, `dsp-touch-test-results.json`, `sample-test-results.json` and `dsp-mobile-screenshot.png`. Real iPhone/Android audio and human listening were not tested.


### Plugin-style polish
Original **PRISM EQ** / **FORGE DYNAMICS** visual design (no third-party logos or copied skins): large dark EQ display, glowing curve, independently coloured band nodes, live AnalyserNode spectrum and on-drag Hz/dB tooltip. Compressor has a brushed dark chassis, six rotary knobs (vertical mouse/touch drag, fine slider, keyboard arrows, double-click/double-tap factory reset), luminous value windows, LED GR meter and IN/OUT meters with 1.5-second peak hold and decay. Spectrum uses smoothed data / 30fps display; meter and knob movements are animated.

Each processor has real bypass plus A/B setting snapshots and a copy-to-other-slot button. Sandbox bypass crossfades live dry/wet routes; EQ exercise bypass auditions the user's processing on replay, never changes the hidden question. Snapshot slots are local to the current module, not persistent saved presets. A/B changes pass-filter topology stop playback for restart, as do the corresponding HPF/LPF switches.

`plugin-test-results.json` verifies mouse rotary drag, double-click reset, mobile touch knob/graph drags, tooltip, EQ and compressor A/B recall/copy, actual dry/wet bypass gains, zero bypass GR, active spectrum, peak-hold readouts, hidden-question spectrum and mobile overflow. `plugin-desktop-screenshot.png` and `plugin-mobile-screenshot.png` show the updated design. Existing DSP and sample regression tests remain available.

## Teaching course (v1.3)

Separate **教學 Teaching** / **訓練 Training** top-level views. Teaching is a guided nine-lesson course, not the random-module Learn hints. New `lessons.js` and `teaching.js` must be deployed with the existing files.

Lessons: frequency/octaves and Sub-to-Air band auditions; dB/gain/safety; bell/shelves/HPF/LPF/Q; vocal problem areas/no-EQ decisions; compressor parameters/GR; live vocal/kick/snare/bass compression; comb/polarity/distance/time/3:1; feedback/GEQ-vs-PEQ/position first; CL/QL gain-structure reference targets.

Every lesson has Cantonese Traditional Chinese explanations with English terms, a diagram, real-sample A/B demos, guided preset steps, editable PRISM/FORGE GUIs, three quick-check questions with feedback, previous/next navigation and a matching-training shortcut. Lesson ticks are saved separately in `soundcheck-course-v1` localStorage only after all three checks are correct. Incorrect attempts can be retried; course progress never changes training scores.

Audio demos are click-to-play, 12 seconds with fades, common STOP / visibility safety handling and no file uploads. Frequency band chart auditions use actual HPF + LPF. EQ types include real low/high shelves (custom shelves have a fixed Butterworth shape; Q does not alter it). Compressor lessons initially RMS-match A/B before makeup using offline calibration, then run live compressor/meters; re-play after knob changes to re-match. Lesson Listen A/B (reference/processed) is distinct from the plugin's editable A/B setting snapshots. Comb uses an actual delay + polarity branch and a mathematically corresponding normalized response diagram. Feedback is a sine-plus-program simulation, not an acoustic loop; the position step deliberately reduces only the simulated sine component, not a claimed room/mic model. Gain-structure diagrams are reference targets, not a calibrated CL/QL simulation; app meters remain pre-master peak dBFS.

Technical scope: the de-esser discussion uses static EQ frequency examples, not a dynamic de-esser. 3:1 is a bleed-reduction placement heuristic, not a guarantee of phase alignment. −18 dBFS is not asserted to be a fixed CL/QL +4 dBu mapping. NIOSH safety guidance is linked in the dB lesson (85 dBA / 8 h, 3 dB exchange rate); neither the volume slider nor dBFS meters measure actual ear exposure.

QA: headless Chromium exercised all nine lessons' A/B and guided audio, all 27 quiz answers, persistence, wrong-answer retry, previous/next, training jump, actual shelf/delay/band-filter nodes, touch EQ drag and simulated ring-level change. No console/page errors. All nine lessons checked for horizontal overflow at 320/390/768/1280 px (36 checks, none). Existing DSP and sample/import regressions rerun. Results: `teaching-test-results.json`, `teaching-interaction-test-results.json`; screenshots: `teaching-desktop-screenshot.png`, `teaching-mobile-screenshot.png`. Real iOS/Android audio and human listening still require validation.


## v1.5 · Explore / custom DSP / Sunny 課程

### Complete selected channel
Prominent `自我探索 Explore` tab replaces the old free sandbox. No scoring. Licensed samples plus local file import; input trim/sample-clip LED → polarity → HPF/LPF (6/12/18/24 dB/oct) → hysteretic gate/2:1 expander with sample-accurate hold → four-band PEQ ↔ compressor (order switch) → dB fader −∞…+10 → constant-power pan → existing safety output. Individual bypass, full-strip A/B/copy, seven presets, mono/stereo-safe max-channel input/output peak meters and compressor peak holds. Desktop selected-channel layout, vertical mobile scroll. Topology/preset changes may safely restart playback; this is not seamless console scene recall.

Custom audio code: `dsp-core.js` (shared equations), `audio-worklets.js` (processors), `dsp-engine.js` (worklet/native adapters), `explore.js` (strip). Matched peaking and matched two-pole shelves follow Vicanek's published methods; optional proportional Q is an explicitly documented app choice, not emulation of a named product. Feed-forward compressor: log gain computer/quadratic knee, separate stereo detectors with max linking, peak or 20 ms power-RMS, branching or decoupled gain smoothing, optional program release and auto makeup, 2×/4× 16-tap FIR **detector-only** interpolation, 0–20 ms lookahead (default OFF). Audio itself is not oversampled; no certified true-peak claim. Attack/release are stage τ63.2%; 10→90 ≈2.197τ; detector/hold and program-dependent stages add timing. Gate attack/release smooth linear gain. Native fallback disables unsupported gate/proportional/advanced options; its knee/auto gain vary by browser.

### Accuracy, not a certification
See `accuracy-report.json` and `advanced-dsp-audit.json`. OfflineAudioContext periodic pink-noise FFT, 44.1/48 kHz, 20 Hz–20 kHz, combined linear strip: worst EQ-vs-graph error ≈0.0000052 dB (<0.001 dB), also compared independently to browser IIR getFrequencyResponse. Gate bypass/ratio1/unity fader; nonlinear safety limiter excluded. These are implementation-consistency tests, not proof of analog-model perfection at every parameter.

1 kHz steady compressor tests: peak static error <0.0001 dB; mono RMS ≤0.0081 dB; stereo quadrature RMS max-link ripple ≈0.0114 dB, so overall tested error **<0.02 dB**. Optional auto makeup and 2×/4× detector paths also measured. Default branching/peak: attack τ10/30 ms →63% at10.5/30.5 ms and10→90 at22/66 ms. Release τ100/200 ms →63% at106.5/206.5 ms including detector hold,10→90 at220/439 ms. Gate hold80 ms begins attenuation≈84.6 ms after step (includes detector decay); release20 ms reaches63% closed≈104.4 ms after step. Requested lookahead0/5/20 ms measures0/5/20 ms. Native old simplified curve could miss by12.90 dB because of its knee/auto gain; the corrected fallback model is still approximate (tested residual up to≈0.61 dB), never presented as custom precision.

Reproduce in an HTTP(S) browser: load `accuracy-audit.js` as a script after the app, then `await runSoundAudit()`. It is diagnostic-only, not loaded during normal app use. Headless Linux Chromium was tested; real iPhone/Android hardware, speaker output and subjective listening have not been certified.

### Sunny: source-bounded, data-driven lessons
`Sunny 課程` is separate from both Training and Teaching. Its **only curriculum source** is the supplied v2 JSON/Markdown, copied byte-for-byte to `sunny-data.json` and `sunny-source.md`. Lessons1.1/1.2/1.3/1.3b; all concepts,23 live formula cards with worked steps/assumptions,18 interactive diagrams,21 open-ended self-check questions with model answers, local self-assessed progress and previous/next. Source-success/unverified badges and all source limits/corrections remain separate and visible. App does not claim those sources were freshly rechecked.

Safe listening is muted on every entry, user-unmute plus a separate low volume slider, six-second fades and immediate zero-gain STOP, peak metering, licensed samples/local import. Purely digital comb/noise/reverb/clip/hum/harmonic demonstrations. No real feedback loop, electrical fault, PA-power or live-mains probing exercise. No dBFS↔dBu conversion, curved-array throw model, universal N–G pass threshold, neutral/bonding/feeder instructions or Ontario “three-hour80% law.” Crown XTi4002 table uses the supplied120V/60Hz mirror:1/3 at8/4/2Ω is10.5/18.9/26.9A; version uncertainty preserved.

Tiny source arithmetic discrepancy is **disclosed, not hidden**: source1.3b says17,293.18VA andPF.8→13.835kW; exact √3×208×48 is17,292.795VA andPF.8→13.834kW. Original source files/examples remain intact; live calculators use the correct exact formula. PF1 still rounds17.293kW.

Course loader: `sunny-courses.json` is a list of local JSON filenames. To add an approved lesson, drop its JSON beside the app and add its filename to this manifest (no renderer change), or use the local JSON file picker. Same schema; IDs must be unique. Known formula IDs reuse calculators; a genuinely new formula/diagram needs an approved math/visual renderer, never eval of course text. Nothing auto-syncs and no future curriculum has been invented.

Latest QA: `sunny-test-results.json` records all23 calculators,45 example cases,24 lesson panels,96 width/panel checks (320/390/768/1440),14 actual audio A/B demos, safe edge cases, progress and mode transitions; zero console/page errors. `explore-test-results.json`, `fallback-test-results.json` cover custom/native strip controls. Screenshots: `channel-strip-desktop.png`, `channel-strip-mobile.png`, `sunny-course-desktop.png`, `sunny-course-mobile.png` (plus full-page Sunny images). Existing Teaching/Training regression tests rerun. Screenshots/reports are delivery artifacts, not required runtime assets.

Deploy the entire runtime folder with its `samples/`, all JS/CSS, worklet/shared-core files, favicon and Sunny JSON/Markdown/manifest. Do not deploy diagnostic screenshots/reports if avoiding unnecessary downloads/storage; they are not referenced by the app except `accuracy-report.json`, which supplies the in-app accuracy note.

# Current release: v1.9.1 · Starting Point 真實 EQ curves

- 28張 Starting Point 卡片改用 plugin-style 20Hz–20kHz log grid／±18dB grid，繪出 HPF＋已提供 bell／shelf／LPF 嘅真實 biquad response：綠色加總、淡色單段、號碼節點及可展開文字設定。
- 共用 `SoundDSP.coeff`／`response`／`passSections`（Vicanek matched bell/shelves、RBJ pass filters）；48kHz reference。唔用頻率色帶冒充 EQ 曲線，超出 ±18dB 只裁圖，唔改計算值。
- 預設 Mid 算術中點；可切 Low／Mid／High。Low/High 係參數下限／上限組合，唔係逐頻率最小／最大 envelope。Slope 只用原稿離散端點，Mid 採較低端點，唔捏造15dB/oct；原稿冇 slope 嘅 LPF 明確略過。
- 參考曲線假設已提供 filters 啟用作比較，唔代表建議全套；切圖唔改音訊或 loader checkbox。原有安全 loader 仍全部預設旁通，手動揀值時圖會標明「已選值預覽」。原始 JSON／Markdown／核查紀錄保持不變；保留「音響工程課程」名稱。
- Mobile 採窄版座標／精簡 frequency labels；SVG title/desc、各節點數值、文字版本及 native keyboard buttons 支援 accessibility。
- 所有 runtime URLs、service-worker VERSION／precache 升至1.9.1。無 git、無發布。

## v1.9.1 QA

`NODE_PATH=/path/to/node_modules node tests/starting-eq.cjs` 會重跑全部 Batch1／2／3、FX、Starting Point suites，再驗證28卡×3種範圍、分段／加總 math、缺值處理、320/390/1440 DOM widths、controls／loader 無自動播放、來源原稿不變及 cache版本。

另外用真正 Node OfflineAudioContext，將 reference settings 送入 App 同一個 AudioWorklet filter chain，對20Hz–20kHz 做32頻點 DFT，比較繪圖 response；數值見 `starting-eq-test-results.json`／`v1.9.1-test-results.json`。DOM 測試係 jsdom，唔係實際 Chromium／Safari layout，冇新 screenshots／手機實測。舊版 browser reports 屬歷史資料。

---

## Previous release: v1.9 · Aux FX + Starting Point (historical notes)


## v1.9 新增

- **Explore Aux FX rack**：兩組 pre/post-fader aux sends、獨立濕聲 returns，dry 維持原 channel；所有 returns 仍入共同 fade／master limiter，global STOP／離頁切斷 tails。預設兩組 OFF、send −18 dB／return −12 dB；保留低實體音量。
- **SPACE reverb**：原創 generated stereo IR（hall／plate／room／chamber／spring／gated／reverse）、pre-delay、nominal RT60、size、diffusion、density、ER level／late balance、low/HF decay multipliers／crossovers、wet modulation depth/rate、stereo width、input HPF/LPF、return HPF/LPF＋250Hz/6kHz shelves、wet mix／return level。
- **ECHO delay**：獨立 L/R ms、tap tempo、quarter/eighth/sixteenth 與 dotted/triplet note sync、mono／stereo／ping-pong、feedback 硬限 94%、loop HPF/LPF、bounded tape saturation／wow/flutter、dry-key ducking／threshold/release、all-pass repeat diffusion。無 freeze／100% self-oscillation。
- 原創 plugin-style knobs（上下拖／double-click reset／keyboard／直接輸入）、decay／echo visuals、FX A/B、per-type factory presets、最多16個本機 user presets（可刪除），連同 Explore snapshots／JSON backup／merge／unified reset。所有 FX 參數都有 Cantonese expandable 功能、起點範圍、何時用及常見錯誤；原有 EQ／comp／gate／channel 主要控制亦加入逐項 help。
- **Moss effects lesson**：live vocal clarity／pre-delay、60000/BPM、dotted/triplet calculator、return EQ／aux tap。可跳 Explore，唔自動播放；清楚同「音響工程課程」原教材分開。未新增可選嘅 delay/decay ID scoring module。
- **Starting Point 起手參數**：第五個 top-level tab；28張 instrument/bus cards、搜尋／UI category、HPF、EQ table／小圖、comp／gate、tips、mistakes、分歧、原則 evidence badge／numeric editorial status 同 source links。三份原稿逐 byte 複製到 `starting-points/`，保留來源核查／排除紀錄，唔聲稱本次重新逐頁查證。
- **Load into Explore**：預設 flat／bypass；使用者自行揀 HPF 同最多4段 PEQ，圖按已選值即時預覽。只載 JSON 範圍內值；comp／gate 有提供嘅 timing／ratio 先取明示下限，仍保持 bypass。唔捏造 portable threshold、numeric knee、未提供嘅 LPF slope／sidechain filter；冇資料嘅欄位保留／手動校。唔自動開聲、唔將所有 EQ 一鍵套晒，唔係 console scene。
- 保留使用者改名 **「音響工程課程」**。SW VERSION／全部 runtime URLs／precache 同步 **1.9**，新 scripts／worker／lesson／三份參考檔全部離線 shell cached；無 git、無發布。

## FX 實作／安全界線

`fx-core.js` 為共用 delay DSP／IR model；`fx-worklet.js` 處理 stereo delay；`fx-ir-worker.js` 離主執行緒產生 IR。`modules/fx-engine.js` 處理 routing／returns；state／help／UI 分模組。原 EQ／compressor DSP 未改音訊數學。

IR 最長8秒，最高48kHz、stereo float32 約2.93MiB／份；一個 cache、最多兩個 crossfade Convolver，舊 inactive IR 釋放。Worker 最多一個 active＋一個合併待處理 request，唔讓拖動累積無限 IR jobs。Convolver FFT／browser resampling／暫存仍有額外 RAM；IR 係 sample PCM budget 之外，唔保證整個 browser RAM／手機 CPU。Worker 不可用會用16kHz IR fallback，會提示頻寬受限。改 IR shape 短 crossfade，唔係無縫 console recall。

Natural RT60 指 IR mid-band envelope；low/high multipliers、濾波、ER、8秒截尾會影響量到嘅值；gated/reverse 只係 envelope duration。Modulation 係 Convolver 後 wet delay LFO，唔係 time-varying IR。Spring／tape 等為原創 texture，唔聲稱 REV-X／Lexicon／H3000／Echoplex 或其他硬件 emulation。

AudioWorklet 不可用時，native delay 保留 routing／L-R timing／mono-stereo-pingpong／bounded feedback／loop filters；duck、saturation、wow/flutter、diffusion 明確停用。Native loop filters 為12dB/oct，custom 為一階，唔聲稱相同響應。每組 FX return 都有零 lookahead bounded soft ceiling，之後 dry／wet 共用原本 master dynamics limiter；唔額外喺 wet 路加 native compressor 嘅 lookahead latency；全部只管數碼輸出，唔係校準 SPL meter 或人耳安全保證。Aux mix 只縮放濕聲，唔重複混入 dry。

## v1.9 QA

執行 `NODE_PATH=/path/to/node_modules node tests/starting-points.cjs`：包括全部 Batch1／2／3、FX、Starting Point suites。報告：`v1.9-test-results.json`、`fx-test-results.json`、`starting-points-test-results.json`。測試依賴留喺 public folder 外面，無 build requirement。

實際 Node OfflineAudioContext 測 custom delay timing／native aux routing／Convolver；Schroeder fit 檢查 nominal RT60，並測94% feedback、overload、ducking、Stop／backup／preset／navigation／help coverage／28張卡同原稿一致。jsdom 測320／390／1440 DOM widths；**唔係 Chromium／Safari 實際 layout，冇新 screenshots／真機 CPU 或 acoustic 驗證**。部署前請真機核對 mobile overflow、VoiceOver、Safari interruptions 同 installed-PWA offline update。舊 screenshots／browser reports 都係歷史交付。

部署完整 static folder；cache version 變更會清理舊離線錄音，使用者確認更新後要重新下載選用 sample pack，再依賴離線播放。所有備份仍本機／手動 JSON，無 server/accounts。

---

## Previous release: v1.8 · Batch 3 (historical notes)


## 新增（Moss 編寫，非 Sunny 教材）
- **現場 Lab**：入口有獨立顯眼按鈕，亦可由 Teaching sidebar 進入；沿用 Teaching tab，唔混入 Sunny 原教材。
- **6 個四步情境**：vocal/wedge、kick/bass、speech/fill alignment、speech dynamics、Dante 無聲、wireless dropout。先決策／計算，再跳到現有 Training／Explore，保留確切返回位置。Kick gate／Speech strip 有選做 checkpoint，讀取真正儲存嘅 DSP 參數（唔冒充聽感評分）。錯誤答案唔開下一步，容許重試；冇速度扣分、唔冒充真場能力認證。
- **6 課新概念**：fill arrival delay、TF magnitude/phase/coherence、Dante、Canada/ISED-aware RF workflow、monitor mix、hearing/exposure。12 題 quick checks、來源連結、calculator／紙上模型、進度 ticks 同草稿。TF 圖係解析模型，唔係咪量度；reference delay 唔會改聲音。
- **安全**：冇 microphone、真 feedback、實體 Dante／RF 控制、SPL-meter 或聽力診斷聲稱。NIOSH 85 dBA/8h/3 dB 只係手動假設 exposure 示範，唔係 Ontario 法例、個人安全保證或安全倒數；無自動播放，原本低音量、limiter、STOP 保持。RF 唔提供通用合法 MHz／power 表，必須核對最新 ISED、設備核准、牌照／條件同場地 coordination。
- **選用手動跨裝置同步**：既有 JSON export/import 保留；新增預覽＋合併／取代。訓練題去重，完成 ticks 聯集，每日 counts 取較大值（可能少計，唔盲目相加），review 取較低 stage／同 stage 較早到期；草稿／整組 DSP snapshot 衝突可揀此機或匯入。A/B 非衝突 slots 保留。無 server、account、背景寫檔或加密；Safari/iOS 用下載／Files，支援嘅 desktop browser 可主動另存選定檔案。備份含進度／草稿，請保管私人檔案，音檔不包含在內。
- Backup schema 仍為 1，新 Moss store 屬 optional extension；v1.6／1.7 備份可讀入，reset 包括新資料。v1.8 檔未必可回灌舊 App，兩邊請先升級。
- `moss-course.json` 為內容來源；`modules/moss-model.js` 為純模型／store，`moss-course.js` 為 view／navigation，`progress-sync.js` 為手動合併／檔案 UI。Sunny JSON／Markdown 保持不變。

## v1.8 QA / deployment

執行 `NODE_PATH=/path/to/node_modules node tests/batch3.cjs` 會跑 **全部 Batch 1、2、3 suites**（包括 Sunny 45 examples／75 numeric assertions、實際 Node OfflineAudioContext AudioWorklets 數值測試）。結果：`batch3-test-results.json`，另保留 batch1／batch2 報告。測試依賴放喺 public folder 以外，無 build requirement。

本次係 Node/jsdom（320／390／1440 DOM widths）同 Cache API model；**唔係 Chromium／Safari render 或真機測試，冇新 screenshots**。呢個環境冇可用嘅獲准 browser automation surface。舊 screenshots／舊 browser reports 只係歷史交付，唔係 v1.8 畫面驗證。部署前請真機核對 mobile overflow、VoiceOver、Safari audio interruption 同 installed-PWA offline reload。

部署整個 static folder（無 git／無發布操作）；所有 runtime query、SW、precache 同步升至 1.8。使用者確認套用 update 後 Stop／reload；舊 sample cache 會清理，要重新下載選用錄音包先依賴 offline audio。新 Moss JSON／scripts 已加入 shell cache。

---

## Previous release: v1.7 · Batch 2 (historical notes)


Audit items 7–12 implemented. Still plain static files: no build step, no git, no publishing. Deploy the complete folder including `modules/`, `icons/`, `manifest.webmanifest`, `sw.js`, `precache.json`, and `synthetic-worker.js`. Serve HTTPS (or localhost for development), from the folder's trailing-slash URL.

## Changes

- **PCM/RAM:** 32 MiB retained PCM budget with LRU eviction, in-flight reservations and playing-buffer leases. Built-in samples are lazy-decoded; synthetic sources are generated only when chosen, in a Worker (cooperative chunks if Worker is unavailable). User import checks metadata BEFORE reading/decoding: ≤12 MiB compressed, ≤60 s, mono/stereo, ≤24 MiB estimated/decoded PCM. Longer files must be locally trimmed first; this release does not stream whole songs. High sample rates reduce accepted duration. Temporary decoder/OfflineAudioContext memory is additional; this is not a total browser-heap guarantee.
- **CPU:** reuse analyser arrays; visible/playing-only plugin drawing, 8 fps reduced-motion meters, idle checks without repainting, serialised/cached scalar RMS calibration. Detector/envelope constants are cached without changing DSP samples (golden max difference 0). No phone CPU benchmark is claimed. If realtime worklets work but offline worklets do not, scalar RMS matching uses the identical custom compressor math in cooperative chunks; it does not silently mark the realtime engine as native.
- **iOS recovery:** statechange UI for suspended/interrupted/closed, bounded resume timeout, prominent explicit Resume and safe Rebuild; no automatic playback or gain increase. Page return stays silent. Stop invalidates pending Sunny auditions too, and PCM leases are released even if a closed context rejects gain automation. Physical iPhone/call/Bluetooth tests are still needed.
- **PWA:** installable manifest/icons, scoped versioned service worker, complete versioned app-shell/course cache, explicit download/removal of all 12 MP3s (~2.69 MiB), byte-range support, update check and user-approved save/Stop/reload. Initial shell install fails cleanly if incomplete; other sites' caches are untouched. Sunny's course manifest is network-first and prefetches its JSON files, preserving JSON-only course additions; offline falls back to cached material. Browser storage can still be evicted: JSON progress backups remain important. A new cache version clears old-version recordings; re-download the optional sample pack after an update before relying on offline audio.
- **Adaptive practice:** per-module recent weak-band weighting with 25% uniform exploration; missed vocal/compression/comb targets are revisited. Due review targets can be launched directly; buttons do not reveal the answer frequency. Existing local stats are used; this is not a diagnostic hearing test or a guarantee a particular headphone/sample reproduces every frequency.
- **Accessibility:** actual keyboard tabs/ARIA-selected/controlled hidden panels, lesson/module focus restoration, numeric EQ alternatives, expanded rotary keys (Home/End/PageUp/PageDown), Alt+wheel only, Escape Stop, skip link, clearer text/LED states and reduced-motion CSS. Selected contrast pairs pass 4.5:1; no blanket WCAG/VoiceOver certification.
- **Retention:** 3/5/10-question goals, Toronto calendar/DST, private daily counts, clearly labelled healthy-habit streak (rest days count but do not impersonate practice), and missed-target review at 15 min / 1 / 3 / 7 / 14 / 30 days. No reward for louder/longer listening or competitive leaderboard.
- **Modules/tests:** `modules/events.js` provides explicit render hooks instead of reassigning view functions. Resource, lifecycle, offline-render, visuals, learning, persistence, UI and offline services are separate classic-script modules; no framework/build dependency. Backup schema remains version 1, accepts v1.6 backups and includes the new learning state. Unified reset includes goals/streak/reviews. Audio files/imported course originals are not embedded in backups.

## Verification

Run `tests/batch2.cjs` as documented in `tests/README.md`; results: `batch2-test-results.json`. It runs the 11 v1.6 regression groups (including Sunny's 45 examples / 75 numeric checks), plus batch-two tests. Actual custom AudioWorklets are rendered through **node-web-audio-api OfflineAudioContext**, not mocked for the DSP numerical tests. UI tests use jsdom, and service-worker tests use a Cache API model. Numerical figures are recorded in the report; no browser/device performance claim is made.

No fresh Chromium/Safari browser run or new screenshots in this environment. Existing screenshots/older browser reports are historical, not v1.7 layout validation. Keep low physical volume, output limiter and immediate Stop; offline support does not imply calibrated SPL or safe PA operation.

For future code releases, increment the SW/cache version, all script/worker version references and `precache.json` together; do not call `skipWaiting` automatically. Test cached offline reload and update acceptance. Keep test dependencies outside the public folder. New Sunny JSON remains subject to its existing schema/calculator/safety boundaries.

Earlier release notes below are historical.

---

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

# Soundcheck Lab · Live Sound 練耳室 v1

開 `index.html` 即可使用，無 backend、無依賴、無 build step。首次按播放先啟動 Web Audio。手機若檔案管理員唔容許 HTML 音訊，將整個資料夾放到你自己選擇嘅普通 static host，或本機用 `python3 -m http.server 8000` 測試。呢個交付並無公開部署。

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

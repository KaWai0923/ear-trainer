# Live Mixing 起手參考：聽到問題先動手

研究日期：2026-11-06（America/Toronto）。對象：Ka Wai，GTA live FOH／Yamaha CL/QL／DiGiCo。

> 重要：全部卡片數字係 **編者綜合建議**，唔係聲稱某專家嘅完整 preset；引用來源支持原則／聆聽頻段，唔代表背書每個 Q、gain 或毫秒。先 flat、先聽，唔好加晒所有 band。

## 研究方法

- 打開原文網頁／PDF，查核相關段落，而非只憑 search snippets；source findings 保留專家實際講法，同卡片綜合範圍分開。
- 每張卡列多來源，但部分第二來源只支持 mic placement／live safety／一般 dynamics，唔代表兩位專家逐一背書每個數字。
- 所有卡片數值（包括 Q、gain、HPF slope、attack/release range）一律標 editorial_synthesis；只有 source_findings 內明列嘅數字先係來源直接例子。
- 唔捏造不存在嘅專家設定；非公開書籍／付費課冇讀到就唔引用，亦唔假借 Dave Rat／Big Mick 等人背書。
- 選材以穩健低 GR 同 live GBF 為先；錄音室經驗只轉用原則，不直接複製 makeup／room-heavy 壓法。

## 點樣用

- 所有 EQ bands 及 HPF 默认 disabled，先 flat 聽 source；唔好一鍵加晒卡片所有 cut/boost。
- 數字係搜尋／調整區間：揀一個 frequency／Q 試，而唔係對成個範圍全部 cut。gain 範圍係有需要時可試嘅量，0 dB/bypass 永遠有效。
- q 只適用 bell；shelf/LPF 的 q=null；無通用固定 feedback notch frequency。
- comp 原則上先 bypass；先校 gain 及 fader balance，再視需要用 GR 調 threshold。mode=optional 亦唔代表自動啟用。
- target_gr_db 表示較大聲有效段嘅典型 peak GR，不是全程平均值，更唔係安全 limiter 目標。
- range_db 是 gate/expander 關閉時衰減正數；不是 compressor ratio。

## Live／monitor 注意

- 先安排 mic／speaker 位置、正確 polar null、stage volume、system EQ 同 headroom。channel EQ 無法救錯誤 coverage／太遠距離。
- 壓縮本身唔係 feedback 必然來源；問題多係 makeup、提高 fader／平均增益、spill。唔用 compressor 當 feedback suppressor。
- wedge 路徑要獨立判斷：FOH comp／EQ 未必適合 monitor，亦要 check aux tap pre/post-EQ/dynamics/fader。pre-fader 不等於 pre-dynamics。
- CL/QL／DiGiCo 可 split input 但可能共享 head amp；保護 monitor gain、check trim／gain compensation，唔隨意改 shared preamp。
- 唔好將 monitor 輸出 EQ 當 channel 音色 EQ；先調系統，再細修聲源。反饋點隨咪位／人數／場地變，不預載通用 notch。
- 測試低音量起步；唔刻意製造持續 loud feedback，唔以耳朵近距離查找；足夠 loudness 就停，保留 show headroom。
- 先停／mute 再插拔可能有 pop 嘅線／phantom；保護人耳同 PA。

## Console 對照

- 用 GR meter 而非抄 threshold dBFS；preamp、detector calibration、峰值/RMS、comp model 都影響結果。
- soft/medium/hard 係聽感選擇，唔宣稱 Yamaha 數字 knee 同 DiGiCo 某 dB knee 等價；按實際 console manual 對照。
- 相同 attack/release 毫秒未必同聲：envelope/detector/time-constant 定義不同。Yamaha gate Decay 可對照 release 用途，但要聽。
- 唔用 Q=1／slope 等同保證跨 desk 響應一致；特殊 shelf／dynamic EQ 更要現場確認。
- 本稿未製作／驗證 Yamaha 或 DiGiCo scene preset，亦唔宣稱廠方認證。

## 行家唔一致嘅地方

- **Vocal compression speed／amount**：SOS 建議約10 ms、50–100 ms、≤約5 dB peak GR；Yamaha 舊 live 教材建議最快 attack、約40 ms release、可到10 dB。係目的／時代／聲源／模型有差，唔係一個必然啱。呢份卡片揀較保守 GR，保留 transient 同 monitor 穩定性。 [Vocal Production](https://www.soundonsound.com/techniques/vocal-production) [For Audio Techs: Compression](https://www.yamaha.com/worship/troomdetails.html?CNTID=63653&CTID=560645&TROOM_ID=58934)
- **Drum fast attack 定 slow attack**：控制不均勻 peaks 可用快 attack；保留 stick/punch 可用慢 attack，Yamaha 例子到50–70 ms／300 ms。卡片較中庸；唔將 fast attack 一律叫更 punch。 [Drum Compression](https://www.soundonsound.com/techniques/drum-compression) [For Audio Techs: Compression](https://www.yamaha.com/worship/troomdetails.html?CNTID=63653&CTID=560645&TROOM_ID=58934)
- **Bass HPF／kick-bass 分工**：BTM 某 mix bass HPF60 Hz、kick50 Hz；SOS mixing 文章亦提 domestic playback 可刪50 Hz 以下。live full-range、5-string low B唔可照抄；按演奏音域／PA 選25–40 Hz起步，必要才提高。 [The Foundation of the Perfect Mix](https://www.behindthemixer.com/foundation-perfect-mix/) [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials) [Session Notes: Selwyn Jazz Part 2](https://www.soundonsound.com/techniques/session-notes-selwyn-jazz-part-2)
- **Snare-bottom HPF／gate**：好多習慣會刪 bottom body 或 gate 全鼓；Jon Burton 特別保留有用 bottom body、很少 gate top。呢份默認 top 不 gate、bottom optional。 [Engineering Drums Live: Part Two](https://www.soundonsound.com/techniques/engineering-drums-live-part-two) [How to Use a Noise Gate](https://hub.yamaha.com/proaudio/pa-how-to/tools-of-the-trade-how-to-use-a-gate/)
- **EQ chart 與 source-first**：頻率表幫你聽／搵問題，唔係要求每個 band 都處理。良好 source/placement 可能完全唔需要 EQ/comp。 [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials) [Recording Brass & Reeds](https://www.soundonsound.com/techniques/recording-brass-reeds) [How to mic violin](https://www.dpamicrophones.com/mic-university/how-to-mic/how-to-mic-a-violin/) [How to mic piano](https://www.dpamicrophones.com/mic-university/how-to-mic/how-to-mic-a-piano/)
- **Choir 壓縮／monitor**：studio vocal 壓法唔可以原封不動用落 distant choir；live 優先 mic geometry、少開咪、唔送 distant choir mics 返 wedges。 [Of Mics and Monitors: Live Sound Reinforcement Tips for Choirs](https://www.shure.com/pt-br/insights/of-mics-and-monitors-live-sound-reinforcement-tips-for-choirs) [How to Use a Compressor](https://hub.yamaha.com/proaudio/livesound/tools-of-the-trade-how-to-use-a-compressor/) [Vocal Production](https://www.soundonsound.com/techniques/vocal-production)

## 快速索引

- [男 lead vocal（按實際音域，唔按性別硬套）](#lead_vocal_male)
- [女 lead vocal（按實際音域，唔按性別硬套）](#lead_vocal_female)
- [Backing vocal](#backing_vocal)
- [Speech／MC handheld、headset、lectern](#speech_mc)
- [Kick in／boundary](#kick_in)
- [Kick out](#kick_out)
- [Snare top](#snare_top)
- [Snare bottom](#snare_bottom)
- [Rack tom](#rack_tom)
- [Floor tom](#floor_tom)
- [Hi-hat](#hihat)
- [Overheads](#overheads)
- [Ride spot](#ride)
- [Bass DI](#bass_di)
- [Bass amp mic](#bass_amp)
- [Electric guitar amp](#electric_guitar_amp)
- [Acoustic guitar DI](#acoustic_guitar_di)
- [Acoustic guitar mic](#acoustic_guitar_mic)
- [Acoustic piano mic](#piano_acoustic)
- [Keys／digital piano patch](#keys_piano_patch)
- [Synth pad／lead（非 bass patch）](#synth_pad_lead)
- [Brass／horns：trumpet、trombone](#brass_horns)
- [Saxophone](#sax)
- [Violin／高音弦樂](#violin)
- [Cello／低音弦樂](#cello)
- [Choir／遠距離合唱咪](#choir)
- [Drum bus／group](#drum_bus)
- [Vocal bus／group](#vocal_bus)

<a id="lead_vocal_male"></a>
## 男 lead vocal（按實際音域，唔按性別硬套）

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：70–120 Hz；slope 12–18 dB/oct。低音歌手可更低；近講、plosive 同 stage rumble 可能要更高。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 180–400 Hz | 1–2 | -4–-1 dB | 只喺近講 proximity／混濁時削；唔好連胸腔都削走。 |
| bell | 800–1500 Hz | 1.5–3 | -3–-1 dB | 鼻音／honk 按人聲實際位置搵。 |
| bell | 2000–4000 Hz | 0.7–1.4 | 0–2 dB | 清晰度不足先微加；已尖則改用動態削。 |
| bell | 5000–9000 Hz | 2–4 | -4–-1 dB | sibilance：優先 de-esser，唔係固定切死所有高音。 |
| high_shelf | 8000–12000 Hz | — | 0–2 dB | air shelf；只喺 GBF 有餘裕時。 |

### Compressor

- 使用：optional；Ratio 2–4:1；Attack 5–20 ms；Release 50–150 ms。
- Knee：soft–medium；Target peak GR：2–5 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- 先要求穩定咪距離，ride fader；comp 唔能夠將背離咪頭嘅音色救返。
- FOH 可以 moderate comp，wedge monitor 宜更少或 bypass；用 split channel 才能獨立處理。

### 常見錯誤

- 將 100 Hz 當所有男人聲最低界線。
- 為爭清楚大幅加 3 kHz，連 harshness 同 feedback 一齊加。

### 來源與支持範圍

- [Vocal Production](https://www.soundonsound.com/techniques/vocal-production) — studio/mixing principles; adapted cautiously for live use。Published vocal example: ratio 2–4:1, attack around 10 ms, release 50–100 ms, no more than about 5 dB peak GR for a natural result.
- [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials) — studio/mixing principles; adapted cautiously for live use。Voice: boxy 200–400 Hz, nasal 800–1500 Hz, penetrating 2–4 kHz, airy 7–12 kHz.
- [How to Use a Compressor](https://hub.yamaha.com/proaudio/livesound/tools-of-the-trade-how-to-use-a-compressor/) — live sound。Use compression only as needed live; monitor processing can affect the singer’s performance and excessive compression/makeup can reduce practical GBF.
- [For Audio Techs: Compression](https://www.yamaha.com/worship/troomdetails.html?CNTID=63653&CTID=560645&TROOM_ID=58934) — live sound。A contrasting live teaching recipe: lead 2:1 / backing 3–4:1, fastest attack, around 40 ms release, potentially 1–10 dB GR; drums 4:1, 50–70 ms attack, around 300 ms release.

<a id="lead_vocal_female"></a>
## 女 lead vocal（按實際音域，唔按性別硬套）

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：90–160 Hz；slope 12–18 dB/oct。低音域／較厚聲線用較低端；高 HPF 唔等於更專業。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 180–400 Hz | 1–2 | -4–-1 dB | 只喺近講 proximity／混濁時削；唔好連胸腔都削走。 |
| bell | 800–1500 Hz | 1.5–3 | -3–-1 dB | 鼻音／honk 按人聲實際位置搵。 |
| bell | 2000–4000 Hz | 0.7–1.4 | 0–2 dB | 清晰度不足先微加；已尖則改用動態削。 |
| bell | 5000–9000 Hz | 2–4 | -4–-1 dB | sibilance：優先 de-esser，唔係固定切死所有高音。 |
| high_shelf | 8000–12000 Hz | — | 0–2 dB | air shelf；只喺 GBF 有餘裕時。 |

### Compressor

- 使用：optional；Ratio 2–4:1；Attack 5–20 ms；Release 50–150 ms。
- Knee：soft–medium；Target peak GR：2–5 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- 同一套 listening bands 同男聲大幅重疊；聽共鳴／咬字先。
- 尖聲可先減樂器 2–4 kHz masking，或局部 dynamic EQ，唔好硬壓全頻。

### 常見錯誤

- 單憑 female label 過度 HPF 或加 air。
- de-ess 過量令粵語齒音／咬字變含糊。

### 來源與支持範圍

- [Vocal Production](https://www.soundonsound.com/techniques/vocal-production) — studio/mixing principles; adapted cautiously for live use。Published vocal example: ratio 2–4:1, attack around 10 ms, release 50–100 ms, no more than about 5 dB peak GR for a natural result.
- [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials) — studio/mixing principles; adapted cautiously for live use。Voice: boxy 200–400 Hz, nasal 800–1500 Hz, penetrating 2–4 kHz, airy 7–12 kHz.
- [How to Use a Compressor](https://hub.yamaha.com/proaudio/livesound/tools-of-the-trade-how-to-use-a-compressor/) — live sound。Use compression only as needed live; monitor processing can affect the singer’s performance and excessive compression/makeup can reduce practical GBF.
- [For Audio Techs: Compression](https://www.yamaha.com/worship/troomdetails.html?CNTID=63653&CTID=560645&TROOM_ID=58934) — live sound。A contrasting live teaching recipe: lead 2:1 / backing 3–4:1, fastest attack, around 40 ms release, potentially 1–10 dB GR; drums 4:1, 50–70 ms attack, around 300 ms release.

<a id="backing_vocal"></a>
## Backing vocal

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：100–180 Hz；slope 12–18 dB/oct。升到開始削薄主體，再退少少；按實際最低音／mic／舞台 rumble 調整。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 200–400 Hz | 1–2 | -4–-1 dB | 清低中頻堆積。 |
| bell | 2000–4000 Hz | 0.7–1.5 | -3–0 dB | 如要讓 lead 前啲，可輕讓 presence，唔係一定要 cut。 |
| high_shelf | 6000–10000 Hz | — | 0–2 dB | 輕 air shelf；先控制齒音。 |

### Compressor

- 使用：optional；Ratio 2–4:1；Attack 5–20 ms；Release 70–180 ms。
- Knee：soft–medium；Target peak GR：2–5 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：optional_expander；默認 off。
- Attack 3–10 ms；Hold 100–250 ms；Release/Decay 150–350 ms；最大關閉衰減 6–12 dB。
- Downward expander ratio：1.3–2:1。
- Threshold：由低開始，確保最細力有效音符／ghost notes 都開到；再試全 band spill。若無可靠分界就 bypass，唔硬 gate。
- Key：按 source/spill 決定；key listen 聽清楚，唔用通用固定值。

### 起手聽法

- 人多先 balance 及 ride bus；chorus 同輕聲入口要試。
- Yamaha 提過 10–15 dB vocal gate attenuation；呢度更保守，默認 off。

### 常見錯誤

- 硬 gate 吞掉第一個字尾音。
- 某一位大聲歌手拉低成個 vocal bus。

### 來源與支持範圍

- [Vocal Production](https://www.soundonsound.com/techniques/vocal-production) — studio/mixing principles; adapted cautiously for live use。Published vocal example: ratio 2–4:1, attack around 10 ms, release 50–100 ms, no more than about 5 dB peak GR for a natural result.
- [How to Use a Noise Gate](https://hub.yamaha.com/proaudio/pa-how-to/tools-of-the-trade-how-to-use-a-gate/) — live sound。Drums need fast opening, lower toms longer decay. Backing vocal gating can use slower opening and only 10–15 dB attenuation.
- [Pro Tools: Bus & Group Compression](https://www.soundonsound.com/node/4923363) — studio/mixing principles; adapted cautiously for live use。Bus compression creates interdependence between sources; backing-vocal bus can blend a stack, independent channel compressors control individual singers. Stereo linking changes image behaviour.
- [For Audio Techs: Compression](https://www.yamaha.com/worship/troomdetails.html?CNTID=63653&CTID=560645&TROOM_ID=58934) — live sound。A contrasting live teaching recipe: lead 2:1 / backing 3–4:1, fastest attack, around 40 ms release, potentially 1–10 dB GR; drums 4:1, 50–70 ms attack, around 300 ms release.

<a id="speech_mc"></a>
## Speech／MC handheld、headset、lectern

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：90–160 Hz；slope 12–18 dB/oct。手持近講同 lectern 要分開聽；低男聲保留 body，wind 用防風先。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 180–400 Hz | 1–2 | -4–-1 dB | chest boom／低中頻遮字。 |
| bell | 800–1500 Hz | 1.5–3 | -3–-1 dB | 鼻塞聲。 |
| bell | 2000–4000 Hz | 0.7–1.5 | 0–2 dB | 咬字／intelligibility，唔用 boost 對抗反射。 |

### Compressor

- 使用：optional；Ratio 2–3:1；Attack 5–15 ms；Release 80–180 ms。
- Knee：soft–medium；Target peak GR：1–4 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- 距離同 head placement 比 preset 重要；訪問多人可用適合嘅 automixer，唔係硬 gate。
- Shure speech 系統例子 125 Hz/6 dB/oct 係另一種輕濾波，不應同 18 dB/oct 當等效。

### 常見錯誤

- MC 突然大叫後 compressor 補 gain 過量。
- 直接套錄音廣播重壓到 wedge／lectern 現場。

### 來源與支持範圍

- [Selection and Operation of Audio Signal Processors](https://content-files.shure.com/Pubs/asp-selection-and-operation-of-audio-signal-processors/us_pro_audiosignalprocessor_ea.pdf) — Shure sound-reinforcement educational publication。Speech-intelligibility example: 125 Hz low cut, 6 dB/oct; publication also gives a 4 kHz high cut. This narrow-band system example is not automatically adopted for modern full-range MC sound.
- [How to Use a Compressor](https://hub.yamaha.com/proaudio/livesound/tools-of-the-trade-how-to-use-a-compressor/) — live sound。Use compression only as needed live; monitor processing can affect the singer’s performance and excessive compression/makeup can reduce practical GBF.
- [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials) — studio/mixing principles; adapted cautiously for live use。Voice: boxy 200–400 Hz, nasal 800–1500 Hz, penetrating 2–4 kHz, airy 7–12 kHz.

<a id="kick_in"></a>
## Kick in／boundary

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：25–40 Hz；slope 12–18 dB/oct。只刪無用 sub；PA 無足夠 LF 唔好補 boost 硬推。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 50–90 Hz | 0.7–1.4 | 0–3 dB | 需要先加 weight，跟鼓 tuning 同 PA。 |
| bell | 200–400 Hz | 1–2 | -6–-2 dB | box／cardboard。 |
| bell | 2000–5000 Hz | 0.7–1.8 | 0–3 dB | beater click；本身尖則 cut 而非 boost。 |

### Compressor

- 使用：optional；Ratio 3–5:1；Attack 10–30 ms；Release 60–150 ms。
- Knee：medium–hard；Target peak GR：2–5 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：optional_gate；默認 off。
- Attack 0.1–1 ms；Hold 30–80 ms；Release/Decay 80–180 ms；最大關閉衰減 15–25 dB。
- Threshold：由低開始，確保最細力有效音符／ghost notes 都開到；再試全 band spill。若無可靠分界就 bypass，唔硬 gate。
- Key：可試 beater attack 頻段作 key；唔一定以 fundamental key。

### 起手聽法

- 先同 kick out 及 bass 一齊 check polarity／arrival time；延遲唔係一律要加。
- 想 smooth peak 可以更快 attack；想保留 punch 先試慢啲，唔將兩個目的混為一談。

### 常見錯誤

- 以 channel comp 代替正確喇叭 limiter。
- 低閾值重壓加 makeup 引入 cymbal／stage spill。

### 來源與支持範圍

- [Engineering Drums Live: Part Two](https://www.soundonsound.com/techniques/engineering-drums-live-part-two) — live sound。Jon Burton: external kick low-mid cut 200–400 Hz, optional click 2–5 kHz; rarely adds bass to external mic.
- [Drum Compression](https://www.soundonsound.com/techniques/drum-compression) — studio/mixing principles; adapted cautiously for live use。One consistency-control example uses 5:1, fast attack, medium release and up to 4–5 dB GR; attack/release changes can instead shape punch.
- [How to Use a Noise Gate](https://hub.yamaha.com/proaudio/pa-how-to/tools-of-the-trade-how-to-use-a-gate/) — live sound。Drums need fast opening, lower toms longer decay. Backing vocal gating can use slower opening and only 10–15 dB attenuation.

<a id="kick_out"></a>
## Kick out

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：25–40 Hz；slope 12–18 dB/oct。升到開始削薄主體，再退少少；按實際最低音／mic／舞台 rumble 調整。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 50–100 Hz | 0.7–1.4 | 0–2 dB | body；Jon Burton 通常唔加外咪低頻，呢項只係備選。 |
| bell | 200–400 Hz | 1–2 | -6–-2 dB | 低中頻箱聲。 |
| bell | 2000–5000 Hz | 1–2 | 0–2 dB | 缺 beater 先少量補。 |

### Compressor

- 使用：optional；Ratio 2–4:1；Attack 15–40 ms；Release 80–200 ms。
- Knee：soft–medium；Target peak GR：1–4 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：optional_gate；默認 off。
- Attack 0.1–1 ms；Hold 40–100 ms；Release/Decay 120–250 ms；最大關閉衰減 15–25 dB。
- Threshold：由低開始，確保最細力有效音符／ghost notes 都開到；再試全 band spill。若無可靠分界就 bypass，唔硬 gate。
- Key：如可行由 kick in key 兩支一齊開關。

### 起手聽法

- out mic 可能 spill／LF feedback 多，先處理位置。
- in/out 聽整體；好多時一支就夠。

### 常見錯誤

- 見到外咪就習慣性大加 sub。
- 兩支相消卻用 EQ 補低音。

### 來源與支持範圍

- [Engineering Drums Live: Part Two](https://www.soundonsound.com/techniques/engineering-drums-live-part-two) — live sound。Jon Burton: external kick low-mid cut 200–400 Hz, optional click 2–5 kHz; rarely adds bass to external mic.
- [How to Use a Noise Gate](https://hub.yamaha.com/proaudio/pa-how-to/tools-of-the-trade-how-to-use-a-gate/) — live sound。Drums need fast opening, lower toms longer decay. Backing vocal gating can use slower opening and only 10–15 dB attenuation.
- [Drum Compression](https://www.soundonsound.com/techniques/drum-compression) — studio/mixing principles; adapted cautiously for live use。One consistency-control example uses 5:1, fast attack, medium release and up to 4–5 dB GR; attack/release changes can instead shape punch.

<a id="snare_top"></a>
## Snare top

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：70–120 Hz；slope 12–18 dB/oct。升到開始削薄主體，再退少少；按實際最低音／mic／舞台 rumble 調整。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 150–250 Hz | 0.7–1.4 | 0–3 dB | 薄身先少量補 body。 |
| bell | 400–900 Hz | 2–5 | -5–-1 dB | 只削實際 ring；唔抹走 snare 性格。 |
| bell | 2000–4500 Hz | 0.7–1.5 | 0–2 dB | attack／stick；hi-hat spill 會一齊增加。 |

### Compressor

- 使用：optional；Ratio 3–5:1；Attack 10–30 ms；Release 70–160 ms。
- Knee：medium–hard；Target peak GR：2–5 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- 默認唔 gate top；ghost notes／brushes 需要完整。
- 如果用快 attack 控 consistency，同慢 attack 留 transient 係兩種設法。

### 常見錯誤

- solo 聽好嘅 high-mid boost 令全套 hat 刺耳。
- 硬 gate 吞 ghost notes。

### 來源與支持範圍

- [Engineering Drums Live: Part Two](https://www.soundonsound.com/techniques/engineering-drums-live-part-two) — live sound。Jon Burton: external kick low-mid cut 200–400 Hz, optional click 2–5 kHz; rarely adds bass to external mic.
- [Drum Compression](https://www.soundonsound.com/techniques/drum-compression) — studio/mixing principles; adapted cautiously for live use。One consistency-control example uses 5:1, fast attack, medium release and up to 4–5 dB GR; attack/release changes can instead shape punch.
- [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials) — studio/mixing principles; adapted cautiously for live use。Voice: boxy 200–400 Hz, nasal 800–1500 Hz, penetrating 2–4 kHz, airy 7–12 kHz.

<a id="snare_bottom"></a>
## Snare bottom

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：90–180 Hz；slope 12–18 dB/oct。唔使一定 HPF 到 300 Hz：bottom 都可能有有用 body。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 300–800 Hz | 1.5–4 | -4–-1 dB | 多餘共鳴。 |
| bell | 3000–7000 Hz | 0.7–1.8 | 0–3 dB | snare wire／crack；太沙改 cut。 |

### Compressor

- 使用：optional；Ratio 2–4:1；Attack 5–20 ms；Release 60–150 ms。
- Knee：soft–medium；Target peak GR：1–3 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：optional_gate；默認 off。
- Attack 0.1–1 ms；Hold 40–100 ms；Release/Decay 100–220 ms；最大關閉衰減 10–20 dB。
- Threshold：由低開始，確保最細力有效音符／ghost notes 都開到；再試全 band spill。若無可靠分界就 bypass，唔硬 gate。
- Key：如適合可由 top key bottom；保留 ghost notes。

### 起手聽法

- polarity 係起手比較項，不係所有 setup 強制 invert。
- 同 top 以 blend 搵 balance；可一齊 group comp。

### 常見錯誤

- 過度刪低頻只剩嘶嘶聲。
- wire buzz 全靠 gate，不檢查 tuning／sympathetic resonance。

### 來源與支持範圍

- [Engineering Drums Live: Part Two](https://www.soundonsound.com/techniques/engineering-drums-live-part-two) — live sound。Jon Burton: external kick low-mid cut 200–400 Hz, optional click 2–5 kHz; rarely adds bass to external mic.
- [Drum Compression](https://www.soundonsound.com/techniques/drum-compression) — studio/mixing principles; adapted cautiously for live use。One consistency-control example uses 5:1, fast attack, medium release and up to 4–5 dB GR; attack/release changes can instead shape punch.
- [How to Use a Noise Gate](https://hub.yamaha.com/proaudio/pa-how-to/tools-of-the-trade-how-to-use-a-gate/) — live sound。Drums need fast opening, lower toms longer decay. Backing vocal gating can use slower opening and only 10–15 dB attenuation.

<a id="rack_tom"></a>
## Rack tom

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：50–90 Hz；slope 12–18 dB/oct。升到開始削薄主體，再退少少；按實際最低音／mic／舞台 rumble 調整。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 90–180 Hz | 0.7–1.4 | 0–3 dB | fundamental／body 按鼓 tuning。 |
| bell | 250–600 Hz | 1–3 | -5–-1 dB | mud／box。 |
| bell | 3000–6000 Hz | 0.7–1.8 | 0–3 dB | stick；留意 cymbal spill。 |

### Compressor

- 使用：optional；Ratio 2–4:1；Attack 15–35 ms；Release 100–250 ms。
- Knee：soft–medium；Target peak GR：1–4 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：optional_gate；默認 off。
- Attack 0.1–1 ms；Hold 50–120 ms；Release/Decay 150–350 ms；最大關閉衰減 12–25 dB。
- Threshold：由低開始，確保最細力有效音符／ghost notes 都開到；再試全 band spill。若無可靠分界就 bypass，唔硬 gate。
- Key：key filter 追蹤鼓真正 hit，試 cymbal crash 唔好誤開。

### 起手聽法

- 低鼓需要較長 decay；調整 hold／release 先問 drummer 想保留幾多 sustain。
- 刷奏／soft ballad 要減 gate threshold 或 bypass。

### 常見錯誤

- 每隻 tom 複製同一個 HPF 同 gate release。
- gate 太短斬走鼓身。

### 來源與支持範圍

- [Engineering Drums Live: Part Two](https://www.soundonsound.com/techniques/engineering-drums-live-part-two) — live sound。Jon Burton: external kick low-mid cut 200–400 Hz, optional click 2–5 kHz; rarely adds bass to external mic.
- [How to Use a Noise Gate](https://hub.yamaha.com/proaudio/pa-how-to/tools-of-the-trade-how-to-use-a-gate/) — live sound。Drums need fast opening, lower toms longer decay. Backing vocal gating can use slower opening and only 10–15 dB attenuation.
- [Drum Compression](https://www.soundonsound.com/techniques/drum-compression) — studio/mixing principles; adapted cautiously for live use。One consistency-control example uses 5:1, fast attack, medium release and up to 4–5 dB GR; attack/release changes can instead shape punch.

<a id="floor_tom"></a>
## Floor tom

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：35–60 Hz；slope 12–18 dB/oct。升到開始削薄主體，再退少少；按實際最低音／mic／舞台 rumble 調整。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 60–110 Hz | 0.7–1.4 | 0–3 dB | fundamental／body 按鼓 tuning。 |
| bell | 250–600 Hz | 1–3 | -5–-1 dB | mud／box。 |
| bell | 3000–6000 Hz | 0.7–1.8 | 0–3 dB | stick；留意 cymbal spill。 |

### Compressor

- 使用：optional；Ratio 2–4:1；Attack 15–35 ms；Release 100–250 ms。
- Knee：soft–medium；Target peak GR：1–4 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：optional_gate；默認 off。
- Attack 0.1–1 ms；Hold 80–180 ms；Release/Decay 250–500 ms；最大關閉衰減 12–25 dB。
- Threshold：由低開始，確保最細力有效音符／ghost notes 都開到；再試全 band spill。若無可靠分界就 bypass，唔硬 gate。
- Key：key filter 追蹤鼓真正 hit，試 cymbal crash 唔好誤開。

### 起手聽法

- 低鼓需要較長 decay；調整 hold／release 先問 drummer 想保留幾多 sustain。
- 刷奏／soft ballad 要減 gate threshold 或 bypass。

### 常見錯誤

- 每隻 tom 複製同一個 HPF 同 gate release。
- gate 太短斬走鼓身。

### 來源與支持範圍

- [Engineering Drums Live: Part Two](https://www.soundonsound.com/techniques/engineering-drums-live-part-two) — live sound。Jon Burton: external kick low-mid cut 200–400 Hz, optional click 2–5 kHz; rarely adds bass to external mic.
- [How to Use a Noise Gate](https://hub.yamaha.com/proaudio/pa-how-to/tools-of-the-trade-how-to-use-a-gate/) — live sound。Drums need fast opening, lower toms longer decay. Backing vocal gating can use slower opening and only 10–15 dB attenuation.
- [Drum Compression](https://www.soundonsound.com/techniques/drum-compression) — studio/mixing principles; adapted cautiously for live use。One consistency-control example uses 5:1, fast attack, medium release and up to 4–5 dB GR; attack/release changes can instead shape punch.

<a id="hihat"></a>
## Hi-hat

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：200–450 Hz；slope 12–18 dB/oct。thin then back；如果咪兼收有用 kit body 就調低。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 2000–5000 Hz | 1–2 | -4–-1 dB | 刺耳 metallic edge。 |
| high_shelf | 7000–12000 Hz | — | 0–2 dB | 需要先加 sizzle。 |

### Compressor

- 使用：normally_off；Ratio 1.5–2:1；Attack 10–30 ms；Release 80–200 ms。
- Knee：soft–medium；Target peak GR：0–2 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- 先聽 snare/OH 已收咗幾多；小場可能唔使開專用 hat mic。

### 常見錯誤

- 為清晰而無限加高頻。
- 重壓將 snare spill 拉前。

### 來源與支持範圍

- [Engineering Drums Live: Part Two](https://www.soundonsound.com/techniques/engineering-drums-live-part-two) — live sound。Jon Burton: external kick low-mid cut 200–400 Hz, optional click 2–5 kHz; rarely adds bass to external mic.
- [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials) — studio/mixing principles; adapted cautiously for live use。Voice: boxy 200–400 Hz, nasal 800–1500 Hz, penetrating 2–4 kHz, airy 7–12 kHz.

<a id="overheads"></a>
## Overheads

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：80–150 Hz；slope 12–18 dB/oct。全 kit capture：80–150；若純 cymbal spot，可試 200–350，但係唔同用途。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 250–500 Hz | 1–2 | -3–-1 dB | box／stage spill。 |
| bell | 2500–6000 Hz | 1–2 | -3–-1 dB | cymbal harshness，先查 mic angle。 |
| high_shelf | 8000–12000 Hz | — | 0–2 dB | 暗先輕加 air。 |

### Compressor

- 使用：normally_off；Ratio 1.5–2:1；Attack 20–50 ms；Release 150–400 ms。
- Knee：soft–medium；Target peak GR：0–2 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- stereo link 同 mono sum 都 check；唔好兩邊獨立大 GR 拉郁音像。
- live heavy bus comp 可排除 OH，減少 spill pumping。

### 常見錯誤

- 照搬錄音室 room-heavy 壓法。
- 為 cymbal EQ 犧牲成套鼓自然平衡。

### 來源與支持範圍

- [Engineering Drums Live: Part Two](https://www.soundonsound.com/techniques/engineering-drums-live-part-two) — live sound。Jon Burton: external kick low-mid cut 200–400 Hz, optional click 2–5 kHz; rarely adds bass to external mic.
- [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials) — studio/mixing principles; adapted cautiously for live use。Voice: boxy 200–400 Hz, nasal 800–1500 Hz, penetrating 2–4 kHz, airy 7–12 kHz.
- [Drum Compression](https://www.soundonsound.com/techniques/drum-compression) — studio/mixing principles; adapted cautiously for live use。One consistency-control example uses 5:1, fast attack, medium release and up to 4–5 dB GR; attack/release changes can instead shape punch.

<a id="ride"></a>
## Ride spot

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：150–350 Hz；slope 12–18 dB/oct。保留 bell body；按是否需要低中頻 ping。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 2000–5000 Hz | 1–2 | -3–-1 dB | 刺耳 bell／wash。 |
| bell | 6000–10000 Hz | 0.7–1.5 | 0–2 dB | 只喺缺 definition 時。 |

### Compressor

- 使用：normally_off；Ratio 1.5–2:1；Attack 10–30 ms；Release 100–250 ms。
- Knee：soft–medium；Target peak GR：0–2 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- ride beat 要同 hat 音量相稱，先試微調咪位。

### 常見錯誤

- HPF 太高只剩刺耳 wash。

### 來源與支持範圍

- [Engineering Drums Live: Part Two](https://www.soundonsound.com/techniques/engineering-drums-live-part-two) — live sound。Jon Burton: external kick low-mid cut 200–400 Hz, optional click 2–5 kHz; rarely adds bass to external mic.
- [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials) — studio/mixing principles; adapted cautiously for live use。Voice: boxy 200–400 Hz, nasal 800–1500 Hz, penetrating 2–4 kHz, airy 7–12 kHz.

<a id="bass_di"></a>
## Bass DI

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：25–40 Hz；slope 12–18 dB/oct。5-string low B 約31 Hz；4-string low E 約41 Hz。視曲目／PA，唔一律 HPF 60 Hz。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 60–100 Hz | 0.7–1.4 | 0–3 dB | weight，避免同 kick 互相堆積。 |
| bell | 200–400 Hz | 1–2 | -3–2 dB | 呢區既可 muddy，亦係 DI character；唔一定 cut。 |
| bell | 700–1500 Hz | 0.7–1.5 | 0–3 dB | 小喇叭上 note definition。 |
| bell | 2000–5000 Hz | 1–2 | -4–-1 dB | slap／fret 太尖先減。 |

### Compressor

- 使用：optional；Ratio 3–5:1；Attack 15–40 ms；Release 80–200 ms。
- Knee：soft–medium；Target peak GR：3–6 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- 先聽 pedal／amp 是否已經壓；可減甚至 bypass console comp。
- release 過快易調制低音；用實際低音 riff 試唔係單粒中音。

### 常見錯誤

- 照抄 60 Hz HPF 削走 low B/E 主體。
- 所有低中頻都 cut，只剩轟同 click。

### 來源與支持範圍

- [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials) — studio/mixing principles; adapted cautiously for live use。Voice: boxy 200–400 Hz, nasal 800–1500 Hz, penetrating 2–4 kHz, airy 7–12 kHz.
- [Session Notes: Selwyn Jazz Part 2](https://www.soundonsound.com/techniques/session-notes-selwyn-jazz-part-2) — studio/mixing principles; adapted cautiously for live use。Mike Senior session: bass 2–4 dB GR, roughly 25 ms attack / 80 ms release; piano only 2–3 dB GR.
- [The Foundation of the Perfect Mix](https://www.behindthemixer.com/foundation-perfect-mix/) — live sound。Derek Sexsmith live example divides kick near 50 Hz and bass 80–100 Hz; bass HPF near 60 Hz, clarity 1–1.5 kHz.

<a id="bass_amp"></a>
## Bass amp mic

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：30–50 Hz；slope 12–18 dB/oct。升到開始削薄主體，再退少少；按實際最低音／mic／舞台 rumble 調整。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 80–160 Hz | 1–2 | -4–-1 dB | cab boom／stage resonance。 |
| bell | 250–600 Hz | 1.5–3 | -3–-1 dB | box／honk 按 cab。 |
| bell | 700–1600 Hz | 0.7–1.5 | 0–2 dB | growl／definition。 |

### Compressor

- 使用：optional；Ratio 2–4:1；Attack 15–40 ms；Release 80–200 ms。
- Knee：soft–medium；Target peak GR：2–4 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- DI/amp 一齊聽 polarity／delay，cab 距離帶來 arrival difference。
- 如果 amp 只係 character，DI 承擔 clean low-end。

### 常見錯誤

- 相消卻同時 boost 兩邊 sub。

### 來源與支持範圍

- [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials) — studio/mixing principles; adapted cautiously for live use。Voice: boxy 200–400 Hz, nasal 800–1500 Hz, penetrating 2–4 kHz, airy 7–12 kHz.
- [Session Notes: Selwyn Jazz Part 2](https://www.soundonsound.com/techniques/session-notes-selwyn-jazz-part-2) — studio/mixing principles; adapted cautiously for live use。Mike Senior session: bass 2–4 dB GR, roughly 25 ms attack / 80 ms release; piano only 2–3 dB GR.
- [The Foundation of the Perfect Mix](https://www.behindthemixer.com/foundation-perfect-mix/) — live sound。Derek Sexsmith live example divides kick near 50 Hz and bass 80–100 Hz; bass HPF near 60 Hz, clarity 1–1.5 kHz.

<a id="electric_guitar_amp"></a>
## Electric guitar amp

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：70–120 Hz；slope 12–18 dB/oct。普通起步；密集 band rhythm 可試100–200，但保留低調弦／solo body。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 200–400 Hz | 1–2 | -4–-1 dB | mud；如果薄可改輕加 200–600 Hz body。 |
| bell | 2000–4500 Hz | 1–2 | -4–-1 dB | 刺耳／遮 vocal。 |
| bell | 1000–2000 Hz | 0.7–1.5 | 0–2 dB | lead forward，唔係加大所有 high。 |
| low_pass | 6000–10000 Hz | — | — | fizz；真 amp 同 modeler cab sim 視情況。 |

### Compressor

- 使用：normally_off；Ratio 2–3:1；Attack 10–30 ms；Release 60–150 ms。
- Knee：soft–medium；Target peak GR：1–3 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- distorted guitar 本身已壓；clean funky／level 不穩先考慮 comp。
- 移 mic 離 cone 中心可柔和 tone；協調 stage level。

### 常見錯誤

- 同 guitarist 已設計嘅 tone 對著幹。
- gate 截斷 sustain；用 LPF 掩蓋錯誤 cab-sim routing。

### 來源與支持範圍

- [Mixing Electric Guitars](https://www.behindthemixer.com/mixing-electric-guitars/) — live sound。Chris Huff live guitar: HPF 100–200 Hz, LPF 6–10 kHz, body 200–600 Hz; inspect 1–6 kHz for tone/harshness.
- [How to Use a Noise Gate](https://hub.yamaha.com/proaudio/pa-how-to/tools-of-the-trade-how-to-use-a-gate/) — live sound。Drums need fast opening, lower toms longer decay. Backing vocal gating can use slower opening and only 10–15 dB attenuation.
- [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials) — studio/mixing principles; adapted cautiously for live use。Voice: boxy 200–400 Hz, nasal 800–1500 Hz, penetrating 2–4 kHz, airy 7–12 kHz.

<a id="acoustic_guitar_di"></a>
## Acoustic guitar DI

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：70–120 Hz；slope 12–18 dB/oct。密集 band 可試100–160；獨奏／低音弦角色應保留更多 body。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 100–250 Hz | 1.5–3 | -4–-1 dB | boom／body resonance，mic 先避 sound hole。 |
| bell | 800–1500 Hz | 1–2 | -3–-1 dB | DI quack／nasal，實際 pickup 音色有差。 |
| bell | 2500–4000 Hz | 0.7–1.5 | 0–2 dB | pick definition，不足先加。 |
| bell | 4000–8000 Hz | 1–2 | -3–-1 dB | scratch／piezo edge。 |
| high_shelf | 10000–14000 Hz | — | 0–2 dB | 只係暗先加 sparkle。 |

### Compressor

- 使用：optional；Ratio 2–3:1；Attack 10–30 ms；Release 80–180 ms。
- Knee：soft–medium；Target peak GR：1–4 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- 用合適 impedance DI；先檢查 onboard EQ／battery。
- solo 比 band 保守；strum 同 fingerstyle 都要試。

### 常見錯誤

- 獨奏套 band HPF 變紙薄。
- 太多 comp 令 pick noise、手指聲同 spill 放大。

### 來源與支持範圍

- [Processing Acoustic Guitars](https://www.soundonsound.com/techniques/processing-acoustic-guitars) — studio/mixing principles; adapted cautiously for live use。In a busy arrangement, cut below 100 Hz; gentle 2:1 compression to catch peaks; exposed guitar generally needs subtler processing.
- [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials) — studio/mixing principles; adapted cautiously for live use。Voice: boxy 200–400 Hz, nasal 800–1500 Hz, penetrating 2–4 kHz, airy 7–12 kHz.
- [How to mic acoustic-guitar](https://www.dpamicrophones.com/mic-university/how-to-mic/how-to-mic-an-acoustic-guitar/) — manufacturer instrument/mic guidance。Start between fretboard and sound hole; microphone position/proximity change low-end balance.
- [How to Use a Compressor](https://hub.yamaha.com/proaudio/livesound/tools-of-the-trade-how-to-use-a-compressor/) — live sound。Use compression only as needed live; monitor processing can affect the singer’s performance and excessive compression/makeup can reduce practical GBF.

<a id="acoustic_guitar_mic"></a>
## Acoustic guitar mic

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：70–120 Hz；slope 12–18 dB/oct。密集 band 可試100–160；獨奏／低音弦角色應保留更多 body。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 100–250 Hz | 1.5–3 | -4–-1 dB | boom／body resonance，mic 先避 sound hole。 |
| bell | 800–1500 Hz | 1–2 | -3–-1 dB | DI quack／nasal，實際 pickup 音色有差。 |
| bell | 2500–4000 Hz | 0.7–1.5 | 0–2 dB | pick definition，不足先加。 |
| bell | 4000–8000 Hz | 1–2 | -3–-1 dB | scratch／piezo edge。 |
| high_shelf | 10000–14000 Hz | — | 0–2 dB | 只係暗先加 sparkle。 |

### Compressor

- 使用：optional；Ratio 2–3:1；Attack 10–30 ms；Release 80–180 ms。
- Knee：soft–medium；Target peak GR：1–4 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- mic 同 wedge 先處理方向／距離；窄 notch 只對實際 resonance。
- solo 比 band 保守；strum 同 fingerstyle 都要試。

### 常見錯誤

- 獨奏套 band HPF 變紙薄。
- 太多 comp 令 pick noise、手指聲同 spill 放大。

### 來源與支持範圍

- [Processing Acoustic Guitars](https://www.soundonsound.com/techniques/processing-acoustic-guitars) — studio/mixing principles; adapted cautiously for live use。In a busy arrangement, cut below 100 Hz; gentle 2:1 compression to catch peaks; exposed guitar generally needs subtler processing.
- [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials) — studio/mixing principles; adapted cautiously for live use。Voice: boxy 200–400 Hz, nasal 800–1500 Hz, penetrating 2–4 kHz, airy 7–12 kHz.
- [How to mic acoustic-guitar](https://www.dpamicrophones.com/mic-university/how-to-mic/how-to-mic-an-acoustic-guitar/) — manufacturer instrument/mic guidance。Start between fretboard and sound hole; microphone position/proximity change low-end balance.
- [How to Use a Compressor](https://hub.yamaha.com/proaudio/livesound/tools-of-the-trade-how-to-use-a-compressor/) — live sound。Use compression only as needed live; monitor processing can affect the singer’s performance and excessive compression/makeup can reduce practical GBF.

<a id="piano_acoustic"></a>
## Acoustic piano mic

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：35–70 Hz；slope 12–18 dB/oct。solo／低音角色可更低；band 有 bass 可試80–120，但先問編曲需要。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 180–400 Hz | 1–2 | -3–-1 dB | mud／close mic buildup。 |
| bell | 1500–4000 Hz | 0.7–1.5 | 0–2 dB | definition；已 hammer-hard 則 cut。 |
| high_shelf | 8000–12000 Hz | — | 0–2 dB | air 只喺需要時。 |

### Compressor

- 使用：optional；Ratio 1.5–2.5:1；Attack 20–50 ms；Release 100–300 ms。
- Knee：soft–medium；Target peak GR：1–3 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- 先 lid／mic placement 隔離鼓同 wedge；有時 close mic 係現場必要妥協。
- stereo piano 試 mono，避免兩端 audience 失去半邊音符。

### 常見錯誤

- 將所有 keyboard 都當 piano。
- 遠咪重壓把鼓聲／room 拉前。

### 來源與支持範圍

- [How to mic piano](https://www.dpamicrophones.com/mic-university/how-to-mic/how-to-mic-a-piano/) — manufacturer instrument/mic guidance。For stage/pit piano, closer directional mic placement inside the instrument and shorter/closed lid can improve isolation; distant natural pickup is a different goal.
- [Session Notes: Selwyn Jazz Part 2](https://www.soundonsound.com/techniques/session-notes-selwyn-jazz-part-2) — studio/mixing principles; adapted cautiously for live use。Mike Senior session: bass 2–4 dB GR, roughly 25 ms attack / 80 ms release; piano only 2–3 dB GR.
- [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials) — studio/mixing principles; adapted cautiously for live use。Voice: boxy 200–400 Hz, nasal 800–1500 Hz, penetrating 2–4 kHz, airy 7–12 kHz.

<a id="keys_piano_patch"></a>
## Keys／digital piano patch

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：70–120 Hz；slope 12–18 dB/oct。band piano 可試100–150；left-hand bass／solo 就唔好套呢個濾法。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 200–350 Hz | 1–2 | -3–-1 dB | mud，BTM 指近250 Hz。 |
| bell | 1000–3000 Hz | 0.7–1.5 | -3–0 dB | 讓 vocal／guitar；只喺 masking。 |
| high_shelf | 10000–14000 Hz | — | 0–2 dB | 缺 air 才加；patch 可能已 bright。 |

### Compressor

- 使用：normally_off；Ratio 1.5–2.5:1；Attack 15–40 ms；Release 100–250 ms。
- Knee：soft–medium；Target peak GR：0–3 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- 逐個 patch check level／built-in comp／reverb。
- L/mono 輸出用法按 keyboard manual；唔假設任意 L 都包含完整 stereo。

### 常見錯誤

- patch 本身有限幅仲重壓一次。
- 用錯誤 keyboard 頻率表去決定 HPF。

### 來源與支持範圍

- [Keyboard Mixing](https://www.behindthemixer.com/keyboard-mixing/) — live sound。Brian Gowing live piano patch: low roll-off 100–150 Hz with bass present, inspect mud near 250 Hz, optional air 10–16 kHz, space in 1–3 kHz.
- [How to mic piano](https://www.dpamicrophones.com/mic-university/how-to-mic/how-to-mic-a-piano/) — manufacturer instrument/mic guidance。For stage/pit piano, closer directional mic placement inside the instrument and shorter/closed lid can improve isolation; distant natural pickup is a different goal.
- [Session Notes: Selwyn Jazz Part 2](https://www.soundonsound.com/techniques/session-notes-selwyn-jazz-part-2) — studio/mixing principles; adapted cautiously for live use。Mike Senior session: bass 2–4 dB GR, roughly 25 ms attack / 80 ms release; piano only 2–3 dB GR.
- [How to Use a Noise Gate](https://hub.yamaha.com/proaudio/pa-how-to/tools-of-the-trade-how-to-use-a-gate/) — live sound。Drums need fast opening, lower toms longer decay. Backing vocal gating can use slower opening and only 10–15 dB attenuation.

<a id="synth_pad_lead"></a>
## Synth pad／lead（非 bass patch）

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：120–250 Hz；slope 12–18 dB/oct。support pad 常可試到200；lead 獨奏可更低。此設定完全唔適用 synth bass。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 200–500 Hz | 1–2 | -3–-1 dB | pad mask／mud。 |
| bell | 1500–4000 Hz | 0.7–1.5 | -3–0 dB | 讓 vocal；lead 可唔 cut。 |
| low_pass | 6000–12000 Hz | — | — | support pad 後退；按 patch filter 音色。 |

### Compressor

- 使用：normally_off；Ratio 1.5–2.5:1；Attack 10–40 ms；Release 100–300 ms。
- Knee：soft–medium；Target peak GR：0–3 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- 音色包絡／patch level 先處理；synth bass 另用 bass-oriented profile 但按最低 note 重設。
- 唔好令 bus comp 隨 pad swell 蓋過 vocal。

### 常見錯誤

- 固定 HPF 200 Hz 用晒所有 synth。

### 來源與支持範圍

- [Creating & Using Synth Pad Sounds](https://www.soundonsound.com/techniques/creating-using-synth-pad-sounds) — studio/mixing principles; adapted cautiously for live use。A pad supporting an arrangement may be high-passed at 200 Hz to avoid low-mid mud. This does not apply automatically to bass synth.
- [Keyboard Mixing](https://www.behindthemixer.com/keyboard-mixing/) — live sound。Brian Gowing live piano patch: low roll-off 100–150 Hz with bass present, inspect mud near 250 Hz, optional air 10–16 kHz, space in 1–3 kHz.
- [How to Use a Noise Gate](https://hub.yamaha.com/proaudio/pa-how-to/tools-of-the-trade-how-to-use-a-gate/) — live sound。Drums need fast opening, lower toms longer decay. Backing vocal gating can use slower opening and only 10–15 dB attenuation.

<a id="brass_horns"></a>
## Brass／horns：trumpet、trombone

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：70–120 Hz；slope 12–18 dB/oct。trombone 可試50–90；trumpet 可試100–160。唔將兩者音域當相同。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 200–450 Hz | 1–2 | -3–-1 dB | close mic boom／mud。 |
| bell | 800–1500 Hz | 1.5–3 | -3–-1 dB | honk。 |
| bell | 2500–5000 Hz | 1–2 | -3–-1 dB | brash edge；先試 off-axis／mic distance。 |

### Compressor

- 使用：optional；Ratio 2–3:1；Attack 5–20 ms；Release 70–180 ms。
- Knee：soft–medium；Target peak GR：1–3 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- 以 mic placement 為先；jazz section 有時完全唔壓較自然。
- 快 attack 控 peaks 同保留 bite 有取捨；先用低 GR。

### 常見錯誤

- 將錄音單一 trombone 5:1 例子當全 horn section 標準。
- limiting 太多令音色死／harsh。

### 來源與支持範圍

- [Recording Brass & Reeds](https://www.soundonsound.com/techniques/recording-brass-reeds) — studio/mixing principles; adapted cautiously for live use。Mild compression can tame brass/reed peaks; fairly fast attack/release suggested but preserve bite. Excessive compression emphasises sax mechanical noises.
- [Session Notes: Selwyn Jazz Part 2](https://www.soundonsound.com/techniques/session-notes-selwyn-jazz-part-2) — studio/mixing principles; adapted cautiously for live use。Mike Senior session: bass 2–4 dB GR, roughly 25 ms attack / 80 ms release; piano only 2–3 dB GR.
- [Selection and Operation of Audio Signal Processors](https://content-files.shure.com/Pubs/asp-selection-and-operation-of-audio-signal-processors/us_pro_audiosignalprocessor_ea.pdf) — Shure sound-reinforcement educational publication。Speech-intelligibility example: 125 Hz low cut, 6 dB/oct; publication also gives a 4 kHz high cut. This narrow-band system example is not automatically adopted for modern full-range MC sound.

<a id="sax"></a>
## Saxophone

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：70–120 Hz；slope 12–18 dB/oct。baritone 可試40–70；soprano 可試100–160，先聽最低 note。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 200–400 Hz | 1–2 | -3–-1 dB | proximity／mud。 |
| bell | 700–1500 Hz | 1.5–3 | -3–-1 dB | nasal honk；唔抹走樂器辨識度。 |
| bell | 2500–5000 Hz | 1–2 | -3–-1 dB | reed edge；先唔好只對 bell。 |
| bell | 4000–7000 Hz | 0.7–1.5 | 0–2 dB | 必要先少量 breath／definition。 |

### Compressor

- 使用：optional；Ratio 2–3:1；Attack 5–20 ms；Release 70–180 ms。
- Knee：soft–medium；Target peak GR：1–3 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- tone holes＋bell 一齊發聲，clip position 要跟 register 試。

### 常見錯誤

- 重壓把 key click／breath noise 拉前。
- 用一個 alto preset 套晒 bari 同 soprano。

### 來源與支持範圍

- [How to mic saxophone](https://www.dpamicrophones.com/mic-university/how-to-mic/how-to-mic-a-saxophone/) — manufacturer instrument/mic guidance。Sax radiates from tone holes as well as bell; capture a balanced mixture rather than assuming the bell alone is the instrument.
- [Recording Brass & Reeds](https://www.soundonsound.com/techniques/recording-brass-reeds) — studio/mixing principles; adapted cautiously for live use。Mild compression can tame brass/reed peaks; fairly fast attack/release suggested but preserve bite. Excessive compression emphasises sax mechanical noises.
- [Session Notes: Selwyn Jazz Part 2](https://www.soundonsound.com/techniques/session-notes-selwyn-jazz-part-2) — studio/mixing principles; adapted cautiously for live use。Mike Senior session: bass 2–4 dB GR, roughly 25 ms attack / 80 ms release; piano only 2–3 dB GR.

<a id="violin"></a>
## Violin／高音弦樂

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：100–180 Hz；slope 12–18 dB/oct。按 lowest note／spill；close mic harshness 唔靠 HPF 解決。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 200–500 Hz | 1–2 | -3–-1 dB | box／close body，按琴。 |
| bell | 2000–4500 Hz | 1–2 | -3–-1 dB | bow bite 太尖先減。 |
| high_shelf | 7000–10000 Hz | — | 0–2 dB | 輕 air，先睇 bow noise。 |

### Compressor

- 使用：normally_off；Ratio 1.5–2:1；Attack 15–40 ms；Release 120–300 ms。
- Knee：soft–medium；Target peak GR：0–2 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- mic 位置先；樂手 bow dynamics 係音樂內容，唔好壓平。

### 常見錯誤

- 當 violin 係 vocal 大加 presence。
- gate 斬走 pianissimo／bow tail。

### 來源與支持範圍

- [How to mic violin](https://www.dpamicrophones.com/mic-university/how-to-mic/how-to-mic-a-violin/) — manufacturer instrument/mic guidance。Close-mounted violin position balances soundboard and string bite; it may sound harsh but offers stage separation. Position before EQ.
- [Recording Strings](https://www.soundonsound.com/techniques/recording-strings) — studio/mixing principles; adapted cautiously for live use。String sections usually need little processing; if necessary, gently compress louder peaks. Makeup on distant mics emphasises room/noise.
- [Selection and Operation of Audio Signal Processors](https://content-files.shure.com/Pubs/asp-selection-and-operation-of-audio-signal-processors/us_pro_audiosignalprocessor_ea.pdf) — Shure sound-reinforcement educational publication。Speech-intelligibility example: 125 Hz low cut, 6 dB/oct; publication also gives a 4 kHz high cut. This narrow-band system example is not automatically adopted for modern full-range MC sound.

<a id="cello"></a>
## Cello／低音弦樂

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：35–55 Hz；slope 12–18 dB/oct。low C 約65 Hz；唔好用 violin HPF。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 100–250 Hz | 1–2 | -3–-1 dB | 近咪 boom，只削多餘。 |
| bell | 300–600 Hz | 1–2 | -3–-1 dB | box／mud。 |
| bell | 1500–3500 Hz | 1–2 | -3–-1 dB | bow harshness；缺咬字先反向微加。 |

### Compressor

- 使用：normally_off；Ratio 1.5–2:1；Attack 20–50 ms；Release 150–350 ms。
- Knee：soft–medium；Target peak GR：0–2 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- close mount 有 separation，但要聽 bridge／body balance。

### 常見錯誤

- 削晒100–250 Hz，琴身冇晒。
- 用 comp makeup 放大 stage rumble。

### 來源與支持範圍

- [How to mic cello](https://www.dpamicrophones.com/mic-university/how-to-mic/how-to-mic-a-cello/) — manufacturer instrument/mic guidance。Close-mic placement and proximity effect influence captured cello body; preserve natural tone before adding processing.
- [Recording Strings](https://www.soundonsound.com/techniques/recording-strings) — studio/mixing principles; adapted cautiously for live use。String sections usually need little processing; if necessary, gently compress louder peaks. Makeup on distant mics emphasises room/noise.
- [Selection and Operation of Audio Signal Processors](https://content-files.shure.com/Pubs/asp-selection-and-operation-of-audio-signal-processors/us_pro_audiosignalprocessor_ea.pdf) — Shure sound-reinforcement educational publication。Speech-intelligibility example: 125 Hz low cut, 6 dB/oct; publication also gives a 4 kHz high cut. This narrow-band system example is not automatically adopted for modern full-range MC sound.

<a id="choir"></a>
## Choir／遠距離合唱咪

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：70–130 Hz；slope 12–18 dB/oct。低男聲聲部同 sparse arrangement 要保留；先處理風噪／stage rumble。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 200–500 Hz | 1–2 | -3–-1 dB | mud，所有咪疊加後判斷。 |
| bell | 2000–4000 Hz | 0.7–1.5 | 0–1.5 dB | intelligibility，先靠 placement；GBF 不足唔 boost。 |

### Compressor

- 使用：normally_off；Ratio 1.3–2:1；Attack 20–50 ms；Release 150–400 ms。
- Knee：soft–medium；Target peak GR：0–2 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- 少而合適嘅咪比開滿更穩；控制 stage volume，遠 choir mic 唔送返 choir wedges。
- 分聲部同 balance；mute 未用咪／適當 automix 比 gate 更可控。

### 常見錯誤

- 壓低強聲後自動加 gain 令 room／feedback 冒出。
- 將3:1當完全消除 comb filter 保證。

### 來源與支持範圍

- [Of Mics and Monitors: Live Sound Reinforcement Tips for Choirs](https://www.shure.com/pt-br/insights/of-mics-and-monitors-live-sound-reinforcement-tips-for-choirs) — live sound。Minimum microphones, thoughtful placement, stage level and pattern orientation before EQ; adding open mics reduces available GBF.
- [Selection and Operation of Audio Signal Processors](https://content-files.shure.com/Pubs/asp-selection-and-operation-of-audio-signal-processors/us_pro_audiosignalprocessor_ea.pdf) — Shure sound-reinforcement educational publication。Speech-intelligibility example: 125 Hz low cut, 6 dB/oct; publication also gives a 4 kHz high cut. This narrow-band system example is not automatically adopted for modern full-range MC sound.
- [How to Use a Compressor](https://hub.yamaha.com/proaudio/livesound/tools-of-the-trade-how-to-use-a-compressor/) — live sound。Use compression only as needed live; monitor processing can affect the singer’s performance and excessive compression/makeup can reduce practical GBF.
- [Vocal Production](https://www.soundonsound.com/techniques/vocal-production) — studio/mixing principles; adapted cautiously for live use。Published vocal example: ratio 2–4:1, attack around 10 ms, release 50–100 ms, no more than about 5 dB peak GR for a natural result.

<a id="drum_bus"></a>
## Drum bus／group

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：—；slope —。音頻路徑默認唔加 HPF；sidechain HPF 另計，唔好削走 kick。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bypass | — | — | 0 dB | bus 唔預設音色修正 |

### Compressor

- 使用：optional；Ratio 1.5–2.5:1；Attack 20–40 ms；Release 100–250 ms。
- Knee：soft–medium；Target peak GR：1–3 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- 如有 detector HPF 可由60–100 Hz 試起（編者建議），只減少 kick 過度觸發，唔會移除音頻低頻。
- live 常需排除 OH；係真 audio subgroup 先可 insert，DCA 唔係 audio bus。
- stereo bus linked；parallel routing 要 check latency／comb filter。

### 常見錯誤

- 重壓全 kit 然後用 makeup 將 stage spill 推起。
- 想補救不平衡卻以一個 bus comp 壓所有。

### 來源與支持範圍

- [Engineering Drums Live: Part Two](https://www.soundonsound.com/techniques/engineering-drums-live-part-two) — live sound。Jon Burton: external kick low-mid cut 200–400 Hz, optional click 2–5 kHz; rarely adds bass to external mic.
- [Pro Tools: Bus & Group Compression](https://www.soundonsound.com/node/4923363) — studio/mixing principles; adapted cautiously for live use。Bus compression creates interdependence between sources; backing-vocal bus can blend a stack, independent channel compressors control individual singers. Stereo linking changes image behaviour.
- [Drum Compression](https://www.soundonsound.com/techniques/drum-compression) — studio/mixing principles; adapted cautiously for live use。One consistency-control example uses 5:1, fast attack, medium release and up to 4–5 dB GR; attack/release changes can instead shape punch.

<a id="vocal_bus"></a>
## Vocal bus／group

**狀態：所有數值為編者綜合；按需要啟用，唔係 load-and-go preset。**

**HPF**：—；slope —。HPF 喺各 channel 處理；bus EQ 唔作通用整體削低頻。

### EQ：只處理聽到嘅問題

| Type | 頻率搜尋區 | Q | Gain | 點解／幾時 |
|---|---|---|---|---|
| bell | 200–400 Hz | 0.7–1.4 | -2–0 dB | 多位疊加仍混濁才少量修正。 |

### Compressor

- 使用：optional；Ratio 1.5–2:1；Attack 10–30 ms；Release 80–200 ms。
- Knee：soft–medium；Target peak GR：1–2 dB。
- Threshold：唔提供固定 dBFS threshold：先校 preamp/trim 留 headroom，叫樂手演最細同最大聲段，逐步降低 threshold 至 target GR；唔改 preamp 去追 GR。
- Makeup：先 0 dB；以相近聽感音量做 bypass A/B，唔按 peak GR 自動補返相同 dB。
- 呢組範圍係編者綜合建議，唔係任何一位專家嘅完整 preset。
- release 要趕得切下一句／下一拍回復；如有喘氣、低音失真或 pumping 就放慢／減少 GR。

### Gate／expander

- 使用：off；默認 off。
- 唔建議預設 gate；避免吞入口、尾音、quiet notes／sustain。

### 起手聽法

- channel comp 管一個人，bus comp 做 glue，唔好兩層都長期重壓。
- lead 可獨立，BV 一組；一位 loud singer 唔應拖低全體。
- 如果可用，sidechain HPF 約100–150 Hz（編者建議）減 plosive 觸發。

### 常見錯誤

- 假設 DCA 可插 compressor。
- bus insert 改變咗 shared monitor 路徑而未 check。

### 來源與支持範圍

- [Pro Tools: Bus & Group Compression](https://www.soundonsound.com/node/4923363) — studio/mixing principles; adapted cautiously for live use。Bus compression creates interdependence between sources; backing-vocal bus can blend a stack, independent channel compressors control individual singers. Stereo linking changes image behaviour.
- [Vocal Production](https://www.soundonsound.com/techniques/vocal-production) — studio/mixing principles; adapted cautiously for live use。Published vocal example: ratio 2–4:1, attack around 10 ms, release 50–100 ms, no more than about 5 dB peak GR for a natural result.
- [How to Use a Compressor](https://hub.yamaha.com/proaudio/livesound/tools-of-the-trade-how-to-use-a-compressor/) — live sound。Use compression only as needed live; monitor processing can affect the singer’s performance and excessive compression/makeup can reduce practical GBF.

## 證據界線／未做

- 包含28張 instrument/bus 卡片；每張數值係編者綜合，不應包裝成多位專家一致認證。
- 未加入 erhu／guzheng／dizi 數值：今次未取得足夠可信、互相印證嘅 live EQ/comp 起手證據；唔直接套 violin／guitar／flute 冒充專業民族樂器 preset。
- sources 內 DPA 支持 mic placement／音色取捨，不提供本稿壓縮數字；strings／ride／choral 數值證據較薄，以 bypass 優先。
- 資料頁跨年代，係專家技術原則研究，不係2026最新 desk firmware 功能審核。

## 已閱讀來源：直接觀察／實例（唔等於卡片整套 preset）

### sos-live-drums: [Engineering Drums Live: Part Two](https://www.soundonsound.com/techniques/engineering-drums-live-part-two)

live sound；已於 2026-11-06 America/Toronto 驗證可讀。

- Jon Burton: external kick low-mid cut 200–400 Hz, optional click 2–5 kHz; rarely adds bass to external mic.
- Gate attenuation 20–30 dB; uses key filtering and may link two kick gates; rarely gates snare top; bottom gate may be keyed from top.
- Hi-hat/tom HPF: raise until audible thinning then back down. Bottom snare need not have all body filtered out.
- Heavy live drum-group compression raises spill; overheads may be excluded; PA capability takes priority over desired bass.

### sos-essentials: [Mixing Essentials](https://www.soundonsound.com/techniques/mixing-essentials)

studio/mixing principles; adapted cautiously for live use；已於 2026-11-06 America/Toronto 驗證可讀。

- Voice: boxy 200–400 Hz, nasal 800–1500 Hz, penetrating 2–4 kHz, airy 7–12 kHz.
- Kick weight 70–100 Hz, click 3–5 kHz; snare definition 1–3 kHz; cymbal sizzle 5–12 kHz.
- Bass: deep 50–100 Hz, character 200–400 Hz, hard 1–2 kHz, fret noise 2–7 kHz.
- Acoustic: boom 80–150 Hz, box 150–300 Hz, hardness 800–1500 Hz, presence 2.5–4 kHz, scratch 4–8 kHz. These are listening regions, not instructions to cut everything.

### sos-vocal: [Vocal Production](https://www.soundonsound.com/techniques/vocal-production)

studio/mixing principles; adapted cautiously for live use；已於 2026-11-06 America/Toronto 驗證可讀。

- Published vocal example: ratio 2–4:1, attack around 10 ms, release 50–100 ms, no more than about 5 dB peak GR for a natural result.
- 2–5 kHz harshness can be controlled dynamically; gentle brightening around 8 kHz; level rides reduce compressor workload.

### sos-drums-comp: [Drum Compression](https://www.soundonsound.com/techniques/drum-compression)

studio/mixing principles; adapted cautiously for live use；已於 2026-11-06 America/Toronto 驗證可讀。

- One consistency-control example uses 5:1, fast attack, medium release and up to 4–5 dB GR; attack/release changes can instead shape punch.

### sos-acoustic: [Processing Acoustic Guitars](https://www.soundonsound.com/techniques/processing-acoustic-guitars)

studio/mixing principles; adapted cautiously for live use；已於 2026-11-06 America/Toronto 驗證可讀。

- In a busy arrangement, cut below 100 Hz; gentle 2:1 compression to catch peaks; exposed guitar generally needs subtler processing.
- Change mic position before drastic EQ. The article’s −15 dB threshold is example-specific, not portable.

### sos-jazz: [Session Notes: Selwyn Jazz Part 2](https://www.soundonsound.com/techniques/session-notes-selwyn-jazz-part-2)

studio/mixing principles; adapted cautiously for live use；已於 2026-11-06 America/Toronto 驗證可讀。

- Mike Senior session: bass 2–4 dB GR, roughly 25 ms attack / 80 ms release; piano only 2–3 dB GR.
- A 5:1 trombone setting is a particular session solution, not a universal horn preset.

### sos-brass: [Recording Brass & Reeds](https://www.soundonsound.com/techniques/recording-brass-reeds)

studio/mixing principles; adapted cautiously for live use；已於 2026-11-06 America/Toronto 驗證可讀。

- Mild compression can tame brass/reed peaks; fairly fast attack/release suggested but preserve bite. Excessive compression emphasises sax mechanical noises.
- With appropriate microphone choice/placement, little EQ may be needed.

### sos-strings: [Recording Strings](https://www.soundonsound.com/techniques/recording-strings)

studio/mixing principles; adapted cautiously for live use；已於 2026-11-06 America/Toronto 驗證可讀。

- String sections usually need little processing; if necessary, gently compress louder peaks. Makeup on distant mics emphasises room/noise.

### shure-choir: [Of Mics and Monitors: Live Sound Reinforcement Tips for Choirs](https://www.shure.com/pt-br/insights/of-mics-and-monitors-live-sound-reinforcement-tips-for-choirs)

live sound；已於 2026-11-06 America/Toronto 驗證可讀。

- Minimum microphones, thoughtful placement, stage level and pattern orientation before EQ; adding open mics reduces available GBF.
- Advises against sending distant choir microphones into choir wedges. The 3:1 rule is a useful spill/interference guideline, not a guarantee of phase coherence.

### yamaha-gate: [How to Use a Noise Gate](https://hub.yamaha.com/proaudio/pa-how-to/tools-of-the-trade-how-to-use-a-gate/)

live sound；已於 2026-11-06 America/Toronto 驗證可讀。

- Drums need fast opening, lower toms longer decay. Backing vocal gating can use slower opening and only 10–15 dB attenuation.
- Avoid gates on wide-dynamic-range singers, clean DI sources and long-sustain guitar.

### yamaha-comp: [How to Use a Compressor](https://hub.yamaha.com/proaudio/livesound/tools-of-the-trade-how-to-use-a-compressor/)

live sound；已於 2026-11-06 America/Toronto 驗證可讀。

- Use compression only as needed live; monitor processing can affect the singer’s performance and excessive compression/makeup can reduce practical GBF.

### yamaha-tech: [For Audio Techs: Compression](https://www.yamaha.com/worship/troomdetails.html?CNTID=63653&CTID=560645&TROOM_ID=58934)

live sound；已於 2026-11-06 America/Toronto 驗證可讀。

- A contrasting live teaching recipe: lead 2:1 / backing 3–4:1, fastest attack, around 40 ms release, potentially 1–10 dB GR; drums 4:1, 50–70 ms attack, around 300 ms release.
- Its suggestion to replace GR with equivalent makeup gain is NOT adopted as a live safety rule here.

### btm-guitar: [Mixing Electric Guitars](https://www.behindthemixer.com/mixing-electric-guitars/)

live sound；已於 2026-11-06 America/Toronto 驗證可讀。

- Chris Huff live guitar: HPF 100–200 Hz, LPF 6–10 kHz, body 200–600 Hz; inspect 1–6 kHz for tone/harshness.
- Guitar role and amp mic placement matter; compression only for excessive level range.

### btm-keys: [Keyboard Mixing](https://www.behindthemixer.com/keyboard-mixing/)

live sound；已於 2026-11-06 America/Toronto 驗證可讀。

- Brian Gowing live piano patch: low roll-off 100–150 Hz with bass present, inspect mud near 250 Hz, optional air 10–16 kHz, space in 1–3 kHz.
- Usually avoids extra dynamics because patches may already have processing. Article frequency table has errors and is NOT used here.

### btm-bass: [The Foundation of the Perfect Mix](https://www.behindthemixer.com/foundation-perfect-mix/)

live sound；已於 2026-11-06 America/Toronto 驗證可讀。

- Derek Sexsmith live example divides kick near 50 Hz and bass 80–100 Hz; bass HPF near 60 Hz, clarity 1–1.5 kHz.
- This is an arrangement-specific alternative, NOT suitable automatically for preserving 5-string low B. Its fast-attack/punch wording is not adopted as a universal rule.

### sos-pads: [Creating & Using Synth Pad Sounds](https://www.soundonsound.com/techniques/creating-using-synth-pad-sounds)

studio/mixing principles; adapted cautiously for live use；已於 2026-11-06 America/Toronto 驗證可讀。

- A pad supporting an arrangement may be high-passed at 200 Hz to avoid low-mid mud. This does not apply automatically to bass synth.

### sos-bus: [Pro Tools: Bus & Group Compression](https://www.soundonsound.com/node/4923363)

studio/mixing principles; adapted cautiously for live use；已於 2026-11-06 America/Toronto 驗證可讀。

- Bus compression creates interdependence between sources; backing-vocal bus can blend a stack, independent channel compressors control individual singers. Stereo linking changes image behaviour.

### dpa-piano: [How to mic piano](https://www.dpamicrophones.com/mic-university/how-to-mic/how-to-mic-a-piano/)

manufacturer instrument/mic guidance；已於 2026-11-06 America/Toronto 驗證可讀。

- For stage/pit piano, closer directional mic placement inside the instrument and shorter/closed lid can improve isolation; distant natural pickup is a different goal.

### dpa-violin: [How to mic violin](https://www.dpamicrophones.com/mic-university/how-to-mic/how-to-mic-a-violin/)

manufacturer instrument/mic guidance；已於 2026-11-06 America/Toronto 驗證可讀。

- Close-mounted violin position balances soundboard and string bite; it may sound harsh but offers stage separation. Position before EQ.

### dpa-cello: [How to mic cello](https://www.dpamicrophones.com/mic-university/how-to-mic/how-to-mic-a-cello/)

manufacturer instrument/mic guidance；已於 2026-11-06 America/Toronto 驗證可讀。

- Close-mic placement and proximity effect influence captured cello body; preserve natural tone before adding processing.

### dpa-saxophone: [How to mic saxophone](https://www.dpamicrophones.com/mic-university/how-to-mic/how-to-mic-a-saxophone/)

manufacturer instrument/mic guidance；已於 2026-11-06 America/Toronto 驗證可讀。

- Sax radiates from tone holes as well as bell; capture a balanced mixture rather than assuming the bell alone is the instrument.

### dpa-acoustic-guitar: [How to mic acoustic-guitar](https://www.dpamicrophones.com/mic-university/how-to-mic/how-to-mic-an-acoustic-guitar/)

manufacturer instrument/mic guidance；已於 2026-11-06 America/Toronto 驗證可讀。

- Start between fretboard and sound hole; microphone position/proximity change low-end balance.

### shure-processors: [Selection and Operation of Audio Signal Processors](https://content-files.shure.com/Pubs/asp-selection-and-operation-of-audio-signal-processors/us_pro_audiosignalprocessor_ea.pdf)

Shure sound-reinforcement educational publication；已於 2026-11-06 America/Toronto 驗證可讀。

- Speech-intelligibility example: 125 Hz low cut, 6 dB/oct; publication also gives a 4 kHz high cut. This narrow-band system example is not automatically adopted for modern full-range MC sound.
- Gain structure/headroom and microphone/loudspeaker geometry are fundamental; EQ cannot fix arbitrary acoustic limits.

## 一分鐘 soundcheck 流程

1. source／mic placement → preamp headroom → flat balance。
2. 全 band 播／演代表性 loud + quiet passage，唔只 isolated hit。
3. HPF 升到開始削薄，再退；只削已聽到嘅 resonance／masking。
4. comp 由 bypass／低 GR 試；level-matched A/B，確認 monitor tap 同 GBF。
5. 如需 gate，試 ghost notes、尾音、全 band spill；唔可靠就 bypass。
6. 行場聽、check mono／多 mic polarity、留 show headroom；save scene 加清楚 label，唔覆蓋唯一 backup。

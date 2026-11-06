# Live sound 課程 App 教材 v2（校正版）

只包括已教 1.1、1.2、1.3、1.3b 及相關追問；唔係未來單元教材。

本版本取代舊對話中過度簡化或錯誤內容。公式係教學模型，唔係現場安全認證、rigging 或配電設計工具。Bob McCarthy 為概念參考，無引用書內原文、頁碼或未核實逐課章節。

## 安全邊界
- 所有聽力練習只喺數碼模擬進行；預設靜音，使用者主動播放，低音量、短片段、可即時停止。唔好為聽清 null 而加大聲。
- 唔好用真實 PA 做 feedback、clip、極限音壓或電力故障示範。耳機音量由使用者舒適低音量起步；dBFS 唔等於耳邊 dB SPL。
- 本課唔教帶電探針量度、開電箱、feeder 接駁、改 neutral/ground bonding。由合資格人員按現場、設備及安省規定處理。
- 永遠唔可以斷 protective earth / safety ground。懷疑電源有問題，停止使用該供電安排，交場館合資格電工評估；唔好自行帶電排查。

## 更正紀錄（舊對話不可直接搬入 App）
- Coherent 係訊號之間有穩定、可預測嘅相位關係，唔要求同時到達；延遲副本仍然 coherent。+6.02 dB 只限等聲壓、同頻、同相，相對單一來源。
- Comb-filter null 位置嘅簡式假設同極性、純延遲；等電平先可以理想完全抵銷，唔等電平只形成較淺谷。兩個同 feed guitar amp 唔可以直接叫 incoherent。
- 3:1 係降低其他咪串音影響嘅幾何準則，唔係同一把口兩支 podium mic 嘅保證解法；automixer 可能兩支都判斷有人講，唔會自動變成可靠後備。
- 10log 距離衰減只係理想 cylindrical spreading。有限陣列唔會喺一條界線突然由 3 變 6 dB/doubling。L²/(2λ) 只係理想直孔徑粗估，唔係保證 3 dB 區域。
- 彎 array 唔可以直接用弧長代入，亦唔可以任意只計上半部而當下面無貢獻。無通用 8–16 箱門檻。VRX 須核實確切型號、constant-curvature 幾何同原廠模型。
- 遠位必然偏光偏薄係錯：空氣吸收會衰減高頻，房間、瞄準、遮擋及陣列設計都影響 tonal balance。
- Critical distance 外推大聲唔一定完全無助 intelligibility；可能改善相對背景噪音，但通常唔改善直達/殘響比，而且受 feedback、聽力及系統限制。
- 唔好為 fader unity 而硬改 preamp。低數碼 level 唔自動等於可聽解析度損失。移除未核實 CL/QL −18 dBFS = +4 dBu 嘅說法。減 gain 唔會令實體 fader 自動移動。
- AC：VI 係 VA；W 要乘 true power factor。三相 √3 VLL I 同樣先係 VA。80% 呢度只作保守例題假設，唔係安省所有三小時 show 嘅法律通則。
- ceil(總電流/支路容量) 只係所需支路下限，唔係分配可行證明。1/8、1/3 pink-noise 係指定測試條件，唔能代表所有音樂或 limiter 狀態。
- 舊 Crown XTi4002 1/3 表引用咗其他型號行。已開啟 power-draw PDF：120 V、每 channel 8/4/2 Ω，1/3 為10.5/18.9/26.9 A；唔係8.3/13.5/19.3 A。9.8 A 為本 PDF 1/8、4 Ω；網上其他手冊10.5 A版本差異未核實，唔混表。
- 唔係所有現代 switch-mode PSU 都有嚴重 triplen harmonic；PFC、拓撲及負載有影響。唔一律建議 double neutral。
- Generator bonding 視 source/transfer topology，唔提供通用「一點 bond」安裝指示。唔預設 audio/lighting 分開 generator 更安全，跨系統接地反而可能增加風險。
- 取消叫未受訓人員用 multimeter 插入 live mains。N–G 2 V 唔係通用安全界線，H–G 0 V 唔能單獨證明斷地；單一讀數唔可作合格判斷。DI signal ground lift 唔等於 mains ground lift，亦唔係所有 DI 都用同一內部方式。

# 1.1 Acoustics 聲學、疊加、距離與陣列

## 重點概念
1. 聲音係壓力擾動；頻率決定每秒周期數，波長係一個周期喺空間嘅長度。20°C 用343 m/s，溫度會改聲速。物件相對波長越大通常越容易造成遮擋/散射，但材料、形狀、入射角同繞射亦重要，唔係硬門檻。
2. 點源模型：自由場、遠場、同一軸向，聲能向球面擴散；強度∝1/r²、聲壓∝1/r。所謂 inverse square 係強度，換成聲壓級係每倍距離約−6 dB。房間反射、指向性、地面干涉、吸收都會令量度唔同。
3. 理想無限長 line source 係圓柱面擴散；強度∝1/r，聲壓∝1/√r，約−3 dB/doubling。真實有限 line array 係多單元、頻率相關指向性嘅陣列；近區可有複雜波瓣，唔係全部都準確3 dB。有限陣列遠場通常漸近球面衰減。
4. L²/(2λ) 只喺理想直身連續孔徑模型提供頻率相關距離尺度；不同定義係數會不同，唔係圍住 array 嘅清晰界線，唔可以用嚟承諾觀眾區 SPL。陣列高度、單元間距、waveguide、頻率、splay、shading 同觀察方向都重要。
5. 彎曲/J array：弧長、上下垂直高度、兩端 chord 同聲學有效孔徑唔係同一樣嘢。較直嘅部分常瞄遠位、較彎部分瞄近位，但所有箱可能喺某頻率/位置有貢獻。應用全陣列原廠模型及測量；唔好將12箱4.2 m任意變成上6箱2.1 m再宣布13 m near-field。
6. VRX932 家族要分清 LA、LA-1、LAP 等版本。2–3箱唔能單憑數目定義成純 point 或純 line；constant-curvature 系統有預設幾何同指定覆蓋，低頻與HF行為不同。此版 JBL 頁面被403擋住，未核實確切型號數據，因此無輸入箱高、角度、數量上限或預測距離。用型號匹配嘅JBL文件及模型，唔以通用公式代替。
7. Coherent 係可預測關係；同一訊號經固定 delay 後仍 coherent，只係各頻率相位唔同。獨立噪音通常 uncorrelated，可平均加能量；現實可能部分相關。兩個同feed guitar amp即使不同EQ/箱體都唔應直接當完全獨立。Stereo L/R 亦唔保證一樣或完全無關。
8. 同等聲壓、同相疊加 +6.02 dB；同等平均能量且互不相關 +3.01 dB。兩隻sub疊埋只喺相位/電平匹配及觀察位置合適時接近+6，唔係所有頻率所有位置保證。
9. Comb filtering：原訊號加延遲副本，相位差隨頻率變，頻譜出現規律峰谷。等電平、同極性、純delay先有理想零點；低咗第二支咪嘅電平，谷會淺。頻率響應、方向性、房間都會改實際形狀。
10. 雙podium咪收同一口已經有coherent成分，唔係貼近後先變coherent。兩capsule距離近、朝向一致、到口距離近似可減時間差，但頭部移動會改變路徑，兩咪本身頻響亦不同。建議一主一備、明確mute/切換策略；兩咪同開唔係免費gain-before-feedback。
11. 3:1 準則通常指多音源多咪情況：咪間距至少係某咪到目標音源距離約3倍，以降低串音。目的係令不需要嘅第二路細好多，唔係對齊時間。同口兩咪要貼近或一主一備，唔好用3:1作萬能答案。Dugan等gain-sharing automixer可能兩支都收相同speech，唔會自動識別邊支係後備。
12. RT60 係衰減60 dB嘅時間，隨頻率、房間、吸音及使用狀態變；唔以劇場/arena一個固定秒數判合格。Critical distance 係統計直達與殘響能量相等嘅距離，受源指向性與房間影響。提高同一PA輸出常同時提高兩者，唔改善D/R；但可改善對固定背景噪音嘅SNR。改善清晰度通常靠指向、近距離補聲、減反射、改善收音。

## 公式卡（用途見名稱；每張必須連假設展示）

### sound_speed · 聲速近似
- 變數／單位：T: °C；c: m/s
- 公式：`c ≈ 331.3 + 0.606*T`
- 適用／限制：普通空氣、室溫附近近似；濕度等未計
- 例：20°C →343.42 m/s；本課四捨五入343

### wavelength · 波長
- 變數／單位：c: m/s；f: Hz>0；λ:m
- 公式：`λ=c/f`
- 適用／限制：單一頻率、同一介質
- 例：343/63=5.444 m

### point_distance · 點源SPL變化
- 變數／單位：r1,r2:m>0；L1,L2:dB SPL
- 公式：`L2=L1−20*log10(r2/r1)`
- 適用／限制：自由場點源遠場，同軸、輸出不變；衰減量正值另定A=20log10(r2/r1)
- 例：2m106dB→32m：106−24.082=81.918 dB

### ideal_line_distance · 理想線源SPL變化
- 變數／單位：r1,r2:m>0；L:dB SPL
- 公式：`L2=L1−10*log10(r2/r1)`
- 適用／限制：只係理想圓柱擴散示意，唔係產品預測
- 例：1m120dB→40m：120−16.021=103.979 dB（理想）

### aperture_scale · 直孔徑粗估尺度
- 變數／單位：L:m>0；f:Hz>0；c:m/s
- 公式：`R≈L²/(2λ)=L²*f/(2*c)`
- 適用／限制：理想直孔徑，唔係房間critical distance，唔保證R內3dB；曲陣列禁用
- 例：4²×500/(2×343)=11.662m；2kHz→46.647m

### path_delay · 路徑差與時間差
- 變數／單位：Δd:m；c:m/s；τ:s；τms:ms
- 公式：`τ=abs(Δd)/c；τms=1000*τ`
- 適用／限制：純傳播差；電子latency要另外相加
- 例：0.686/343=.002s=2ms

### phase · delay相位
- 變數／單位：f:Hz；τ:s；φ:degree
- 公式：`φ=360*f*τ（mod 360）`
- 適用／限制：純delay；正負方向按相位參考定義，此處示差值大小
- 例：500Hz×.001s×360=180°

### comb_nulls · 梳狀谷頻率
- 變數／單位：τ:s>0；n:整數0,1,2…；f:Hz
- 公式：`f_null(n)=(2*n+1)/(2*τ)；spacing=1/τ`
- 適用／限制：同極性純delay；等幅先完全null；n=0第一谷
- 例：1ms→500,1500,2500Hz；spacing1000Hz

### comb_peaks · 梳狀峰頻率
- 變數／單位：τ:s>0；n:整數0,1,2…；f:Hz
- 公式：`f_peak(n)=n/τ`
- 適用／限制：同極性純delay；n=0係DC；等幅先+6.02dB
- 例：1ms→DC,1000,2000Hz

### coherent_sum · 相關聲壓疊加
- 變數／單位：a,b:對參考訊號線性聲壓比；φ:rad
- 公式：`gain_dB=20*log10(sqrt(a²+b²+2*a*b*cos(φ)))`
- 適用／限制：單頻相量，相對選定參考；零幅顯示−∞唔係計算error
- 例：a=b=1 φ=0→6.021dB；φ=π→−∞

### comb_response · 延遲副本頻響
- 變數／單位：a:副本/主訊號聲壓比≥0；f:Hz；τ:s≥0
- 公式：`G(f)=20*log10(abs(1+a*exp(−j*2*π*f*τ)))`
- 適用／限制：主路=1、同極性；反極性將+改−；純延遲模型
- 例：a=.5：峰20log10(1.5)=3.522dB；谷20log10(.5)=−6.021dB

### incoherent_sum · 不相關電平相加
- 變數／單位：Li:dB，相同參考/頻帶/量度方式
- 公式：`Ltotal=10*log10(sum(10**(Li/10)))`
- 適用／限制：互不相關、時間平均能量
- 例：80+80 dB→83.010dB

### db_ratios · dB與比值
- 變數／單位：p2/p1:聲壓或電壓比；P2/P1:功率比
- 公式：`ΔLp=20log10(p2/p1)；ΔLP=10log10(P2/P1)；p比=10**(dB/20)；P比=10**(dB/10)`
- 適用／限制：電壓推導功率比較要相同阻抗；唔好混dB SPL/dBu/dBFS參考
- 例：聲壓×2→6.021dB；功率×2→3.010dB

### three_to_one · 3:1串音幾何準則
- 變數／單位：d:咪到目標音源m；s:咪間距m
- 公式：`s ≥ 3*d（經驗指引）`
- 適用／限制：多咪多音源、並考慮方向性；唔係同口雙咪消comb公式
- 例：d=.2m→s至少約.6m；仍須聽/量串音

## 逐步例子
1. 點源：2m106dB，32/2=16；log10(16)=1.20412；20×1.20412=24.082；106−24.082=81.918dB。亦可數2→4→8→16→32四次doubling，每次6.02。
2. Ballroom理想例：1m110dB；5m減20log10(5)=13.979→96.021dB；20m減26.021→83.979dB。相差12.041dB唔能單獨判定聽唔清，仲要SNR/殘響。Delay fill要用覆蓋同時間對齊設計，唔憑呢例指定12m安裝。
3. 理想line對比：4m直孔徑、2kHz→16×2000/686=46.647m尺度；若純圓柱教具1m120dB，40m→103.979dB；點源教具同參考→87.959dB。兩者唔代表同功率兩款真產品公平比較。舊94m分段97dB答案撤回為現場預測；app唔設sharp切換。
4. Comb：口到咪A .300m、B .643m；差.343m；τ=.343/343=.001s；第一谷1/(2×.001)=500Hz；間距1/.001=1000Hz；第二谷1500Hz；峰1000/2000Hz。若兩咪未補gain，B較遠通常較細，唔可以話一定完全null或+6dB。
5. 17cm差：.17/343=.000495627s；第一谷343/(2×.17)=1008.824Hz，第二谷3026.471Hz。舊1000/3000係將17cm近似為.5ms後嘅合理近似。
6. Podium移頭令差5cm：.05/343=.000145773s；第一谷343/.1=3430Hz。假設距離差係5cm而非單純咪間距；頭位置決定差。
7. 副路低10dB：a=10**(−10/20)=.31623；峰20log10(1+a)=2.387dB，谷20log10(1−a)=−3.302dB。仍有染色，唔係「完全無comb」。

## 互動圖解建議
1. 波長尺：選63/100/1k/10kHz，顯示以米/厘米換算同聲波動畫；圖形唔代表空氣粒子走完整個波長。
2. log距離SPL圖：點源20log與理想線源10log分開虛線；顯示假設badge，不提供真array自動3/6切線。4m孔徑尺度用淡色頻率相關區而唔係硬界線。
3. Curved array：可拖箱角度，畫arc、chord、垂直投影三個不同量；旁邊註明三者都唔能直接當有效聲學長度。無原廠complex資料只畫方向示意，唔輸出聲學預測。
4. Comb plot：延遲0–5ms、副路−∞至0dB、polarity切換；上下顯示impulse、phase、log/linear頻率幅度。標true null與淺谷；linear軸看等間距。
5. Podium俯視：移嘴/兩capsule位置→計兩條path差及谷位置；只用自由場示意，唔推薦靠delay鎖住會郁嘅人。
6. 房間概念圖：direct下降、統計reverb背景、固定ambient noise分開。加PA level時direct與reverb同步升，ambient不升；critical distance唔係安全距離。

## 練習與答案
1. 63Hz波長？
   - 答案：343/63=5.444m。
2. 2m100dB到20m點源？
   - 答案：距離×10，減20dB→80dB（自由場假設）。
3. 路差.686m、1.03m，第一谷？
   - 答案：.686/343=2ms→250Hz；1.03/343≈3.003ms→166.505Hz。
4. 4m直孔徑500Hz尺度？係咪11.66m內一定3dB？
   - 答案：11.662m；唔係，係粗估尺度，唔保證衰減斜率。
5. 延遲1ms副本係咪incoherent？
   - 答案：唔係，仍coherent，phase隨頻率變。
6. 兩podium mic貼埋必然+6dB及自動加feedback margin？
   - 答案：唔係；要等幅同相先+6，speaker-to-mic feedback亦會疊加；先建立一主一備策略。
7. 3隻VRX可唔可以直接套10log？
   - 答案：唔可以。須型號、幾何、頻率、觀察方向、原廠模型/測量；箱數唔足夠判斷。

## 安全數碼聽力練習
1. 同一段自備/授權speech：dry vs dry+1ms copy，等幅先各路預留至少12dB數碼headroom，短片段低音量；再將副路減6/10/20dB比較染色。A/B以固定且安全嘅參考/顯示增益，唔偷偷加大null版本。
2. 獨立noise兩路 vs 相同noise兩路：畫平均RMS及peak，播放前先衰減，示範+3與+6條件；聽感唔可當精確dB測量。
3. 短speech加不同數碼reverb，再獨立控制固定ambient noise。比較加整個PA訊號與減reverb，理解SNR同D/R不同。唔提供真實聲場line array聲音模擬保證。

來源：S1, S2, S3。一般公式亦有數學推導成分；唔代表每一說法已由該來源逐條引用。

# 1.2 Gain structure 增益結構

## 重點概念
1. Signal chain：mic→analogue preamp→ADC→channel DSP→fader→bus→output→processor→amp。每級都有noise及上限；後級fader拉低唔能修復已經preamp/ADC clipping。浮點DSP有內部headroom都唔代表ADC、plugin、DAC唔會clip。
2. Noise floor係系統底噪；SNR係訊號同噪音嘅差；headroom係操作level到該級上限嘅餘量。Mic近口、適合靈敏度、正確連接通常比盲目加gain有效。Preamp太低再大量後推，可能將後級noise影響放大；但現代系統適度偏低錄音唔自動造成可聽bit-resolution損失。
3. 0dBFS係數碼full-scale參考；sample峰值唔大於0唔保證無inter-sample/後級過載。dBu係analogue voltage參考，唔等於dBFS；兩者對應由該機型輸入/輸出校準決定。此版唔提供未核實Yamaha CL/QL對照表。
4. 平均−18至−20dBFS、峰−10至−6dBFS可以作某些台/演出嘅起始參考，唔係必須達標嘅統一數字。更重要係meter tap、peak/RMS方式、最大演出力度、突發peak同shared HA。高crest factor來源應留更多空間。
5. Soundcheck安全流程：先確認routing/mute及系統音量受控，再請表演者用實際最大力度。用適當pre-fader input meter/PFL設HA，而唔係開PA強迫fader在0。留足headroom後用fader做mix；加EQ、makeup gain或bus summation後再查下游級。Shared preamp變動要同monitor/錄音協調，必要時用本地digital trim。
6. Unity只係該級0dB增減，唔代表每支channel都應unity。Fader在接近0區常有較細dB/mm刻度，但設計因台而異；−25dB可以係合理mix balance，唔能只睇位置判gain錯。唔好犧牲input headroom/SNR以追求−10至0。
7. Lectern細聲兼feedback：先近口/改善講話方向、合適咪與speaker瞄準、減不需要開咪，確保咪嘅polar pattern喺該頻率真係提供拒收；窄notch可能換少量margin，但唔治聲學問題。Headset通常穩定近口，lav未必比原有gooseneck近。
8. Check master/processor/amp是否誤設係正確排查，但若已feedback，盲目加amp或master通常唔改善gain-before-feedback。講者細聲唔係「無得救」；近距離收音與系統配置可以改善。

## 公式卡（用途見名稱；每張必須連假設展示）

### headroom · 數碼峰值餘量
- 變數／單位：peak_dBFS≤0；H:dB
- 公式：`H=0−peak_dBFS`
- 適用／限制：同一數碼級、sample peak參考；唔代表analogue所有級
- 例：peak−2→2dB餘量；peak−10→10dB

### gain_change · 線性增益及混音補償
- 變數／單位：Lin,Lout:dBFS；g,faderChange:dB
- 公式：`Lout=Lin+g；維持線性輸出時 Δfader=−Δgain`
- 適用／限制：無clipping、無comp/gate等非線性、routing相同
- 例：gain減8dB：peak−2→−10；要同音量，手動fader−25→−17

## 逐步例子
1. Kick peak−2dBFS、fader−25：先確認−2係preamp/ADC meter。暫以目標peak−10作示範：需要−10−(−2)=−8dB gain。Peak變−10；fader本身仍−25。若mix要保持原聲壓且線性，可手動升8dB到−17；唔一定要再逼到0。重查comp threshold/monitor send與bus。
2. 唔好為將fader−25推到0而減preamp26dB到peak−28。−28唔必然不可用，但若目的只係靚fader位置，就無合理依據；聽噪音、meter及實際headroom。
3. 講者由30cm靠到15cm，理想直接聲約+6.02dB。將channel gain減約6dB保持觀眾音量，通常可減feedback loop增益；實際口形、directionality、proximity effect及空間會改結果。唔保證剛好淨賺6dB。

## 互動圖解建議
1. 可拖gain、fader、EQ boost、bus sum嘅block diagram；每級分開peak與noise meter，ADC clip後顯示紅色波形，fader再低都保留失真。
2. 兩種meter tap切換：pre/post fader；令學生睇同一fader操作點解input meter唔郁。dBFS/dBu不同顏色，無校準唔允許轉換。
3. feedback loop只做數學箭嘴及margin示意，唔產生自激audio。

## 練習與答案
1. Kick−2dBFS、fader−25，如何處理？
   - 答案：確認meter tap；視表演最大峰及安全餘量，例如減HA8dB到−10；需要相同mix時手動fader升8dB到−17，唔硬追unity；查所有下游級。
2. preamp clip後fader拉低有無用？
   - 答案：輸出會細但失真無法復原；要降低過載前級並重新檢查。
3. 講者細聲、fader+10開始feedback，先做乜？
   - 答案：先改善口咪距離/方向、speaker路徑、減開咪；確認routing。唔靠提高master/amp去突破feedback。
4. −18dBFS一定等於+4dBu？
   - 答案：唔係，必須查機型及輸入/輸出校準，今版無已核實對應。

## 安全數碼聽力練習
1. 乾淨speech副本做數碼hard clip，再把輸出衰減並匹配安全音量，對比先衰減再通過clip級。示範後級拉低救唔返失真；唔clip實體amp。
2. 相同speech加固定低noise，移動模擬前級/後級增益觀察meter；明確標示noise注入位置。所有總輸出設安全上限，無真feedback試驗。

來源：S1。一般公式亦有數學推導成分；唔代表每一說法已由該來源逐條引用。

# 1.3 Show power and grounding 供電、負載與hum

## 重點概念
1. 北美常見120V/60Hz支路，但唔可以只憑插頭或舊稱110V假設現場規格；確認設備額定、場館供電資料與合資格人員確認。音響輸出speaker watts唔等於牆插輸入watts/amps。
2. 交流有效值Vrms×Irms係apparent power S（VA），real power P（W）=S×true PF。非線性PSU嘅PF同時受相位及波形失真影響，唔只係cosφ。由W反推A要知PF同供電電壓；由amp輸出W反推mains仲要效率及節目條件。
3. 80%作今堂保守planning例題：15A→12A、20A→16A。唔係所有安省超過3小時必須按同一規則；實際連續負載定義、設備100%額定、線材、保護、distro及當地適用要求由合資格人員決定。計算機只顯示「教學假設容量」，唔顯示code compliant。
4. NEMA 5-15通常120V15A配置；5-20R receptacle有T槽，5-20P有一片橫向blade，唔係插頭自身有T腳。L21-30係額定30A、120/208V三相wye用嘅locking configuration，唔代表任意場地一定接法正確。Cam-type單極connector用於較大供電；認識名稱唔等於有資格接駁。唔提供插接順序或安裝步驟。
5. Amp spec要同時記型號、文件版、供電V/Hz、每channel阻抗、測試noise/功率比例、工作模式。1/8 pink-noise數字係原廠指定測試，唔係所有音樂嘅保證平均；低crest-factor壓縮音樂、持續低頻、limiter與效率都可令需求不同，仲要考慮inrush。
6. 已開啟Crown XTi2 PDF（經Full Compass鏡像）：XTi4002，120V60Hz、8/4/2Ω per channel，idle .7A；1/8 pink noise 5.4/9.8/14.3A；1/3 pink noise 10.5/18.9/26.9A。PDF用typical program just/extreme clip描述測試，唔可當正常/極端演出通用定義。
7. 舊對話將XTi2002 1/3嘅8.3/13.5/19.3A誤用喺4002。另有9.8 vs10.5A版本爭議未取到第二份手冊核實；10.5喺本PDF係4002 1/3 8Ω，唔可以當成同表1/8 4Ω。App只顯示已讀文件值並標版本未知，唔聲稱涵蓋所有手冊。
8. Ground loop可以係器材之間有多條導電路徑，地/屏蔽電流加上unbalanced連接或common-mode rejection不足產生hum。唔一定係兩個不同插蘇先有，唔係所有hum都係ground loop；PSU漏電耦合、磁感應、錯接線、設備故障亦可能。
9. Balanced audio靠差分與阻抗平衡降低共同干擾，唔係保證無hum。Laptop可用適當audio isolation transformer、transformer-isolated DI或合適隔離介面；consumer headphone stereo要用適合兩channel/mono summing方案，唔直接短接L/R。Passive DI可能衰減line level，重查台輸入。
10. 只用設備設計容許嘅signal ground-lift switch，按其手冊；唔假設所有DI掣都只係同一條shield嘅相同斷法。永遠唔改mains protective earth、唔剪腳、唔用cheater plug。部分雙重絕緣laptop charger本來無PE，都唔代表可以自行改裝。
11. Laptop拔charger後hum消失係線索唔係完整診斷。電池電量/供電策略充足時可作臨時操作選擇；正式show要可靠計劃。設備冒煙、刺痛、損壞、懷疑漏電唔當普通hum處理，停止使用交專業人員。
12. Audio/lighting支路分配應同場館電工及system design協調，控制電磁干擾、避免超載；同一distro/同相唔係消hum保證。唔自動建議用獨立generator，跨源audio cable可帶來額外電位/保護問題。

## 公式卡（用途見名稱；每張必須連假設展示）

### single_phase · 單相AC功率
- 變數／單位：V:Vrms；I:Arms；PF:0至1；S:VA；P:W
- 公式：`S=V*I；P=V*I*PF；I=P/(V*PF)`
- 適用／限制：I為實際輸入；反算PF須>0；唔係speaker輸出
- 例：120V16A→1920VA；PF1→1920W，PF.8→1536W

### planning_cap · 保守支路容量
- 變數／單位：Irated:A；k:0至1 planning factor
- 公式：`Iplan=k*Irated；Splan=V*Iplan；Pplan=V*Iplan*PF`
- 適用／限制：k=.8係例題假設，唔係code判斷
- 例：20A×.8=16A；120V→1920VA

### circuits_lower_bound · 支路數下限
- 變數／單位：Ii:各器材估計A；C:每支路planning A>0
- 公式：`N_lower=ceil(sum(Ii)/C)`
- 適用／限制：只係下限，另須逐件分配、各相限制、inrush、保護/線材確認
- 例：3件各9A，C16A：ceil27/16=2，但兩件已18A，實需至少3支路

## 逐步例子
1. 20A120V教學支路，k=.8：20×.8=16A；120×16=1920VA；PF1先等於1920W。用15A或110V唔符合題目；而且15×110其實1650唔係1800。
2. 2部XTi4002，依此PDF 120V、4Ω/channel、1/8條件：2×9.8=19.6A；20A支路保守16A唔夠。每支路放1部，9.8<16A，係靜態估算可行；實際仲要其他負載/inrush等批准。唔係只見ceil=2就當設計完成。
3. 相同兩amp改用本PDF1/3條件：每部18.9A，合37.8A。即使分兩條保守16A支路，每部仍超16；唔可以沿用舊「每部13.5A所以分兩條就得」答案。須重新由合資格人員評估適當供電/操作配置；唔拆一部amp去兩個插蘇。
4. Laptop hum：記錄charger插入先出現→檢查正常audio接線及合適隔離介面→按設備手冊選signal ground lift；仍有或任何安全疑慮交專業人員。禁止斷mains safety ground。

## 互動圖解建議
1. VA/W雙條圖，拖PF0–1，I保持時S固定P變；說明PF低時若保持同W需要較大I。
2. Amp資料卡必填型號/文件/供電/阻抗/測試條件，唔讓使用者只輸入speaker watts就得mains amps。
3. Branch bin-packing互動卡：每件器材不可拆，顯示每支路負載及「僅教學/未驗證安全」；用3×9A與16A示ceil失敗。
4. Ground-loop概念圖分開signal shield同PE顏色；只有合規signal isolator可按，PE上無可操作lift開關；唔畫帶電接線教學。

## 練習與答案
1. 20A120V，保守80%、PF1？PF.8？
   - 答案：16A、1920VA；PF1=1920W，PF.8=1536W。呢個唔係法規合格證明。
2. Laptop拔charger無hum，絕對唔可以做乜？
   - 答案：斷mains safety ground、剪接地腳或用cheater plug。可用合適audio隔離及按手冊signal lift；電池可作有計劃臨時方案。
3. 兩部XTi4002每部9.8A可放一條保守16A branch？
   - 答案：19.6>16唔得；分開每條9.8係靜態例題可行，實際另確認inrush等。
4. 三件各9A、每branch16A，ceil=2就得？
   - 答案：唔得，任何兩件18A；需至少3條。

## 安全數碼聽力練習
1. 用數碼speech加極低60/120/180Hz hum，音量受控切換理想隔離前後示意。註明實際hum頻譜唔能單獨診斷故障；唔要求接真電器製造hum。
2. 比較balanced概念只用波形動畫與common-mode示意；唔假裝單一audio demo可驗證電氣安全。

來源：S4, S5。一般公式亦有數學推導成分；唔代表每一說法已由該來源逐條引用。

# 1.3b Entertainment electricity 進階供電概念

## 重點概念
1. 住宅常見split-phase：兩條hot相對neutral各120V，hot之間240V；呢個唔係三相。商業常見120/208V三相wye：三條hot A/B/C互差120°，各相對neutral120V，相間約208V。唔係所有場館/所有三相都係呢個制式；識計唔等於識接。
2. 平衡三相：每相相同RMS電流/相同PF時，總apparent power S=√3 VLL Iline；P要再乘true PF。I係每條line嘅電流唔係三相電流相加。唔平衡/不同PF時應按各phase實際VA/W計，簡式唔直接適用。
3. Phase balancing係按每相可用容量、實際設備及支路分配，唔淨睇總功率。100A三相唔代表可以A相300A。每相容量、其他show設備、phase安排由distro資料及合資格人員確認。
4. 三相平衡、線性相同負載嘅fundamental neutral phasor理想互相抵銷。唔平衡就有neutral current。非線性負載可有諧波；triplen即3、9、15…次諧波（60Hz系統第3係180Hz）可喺neutral同相疊加，令neutral RMS偏高。
5. 唔係所有SMPS都一定嚴重：active PFC及設計會改current waveform/harmonics；唔可以見LED/amp/computer就預言neutral過載。檢視原廠資料及由專業人員作真RMS/諧波評估。Neutral唔可因三相平衡而當無電/隨便縮細；保護、額定、是否加大neutral由正式設計決定，唔自行加double-neutral。
6. Voltage drop：線路長、截面細、電流大一般會增加壓降；接頭接觸差亦可發熱。低電壓可能令恒功率PSU拉更多電流、shutdown或影響運作。今課只教概念，無導體電阻/溫度/線徑設計公式；唔新增未教配線計算器。
7. Generator供電要考慮kW/kVA、PF、突發負載、inrush、調壓/頻率、neutral/earth、transfer topology、保護及當地要求。Neutral-ground bonding位置及方式取決於source係咪separately derived、切換裝置、既有接地等；唔用「一定自己喺generator一點bond」做操作規則。
8. 唔將audio/lighting分兩generator當常規防hum處方。不同供電域間嘅signal連接、接地與故障電流可能帶來危險；由場館/持牌承辦商按系統統籌。Company switch、feeder、generator電氣接駁及改動只交合資格且有適當授權人員。
9. 撤回舊「sound tech可以自行multimeter插入插蘇」教法。本頁只顯示假設讀數作判讀討論，無探針位置、量度順序或帶電操作。Socket tester/power conditioner顯示正常都唔能保證接地阻抗、負載下表現同整體安全。
10. N–G電壓可以受負載neutral壓降、接線故障、接觸不良或量度方式等影響，無通用≤2V合格線。H–G=0亦有多種可能，唔能單憑讀數診斷缺地。N–G8V係需要評估嘅警號而唔係特定故障結論；停止使用可疑供電安排並通知場館合資格電工，唔自己再probe或繼續show試運氣。

## 公式卡（用途見名稱；每張必須連假設展示）

### wye_voltage · 平衡wye電壓關係
- 變數／單位：VLN:V；VLL:V
- 公式：`VLL=√3*VLN`
- 適用／限制：正弦、平衡三相wye；唔用於split-phase
- 例：120×1.73205=207.846V≈208V

### three_phase · 平衡三相功率
- 變數／單位：VLL:Vrms；I:每line Arms；PF:0至1；S:VA；P:W
- 公式：`S=√3*VLL*I；P=√3*VLL*I*PF`
- 適用／限制：平衡三相；唔平衡時唔直接套用
- 例：208V100A→36.027kVA；PF1→36.027kW

### phase_planning · 三相保守例題容量
- 變數／單位：Irated:A/phase；k:planning factor；PF:0至1
- 公式：`Iplan=k*Irated；Pplan=√3*VLL*Iplan*PF`
- 適用／限制：只係已確認三相平衡之教學；k非code認證
- 例：60A208V k=.8 PF1→17.293kW

### phase_load · 相負載加總
- 變數／單位：Ii:同相設備估計Arms
- 公式：`Iphase≈sum(Ii)`
- 適用／限制：保守教學相加；實際waveform/PF與同時性另評估
- 例：9部9.8A，三相各3部→29.4A/phase

## 逐步例子
1. 60A208V三相例：先講明k=.8只係保守練習、PF=1、平衡。每相60×.8=48A；S=1.73205×208×48=17293.18VA=17.293kVA；PF1→17.293kW。若PF=.8，同48A只係13.835kW；唔可以將17.3kW當通用實際可用。
2. 9部amp，每部本例假設9.8A：總88.2A呢個係三相設備電流加總，唔係單條line88.2A。每相3部：3×9.8=29.4A；保守cap60×.8=48A，29.4<48，靜態phase load通過例題。每相仲要分合適branch：若每branch保守16A，一部9.8A可以，兩部19.6A唔可以，所以唔可當每相一條普通20A支路。
3. 100A三相6部9.8A：全放A→58.8A、B/C零；每相2部→19.6A。平衡可減fundamental neutral及平均用容量，但唔保證harmonic neutral=0。
4. 假設已有合資格人員報告N–G8V：單憑8V無法分辨neutral壓降/接線故障等；標記可疑供電、停止依賴該路、通知場館合資格電工按正式程序檢查。唔轉去斷地消hum，亦唔叫學員重測live mains。

## 互動圖解建議
1. 120°三相phasor動畫與split-phase180°並排，純圖形無接線端子操作。顯示120/208同120/240不同。
2. Amp卡拖到A/B/C相，顯示每相RMS估計、保守cap及各branch bin。相層級綠色只叫「例題容量內」，唔叫安全認證。
3. Fundamental三條正弦相加接近零；第3 harmonic三條同相加。PFC開關只用教學waveform，唔代表某品牌設備量測。
4. Voltage-drop概念圖：線長/相對粗幼/負載三slider只顯示趨勢；未有導體/法規模型唔顯示可施工AWG答案。
5. 8V案例多選決策樹：正確係停止可疑安排/報電工；唔提供live測試按鈕或N–G合格threshold。

## 練習與答案
1. 60A208V三相、k=.8 PF1約幾kW？
   - 答案：60×.8=48A/line；√3×208×48/1000=17.293kW，理想平衡、保守例題唔係code認證。
2. 9部9.8A如何平衡？有無超48A？
   - 答案：每相3部29.4A，低於48A；另安排足額branches及檢查啟動/其他負載，唔能將3部放一條16A計劃容量支路。
3. N–G8V原因/處理？
   - 答案：可能負載neutral drop、接觸/接線問題或量度因素等，唔能單讀數診斷；停止使用可疑供電並通知合資格電工。
4. 三相電流平衡neutral必定0？
   - 答案：線性相同負載fundamental理想0；非線性triplen、其他不平衡可令neutral有電流。
5. 所有現代amp都需要double neutral？
   - 答案：唔係；PFC/PSU設計、實際諧波及正式配電設計決定。
6. 獨立generator一定少hum更安全？
   - 答案：唔係；跨供電域接地/信號路徑可能更複雜，須正式工程規劃。

## 安全數碼聽力練習
1. 本課唔需要用聽覺判電源安全。可選低音量數碼60Hz sine加少量180Hz，純示諧波音色；屏幕寫明「聽唔出neutral有無過載」。預留headroom、短播放，唔接真配電示範。
2. 以動畫代替所有觸電、短路、故障或帶電量度練習。無需生成音訊素材。

來源：S4。一般公式亦有數學推導成分；唔代表每一說法已由該來源逐條引用。

# 來源及核實界線
查閱日：2026-11-05（America/Toronto）；只標本次工具實際結果。

## S1 · WebFetch成功
https://www.routledge.com/Sound-Systems-Design-and-Optimization-Modern-Techniques-and-Tools-for-Sound-System-Design-and-Alignment/McCarthy/p/book/9780415731010
出版社確認Bob McCarthy第三版、2016、600頁及設計/量測/疊加概念範圍。係核心概念參考，未讀書本文字，唔聲稱逐條公式出自書中。

## S2 · WebFetch成功
https://audioxpress.com/article/measurements-for-loudspeaker-modeling-files
Charlie Hughes文章：模型需準確magnitude/phase、近遠場及直線孔徑h²f/(2c)尺度。
限制：該頁式1文字將λ寫成f/c有量綱錯誤；本教材使用c/f。文中後段critical distance係測量旋轉中心誤差限制，唔同房間direct/reverb critical distance，勿混淆。

## S3 · WebFetch成功
https://www.nti-audio.com/en/support/know-how/how-to-objectively-test-a-high-end-audio-system-part-2
反射可形成等間距comb notches、RT/ambient noise與量測紀錄重要。
限制：家居案例，唔用其RT/NC建議作演出場館通則。

## S4 · WebFetch成功
https://esasafe.com/safety/
安省ESA安全及occupational safety入口。
限制：只係一般安全頁，唔構成已核實OESC具體條文、80%規則或generator bonding設計依據。

## S5 · WebFetch成功讀到表格
https://www.fullcompass.com/common/files/35096-XTiSeries2PowerDrawandThermal.pdf
Crown XTi2 power draw文件嘅經銷商鏡像，XTi4002指定120V60Hz及每channel阻抗/測試條件電流。
限制：唔係Crown官網hosting，版本日期未確定；其他手冊9.8/10.5A差異未比對，唔跨文件混值。

## U1 · WebFetch403，未核實
https://jblpro.com/en-US/products/vrx932la-1
只作待核實型號入口；無引用數值。

## U2 · WebFetch403，未核實
https://www.jblpro.com/en-US/products/vrx932lap
只作待核實型號入口；無引用數值。

## U3 · WebFetch只回標題/頁殼，未讀到正文
https://www.shure.com/en-US/insights/what-is-the-3-to-1-rule
唔當本次3:1細節已獨立核實。

## U4 · WebFetch403，未核實
https://www.crownaudio.com/en/products/xti-4002
本次依S5鏡像，唔聲稱官網已開啟核實。

# Developer implementation notes
- JSON係完整內容資料源；Markdown由同一份資料輸出。全部formula有穩定id，可按lesson渲染。教具衍生公式（phase、comb response、headroom、PF）係解釋已教概念，唔係新增獨立課程。
- 所有實數輸入拒絕NaN/Infinity，距離/頻率/聲速須>0；delay≥0；delay=0時無comb週期，唔做除0。PF反算電流時須>0，0時只容許正向P=0顯示。
- 單位明確：s/ms、m/cm轉換只做一次；保留內部double precision，UI通常2–3有效小數；dB相加必須說明reference與correlation。
- True null顯示「理想−∞」，圖表可裁到−60dB但明示係顯示下限。a=0無comb；polarity inversion時null/peak互換，τ=0且a=1反極性全部理想抵銷。
- 線源計算器標「理想模型比較」，唔預設自動near/far分段。曲陣列長度及VRX無可用通用預測calculator；可提供幾何示意但不得自動輸出throw/range。
- 音訊engine先降低各路電平至少12dB預留疊加空間；加noise/reverb/clip模擬後設安全輸出上限及peak meter。峰值限制唔係耳部SPL安全保證；無autoplay、無真實feedback、無真電源試驗。
- 供電UI永遠顯示VA同W區別，PF未知時W顯示未知而唔預設=VA。若例題PF1，要突出假設。80%預設僅教學參數；即使計算綠色亦只代表數學假設內。
- 支路calculator先顯示lower bound再做逐件bin分配；不得把單部器材拆開分配。加入each-device>C、phase、已知其他負載檢查；不宣稱解決inrush/保護協調/諧波/法規。
- 無CL/QL dBu↔dBFS自動換算；無N–G safe/unsafe閾值；無live mains操作或generator bonding施工內容。未核實source徽章同已開啟來源分開。
- 日後新課由教學agent審校後另更新；此交接唔代表已設定自動同步或有未來課程內容。

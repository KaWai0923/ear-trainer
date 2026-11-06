/* Expandable per-parameter guidance, Moss-written, not console manufacturer documentation. */
'use strict';
const FXHelp=(()=>{
const h=(what,range,use,mistake)=>({what,range,use,mistake});const shared={
 on:h('啟用 FX send／return；Bypass 會淡出 send 同 return。','先 OFF，調低實體音量再 ON。','比較 dry / wet，Stop 會終止所有 tails。','Bypass 唔等於清空 buffer；唔好將 FX 當安全設備。'),
 send:h('由 channel 分一份訊號去 FX；0 dB=unity，−60 dB 近乎靜音。','先 −24 至 −12 dB，小步增加。','先少量 send，按 source／編曲調整。','Send 同 return 一齊大推，容易掩蓋 clarity／食 headroom。'),
 tap:h('Pre 取 processed channel、fader 前；Post 跟 channel fader。','FOH FX 通常先用 Post；特殊需求再 Pre。','Post 方便 vocal 收 fader 時 FX 跟住收。','Pre 時拉低 fader 未必收走 FX；mute／routing 要另外確認。'),
 returnLevel:h('FX bus 返回 dry mix 嘅電平，經保護再入 master limiter。','先 −18 至 −6 dB。','用 return 作整體 FX balance。','Limiter 只管數碼訊號，唔保證耳機或 PA 聲壓安全。'),
 mix:h('Aux wet mix：只縮放 wet return，唔額外複製 dry。','Aux 通常 100%，用 send／return 控制比例。','0% 可暫時聽 dry；100% 仍然有原本 dry channel。','唔好將 aux mix 當 insert dry/wet crossfade。')};
const reverb={
 type:h('選原創 generated-IR 音色：hall／plate／room／chamber／spring／gated／reverse。','Vocal 可由 plate／hall、speech 由短 room 開始。','Gated／reverse 係效果 envelope，唔係自然 RT60。','名稱唔代表精確模擬任何品牌或真實空間。'),
 preDelay:h('將 wet onset 同 dry 分開；唔會延遲原聲。','Vocal 約 15–60 ms；小 room 約 0–20 ms。','保留字頭清晰，同節奏比較。','太長可能聽成獨立 slap；唔係 fill alignment delay。'),
 decay:h('自然類型嘅 mid-band 名義 RT60；gated／reverse 則係 envelope 長度。','Speech 可先 .3–1 s；vocal 約 1–2.5 s。','隨速度、編曲同原場殘響調整。','長 RT60 唔代表較高級；濾波、band multipliers 同截尾會改量到嘅衰減。'),
 size:h('改 early-reflection 間距及 late onset，唔直接改 RT60。','先 30–70%。','調空間尺度感，再獨立調 decay。','Size 唔係實際平方米或座位數。'),
 diffusion:h('改 late IR noise 嘅平滑／擴散結構。','先 50–90%。','較平滑可減少顆粒感；按 transient 聽。','呢個係 IR texture 控制，唔係完整 FDN diffusion 定義。'),
 density:h('改 late IR 時間事件密度；能量另有 normalization。','先 60–100%。','低值試稀疏／顆粒 texture。','稀疏尾唔一定係聲壓低；level-match 比較。'),
 earlyLevel:h('控制早期離散 reflections 相對能量，亦受 ER/late balance 影響。','先 −12 至 −3 dB。','建立 proximity／room cue。','ER 多唔代表一定更清晰；亦可能掩蓋字頭。'),
 balance:h('ER／Late balance：0%=ER、100%=late tail；IR 會重作能量 normalization。','先 50–80% late。','短 room 可多 ER；長氣氛可多 late。','係相對形狀控制，唔係兩路各自絕對 dB meter。'),
 lowDecay:h('低 crossover 以下 band 嘅衰減倍率。','先 .7–1.2× mid decay。','減少低頻拖尾，避免糊低音。','太長會食 headroom；最大 IR 8 秒，長設定會截尾。'),
 highDecay:h('高 crossover 以上 band 嘅衰減倍率，較短即 HF damping。','先 .3–1×。','令 tail 暖啲，減少 sibilance smear。','唔等於 input／return LPF；兩者會一齊影響聲色。'),
 lowCross:h('Low decay band 嘅一階分頻位置。','約 150–500 Hz 起步。','按 vocal body／bass tail 分界調整。','唔係 brick-wall crossover，各 band 會重疊。'),
 highCross:h('High decay band 嘅一階分頻位置。','約 3–8 kHz。','決定邊段高頻開始縮短／延長 tail。','只改高頻 decay，唔能夠醫原聲齒音。'),
 modDepth:h('Convolver 後 wet delay modulation 深度；只改 wet，唔係 time-varying IR。','先 0–1.5 ms，最多 4 ms。','少量 chorus／movement；單聲道亦要檢查。','過深會 pitch wobble，唔係更多真實空間。'),
 modRate:h('Wet modulation LFO 速度。','約 .2–1 Hz 起步。','慢速 movement，留意持續音。','有 depth 先聽到；唔係 BPM note sync。'),
 width:h('Mid/side width：0% mono、100% 原 stereo、>100% 擴闊 sides。','先 50–100%。','留意 mono compatibility 同場地左右覆蓋。','超寬可能左右唔均勻，唔代表全場都包圍。'),
 inputHP:h('入 reverb 前 HPF，減低低頻激發。','約 80–250 Hz。','Vocal／speech 清走 rumble，保留需要 body。','太高會薄；唔等於對 dry channel 開 HPF。'),
 inputLP:h('入 reverb 前 LPF，減少高頻激發。','約 6–16 kHz。','避免齒音激發太多亮 tail。','唔會修復已 clipping 或原聲 sibilance。'),
 returnHP:h('Reverb return HPF，唔影響 dry。','約 100–300 Hz。','清走 wet mud，同 bass／kick 留位。','太高會失去空間 body，應 level-match。'),
 returnLP:h('Reverb return LPF，唔影響 dry。','約 4–12 kHz。','控制亮度同齒音拖尾。','唔係 de-esser，會整段高頻一齊減。'),
 lowShelf:h('Return 250 Hz low shelf。','先 0，必要時約 −1 至 −6 dB。','細調 wet body，配合 HPF。','正 gain 會食 headroom；唔好用佢填原場 spatial null。'),
 highShelf:h('Return 6 kHz high shelf。','先 0，必要時約 −1 至 −6 dB。','調 tail air／brightness。','唔好因為大聲就覺得靚；先控制 source。')};
const delay={
 time:h('左 delay leg 嘅時間；Mono 時兩邊都跟左。','Slap 約 70–140 ms；節奏 echo 依 BPM。','毫秒模式可試 speech／vocal clarity。','唔係對齊 PA／fill 嘅系統 delay。'),
 timeR:h('右 delay leg 時間；Mono 忽略。Ping-pong 一次來回時間係 L+R。','可先同 L 相同，或用相容 subdivisions。','Stereo 做不同節奏，檢查 mono。','唔好將 ping-pong 每 leg 時間誤當 full cycle。'),
 bpm:h('四分音符基準：60000/BPM ms。','跟實際曲速；app 40–240 BPM。','用 Tap tempo 取最近間隔平均，再選 note。','BPM 唔會自動分析錄音；同步時間會 cap 到 10–2000 ms。'),
 sync:h('開啟後時間由 BPM × note factor 決定。','Tempo FX 常用；slap 可用自由 ms。','畫面會列實際已 cap 嘅 L/R ms。','Sync ON 時手動 time 唔生效。'),
 note:h('左 subdivision；dotted=1.5×、triplet=2/3×。','1/4、1/8 dotted 都係常見起點。','由簡單少 repeats 開始。','BPM 係 quarter-note 定義，唔係當 dotted 做新的拍號。'),
 noteR:h('右 subdivision；Mono 忽略。','先同 L 或 complementary note。','Stereo／ping-pong 可創造節奏對答。','左右疊加可能遮字，唔好只戴單邊耳機判斷。'),
 mode:h('Mono=單一 L 時間；Stereo=獨立兩 loop；Ping-pong=mono input 入左，feedback 跨左右。','FOH 要顧及單聲道／左右覆蓋。','先 stereo／mono A/B。','Ping-pong 未必每個座位都聽齊左右。'),
 feedback:h('每次循環回送比例；硬上限 94%，無無限 feedback／freeze。','先 10–40%；高值只作低音量短試。','控制 repeats 尾長；Stop 會切斷 loop。','接近上限尾好長，唔好用 100% 製造 self-oscillation。'),
 loopHP:h('每次 repeat 經 loop HPF；custom 為一階。','約 80–300 Hz。','減 repeats 低頻累積。','Return EQ 同 loop EQ 唔同：loop 每次再濾一次。'),
 loopLP:h('每次 repeat 經 loop LPF；custom 為一階。','約 2–8 kHz。','令 repeats 逐次變暗。','LPF 太低可能令 delay 聽唔清，但唔應靠盲推 return 補。'),
 saturation:h('Feedback path 嘅 bounded tanh tape-like 軟飽和。','先 0–25%。','逐 repeat texture／失真，唔係精確 tape model。','Native fallback 呢項停用；失真唔等於 loudness 配對。'),
 wow:h('慢速 .7 Hz delay-time modulation，最多約 ±2 ms。','先 0–20%。','舊 tape-like pitch movement。','高值會走音；native fallback 停用。'),
 flutter:h('較快速 6.7 Hz time modulation，最多約 ±.3 ms。','先 0–15%。','少量 roughness／movement。','唔係真機 wow/flutter 測量或規格；fallback 停用。'),
 duck:h('由 pre-fader dry sidechain 控制 wet reduction，最高呢個 dB amount。','Vocal 先 3–9 dB，OFF=0。','唱字時收 echo，停句後回復。','Duck 唔會壓 dry；pre-fader detector 未必跟 mute/fader 邏輯，fallback 停用。'),
 duckThreshold:h('Dry detector 超過呢個 level 開始逐步 duck。','先 −36 至 −18 dBFS，按 source 調。','配合 duck amount，同輸入 level 比較。','低 level 錄音未過 threshold 就唔會 duck。'),
 duckRelease:h('Duck envelope release τ；attack 固定約 10 ms。','約 150–500 ms。','令 echo 喺句尾自然返嚟。','太快 pumping、太慢後句都未返；唔係完整 detector timing 保證。'),
 diffusion:h('Feedback loop 加入 all-pass smear blend；第一個 tap 仍較清楚。','先 0–30%。','令後續 repeats 變柔／擴散。','唔等於 reverb RT60；native fallback 停用。')};
function get(section,key){return shared[key]||(section==='reverb'?reverb:delay)[key]}
function html(v){return '<details class="parameter-help"><summary>ⓘ 解說／用法</summary><p><b>作用：</b>'+v.what+'</p><p><b>起點（唔係標準）：</b>'+v.range+'</p><p><b>何時用：</b>'+v.use+'</p><p><b>常見錯誤：</b>'+v.mistake+'</p></details>'}
return {get,html,h};})();

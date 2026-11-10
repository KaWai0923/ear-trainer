/* Pure, testable scheduling and storage helpers. No browser dependencies. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VocabCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const P=typeof module==='object'&&module.exports?require('./phonics.js'):globalThis.VocabPhonics;
const DAY=86400000, SCHEMA=1;
const CATEGORIES=['買嘢飲食','健康睇醫生','銀行理財','學校育兒','屋企維修','交通出行','政府表格','工作溝通'];
const key=s=>String(s).trim().toLowerCase().replace(/\s+/g,' ');
// Autofill helpers (pure). A machine translation is only usable as 中文解釋 when it
// contains Chinese characters and is not just the English query echoed back.
const CJK=/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u{20000}-\u{2ffff}]/u;
function hasCJK(text){return CJK.test(String(text||''));}
function usableTranslation(source,translated){const t=String(translated||'').trim();if(!t||!hasCJK(t))return '';if(key(t)===key(source))return '';return t;}
// dictionaryapi.dev phonetics: prefer US, then CA, then unlabelled; British/Australian
// audio is skipped (device en-CA/en-US TTS is used instead). Accent is reported honestly.
function audioAccent(url){const m=/-(us|ca|uk|au|ie|nz|in|sco)\.(?:mp3|ogg|wav|m4a)(?:\?|$)/i.exec(String(url||''));return m?m[1].toUpperCase():'';}
function looksBritish(ipa){return /ɒ|əʊ|ː/.test(String(ipa||''));}
function pickPhonetics(entries){
 const list=(Array.isArray(entries)?entries:[entries]).filter(Boolean);
 const phon=list.flatMap(d=>Array.isArray(d.phonetics)?d.phonetics:[]).map(p=>({text:typeof p.text==='string'?p.text.trim():'',audio:typeof p.audio==='string'?p.audio.trim():'',accent:audioAccent(p.audio)}));
 const tops=list.map(d=>typeof d.phonetic==='string'?d.phonetic.trim():'').filter(Boolean);
 const rank={US:0,CA:1,'':2};const na=phon.filter(p=>p.accent in rank).sort((a,b)=>rank[a.accent]-rank[b.accent]);
 const audioPick=na.find(p=>p.audio&&p.accent!=='')||na.find(p=>p.audio&&!looksBritish(p.text));
 let ipa='',ipaAccent='unknown',otherIpa='',otherIpaAccent='';
 const usText=na.find(p=>p.text&&(p.accent==='US'||p.accent==='CA'));
 if(usText){ipa=usText.text;ipaAccent=usText.accent;}
 else{const neutral=[...na.filter(p=>p.text).map(p=>p.text),...tops].find(t=>!looksBritish(t));const any=phon.find(p=>p.text)?.text||tops[0]||'';
  if(neutral){ipa=neutral;ipaAccent='unknown';}else if(any){otherIpa=any;otherIpaAccent=phon.find(p=>p.text===any&&p.accent)?.accent||'UK';}}
 const skipped=phon.filter(p=>p.audio&&!(p.accent in rank)).map(p=>p.accent);
 let audio=audioPick?.audio||'';if(audio.startsWith('//'))audio='https:'+audio;if(audio&&!/^https:\/\//i.test(audio))audio='';
 return {ipa,ipaAccent,otherIpa,otherIpaAccent,audio,audioAccent:audio?(audioPick.accent||'unknown'):'',skippedAudio:[...new Set(skipped)]};
}
function dayKey(time=Date.now()){const d=new Date(time);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function defaultState(){return {schema:SCHEMA,own:[],cards:{},activity:{},settings:{newPerDay:10,voice:'',speed:'normal'}};}
function schedule(previous,grade,now=Date.now()){
 if(!['again','hard','good','easy'].includes(grade))throw Error('Unknown grade');
 const p=previous||{ease:2.5,interval:0,reps:0,lapses:0,reviews:0};
 let ease=p.ease,interval,reps=p.reps,lapses=p.lapses;
 if(grade==='again'){ease=Math.max(1.3,ease-.2);interval=0;reps=0;lapses++;}
 else{reps++;if(grade==='hard'){ease=Math.max(1.3,ease-.15);interval=Math.max(1,Math.round(p.interval*1.2));}
 else if(grade==='easy'){ease=Math.min(3.5,ease+.15);interval=p.interval?Math.max(p.interval+1,Math.round(p.interval*p.ease*1.3)):4;}
 else interval=p.interval?Math.max(p.interval+1,Math.round(p.interval*p.ease)):1;}
 interval=Math.min(3650,interval);
 return {ease,interval,reps,lapses,reviews:(p.reviews||0)+1,due:grade==='again'?now+60000:now+interval*DAY,introduced:p.introduced||dayKey(now),last:now};
}
function queue(words,state,now=Date.now()){
 const today=dayKey(now), introduced=Object.values(state.cards).filter(c=>c.introduced===today).length;
 const due=words.filter(w=>state.cards[w.id]&&state.cards[w.id].due<=now).sort((a,b)=>state.cards[a.id].due-state.cards[b.id].due);
 // Put personal vocabulary first, so additions do not sit behind the whole built-in bank.
 const fresh=words.filter(w=>!state.cards[w.id]).sort((a,b)=>Number(b.id.startsWith('u'))-Number(a.id.startsWith('u'))).slice(0,Math.max(0,state.settings.newPerDay-introduced));
 return [...due,...fresh];
}
function streak(activity,now=Date.now()){
 let d=dayKey(now), n=0;const prev=k=>dayKey(new Date(k+'T12:00:00').setDate(new Date(k+'T12:00:00').getDate()-1));
 if(!activity[d])d=prev(d);while(activity[d]){n++;d=prev(d);}return n;
}
function stats(words,state,now=Date.now()){
 const ids=new Set(words.map(w=>w.id)),cards=Object.entries(state.cards).filter(([id])=>ids.has(id)).map(([,c])=>c);
 return {seen:cards.length,learned:cards.filter(c=>c.interval>=21).length,due:cards.filter(c=>c.due<=now).length,streak:streak(state.activity,now),today:state.activity[dayKey(now)]||0,newToday:cards.filter(c=>c.introduced===dayKey(now)).length};
}
/* Levenshtein alignment. Each item identifies a correct, substituted, missing or extra letter. */
function diff(expected,actual){
 const a=Array.from(key(expected)),b=Array.from(key(actual));if(a.length>200||b.length>200)throw Error('Answer too long');
 const dp=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
 for(let i=0;i<=a.length;i++)dp[i][0]=i;for(let j=0;j<=b.length;j++)dp[0][j]=j;
 for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
 let i=a.length,j=b.length,out=[];while(i||j){if(i&&j&&dp[i][j]===dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1)){out.push({type:a[i-1]===b[j-1]?'equal':'replace',expected:a[--i],actual:b[--j]});}
 else if(i&&dp[i][j]===dp[i-1][j]+1)out.push({type:'missing',expected:a[--i],actual:''});else out.push({type:'extra',expected:'',actual:b[--j]});}return out.reverse();
}
function cleanWord(w,own=false){
 if(!w||typeof w!=='object')throw Error('生字格式錯誤');
 const fields={id:100,word:100,ipa:150,pos:80,meaning:500,example:1000,translation:1000,category:80,definition:1500,audio:2000};let out={};
 for(const [f,max]of Object.entries(fields)){if(w[f]!==undefined&&typeof w[f]!=='string')throw Error('生字欄位必須係文字');out[f]=(w[f]||'').trim();if(out[f].length>max)throw Error('生字欄位太長');}
 if(!/^(b\d{3,4}|u[\w-]{1,90})$/.test(out.id)||(own&&!out.id.startsWith('u'))||!out.word||!out.meaning||!out.category)throw Error('缺少必填欄位或 ID 錯誤');
 if(out.audio&&!/^https:\/\//i.test(out.audio))throw Error('發音連結必須係 HTTPS');if(w.phonics)out.phonics=P.validate(w.phonics,out.word);else if(own)out.phonics=P.draft(out.word,out.ipa);return out;
}
function validateState(input,builtins){
 if(!input||input.schema!==SCHEMA||!Array.isArray(input.own)||input.own.length>5000||!input.cards||typeof input.cards!=='object'||Array.isArray(input.cards)||!input.activity||typeof input.activity!=='object'||Array.isArray(input.activity))throw Error('備份格式／版本唔支援');
 const out=defaultState(),ids=new Set(builtins.map(w=>w.id)),names=new Set(builtins.map(w=>key(w.word)));
 out.own=input.own.map(w=>{const c=cleanWord(w,true);if(ids.has(c.id)||names.has(key(c.word)))throw Error('備份有重複生字');ids.add(c.id);names.add(key(c.word));return c;});
 for(const [id,c]of Object.entries(input.cards)){if(!ids.has(id))throw Error('備份包含唔認得嘅生字進度');
 if(!c||typeof c!=='object'||!['ease','interval','reps','lapses','reviews','due','last'].every(k=>typeof c[k]==='number'&&Number.isFinite(c[k])&&c[k]>=0)||c.ease<1.3||c.ease>3.5||c.interval>3650||!/^\d{4}-\d{2}-\d{2}$/.test(c.introduced)||!Number.isFinite(Date.parse(c.introduced)))throw Error('進度數值錯誤');
 out.cards[id]={};for(const f of ['ease','interval','reps','lapses','reviews','due','last','introduced'])out.cards[id][f]=c[f];}
 for(const [d,n]of Object.entries(input.activity)){if(!/^\d{4}-\d{2}-\d{2}$/.test(d)||!Number.isFinite(Date.parse(d))||!Number.isSafeInteger(n)||n<0)throw Error('學習紀錄錯誤');out.activity[d]=n;}
 const limit=input.settings?.newPerDay;if(!Number.isInteger(limit)||limit<1||limit>50)throw Error('每日新字數量錯誤');out.settings.newPerDay=limit;
 if(['normal','slow','slower'].includes(input.settings.speed))out.settings.speed=input.settings.speed;
 if(typeof input.settings.voice==='string')out.settings.voice=input.settings.voice.slice(0,300);return out;
}
return {DAY,SCHEMA,CATEGORIES,key,hasCJK,usableTranslation,audioAccent,looksBritish,pickPhonetics,dayKey,defaultState,schedule,queue,stats,streak,diff,cleanWord,validateState};
});

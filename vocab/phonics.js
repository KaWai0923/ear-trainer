/* Phonics utilities, intentionally conservative for unreviewed personal words. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VocabPhonics=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const LETTERS={a:'ay',b:'bee',c:'see',d:'dee',e:'ee',f:'eff',g:'gee',h:'aitch',i:'eye',j:'jay',k:'kay',l:'ell',m:'em',n:'en',o:'oh',p:'pee',q:'cue',r:'ar',s:'ess',t:'tee',u:'you',v:'vee',w:'double you',x:'ex',y:'why',z:'zee'};
const SIMPLE={a:'æ',e:'ɛ',i:'ɪ',o:'ɑ',u:'ʌ',b:'b',c:'k',d:'d',f:'f',g:'ɡ',h:'h',j:'dʒ',k:'k',l:'l',m:'m',n:'n',p:'p',q:'k',r:'r',s:'s',t:'t',v:'v',w:'w',x:'ks',y:'j',z:'z'};
const DIGRAPHS={igh:'aɪ',sh:'ʃ',ch:'tʃ',th:'θ',ph:'f',ng:'ŋ',ck:'k',qu:'kw',ee:'i',ea:'i',ai:'eɪ',ay:'eɪ',oa:'oʊ',oo:'u',oi:'ɔɪ',oy:'ɔɪ',ou:'aʊ',ow:'aʊ',ar:'ɑr',er:'ər',ir:'ɜr',ur:'ɜr'};
function needsSpeechGap(nav={}){const ua=nav.userAgent||'';return isIOS(nav)||(/Safari\//.test(ua)&&!/Chrome|Chromium|CriOS|Edg|Android/.test(ua));}
function isIOS(nav={}){return /iPad|iPhone|iPod/i.test(nav.userAgent||'')||(/Mac/i.test(nav.platform||'')&&nav.maxTouchPoints>1);}
function rate(speed,ios=false){if(speed===true)speed='slow';if(speed===false)speed='normal';return {normal:.9,slow:ios?.45:.6,slower:ios?.28:.4}[speed]??.9;}
function normalizeSpeech(text){return String(text).toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');}
function matchSpeech(expected,actual){let heard=normalizeSpeech(actual);for(const word of String(expected).split(/[ -]+/)){if(/^[A-Z]{2,}$/.test(word)){const pattern=new RegExp('\\b'+word.toLowerCase().split('').join('\\s*')+'\\b','g');heard=heard.replace(pattern,word.toLowerCase());}}return normalizeSpeech(expected)===heard;}
function splitLetters(word){return Array.from(String(word)).map(c=>LETTERS[c.toLowerCase()]||(/[ -]/.test(c)?'space':c==="'"||c==='’'?'apostrophe':'')).filter(Boolean);}
function draft(word,ipa=''){
 const syllables=[];const re=/[a-z]+(?:['’][a-z]+)?|\d+/gi;let match,last=0,wi=-1;
 while((match=re.exec(word))){wi++;const token=match[0];const low=token.toLowerCase();
  // Written vowel nuclei, keep common digraphs together, remove silent final e.
  let nuclei=[...low.matchAll(/[aeiouy]+/g)].map(m=>({start:m.index,end:m.index+m[0].length}));
  const silentE=nuclei.length>1&&/[^aeiou]e$/.test(low)&&!/[bcdfghjklmnpqrstvwxyz]le$/.test(low);
  if(silentE)nuclei=nuclei.filter(n=>n.start!==low.length-1);
  let starts=[0];for(let n=1;n<nuclei.length;n++){const a=nuclei[n-1],b=nuclei[n],between=low.slice(a.end,b.start);let cut=between.length<=1?a.end:between.length===2&&/^(ch|sh|th|ph|wh)$/.test(between)?a.end:b.start-1;starts.push(Math.max(starts[starts.length-1]+1,cut));}
  starts=[...new Set(starts)].filter(x=>x<token.length);
  for(let s=0;s<starts.length;s++){const text=token.slice(starts[s],starts[s+1]??token.length),groups=[];let i=0;
   while(i<text.length){const tail=text.slice(i).toLowerCase();const dig=Object.keys(DIGRAPHS).find(x=>tail.startsWith(x));const letters=dig?text.slice(i,i+dig.length):text[i];let sound=dig?DIGRAPHS[dig]:SIMPLE[letters.toLowerCase()]||'';
    if(s===starts.length-1&&i===text.length-1&&letters.toLowerCase()==='e'&&silentE)sound='';
    if(silentE&&i+starts[s]===low.search(/[aeiou]/)&&/[aeiou]/.test(letters.toLowerCase()))sound={a:'eɪ',e:'i',i:'aɪ',o:'oʊ',u:'ju'}[letters.toLowerCase()]||sound;
    groups.push({letters,ipa:sound,kind:sound?'sound':'silent',rule:`自動估計：${letters} → ${sound?'/'+sound+'/':'∅'}。未核對，英文例外好多，請按字典修正。`});i+=letters.length;
   }
   if(!groups.some(g=>g.ipa)){groups[0].ipa='?';groups[0].kind='sound';}
   syllables.push({text,ipa:groups.map(g=>g.ipa).join('')||'?',stress:s===0?1:0,before:s===0?word.slice(last,match.index):'',wordIndex:wi,groups,cue:text});
  }last=match.index+token.length;
 }
 if(syllables.length&&last<word.length){const tail=word.slice(last),s=syllables[syllables.length-1];s.text+=tail;s.groups.push({letters:tail,ipa:'',kind:'silent',rule:'標點符號，唔另讀一節。'});}
 if(!syllables.length)syllables.push({text:String(word)||'?',ipa:'?',stress:0,before:'',wordIndex:0,cue:String(word),groups:[{letters:String(word)||'?',ipa:'?',kind:'sound',rule:'暫時無法估計，請手動核對。'}]});
 return {version:1,source:'estimated',accent:'自動估計，未核對',note:'呢個係規則估計，唔係已核實嘅音節／IPA／重音。英文不規則拼法好多；請用下面編輯欄同字典核對。'+(ipa?' 原有整詞 IPA：'+ipa:''),syllables};
}
function validate(p,word){
 if(!p||p.version!==1||!['curated','estimated','edited'].includes(p.source)||!Array.isArray(p.syllables)||!p.syllables.length||p.syllables.length>100)throw Error('拼讀資料格式錯誤');
 const text=(v,max)=>{if(typeof v!=='string'||v.length>max)throw Error('拼讀欄位格式／長度錯誤');return v;};
 const out={version:1,source:p.source,accent:text(p.accent||'',100),note:text(p.note||'',3000),syllables:[]};
 for(const s of p.syllables){if(![0,1,2].includes(s.stress)||!Number.isInteger(s.wordIndex)||s.wordIndex<0||s.wordIndex>99||!Array.isArray(s.groups)||!s.groups.length||s.groups.length>100)throw Error('音節／重音格式錯誤');const copy={text:text(s.text,100),ipa:text(s.ipa,200),stress:s.stress,before:text(s.before||'',100),wordIndex:s.wordIndex,cue:text(s.cue||s.text,200),groups:[]};if(!copy.text||!copy.ipa)throw Error('音節同 IPA 唔可以留空');
 for(const g of s.groups){if(!['sound','silent','shared'].includes(g.kind))throw Error('字母組類型錯誤');copy.groups.push({letters:text(g.letters,100),ipa:text(g.ipa,200),kind:g.kind,rule:text(g.rule,2000)});}
 if(copy.groups.map(g=>g.letters).join('')!==copy.text||copy.groups.map(g=>g.ipa).join('')!==copy.ipa)throw Error('字母組同音節嘅拼法／IPA 對唔上');out.syllables.push(copy);}
 if(out.syllables.map(s=>s.before+s.text).join('').toLowerCase()!==String(word).toLowerCase())throw Error('拼讀分節同英文生字唔一致');return out;
}
return {LETTERS,isIOS,needsSpeechGap,rate,normalizeSpeech,matchSpeech,splitLetters,draft,validate};
});

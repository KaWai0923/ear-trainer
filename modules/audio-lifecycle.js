'use strict';
const AudioLifecycle=(()=>{
 let watched=null,resuming=null;
 const listeners=new Set();const notify=()=>{for(const fn of listeners)fn(watched?.state||'未啟動')};
 function watch(c){if(watched===c)return;watched=c;resuming=null;c.addEventListener?.('statechange',()=>{if(watched!==c)return;if(['suspended','interrupted','closed'].includes(c.state)){stop();pauseTrainingSession()}notify()});notify()}
 async function resume(c,timeout=3000){watch(c);if(document.hidden)throw Error('請返回前景，再點一下播放');if(c.state==='closed')throw Error('AudioContext 已關閉；請用「重建音訊」');if(c.state==='running')return;if(resuming)return resuming;resuming=new Promise((resolve,reject)=>{let settled=false;const timer=setTimeout(()=>{if(!settled){settled=true;reject(Error('音訊恢復超時：請再點恢復，或重建音訊'))}},timeout);Promise.resolve(c.resume()).then(()=>{if(settled)return;settled=true;clearTimeout(timer);c.state==='running'?resolve():reject(Error('音訊仍然 '+c.state+'；請再點一下恢復'))},e=>{if(!settled){settled=true;clearTimeout(timer);reject(e)}})});const task=resuming;try{await task}finally{if(resuming===task)resuming=null;notify()}}
 async function rebuild(){stop();pauseTrainingSession();const old=typeof ctx==='undefined'?null:ctx;if(typeof Explore!=='undefined')Explore.live=null;if(typeof Course!=='undefined')Course.liveGain=null;ctx=null;master=limiter=ceiling=null;if(old)try{await Promise.race([old.close(),new Promise(r=>setTimeout(r,600))])}catch{}watched=null;resuming=null;notify();status('音訊已重建；保持停聲，請重新按播放。')}
 return {watch,resume,rebuild,onState(fn){listeners.add(fn);notify()},state:()=>watched?.state||'未啟動'};
})();

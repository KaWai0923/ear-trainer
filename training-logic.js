/* Pure scoring rules, also exercised by the Node regression suite. */
(function(root){
 'use strict';
 const clamp=x=>Math.max(0,Math.min(1,x));
 const octave=(a,b)=>Math.abs(Math.log2(Math.max(.01,a)/Math.max(.01,b)));
 function eq(answer,target){
  const skills={frequency:clamp(1-octave(answer.freq,target.freq)),gain:clamp(1-Math.abs(answer.gain-target.gain)/12),Q:clamp(1-octave(answer.Q,target.Q)/3),direction:Math.sign(answer.gain)===Math.sign(target.gain)?1:0};
  const weighted=.6*skills.frequency+.25*skills.gain+.15*skills.Q;
  return {score:skills.direction?weighted:Math.min(.25,weighted),skills};
 }
 function feedback(cuts,freq,sampleRate,dsp,seconds,timed=true){
  // Sum the actual audio filters in dB. Tonal damage is a separate penalty.
  let response=0,total=0;
  for(const [f,g] of Object.entries(cuts)){if(!Number.isFinite(+g)||+g>=0)continue;response+=dsp.response(dsp.coeff('peaking',+f,+g,4.318,sampleRate),freq,sampleRate);total-=+g;}
  const effective=Math.max(0,-response),accuracy=clamp(1-Math.abs(effective-6)/6),extra=Math.max(0,total-effective),penalty=Math.min(.5,extra/30),speed=clamp(1-Math.max(0,seconds)/90);
  return {score:clamp(accuracy*(timed?(.85+.15*speed):1)-penalty),effective,extra,accuracy,penalty};
 }
 function mastered(rows,id){
  const recent=rows.slice(-20);if(recent.length!==20||recent.reduce((s,r)=>s+r.score,0)/20<.8)return false;
  if(id!=='eq')return true;
  return [['direction',.9],['frequency',.8],['gain',.75],['Q',.65]].every(([key,min])=>recent.every(r=>r.masteryVersion===2&&r.skills)&&recent.reduce((s,r)=>s+r.skills[key],0)/20>=min);
 }
 root.SoundTraining={eq,feedback,mastered};
})(typeof globalThis!=='undefined'?globalThis:window);

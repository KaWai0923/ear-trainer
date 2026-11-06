/* Lazy, bounded synthesis; shared by Worker and cooperative fallback. */
'use strict';
const SoundSynthesis=(()=>{
 function state(type,sr){return {type,sr,data:new Float32Array(sr*4),i:0,b:new Float64Array(7)}}
 function chunk(s,count){const end=Math.min(s.data.length,s.i+count),b=s.b;for(;s.i<end;s.i++){const i=s.i,w=Math.random()*2-1,t=i/s.sr;b[0]=.99886*b[0]+w*.0555179;b[1]=.99332*b[1]+w*.0750759;b[2]=.969*b[2]+w*.153852;b[3]=.8665*b[3]+w*.3104856;b[4]=.55*b[4]+w*.5329522;b[5]=-.7616*b[5]-w*.016898;const pink=(b[0]+b[1]+b[2]+b[3]+b[4]+b[5]+b[6]+w*.5362)*.11;b[6]=w*.115926;if(s.type==='pink')s.data[i]=pink;else if(s.type==='vocal'){const f0=125+14*Math.sin(2*Math.PI*.75*t),phase=2*Math.PI*(125*t+14/(2*Math.PI*.75)*(1-Math.cos(2*Math.PI*.75*t)));let v=0;for(let h=1;h<=75;h++){const f=h*f0,form=.12+2*Math.exp(-(((f-650)/180)**2))+1.1*Math.exp(-(((f-1200)/230)**2))+.65*Math.exp(-(((f-2600)/400)**2));v+=Math.sin(h*phase)*form/h}const env=.25+.75*Math.sin(Math.PI*2*t)**2,sibilant=Math.max(0,Math.sin(2*Math.PI*.5*t))**14;s.data[i]=v*env+(.1+.5*sibilant)*w}else{const beat=t%.5,snare=(t+.25)%.5,hat=t%.125;s.data[i]=Math.sin(2*Math.PI*(52*beat+7*(1-Math.exp(-beat*25))))*Math.exp(-beat*18)+.5*w*Math.exp(-snare*32)+.16*(w-(i?s.data[i-1]*.1:0))*Math.exp(-hat*90)}}}
 function finish(s){let sum=0,peak=0;for(const x of s.data){sum+=x*x;peak=Math.max(peak,Math.abs(x))}const gain=Math.min(.18/Math.sqrt(sum/s.data.length||1),.85/(peak||1));for(let i=0;i<s.data.length;i++)s.data[i]*=gain;return s.data}
 return {state,chunk,finish};
})();

'use strict';
const SoundVisuals=(()=>{
 const loops=new Map(),wave=new WeakMap(),spectrum=new WeakMap();
 const reduced=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 function visible(el){if(!el||document.hidden||el.closest('details:not([open])')||el.closest('[hidden]'))return false;const r=el.getBoundingClientRect();return r.bottom>=0&&r.top<innerHeight&&r.width>0}
 function stop(key){const l=loops.get(key);if(l){cancelAnimationFrame(l.raf);clearTimeout(l.timer);loops.delete(key)}}
 function loop(key,id,draw,fps=30){stop(key);const el=document.getElementById(id);if(!el)return;const l={};loops.set(key,l);function next(){if(document.getElementById(id)!==el){stop(key);return}if(visible(el)&&voices.length){l.raf=requestAnimationFrame(()=>{draw();l.timer=setTimeout(next,1000/(reduced()?8:fps))})}else l.timer=setTimeout(next,500)}l.next=next;next()}
 function wake(){for(const l of loops.values()){clearTimeout(l.timer);cancelAnimationFrame(l.raf);l.next()}}
 function data(a,map,size){let d=map.get(a);if(!d||d.length!==size){d=new Float32Array(size);map.set(a,d)}return d}
 return {loop,stop,wake,visible,reduced,time:a=>data(a,wave,a.fftSize),frequency:a=>data(a,spectrum,a.frequencyBinCount)};
})();

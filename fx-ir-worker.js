importScripts('fx-core.js?v=1.9.1');
onmessage=e=>{try{const ir=SoundFXCore.ir(e.data.params,e.data.sampleRate);postMessage({id:e.data.id,...ir},ir.channels.map(x=>x.buffer))}catch(err){postMessage({id:e.data.id,error:err.message})}};

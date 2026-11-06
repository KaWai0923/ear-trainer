'use strict';
importScripts('modules/synthesis-core.js?v=1.8');
self.onmessage=e=>{try{const {type,sampleRate}=e.data;if(!['pink','vocal','drums'].includes(type)||![44100,48000,88200,96000].includes(sampleRate)&&!(sampleRate>=8000&&sampleRate<=192000))throw Error('無效合成參數');const s=SoundSynthesis.state(type,sampleRate);while(s.i<s.data.length)SoundSynthesis.chunk(s,4096);const data=SoundSynthesis.finish(s);self.postMessage({data},[data.buffer])}catch(error){self.postMessage({error:error.message})}};

/* Small explicit integration boundary; classic scripts, no bundler required. */
'use strict';
const AppHooks=(()=>{const listeners=new Map();return {on(name,fn){if(!listeners.has(name))listeners.set(name,new Set());listeners.get(name).add(fn);return ()=>listeners.get(name).delete(fn)},emit(name,payload){for(const fn of listeners.get(name)||[])fn(payload)}}})();

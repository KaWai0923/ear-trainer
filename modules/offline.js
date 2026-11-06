'use strict';
const OfflineApp=(()=>{
 let registration=null;
 async function register(){if(!('serviceWorker'in navigator)||!window.isSecureContext)return {available:false,message:'離線模式需要 HTTPS／localhost 同 Service Worker 支援'};registration=await navigator.serviceWorker.register('sw.js',{scope:'./',updateViaCache:'none'});return {available:true,registration}}
 async function message(type){const target=navigator.serviceWorker?.controller||registration?.active;if(!target)throw Error('離線引擎尚未準備好；稍後再試／重新載入');return new Promise((resolve,reject)=>{const ch=new MessageChannel(),timer=setTimeout(()=>{ch.port1.close();reject(Error('離線操作超時；可以稍後重試，已下載檔案會保留'))},60000);ch.port1.onmessage=e=>{clearTimeout(timer);ch.port1.close();e.data.ok?resolve(e.data):reject(Error(e.data.error||'離線操作失敗'))};target.postMessage({type},[ch.port2])})}
 return {register,message,get registration(){return registration}};
})();

/* Theme switch: 淺色 / 深色 / 跟系統. UI-only; no audio/DSP state. Stores 'light' | 'dark' | 'system' in localStorage 'et-theme'. */
(function(){
  'use strict';
  var KEY='et-theme',MODES=['light','dark','system'],COLORS={light:'#FFFFFF',dark:'#191919'};
  var root=document.documentElement;
  function read(){try{var v=localStorage.getItem(KEY);return MODES.indexOf(v)>=0?v:'system'}catch(e){return 'system'}}
  function write(mode){try{mode==='system'?localStorage.removeItem(KEY):localStorage.setItem(KEY,mode)}catch(e){}}
  function setMeta(mode){
    var head=document.head;if(!head)return;
    var old=head.querySelectorAll('meta[name="theme-color"]');
    for(var i=0;i<old.length;i++)old[i].parentNode.removeChild(old[i]);
    function add(content,media){var m=document.createElement('meta');m.name='theme-color';m.content=content;if(media)m.media=media;head.appendChild(m)}
    if(mode==='light'||mode==='dark')add(COLORS[mode]);
    else{add(COLORS.light,'(prefers-color-scheme: light)');add(COLORS.dark,'(prefers-color-scheme: dark)')}
  }
  function mark(mode){
    var btns=document.querySelectorAll('[data-theme-choice]');
    for(var i=0;i<btns.length;i++)btns[i].setAttribute('aria-pressed',String(btns[i].getAttribute('data-theme-choice')===mode));
  }
  // v1.9.3: let JS-painted graphs (EQ / compressor canvases) repaint with the new --graph-* colours.
  function notify(mode){try{window.dispatchEvent(new CustomEvent('et-themechange',{detail:{mode:mode}}))}catch(e){}}
  function apply(mode){
    if(MODES.indexOf(mode)<0)mode='system';
    if(mode==='system')delete root.dataset.theme;else root.dataset.theme=mode;
    setMeta(mode);mark(mode);
    notify(mode);
  }
  function choose(mode){write(mode);apply(mode)}
  document.addEventListener('click',function(e){
    var t=e.target&&e.target.closest?e.target.closest('[data-theme-choice]'):null;
    if(t)choose(t.getAttribute('data-theme-choice'));
  });
  window.addEventListener('storage',function(e){if(e.key===KEY||e.key===null)apply(read())});
  try{var mq=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)');var onOS=function(){if(read()==='system')notify('system')};if(mq&&mq.addEventListener)mq.addEventListener('change',onOS);else if(mq&&mq.addListener)mq.addListener(onOS)}catch(e){}
  apply(read());
  window.EarTheme={get:read,set:choose};
})();

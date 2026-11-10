/* Theme switch: 淺色 / 深色 / 跟系統. UI-only; no app data. Stores 'light' | 'dark' in localStorage 'bjj-theme' (system = key removed). */
(function(){
  'use strict';
  var KEY='bjj-theme',MODES=['light','dark','system'],COLORS={light:'#FFFFFF',dark:'#191919'};
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
  function apply(mode){
    if(MODES.indexOf(mode)<0)mode='system';
    if(mode==='system')delete root.dataset.theme;else root.dataset.theme=mode;
    setMeta(mode);mark(mode);
  }
  function choose(mode){write(mode);apply(mode)}
  document.addEventListener('click',function(e){
    var t=e.target&&e.target.closest?e.target.closest('[data-theme-choice]'):null;
    if(t)choose(t.getAttribute('data-theme-choice'));
  });
  window.addEventListener('storage',function(e){if(e.key===KEY||e.key===null)apply(read())});
  apply(read());
  window.BJJTheme={get:read,set:choose};
})();

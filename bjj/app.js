/* BJJ 筆記 · Phase 0 UI. Hash router, vanilla JS. Data: BJJDB (IndexedDB). No network calls except loading the seed files and third-party embeds. */
(function () {
  'use strict';
  var APP_VERSION = 'v0.1.2';
  var C = window.BJJCore, DB = window.BJJDB, V = window.BJJVideo, G = window.BJJGraph;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var main = $('#main');
  var S = { positions: [], posById: {}, techniques: [], techById: {}, roadmaps: [], nodes: [], edges: [], clips: [], logs: [],
    filters: {}, query: '', showRestricted: false, seedProblems: [], seedInfo: null, map: { moveMode: false, connectFrom: null, selectedNode: null, selectedEdge: null } };
  try { var saved = JSON.parse(sessionStorage.getItem('bjj-filters') || 'null'); if (saved) { S.filters = saved.filters || {}; S.query = saved.query || ''; S.showRestricted = !!saved.showRestricted; } } catch (e) {}
  function saveFilters() { try { sessionStorage.setItem('bjj-filters', JSON.stringify({ filters: S.filters, query: S.query, showRestricted: S.showRestricted })); } catch (e) {} }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var ICON = {
    back: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5"/></svg>',
    plus: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M9 3.5v11M3.5 9h11"/></svg>',
    search: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>',
    chev: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg>',
    play: '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M4 2.5v9l7.5-4.5z" fill="currentColor"/></svg>'
  };
  var GEAR = '<a class="icon-btn" href="#/settings" aria-label="設定" id="gear"><svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="3"/><path d="M11 2.5v2.2M11 17.3v2.2M2.5 11h2.2M17.3 11h2.2M5 5l1.6 1.6M15.4 15.4 17 17M5 17l1.6-1.6M15.4 6.6 17 5"/></svg></a>';
  var GI_ZH = { gi: 'Gi', 'no-gi': 'No-gi', both: '兩者', 'gi-adaptable': 'Gi 可改' };
  var BELT_SHORT = { white_fundamental: '白帶', white_advanced: '白帶進階', blue: '藍帶', purple: '紫帶', brown_black: '啡／黑帶' };
  var CAT_ZH = { takedown: 'Takedown 摔', 'guard pull': 'Guard pull 拉 Guard', 'guard retention': 'Guard retention 保 Guard', 'guard pass': 'Guard pass 過腳', sweep: 'Sweep 掃技', submission: 'Submission 降服', escape: 'Escape 逃脫', 'transition/control': 'Transition 轉位／控制', 'back take': 'Back take 拎背', 'defense/counter': 'Defense／Counter 防守', 'drill/movement': 'Drill／Movement' };
  var ROLE_USER_ZH = { top: '上位', bottom: '下位', standing: '站立' };
  var RESULT_ZH = { success: '成功', partial: '一半', fail: '唔成功' };
  function statusClass(s) { return { 'not started': 'none', learning: 'learning', drilling: 'drilling', 'live rolling': 'live', reliable: 'reliable' }[s || 'not started']; }
  function statusPill(s) { s = s || 'not started'; return '<span class="pill ' + statusClass(s) + '">' + esc(C.STATUS_ZH[s]) + '</span>'; }
  function safetyLine(t) {
    if (C.isRestricted(t)) return '<p class="sub safety-line"><span class="pill high">受限</span> <span class="danger-t">預設隱藏 · 例如 heel hook</span></p>';
    if (C.isCaution(t)) return '<p class="sub safety-line"><span class="pill caution">注意</span> <span class="warn-t">' + esc(C.CAUTION_HINT) + '</span></p>';
    return '';
  }
  function pName(id) { return C.posName(S.posById[id]); }
  function tMain(t) { return t ? (t.title_en || t.title_zh) : '（已刪除）'; }
  function tSub(t) { return t && t.title_en && t.title_zh ? t.title_zh : ''; }
  function fmtDate(d) { if (!d) return ''; var m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? (+m[2]) + ' 月 ' + (+m[3]) + ' 日' : d; }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function errBanner(title, msg) { return '<div class="banner error" role="alert"><div><strong>' + esc(title) + '</strong>' + esc(msg) + '</div></div>'; }

  /* ── toast + dialog ── */
  var toastTimer;
  var toastHandlers = []; // BJJ-009: real listeners (Chromium has no onfocusin IDL property)
  var toastVis = null; // decisions-v0 #23: hidden browser tab pauses the undo countdown
  document.addEventListener('visibilitychange', function () { if (toastVis) toastVis(); });
  function toast(msg, action) {
    toastVis = null;
    var el = $('#toast'); clearTimeout(toastTimer); toastHandlers.forEach(function (h) { el.removeEventListener(h[0], h[1]); }); toastHandlers = [];
    el.classList.toggle('undo', !!(action && action.slot));
    el.innerHTML = action && action.slot
      ? '<div class="ut-main"><div class="ut-head"><strong>' + esc(msg) + '</strong><span class="ut-pill" id="ut-pill"></span></div>' + (action.detail ? '<p class="ut-detail">' + esc(action.detail) + '</p>' : '') + '<div class="ut-bar"><i id="ut-bar"></i></div><p class="ut-note" id="ut-note"></p></div><button type="button" class="text-btn" id="toast-act">' + esc(action.label) + '</button>'
      : '<span>' + esc(msg) + '</span>' + (action ? '<button type="button" class="text-btn small" id="toast-act">' + esc(action.label) + '</button>' : '');
    if (action) $('#toast-act').onclick = function () { el.innerHTML = ''; el.classList.remove('undo'); clearTimeout(toastTimer); toastVis = null; action.run(); };
    if (action && action.slot) {
      // decisions-v0 #18: countdown follows the undo slot; hover/focus pause it; a hidden tab keeps counting
      var hover = false, focus = false, hiddenTab = document.hidden;
      var total = action.total || 10000;
      var paint = function (paused) {
        var left = action.slot.remaining(), s = Math.ceil(left / 1000), b = $('#ut-bar'), pl = $('#ut-pill'), nt = $('#ut-note');
        if (b) b.style.width = Math.max(0, left / total * 100) + '%';
        if (pl) pl.textContent = total / 1000 + ' 秒' + (paused ? ' · 已暫停' : '');
        if (nt) nt.textContent = (paused ? '已暫停 · ' : '') + '仲有 ' + s + ' 秒（' + (total > 10000 ? '20 秒模式' : '預設 10 秒') + '）。鼠標放上去或者 focus 會暫停；瀏覽器 tab 隱藏都會暫停。';
      };
      var tick = function () { clearTimeout(toastTimer); var left = action.slot.remaining(); if (left <= 0) { var hadFocus = el.contains(document.activeElement); el.innerHTML = ''; el.classList.remove('undo'); action.slot.clear(); toastVis = null; if (hadFocus) restoreFocusAfterToast(); return; } paint(false); toastTimer = setTimeout(tick, Math.min(left, 250)); };
      var sync = function () { if (hover || focus || hiddenTab) { action.slot.pause(); clearTimeout(toastTimer); paint(true); } else { action.slot.resume(); tick(); } };
      toastVis = function () { hiddenTab = document.hidden; if (el.innerHTML) sync(); };
      var on = function (ev, fn) { el.addEventListener(ev, fn); toastHandlers.push([ev, fn]); };
      on('mouseenter', function () { hover = true; sync(); }); on('mouseleave', function () { hover = false; sync(); });
      on('focusin', function () { focus = true; sync(); }); on('focusout', function (ev) { if (ev.relatedTarget && el.contains(ev.relatedTarget)) return; focus = false; sync(); });
      tick(); return;
    }
    toastTimer = setTimeout(function () { el.innerHTML = ''; }, action ? (action.ms || 8000) : 3500);
  }
  var dlg = $('#dialog'), dlgBody = $('#dialog-body');
  function openDialog(html, onReady) {
    dlgBody.innerHTML = html;
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
    if (onReady) onReady(dlgBody);
    var f = dlgBody.querySelector('[autofocus]'); if (f) f.focus();
  }
  function closeDialog() { if (dlg.open) { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); } }
  function confirmBox(o) {
    return new Promise(function (res) {
      var done = false;
      function fin(v) { if (done) return; done = true; dlg.removeEventListener('close', onClose); closeDialog(); res(v); }
      function onClose() { fin(false); }
      openDialog('<h2 id="dialog-title">' + esc(o.title) + '</h2>' + (o.html || '') +
        '<div class="btn-row"><button type="button" class="btn ghost" data-c="0">' + esc(o.cancel || '取消') + '</button><button type="button" class="btn ' + (o.danger ? 'danger-solid' : 'primary') + '" data-c="1">' + esc(o.ok || '確定') + '</button></div>',
        function (b) { $$('[data-c]', b).forEach(function (x) { x.onclick = function () { fin(x.getAttribute('data-c') === '1'); }; }); });
      dlg.addEventListener('close', onClose);
    });
  }

  /* ── data cache ── */
  function refresh() {
    return Promise.all(['positions', 'techniques', 'roadmaps', 'nodes', 'edges', 'clips', 'logs'].map(function (s) { return DB.all(s); })).then(function (r) {
      S.positions = r[0]; S.techniques = r[1]; S.roadmaps = r[2]; S.nodes = r[3]; S.edges = r[4]; S.clips = r[5]; S.logs = r[6];
      S.posById = {}; S.positions.forEach(function (p) { S.posById[p.id] = p; });
      S.techById = {}; S.techniques.forEach(function (t) { S.techById[t.id] = t; });
      S.roadmaps.sort(function (a, b) { return (a.sort_order == null ? 99 : a.sort_order) - (b.sort_order == null ? 99 : b.sort_order) || String(a.created_at).localeCompare(String(b.created_at)); });
    });
  }
  function fetchSeed() {
    return Promise.all([fetch('./data/rei-seed.json').then(function (r) { if (!r.ok) throw new Error('seed ' + r.status); return r.json(); }), fetch('./data/layout.json').then(function (r) { return r.ok ? r.json() : {}; })])
      .then(function (r) { var s = C.transformReiSeed(r[0], r[1]); S.seedProblems = s.problems; S.seedInfo = { version: s.seed_version, status: s.status }; return s; });
  }
  function backupDue() {
    return Promise.all([DB.getMeta('last_export_at'), DB.getMeta('first_change_at'), Promise.resolve(persistState()), Promise.resolve(lsGet('bjj-backup-dismissed-at'))]).then(function (r) {
      S.lastExport = r[0] || null;
      var b = C.backupReminder(r[0], r[1], r[2], Date.now(), r[3]); S.reminder = b; S.reminderDays = b.days; return b.show;
    });
  }
  /* decisions-v0 #18: one undo slot for node / technique / edge deletes; 10 s, 20 s with reduced motion (screen-reader users
     can't be detected reliably on the web, so reduced-motion is the proxy and the toast is announced via aria-live). */
  var undoSlot = C.createUndoSlot();
  function reducedMotion() { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }
  /* decisions-v0 #29: device preferences (theme, 20 s undo, banner dismissal, persist answer) live in localStorage, never in export */
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function persistState() { var v = lsGet('bjj-persist'); return v === 'granted' ? true : v === 'denied' ? false : null; }
  function longUndo() { return lsGet('bjj-undo-long') === '1'; }
  /* BJJ-010: a keyboard-confirmed delete moves focus to 復原 (focus also pauses the timer, D18); Ctrl/Cmd+Z undoes while the slot is live */
  var lastKeyboard = false;
  document.addEventListener('keydown', function (e) { if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') lastKeyboard = true; }, true);
  document.addEventListener('pointerdown', function () { lastKeyboard = false; }, true);
  function restoreFocusAfterToast() { var m = $('#main') || main; var f = m && m.querySelector('h1, [autofocus], a, button'); if (f) { if (!f.hasAttribute('tabindex') && f.tagName === 'H1') f.setAttribute('tabindex', '-1'); f.focus(); } }
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && (e.key === 'z' || e.key === 'Z') && undoSlot.peek()) {
      var t = e.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      var b = $('#toast-act'); if (b) { e.preventDefault(); b.click(); }
    }
  });
  function offerUndo(msg, list, after, detail) {
    var ms = C.undoMs(reducedMotion() || longUndo()); // decisions-v0 #24
    undoSlot.set(list, ms);
    var kb = lastKeyboard;
    toast(msg, { label: '復原', slot: undoSlot, total: ms, detail: (detail ? detail + ' ' : '') + '刪位置、招式或邊都可以復原，但只保留最近一次；再刪會取代呢個復原。' + (kb ? '（Ctrl／⌘+Z 都得）' : ''), run: function () {
      var l = undoSlot.take();
      if (!l) { toast('已經過咗時限，唔可以復原'); return; }
      DB.restoreMany(l).then(function (r) { return refresh().then(function () { return r; }); }).then(function (r) {
        // BJJ-011: an edge identical to one re-added meanwhile is not restored (D3)
        var n = r && r.conflicts ? r.conflicts.length : 0;
        toast(n ? '已復原，但有 ' + n + ' 條邊線冇還原：同一招、同一起點終點嘅邊線已經存在' : '已復原');
        if (after) after();
        if (kb) restoreFocusAfterToast();
      });
    } });
    if (kb) { var b = $('#toast-act'); if (b) b.focus(); }
  }

  /* ── header ── */
  function setHeader(o) {
    $('#top-left').innerHTML = o.back ? '<a class="icon-btn back" href="' + esc(o.back) + '" aria-label="返回">' + ICON.back + '</a>' : '';
    $('#top-eyebrow').textContent = o.eyebrow || '';
    $('#top-eyebrow').hidden = !o.eyebrow;
    $('#top-title').textContent = o.title || '';
    $('#top-right').innerHTML = o.right || '';
    $('#topbar').hidden = !!o.hide;
    document.title = (o.title ? o.title + ' · ' : '') + 'BJJ 筆記';
  }
  function setNav(k, sub) {
    document.body.classList.toggle('no-tabs', !!sub); $$('.tabbar a').forEach(function (a) { var on = a.getAttribute('data-nav') === k; a.classList.toggle('active', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }); }

  /* ── router ── */
  var currentGraph = null;
  function route() {
    var h = location.hash.replace(/^#\/?/, '') || 'list';
    var parts = h.split('?')[0].split('/'), qs = {};
    (h.split('?')[1] || '').split('&').forEach(function (kv) { if (kv) { var p = kv.split('='); qs[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); } });
    closeDialog(); currentGraph = null; document.body.classList.remove('is-map');
    var r = parts[0];
    try {
      if (r === 'list') return viewList();
      if (r === 't' && parts[1]) return viewDetail(decodeURIComponent(parts[1]));
      if (r === 'edit') return viewEdit(decodeURIComponent(parts[1] || 'new'), qs);
      if (r === 'clip' && parts[1]) return parts[2] === 'link' ? viewLink(decodeURIComponent(parts[1])) : viewUpload(decodeURIComponent(parts[1]));
      if (r === 'map') return viewMap(decodeURIComponent(parts[1] || S.lastMap || (S.roadmaps[0] && S.roadmaps[0].id) || ''), qs);
      if (r === 'settings') return viewSettings(qs);
      location.hash = '#/list';
    } catch (e) { console.error(e); main.innerHTML = '<div class="main">' + errBanner('出錯', e.message) + '</div>'; }
  }
  window.addEventListener('hashchange', route);

  /* ── list ── */
  function filterSelect(key, label, opts) {
    var v = S.filters[key] || '', cur = opts.filter(function (o) { return o[0] === v; })[0];
    // chip shows a short label; a transparent native <select> sits on top (iOS picker, 16px font, no wide intrinsic width)
    return '<label class="chip select-chip' + (v ? ' active' : '') + '"><span class="sc-t">' + esc(cur ? cur[1] : label) + '</span><span class="chev-d" aria-hidden="true">▾</span>' +
      '<select data-filter="' + key + '" aria-label="' + esc(label) + '"><option value="">' + esc(label) + '：全部</option>' +
      opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === v ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></label>';
  }
  function viewList() {
    setNav('list');
    setHeader({ eyebrow: '試用原型 · 本機儲存', title: '招式', right: GEAR + '<a class="icon-btn" href="#/edit/new" aria-label="新增招式" id="add-tech">' + ICON.plus + '</a>' });
    var tags = {}; S.techniques.forEach(function (t) { (t.tags || []).forEach(function (g) { tags[g] = 1; }); });
    var usedPos = {}; S.techniques.forEach(function (t) { usedPos[t.start_position] = 1; C.allEnds(t).forEach(function (p) { usedPos[p] = 1; }); });
    main.innerHTML = '<div class="main">' +
      '<div id="backup-banner"></div>' +
      '<label class="search">' + ICON.search + '<span class="sr">搜尋</span><input type="search" id="q" placeholder="搜尋名稱、別名、tags、筆記…" value="' + esc(S.query) + '" autocomplete="off" enterkeyhint="search"></label>' +
      '<div class="filter-row" role="group" aria-label="篩選">' +
      filterSelect('position', '位置', S.positions.filter(function (p) { return usedPos[p.id]; }).map(function (p) { return [p.id, C.posName(p)]; })) +
      filterSelect('category', '分類', C.CATEGORIES.map(function (c) { return [c, CAT_ZH[c] || c]; })) +
      filterSelect('gi_mode', 'Gi', C.GI_MODES.map(function (g) { return [g, GI_ZH[g]]; })) +
      filterSelect('belt', '帶級', C.BELTS.map(function (b) { return [b, C.BELT_ZH[b]]; })) +
      filterSelect('status', '狀態', C.STATUSES.map(function (s) { return [s, C.STATUS_ZH[s]]; })) +
      filterSelect('tag', 'Tag', Object.keys(tags).sort().map(function (g) { return [g, g]; })) +
      '</div><div class="active-filters" id="active-filters"></div><label class="check"><input type="checkbox" id="toggle-risky"' + (S.showRestricted ? ' checked' : '') + '> 顯示受限招式 <span class="fine">· 預設隱藏</span></label><p class="fine list-count" id="count" aria-live="polite"></p><div class="list" id="tech-list"></div></div>';
    function draw() {
      var list = C.filterTechniques(S.techniques, S.query, Object.assign({ showRestricted: S.showRestricted }, S.filters), S.positions);
      list.sort(function (a, b) { return String(b.updated_at).localeCompare(String(a.updated_at)) || tMain(a).localeCompare(tMain(b)); });
      var active = Object.keys(S.filters).some(function (k) { return S.filters[k]; });
      // Roy 01b: active filters as removable chips + 「清除篩選」
      var af = $('#active-filters'), chips = [];
      $$('[data-filter]').forEach(function (sel) { var k = sel.getAttribute('data-filter'); if (S.filters[k]) chips.push('<button type="button" class="chip active" data-unfilter="' + k + '" aria-label="移除篩選 ' + esc(sel.options[sel.selectedIndex].text) + '">' + esc(sel.options[sel.selectedIndex].text) + ' <span aria-hidden="true">×</span></button>'); });
      if (S.showRestricted) chips.push('<button type="button" class="chip active" data-unrisky aria-label="移除篩選 顯示受限招式">顯示受限 <span aria-hidden="true">×</span></button>');
      af.innerHTML = chips.length || S.query ? chips.join('') + '<button type="button" class="text-btn" id="clear-filters">清除篩選</button>' : '';
      if ($('[data-unrisky]', af)) $('[data-unrisky]', af).onclick = function () { S.showRestricted = false; $('#toggle-risky').checked = false; saveFilters(); draw(); };
      af.hidden = !af.innerHTML;
      $$('[data-unfilter]', af).forEach(function (b) { b.onclick = function () { var k = b.getAttribute('data-unfilter'); S.filters[k] = ''; var sel = $('[data-filter="' + k + '"]'); sel.value = ''; sel.onchange(); }; });
      if ($('#clear-filters')) $('#clear-filters').onclick = clearAll;
      $('#count').textContent = list.length + ' 招' + (active || S.query || S.showRestricted ? '（已篩選）' : '');
      var box = $('#tech-list');
      if (!S.techniques.length) { box.innerHTML = '<div class="empty"><h2>未有招式</h2><p>下課之後用 5 分鐘記低今日學咗乜。</p><a class="btn primary" href="#/edit/new">' + ICON.plus + ' 新增第一招</a></div>'; return; }
      if (!list.length) { box.innerHTML = '<div class="empty" id="empty-state"><h2>搵唔到符合嘅招式</h2><p>' + (S.query ? '呢組篩選同「' + esc(S.query) + '」冇重疊結果。' : '呢組篩選冇結果。') + '試下清除篩選，或者改用名稱、別名、tags 或筆記再搜。搜尋範圍包括 title_zh、title_en、aliases、tags，同埋 summary、key_concepts、steps、common_mistakes、personal_notes、coach_feedback。</p><button type="button" class="btn ghost" id="empty-clear">清除篩選</button></div>'; $('#empty-clear').onclick = clearAll; return; }
      box.innerHTML = list.map(function (t) {
        var ends = C.allEnds(t).map(pName).join(' / ');
        return '<a class="row-card" href="#/t/' + encodeURIComponent(t.id) + '" data-tech="' + esc(t.id) + '"><div class="body"><p class="name">' + esc(tMain(t)) + (tSub(t) ? ' <em>· ' + esc(tSub(t)) + '</em>' : '') + '</p>' +
          '<p class="meta">' + esc(pName(t.start_position)) + ' → ' + esc(ends) + ' · ' + esc(GI_ZH[t.gi_mode] || t.gi_mode) + '</p>' +
          '<p class="sub">' + statusPill(t.status) + '　' + (t.last_practiced ? '上次練習 ' + esc(fmtDate(t.last_practiced)) : '未練習') + '</p>' + safetyLine(t) + '</div><span class="chev">' + ICON.chev + '</span></a>';
      }).join('');
    }
    function clearAll() { S.filters = {}; S.query = ''; S.showRestricted = false; saveFilters(); viewList(); var q = $('#q'); if (q) q.focus(); } // BJJ-003 / D10
    $('#q').addEventListener('input', function () { S.query = this.value; saveFilters(); draw(); });
    $$('[data-filter]').forEach(function (sel) { sel.onchange = function () { S.filters[sel.getAttribute('data-filter')] = sel.value; var ch = sel.parentNode; ch.classList.toggle('active', !!sel.value); $('.sc-t', ch).textContent = sel.value ? sel.options[sel.selectedIndex].text : sel.options[0].text.replace(/：全部$/, ''); saveFilters(); draw(); }; });
    $('#toggle-risky').onchange = function () { S.showRestricted = this.checked; saveFilters(); draw(); };
    draw();
    backupBanner($('#backup-banner'));
  }
  function backupBanner(el) {
    backupDue().then(function (due) {
      if (!due || !el) return;
      var days = S.reminder.elapsedDays;
      el.innerHTML = '<div class="banner warn" role="status" id="backup-warn"><div style="flex:1"><strong>' + (S.lastExport ? '已經 ' + days + ' 日冇匯出備份' : '改咗資料 ' + days + ' 日，未匯出過備份') + '</strong>' + (S.lastExport ? '上次匯出 ' + esc(fmtDate(S.lastExport)) + '。' : '') + 'Safari 可能喺 7 日後清走本機資料。' + (S.reminderDays === 3 ? '瀏覽器冇答應保留資料，所以每 3 日提一次。' : '') + '</div><div style="display:flex;flex-direction:column;gap:4px;flex:none"><a class="btn ghost" href="#/settings?export=1" style="background:var(--bg)">立即匯出</a><button type="button" class="text-btn small" id="backup-dismiss">24 小時後再提</button></div></div>';
      $('#backup-dismiss').onclick = function () { lsSet('bjj-backup-dismissed-at', new Date().toISOString()); el.innerHTML = ''; };
    });
  }

  /* ── detail ── */
  function viewDetail(id) {
    setNav('list', true);
    var t = S.techById[id];
    if (!t) { setHeader({ back: '#/list', title: '招式' }); main.innerHTML = '<div class="main"><div class="empty"><h2>搵唔到呢招</h2><p>可能已經刪除咗。</p><a class="btn ghost" href="#/list">返列表</a></div></div>'; return; }
    setHeader({ back: '#/list', title: '招式', right: '<a class="text-btn" href="#/edit/' + encodeURIComponent(id) + '" id="edit-btn">編輯</a>' });
    var clips = S.clips.filter(function (c) { return c.technique_id === id; }).sort(function (a, b) { return String(a.created_at).localeCompare(String(b.created_at)); });
    var logs = S.logs.filter(function (l) { return l.technique_id === id; }).sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    var edges = S.edges.filter(function (e) { return e.technique_id === id; });
    var mapsById = {}; S.roadmaps.forEach(function (m) { mapsById[m.id] = m; });
    function listSec(title, arr, ordered) {
      arr = C.asList(arr); if (!arr.length) return '';
      var tag = ordered ? 'ol' : 'ul';
      return '<div class="block"><h2 class="section-title">' + esc(title) + '</h2><' + tag + ' class="content-list">' + arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</' + tag + '></div>';
    }
    var conf = t.confidence || 0;
    main.innerHTML = '<div class="main">' +
      '<h1 class="hero-title">' + esc(tMain(t)) + '</h1>' + (tSub(t) ? '<p class="hero-sub">' + esc(tSub(t)) + '</p>' : '') +
      '<p class="hero-path">' + esc(pName(t.start_position)) + ' → ' + esc(pName(t.end_position)) + ((t.alt_end_positions || []).length ? '<br><span class="fine">或者 → ' + esc(t.alt_end_positions.map(pName).join('、')) + '</span>' : '') + '</p>' +
      '<div class="meta-row">' + statusPill(t.status) + '<span class="pill gi">' + esc(GI_ZH[t.gi_mode] || t.gi_mode) + '</span>' + (t.category || []).map(function (c) { return '<span class="pill tag">' + esc(c) + '</span>'; }).join('') +
      (t.suggested_belt ? '<span class="pill tag">' + esc(C.BELT_ZH[t.suggested_belt] || t.suggested_belt) + '</span>' : '') +
      (t.difficulty ? '<span class="pill tag">難度 ' + esc(t.difficulty) + '／5</span>' : '') +
      (C.isRestricted(t) ? '<span class="pill high">受限</span>' : C.isCaution(t) ? '<span class="pill caution">注意</span>' : '') + '</div>' +
      (C.isCaution(t) ? '<div class="banner warn" id="caution-banner"><div><strong>注意</strong>' + esc(C.CAUTION_HINT) + '。對手一 tap 即刻放。</div></div>' : '') +
      (C.isRestricted(t) ? '<div class="banner error" id="restricted-banner"><div><strong>受限招式</strong>預設隱藏。高受傷風險，好多白帶／藍帶規則禁止，只喺教練睇住時練。</div></div>' : '') +
      '<div class="block" style="margin-top:16px"><div class="field"><label for="st">學習狀態</label><select id="st">' + C.STATUSES.map(function (s) { return '<option value="' + esc(s) + '"' + (s === (t.status || 'not started') ? ' selected' : '') + '>' + esc(C.STATUS_ZH[s]) + '（' + esc(s) + '）</option>'; }).join('') + '</select></div>' +
      '<div class="field"><span class="label" id="conf-l">信心 ' + (conf || '–') + '／5</span><div class="conf" role="group" aria-labelledby="conf-l">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-conf="' + n + '" aria-pressed="' + (n === conf) + '" aria-label="信心 ' + n + '">' + n + '</button>'; }).join('') + '</div></div></div>' +
      (t.ruleset_warning ? '<div class="banner warn"><div><strong>規則／安全提示</strong>' + esc(t.ruleset_warning) + '</div></div>' : '') +
      ((t.personal_notes || t.instructor || t.last_practiced) ? '<div class="block"><h2 class="section-title">筆記</h2>' + (t.personal_notes ? '<p class="note">' + esc(t.personal_notes).replace(/\n/g, '<br>') + '</p>' : '') + '<p class="fine" style="margin-top:6px">' + [t.instructor ? '教練 ' + esc(t.instructor) : '', t.last_practiced ? '上次練習 ' + esc(fmtDate(t.last_practiced)) : '', t.practice_count ? '練咗 ' + t.practice_count + ' 次' : ''].filter(Boolean).join(' · ') + '</p></div>' : '') +
      (t.summary ? '<div class="block"><h2 class="section-title">摘要</h2><p class="note">' + esc(t.summary) + '</p></div>' : '') +
      '<div class="block"><h2 class="section-title">影片 · ' + clips.length + ' 條</h2><div id="clips">' + (clips.length ? clips.map(clipRow).join('') : '<p class="fine">未有片。每條 upload 最長 20.5 秒；YouTube／IG／Drive 連結冇長度限制。</p>') + '</div>' +
      '<div class="btn-row"><a class="btn ghost" href="#/clip/' + encodeURIComponent(id) + '/upload" id="go-upload">' + ICON.plus + ' 上傳（≤ 20.5 秒）</a><a class="btn ghost" href="#/clip/' + encodeURIComponent(id) + '/link" id="go-link">' + ICON.plus + ' 貼連結</a></div></div>' +
      listSec('重點概念', t.key_concepts) + listSec('步驟', t.steps, true) + listSec('Grips', t.grips) + listSec('常見錯誤', t.common_mistakes) + listSec('對手反應', t.opponent_reactions) + listSec('Counters', t.counters) + listSec('Follow-ups', t.follow_ups) + listSec('安全注意', t.safety_notes) +
      (t.coach_feedback ? '<div class="block"><h2 class="section-title">教練意見</h2><p class="note">' + esc(t.coach_feedback) + '</p></div>' : '') +
      (t.source_url || t.source_name ? '<div class="block"><h2 class="section-title">來源</h2><p class="note">' + (t.source_url ? '<a href="' + esc(t.source_url) + '" target="_blank" rel="noopener">' + esc(t.source_name || t.source_url) + '</a>' : esc(t.source_name)) + '</p></div>' : '') +
      '<div class="block"><h2 class="section-title">出現喺路線圖</h2>' + (edges.length ? edges.map(function (e) {
        var m = mapsById[e.roadmap_id];
        return '<a class="row-card" href="#/map/' + encodeURIComponent(e.roadmap_id) + '?edge=' + encodeURIComponent(e.id) + '"><div class="body"><p class="name">' + esc(m ? m.title_zh : e.roadmap_id) + '</p><p class="meta">' + esc(pName(e.from_position_id)) + ' → ' + esc(pName(e.to_position_id)) + '</p></div><span class="chev">' + ICON.chev + '</span></a>';
      }).join('') : '<p class="fine">未加入任何路線圖。可以喺路線圖用「連線」加。</p>') + '</div>' +
      '<div class="block" id="log-block"><h2 class="section-title">練習記錄</h2>' + (logs.length ? logs.slice(0, 10).map(function (l) {
        return '<div class="log-item"><strong>' + esc(fmtDate(l.date)) + '</strong> · ' + esc(C.SCENARIO_ZH[l.scenario] || l.scenario) + (l.result ? ' · ' + esc(RESULT_ZH[l.result] || l.result) : '') + (l.confidence ? ' · 信心 ' + l.confidence + '／5' : '') + (l.notes ? '<br><span class="fine">' + esc(l.notes) + '</span>' : '') + '</div>';
      }).join('') : '<p class="fine">未有記錄。</p>') + '</div>' +
      '<div class="btn-row"><button type="button" class="btn ghost" id="add-log">寫練習記錄</button><button type="button" class="btn danger" id="del-tech">刪除</button></div></div>';
    $('#st').onchange = function () { var v = this.value; updateTech(id, { status: v }).then(function () { toast('狀態改咗做「' + C.STATUS_ZH[v] + '」'); viewDetail(id); }).catch(saveFail); };
    $$('[data-conf]').forEach(function (b) { b.onclick = function () { updateTech(id, { confidence: +b.getAttribute('data-conf') }).then(function () { viewDetail(id); }).catch(saveFail); }; });
    $('#add-log').onclick = function () { logDialog(id); };
    $('#del-tech').onclick = function () { deleteTechnique(id); };
    bindClips(clips, id);
  }
  function saveFail(e) { toast('儲存失敗：' + (e && e.message || e)); } // BJJ-020: never leave a save rejection unhandled
  function updateTech(id, patch) {
    return DB.get('techniques', id).then(function (t) { Object.assign(t, patch); return DB.saveTechnique(t); }).then(refresh);
  }
  function clipRow(c) {
    var range = (c.start_seconds != null ? C.formatTime(c.start_seconds) : '') + (c.end_seconds != null ? '–' + C.formatTime(c.end_seconds) : '');
    var src = { youtube: 'YouTube', instagram: 'Instagram', drive: 'Google Drive', upload: '已上傳 · 本機' }[c.source_type];
    var dur = c.source_type === 'upload' ? C.formatTime(c.duration_seconds) : (c.end_seconds != null && c.start_seconds != null ? C.formatTime(c.end_seconds - c.start_seconds) : '');
    var extra = c.source_type === 'upload' ? [c.height ? Math.min(c.width, c.height) + 'p' : '', C.formatBytes(c.size_bytes), c.compressed === false ? '原檔' : ''].filter(Boolean).join(' · ') : '';
    return '<div class="clip-wrap" data-clip="' + esc(c.id) + '"><div class="clip"><button type="button" class="thumb" data-play="' + esc(c.id) + '" aria-label="播放 ' + esc(c.label || '片') + '">' + ICON.play + (dur ? '<span class="dur">' + esc(dur) + '</span>' : '') + '</button>' +
      '<div style="flex:1;min-width:0"><h3>' + esc(c.label || '（冇標籤）') + '</h3><p>' + esc(src) + (range ? ' · ' + esc(range) : '') + (extra ? ' · ' + esc(extra) : '') + '</p>' +
      '<div class="actions"><button type="button" class="link-btn" data-play="' + esc(c.id) + '">' + (c.start_seconds ? '由 ' + esc(C.formatTime(c.start_seconds)) + ' 播放' : '播放') + '</button>' +
      '<button type="button" class="link-btn" data-edit-clip="' + esc(c.id) + '">編輯</button>' +
      '<button type="button" class="link-btn" data-del-clip="' + esc(c.id) + '" style="color:var(--danger-text)">刪除</button></div></div></div><div class="player-slot"></div></div>';
  }
  var activeUrls = [];
  function bindClips(clips, techId) {
    var byId = {}; clips.forEach(function (c) { byId[c.id] = c; });
    $$('[data-play]').forEach(function (b) { b.onclick = function () { playClip(byId[b.getAttribute('data-play')]); }; });
    $$('[data-edit-clip]').forEach(function (b) { b.onclick = function () { clipEditDialog(byId[b.getAttribute('data-edit-clip')], techId); }; });
    $$('[data-del-clip]').forEach(function (b) {
      b.onclick = function () {
        var c = byId[b.getAttribute('data-del-clip')];
        confirmBox({ title: '刪除呢條片？', html: '<p>「' + esc(c.label || '片') + '」會喺呢招度隱藏（soft delete）。</p>', ok: '刪除', danger: true }).then(function (ok) {
          if (!ok) return;
          DB.softDelete('clips', c.id).then(refresh).then(function () { viewDetail(techId); offerUndo('已刪除片', [{ store: 'clips', id: c.id }], function () { viewDetail(techId); }); });
        });
      };
    });
  }
  /* D36 / BJJ-012: edit one clip — label, start / end, and the URL for link clips. Same validator as import (D38). */
  function clipEditDialog(c, techId) {
    var isUp = c.source_type === 'upload';
    openDialog('<h2 id="dialog-title">編輯片段</h2><form id="clip-form" novalidate>' +
      '<div class="field"><label for="ce-label">標籤</label><input type="text" id="ce-label" maxlength="120" value="' + esc(c.label || '') + '"></div>' +
      (isUp ? '' : '<div class="field"><label for="ce-url">連結</label><input type="url" id="ce-url" inputmode="url" autocapitalize="none" autocomplete="off" maxlength="2000" value="' + esc(c.url || '') + '"></div>') +
      '<div class="field-row"><div class="field"><label for="ce-start">由</label><input type="text" id="ce-start" inputmode="numeric" placeholder="0:00" value="' + esc(c.start_seconds != null ? C.formatTime(c.start_seconds) : '') + '"></div>' +
      '<div class="field"><label for="ce-end">到（可空）</label><input type="text" id="ce-end" inputmode="numeric" placeholder="' + (isUp ? esc(C.formatTime(c.duration_seconds)) : '–') + '" value="' + esc(c.end_seconds != null ? C.formatTime(c.end_seconds) : '') + '"></div></div>' +
      '<p class="err" id="ce-err" role="alert" hidden></p>' +
      '<div class="btn-row"><button type="button" class="btn ghost" id="ce-cancel">取消</button><button class="btn primary" id="ce-save">儲存</button></div></form>', function (b) {
      $('#ce-cancel', b).onclick = closeDialog;
      $('#clip-form', b).onsubmit = function (ev) {
        ev.preventDefault();
        var err = $('#ce-err', b), s = C.parseTimestamp($('#ce-start', b).value), e = C.parseTimestamp($('#ce-end', b).value);
        var fail = function (m, f) { err.textContent = m; err.hidden = false; if (f) { f.setAttribute('aria-invalid', 'true'); f.setAttribute('aria-describedby', 'ce-err'); f.focus(); } };
        if (!s.ok) return fail('「由」' + s.error, $('#ce-start', b));
        if (!e.ok) return fail('「到」' + e.error, $('#ce-end', b));
        if (isUp && e.value != null && e.value > c.duration_seconds + 0.01) return fail('「到」唔可以長過條片（' + C.formatTime(c.duration_seconds) + '）', $('#ce-end', b));
        var patch = { label: $('#ce-label', b).value.trim() || null, start_seconds: s.value, end_seconds: e.value };
        if (!isUp) patch.url = $('#ce-url', b).value;
        DB.updateClip(c.id, patch).then(refresh).then(function () { closeDialog(); toast('已更新片段'); viewDetail(techId); }).catch(function (x) { fail(x.message, isUp ? $('#ce-start', b) : $('#ce-url', b)); });
      };
    });
  }
  function playClip(c) {
    activeUrls.forEach(function (u) { URL.revokeObjectURL(u); }); activeUrls = [];
    $$('.player-slot').forEach(function (s) { s.innerHTML = ''; });
    var slot = $('[data-clip="' + c.id + '"] .player-slot');
    if (c.source_type === 'upload') {
      DB.getVideoBlob(c.blob_id).then(function (blob) {
        if (!blob) { slot.innerHTML = errBanner('片唔喺呢部機', '可能係由冇片嘅 JSON 匯入。請匯入包含片嘅備份。'); return; }
        var u = URL.createObjectURL(blob); activeUrls.push(u);
        slot.innerHTML = '<div class="player' + (c.height > c.width ? ' portrait' : '') + '"><video controls playsinline preload="metadata" src="' + u + '"></video></div>';
        var v = $('video', slot);
        v.addEventListener('loadedmetadata', function () { if (c.start_seconds) v.currentTime = c.start_seconds; var p = v.play(); if (p && p.catch) p.catch(function () {}); }, { once: true });
        if (c.end_seconds != null) v.addEventListener('timeupdate', function () { if (v.currentTime >= c.end_seconds) v.pause(); });
        v.addEventListener('error', function () { slot.insertAdjacentHTML('beforeend', '<p class="err">呢部機播唔到呢個格式（' + esc(c.mime) + '）。</p>'); });
      });
      return;
    }
    var src = C.embedUrl(c);
    var hint = c.source_type === 'drive' ? 'Google Drive 唔支援自動跳時間' + (c.start_seconds ? '，請手動拉去 ' + C.formatTime(c.start_seconds) : '') + '。見到「需要權限」嘅話，要將檔案共用設定改做「知道連結嘅人都可以檢視」。' :
      c.source_type === 'instagram' ? 'Instagram 嵌入可能因為私人帳戶、地區或者瀏覽器私隱設定而播唔到；IG 亦唔支援跳時間。' : 'YouTube 片可能被作者禁止嵌入，或者已刪除／設為私人。';
    slot.innerHTML = '<div class="player' + (c.source_type === 'instagram' ? ' ig' : '') + '"><iframe src="' + esc(src + (c.source_type === 'youtube' ? '&autoplay=1' : '')) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="' + esc(c.label || '片') + '"></iframe></div>' +
      '<button type="button" class="link-btn muted-link" data-embed-fail>播唔到？</button><div class="embed-fail" hidden></div>';
    var failBox = $('.embed-fail', slot), loaded = false;
    function showFail(why) {
      failBox.hidden = false; $('[data-embed-fail]', slot).hidden = true;
      failBox.innerHTML = '<div class="banner warn"><div><strong>' + esc(why) + '</strong>' + esc(hint) + '</div></div><a class="btn ghost full" href="' + esc(c.url) + '" target="_blank" rel="noopener" id="open-original">開原連結 ↗</a>';
    }
    var fr = $('iframe', slot);
    fr.addEventListener('load', function () { loaded = true; });
    fr.addEventListener('error', function () { showFail('嵌入失敗'); });
    // cross-origin embeds can't report playback errors, so: timeout, or the user says it didn't play
    setTimeout(function () { if (!loaded && slot.isConnected) showFail('嵌入載入唔到'); }, 8000);
    // BJJ-022: offline → every link clip (YouTube included) needs the network; say so straight away
    if (navigator.onLine === false) { hint = '而家離線，連結片要有網絡先播到。上傳嘅片可以離線播。'; showFail('離線 · 播唔到'); }
    var offl = function () { if (!slot.isConnected) return window.removeEventListener('offline', offl); hint = '而家離線，連結片要有網絡先播到。上傳嘅片可以離線播。'; showFail('離線 · 播唔到'); };
    window.addEventListener('offline', offl);
    $('[data-embed-fail]', slot).onclick = function () { showFail('播唔到'); };
  }
  function logDialog(id) {
    openDialog('<h2 id="dialog-title">寫練習記錄</h2><form id="log-form"><div class="field-row"><div class="field"><label for="lg-date">日期</label><input type="date" id="lg-date" value="' + today() + '" required></div>' +
      '<div class="field"><label for="lg-sc">場景</label><select id="lg-sc">' + C.SCENARIOS.map(function (s) { return '<option value="' + s + '">' + esc(C.SCENARIO_ZH[s]) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="field-row"><div class="field"><label for="lg-res">結果</label><select id="lg-res"><option value="">—</option>' + Object.keys(RESULT_ZH).map(function (k) { return '<option value="' + k + '">' + RESULT_ZH[k] + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="lg-conf">信心（1–5）</label><select id="lg-conf"><option value="">—</option>' + [1, 2, 3, 4, 5].map(function (n) { return '<option>' + n + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="field"><label for="lg-notes">筆記</label><textarea id="lg-notes" maxlength="2000" rows="3"></textarea></div><div class="btn-row"><button type="button" class="btn ghost" id="lg-cancel">取消</button><button class="btn primary">儲存記錄</button></div></form>',
      function (b) {
        $('#lg-cancel', b).onclick = closeDialog;
        $('#log-form', b).onsubmit = function (ev) {
          ev.preventDefault();
          DB.addLog({ technique_id: id, date: $('#lg-date').value, scenario: $('#lg-sc').value, result: $('#lg-res').value || null, confidence: $('#lg-conf').value ? +$('#lg-conf').value : null, notes: $('#lg-notes').value.trim() })
            .then(refresh).then(function () { closeDialog(); toast('已儲存練習記錄'); viewDetail(id); }).catch(function (e) { toast(e.message); });
        };
      });
  }
  function deleteTechnique(id) {
    var t = S.techById[id];
    DB.techniqueImpact(id).then(function (imp) {
      var mapsById = {}; S.roadmaps.forEach(function (m) { mapsById[m.id] = m; });
      var rows = imp.edges.map(function (e) { var m = mapsById[e.roadmap_id]; return '<li>' + esc(m ? m.title_zh : e.roadmap_id) + '：' + esc(pName(e.from_position_id)) + ' → ' + esc(pName(e.to_position_id)) + '</li>'; }).join('');
      return confirmBox({ title: '刪除呢招？', danger: true, ok: '確認刪除',
        html: '<p>' + esc(tMain(t)) + ' 會從列表同路線圖隱藏。相關片段（' + imp.clips.length + ' 條）亦會一齊藏起。呢步可以之後還原（還原功能本身唔係呢個原型範圍）。</p>' +
          '<div class="affected" id="affected"><strong>會受影響嘅邊線 · ' + imp.edges.length + ' 條</strong>' + (rows ? '<ul>' + rows + '</ul>' : '<span class="fine">冇</span>') + '</div>' });
    }).then(function (ok) {
      if (!ok) return;
      return DB.softDeleteTechnique(id).then(function (r) { return refresh().then(function () { location.hash = '#/list'; offerUndo('已刪除招式', r.undo, route, '「' + tMain(t) + '」連埋 ' + r.edges + ' 條邊、' + r.clips + ' 條片已隱藏。'); }); });
    });
  }

  /* ── editor ── */
  var KIND_GROUPS = [['group', '大類（group）'], ['preloaded', '預載位置'], ['perspective', '視角節點'], ['terminal', '終結'], ['custom', '自訂']];
  function posOptions(sel, allowEmpty, exclude) {
    var by = {};
    S.positions.forEach(function (p) { if (exclude && exclude[p.id]) return; var k = p.kind || (p.preloaded ? 'preloaded' : 'custom'); (by[k] = by[k] || []).push(p); });
    return (allowEmpty ? '<option value="">請揀…</option>' : '') + KIND_GROUPS.filter(function (g) { return by[g[0]]; }).map(function (g) {
      return '<optgroup label="' + g[1] + '">' + by[g[0]].map(function (p) { return '<option value="' + esc(p.id) + '"' + (p.id === sel ? ' selected' : '') + '>' + esc(C.posName(p)) + ' · ' + esc(p.name_en) + '</option>'; }).join('') + '</optgroup>';
    }).join('');
  }
  function viewEdit(id, qs) {
    setNav('list', true);
    var isNew = id === 'new', t0 = isNew ? { status: 'not started', category: [], gi_mode: '', alt_end_positions: [], safety_level: 'standard' } : S.techById[id];
    if (!t0) { location.hash = '#/list'; return; }
    var t = JSON.parse(JSON.stringify(t0));
    if (isNew && qs.from) t.start_position = qs.from;
    if (isNew && qs.to) t.end_position = qs.to;
    setHeader({ hide: true });
    var mapChecks = S.roadmaps.map(function (m) {
      var onMap = !isNew && S.edges.some(function (e) { return e.technique_id === id && e.roadmap_id === m.id; });
      var pre = qs.map === m.id;
      return '<div class="map-add" data-map-add="' + esc(m.id) + '"><label class="check"><input type="checkbox" name="maps" value="' + esc(m.id) + '"' + (pre ? ' checked' : '') + '> ' + esc(m.title_zh) + (onMap ? '<span class="fine">（已經有）</span>' : '') + '</label>' +
        '<div class="field-row map-add-ft"' + (pre ? '' : ' hidden') + '><div class="field"><label for="ma-from-' + esc(m.id) + '">由</label><select id="ma-from-' + esc(m.id) + '" data-ma="from">' + posOptions(qs.from || t.start_position, true) + '</select></div>' +
        '<div class="field"><label for="ma-to-' + esc(m.id) + '">去</label><select id="ma-to-' + esc(m.id) + '" data-ma="to">' + posOptions(qs.to || t.end_position, true) + '</select></div></div><p class="hint" data-ma-hint></p></div>';
    }).join('');
    function ta(k, label) { return '<div class="field"><label for="f-' + k + '">' + esc(label) + '</label><textarea id="f-' + k + '" rows="3" maxlength="4000">' + esc(C.asList(t[k]).join('\n')) + '</textarea></div>'; }
    function inp(k, label, v, attrs) { return '<div class="field"><label for="f-' + k + '">' + label + '</label><input type="text" id="f-' + k + '" value="' + esc(v == null ? '' : v) + '" ' + (attrs || '') + '><p class="err" id="e-' + k + '" hidden></p></div>'; }
    main.innerHTML = '<form id="tech-form" novalidate><div class="editor-head"><a class="text-btn muted" href="' + (isNew ? '#/list' : '#/t/' + encodeURIComponent(id)) + '" id="cancel">取消</a><h1>' + (isNew ? '新招式' : '編輯招式') + '</h1><button class="text-btn" type="submit" id="save">儲存</button></div><div class="main">' +
      '<p class="section-title">快速登記 · 下課後 5 分鐘內記低</p><div id="form-errors"></div>' +
      inp('title_en', '名稱 <span class="req">*</span>', t.title_en, 'maxlength="120" autocomplete="off" placeholder="例如 Scissor Sweep"') +
      '<p class="hint" style="margin-top:-6px;margin-bottom:12px">中文或英文，填一個就得。</p>' +
      inp('title_zh', '中文名稱', t.title_zh, 'maxlength="120" autocomplete="off"') +
      '<div class="field"><label for="f-start">起點位置 <span class="req">*</span></label><select id="f-start">' + posOptions(t.start_position, true) + '</select><p class="err" id="e-start_position" hidden></p></div>' +
      '<div class="field"><label for="f-end">終點位置 <span class="req">*</span></label><select id="f-end">' + posOptions(t.end_position, true) + '</select><p class="err" id="e-end_position" hidden></p></div>' +
      '<div class="field"><span class="label" id="cat-l">分類 <span class="req">*</span>（可以揀多個）</span><div class="multi" role="group" aria-labelledby="cat-l">' + C.CATEGORIES.map(function (c) { return '<label><input type="checkbox" name="cat" value="' + esc(c) + '"' + ((t.category || []).indexOf(c) >= 0 ? ' checked' : '') + '>' + esc(c) + '</label>'; }).join('') + '</div><p class="err" id="e-category" hidden></p></div>' +
      '<div class="field-row"><div class="field"><label for="f-gi">Gi 模式 <span class="req">*</span></label><select id="f-gi"><option value="">請揀…</option>' + C.GI_MODES.map(function (g) { return '<option value="' + g + '"' + (g === t.gi_mode ? ' selected' : '') + '>' + esc(GI_ZH[g]) + '</option>'; }).join('') + '</select><p class="err" id="e-gi_mode" hidden></p></div>' +
      '<div class="field"><label for="f-status">狀態</label><select id="f-status">' + C.STATUSES.map(function (s) { return '<option value="' + esc(s) + '"' + (s === (t.status || 'not started') ? ' selected' : '') + '>' + esc(C.STATUS_ZH[s]) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="field"><label for="f-personal_notes">短筆記</label><textarea id="f-personal_notes" rows="3" maxlength="4000">' + esc(t.personal_notes || '') + '</textarea></div>' +
      inp('instructor', '教練', t.instructor, 'maxlength="80" autocomplete="off"') +
      '<div class="field"><span class="label">掛片</span><div class="btn-row" style="margin-top:0"><button type="submit" class="btn ghost" data-then="upload">上傳（≤ 20.5 秒）</button><button type="submit" class="btn ghost" data-then="link">貼連結</button></div><p class="hint">會先儲存招式，再去加片。Upload 每條最長 20.5 秒，低畫質（約 480p）；連結冇長度限制。</p></div>' +
      '<div class="field"><span class="label">加進路線圖（可空）</span>' + mapChecks + '<p class="hint">from／to 唔使同招式嘅起點／終點一樣，對唔上只會提示。圖上未有嘅位置會自動加。</p></div>' +
      '<details class="fold"' + (qs.details ? ' open' : '') + '><summary>詳細資料<span class="chev-d">▾</span></summary><p class="fine">可以之後先補。每行一項。</p>' +
      inp('aliases', '別名（用逗號分隔）', (t.aliases || []).join(', '), 'maxlength="400"') +
      inp('tags', 'Tags（用逗號分隔）', (t.tags || []).join(', '), 'maxlength="400"') +
      '<div class="field"><label for="f-alt">後備終點（alt_end_positions，可揀多個）</label><select id="f-alt" multiple size="5" style="min-height:120px">' + S.positions.map(function (p) { return '<option value="' + esc(p.id) + '"' + ((t.alt_end_positions || []).indexOf(p.id) >= 0 ? ' selected' : '') + '>' + esc(C.posName(p)) + '</option>'; }).join('') + '</select><p class="err" id="e-alt_end_positions" hidden></p></div>' +
      '<div class="field-row"><div class="field"><label for="f-belt">建議腰帶</label><select id="f-belt"><option value="">—</option>' + C.BELTS.map(function (b) { return '<option value="' + b + '"' + (b === t.suggested_belt ? ' selected' : '') + '>' + esc(C.BELT_ZH[b]) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="f-diff">難度</label><select id="f-diff"><option value="">—</option>' + [1, 2, 3, 4, 5].map(function (n) { return '<option' + (n === t.difficulty ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="field-row"><div class="field"><label for="f-role">你嘅角色</label><select id="f-role"><option value="">—</option>' + C.ROLES.map(function (r) { return '<option value="' + r + '"' + (r === t.user_role ? ' selected' : '') + '>' + ROLE_USER_ZH[r] + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="f-safety">安全等級</label><select id="f-safety">' + C.SAFETY_LEVELS.map(function (l) { return '<option value="' + l + '"' + (l === (C.isRestricted(t) ? 'restricted' : t.safety_level || 'standard') ? ' selected' : '') + '>' + { standard: '一般（standard）', caution: '注意（caution）', restricted: '受限（restricted，預設隱藏）' }[l] + '</option>'; }).join('') + '</select><p class="err" id="e-safety_level" hidden></p></div></div>' +
      '<div class="field"><label for="f-summary">摘要</label><textarea id="f-summary" rows="3" maxlength="4000">' + esc(t.summary || '') + '</textarea></div>' +
      ta('key_concepts', '重點概念') + ta('steps', '步驟') + ta('grips', 'Grips') + ta('common_mistakes', '常見錯誤') + ta('opponent_reactions', '對手反應') + ta('counters', 'Counters') + ta('follow_ups', 'Follow-ups') + ta('safety_notes', '安全注意') +
      inp('source_name', '來源名稱', t.source_name, 'maxlength="200"') + '<div class="field"><label for="f-source_url">來源連結</label><input type="url" id="f-source_url" value="' + esc(t.source_url || '') + '" maxlength="1000" inputmode="url" autocapitalize="none"></div>' +
      '<div class="field"><label for="f-coach_feedback">教練意見</label><textarea id="f-coach_feedback" rows="2" maxlength="2000">' + esc(t.coach_feedback || '') + '</textarea></div>' +
      '</details><div class="btn-row"><button class="btn primary full" type="submit">儲存</button></div></div></form>';
    var form = $('#tech-form'), thenGo = null, dirty = false;
    form.addEventListener('input', function () { dirty = true; });
    form.addEventListener('change', function () { dirty = true; });
    $$('[data-then]').forEach(function (b) { b.addEventListener('click', function () { thenGo = b.getAttribute('data-then'); }); });
    $('#save').addEventListener('click', function () { thenGo = null; });
    $$('[data-map-add]').forEach(function (box) {
      var cb = $('input[name=maps]', box), ft = $('.map-add-ft', box);
      function hint() {
        var tmp = { start_position: $('#f-start').value, end_position: $('#f-end').value, alt_end_positions: $$('#f-alt option:checked').map(function (o) { return o.value; }) };
        var mis = cb.checked && tmp.start_position && tmp.end_position ? C.edgeMismatch($('[data-ma=from]', box).value, $('[data-ma=to]', box).value, tmp) : null;
        $('[data-ma-hint]', box).textContent = mis ? '提示：' + mis + '。照加都得。' : '';
      }
      cb.onchange = function () { ft.hidden = !cb.checked; if (cb.checked) { if (!$('[data-ma=from]', box).value) $('[data-ma=from]', box).value = $('#f-start').value; if (!$('[data-ma=to]', box).value) $('[data-ma=to]', box).value = $('#f-end').value; } hint(); };
      $$('select', box).forEach(function (x) { x.onchange = hint; });
    });
    $('#cancel').onclick = function (ev) {
      if (!dirty) return;
      ev.preventDefault();
      var href = this.getAttribute('href');
      confirmBox({ title: '放棄更改？', html: '<p>未儲存嘅內容唔會寫入。</p>', ok: '放棄', danger: true }).then(function (ok) { if (ok) location.hash = href; });
    };
    // keep the focused field visible above the iOS keyboard
    form.addEventListener('focusin', function (ev) { setTimeout(function () { if (ev.target.scrollIntoView) ev.target.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 300); });
    form.onsubmit = function (ev) {
      ev.preventDefault();
      var val = function (k) { var e = $('#f-' + k); return e ? e.value.trim() : ''; };
      var rec = Object.assign({}, t0, {
        title_en: val('title_en'), title_zh: val('title_zh'), start_position: $('#f-start').value, end_position: $('#f-end').value,
        category: $$('input[name=cat]:checked').map(function (x) { return x.value; }), gi_mode: $('#f-gi').value, status: $('#f-status').value,
        personal_notes: val('personal_notes'), instructor: val('instructor'), aliases: C.splitList(val('aliases')), tags: C.splitList(val('tags')),
        alt_end_positions: $$('#f-alt option:checked').map(function (o) { return o.value; }).filter(function (p) { return p !== $('#f-end').value; }),
        suggested_belt: $('#f-belt').value || null, difficulty: $('#f-diff').value ? +$('#f-diff').value : null, user_role: $('#f-role').value || null,
        safety_level: $('#f-safety').value, summary: val('summary'), source_name: val('source_name'), source_url: val('source_url'), coach_feedback: val('coach_feedback')
      });
      ['key_concepts', 'steps', 'grips', 'common_mistakes', 'opponent_reactions', 'counters', 'follow_ups', 'safety_notes'].forEach(function (k) { rec[k] = C.splitLines(val(k)); });
      var errs = C.validateTechnique(rec);
      $$('.err', form).forEach(function (e) { e.hidden = true; }); $$('.invalid', form).forEach(function (e) { e.classList.remove('invalid'); e.removeAttribute('aria-invalid'); });
      $$('[aria-describedby]', form).forEach(function (e) { if (/^e-/.test(e.getAttribute('aria-describedby'))) e.removeAttribute('aria-describedby'); });
      if (Object.keys(errs).length) {
        // BJJ-002: mark, link (aria-describedby) and focus the first invalid field in form order
        var fmap = { title: 'title_en', start_position: 'start', end_position: 'end', gi_mode: 'gi', alt_end_positions: 'alt', safety_level: 'safety' };
        var targets = [];
        Object.keys(errs).forEach(function (k) {
          var eid = 'e-' + (k === 'title' ? 'title_en' : k), e = $('#' + eid); if (e) { e.textContent = errs[k]; e.hidden = false; }
          var fs = k === 'category' ? $$('input[name=cat]', form) : [$('#f-' + (fmap[k] || k))];
          fs.forEach(function (f) { if (!f) return; f.classList.add('invalid'); f.setAttribute('aria-invalid', 'true'); if (e) f.setAttribute('aria-describedby', eid); });
          if (fs[0]) targets.push(fs[0]);
        });
        if (/safety_level/.test(Object.keys(errs).join())) { var fd = $('details.fold', form); if (fd) fd.open = true; }
        $('#form-errors').innerHTML = '<div class="banner error" role="alert"><div><strong>未儲存</strong>請補返標紅嘅必填欄。</div></div>';
        targets.sort(function (a, b) { return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1; });
        var first = targets[0] || $('.err:not([hidden])', form);
        if (first) { first.scrollIntoView({ block: 'center' }); if (first.focus) first.focus({ preventScroll: true }); }
        return;
      }
      var risky = C.detectRisky(rec);
      var gate = Promise.resolve(true);
      if ((risky.length || rec.safety_level === 'restricted') && !C.isRestricted(t0)) {
        gate = confirmBox({ title: '加入受限招式？', ok: '我明白，仍然加入', cancel: '返回修改', danger: true,
          html: '<div class="banner warn" id="safety-warning"><div><strong>' + esc(risky.length ? risky.join('、') : '受限招式') + '</strong>呢類動作（heel hook、neck crank、slam 等）受傷風險高，好多白帶／藍帶比賽規則都禁止。</div></div><p>會標做 <b>restricted</b>：白帶 Starter 圖同預設列表唔會顯示，要喺列表剔「顯示受限招式」先見到。</p>' }).then(function (ok) {
          if (ok) { rec.safety_level = 'restricted'; if (!rec.ruleset_warning) rec.ruleset_warning = '受限招式' + (risky.length ? '（' + risky.join('、') + '）' : '') + '：只喺教練睇住時練，留意比賽規則。'; }
          return ok;
        });
      }
      gate.then(function (ok) {
        if (!ok) return;
        if (!rec.status) rec.status = 'not started';
        var adds = $$('[data-map-add]').filter(function (box) { return $('input[name=maps]', box).checked; }).map(function (box) {
          return { map: box.getAttribute('data-map-add'), from: $('[data-ma=from]', box).value || rec.start_position, to: $('[data-ma=to]', box).value || rec.end_position };
        });
        return DB.saveTechnique(rec).then(function (saved) {
          return adds.reduce(function (p, a) { return p.then(function () { return addTechToMap(saved, a.map, a.from, a.to); }); }, Promise.resolve()).then(function () { return saved; });
        }).then(function (saved) {
          return refresh().then(function () {
            toast(isNew ? '已新增「' + tMain(saved) + '」' : '已儲存');
            location.hash = thenGo ? '#/clip/' + encodeURIComponent(saved.id) + '/' + thenGo : '#/t/' + encodeURIComponent(saved.id);
          });
        });
      }).catch(function (e) { toast('儲存失敗：' + (e.message || e)); });
    };
  }
  function nodeIdFor(mapId, posId) { return mapId + '::' + posId; }
  function ensureNode(mapId, posId, near) {
    var n = S.nodes.filter(function (x) { return x.roadmap_id === mapId && x.position_id === posId; })[0];
    if (n) return Promise.resolve(n);
    var ns = S.nodes.filter(function (x) { return x.roadmap_id === mapId; });
    var maxY = ns.reduce(function (m, x) { return Math.max(m, x.y); }, 0);
    var rec = { id: nodeIdFor(mapId, posId), roadmap_id: mapId, position_id: posId, x: near ? near.x + 220 : 0, y: near ? near.y + 160 : maxY + 200 };
    return DB.get('nodes', rec.id).then(function (old) { if (old) { old.deleted_at = null; return DB.put('nodes', old); } return DB.addNode(rec); }).then(function (r) { S.nodes.push(r); return r; });
  }
  function addTechToMap(t, mapId, fromPos, toPos) {
    return ensureNode(mapId, fromPos || t.start_position).then(function (a) {
      return ensureNode(mapId, toPos || t.end_position, a).then(function (b) {
        return DB.addEdge({ roadmap_id: mapId, from_node_id: a.id, to_node_id: b.id, technique_id: t.id, branch_condition: '', prerequisites: [] }).catch(function (e) { if (!e.user) throw e; toast(e.message); });
      });
    });
  }

  /* ── clip: upload (20 s limit + 0.5 s tolerance applies only here, decisions-v0 #15) ── */
  var LIMIT_S = C.LIMITS.maxClipSeconds + C.UPLOAD_TOLERANCE;
  function viewUpload(techId) {
    setNav('list', true);
    var t = S.techById[techId]; if (!t) { location.hash = '#/list'; return; }
    setHeader({ back: '#/t/' + encodeURIComponent(techId), title: '上傳訓練片' });
    var canEnc = V.canReencode();
    main.innerHTML = '<div class="main">' +
      '<div class="banner limit"><div><strong>試用原型限制</strong>每條最長 20.5 秒，目標 480p（約 1–2 MB）。格式：mp4、mov、webm。超過 20.5 秒會被拒絕（唔會喺 app 入面剪），請先喺相簿剪短，或者改用連結（連結冇長度限制）。片只存喺呢部機，唔會上傳去雲。</div></div>' +
      '<p class="fine">招式：' + esc(tMain(t)) + '</p>' +
      '<div class="file-well"><p>揀一條片或者直接錄</p><p class="fine">最長 20.5 秒</p><label class="btn primary" style="margin-top:12px" for="file">揀片</label><input type="file" id="file" accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm,.m4v" class="sr"></div>' +
      '<div id="file-info"></div><div id="up-error"></div>' +
      '<div id="up-form" hidden>' +
      '<label class="check"><input type="checkbox" id="compress"' + (canEnc ? ' checked' : ' disabled') + '> 壓縮到 480p（建議）</label>' + (canEnc ? '' : '<p class="hint">呢個瀏覽器唔支援喺機內壓縮；原檔 ≤ 10 MB 先可以照存。</p>') +
      '<label class="check"><input type="checkbox" id="keep-audio" checked> 保留聲音</label>' +
      '<div class="field"><label for="up-label">標籤</label><input type="text" id="up-label" maxlength="120" placeholder="例如 我自己操 · 11 月 8 日"></div>' +
      '<div class="field-row"><div class="field"><label for="up-start">由（可空）</label><input type="text" id="up-start" inputmode="numeric" placeholder="0:03"></div><div class="field"><label for="up-end">到（可空）</label><input type="text" id="up-end" inputmode="numeric" placeholder="0:15"></div></div>' +
      '<p class="hint" style="margin-top:-6px">片入面嘅 timestamp，撳標籤會由「由」開始播。</p><p class="err" id="up-range-err" hidden></p>' +
      '<div id="progress" hidden><div class="metric"><span>壓縮緊（即時播放壓縮，大約要片長咁耐）</span><span class="val" id="pct">0%</span></div><div class="progress"><i id="bar" style="width:0%"></i></div><p class="hint">壓縮期間唔好轉 app 或者鎖機。</p><button type="button" class="btn ghost full" id="cancel-upload">取消（唔會寫入）</button></div>' +
      '<div class="btn-row"><button type="button" class="btn primary full" id="do-upload">附加呢條片</button></div><div id="result"></div></div></div>';
    var file = null, meta = null, signal = null;
    $('#file').onchange = function () {
      file = this.files && this.files[0]; meta = null;
      $('#up-error').innerHTML = ''; $('#up-form').hidden = true; $('#file-info').innerHTML = ''; $('#result').innerHTML = '';
      if (!file) return;
      var pre = C.checkVideoFile(file);
      var info = function (d) {
        $('#file-info').innerHTML = '<div class="file-meta"><span class="fn">' + esc(file.name) + '</span><span class="k">大細</span><span class="v" id="fi-size">' + esc(C.formatBytes(file.size)) + '</span><span class="k">時長</span><span class="v" id="fi-dur">' + (d ? esc((Math.round(d.duration * 10) / 10) + ' 秒') : '—') + '</span><span class="k">畫質</span><span class="v">' + (d && d.width ? esc(d.width + '×' + d.height) : '—') + '</span></div>' +
          (d ? '<div class="duration-meter" id="dur-meter"><div class="scale"><span>0 秒</span><span>上限 ' + LIMIT_S + ' 秒</span></div><div class="bar ' + (C.planClip(d.duration).ok ? 'ok' : 'error') + '"><i style="width:' + Math.min(100, d.duration / LIMIT_S * 100) + '%"></i></div></div>' : '');
      };
      info(null);
      if (!pre.ok) { $('#up-error').innerHTML = errBanner('上傳唔到', pre.error); return; }
      V.probe(file).then(function (d) {
        meta = d; info(d);
        var plan = C.planClip(d.duration);
        if (!plan.ok) { $('#up-error').innerHTML = errBanner(plan.title || '片長超過 20 秒，請先剪短', plan.error) + '<a class="btn ghost full" href="#/clip/' + encodeURIComponent(techId) + '/link">改用連結（冇長度限制）</a>'; return; }
        $('#up-form').hidden = false;
        if (!$('#up-label').value) $('#up-label').value = tMain(t) + ' · ' + fmtDate(today());
      }).catch(function (e) { $('#up-error').innerHTML = errBanner('讀唔到呢條片', e.message + '（可能係壞檔或者假副檔名）'); });
    };
    $('#cancel-upload').onclick = function () { if (signal) signal.cancelled = true; };
    $('#do-upload').onclick = function () {
      if (!file || !meta) return;
      var st = C.parseTimestamp($('#up-start').value), en = C.parseTimestamp($('#up-end').value);
      var rerr = !st.ok ? st.error : !en.ok ? en.error : C.validateRange(st.value, en.value) || (en.value != null && en.value > Math.ceil(meta.duration) ? '「到」超過片長' : null);
      if (rerr) { $('#up-range-err').textContent = rerr; $('#up-range-err').hidden = false; return; }
      $('#up-range-err').hidden = true;
      var btn = this; btn.disabled = true; btn.textContent = '處理緊…';
      var clip = { technique_id: techId, source_type: 'upload', label: $('#up-label').value.trim(), start_seconds: st.value, end_seconds: en.value, original_name: file.name, original_bytes: file.size, duration_seconds: Math.round(meta.duration * 10) / 10 };
      var work;
      signal = { cancelled: false };
      function original(note) { return { blob: file, mime: file.type || 'video/mp4', width: meta.width, height: meta.height, compressed: false, note: note }; }
      if ($('#compress').checked && canEnc) {
        $('#progress').hidden = false;
        // reencode() creates its AudioContext synchronously inside this tap (needed on iOS)
        work = V.reencode(file, { maxSeconds: 21, audio: $('#keep-audio').checked, signal: signal, onProgress: function (f) { $('#pct').textContent = Math.round(f * 100) + '%'; $('#bar').style.width = (f * 100) + '%'; } })
          .then(function (r) {
            if (r.blob.size >= file.size && file.size <= C.LIMITS.maxFallbackBytes) return original('壓縮後反而大咗，所以存咗原檔。');
            return { blob: r.blob, mime: r.mime, width: r.width, height: r.height, compressed: true };
          }, function (e) {
            if (signal.cancelled) { var c = new Error('已取消，冇寫入任何嘢'); c.cancelled = true; throw c; }
            // decisions-v0 #2 / Roy v2: compression failed → keep original only if ≤ 10 MB
            var fb = C.fallbackAllowed(file.size);
            if (!fb.ok) throw new Error(fb.error + '（' + e.message + '）');
            return original(fb.note);
          });
      } else {
        var fb = C.fallbackAllowed(file.size);
        work = fb.ok ? Promise.resolve(original(canEnc ? '冇壓縮，存咗原檔。' : fb.note)) : Promise.reject(new Error(canEnc ? '原檔超過 10 MB，請剔返「壓縮到 480p」。' : fb.error));
      }
      work.then(function (r) {
        clip.mime = r.mime; clip.width = r.width; clip.height = r.height; clip.compressed = r.compressed;
        return DB.addClip(clip, r.blob).then(function (saved) { return { saved: saved, r: r }; });
      }).then(function (x) {
        $('#result').innerHTML = '<div class="banner ok" role="status" id="upload-ok"><div><strong>已儲存</strong>原檔 ' + esc(C.formatBytes(file.size)) + ' → ' + esc(C.formatBytes(x.saved.size_bytes)) + '（' + esc(x.r.width + '×' + x.r.height) + '，' + esc(x.r.mime) + '）' + (x.r.note ? '<br>' + esc(x.r.note) : '') + '</div></div><a class="btn primary full" href="#/t/' + encodeURIComponent(techId) + '">返招式</a>';
        btn.hidden = true; $('#progress').hidden = true;
        return refresh();
      }).catch(function (e) {
        if (e && e.name === 'QuotaExceededError') e = new Error('部機儲存空間唔夠。可以先匯出備份再刪走舊片。');
        $('#result').innerHTML = e && e.cancelled ? '<div class="banner info" role="status"><div><strong>已取消</strong>冇寫入任何嘢。</div></div>' : errBanner('儲存唔到', e.message || String(e));
        btn.disabled = false; btn.textContent = '再試一次'; $('#progress').hidden = true;
      });
    };
  }

  /* ── clip: link (no length limit) ── */
  function viewLink(techId) {
    setNav('list', true);
    var t = S.techById[techId]; if (!t) { location.hash = '#/list'; return; }
    setHeader({ back: '#/t/' + encodeURIComponent(techId), title: '貼片連結' });
    main.innerHTML = '<div class="main"><div class="banner limit"><div><strong>連結片</strong>接受 YouTube、Instagram（/reel、/p）、Google Drive。連結片冇長度限制；結束留空即係由開始播到片尾。</div></div>' +
      '<form id="link-form" novalidate><div class="field"><label for="lk-url">連結 <span class="req">*</span></label><input type="url" id="lk-url" inputmode="url" autocapitalize="none" autocomplete="off" placeholder="https://youtu.be/…" maxlength="2000"><p class="err" id="lk-url-err" hidden></p><p class="hint" id="lk-detect"></p></div>' +
      '<div class="field-row"><div class="field"><label for="lk-start">開始</label><input type="text" id="lk-start" placeholder="1:23" autocomplete="off"></div><div class="field"><label for="lk-end">結束（可空）</label><input type="text" id="lk-end" placeholder="1:41" autocomplete="off"></div></div>' +
      '<p class="hint" style="margin-top:-6px">接受 1:30、01:30、1:02:03 或純秒數 90。YouTube 連結有 t= 而你冇填開始，就用佢做開始。</p><p class="err" id="lk-range-err" hidden></p>' +
      '<div class="field"><label for="lk-label">標籤</label><input type="text" id="lk-label" maxlength="120" placeholder="例如 閉護剪刀掃 · 教練示範"></div>' +
      '<div class="btn-row"><button class="btn primary full">附加連結</button></div></form></div>';
    $('#lk-url').addEventListener('input', function () {
      var r = C.parseVideoLink(this.value);
      $('#lk-detect').textContent = r.ok ? '認到：' + { youtube: 'YouTube', instagram: 'Instagram', drive: 'Google Drive' }[r.source_type] + (r.start_from_url != null ? '（t= ' + C.formatTime(r.start_from_url) + '）' : '') : '';
      if (r.ok && r.start_from_url != null && !$('#lk-start').value) $('#lk-start').value = C.formatTime(r.start_from_url);
    });
    $('#link-form').onsubmit = function (ev) {
      ev.preventDefault();
      var r = C.parseVideoLink($('#lk-url').value), st = C.parseTimestamp($('#lk-start').value), en = C.parseTimestamp($('#lk-end').value);
      $('#lk-url-err').hidden = !!r.ok; $('#lk-url-err').textContent = r.ok ? '' : r.error; $('#lk-url').classList.toggle('invalid', !r.ok);
      var start = st.value; if (r.ok && start == null && r.start_from_url != null) start = r.start_from_url;
      var rerr = !st.ok ? '開始時間格式唔啱：' + st.error : !en.ok ? '結束時間無效：格式唔啱（用 mm:ss、hh:mm:ss 或秒數）' : (en.value != null && en.value <= (start || 0) ? '結束時間無效：要遲過開始（' + C.formatTime(start || 0) + '）' : null);
      $('#lk-range-err').hidden = !rerr; $('#lk-range-err').textContent = rerr || '';
      $('#lk-end').classList.toggle('invalid', !!rerr && !!(!en.ok || en.value != null));
      if (!r.ok || rerr) return;
      DB.addClip({ technique_id: techId, source_type: r.source_type, url: r.url, video_id: r.video_id, start_seconds: start, end_seconds: en.value, label: $('#lk-label').value.trim() })
        .then(refresh).then(function () { toast('已加片'); location.hash = '#/t/' + encodeURIComponent(techId); }).catch(function (e) { toast(e.message); });
    };
  }

  /* ── road map (hand-rolled SVG pan/zoom, see graph.js) ── */
  function mapShort(r) { return String(r.title_zh || r.title_en || r.id).replace(/\s*Road\s*Map$/i, '').replace(/\s+Passing$/i, '').replace(/\s*\/\s*/g, '／'); }
  function mapEdges(mapId) {
    var m = S.roadmaps.filter(function (x) { return x.id === mapId; })[0];
    var hide = m && m.hide_restricted !== false && !S.showRestricted;
    return S.edges.filter(function (e) { var t = S.techById[e.technique_id]; return e.roadmap_id === mapId && t && !(hide && C.isRestricted(t)); });
  }
  function edgeInfo(e) {
    var t = S.techById[e.technique_id] || {}, st = t.status || 'not started';
    return { title: tMain(t), short: shortZh(t), meta: [GI_ZH[t.gi_mode] || '', BELT_SHORT[t.suggested_belt] || '', C.STATUS_ZH[st]].filter(Boolean).join(' · '), statusClass: st.replace(/ /g, '-'), statusKey: st.replace(/ /g, '-'), statusZh: C.STATUS_ZH[st], restricted: C.isRestricted(t) };
  }
  /* D34 / BJJ-015 */
  function riskBadge(t) { return t && C.isRestricted(t) ? '<span class="pill high risk-badge">受限</span>' : ''; }
  function shortZh(t) { var z = String(t.title_zh || '').replace(/[（(].*$/, '').trim(); return z || tMain(t); }
  function viewMap(mapId, qs) {
    setNav('map');
    var m = S.roadmaps.filter(function (x) { return x.id === mapId; })[0];
    if (!m) { if (S.roadmaps[0]) location.hash = '#/map/' + encodeURIComponent(S.roadmaps[0].id); else main.innerHTML = '<div class="main"><div class="empty"><h2>未有路線圖</h2><p>去設定「補返範本」。</p></div></div>'; return; }
    S.lastMap = mapId; document.body.classList.add('is-map');
    var M = S.map; M.connectFrom = null; M.connecting = false; M.selectedEdge = qs.edge || null; M.selectedNode = qs.node || null;
    setHeader({ eyebrow: '試用原型 · 本機儲存', title: '路線圖', right: GEAR });
    var hidden = m.hide_restricted !== false && !S.showRestricted ? S.edges.filter(function (e) { var t = S.techById[e.technique_id]; return e.roadmap_id === mapId && t && C.isRestricted(t); }).length : 0;
    main.innerHTML = '<div class="map-view"><div class="map-tools"><div class="seg" role="group" aria-label="揀路線圖" style="grid-template-columns:repeat(' + S.roadmaps.length + ',1fr)">' +
      S.roadmaps.map(function (r) { return '<button type="button" data-map="' + esc(r.id) + '" aria-pressed="' + (r.id === mapId) + '">' + esc(mapShort(r)) + '</button>'; }).join('') +
      '</div><div class="zoom"><button type="button" id="z-out" aria-label="縮細">−</button><span class="lvl mono" id="z-lvl">100%</span><button type="button" id="z-in" aria-label="放大">+</button></div></div>' +
      '<p class="map-caption"><span class="cap-text">單指拖動畫面 · 雙指縮放 · 撳 +N 睇同一對位置全部招' + (hidden ? ' · 已隱藏 ' + hidden + ' 條受限招式' : '') + '</span><button type="button" class="chip legend-chip" id="legend-chip" aria-expanded="false" aria-controls="map-legend">圖例</button></p>' +
      // D37 / Roy v2.4 §7: legend panel (collapsed by default) opens BELOW the caption; the canvas moves down, nothing is covered
      '<div class="legend-panel" id="map-legend" role="region" aria-label="路線圖圖例" hidden>' + C.STATUSES.map(function (s) { var k = s.replace(/ /g, '-'); return '<div class="legend-row" data-status="' + esc(k) + '"><span class="st-mark st-' + esc(k) + '" aria-hidden="true">' + esc(G.STATUS_MARK[k]) + '</span><span class="name">' + esc(C.STATUS_ZH[s]) + '</span><span class="cue">' + (s === 'not started' ? '虛線' : '實線') + '</span></div>'; }).join('') + '</div>' +
      '<div class="canvas" id="canvas"><svg class="map" id="map-svg" role="application" aria-label="' + esc(m.title_zh) + '"></svg>' +
      '<div class="connect-bar" id="connect-bar" hidden><span id="connect-text" style="flex:1"></span><button type="button" class="text-btn" id="connect-cancel">取消</button></div>' +
      '<div class="float-tools"><button type="button" class="btn grow" id="add-node">' + ICON.plus + ' 位置</button><button type="button" class="btn grow" id="connect">連線</button><button type="button" class="btn grow" id="move" aria-pressed="' + M.moveMode + '">移動</button><button type="button" class="btn" id="fit">全圖</button></div></div>' +
      '<div class="sheet" id="sheet" hidden></div></div>';
    S.nodes.forEach(function (n) { var p = S.posById[n.position_id]; n.terminal = !!(p && p.kind === 'terminal'); });
    var g = currentGraph = new G.RoadMap($('#map-svg'), {
      canMove: function () { return M.moveMode; },
      onNodeTap: nodeTap, onEdgeTap: edgeTap,
      onBackgroundTap: function () { if (M.connecting) return; M.selectedNode = M.selectedEdge = null; draw(); $('#sheet').hidden = true; },
      onNodeMove: function (id, x, y) { DB.moveNode(id, x, y); },
      onView: function (v) { var l = $('#z-lvl'); if (l) l.textContent = Math.round(v.k * 100) + '%'; }
    });
    window.__bjjGraph = g;
    function data() {
      return { nodes: S.nodes.filter(function (n) { return n.roadmap_id === mapId; }), edges: mapEdges(mapId), edgeInfo: edgeInfo,
        nodeLabel: function (n) { return C.nodeLabel(n, S.posById); }, selectedNode: M.selectedNode, selectedEdge: M.selectedEdge, connectFrom: M.connectFrom };
    }
    function draw() { g.setData(data()); }
    function nodeById(id) { return S.nodes.filter(function (n) { return n.id === id; })[0]; }
    function nl(id) { var n = nodeById(id); return n ? C.nodeLabel(n, S.posById).zh : '?'; }
    draw(); g.fit();
    if (M.selectedEdge) { var se = S.edges.filter(function (e) { return e.id === M.selectedEdge; })[0]; if (se) { g.focusNode(se.from_node_id); edgeTap(se.id); } }
    else if (M.selectedNode) { g.focusNode(M.selectedNode); nodeTap(M.selectedNode); }
    $$('[data-map]').forEach(function (b) { b.onclick = function () { location.hash = '#/map/' + encodeURIComponent(b.getAttribute('data-map')); }; });
    $('#z-in').onclick = function () { g.zoomBy(1.25); }; $('#z-out').onclick = function () { g.zoomBy(0.8); }; $('#fit').onclick = function () { g.fit(); };
    $('#legend-chip').onclick = function () { var open = this.getAttribute('aria-expanded') !== 'true'; this.setAttribute('aria-expanded', open); this.classList.toggle('on', open); $('#map-legend').hidden = !open; };
    $('#move').onclick = function () { M.moveMode = !M.moveMode; this.setAttribute('aria-pressed', M.moveMode); toast(M.moveMode ? '移動模式：拖節點改位置' : '已關移動模式'); };
    $('#connect').onclick = function () { startConnect(null); };
    $('#connect-cancel').onclick = function () { M.connectFrom = null; M.connecting = false; $('#connect-bar').hidden = true; draw(); };
    $('#add-node').onclick = addNodeDialog;
    function startConnect(fromId) {
      $('#sheet').hidden = true; M.connecting = true; M.connectFrom = fromId; M.selectedNode = null; M.selectedEdge = null;
      $('#connect-bar').hidden = false; $('#connect-text').textContent = fromId ? '起點：' + nl(fromId) + ' → 撳終點' : '連線：撳起點位置';
      draw();
    }
    function nodeTap(id) {
      if (M.connecting) {
        if (!M.connectFrom) { startConnect(id); return; }
        var from = M.connectFrom; M.connecting = false; M.connectFrom = null; $('#connect-bar').hidden = true; draw();
        edgeDialog(from, id); return;
      }
      M.selectedNode = id; M.selectedEdge = null; draw();
      var n = nodeById(id), lab = C.nodeLabel(n, S.posById);
      var out = mapEdges(mapId).filter(function (e) { return e.from_node_id === id; });
      var inc = mapEdges(mapId).filter(function (e) { return e.to_node_id === id; });
      var techIds = {}; out.concat(inc).forEach(function (e) { techIds[e.technique_id] = 1; });
      var recent = S.logs.filter(function (l) { return techIds[l.technique_id]; }).sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); }).slice(0, 3);
      var link = n.link_roadmap_id && S.roadmaps.filter(function (r) { return r.id === n.link_roadmap_id; })[0];
      function item(e, dirText) { var t = S.techById[e.technique_id]; return '<a class="edge-item" href="#/t/' + encodeURIComponent(t.id) + '"><span class="t"><b>' + esc(tMain(t)) + '</b>' + riskBadge(t) + '<span>' + esc(dirText) + ' · ' + esc(edgeInfo(e).meta) + '</span>' + (e.branch_condition ? '<span>條件：' + esc(e.branch_condition) + '</span>' : '') + '</span>' + statusPill(t.status) + '</a>'; }
      sheet('<h2>' + esc(lab.zh) + '</h2><p class="subhead">' + esc([lab.role, lab.en].filter(Boolean).join(' · ')) + ' · 喺呢度我可以做咩</p>' +
        (out.length ? out.map(function (e) { return item(e, '→ ' + nl(e.to_node_id)); }).join('') : '<p class="fine">呢度未有出路。用「由呢度連線」加一招。</p>') +
        (inc.length ? '<p class="section-title" style="margin-top:12px">點樣嚟到呢度</p>' + inc.map(function (e) { return item(e, '由 ' + nl(e.from_node_id)); }).join('') : '') +
        '<p class="section-title" style="margin-top:12px">最近練習</p>' + (recent.length ? recent.map(function (l) { return '<p class="fine" style="margin:4px 0">' + esc(tMain(S.techById[l.technique_id])) + ' · ' + esc(fmtDate(l.date)) + ' ' + esc(C.SCENARIO_ZH[l.scenario]) + (l.confidence ? ' · 信心 ' + l.confidence + '／5' : '') + '</p>'; }).join('') : '<p class="fine">未有記錄。</p>') +
        (link ? '<a class="btn ghost full" style="margin-top:12px" id="jump-map" href="#/map/' + encodeURIComponent(link.id) + '?node=' + encodeURIComponent(nodeIdFor(link.id, n.position_id)) + '">跳去「' + esc(mapShort(link)) + '」↗</a>' : '') +
        '<div class="btn-row"><button type="button" class="btn ghost" id="from-here">由呢度連線</button><button type="button" class="btn ghost" id="rename-node">改名</button><button type="button" class="btn danger" id="del-node">刪除位置</button></div>');
      $('#from-here').onclick = function () { startConnect(id); };
      $('#rename-node').onclick = function () { renameNodeDialog(id); };
      $('#del-node').onclick = function () { deleteNode(id); };
    }
    function edgeTap(eid, ids) {
      if (M.connecting) return;
      var e = S.edges.filter(function (x) { return x.id === eid; })[0]; if (!e) return;
      var group = mapEdges(mapId).filter(function (x) { return x.from_node_id === e.from_node_id && x.to_node_id === e.to_node_id; });
      if (group.length > 1) return edgeListSheet(group);
      edgeDetail(eid);
    }
    function edgeListSheet(group) {
      var e0 = group[0]; M.selectedEdge = e0.id; M.selectedNode = null; draw();
      sheet('<h2>' + esc(nl(e0.from_node_id)) + ' → ' + esc(nl(e0.to_node_id)) + '</h2><p class="subhead">同一對位置 · ' + group.length + ' 招 · 撳 +' + (group.length - 1) + ' 打開</p><div id="edge-list">' +
        group.map(function (e) { var t = S.techById[e.technique_id]; return '<div class="edge-item"><a class="t" href="#/t/' + encodeURIComponent(t.id) + '" style="color:inherit"><b>' + esc(tMain(t)) + '</b>' + riskBadge(t) + '<span>' + esc(edgeInfo(e).meta) + '</span></a>' + statusPill(t.status) + '<button type="button" class="icon-btn" data-del-edge="' + esc(e.id) + '" aria-label="刪除 ' + esc(tMain(t)) + ' 呢條連線" style="color:var(--danger-text)">✕</button></div>'; }).join('') +
        '</div><button type="button" class="btn ghost full" id="add-same" style="margin-top:12px">' + ICON.plus + ' 再加一招</button>');
      $$('[data-del-edge]').forEach(function (b) { b.onclick = function () { deleteEdge(b.getAttribute('data-del-edge')); }; });
      $('#add-same').onclick = function () { edgeDialog(e0.from_node_id, e0.to_node_id); };
    }
    function edgeDetail(eid) {
      var e = S.edges.filter(function (x) { return x.id === eid; })[0]; if (!e) return;
      M.selectedEdge = eid; M.selectedNode = null; draw();
      var t = S.techById[e.technique_id];
      var mis = C.edgeMismatch(e.from_position_id, e.to_position_id, t);
      sheet('<h2>' + esc(tMain(t)) + ' ' + riskBadge(t) + '</h2><p class="subhead">' + esc(nl(e.from_node_id)) + ' → ' + esc(nl(e.to_node_id)) + ' · ' + esc(edgeInfo(e).meta) + '</p>' +
        (mis ? '<div class="banner info"><div><strong>提示</strong>' + esc(mis) + '（唔影響使用）</div></div>' : '') + safetyLine(t) +
        (e.branch_condition ? '<p class="note">條件：' + esc(e.branch_condition) + '</p>' : '') +
        '<div class="field" style="margin-top:8px"><label for="edge-st">學習狀態（跟招式走，所有連線共用）</label><select id="edge-st">' + C.STATUSES.map(function (s) { return '<option value="' + esc(s) + '"' + (s === (t.status || 'not started') ? ' selected' : '') + '>' + esc(C.STATUS_ZH[s]) + '</option>'; }).join('') + '</select></div>' +
        '<div class="btn-row"><a class="btn ghost" href="#/t/' + encodeURIComponent(t.id) + '">睇招式</a><button type="button" class="btn ghost" id="edit-edge">編輯連線</button><button type="button" class="btn danger" id="del-edge">刪除連線</button></div>');
      $('#edit-edge').onclick = function () { edgeEditDialog(eid); };
      $('#edge-st').onchange = function () { var v = this.value; updateTech(t.id, { status: v }).then(function () { toast('「' + tMain(t) + '」改咗做' + C.STATUS_ZH[v]); draw(); edgeDetail(eid); }).catch(saveFail); };
      $('#del-edge').onclick = function () { deleteEdge(eid); };
    }
    function deleteEdge(eid) {
      var e = S.edges.filter(function (x) { return x.id === eid; })[0], t = S.techById[e.technique_id];
      confirmBox({ title: '刪除呢條連線？', ok: '刪除', danger: true, html: '<p><b>' + esc(tMain(t)) + '</b>：' + esc(nl(e.from_node_id)) + ' → ' + esc(nl(e.to_node_id)) + '</p><p>招式本身會留喺列表。刪除後 10 秒內可以復原。</p>' }).then(function (ok) {
        if (!ok) return;
        DB.softDelete('edges', eid).then(refresh).then(function () {
          M.selectedEdge = null; $('#sheet').hidden = true; draw();
          offerUndo('已隱藏呢條邊', [{ store: 'edges', id: eid }], draw, '「' + tMain(t) + ' · ' + nl(e.from_node_id) + ' → ' + nl(e.to_node_id) + '」已從' + mapShort(m) + '隱藏。招式仍喺列表。');
        });
      });
    }
    function sheet(html) {
      var s = $('#sheet'); s.hidden = false;
      s.innerHTML = '<div class="handle"></div><button type="button" class="icon-btn sheet-close" aria-label="關閉">✕</button>' + html;
      $('.sheet-close', s).onclick = function () { s.hidden = true; M.selectedNode = M.selectedEdge = null; draw(); };
    }
    function deleteNode(id) {
      var lab = C.nodeLabel(nodeById(id), S.posById);
      DB.nodeImpact(id).then(function (edges) {
        var rows = edges.map(function (e) { return '<li>' + esc(tMain(S.techById[e.technique_id])) + '：' + esc(nl(e.from_node_id)) + ' → ' + esc(nl(e.to_node_id)) + '</li>'; }).join('');
        return confirmBox({ title: edges.length ? '呢個位置有 ' + edges.length + ' 條連線' : '從呢張圖移除位置？', danger: true, ok: edges.length ? '連埋 ' + edges.length + ' 條連線一齊刪' : '移除',
          html: '<p>「' + esc(lab.zh) + '」會喺「' + esc(mapShort(m)) + '」隱藏。<b>招式仍然留喺招式列表</b>；位置詞彙唔會刪。</p>' + (edges.length ? '<div class="affected" id="affected"><strong>會一齊隱藏嘅連線 · ' + edges.length + ' 條</strong><ul>' + rows + '</ul></div>' : '') });
      }).then(function (ok) {
        if (!ok) return;
        return DB.softDeleteNode(id).then(function (r) { return refresh().then(function () { $('#sheet').hidden = true; M.selectedNode = null; draw(); offerUndo('已隱藏呢個位置', r.undo, draw, '「' + lab.zh + '」同 ' + r.edges + ' 條連住嘅邊已從' + mapShort(m) + '隱藏。招式仍喺列表。'); }); });
      });
    }
    function addNodeDialog() {
      var onMap = {}; S.nodes.forEach(function (n) { if (n.roadmap_id === mapId) onMap[n.position_id] = 1; });
      openDialog('<h2 id="dialog-title">加位置</h2><label class="search">' + ICON.search + '<input type="search" id="pp-q" placeholder="搵位置…" autocomplete="off"></label><div class="pos-pick" id="pp-list" style="margin-top:8px"></div>' +
        '<details class="fold"><summary>自訂位置<span class="chev-d">▾</span></summary><form id="pp-new"><div class="field"><label for="pp-zh">中文名</label><input type="text" id="pp-zh" maxlength="60"></div><div class="field"><label for="pp-en">英文名</label><input type="text" id="pp-en" maxlength="60"></div>' +
        '<div class="field"><label for="pp-tb">上／下</label><select id="pp-tb"><option value="top">上</option><option value="bottom">下</option><option value="standing">站立</option></select></div><p class="err" id="pp-err" hidden></p><button class="btn primary full">加自訂位置</button></form></details>',
        function (b) {
          function list() {
            var q = C.norm($('#pp-q').value), html = '';
            KIND_GROUPS.forEach(function (gk) {
              var rows = S.positions.filter(function (p) { return !onMap[p.id] && (p.kind || 'custom') === gk[0] && (!q || C.norm([p.name_zh, p.name_en].concat(p.aliases || []).join(' ')).indexOf(q) >= 0); });
              if (rows.length) html += '<p class="section-title" style="margin:12px 0 0">' + esc(gk[1]) + '</p>' + rows.map(function (p) { return '<button type="button" data-pos="' + esc(p.id) + '"><span><b>' + esc(C.posName(p)) + '</b><br><span>' + esc(p.name_en) + '</span></span><span>' + ICON.plus + '</span></button>'; }).join('');
            });
            $('#pp-list').innerHTML = html || '<p class="fine">冇符合嘅位置（已喺圖上嘅唔會再列出）。</p>';
            $$('[data-pos]', b).forEach(function (x) { x.onclick = function () { place(x.getAttribute('data-pos')); }; });
          }
          $('#pp-q').oninput = list; list();
          $('#pp-new').onsubmit = function (ev) {
            ev.preventDefault();
            var zh = $('#pp-zh').value.trim(), en = $('#pp-en').value.trim();
            if (!zh && !en) { $('#pp-err').textContent = '最少填一個名'; $('#pp-err').hidden = false; return; }
            DB.put('positions', { id: 'pos-custom-' + C.uuid().slice(0, 8), name_zh: zh || en, name_en: en || zh, top_or_bottom: $('#pp-tb').value, parent_position: null, aliases: [], kind: 'custom', preloaded: false }).then(function (p) { return refresh().then(function () { place(p.id); }); });
          };
        });
      function place(posId) {
        var c = g.center(), nid = nodeIdFor(mapId, posId);
        DB.get('nodes', nid).then(function (old) {
          if (old) { old.deleted_at = null; old.x = Math.round(c.x); old.y = Math.round(c.y); return DB.put('nodes', old); }
          return DB.addNode({ id: nid, roadmap_id: mapId, position_id: posId, x: Math.round(c.x), y: Math.round(c.y) });
        }).then(refresh).then(function () { closeDialog(); S.nodes.forEach(function (n) { var p = S.posById[n.position_id]; n.terminal = !!(p && p.kind === 'terminal'); }); draw(); toast('已加「' + pName(posId) + '」，開「移動」可以拖去啱位'); });
      }
    }
    /* D36 / BJJ-013: rename a node on this map (label override only; the shared Position vocabulary is untouched) */
    function renameNodeDialog(id) {
      var n = nodeById(id), p = S.posById[n.position_id] || {}, lab = C.nodeLabel(n, S.posById);
      openDialog('<h2 id="dialog-title">改位置名</h2><p class="fine">只改呢張圖上嘅顯示名；位置詞彙「' + esc(C.posName(p)) + '」同其他圖唔受影響。留空就用返原名。</p><form id="rn-form" novalidate>' +
        '<div class="field"><label for="rn-zh">中文名</label><input type="text" id="rn-zh" maxlength="60" value="' + esc(n.label_zh || '') + '" placeholder="' + esc(p.name_zh || lab.zh) + '" autofocus></div>' +
        '<div class="field"><label for="rn-en">英文名</label><input type="text" id="rn-en" maxlength="60" value="' + esc(n.label_en || '') + '" placeholder="' + esc(p.name_en || '') + '"></div><p class="err" id="rn-err" role="alert" hidden></p>' +
        '<div class="btn-row"><button type="button" class="btn ghost" id="rn-cancel">取消</button><button class="btn primary" id="rn-save">儲存</button></div></form>', function (b) {
        $('#rn-cancel', b).onclick = closeDialog;
        $('#rn-form', b).onsubmit = function (ev) {
          ev.preventDefault();
          DB.renameNode(id, $('#rn-zh', b).value, $('#rn-en', b).value).then(refresh).then(function () { closeDialog(); draw(); nodeTap(id); toast('已改名'); })
            .catch(function (e) { $('#rn-err', b).textContent = e.message; $('#rn-err', b).hidden = false; });
        };
      });
    }
    /* D36 / BJJ-013: edit an edge — technique, from / to node, condition. Same rules as adding (D3, D38). */
    function edgeEditDialog(eid) {
      var e = S.edges.filter(function (x) { return x.id === eid; })[0]; if (!e) return;
      var ns = S.nodes.filter(function (n) { return n.roadmap_id === mapId; }).sort(function (x, y) { return nl(x.id).localeCompare(nl(y.id)); });
      var nodeOpts = function (sel) { return ns.map(function (n) { return '<option value="' + esc(n.id) + '"' + (n.id === sel ? ' selected' : '') + '>' + esc(nl(n.id)) + '</option>'; }).join(''); };
      var techs = S.techniques.filter(function (t) { return t.id === e.technique_id || S.showRestricted || !C.isRestricted(t); }).slice().sort(function (x, y) { return tMain(x).localeCompare(tMain(y)); });
      openDialog('<h2 id="dialog-title">編輯連線</h2><form id="ee-form" novalidate>' +
        '<div class="field"><label for="ee-tech">經過邊招</label><select id="ee-tech">' + techs.map(function (t) { return '<option value="' + esc(t.id) + '"' + (t.id === e.technique_id ? ' selected' : '') + '>' + esc(tMain(t)) + (C.isRestricted(t) ? '（受限）' : '') + '</option>'; }).join('') + '</select></div>' +
        '<div class="field-row"><div class="field"><label for="ee-from">由</label><select id="ee-from">' + nodeOpts(e.from_node_id) + '</select></div><div class="field"><label for="ee-to">去</label><select id="ee-to">' + nodeOpts(e.to_node_id) + '</select></div></div>' +
        '<div class="field"><label for="ee-cond">條件（可空）</label><input type="text" id="ee-cond" maxlength="200" value="' + esc(e.branch_condition || '') + '"></div><p class="hint" id="ee-hint"></p><p class="err" id="ee-err" role="alert" hidden></p>' +
        '<div class="btn-row"><button type="button" class="btn ghost" id="ee-cancel">取消</button><button class="btn primary" id="ee-save">儲存</button></div></form>', function (b) {
        var hint = function () { var a = nodeById($('#ee-from', b).value), z = nodeById($('#ee-to', b).value), mis = a && z ? C.edgeMismatch(a.position_id, z.position_id, S.techById[$('#ee-tech', b).value]) : null; $('#ee-hint', b).textContent = mis ? '提示：' + mis + '。照改都得。' : ''; };
        $$('select', b).forEach(function (s) { s.onchange = hint; }); hint();
        $('#ee-cancel', b).onclick = closeDialog;
        $('#ee-form', b).onsubmit = function (ev) {
          ev.preventDefault();
          DB.updateEdge(eid, { technique_id: $('#ee-tech', b).value, from_node_id: $('#ee-from', b).value, to_node_id: $('#ee-to', b).value, branch_condition: $('#ee-cond', b).value.trim() })
            .then(refresh).then(function () { closeDialog(); draw(); edgeDetail(eid); toast('已更新連線'); })
            .catch(function (x) { $('#ee-err', b).textContent = x.message; $('#ee-err', b).hidden = false; });
        };
      });
    }
    function edgeDialog(fromId, toId) {
      var a = nodeById(fromId), b = nodeById(toId);
      var techs = S.techniques.filter(function (t) { return S.showRestricted || !C.isRestricted(t); }).slice().sort(function (x, y) {
        var sx = (x.start_position === a.position_id ? 0 : 1) + (C.allEnds(x).indexOf(b.position_id) >= 0 ? 0 : 1), sy = (y.start_position === a.position_id ? 0 : 1) + (C.allEnds(y).indexOf(b.position_id) >= 0 ? 0 : 1);
        return sx - sy || tMain(x).localeCompare(tMain(y));
      });
      var self = fromId === toId;
      openDialog('<h2 id="dialog-title">連線</h2><p>' + esc(nl(fromId)) + ' → ' + esc(nl(toId)) + '</p>' + (self ? errBanner('唔可以自己連自己', '請揀另一個終點。') : '') +
        '<form id="edge-form"><div class="field"><label for="ed-tech">經過邊招</label><select id="ed-tech"><option value="">請揀…</option>' + techs.map(function (t) { return '<option value="' + esc(t.id) + '">' + esc(tMain(t)) + (tSub(t) ? ' · ' + esc(tSub(t)) : '') + '</option>'; }).join('') + '</select><p class="hint" id="ed-hint"></p></div>' +
        '<div class="field"><label for="ed-cond">條件（可空）</label><input type="text" id="ed-cond" maxlength="200" placeholder="例如 對手撐手"></div><p class="err" id="ed-err" role="alert" hidden></p>' +
        '<div class="btn-row"><a class="btn ghost" href="#/edit/new?from=' + encodeURIComponent(a.position_id) + '&to=' + encodeURIComponent(b.position_id) + '&map=' + encodeURIComponent(mapId) + '">' + ICON.plus + ' 新招式</a><button class="btn primary" id="ed-save"' + (self ? ' disabled' : '') + '>加連線</button></div></form>',
        function (bd) {
          $('#ed-tech', bd).onchange = function () { var mis = C.edgeMismatch(a.position_id, b.position_id, S.techById[this.value]); $('#ed-hint').textContent = mis ? '提示：' + mis + '。照加都得。' : ''; };
          $('#edge-form', bd).onsubmit = function (ev) {
            ev.preventDefault();
            DB.addEdge({ roadmap_id: mapId, from_node_id: fromId, to_node_id: toId, technique_id: $('#ed-tech').value, branch_condition: $('#ed-cond').value.trim(), prerequisites: [] })
              .then(refresh).then(function () { closeDialog(); draw(); toast('已加連線'); })
              .catch(function (e) { $('#ed-err').textContent = e.message; $('#ed-err').hidden = false; });
          };
        });
    }
  }

  /* ── settings ── */
  function onSettings() { return /^#\/settings/.test(location.hash) && !!$('#last-export'); }
  function viewSettings(qs) {
    setNav('list', true);
    setHeader({ back: '#/list', title: '設定' });
    main.innerHTML = '<div class="main"><div id="persist-warn"></div>' +
      '<div class="block"><h2 class="section-title">上次匯出</h2><p class="note" id="last-export">讀緊…</p></div>' +
      '<div class="block"><h2 class="section-title">匯出 JSON</h2>' +
      '<label class="check"><input type="checkbox" id="ex-videos"> 包埋上傳咗嘅片（base64，檔案會大好多）</label>' +
      '<button type="button" class="btn primary full" id="export">↓ 匯出</button><p class="hint">schema_version: 1，包埋已刪（deleted_at）嘅資料。唔包片嘅 JSON 細好多；喺另一部機匯入後，嗰啲片會顯示「片唔喺呢部機」。</p></div>' +
      '<div class="block"><h2 class="section-title">匯入 JSON</h2><label class="check"><input type="radio" name="im-mode" value="merge" checked> 合併（預設）：同一個 ID 以 updated_at 較新嗰份為準</label><label class="check"><input type="radio" name="im-mode" value="replace"> 全部取代：先清走呢部機所有資料（會再問一次）</label>' +
      '<label class="btn ghost full" for="import-file">↑ 揀 JSON 檔</label><input type="file" id="import-file" accept="application/json,.json" class="sr"><div id="import-status" role="status" style="margin-top:12px"></div></div>' +
      '<div class="block"><h2 class="section-title">主題</h2><div class="seg" role="group" aria-label="顯示主題" style="grid-template-columns:repeat(3,1fr)"><button type="button" data-theme-choice="light">淺色</button><button type="button" data-theme-choice="dark">深色</button><button type="button" data-theme-choice="system">跟系統</button></div></div>' +
      '<div class="block"><h2 class="section-title">刪除復原</h2><label class="check"><input type="checkbox" id="undo-long"' + (longUndo() ? ' checked' : '') + '> 延長 undo 時間（20 秒）</label><p class="hint">預設 10 秒；系統開咗「減少動態效果」都會自動用 20 秒。</p></div>' +
      '<div class="block"><h2 class="section-title">本機儲存</h2><div class="stat-grid" id="storage"><span>讀緊…</span></div><button type="button" class="btn ghost full" id="persist" style="margin-top:12px">再要求瀏覽器保留資料</button>' +
      '<p class="hint">資料只喺呢個瀏覽器（IndexedDB），唔會同步。iPhone Safari 可能清走 7 日冇開過嘅網站資料；加入主畫面嘅 app 同 Safari 分開儲存；私密瀏覽關咗就冇晒。記得定期匯出。</p></div>' +
      '<div class="block"><h2 class="section-title">範本</h2><p class="note" id="seed-info"></p><button type="button" class="btn ghost full" id="reseed">補返範本缺少嘅項目</button><p class="hint">只會加返唔見咗嘅範本行，唔會覆蓋你改過嘅資料；已刪（deleted_at）嘅唔會還原。</p></div>' +
      '<div class="block"><h2 class="section-title">危險區</h2><button type="button" class="btn danger full" id="wipe">清除呢部機所有資料</button></div>' +
      '<div class="block"><h2 class="section-title">關於</h2><p class="fine">BJJ 筆記 ' + APP_VERSION + ' · Phase 0 試用原型 · 無帳戶 · 無 backend。<br>Seed user：' + C.OWNER_ID + '</p><button type="button" class="btn ghost full" id="check-update">檢查更新</button></div></div>';
    if (window.BJJTheme) window.BJJTheme.set(window.BJJTheme.get());
    // BJJ-020: async fills only touch the page if Settings is still showing
    Promise.all([DB.getMeta('last_export_at'), Promise.resolve(persistState())]).then(function (r) {
      if (!$('#last-export')) return;
      $('#last-export').textContent = r[0] ? new Date(r[0]).toLocaleString('zh-HK', { dateStyle: 'medium', timeStyle: 'short' }) : '未匯出過';
      if (r[1] !== true) $('#persist-warn').innerHTML = '<div class="banner warn" id="persist-denied"><div><strong>瀏覽器可能會清除資料</strong>呢個瀏覽器冇答應長期保留資料（persist() ' + (r[1] === false ? '被拒' : '唔支援') + '）。照樣用得，但匯出提醒會改做每 3 日一次。iPhone 加入主畫面通常會好啲。</div></div>';
    });
    DB.getMeta('seed_version').then(function (v) { if (!$('#seed-info')) return; $('#seed-info').textContent = 'Rei seed ' + (v || '—') + (S.seedInfo && S.seedInfo.status ? '（' + S.seedInfo.status + '）' : '') + (S.seedProblems.length ? ' · 資料提示 ' + S.seedProblems.length + ' 項（見 console）' : ''); });
    storageInfo();
    $('#undo-long').onchange = function () { lsSet('bjj-undo-long', this.checked ? '1' : '0'); toast(this.checked ? 'Undo 改咗 20 秒' : 'Undo 返做 10 秒'); };
    $('#persist').onclick = function () { requestPersist(true).then(function () { if (onSettings()) viewSettings(); }); };
    $('#export').onclick = function () {
      var inc = $('#ex-videos').checked, btn = this; btn.disabled = true; btn.textContent = '匯出緊…';
      DB.exportAll({ includeVideos: inc, appVersion: APP_VERSION }).then(function (obj) {
        var blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
        var a = document.createElement('a'), u = URL.createObjectURL(blob);
        a.href = u; a.download = 'bjj-notes-' + today() + (inc ? '-with-videos' : '') + '.json'; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(u); }, 5000);
        return DB.markExported().then(function () { toast('已匯出 ' + C.formatBytes(blob.size)); if (onSettings()) viewSettings(); });
      }).catch(function (e) { toast('匯出失敗：' + e.message); btn.disabled = false; btn.textContent = '↓ 匯出'; });
    };
    $('#import-file').onchange = function () {
      var f = this.files && this.files[0]; this.value = ''; if (!f) return;
      var mode = ($('input[name=im-mode]:checked') || {}).value || 'merge';
      var st = $('#import-status');
      f.text().then(function (txt) {
        var obj; try { obj = JSON.parse(txt); } catch (e) { throw new Error('唔係有效嘅 JSON（' + e.message + '）'); }
        var err = DB.validateExport(obj); if (err) throw new Error(err);
        if (mode !== 'replace') return obj;
        return confirmBox({ title: '全部取代？', danger: true, ok: '清走並匯入', html: '<p>呢部機而家所有資料（包括片）會被清走，換成「' + esc(f.name) + '」入面嘅內容。<b>唔可以復原</b>，建議先匯出一份備份。</p>' }).then(function (ok) { return ok ? obj : null; });
      }).then(function (obj) {
        if (!obj) return;
        return DB.importAll(obj, { mode: mode }).then(function (c) { return refresh().then(function () { return DB.missingVideos(); }).then(function (miss) {
          if (st.isConnected) st.innerHTML = importReport(c, mode, miss.length);
        }); });
      }).catch(function (e) { if (st.isConnected) st.innerHTML = errBanner('匯入失敗，資料冇改到', e.message); else toast('匯入失敗：' + e.message); });
    };
    $('#reseed').onclick = function () { fetchSeed().then(function (s) { return DB.loadSeed(s); }).then(function (c) { return refresh().then(function () { toast('補返 ' + (c.positions + c.techniques + c.roadmaps + c.nodes + c.edges) + ' 項'); }); }).catch(function (e) { toast(e.message); }); };
    $('#wipe').onclick = function () {
      confirmBox({ title: '清除所有資料？', danger: true, ok: '清除', html: '<p>所有招式、片、練習記錄同路線圖修改都會冇咗，之後會自動放返兩個範本。<b>唔可以復原</b>，建議先匯出。</p>' }).then(function (ok) {
        if (!ok) return;
        DB.clearAll().then(boot).then(function () { toast('已清除，範本已放返'); location.hash = '#/list'; });
      });
    };
    $('#check-update').onclick = function () { if (!navigator.serviceWorker) { toast('呢個瀏覽器唔支援離線更新'); return; } navigator.serviceWorker.getRegistration().then(function (r) { if (!r) { toast('未裝離線版本（要 HTTPS 或 localhost）'); return; } return r.update().then(function () { if (!r.installing && !r.waiting) toast('已經係最新版本 ' + APP_VERSION); }); }); };
    if (qs && qs.export) setTimeout(function () { var b = $('#export'); if (b) { b.scrollIntoView({ block: 'center' }); b.focus(); } }, 50);
  }
  function importReport(c, mode, missing) {
    return '<div id="import-ok" class="import-report"><p class="section-title">' + (mode === 'replace' ? '全部取代完成' : '合併完成') + '</p>' +
      '<p>檔案嘅 schema_version 係 1，已開始匯入。單筆資料壞咗就跳過嗰筆，其他照收。</p>' +
      '<div class="stat-tiles"><div><b>' + (c.added + c.skipped) + '</b><span>新增或保留</span></div><div><b>' + c.updated + '</b><span>以較新者更新</span></div><div class="' + (c.bad ? 'warn' : '') + '"><b>' + c.bad + '</b><span>跳過</span></div></div>' +
      (c.bad ? '<p class="section-title" id="skip-count">跳過 ' + c.bad + ' 筆</p><ul class="skip-list">' + c.problems.map(function (p) { return '<li><code>' + esc(p.id || '（冇 id）') + '</code><span>' + esc(p.reason) + '（' + esc(p.store) + '），所以跳過呢筆。</span></li>'; }).join('') + '</ul>' : '') +
      (c.videos ? '<p class="fine">已匯入 ' + c.videos + ' 條片。</p>' : '') + (missing ? '<p class="fine">有 ' + missing + ' 條上傳片唔喺呢部機（匯出時冇包片）。</p>' : '') +
      '<p class="fine">撞同一個 ID 時，用 updated_at 較新嗰份。匯入唔算匯出，備份提醒照計。schema_version 唔啱或者 JSON 壞咗，會成個檔案拒絕，本機資料唔會改。</p></div>';
  }
  function storageInfo() {
    var el = $('#storage'); if (!el) return;
    var est = navigator.storage && navigator.storage.estimate ? navigator.storage.estimate() : Promise.resolve(null);
    Promise.all([est, Promise.resolve(persistState()), DB.all('clips')]).then(function (r) {
      if (!el.isConnected) return;
      var ups = r[2].filter(function (c) { return c.source_type === 'upload'; });
      var bytes = ups.reduce(function (s, c) { return s + (c.size_bytes || 0); }, 0);
      el.innerHTML = '<span>招式</span><span class="v">' + S.techniques.length + '</span><span>上傳片</span><span class="v">' + ups.length + ' 條 · ' + C.formatBytes(bytes) + '</span>' +
        (r[0] ? '<span>已用（估計）</span><span class="v">' + C.formatBytes(r[0].usage) + ' / ' + C.formatBytes(r[0].quota) + '</span>' : '') +
        '<span>保留資料（persist）</span><span class="v" id="persist-state">' + (r[1] == null ? '唔支援／未知' : r[1] ? '已批准' : '被拒') + '</span>';
    });
  }
  /* decisions-v0 #9/#17: call persist(); remember the answer (false → 3-day reminder + Settings warning) */
  function requestPersist(manual) {
    if (!navigator.storage || !navigator.storage.persist) { lsSet('bjj-persist', null); if (manual) toast('呢個瀏覽器唔支援 persist'); return Promise.resolve(null); }
    var already = navigator.storage.persisted ? navigator.storage.persisted() : Promise.resolve(false);
    return already.then(function (p) { return p || navigator.storage.persist(); }).then(function (ok) {
      ok = !!ok;
      lsSet('bjj-persist', ok ? 'granted' : 'denied'); return Promise.resolve().then(function () { if (manual) toast(ok ? '瀏覽器已答應保留資料' : '瀏覽器冇答應（Safari 通常要加入主畫面）'); return ok; });
    }).catch(function () { return null; });
  }

  /* ── service worker ── */
  function registerSW() {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
    navigator.serviceWorker.register('./sw.js').then(function (reg) {
      function show(w) { $('#update-bar').hidden = false; $('#apply-update').onclick = function () { w.postMessage({ type: 'SKIP_WAITING' }); }; }
      if (reg.waiting && navigator.serviceWorker.controller) show(reg.waiting);
      reg.addEventListener('updatefound', function () { var w = reg.installing; if (!w) return; w.addEventListener('statechange', function () { if (w.state === 'installed' && navigator.serviceWorker.controller) show(w); }); });
    }).catch(function (e) { console.warn('SW', e); });
    // reload only when an update replaces a previous worker (not on the very first install's clients.claim())
    var reloaded = false, hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', function () { if (reloaded || !hadController) return; reloaded = true; location.reload(); });
  }

  /* ── boot ── */
  function boot() {
    return DB.open().then(function () { return DB.getMeta('first_run_at'); }).then(function (f) { return f ? null : DB.setMeta('first_run_at', new Date().toISOString()); })
      .then(function () { return DB.ensureOwner(); })
      .then(function () { return DB.isEmpty(); })
      .then(function (empty) {
        // parse the seed every boot so problems are visible; write it only when the DB is empty (decisions-v0 #9)
        return fetchSeed().then(function (seed) {
          if (S.seedProblems.length) console.info('[BJJ seed] 資料提示（交返 Rei）：', S.seedProblems);
          return empty ? DB.loadSeed(seed) : null;
        }).catch(function (e) { if (empty) throw e; console.warn('seed', e); S.seedError = e.message; });
      })
      .then(refresh);
  }
  boot().then(function () { return requestPersist(false); }).then(function () {
    route(); registerSW();
    window.__bjjReady = true;
  }).catch(function (e) {
    console.error(e);
    main.innerHTML = '<div class="main">' + errBanner(e && e.code === 'SCHEMA' ? '範本格式唔啱' : '開唔到資料庫', (e && e.message || String(e)) + (e && e.code === 'SCHEMA' ? '' : '。如果用緊私密瀏覽模式，IndexedDB 可能被停用；或者關咗其他分頁再試。')) + '</div>';
    window.__bjjReady = 'error';
  });
  window.BJJApp = { state: S, refresh: refresh, route: route, version: APP_VERSION, undoSlot: undoSlot };
})();

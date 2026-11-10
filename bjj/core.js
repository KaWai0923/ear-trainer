/* BJJ 筆記 · core helpers (pure, no DOM). Works in browser (window.BJJCore) and Node (require). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BJJCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var OWNER_ID = '00000000-0000-4000-8000-000000000001'; // seed user (Ka Wai)
  var STATUSES = ['not started', 'learning', 'drilling', 'live rolling', 'reliable'];
  var STATUS_ZH = { 'not started': '未開始', 'learning': '學緊', 'drilling': '練緊', 'live rolling': '實戰試緊', 'reliable': '穩陣' }; // decisions-v0 #4
  var GI_MODES = ['gi', 'no-gi', 'both', 'gi-adaptable'];
  var BELTS = ['white_fundamental', 'white_advanced', 'blue', 'purple', 'brown_black'];
  var BELT_ZH = { white_fundamental: '白帶基礎', white_advanced: '白帶進階', blue: '藍帶', purple: '紫帶', brown_black: '啡／黑帶' };
  var CATEGORIES = ['takedown', 'guard pull', 'guard retention', 'guard pass', 'sweep', 'submission', 'escape', 'transition/control', 'back take', 'defense/counter', 'drill/movement'];
  var ROLES = ['top', 'bottom', 'standing'];
  var TOP_OR_BOTTOM = ['top', 'bottom', 'neutral', 'standing', 'n/a']; // seed v0.2.1 uses top/bottom/neutral; older values still accepted
  var SCENARIOS = ['class', 'open mat', 'drill', 'live'];
  var SCENARIO_ZH = { 'class': '上堂', 'open mat': 'Open mat', 'drill': 'Drill', 'live': 'Live roll' };
  var LIMITS = {
    maxClipSeconds: 20,           // Phase 0: 每條片最長 20 秒
    maxInputBytes: 500 * 1024 * 1024, // 原檔上限（壓縮前）
    maxFallbackBytes: 10 * 1024 * 1024, // decisions-v0 #2：壓縮失敗時，原檔 ≤ 10 MB 先照存
    targetShortSide: 480,
    videoBitsPerSecond: 600000,
    audioBitsPerSecond: 64000
  };
  var VIDEO_EXT = ['mp4', 'mov', 'webm', 'm4v'];
  var VIDEO_MIME = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v'];
  var RISKY = [
    { re: /heel\s*-?hook|腳跟|足跟/i, label: 'heel hook' },
    { re: /neck\s*-?crank|can\s*-?opener|扭頸|頸鎖|扭頸椎/i, label: 'neck crank' },
    { re: /\bslam(s|ming)?\b|摔砸|砸地/i, label: 'slam' },
    { re: /scissor\s+takedown|kani\s*basami|蟹挾/i, label: 'flying scissor (kani basami)' },
    { re: /twister|spine\s*lock|脊椎/i, label: 'spine lock / twister' }
  ];

  function uuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    var s = '', i, r;
    for (i = 0; i < 32; i++) { r = Math.random() * 16 | 0; s += (i === 12 ? 4 : i === 16 ? (r & 3 | 8) : r).toString(16); }
    return s.slice(0, 8) + '-' + s.slice(8, 12) + '-' + s.slice(12, 16) + '-' + s.slice(16, 20) + '-' + s.slice(20);
  }

  /* "90" | "1:30" | "01:30" | "1:02:03" → seconds. Empty → null. */
  function parseTimestamp(input) {
    var s = String(input == null ? '' : input).trim();
    if (!s) return { ok: true, value: null };
    if (/^\d+$/.test(s)) return { ok: true, value: parseInt(s, 10) };
    var m = s.match(/^(\d{1,3}):([0-5]?\d)$/);
    if (m) return { ok: true, value: parseInt(m[1], 10) * 60 + parseInt(m[2], 10) };
    m = s.match(/^(\d{1,3}):([0-5]?\d):([0-5]?\d)$/);
    if (m) return { ok: true, value: parseInt(m[1], 10) * 3600 + parseInt(m[2], 10) * 60 + parseInt(m[3], 10) };
    return { ok: false, value: null, error: '時間格式唔啱：用 mm:ss、hh:mm:ss 或者純秒數（例如 1:30 或 90）' };
  }
  function formatTime(sec) {
    if (sec == null || !isFinite(sec)) return '';
    sec = Math.max(0, Math.floor(sec));
    var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    return h ? h + ':' + pad(m) + ':' + pad(s) : m + ':' + pad(s);
  }
  function validateRange(start, end) {
    if (start != null && start < 0) return '開始時間唔可以係負數';
    if (end != null && (start == null ? 0 : start) >= end) return '完結時間一定要大過開始時間';
    return null;
  }
  /* YouTube t= values: "90", "90s", "1m30s", "1h2m3s" */
  function parseYouTubeT(t) {
    if (!t) return null;
    t = String(t).trim();
    if (/^\d+s?$/.test(t)) return parseInt(t, 10);
    var m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
    if (m && (m[1] || m[2] || m[3])) return (+(m[1] || 0)) * 3600 + (+(m[2] || 0)) * 60 + (+(m[3] || 0));
    return null;
  }
  function parseVideoLink(raw) {
    var s = String(raw || '').trim();
    if (!s) return { ok: false, error: '請貼條片連結' };
    if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
    var u;
    try { u = new URL(s); } catch (e) { return { ok: false, error: '連結格式唔啱' }; }
    var host = u.hostname.toLowerCase().replace(/^www\.|^m\./, '');
    var id, mm;
    if (host === 'youtu.be') {
      id = u.pathname.split('/')[1];
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'music.youtube.com') {
      if (u.pathname === '/watch') id = u.searchParams.get('v');
      else if ((mm = u.pathname.match(/^\/(shorts|embed|live|v)\/([^/?#]+)/))) id = mm[2];
    }
    if (host === 'youtu.be' || /(^|\.)youtube(-nocookie)?\.com$/.test(host)) {
      if (!id || !/^[A-Za-z0-9_-]{6,20}$/.test(id)) return { ok: false, error: '搵唔到 YouTube 片 ID' };
      var t = u.searchParams.get('t') || u.searchParams.get('start');
      if (!t && u.hash) { var hm = u.hash.match(/t=([0-9hms]+)/); if (hm) t = hm[1]; }
      return { ok: true, source_type: 'youtube', video_id: id, url: 'https://www.youtube.com/watch?v=' + id, start_from_url: parseYouTubeT(t) };
    }
    if (host === 'instagram.com') {
      mm = u.pathname.match(/^\/(?:[^/]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
      if (!mm) return { ok: false, error: 'Instagram 只接受 /reel/ 或 /p/ 連結' };
      var kind = mm[1] === 'reels' ? 'reel' : mm[1];
      return { ok: true, source_type: 'instagram', video_id: mm[2], url: 'https://www.instagram.com/' + kind + '/' + mm[2] + '/', start_from_url: null };
    }
    if (host === 'drive.google.com' || host === 'docs.google.com') {
      mm = u.pathname.match(/\/file\/d\/([A-Za-z0-9_-]+)/);
      id = mm ? mm[1] : u.searchParams.get('id');
      if (!id) return { ok: false, error: '搵唔到 Google Drive 檔案 ID（要 /file/d/… 嘅分享連結）' };
      return { ok: true, source_type: 'drive', video_id: id, url: 'https://drive.google.com/file/d/' + id + '/view', start_from_url: null };
    }
    if (/vimeo\.com$/.test(host)) return { ok: false, error: 'Vimeo 未支援（Phase 0 只接受 YouTube、Instagram、Google Drive）' };
    return { ok: false, error: '只接受 YouTube、Instagram、Google Drive 連結' };
  }
  function embedUrl(clip) {
    if (!clip || !clip.video_id) return null;
    if (clip.source_type === 'youtube') {
      var q = ['playsinline=1', 'rel=0'];
      if (clip.start_seconds != null) q.push('start=' + clip.start_seconds);
      if (clip.end_seconds != null) q.push('end=' + clip.end_seconds);
      return 'https://www.youtube-nocookie.com/embed/' + clip.video_id + '?' + q.join('&');
    }
    if (clip.source_type === 'instagram') return clip.url.replace(/\/$/, '') + '/embed';
    if (clip.source_type === 'drive') return 'https://drive.google.com/file/d/' + clip.video_id + '/preview';
    return null;
  }

  function fileExt(name) { var m = String(name || '').toLowerCase().match(/\.([a-z0-9]+)$/); return m ? m[1] : ''; }
  /* Pre-check before reading metadata. */
  function checkVideoFile(f) {
    var ext = fileExt(f && f.name), type = String(f && f.type || '').toLowerCase().split(';')[0];
    if (VIDEO_EXT.indexOf(ext) < 0 && VIDEO_MIME.indexOf(type) < 0) return { ok: false, error: '格式唔支援：只接受 mp4、mov、webm' };
    if (!f.size) return { ok: false, error: '檔案係空嘅' };
    if (f.size > LIMITS.maxInputBytes) return { ok: false, error: '檔案太大（上限 500 MB）' };
    return { ok: true };
  }
  /* decisions-v0 #15 (replaces #2): metadata duration ≤ 20.5 s passes; anything longer is rejected (no trim in MVP). Upload only — links have no limit (#1). */
  function planClip(duration) {
    var max = LIMITS.maxClipSeconds;
    if (!isFinite(duration) || duration <= 0) return { ok: false, error: '讀唔到片長，可能格式唔支援或者檔案壞咗' };
    if (duration > max + UPLOAD_TOLERANCE) return { ok: false, title: '片長超過 20 秒，請先剪短', error: '呢條片 ' + (Math.round(duration * 10) / 10) + ' 秒，超過 ' + (max + UPLOAD_TOLERANCE) + ' 秒上限' };
    return { ok: true, keep: duration };
  }
  /* decisions-v0 #2: compression failed → keep original only if ≤ 10 MB. */
  function fallbackAllowed(size) {
    if (size <= LIMITS.maxFallbackBytes) return { ok: true, note: '呢部機壓縮唔到 480p，已經照存原檔（' + formatBytes(size) + '）。' };
    return { ok: false, error: '呢部機壓縮唔到 480p，而原檔有 ' + formatBytes(size) + '（超過 10 MB），存唔到。請用相簿匯出細啲嘅版本再試。' };
  }
  function targetSize(w, h, shortSide) {
    shortSide = shortSide || LIMITS.targetShortSide;
    if (!w || !h) return { width: 854, height: 480 };
    var s = Math.min(w, h);
    var k = s > shortSide ? shortSide / s : 1;
    var even = function (n) { n = Math.round(n); return n % 2 ? n - 1 : n; };
    return { width: Math.max(2, even(w * k)), height: Math.max(2, even(h * k)) };
  }
  function formatBytes(b) {
    if (b == null) return '';
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(0) + ' KB';
    return (b / 1024 / 1024).toFixed(b < 10 * 1024 * 1024 ? 1 : 0) + ' MB';
  }

  function detectRisky(t) {
    var text = [t.title_zh, t.title_en].concat(t.aliases || [], t.tags || [], t.category || []).join(' ');
    var hits = [];
    RISKY.forEach(function (r) { if (r.re.test(text) && hits.indexOf(r.label) < 0) hits.push(r.label); });
    return hits;
  }
  /* decisions-v0 #10 + Roy v2: safety_level ∈ standard (no badge) | caution (「注意」badge) | restricted (hidden by default). No 'high'. */
  var SAFETY_LEVELS = ['standard', 'caution', 'restricted'];
  var HIDDEN_SAFETY = ['restricted'];
  var CAUTION_HINT = '早啲 tap、慢慢去到尾';
  function isRestricted(t) { return !!t && HIDDEN_SAFETY.indexOf(t.safety_level) >= 0; }
  function isCaution(t) { return !!t && t.safety_level === 'caution'; }
  var SEED_TS = '2026-01-01T00:00:00Z'; // decisions-v0 #11
  var UPLOAD_TOLERANCE = 0.5;           // decisions-v0 #15
  var UNDO_MS = 10000, UNDO_MS_LONG = 20000; // decisions-v0 #16/#18
  /* decisions-v0 #19 (supersedes #9/#17): clock = last export, else first user change. ≥7×24h, or ≥3×24h when persist()
     is denied or unsupported (anything but true). Dismissed banner stays hidden 24h. Import never counts as an export. */
  function backupReminder(lastExportIso, firstChangeIso, persistGranted, nowMs, dismissedIso) {
    var days = persistGranted === true ? 7 : 3, t = nowMs == null ? Date.now() : nowMs;
    var ref = lastExportIso || firstChangeIso;
    var elapsed = ref ? t - new Date(ref).getTime() : 0;
    var due = !!ref && elapsed >= days * 864e5;
    var snoozed = !!dismissedIso && t - new Date(dismissedIso).getTime() < 864e5;
    return { due: due, show: due && !snoozed, snoozed: snoozed, days: days, elapsedDays: Math.floor(elapsed / 864e5), neverExported: !lastExportIso };
  }
  /* decisions-v0 #18/#23/#24: one slot (latest delete replaces older). 10 s, or 20 s with prefers-reduced-motion or the
     Settings switch. Pauses on hover/focus and while the browser tab is hidden; switching in-app tabs keeps counting.
     The countdown pauses while the toast is hovered or focused. Clock = nowFn for tests. */
  function undoMs(reducedMotion) { return reducedMotion ? UNDO_MS_LONG : UNDO_MS; }
  function createUndoSlot(nowFn) {
    nowFn = nowFn || function () { return Date.now(); };
    var slot = null;
    function left() { if (!slot) return 0; return slot.pausedAt != null ? slot.remaining : slot.remaining - (nowFn() - slot.since); }
    return {
      set: function (action, ms) { slot = { action: action, remaining: ms || UNDO_MS, since: nowFn(), pausedAt: null }; return slot; },
      pause: function () { if (slot && slot.pausedAt == null) { slot.remaining = left(); slot.pausedAt = nowFn(); } },
      resume: function () { if (slot && slot.pausedAt != null) { slot.pausedAt = null; slot.since = nowFn(); } },
      remaining: function () { return Math.max(0, left()); },
      take: function () { var s = slot, ok = s && left() > 0; slot = null; return ok ? s.action : null; },
      peek: function () { return slot && left() > 0 ? slot.action : null; },
      clear: function () { slot = null; }
    };
  }
  /* ID helpers so the app works with both current and pos-/tech-/map-/edge- prefixed seeds (decisions-v0 #13). */
  function idKey(id) { return String(id || '').replace(/^(pos|tech|map|edge|roadmap)-/, ''); }

  function validateTechnique(t) {
    var e = {};
    if (!String(t.title_zh || '').trim() && !String(t.title_en || '').trim()) e.title = '至少要填一個名稱（中文或英文）';
    if (String(t.title_zh || '').length > 120 || String(t.title_en || '').length > 120) e.title = '名稱太長（最多 120 字）';
    if (!t.start_position) e.start_position = '請揀起點 Position';
    if (!t.end_position) e.end_position = '請揀終點 Position';
    if (!t.category || !t.category.length) e.category = '最少揀一個 category';
    if (GI_MODES.indexOf(t.gi_mode) < 0) e.gi_mode = '請揀 gi / no-gi';
    if (t.status && STATUSES.indexOf(t.status) < 0) e.status = 'Status 只可以係五個官方值之一';
    if (t.difficulty != null && t.difficulty !== '' && !(t.difficulty >= 1 && t.difficulty <= 5)) e.difficulty = '難度 1–5';
    if (t.confidence != null && t.confidence !== '' && !(t.confidence >= 1 && t.confidence <= 5)) e.confidence = 'Confidence 1–5';
    // BJJ-004 / D10: safety_level is part of the shared validator (in-app saves AND import, D38)
    if (t.safety_level != null && SAFETY_LEVELS.indexOf(t.safety_level) < 0) e.safety_level = 'safety_level 只可以係 standard／caution／restricted';
    if (t.alt_end_positions != null && !Array.isArray(t.alt_end_positions)) e.alt_end_positions = 'alt_end_positions 要係 array';
    else if ((t.alt_end_positions || []).indexOf(t.end_position) >= 0) e.alt_end_positions = '後備終點唔使重複主終點';
    return e;
  }

  /* ── D38: one validator for in-app saves and import ─────────────────────────────────────────
     ctx = { positions, techniques, roadmaps, nodes: id → row (soft-deleted rows included), edges: live edge rows }.
     Returns null or a short Cantonese reason. */
  var ID_PREFIX = { positions: 'pos-', techniques: 'tech-', roadmaps: 'map-', edges: 'edge-' };
  var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  var CLIP_SOURCES = ['upload', 'youtube', 'instagram', 'drive'];
  function idProblem(store, id) {
    var pre = ID_PREFIX[store];
    if (!pre || String(id).indexOf(pre) === 0) return null;
    if (UUID_RE.test(id)) return null; // legacy v0.1.0/0.1.1 user rows used bare UUIDs
    return 'ID「' + id + '」冇用「' + pre + '」開頭（decisions-v0 #13）';
  }
  function parseTime(v) { if (v == null || v === '') return null; var n = Date.parse(v); return isNaN(n) ? NaN : n; }
  function validateRecord(store, row, ctx) {
    ctx = ctx || {};
    if (!row || typeof row !== 'object' || Array.isArray(row)) return '唔係物件';
    if (typeof row.id !== 'string' || !row.id) return '冇 id';
    var ip = idProblem(store, row.id); if (ip) return ip;
    if (row.updated_at != null && isNaN(parseTime(row.updated_at))) return 'updated_at 唔係日期';
    if (row.created_at != null && isNaN(parseTime(row.created_at))) return 'created_at 唔係日期';
    var has = function (k, id) { return !!(ctx[k] && ctx[k][id]); };
    if (store === 'positions') {
      if (!String(row.name_zh || '').trim() && !String(row.name_en || '').trim()) return '位置冇名';
      if (row.top_or_bottom != null && TOP_OR_BOTTOM.indexOf(row.top_or_bottom) < 0) return 'top_or_bottom「' + row.top_or_bottom + '」唔合法';
    }
    if (store === 'techniques') {
      var e = validateTechnique(row), k = Object.keys(e);
      if (k.length) return k.map(function (x) { return e[x]; }).join('；');
      var ps = [row.start_position, row.end_position].concat(row.alt_end_positions || []);
      for (var i = 0; i < ps.length; i++) if (ctx.positions && !has('positions', ps[i])) return 'position ' + ps[i] + ' 唔存在';
    }
    if (store === 'roadmaps' && !String(row.title_zh || row.title_en || '').trim()) return '路線圖冇名';
    if (store === 'nodes') {
      if (!row.roadmap_id || !row.position_id) return '節點欠 roadmap_id／position_id';
      if (ctx.roadmaps && !has('roadmaps', row.roadmap_id)) return 'roadmap ' + row.roadmap_id + ' 唔存在';
      if (ctx.positions && !has('positions', row.position_id)) return 'position ' + row.position_id + ' 唔存在';
    }
    if (store === 'edges') {
      if (!row.from_node_id || !row.to_node_id || !row.technique_id) return '連線欠 from／to／technique';
      if (row.from_node_id === row.to_node_id) return '唔可以自己連自己';
      if (ctx.techniques && !has('techniques', row.technique_id)) return 'technique ' + row.technique_id + ' 唔存在';
      if (ctx.nodes) {
        var a = ctx.nodes[row.from_node_id], b = ctx.nodes[row.to_node_id];
        if (!a || !b) return '連線嘅節點唔存在';
        if (a.roadmap_id !== b.roadmap_id || (row.roadmap_id && a.roadmap_id !== row.roadmap_id)) return '兩個節點唔喺同一張 Road Map';
        if (!row.deleted_at && (a.deleted_at || b.deleted_at)) return '唔可以連去已刪除嘅節點';
      }
      if (ctx.positions) {
        var fp = row.from_position_id || row.from_position, tp = row.to_position_id || row.to_position;
        if ((fp && !has('positions', fp)) || (tp && !has('positions', tp))) return 'from／to position 唔存在';
      }
      if (!row.deleted_at && ctx.edges && ctx.edges.some(function (x) { return !x.deleted_at && x.id !== row.id && x.from_node_id === row.from_node_id && x.to_node_id === row.to_node_id && x.technique_id === row.technique_id; })) return '呢條邊線已經存在（同一招、同一起點終點）';
      if (row.stage != null && (typeof row.stage !== 'number' || row.stage % 1)) return 'stage 要係整數';
    }
    if (store === 'clips') {
      if (!row.technique_id) return '欠 technique_id';
      if (ctx.techniques && !has('techniques', row.technique_id)) return 'technique ' + row.technique_id + ' 唔存在';
      if (CLIP_SOURCES.indexOf(row.source_type) < 0) return 'source_type「' + row.source_type + '」唔支援';
      var rg = validateRange(row.start_seconds, row.end_seconds); if (rg) return rg;
      if ((row.start_seconds != null && !(row.start_seconds >= 0)) || (row.end_seconds != null && !(row.end_seconds >= 0))) return '時間唔可以係負數';
      if (row.source_type === 'upload') {
        if (!(row.duration_seconds > 0) || row.duration_seconds > LIMITS.maxClipSeconds + UPLOAD_TOLERANCE) return '上傳片長超過 20.5 秒上限';
      } else {
        var L = parseVideoLink(row.url || ''); if (!L.ok) return '連結唔合法：' + L.error;
        if (L.source_type !== row.source_type) return 'source_type 同連結唔夾';
      }
    }
    if (store === 'logs') {
      if (!row.technique_id) return '欠 technique_id';
      if (ctx.techniques && !has('techniques', row.technique_id)) return 'technique ' + row.technique_id + ' 唔存在';
      if (SCENARIOS.indexOf(row.scenario) < 0) return 'scenario「' + row.scenario + '」唔合法';
    }
    return null;
  }
  /* BJJ-018: compare updated_at as time, not as strings. >0 when a is newer. Unparseable = oldest. */
  function compareTime(a, b) { var x = parseTime(a), y = parseTime(b); x = isNaN(x) || x == null ? -Infinity : x; y = isNaN(y) || y == null ? -Infinity : y; return x === y ? 0 : x > y ? 1 : -1; }

  /* Edge rules: no self-loop, no duplicate (same from/to/technique), no deleted/missing nodes. */
  function validateEdge(edge, nodes, edges) {
    var byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; });
    var a = byId[edge.from_node_id], b = byId[edge.to_node_id];
    if (!edge.from_node_id || !edge.to_node_id) return '請揀起點同終點';
    if (!edge.technique_id) return '請揀一招 technique';
    if (edge.from_node_id === edge.to_node_id) return '唔可以自己連自己';
    if (!a || !b) return '節點唔存在';
    if (a.deleted_at || b.deleted_at) return '唔可以連去已刪除嘅節點';
    if (a.roadmap_id && b.roadmap_id && a.roadmap_id !== b.roadmap_id) return '兩個節點唔喺同一張 Road Map';
    var dup = edges.some(function (x) {
      return !x.deleted_at && x.id !== edge.id && x.from_node_id === edge.from_node_id && x.to_node_id === edge.to_node_id && x.technique_id === edge.technique_id;
    });
    if (dup) return '呢條邊線已經存在（同一招、同一起點終點）';
    return null;
  }

  /* decisions-v0 #3: edge from/to need not match the technique's start/end — only a hint. Supports alt_end_positions. */
  function edgeMismatch(fromPos, toPos, t) {
    if (!t) return null;
    var hints = [];
    if (t.start_position && fromPos !== t.start_position) hints.push('起點同呢招嘅 start position 唔同');
    var ends = [t.end_position].concat(t.alt_end_positions || []);
    if (t.end_position && ends.indexOf(toPos) < 0) hints.push('終點唔係呢招嘅 end（或後備終點）');
    return hints.length ? hints.join('；') : null;
  }
  function allEnds(t) { return t ? [t.end_position].concat(t.alt_end_positions || []).filter(Boolean) : []; }
  function norm(s) { return String(s == null ? '' : s).normalize('NFKC').toLowerCase().trim(); }
  /* decisions-v0 #22: gi or no-gi filter also includes 'both' and 'gi-adaptable'. */
  function giMatch(mode, want) {
    if (!want) return true;
    if (want === 'gi' || want === 'no-gi') return mode === want || mode === 'both' || mode === 'gi-adaptable';
    return mode === want;
  }
  /* decisions-v0 #22 + #25: search = title_zh, title_en, aliases, tags + these "notes" fields. Not grips, instructor, etc. */
  var SEARCH_NOTE_FIELDS = ['summary', 'key_concepts', 'steps', 'common_mistakes', 'personal_notes', 'coach_feedback'];
  function filterTechniques(list, query, f, positions) {
    f = f || {};
    var q = norm(query), posName = {};
    (positions || []).forEach(function (p) { posName[p.id] = [p.name_zh, p.name_en].concat(p.aliases || []).join(' '); });
    return list.filter(function (t) {
      if (t.deleted_at) return false;
      if (!f.showRestricted && isRestricted(t)) return false;
      if (f.position && t.start_position !== f.position && allEnds(t).indexOf(f.position) < 0) return false;
      if (f.category && (t.category || []).indexOf(f.category) < 0) return false;
      if (f.gi_mode && !giMatch(t.gi_mode, f.gi_mode)) return false;
      if (f.belt && t.suggested_belt !== f.belt) return false;
      if (f.status && (t.status || 'not started') !== f.status) return false;
      if (f.tag && (t.tags || []).map(norm).indexOf(norm(f.tag)) < 0) return false;
      if (!q) return true;
      var hay = norm([t.title_zh, t.title_en].concat(asList(t.aliases), asList(t.tags), SEARCH_NOTE_FIELDS.map(function (k) { return asList(t[k]).join(' '); })).join(' '));
      return q.split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
    });
  }
  function techTitle(t) { if (!t) return '（已刪除）'; return t.title_zh || t.title_en || '（無名）'; }
  function techSub(t) { return t && t.title_zh && t.title_en ? t.title_en : ''; }
  var ROLE_ZH = { top: '上', bottom: '下', standing: '中立', neutral: '中立', 'n/a': '終結' };
  function nodeLabel(n, posById) {
    var p = posById[n.position_id] || {};
    return { zh: n.label_zh || p.name_zh || '?', en: n.label_en || p.name_en || '', role: ROLE_ZH[p.top_or_bottom] || '' };
  }
  function posName(p) { if (!p) return '（未知位置）'; var r = ROLE_ZH[p.top_or_bottom]; return p.name_zh + (r && p.kind !== 'terminal' && !/（.*[上下].*）/.test(p.name_zh) ? '（' + r + '）' : ''); }
  function asList(v) { if (v == null) return []; if (Array.isArray(v)) return v.filter(function (x) { return x != null && String(x).trim(); }).map(String); return splitLines(v); }
  function splitLines(s) { return String(s || '').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean); }
  function splitList(s) { return String(s || '').split(/[,，、\n]+/).map(function (x) { return x.trim(); }).filter(Boolean); }

  /* Rei seed (content/seed.json, read-only) → internal seed. Done at load time; the source file is never modified.
     Import order is positions → techniques → roadmaps → edges (see db.loadSeed). owner_id null → OWNER_ID.
     Map nodes in Rei's file are position ids without coordinates; layout comes from data/layout.json (fallback: grid). */
  /* decisions-v0 #13: older seeds used unprefixed ids; add pos-/tech-/map-/edge- so both load the same way. */
  function normalizeSeedIds(rei, problems) {
    var o = JSON.parse(JSON.stringify(rei)), fixed = 0;
    function P(pre, id) { if (id == null || id === '') return id; id = String(id); if (id.indexOf(pre + '-') === 0) return id; fixed++; return pre + '-' + id.replace(/^(roadmap|rm)-/, ''); }
    o.positions.forEach(function (p) { p.id = P('pos', p.id); if (p.parent_position) p.parent_position = P('pos', p.parent_position); if (p.perspective_of) p.perspective_of = P('pos', p.perspective_of); });
    o.techniques.forEach(function (t) {
      t.id = P('tech', t.id); t.start_position = P('pos', t.start_position); t.end_position = P('pos', t.end_position);
      if (Array.isArray(t.alt_end_positions)) t.alt_end_positions = t.alt_end_positions.map(function (x) { return P('pos', x); });
    });
    o.roadmaps.forEach(function (r) { r.id = P('map', r.id); (r.nodes || []).forEach(function (n) { n.position_id = P('pos', n.position_id); if (n.link_to_roadmap) n.link_to_roadmap = P('map', n.link_to_roadmap); }); });
    (o.roadmap_edges || []).forEach(function (e) {
      e.id = P('edge', e.id); e.roadmap_id = P('map', e.roadmap_id); e.from_position = P('pos', e.from_position); e.to_position = P('pos', e.to_position); e.technique_id = P('tech', e.technique_id);
      if (Array.isArray(e.prerequisites)) e.prerequisites = e.prerequisites.map(function (x) { return P('tech', x); });
    });
    if (fixed) problems.push(fixed + ' 個 ID 冇 pos-／tech-／map-／edge- 前綴，載入時補咗（decisions-v0 #13）');
    return o;
  }
  function transformReiSeed(rei, layout) {
    layout = layout || {};
    var problems = [];
    if (!rei || !Array.isArray(rei.positions) || !Array.isArray(rei.techniques) || !Array.isArray(rei.roadmaps)) throw new Error('Rei seed 格式唔啱');
    rei = normalizeSeedIds(rei, problems);
    var missingTs = 0;
    function own(r) {
      var o = JSON.parse(JSON.stringify(r)); if (o.owner_id == null) o.owner_id = OWNER_ID; if (o.deleted_at === undefined) o.deleted_at = null;
      if (!o.created_at || !o.updated_at) missingTs++;
      o.created_at = o.created_at || SEED_TS; o.updated_at = o.updated_at || o.created_at; // decisions-v0 #11
      return o;
    }
    if (rei.schema_version !== 1) { var se = new Error('Seed 嘅 schema_version 係「' + rei.schema_version + '」，呢個 app 只接受 1（decisions-v0 #12）'); se.code = 'SCHEMA'; throw se; }
    var pos = rei.positions.map(own), posIds = {};
    pos.forEach(function (p) { posIds[p.id] = p; p.preloaded = p.is_preloaded !== false; });
    // parents first so a parent row always exists before its children
    var depth = function (p, n) { n = n || 0; return p.parent_position && posIds[p.parent_position] && n < 10 ? depth(posIds[p.parent_position], n + 1) + 1 : 0; };
    pos.sort(function (a, b) { return depth(a) - depth(b); });
    pos.forEach(function (p) {
      if (p.top_or_bottom === 'n/a') { /* Rei uses n/a for the terminal node */ }
      if (p.parent_position && !posIds[p.parent_position]) problems.push('position ' + p.id + '：parent_position ' + p.parent_position + ' 唔存在');
      if (TOP_OR_BOTTOM.indexOf(p.top_or_bottom) < 0) problems.push('position ' + p.id + '：top_or_bottom「' + p.top_or_bottom + '」唔喺詞彙入面');
      if (p.kind === 'perspective' && !p.perspective_of) problems.push('position ' + p.id + '：kind=perspective 但 perspective_of 係 null');
    });
    var techIds = {};
    var techs = rei.techniques.map(function (t) {
      var o = own(t);
      ['aliases', 'category', 'tags', 'key_concepts', 'steps', 'grips', 'common_mistakes', 'opponent_reactions', 'counters', 'follow_ups', 'safety_notes', 'alt_end_positions'].forEach(function (k) { o[k] = asList(o[k]); });
      delete o.media_clips; // placeholder only (README)
      o.status = STATUSES.indexOf(o.status) >= 0 ? o.status : 'not started';
      techIds[o.id] = o;
      [o.start_position, o.end_position].concat(o.alt_end_positions).forEach(function (pid) { if (pid && !posIds[pid]) problems.push('technique ' + o.id + '：position ' + pid + ' 唔存在'); });
      if (GI_MODES.indexOf(o.gi_mode) < 0) problems.push('technique ' + o.id + '：gi_mode「' + o.gi_mode + '」');
      if (BELTS.indexOf(o.suggested_belt) < 0) problems.push('technique ' + o.id + '：suggested_belt「' + o.suggested_belt + '」');
      (o.category || []).forEach(function (c) { if (CATEGORIES.indexOf(c) < 0) problems.push('technique ' + o.id + '：category「' + c + '」唔喺詞彙'); });
      if (SAFETY_LEVELS.indexOf(o.safety_level) < 0) { problems.push('technique ' + o.id + '：safety_level「' + o.safety_level + '」唔係 standard／caution／restricted，當 standard'); o.safety_level = 'standard'; }
      var risky = detectRisky(o); if (risky.length && !isRestricted(o)) problems.push('technique ' + o.id + '：名似危險動作（' + risky.join('、') + '）但 safety_level 唔係 restricted');
      return o;
    });
    var maps = [];
    rei.roadmaps.forEach(function (rm) {
      var r = own(rm), L = layout[rm.id] || layout[idKey(rm.id)] || {}, nodes = [], byPos = {};
      (rm.stages || []).forEach(function (st) { if (typeof st.key !== 'number' || st.key % 1) problems.push('roadmap ' + rm.id + '：stage key「' + st.key + '」唔係整數（decisions-v0 #14）'); });
      var list = rm.nodes || [];
      list.forEach(function (n, i) {
        if (!posIds[n.position_id]) problems.push('roadmap ' + rm.id + '：node position ' + n.position_id + ' 唔存在');
        if (byPos[n.position_id]) { problems.push('roadmap ' + rm.id + '：node ' + n.position_id + ' 重複'); return; }
        var xy = L[n.position_id] || L[idKey(n.position_id)] || { x: (i % 3) * 220 - 220, y: Math.floor(i / 3) * 180 };
        if (!L[n.position_id] && !L[idKey(n.position_id)]) problems.push('layout：' + rm.id + ' / ' + n.position_id + ' 冇座標，用咗 grid');
        var node = { id: rm.id + '::' + n.position_id, roadmap_id: rm.id, position_id: n.position_id, x: xy.x, y: xy.y, link_roadmap_id: n.link_to_roadmap || null, owner_id: OWNER_ID, deleted_at: null, created_at: r.created_at, updated_at: r.created_at };
        byPos[n.position_id] = node; nodes.push(node);
      });
      r.hide_restricted = rm.hide_safety_restricted !== false;
      r.sort_order = maps.length;
      delete r.nodes;
      r.nodes = nodes; r.edges = [];
      maps.push(r);
    });
    var mapById = {}; maps.forEach(function (m) { mapById[m.id] = m; });
    var seen = {};
    (rei.roadmap_edges || []).forEach(function (e) {
      var m = mapById[e.roadmap_id];
      if (!m) { problems.push('edge ' + e.id + '：roadmap ' + e.roadmap_id + ' 唔存在'); return; }
      var a = m.nodes.filter(function (n) { return n.position_id === e.from_position; })[0], b = m.nodes.filter(function (n) { return n.position_id === e.to_position; })[0];
      if (!a || !b) { problems.push('edge ' + e.id + '：from/to 唔喺 ' + m.id + ' 嘅 nodes'); return; }
      if (!techIds[e.technique_id]) { problems.push('edge ' + e.id + '：technique ' + e.technique_id + ' 唔存在'); return; }
      var k = m.id + '|' + e.from_position + '|' + e.to_position + '|' + e.technique_id;
      if (seen[k]) { problems.push('edge ' + e.id + '：重複'); return; } seen[k] = 1;
      var mis = edgeMismatch(e.from_position, e.to_position, techIds[e.technique_id]); if (mis) problems.push('edge ' + e.id + '：' + mis);
      (e.prerequisites || []).forEach(function (pq) { if (!techIds[pq]) problems.push('edge ' + e.id + '：prerequisite ' + pq + ' 唔存在'); });
      var o = own(e);
      o.from_node_id = a.id; o.to_node_id = b.id; o.from_position_id = e.from_position; o.to_position_id = e.to_position;
      o.prerequisites = asList(e.prerequisites); o.branch_condition = e.branch_condition || '';
      if (e.stage != null && (typeof e.stage !== 'number' || e.stage % 1)) problems.push('edge ' + e.id + '：stage「' + e.stage + '」唔係整數');
      m.edges.push(o);
    });
    // decisions-v0 #13: prefixes + no collisions across entity types
    var allIds = {}, collide = [], unpref = { pos: 0, tech: 0, map: 0, edge: 0 };
    function chk(id, pre, kind) { if (String(id).indexOf(pre + '-') !== 0) unpref[pre]++; if (allIds[id]) collide.push(id + '（' + allIds[id] + ' / ' + kind + '）'); allIds[id] = kind; }
    pos.forEach(function (p) { chk(p.id, 'pos', 'position'); });
    techs.forEach(function (t) { chk(t.id, 'tech', 'technique'); });
    maps.forEach(function (m) { chk(m.id, 'map', 'roadmap'); m.edges.forEach(function (e) { chk(e.id, 'edge', 'edge'); }); });
    Object.keys(unpref).forEach(function (k) { if (unpref[k]) problems.push(unpref[k] + ' 個 ' + k + ' ID 冇用「' + k + '-」開頭（decisions-v0 #13）'); });
    if (collide.length) problems.push('ID 撞咗：' + collide.join('、'));
    if (missingTs) problems.push(missingTs + ' 行冇 created_at／updated_at，載入時用 ' + SEED_TS + '（decisions-v0 #11）');
    return { format: 'bjj-seed', schema_version: 1, seed_version: (rei.meta && rei.meta.version) || 'unknown', status: rei.meta && rei.meta.content_review_status, source: 'content/seed.json (Rei)', positions: pos, techniques: techs, roadmaps: maps, problems: problems };
  }

  return {
    OWNER_ID: OWNER_ID, STATUSES: STATUSES, STATUS_ZH: STATUS_ZH, GI_MODES: GI_MODES, BELTS: BELTS, BELT_ZH: BELT_ZH,
    CATEGORIES: CATEGORIES, ROLES: ROLES, TOP_OR_BOTTOM: TOP_OR_BOTTOM, SCENARIOS: SCENARIOS, SCENARIO_ZH: SCENARIO_ZH, LIMITS: LIMITS,
    uuid: uuid, parseTimestamp: parseTimestamp, formatTime: formatTime, validateRange: validateRange, parseYouTubeT: parseYouTubeT,
    parseVideoLink: parseVideoLink, embedUrl: embedUrl, checkVideoFile: checkVideoFile, planClip: planClip,
    targetSize: targetSize, formatBytes: formatBytes, detectRisky: detectRisky, isRestricted: isRestricted,
    validateTechnique: validateTechnique, edgeMismatch: edgeMismatch, allEnds: allEnds, fallbackAllowed: fallbackAllowed,
    ROLE_ZH: ROLE_ZH, posName: posName, asList: asList, transformReiSeed: transformReiSeed, HIDDEN_SAFETY: HIDDEN_SAFETY, validateEdge: validateEdge, filterTechniques: filterTechniques,
    techTitle: techTitle, techSub: techSub, nodeLabel: nodeLabel, splitLines: splitLines, splitList: splitList, norm: norm,
    SAFETY_LEVELS: SAFETY_LEVELS, CAUTION_HINT: CAUTION_HINT, isCaution: isCaution, backupReminder: backupReminder, createUndoSlot: createUndoSlot, idKey: idKey, UNDO_MS: UNDO_MS, UPLOAD_TOLERANCE: UPLOAD_TOLERANCE, SEED_TS: SEED_TS, UNDO_MS_LONG: UNDO_MS_LONG, undoMs: undoMs, giMatch: giMatch, validateRecord: validateRecord, compareTime: compareTime, idProblem: idProblem, CLIP_SOURCES: CLIP_SOURCES, SEARCH_NOTE_FIELDS: SEARCH_NOTE_FIELDS
  };
});

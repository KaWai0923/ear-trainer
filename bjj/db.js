/* BJJ 筆記 · IndexedDB data layer. Browser: window.BJJDB. Node tests: require('./db.js')(indexedDB, core).
   Stores mirror spec v0.2 entities; every business row has owner_id + nullable deleted_at (soft delete).
   Video bytes live in 'blobs' as ArrayBuffer + mime (more reliable than Blob-in-IDB on older iOS Safari). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.BJJDB = factory(root.indexedDB, root.BJJCore);
})(typeof self !== 'undefined' ? self : this, function (idb, Core) {
  'use strict';
  var DB_NAME = 'bjj-notes', DB_VERSION = 1;
  var STORES = ['users', 'shares', 'positions', 'techniques', 'roadmaps', 'nodes', 'edges', 'clips', 'logs', 'blobs', 'meta'];
  var DATA_STORES = ['users', 'shares', 'positions', 'techniques', 'roadmaps', 'nodes', 'edges', 'clips', 'logs'];
  var dbp = null, dbName = DB_NAME;

  function req(r) { return new Promise(function (res, rej) { r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); }; }); }
  function open(name) {
    if (dbp) return dbp;
    dbp = new Promise(function (res, rej) {
      var r = idb.open(name || dbName, DB_VERSION);
      r.onupgradeneeded = function () {
        var db = r.result;
        STORES.forEach(function (s) {
          if (db.objectStoreNames.contains(s)) return;
          var os = db.createObjectStore(s, { keyPath: s === 'meta' ? 'key' : 'id' });
          if (s === 'nodes' || s === 'edges') os.createIndex('roadmap_id', 'roadmap_id');
          if (s === 'edges' || s === 'clips' || s === 'logs') os.createIndex('technique_id', 'technique_id');
        });
      };
      r.onsuccess = function () { var db = r.result; db.onversionchange = function () { db.close(); dbp = null; }; res(db); };
      r.onerror = function () { dbp = null; rej(r.error); };
      r.onblocked = function () { rej(new Error('資料庫被另一個分頁鎖住，請關咗其他分頁再試')); };
    });
    return dbp;
  }
  /* decisions-v0 #19: the export-reminder clock starts at the first user add/edit/delete (seed writes don't count). */
  var USER_STORES = ['positions', 'techniques', 'roadmaps', 'nodes', 'edges', 'clips', 'logs'], quiet = 0;
  function markChanged() {
    return getMeta('first_change_at').then(function (v) { return v ? v : setMeta('first_change_at', now()); }).catch(function () {});
  }
  function tx(stores, mode, fn) {
    var tracked = mode === 'readwrite' && !quiet && stores.some(function (s) { return USER_STORES.indexOf(s) >= 0; });
    var p = txRaw(stores, mode, fn);
    return tracked ? p.then(function (v) { return markChanged().then(function () { return v; }); }) : p;
  }
  function txRaw(stores, mode, fn) {
    return open().then(function (db) {
      return new Promise(function (res, rej) {
        var t = db.transaction(stores, mode), out;
        t.oncomplete = function () { res(out); };
        t.onerror = function () { rej(t.error); };
        t.onabort = function () { rej(t.error || new Error('transaction aborted')); };
        Promise.resolve(fn(t)).then(function (v) { out = v; }, function (e) { try { t.abort(); } catch (x) {} rej(e); });
      });
    });
  }
  function now() { return new Date().toISOString(); }
  function stamp(rec) {
    var n = now();
    if (!rec.id) rec.id = Core.uuid();
    if (!rec.owner_id) rec.owner_id = Core.OWNER_ID;
    if (!rec.created_at) rec.created_at = n;
    rec.updated_at = n;
    if (rec.deleted_at === undefined) rec.deleted_at = null;
    return rec;
  }
  function get(store, id) { return tx([store], 'readonly', function (t) { return req(t.objectStore(store).get(id)); }); }
  function all(store, opts) {
    opts = opts || {};
    return tx([store], 'readonly', function (t) {
      var os = t.objectStore(store);
      var r = opts.index ? os.index(opts.index).getAll(opts.value) : os.getAll();
      return req(r).then(function (rows) { return opts.includeDeleted ? rows : rows.filter(function (x) { return !x.deleted_at; }); });
    });
  }
  function put(store, rec) { stamp(rec); return tx([store], 'readwrite', function (t) { return req(t.objectStore(store).put(rec)).then(function () { return rec; }); }); }
  function getMeta(key) { return get('meta', key).then(function (r) { return r ? r.value : undefined; }); }
  function setMeta(key, value) { return tx(['meta'], 'readwrite', function (t) { return req(t.objectStore('meta').put({ key: key, value: value })); }); }

  function ensureOwner() {
    return get('users', Core.OWNER_ID).then(function (u) {
      if (u) return u;
      // BJJ-008 / D11: the seed user is seed data → fixed timestamps, so clear → re-seed → merge import round-trips
      var u2 = { id: Core.OWNER_ID, display_name: 'Ka Wai', email: null, auth_provider: null, owner_id: Core.OWNER_ID, deleted_at: null, created_at: Core.SEED_TS, updated_at: Core.SEED_TS };
      return txRaw(['users'], 'readwrite', function (t) { return req(t.objectStore('users').put(u2)).then(function () { return u2; }); });
    });
  }

  /* Seed: add only rows whose id is missing, so re-running never overwrites the user's edits.
     Accepts the internal 'bjj-seed' shape (Core.transformReiSeed output). Import order (Rei README):
     positions → techniques → roadmaps (+ their nodes) → edges, each stage its own transaction. */
  function loadSeed(seed, opts) {
    opts = opts || {};
    if (!seed || seed.format !== 'bjj-seed') return Promise.reject(new Error('Seed 格式唔啱'));
    var counts = { positions: 0, techniques: 0, roadmaps: 0, nodes: 0, edges: 0, order: [] };
    function stage(store, rows) {
      counts.order.push(store);
      return txRaw([store], 'readwrite', function (t) {
        var os = t.objectStore(store);
        // sequential puts keep the in-file order (parents before children)
        return rows.reduce(function (p, src) {
          return p.then(function () {
            return req(os.get(src.id)).then(function (ex) {
              if (ex) return;
              var rec = Object.assign({}, src);
              if (rec.owner_id == null) rec.owner_id = Core.OWNER_ID;
              // decisions-v0 #11: keep the seed's own fixed timestamps, never "now"
              var ca = rec.created_at || Core.SEED_TS, ua = rec.updated_at || ca;
              if (!rec.id) rec.id = Core.uuid(); if (rec.deleted_at === undefined) rec.deleted_at = null;
              rec.created_at = ca; rec.updated_at = ua; rec.seed = true;
              counts[store]++;
              return req(os.put(rec));
            });
          });
        }, Promise.resolve());
      });
    }
    var maps = seed.roadmaps || [], nodes = [], edges = [];
    var mapRows = maps.map(function (rm) {
      (rm.nodes || []).forEach(function (n) { nodes.push(Object.assign({ roadmap_id: rm.id }, n)); });
      var nodePos = {}; (rm.nodes || []).forEach(function (n) { nodePos[n.id] = n.position_id; });
      (rm.edges || []).forEach(function (e) { edges.push(Object.assign({ roadmap_id: rm.id, from_position_id: nodePos[e.from_node_id], to_position_id: nodePos[e.to_node_id] }, e)); });
      var r = Object.assign({}, rm); delete r.nodes; delete r.edges; return r;
    });
    return ensureOwner()
      .then(function () { return stage('positions', seed.positions || []); })
      .then(function () { return stage('techniques', (seed.techniques || []).map(function (x) { return Object.assign({ status: 'not started' }, x); })); })
      .then(function () { return stage('roadmaps', mapRows); })
      .then(function () { return stage('nodes', nodes); })
      .then(function () { return stage('edges', edges); })
      .then(function () { return setMeta('seed_version', seed.seed_version); })
      .then(function () { return counts; });
  }
  /* decisions-v0 #9: if the DB is empty (first run or cleared), put both templates back. Never touches existing data. */
  /* decisions-v0 #20: empty = positions, techniques AND roadmaps have zero rows, soft-deleted rows included. */
  function isEmpty() {
    var three = ['positions', 'techniques', 'roadmaps'];
    return txRaw(three, 'readonly', function (t) {
      return Promise.all(three.map(function (s) { return req(t.objectStore(s).count()); }));
    }).then(function (ns) { return ns.every(function (n) { return n === 0; }); });
  }

  function seedIfEmpty(seed) {
    return isEmpty().then(function (empty) { return empty ? loadSeed(seed).then(function (c) { c.seeded = true; return c; }) : { seeded: false }; });
  }
  /* BJJ-011: undo never creates a duplicate live edge; such edges are left deleted and reported. */
  function restoreMany(list) {
    var res = { restored: 0, conflicts: [] };
    return (list || []).reduce(function (p, x) {
      return p.then(function () {
        if (x.store !== 'edges') return restore(x.store, x.id).then(function () { res.restored++; });
        return Promise.all([get('edges', x.id), all('edges')]).then(function (r) {
          var e = r[0]; if (!e) return;
          var dup = r[1].some(function (o) { return o.id !== e.id && o.roadmap_id === e.roadmap_id && o.from_node_id === e.from_node_id && o.to_node_id === e.to_node_id && o.technique_id === e.technique_id; });
          if (dup) { res.conflicts.push(x.id); return; }
          return restore('edges', x.id).then(function () { res.restored++; });
        });
      });
    }, Promise.resolve()).then(function () { return res; });
  }
  function restore(store, id) {
    return get(store, id).then(function (r) { if (!r) throw new Error('not found'); r.deleted_at = null; return put(store, r); });
  }

  function vfail(msg, fields) { var e = new Error(msg); e.user = true; if (fields) e.fields = fields; return Promise.reject(e); }
  function saveTechnique(t) {
    var errs = Core.validateTechnique(t);
    if (Object.keys(errs).length) return vfail('未儲存：' + Object.keys(errs).map(function (k) { return errs[k]; }).join('；'), errs);
    if (!t.status) t.status = 'not started';
    if (!t.id) t.id = 'tech-' + Core.uuid(); // D13 prefix for new rows
    return loadCtx().then(function (ctx) {
      var why = Core.validateRecord('techniques', Object.assign({}, t, { updated_at: null }), vctx(ctx));
      return why ? vfail(why) : put('techniques', t);
    });
  }
  /* generic validated write for user edits (D38) */
  function saveValidated(store, rec) {
    return loadCtx().then(function (ctx) {
      var why = Core.validateRecord(store, Object.assign({ id: rec.id || 'tmp' }, rec, { updated_at: null }), vctx(ctx));
      return why ? vfail(why) : put(store, rec);
    });
  }
  function techniqueImpact(id) {
    return Promise.all([all('edges', { index: 'technique_id', value: id }), all('roadmaps'), all('clips', { index: 'technique_id', value: id })]).then(function (r) {
      var maps = {};
      r[1].forEach(function (m) { maps[m.id] = m; });
      var perMap = {};
      r[0].forEach(function (e) { var m = maps[e.roadmap_id]; var k = m ? m.title_zh : e.roadmap_id; perMap[k] = (perMap[k] || 0) + 1; });
      return { edges: r[0], clips: r[2], maps: perMap };
    });
  }
  function softDeleteTechnique(id) {
    var ts = now();
    return tx(['techniques', 'edges', 'clips'], 'readwrite', function (t) {
      var T = t.objectStore('techniques'), E = t.objectStore('edges'), C = t.objectStore('clips'), n = { edges: 0, clips: 0 };
      return req(T.get(id)).then(function (rec) {
        if (!rec) throw new Error('搵唔到呢招');
        rec.deleted_at = ts; rec.updated_at = ts; n.undo = [{ store: 'techniques', id: id }];
        return req(T.put(rec));
      }).then(function () { return req(E.index('technique_id').getAll(id)); }).then(function (es) {
        return Promise.all(es.filter(function (e) { return !e.deleted_at; }).map(function (e) { e.deleted_at = ts; e.updated_at = ts; n.edges++; n.undo.push({ store: 'edges', id: e.id }); return req(E.put(e)); }));
      }).then(function () { return req(C.index('technique_id').getAll(id)); }).then(function (cs) {
        return Promise.all(cs.filter(function (c) { return !c.deleted_at; }).map(function (c) { c.deleted_at = ts; c.updated_at = ts; n.clips++; n.undo.push({ store: 'clips', id: c.id }); return req(C.put(c)); }));
      }).then(function () { return { edges: n.edges, clips: n.clips, undo: n.undo }; });
    });
  }
  function nodeImpact(nodeId) {
    return all('edges').then(function (es) { return es.filter(function (e) { return e.from_node_id === nodeId || e.to_node_id === nodeId; }); });
  }
  function softDeleteNode(nodeId) {
    var ts = now();
    return tx(['nodes', 'edges'], 'readwrite', function (t) {
      var N = t.objectStore('nodes'), E = t.objectStore('edges'), n = 0, undo = [{ store: 'nodes', id: nodeId }];
      return req(N.get(nodeId)).then(function (rec) {
        if (!rec) throw new Error('搵唔到節點');
        rec.deleted_at = ts; rec.updated_at = ts;
        return req(N.put(rec)).then(function () { return req(E.index('roadmap_id').getAll(rec.roadmap_id)); });
      }).then(function (es) {
        return Promise.all(es.filter(function (e) { return !e.deleted_at && (e.from_node_id === nodeId || e.to_node_id === nodeId); })
          .map(function (e) { e.deleted_at = ts; e.updated_at = ts; n++; undo.push({ store: 'edges', id: e.id }); return req(E.put(e)); }));
      }).then(function () { return { edges: n, undo: undo }; });
    });
  }
  function softDelete(store, id) {
    return get(store, id).then(function (r) { if (!r) throw new Error('not found'); r.deleted_at = now(); return put(store, r); });
  }
  function addNode(n) {
    if (!n.roadmap_id || !n.position_id) return Promise.reject(new Error('節點要有 Road Map 同 Position'));
    if (!n.id) n.id = n.roadmap_id + '::' + n.position_id;
    return saveValidated('nodes', n);
  }
  /* D36: rename a node (label override; the Position vocabulary row is untouched) */
  function renameNode(id, zh, en) {
    return get('nodes', id).then(function (n) {
      if (!n) return vfail('節點唔存在');
      n.label_zh = String(zh || '').trim() || null; n.label_en = String(en || '').trim() || null;
      if ((n.label_zh || '').length > 60 || (n.label_en || '').length > 60) return vfail('名太長（最多 60 字）');
      return put('nodes', n);
    });
  }
  /* D36: edit an edge's technique / from / to / condition; same rules as adding (self-loop, duplicate, same map) */
  function updateEdge(id, patch) {
    return loadCtx().then(function (ctx) {
      var e = ctx.edges[id]; if (!e || e.deleted_at) return vfail('連線唔存在');
      var next = Object.assign({}, e, patch);
      if (patch.technique_id && (!ctx.techniques[patch.technique_id] || ctx.techniques[patch.technique_id].deleted_at)) return vfail('呢招唔存在或者已刪除');
      var a = ctx.nodes[next.from_node_id], b = ctx.nodes[next.to_node_id];
      if (a) next.from_position_id = a.position_id; if (b) next.to_position_id = b.position_id;
      var why = Core.validateRecord('edges', Object.assign({}, next, { updated_at: null }), vctx(ctx));
      return why ? vfail(why) : put('edges', next);
    });
  }
  /* D36 / BJJ-012: edit one clip (label, start/end, and URL for link clips) with the shared validator */
  function updateClip(id, patch) {
    return Promise.all([get('clips', id)]).then(function (r) {
      var c = r[0]; if (!c || c.deleted_at) return vfail('片段唔存在');
      var next = Object.assign({}, c);
      ['label', 'start_seconds', 'end_seconds'].forEach(function (k) { if (k in patch) next[k] = patch[k]; });
      if (c.source_type !== 'upload' && patch.url != null) {
        var L = Core.parseVideoLink(patch.url);
        if (!L.ok) return vfail(L.error);
        next.url = L.url || patch.url; next.source_type = L.source_type;
        if (L.video_id !== undefined) next.video_id = L.video_id;
      }
      return get('techniques', c.technique_id).then(function (t) {
        var m = {}; if (t) m[t.id] = t;
        var why = Core.validateRecord('clips', Object.assign({}, next, { updated_at: null }), { techniques: m });
        return why ? vfail(why) : put('clips', next);
      });
    });
  }
  function addEdge(e) {
    return Promise.all([all('nodes', { index: 'roadmap_id', value: e.roadmap_id, includeDeleted: true }), all('edges', { index: 'roadmap_id', value: e.roadmap_id }), e.technique_id ? get('techniques', e.technique_id) : null]).then(function (r) {
      var err = Core.validateEdge(e, r[0], r[1]);
      if (!err && (!r[2] || r[2].deleted_at)) err = '呢招唔存在或者已刪除';
      if (err) { var x = new Error(err); x.user = true; throw x; }
      var byId = {}; r[0].forEach(function (n) { byId[n.id] = n; });
      e.from_position_id = byId[e.from_node_id].position_id;
      e.to_position_id = byId[e.to_node_id].position_id;
      if (!e.id) e.id = 'edge-' + Core.uuid(); // D13
      return saveValidated('edges', e);
    });
  }
  function moveNode(id, x, y) {
    return get('nodes', id).then(function (n) { if (!n) return; n.x = Math.round(x); n.y = Math.round(y); return put('nodes', n); });
  }

  /* Media */
  function addClip(clip, blob) {
    if (clip.source_type === 'upload') {
      if (!blob) return Promise.reject(new Error('冇片'));
      if (!(clip.duration_seconds > 0) || clip.duration_seconds > Core.LIMITS.maxClipSeconds + Core.UPLOAD_TOLERANCE) return Promise.reject(new Error('片長超過 20 秒，請先剪短（上限 20.5 秒）'));
    } else if (!clip.url) return Promise.reject(new Error('冇連結'));
    var err = Core.validateRange(clip.start_seconds, clip.end_seconds);
    if (err) return Promise.reject(new Error(err));
    if (!clip.id) clip.id = Core.uuid();
    var p = get('techniques', clip.technique_id).then(function (t) {
      // D38: same validator as import (source_type, link, range, 20.5 s)
      var why = Core.validateRecord('clips', Object.assign({}, clip, { updated_at: null }), { techniques: t ? (function () { var m = {}; m[t.id] = t; return m; })() : {} });
      if (why) { var x = new Error(why); x.user = true; throw x; }
    });
    if (blob) {
      clip.blob_id = clip.blob_id || Core.uuid();
      clip.size_bytes = blob.size;
      clip.mime = clip.mime || blob.type;
      p = p.then(function () { return blobToBuffer(blob); }).then(function (buf) {
        return tx(['blobs'], 'readwrite', function (t) { return req(t.objectStore('blobs').put({ id: clip.blob_id, mime: clip.mime, size: buf.byteLength, data: buf, owner_id: Core.OWNER_ID })); });
      });
    }
    return p.then(function () { return put('clips', clip); });
  }
  function getVideoBlob(blobId) {
    return get('blobs', blobId).then(function (r) { return r ? new Blob([r.data], { type: r.mime }) : null; });
  }
  function blobToBuffer(blob) {
    if (blob.arrayBuffer) return blob.arrayBuffer();
    return new Promise(function (res, rej) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.onerror = function () { rej(fr.error); }; fr.readAsArrayBuffer(blob); });
  }
  function bufToBase64(buf) {
    var bytes = new Uint8Array(buf), out = '', CH = 0x8000;
    for (var i = 0; i < bytes.length; i += CH) out += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    return btoa(out);
  }
  function base64ToBuf(b64) {
    var s = atob(b64), bytes = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
    return bytes.buffer;
  }

  /* Practice log → updates technique practice stats */
  function addLog(log) {
    if (!log.technique_id) return Promise.reject(new Error('冇 technique'));
    if (Core.SCENARIOS.indexOf(log.scenario) < 0) return Promise.reject(new Error('場景唔啱'));
    log.date = log.date || new Date().toISOString().slice(0, 10);
    return put('logs', log).then(function () { return get('techniques', log.technique_id); }).then(function (t) {
      if (!t) return log;
      t.practice_count = (t.practice_count || 0) + 1;
      if (log.result === 'success' && (log.scenario === 'live' || log.scenario === 'open mat')) t.sparring_success_count = (t.sparring_success_count || 0) + 1;
      if (!t.last_practiced || log.date > t.last_practiced) t.last_practiced = log.date;
      if (log.confidence) t.confidence = log.confidence;
      return put('techniques', t).then(function () { return log; });
    });
  }

  /* Export / import. Videos optional (base64 inside the same JSON). */
  var EXPORT_FORMAT = 'bjj-notes-export';
  function exportAll(opts) {
    opts = opts || {};
    var data = {};
    return Promise.all(DATA_STORES.map(function (s) { return all(s, { includeDeleted: true }).then(function (rows) { data[s] = rows; }); })).then(function () {
      var out = { format: EXPORT_FORMAT, schema_version: 1, app_version: opts.appVersion || null, exported_at: now(), owner_id: Core.OWNER_ID, includes_videos: !!opts.includeVideos, data: data, videos: [] };
      if (!opts.includeVideos) return out;
      var ids = {};
      data.clips.forEach(function (c) { if (c.blob_id && !c.deleted_at) ids[c.blob_id] = 1; });
      return Promise.all(Object.keys(ids).map(function (id) { return get('blobs', id); })).then(function (rows) {
        rows.forEach(function (b) { if (b) out.videos.push({ id: b.id, mime: b.mime, size: b.size, base64: bufToBase64(b.data) }); });
        return out;
      });
    });
  }
  /* decisions-v0 #21: file-level problems (broken JSON is caught by the caller, bad format/schema, wrong shapes) reject the whole file. */
  function validateExport(obj) {
    if (!obj || typeof obj !== 'object' || obj.format !== EXPORT_FORMAT) return '唔係 BJJ 筆記嘅匯出檔';
    if (typeof obj.schema_version !== 'number') return '匯出檔冇 schema_version';
    if (obj.schema_version > 1) return '呢個匯出檔係新版 app 做嘅（schema ' + obj.schema_version + '），請先更新 app';
    if (obj.schema_version !== 1) return 'schema_version ' + obj.schema_version + ' 唔支援';
    if (!obj.data || typeof obj.data !== 'object') return '匯出檔冇資料';
    for (var i = 0; i < DATA_STORES.length; i++) if (obj.data[DATA_STORES[i]] != null && !Array.isArray(obj.data[DATA_STORES[i]])) return '資料表 ' + DATA_STORES[i] + ' 格式唔啱';
    if (obj.videos != null && !Array.isArray(obj.videos)) return 'videos 格式唔啱';
    return null;
  }
  /* decisions-v0 #32: import alone never starts the export-reminder clock (txRaw = untracked). */
  /* D21 + D38: every record goes through Core.validateRecord (the same validator in-app saves use), against the
     merged view (local rows + already-accepted file rows), in dependency order. A record whose parent was skipped is
     skipped too. Merge: newer updated_at (parsed as time, BJJ-018) wins; equal/older keeps local. */
  var IMPORT_ORDER = ['users', 'shares', 'positions', 'techniques', 'roadmaps', 'nodes', 'edges', 'clips', 'logs'];
  function loadCtx() {
    var stores = ['positions', 'techniques', 'roadmaps', 'nodes', 'edges', 'clips', 'logs', 'users', 'shares'];
    return txRaw(stores, 'readonly', function (t) { return Promise.all(stores.map(function (s) { return req(t.objectStore(s).getAll()); })); }).then(function (r) {
      var ctx = {}; stores.forEach(function (s, i) { var m = {}; r[i].forEach(function (x) { m[x.id] = x; }); ctx[s] = m; });
      ctx.edges_list = r[stores.indexOf('edges')];
      return ctx;
    });
  }
  function vctx(ctx) { return { positions: ctx.positions, techniques: ctx.techniques, roadmaps: ctx.roadmaps, nodes: ctx.nodes, edges: ctx.edges_list }; }
  function emptyCtx() { var c = {}; ['positions', 'techniques', 'roadmaps', 'nodes', 'edges', 'clips', 'logs', 'users', 'shares'].forEach(function (s) { c[s] = {}; }); c.edges_list = []; return c; }
  function importAll(obj, opts) {
    opts = opts || {};
    var mode = opts.mode === 'replace' ? 'replace' : 'merge';
    var err = validateExport(obj);
    if (err) return Promise.reject(new Error(err));
    var counts = { rows: 0, videos: 0, skipped: 0, added: 0, updated: 0, bad: 0, problems: [] };
    var writes = [];
    return (mode === 'replace' ? Promise.resolve(emptyCtx()) : loadCtx()).then(function (ctx) {
      IMPORT_ORDER.forEach(function (s) {
        var seen = {};
        (obj.data[s] || []).forEach(function (row) {
          var why = row && typeof row.id === 'string' && seen[row.id] ? '重複 id' : Core.validateRecord(s, row, vctx(ctx));
          if (why) { counts.bad++; counts.problems.push({ store: s, id: row && row.id, reason: why }); return; }
          seen[row.id] = 1;
          var ex = ctx[s][row.id];
          if (ex && Core.compareTime(row.updated_at, ex.updated_at) <= 0) { counts.skipped++; return; }
          counts.rows++; if (ex) counts.updated++; else counts.added++;
          ctx[s][row.id] = row; writes.push([s, row]);
          if (s === 'edges') { ctx.edges_list = ctx.edges_list.filter(function (x) { return x.id !== row.id; }); ctx.edges_list.push(row); }
        });
      });
      var vids = [];
      (obj.videos || []).forEach(function (v) {
        if (!v || !v.id || typeof v.base64 !== 'string') { counts.bad++; counts.problems.push({ store: 'videos', id: v && v.id, reason: '片資料唔完整' }); return; }
        var buf; try { buf = base64ToBuf(v.base64); } catch (e) { counts.bad++; counts.problems.push({ store: 'videos', id: v.id, reason: 'base64 壞咗' }); return; }
        counts.videos++; vids.push({ id: v.id, mime: v.mime, size: buf.byteLength, data: buf, owner_id: Core.OWNER_ID });
      });
      return txRaw(STORES.filter(function (s) { return s !== 'meta'; }), 'readwrite', function (t) {
        var jobs = [];
        if (mode === 'replace') STORES.forEach(function (s) { if (s !== 'meta') jobs.push(req(t.objectStore(s).clear())); });
        return Promise.all(jobs).then(function () {
          return Promise.all(writes.map(function (w) { return req(t.objectStore(w[0]).put(w[1])); }).concat(vids.map(function (v) { return req(t.objectStore('blobs').put(v)); })));
        });
      });
    }).then(function () { return ensureOwner(); }).then(function () { return counts; });
  }
  function markExported() { return setMeta('last_export_at', now()); }
  function clearAll() {
    return tx(STORES, 'readwrite', function (t) { return Promise.all(STORES.map(function (s) { return req(t.objectStore(s).clear()); })); });
  }
  function missingVideos() {
    return Promise.all([all('clips'), tx(['blobs'], 'readonly', function (t) { return req(t.objectStore('blobs').getAllKeys()); })]).then(function (r) {
      var have = {}; r[1].forEach(function (k) { have[k] = 1; });
      return r[0].filter(function (c) { return c.source_type === 'upload' && !have[c.blob_id]; });
    });
  }

  return {
    restoreMany: restoreMany, isEmpty: isEmpty, seedIfEmpty: seedIfEmpty, restore: restore, markExported: markExported,
    open: open, get: get, all: all, put: put, getMeta: getMeta, setMeta: setMeta, ensureOwner: ensureOwner, loadSeed: loadSeed,
    saveTechnique: saveTechnique, techniqueImpact: techniqueImpact, softDeleteTechnique: softDeleteTechnique,
    nodeImpact: nodeImpact, softDeleteNode: softDeleteNode, softDelete: softDelete, addNode: addNode, addEdge: addEdge, moveNode: moveNode,
    addClip: addClip, updateClip: updateClip, updateEdge: updateEdge, renameNode: renameNode, loadCtx: loadCtx, getVideoBlob: getVideoBlob, addLog: addLog,
    exportAll: exportAll, importAll: importAll, validateExport: validateExport, clearAll: clearAll, missingVideos: missingVideos,
    _reset: function () { dbp = null; }, _useName: function (n) { dbName = n; dbp = null; }, STORES: STORES, DATA_STORES: DATA_STORES
  };
});

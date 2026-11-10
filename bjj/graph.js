/* BJJ 筆記 · Road Map canvas (SVG). Nodes = positions, edges = techniques.
   Touch: 1 finger drag background = pan, drag node = move (when editing), pinch = zoom, tap = select. Mouse wheel = zoom. */
(function (root) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var NODE_W = 140, NODE_H = 52;
  // Roy v2.4 §7 (D37): primary status cue is a 1-character mark; colour / dash are secondary
  var STATUS_MARK = { 'not-started': '未', learning: '學', drilling: '練', 'live-rolling': '戰', reliable: '穩' };
  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function textW(s, px) { var w = 0; s = String(s || ''); for (var i = 0; i < s.length; i++) w += s.charCodeAt(i) > 0x2e80 ? px : px * 0.58; return w; }
  /* Cheap label collision avoidance: push overlapping labels apart (and off nodes) along their edge normal. */
  function avoidCollisions(labels, nodes) {
    function hit(a, ax, ay, aw, ah, bx, by, bw, bh) { return Math.abs(ax - bx) * 2 < aw + bw && Math.abs(ay - by) * 2 < ah + bh; }
    for (var it = 0; it < 40; it++) {
      var moved = false;
      labels.forEach(function (L, i) {
        var push = 0;
        nodes.forEach(function (n) { if (hit(L, L.x, L.y, L.w + 6, L.h + 6, n.x, n.y, NODE_W, NODE_H)) push += ((L.x - n.x) * L.nx + (L.y - n.y) * L.ny) >= 0 ? 1 : -1; });
        labels.forEach(function (M, j) { if (i !== j && hit(L, L.x, L.y, L.w + 4, L.h + 4, M.x, M.y, M.w, M.h)) push += (i < j ? -1 : 1); });
        if (push) { var k = push > 0 ? 6 : -6; L.x += L.nx * k; L.y += L.ny * k; moved = true; }
      });
      if (!moved) break;
    }
  }
  function trunc(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

  function RoadMap(svg, opts) {
    this.svg = svg; this.opts = opts || {};
    this.view = { x: 0, y: 0, k: 1 };
    this.pointers = {}; this.drag = null;
    svg.innerHTML = '';
    var defs = el('defs', {}, svg);
    ['default', 'not-started', 'learning', 'drilling', 'live-rolling', 'reliable', 'selected'].forEach(function (s) {
      var m = el('marker', { id: 'arrow-' + s, viewBox: '0 0 10 10', refX: '9', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse' }, defs);
      el('path', { d: 'M0,0 L10,5 L0,10 z', 'class': 'arrow st-' + s }, m);
    });
    this.root = el('g', { 'class': 'viewport' }, svg);
    this.edgeLayer = el('g', { 'class': 'edges' }, this.root);
    this.labelLayer = el('g', { 'class': 'edge-labels' }, this.root);
    this.nodeLayer = el('g', { 'class': 'nodes' }, this.root);
    this._bind();
  }
  RoadMap.prototype.setData = function (d) { this.data = d; this.render(); };
  RoadMap.prototype.apply = function () {
    this.root.setAttribute('transform', 'translate(' + this.view.x + ',' + this.view.y + ') scale(' + this.view.k + ')');
    this._sizeHits();
    if (this.opts.onView) this.opts.onView(this.view);
  };
  /* BJJ-016: invisible hit areas keep every node / label tap target ≥ 44×44 CSS px at the current zoom */
  var MIN_TAP = 44;
  RoadMap.prototype._sizeHits = function () {
    var k = this.view.k || 1, min = MIN_TAP / k;
    var nodes = this.nodeLayer ? this.nodeLayer.querySelectorAll('.gnode-hit') : [];
    for (var i = 0; i < nodes.length; i++) { var w = Math.max(NODE_W, min), h = Math.max(NODE_H, min); nodes[i].setAttribute('x', -w / 2); nodes[i].setAttribute('y', -h / 2); nodes[i].setAttribute('width', w); nodes[i].setAttribute('height', h); }
    var labs = this.labelLayer ? this.labelLayer.querySelectorAll('.glabel-hit') : [];
    for (var j = 0; j < labs.length; j++) { var lw = Math.max(+labs[j].getAttribute('data-w'), min), lh = Math.max(+labs[j].getAttribute('data-h'), min); labs[j].setAttribute('x', -lw / 2); labs[j].setAttribute('y', -lh / 2); labs[j].setAttribute('width', lw); labs[j].setAttribute('height', lh); }
  };
  RoadMap.prototype.fit = function () {
    var ns = (this.data && this.data.nodes) || [];
    var r = this.svg.getBoundingClientRect(), w = r.width || 360, h = r.height || 500;
    if (!ns.length) { this.view = { x: w / 2, y: 60, k: 1 }; return this.apply(); }
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    ns.forEach(function (n) { minX = Math.min(minX, n.x - NODE_W / 2); maxX = Math.max(maxX, n.x + NODE_W / 2); minY = Math.min(minY, n.y - NODE_H / 2); maxY = Math.max(maxY, n.y + NODE_H / 2); });
    var E = this._labelExtents;
    if (E && isFinite(E.minX)) { minX = Math.min(minX, E.minX); maxX = Math.max(maxX, E.maxX); minY = Math.min(minY, E.minY); maxY = Math.max(maxY, E.maxY); }
    this._fitBox = { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
    var pad = 28, k = Math.min((w - pad * 2) / Math.max(maxX - minX, 1), (h - pad * 2) / Math.max(maxY - minY, 1), 1.2);
    k = Math.max(0.6, k);
    this.view = { k: k, x: (w - (maxX - minX) * k) / 2 - minX * k, y: Math.max(pad, (h - (maxY - minY) * k) / 2) - minY * k };
    this.apply();
  };
  RoadMap.prototype.zoomBy = function (f, cx, cy) {
    var r = this.svg.getBoundingClientRect();
    if (cx == null) { cx = r.width / 2; cy = r.height / 2; }
    var k = Math.max(0.2, Math.min(3, this.view.k * f)); f = k / this.view.k;
    this.view.x = cx - (cx - this.view.x) * f; this.view.y = cy - (cy - this.view.y) * f; this.view.k = k;
    this.apply();
  };
  RoadMap.prototype.center = function () {
    var r = this.svg.getBoundingClientRect();
    return { x: (r.width / 2 - this.view.x) / this.view.k, y: (r.height / 2 - this.view.y) / this.view.k };
  };
  RoadMap.prototype.focusNode = function (id) {
    var n = (this.data.nodes || []).filter(function (x) { return x.id === id; })[0]; if (!n) return;
    var r = this.svg.getBoundingClientRect(); var k = Math.max(this.view.k, 0.9);
    this.view = { k: k, x: r.width / 2 - n.x * k, y: r.height / 3 - n.y * k }; this.apply();
  };
  RoadMap.prototype.render = function () {
    var self = this, d = this.data, byId = {};
    this.edgeLayer.innerHTML = ''; this.labelLayer.innerHTML = ''; this.nodeLayer.innerHTML = '';
    d.nodes.forEach(function (n) { byId[n.id] = n; });
    // One visual edge per from→to pair; extra techniques on the same pair collapse into a +N badge (Roy v2).
    var groups = {}, order = [];
    d.edges.forEach(function (e) { var k = e.from_node_id + '>' + e.to_node_id; if (!groups[k]) { groups[k] = []; order.push(k); } groups[k].push(e); });
    var labels = [];
    order.forEach(function (key) {
      var list = groups[key], e = list[0], a = byId[e.from_node_id], b = byId[e.to_node_id]; if (!a || !b) return;
      var rev = groups[e.to_node_id + '>' + e.from_node_id];
      var info = d.edgeInfo(e), st = info.statusClass;
      var sel = list.some(function (x) { return x.id === d.selectedEdge; }) || (d.selectedNode && (e.from_node_id === d.selectedNode || e.to_node_id === d.selectedNode));
      var dx = b.x - a.x, dy = b.y - a.y, len = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / len, ny = dx / len;
      var bend = rev ? 40 : 0; // B→A also exists: bow both apart
      var cx = (a.x + b.x) / 2 + nx * bend, cy = (a.y + b.y) / 2 + ny * bend;
      function border(p, q) {
        var vx = q.x - p.x, vy = q.y - p.y, tx = Math.abs(vx) > 0 ? (NODE_W / 2 + 4) / Math.abs(vx) : Infinity, ty = Math.abs(vy) > 0 ? (NODE_H / 2 + 6) / Math.abs(vy) : Infinity, t = Math.min(tx, ty, 0.45);
        return { x: p.x + vx * t, y: p.y + vy * t };
      }
      var p1 = border(a, { x: cx, y: cy }), p2 = border(b, { x: cx, y: cy });
      var ids = list.map(function (x) { return x.id; }).join(' ');
      // D37 (structural part of BJJ-001): status is carried as text (aria-label + <title>) and data-status, not only colour/dash
      var infos = list.map(function (x) { return d.edgeInfo(x); });
      var spoken = infos.map(function (i) { return i.title + '：' + i.statusZh + (i.restricted ? '（受限）' : ''); }).join('；');
      var anyRisk = infos.some(function (i) { return i.restricted; });
      var g = el('g', { 'class': 'gedge st-' + st + (sel ? ' is-selected' : '') + (anyRisk ? ' is-restricted' : ''), 'data-edge-id': e.id, 'data-edge-ids': ids, 'data-status': info.statusKey || st, 'data-count': list.length, tabindex: '0', role: 'button', 'aria-label': (list.length > 1 ? list.length + ' 招 · ' : '') + spoken }, self.edgeLayer);
      el('title', {}, g).textContent = spoken;
      var path = 'M' + p1.x + ',' + p1.y + ' Q' + cx + ',' + cy + ' ' + p2.x + ',' + p2.y;
      el('path', { d: path, 'class': 'edge-hit' }, g);
      el('path', { d: path, 'class': 'edge-line', 'marker-end': 'url(#arrow-' + (sel ? 'selected' : st) + ')' }, g);
      // label anchor = curve midpoint
      var mx = 0.25 * p1.x + 0.5 * cx + 0.25 * p2.x, my = 0.25 * p1.y + 0.5 * cy + 0.25 * p2.y;
      // Roy v2.4 §7 / BJJ-014: +N = techniques on this pair besides the one on the label (N = total − 1; none when 1)
      // D34 / BJJ-015: 受限 badge. D37 / BJJ-001: 1-character status mark (.st-mark) of the technique shown on the label
      var t1 = trunc(info.short || info.title, 10), t2 = '', more = list.length - 1, risk = !!info.restricted;
      var w = 8 + 15 + 5 + (risk ? 34 : 0) + textW(t1, 11) + (more ? 32 : 0) + 8;
      labels.push({ x: mx, y: my, ax: mx, ay: my, w: w, h: 24, nx: nx, ny: ny, t1: t1, t2: t2, more: more, risk: risk, st: st, statusKey: info.statusKey || st, statusZh: info.statusZh, sel: sel, id: e.id, ids: ids, spoken: spoken });
    });
    avoidCollisions(labels, d.nodes);
    // Roy v2.2: remember label extents so fit() frames nodes AND edge labels
    this._labelExtents = labels.reduce(function (acc, L) {
      return { minX: Math.min(acc.minX, L.x - L.w / 2), maxX: Math.max(acc.maxX, L.x + L.w / 2), minY: Math.min(acc.minY, L.y - L.h / 2), maxY: Math.max(acc.maxY, L.y + L.h / 2) };
    }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
    labels.forEach(function (L) {
      if (Math.abs(L.x - L.ax) + Math.abs(L.y - L.ay) > 8) el('line', { x1: L.ax, y1: L.ay, x2: L.x, y2: L.y, 'class': 'glabel-leader' }, self.labelLayer);
      var lg = el('g', { 'class': 'glabel st-' + L.st + (L.sel ? ' is-selected' : '') + (L.risk ? ' is-restricted' : ''), 'data-edge-id': L.id, 'data-edge-ids': L.ids, 'data-status': L.statusKey, transform: 'translate(' + L.x + ',' + L.y + ')' }, self.labelLayer);
      el('title', {}, lg).textContent = L.spoken;
      el('rect', { 'class': 'glabel-hit', 'data-w': L.w, 'data-h': L.h, x: -L.w / 2, y: -L.h / 2, width: L.w, height: L.h, fill: 'transparent' }, lg);
      el('rect', { x: -L.w / 2, y: -L.h / 2, width: L.w, height: L.h, rx: 8, 'class': 'glabel-bg' }, lg);
      var left = -L.w / 2 + 8;
      var mk = el('g', { 'class': 'st-mark st-' + L.statusKey, transform: 'translate(' + left + ',-7.5)', 'aria-hidden': 'true' }, lg);
      el('rect', { x: 0.5, y: 0.5, width: 14, height: 14, rx: 3, 'class': 'st-mark-box' }, mk);
      el('text', { x: 7.5, y: 11, 'text-anchor': 'middle', 'class': 'st-mark-t' }, mk).textContent = STATUS_MARK[L.statusKey] || '?';
      left += 20;
      if (L.risk) {
        el('rect', { x: left, y: -8, width: 30, height: 16, rx: 4, 'class': 'glabel-risk' }, lg);
        el('text', { x: left + 15, y: 4, 'text-anchor': 'middle', 'class': 'glabel-risk-t' }, lg).textContent = '受限';
      }
      var tx = (left + (L.risk ? 34 : 0) + (L.w / 2 - 8 - (L.more ? 32 : 0))) / 2;
      el('text', { x: tx, y: 4, 'class': 'glabel-title', 'text-anchor': 'middle' }, lg).textContent = L.t1;
      if (L.more) {
        var bx = L.w / 2 - 16;
        el('rect', { x: bx - 12, y: -8, width: 26, height: 16, rx: 8, 'class': 'glabel-badge' }, lg);
        el('text', { x: bx + 1, y: 4, 'text-anchor': 'middle', 'class': 'glabel-badge-t' }, lg).textContent = '+' + L.more;
      }
    });
    d.nodes.forEach(function (n) {
      var lab = d.nodeLabel(n), sel = d.selectedNode === n.id;
      var g = el('g', { 'class': 'gnode' + (sel ? ' is-selected' : '') + (n.link_roadmap_id ? ' is-link' : '') + (n.terminal ? ' is-finish' : '') + (d.connectFrom === n.id ? ' is-source' : ''), 'data-node-id': n.id, transform: 'translate(' + n.x + ',' + n.y + ')', tabindex: '0', role: 'button', 'aria-label': lab.zh + ' ' + lab.en }, self.nodeLayer);
      el('rect', { 'class': 'gnode-hit', x: -NODE_W / 2, y: -NODE_H / 2, width: NODE_W, height: NODE_H, fill: 'transparent' }, g);
      el('rect', { x: -NODE_W / 2, y: -NODE_H / 2, width: NODE_W, height: NODE_H, rx: 12, 'class': 'gnode-bg' }, g);
      el('text', { y: -4, 'text-anchor': 'middle', 'class': 'gnode-zh' }, g).textContent = trunc(lab.zh, 12);
      el('text', { y: 14, 'text-anchor': 'middle', 'class': 'gnode-en' }, g).textContent = trunc((lab.role ? lab.role + ' · ' : '') + lab.en, 26) + (n.link_roadmap_id ? ' ↗' : '');
    });
    this._sizeHits();
  };
  RoadMap.prototype._pt = function (ev) { var r = this.svg.getBoundingClientRect(); return { x: ev.clientX - r.left, y: ev.clientY - r.top }; };
  RoadMap.prototype._bind = function () {
    var self = this, svg = this.svg;
    svg.addEventListener('pointerdown', function (ev) {
      if (ev.button > 0) return;
      try { svg.setPointerCapture(ev.pointerId); } catch (e) {}
      var p = self._pt(ev); self.pointers[ev.pointerId] = p;
      var ids = Object.keys(self.pointers);
      if (ids.length === 2) {
        var a = self.pointers[ids[0]], b = self.pointers[ids[1]];
        self.drag = { type: 'pinch', dist: Math.hypot(a.x - b.x, a.y - b.y), k: self.view.k, vx: self.view.x, vy: self.view.y, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
        return;
      }
      var nodeEl = ev.target.closest && ev.target.closest('[data-node-id]');
      var edgeEl = ev.target.closest && ev.target.closest('[data-edge-id]');
      var edgeIds = edgeEl && (edgeEl.getAttribute('data-edge-ids') || '').split(' ').filter(Boolean);
      var node = nodeEl && self.data.nodes.filter(function (n) { return n.id === nodeEl.getAttribute('data-node-id'); })[0];
      self.drag = { type: node && self.opts.canMove && self.opts.canMove() ? 'node' : 'pan', node: node, edgeId: edgeEl && edgeEl.getAttribute('data-edge-id'), edgeIds: edgeIds, nodeId: node && node.id, sx: p.x, sy: p.y, vx: self.view.x, vy: self.view.y, nx: node && node.x, ny: node && node.y, moved: false, el: nodeEl };
    });
    svg.addEventListener('pointermove', function (ev) {
      if (!self.pointers[ev.pointerId] || !self.drag) return;
      var p = self._pt(ev); self.pointers[ev.pointerId] = p;
      var d = self.drag;
      if (d.type === 'pinch') {
        var ids = Object.keys(self.pointers); if (ids.length < 2) return;
        var a = self.pointers[ids[0]], b = self.pointers[ids[1]];
        var k = Math.max(0.2, Math.min(3, d.k * Math.hypot(a.x - b.x, a.y - b.y) / (d.dist || 1)));
        var cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
        self.view.k = k; self.view.x = cx - (d.cx - d.vx) * k / d.k; self.view.y = cy - (d.cy - d.vy) * k / d.k;
        self.apply(); return;
      }
      var dx = p.x - d.sx, dy = p.y - d.sy;
      if (!d.moved && Math.abs(dx) + Math.abs(dy) < 6) return;
      d.moved = true;
      if (d.type === 'node') {
        d.node.x = d.nx + dx / self.view.k; d.node.y = d.ny + dy / self.view.k;
        self.render();
      } else { self.view.x = d.vx + dx; self.view.y = d.vy + dy; self.apply(); }
    });
    function end(ev) {
      delete self.pointers[ev.pointerId];
      var d = self.drag; if (!d) return;
      if (d.type === 'pinch') { if (!Object.keys(self.pointers).length) self.drag = null; else self.drag = { type: 'pan', sx: 0, sy: 0, vx: self.view.x, vy: self.view.y, moved: true, done: true }; return; }
      self.drag = null;
      if (d.done) return;
      if (!d.moved && ev.type === 'pointerup') {
        if (d.nodeId && self.opts.onNodeTap) self.opts.onNodeTap(d.nodeId);
        else if (d.edgeId && self.opts.onEdgeTap) self.opts.onEdgeTap(d.edgeId, d.edgeIds);
        else if (self.opts.onBackgroundTap) self.opts.onBackgroundTap();
      } else if (d.moved && d.type === 'node' && self.opts.onNodeMove) self.opts.onNodeMove(d.node.id, d.node.x, d.node.y);
    }
    svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
    svg.addEventListener('wheel', function (ev) { ev.preventDefault(); var p = self._pt(ev); self.zoomBy(Math.exp(-ev.deltaY * (ev.ctrlKey ? 0.01 : 0.0015)), p.x, p.y); }, { passive: false });
    svg.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      var n = ev.target.closest && ev.target.closest('[data-node-id]'), e = ev.target.closest && ev.target.closest('[data-edge-id]');
      if (n && self.opts.onNodeTap) { ev.preventDefault(); self.opts.onNodeTap(n.getAttribute('data-node-id')); }
      else if (e && self.opts.onEdgeTap) { ev.preventDefault(); self.opts.onEdgeTap(e.getAttribute('data-edge-id'), (e.getAttribute('data-edge-ids') || '').split(' ').filter(Boolean)); }
    });
  };
  root.BJJGraph = { STATUS_MARK: STATUS_MARK, RoadMap: RoadMap, avoidCollisions: avoidCollisions, NODE_W: NODE_W, NODE_H: NODE_H };
})(typeof self !== 'undefined' ? self : this);

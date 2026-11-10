/* BJJ 筆記 · in-browser video probe + 480p re-encode (canvas + MediaRecorder, real-time).
   Also trims: records only [start, start+20s]. Falls back gracefully when the browser lacks the APIs. */
(function (root) {
  'use strict';
  var Core = root.BJJCore;

  function probe(file) {
    return new Promise(function (res, rej) {
      var v = document.createElement('video'), url = URL.createObjectURL(file), done = false;
      v.preload = 'metadata'; v.muted = true; v.playsInline = true;
      var timer = setTimeout(function () { finish(new Error('讀片資料超時（10 秒），格式可能唔支援')); }, 10000);
      function finish(err, info) { if (done) return; done = true; clearTimeout(timer); URL.revokeObjectURL(url); v.removeAttribute('src'); v.load(); err ? rej(err) : res(info); }
      v.onloadedmetadata = function () {
        if (isFinite(v.duration) && v.duration > 0) return finish(null, { duration: v.duration, width: v.videoWidth, height: v.videoHeight });
        // MediaRecorder WebM files report Infinity until seeked to the end
        v.ontimeupdate = function () { v.ontimeupdate = null; finish(null, { duration: v.duration, width: v.videoWidth, height: v.videoHeight }); v.currentTime = 0; };
        try { v.currentTime = 1e9; } catch (e) { finish(new Error('讀唔到片長')); }
      };
      v.onerror = function () { finish(new Error('呢部機播唔到呢個格式（例如 Chrome 未必播到 HEVC .mov）')); };
      v.src = url;
    });
  }
  function pickMime() {
    if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return null;
    var c = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    for (var i = 0; i < c.length; i++) if (MediaRecorder.isTypeSupported(c[i])) return c[i];
    return null;
  }
  function canReencode() {
    try { return !!(pickMime() && document.createElement('canvas').captureStream); } catch (e) { return false; }
  }
  /* opts: {start, maxSeconds, audio, onProgress(fraction), signal:{cancelled}} → Promise<{blob, mime, width, height, duration}> */
  function reencode(file, opts) {
    opts = opts || {};
    var max = opts.maxSeconds || Core.LIMITS.maxClipSeconds, start = Math.max(0, opts.start || 0);
    var mime = pickMime();
    if (!mime) return Promise.reject(new Error('呢個瀏覽器唔支援 MediaRecorder'));
    var actx = null;
    if (opts.audio !== false) { try { var AC = root.AudioContext || root.webkitAudioContext; actx = AC ? new AC() : null; } catch (e) { actx = null; } }
    return new Promise(function (res, rej) {
      var v = document.createElement('video'), url = URL.createObjectURL(file);
      v.playsInline = true; v.preload = 'auto'; v.muted = !actx; v.setAttribute('playsinline', '');
      v.style.cssText = 'position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0';
      document.body.appendChild(v);
      var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d'), rec, chunks = [], stopAt, rafId, vfc, size, failed = false, t0;
      function cleanup() {
        try { if (rafId) cancelAnimationFrame(rafId); if (vfc && v.cancelVideoFrameCallback) v.cancelVideoFrameCallback(vfc); } catch (e) {}
        try { v.pause(); } catch (e) {}
        URL.revokeObjectURL(url); v.remove();
        if (actx) try { actx.close(); } catch (e) {}
      }
      function fail(e) { if (failed) return; failed = true; try { if (rec && rec.state !== 'inactive') rec.stop(); } catch (x) {} cleanup(); rej(e); }
      v.onerror = function () { fail(new Error('呢部機播唔到呢個格式，壓縮唔到')); };
      v.onloadedmetadata = function () {
        size = Core.targetSize(v.videoWidth, v.videoHeight);
        canvas.width = size.width; canvas.height = size.height;
        var dur = isFinite(v.duration) ? v.duration : max;
        stopAt = Math.min(dur, start + max);
        v.onseeked = function () { v.onseeked = null; begin(); };
        v.currentTime = start;
        if (start === 0 && v.readyState >= 1) { /* some browsers skip seeked at 0 */ setTimeout(function () { if (v.onseeked) { v.onseeked = null; begin(); } }, 400); }
      };
      function begin() {
        var stream = canvas.captureStream(30);
        if (actx) {
          try {
            var src = actx.createMediaElementSource(v), dest = actx.createMediaStreamDestination();
            src.connect(dest); // not connected to speakers → silent processing
            dest.stream.getAudioTracks().forEach(function (tr) { stream.addTrack(tr); });
            if (actx.state === 'suspended') actx.resume();
          } catch (e) { v.muted = true; }
        }
        try { rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: Core.LIMITS.videoBitsPerSecond, audioBitsPerSecond: Core.LIMITS.audioBitsPerSecond }); }
        catch (e) { try { rec = new MediaRecorder(stream); } catch (e2) { return fail(new Error('MediaRecorder 開唔到')); } }
        rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
        rec.onerror = function (e) { fail(e.error || new Error('錄製失敗')); };
        rec.onstop = function () {
          if (failed) return;
          var type = (rec.mimeType || mime).split(';')[0];
          var blob = new Blob(chunks, { type: type });
          var duration = Math.min(max, Math.max(0, v.currentTime - start));
          cleanup();
          if (!blob.size) return rej(new Error('壓縮出嚟嘅片係空嘅'));
          res({ blob: blob, mime: type, width: size.width, height: size.height, duration: duration });
        };
        ctx.drawImage(v, 0, 0, size.width, size.height);
        rec.start(1000); t0 = Date.now();
        var pr = v.play();
        if (pr && pr.catch) pr.catch(function (e) { fail(new Error('播唔到片嚟壓縮：' + (e && e.message || e))); });
        loop();
      }
      function draw() {
        if (failed) return false;
        ctx.drawImage(v, 0, 0, size.width, size.height);
        var f = (v.currentTime - start) / Math.max(0.1, stopAt - start);
        if (opts.onProgress) opts.onProgress(Math.max(0, Math.min(1, f)));
        if (opts.signal && opts.signal.cancelled) { fail(new Error('已取消')); return false; }
        if (v.currentTime >= stopAt - 0.03 || v.ended || Date.now() - t0 > (max + 15) * 1000) {
          v.pause(); if (rec.state !== 'inactive') rec.stop(); return false;
        }
        return true;
      }
      function loop() {
        if (v.requestVideoFrameCallback) {
          var tick = function () { if (draw()) vfc = v.requestVideoFrameCallback(tick); };
          vfc = v.requestVideoFrameCallback(tick);
          // safety: ended/stall checks even if no new frames arrive
          var guard = function () { if (failed || rec.state === 'inactive') return; if (v.ended || v.currentTime >= stopAt - 0.03 || Date.now() - t0 > (max + 15) * 1000) draw(); else setTimeout(guard, 250); };
          setTimeout(guard, 250);
        } else {
          var step = function () { if (draw()) rafId = requestAnimationFrame(step); };
          rafId = requestAnimationFrame(step);
        }
      }
      v.src = url;
    });
  }
  root.BJJVideo = { probe: probe, pickMime: pickMime, canReencode: canReencode, reencode: reencode };
})(typeof self !== 'undefined' ? self : this);

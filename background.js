// Backgrounds use the browser's local clock. Model animation is independent.
(function () {
  'use strict';
  var KEY = 'nekoWebShowWallpaper';
  var FADE_MS = 1800;
  var selected = null, timer = null, generation = 0, requestedUrl = '';
  var layers = [], active = 0, displayed = null, transitioning = false, queued = null;

  function entries() { return Array.isArray(window.NekoWallpapers) ? window.NekoWallpapers : []; }
  function find(id) { return entries().find(function (entry) { return entry.id === id; }); }
  function phaseAt(date) {
    var hour = date.getHours();
    return hour >= 6 && hour < 16 ? 'A' : hour >= 16 && hour < 18 ? 'B' : 'C';
  }
  function nextBoundary(date) {
    var next = new Date(date.getTime()), hour = date.getHours();
    if (hour >= 18) next.setDate(next.getDate() + 1);
    next.setHours(hour < 6 || hour >= 18 ? 6 : hour < 16 ? 16 : 18, 0, 0, 0);
    return next;
  }
  function current() {
    if (find(selected)) return selected;
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (error) {}
    selected = find(saved) ? saved : find(window.NekoDefaultWallpaper) ? window.NekoDefaultWallpaper : entries()[0]?.id;
    return selected;
  }
  function imageFor(entry, date) { return entry.type === 'dynamic' ? entry.images[phaseAt(date)] : entry.image; }
  function urlFor(image) { return './background/' + image.split('/').map(encodeURIComponent).join('/'); }
  function mark(spec) {
    displayed = spec;
    document.body.dataset.background = spec.id;
    document.body.dataset.backgroundPhase = spec.phase;
    document.body.dataset.backgroundImage = spec.image;
    document.body.dataset.backgroundState = 'ready';
  }
  function paint(spec) {
    if (transitioning) { queued = spec; return; }
    if (!displayed) {
      layers[active].style.backgroundImage = 'url(' + JSON.stringify(spec.url) + ')';
      layers[active].style.transition = 'none';
      layers[active].style.opacity = '1';
      mark(spec);
      return;
    }
    if (displayed.url === spec.url) { mark(spec); return; }
    var previous = layers[active], nextIndex = 1 - active, next = layers[nextIndex];
    previous.style.zIndex = '0';
    next.style.zIndex = '1';
    next.style.transition = 'none';
    next.style.opacity = '0';
    next.style.backgroundImage = 'url(' + JSON.stringify(spec.url) + ')';
    void next.offsetWidth;
    transitioning = true;
    document.body.dataset.backgroundState = 'transitioning';
    var finished = false, fallback;
    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(fallback);
      next.removeEventListener('transitionend', onEnd);
      previous.style.opacity = '0';
      active = nextIndex;
      transitioning = false;
      mark(spec);
      var pending = queued;
      queued = null;
      if (pending && pending.generation === generation) paint(pending);
    }
    function onEnd(event) { if (event.target === next && event.propertyName === 'opacity') finish(); }
    next.addEventListener('transitionend', onEnd);
    next.style.transition = 'opacity ' + FADE_MS + 'ms ease';
    next.style.opacity = '1';
    // The previous image stays opaque beneath the incoming one throughout the fade.
    fallback = setTimeout(finish, FADE_MS + 100);
  }
  function refresh() {
    clearTimeout(timer);
    var entry = find(current());
    if (!entry || !layers.length) return;
    var now = new Date(), image = imageFor(entry, now), url = urlFor(image);
    if (url !== requestedUrl) {
      requestedUrl = url;
      var spec = { id: entry.id, image: image, url: url, phase: entry.type === 'dynamic' ? phaseAt(now) : '', generation: ++generation };
      var preload = new Image();
      preload.onload = function () { if (spec.generation === generation) paint(spec); };
      preload.onerror = function () {
        if (spec.generation !== generation) return;
        requestedUrl = '';
        document.body.dataset.backgroundState = 'error';
        console.error('Background could not be loaded:', image);
      };
      preload.src = url;
    }
    if (entry.type === 'dynamic') {
      // Also catches clock/time-zone changes; focus/visibility handles sleeping tabs.
      timer = setTimeout(refresh, Math.max(25, Math.min(30000, nextBoundary(now).getTime() - now.getTime() + 25)));
    }
  }
  function select(id) {
    if (!find(id)) return;
    selected = id;
    try { localStorage.setItem(KEY, id); } catch (error) {}
    refresh();
  }
  function init() {
    if (layers.length) return;
    var container = document.createElement('div');
    container.id = 'background-layers';
    container.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 2; i++) {
      var layer = document.createElement('div');
      layer.className = 'background-layer';
      container.appendChild(layer);
      layers.push(layer);
    }
    document.body.prepend(container);
    refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) refresh(); });
  }
  window.NekoBackground = { init: init, list: entries, current: current, select: select, refresh: refresh, phaseAt: phaseAt, nextBoundary: nextBoundary, imageFor: imageFor };
})();

/* ============================================================
   NekoWebShow 控制 UI 交互（PHP 版与静态版共用）
   - 侧边栏展开/收起、抽屉手风琴（点开/再点收起，点其它自动收起上一个）
   - 切换图标 / 侧边栏可拖动（限制在视口内，不越界）
   - “设置”抽屉：帧率限制（默认 60，可选无上限），localStorage 持久化
   ============================================================ */
(function () {
  'use strict';

  // ---------- 帧率限制 ----------
  var FPS_KEY = 'nekoWebShowFpsLimit';
  var FPS_DEFAULT = 60;            // 0 表示无上限
  var ICON_POS_KEY = 'nekoWebShowIconPos';
  var TOPBAR_POS_KEY = 'nekoWebShowTopbarPos';

  function readFps() {
    var raw = null;
    try { raw = localStorage.getItem(FPS_KEY); } catch (e) {}
    if (raw === null || raw === '') return FPS_DEFAULT;
    var n = parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 0) return FPS_DEFAULT;
    return n;
  }
  function writeFps(v) {
    try { localStorage.setItem(FPS_KEY, String(v)); } catch (e) {}
  }
  function applyFps() {
    // 注意：emoteplayer.js 里 EmotePlayer 是顶层 class 声明，不会挂在 window 上。
    if (typeof EmotePlayer !== 'undefined') {
      EmotePlayer.fpsLimit = readFps();
    }
  }

  // ---------- 抽屉手风琴 ----------
  function setDrawerOpen(item, open) {
    item.classList.toggle('open', open);
    var body = item.querySelector('.dropdown');
    if (body) {
      body.style.maxHeight = open ? (body.scrollHeight + 'px') : '0px';
    }
  }

  function toggleDrawer(item) {
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('#topbar .menu-item.open').forEach(function (o) {
      if (o !== item) setDrawerOpen(o, false);
    });
    setDrawerOpen(item, !isOpen);
  }

  window.NekoUI = {
    readFps: readFps,
    setFps: function (v) { writeFps(v); applyFps(); },
    applyFps: applyFps,
    toggleDrawer: toggleDrawer
  };

  // ---------- 拖动辅助 ----------
  function enableDrag(target, key, handle, opts) {
    opts = opts || {};
    var dragging = false, moved = false;
    var startX = 0, startY = 0, origX = 0, origY = 0;

    handle.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      if (e.target && e.target.closest && e.target.closest('a,button,.dropdown,.menu-item,.opt')) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      var r = target.getBoundingClientRect();
      origX = r.left;
      origY = r.top;
      if (opts.onStart) opts.onStart(target);
      target.classList.add('dragging');
      try { handle.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });

    handle.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      if (!moved) return;
      var vw = window.innerWidth || document.documentElement.clientWidth;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var w = target.offsetWidth;
      var h = target.offsetHeight;
      var nx = Math.max(0, Math.min(vw - w, origX + dx));
      var ny = Math.max(0, Math.min(vh - h, origY + dy));
      target.style.left = nx + 'px';
      target.style.top = ny + 'px';
      target.style.right = 'auto';
    });

    function end() {
      if (!dragging) return;
      dragging = false;
      target.classList.remove('dragging');
      if (moved && key) {
        var r = target.getBoundingClientRect();
        try { localStorage.setItem(key, JSON.stringify({ x: r.left, y: r.top })); } catch (e) {}
      }
    }
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);

    return { wasMoved: function () { return moved; } };
  }

  function restorePos(el, key, onRestored) {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(key)); } catch (e) {}
    if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
      el.style.left = saved.x + 'px';
      el.style.top = saved.y + 'px';
      el.style.right = 'auto';
      if (onRestored) onRestored(el);
    }
  }

  // ---------- 抽屉委托处理 ----------
  function initDrawers(topbar) {
    if (!topbar) return;
    topbar.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('.dropdown')) return;            // 点抽屉内容(链接/选项)不切换
      var item = t.closest('.menu-item');
      if (!item) return;
      if (item.classList.contains('language-selector')) return; // 语言选择器自行处理
      if (item.classList.contains('settings-item')) return;     // 设置项自行处理
      toggleDrawer(item);
    });
  }

  // ---------- 切换图标（点击切换 + 拖动） ----------
  function initToggleIcon(icon, topbar) {
    if (!icon || !topbar) return;

    restorePos(icon, ICON_POS_KEY);
    if (icon.style.left === '') {
      var r = icon.getBoundingClientRect();
      icon.style.left = r.left + 'px';
      icon.style.top = r.top + 'px';
      icon.style.right = 'auto';
    }

    var drag = enableDrag(icon, ICON_POS_KEY, icon);
    icon.addEventListener('click', function () {
      if (drag.wasMoved()) return;
      topbar.classList.toggle('open');
    });
  }

  // ---------- 侧边栏拖动（用标题栏作把手，不显示额外图标） ----------
  function initTopbarDrag(topbar) {
    if (!topbar) return;
    var handle = topbar.querySelector(':scope > .label') || topbar.querySelector('.label');
    if (!handle) return;
    handle.title = '拖动侧边栏';

    restorePos(topbar, TOPBAR_POS_KEY, function (el) {
      el.classList.add('free');
      el.style.transform = 'translateX(0)';
    });

    enableDrag(topbar, TOPBAR_POS_KEY, handle, {
      onStart: function (el) {
        var r = el.getBoundingClientRect();
        el.style.left = r.left + 'px';
        el.style.top = r.top + 'px';
        el.style.transform = 'translateX(0)';
      }
    });
  }

  // ---------- 设置抽屉（帧率限制） ----------
  function initSettings(topbar) {
    if (!topbar) return;

    var fpsOptions = [
      { value: 0,    label: '无上限',  badge: '∞',         i18nLabel: 'fpsUnlimited' },
      { value: 30,   label: '30 FPS', badge: '' },
      { value: 60,   label: '60 FPS', badge: '推荐',        i18nBadge: 'fpsRecommended' },
      { value: 120,  label: '120 FPS', badge: '' }
    ];

    var item = document.createElement('div');
    item.className = 'menu-item settings-item';

    var label = document.createElement('span');
    label.className = 'label';
    label.setAttribute('data-i18n', 'settings');
    label.textContent = '设置';
    item.appendChild(label);

    var dd = document.createElement('div');
    dd.className = 'dropdown settings-dropdown';

    var title = document.createElement('div');
    title.className = 'opt';
    title.style.cursor = 'default';
    title.style.fontWeight = 'bold';
    title.setAttribute('data-i18n', 'fpsLimit');
    title.textContent = '帧率限制';
    dd.appendChild(title);

    var current = readFps();

    fpsOptions.forEach(function (o) {
      var row = document.createElement('div');
      row.className = 'opt' + (o.value === current ? ' selected' : '');
      row.dataset.fps = o.value;

      var dot = document.createElement('span');
      dot.className = 'dot';
      row.appendChild(dot);

      var text = document.createElement('span');
      if (o.i18nLabel) text.setAttribute('data-i18n', o.i18nLabel);
      text.textContent = o.label;
      row.appendChild(text);

      if (o.badge) {
        var badge = document.createElement('span');
        badge.className = 'fps-badge';
        if (o.i18nBadge) badge.setAttribute('data-i18n', o.i18nBadge);
        badge.textContent = o.badge;
        row.appendChild(badge);
      }

      row.addEventListener('click', function (e) {
        e.stopPropagation();
        NekoUI.setFps(o.value);
        dd.querySelectorAll('.opt').forEach(function (r) {
          r.classList.toggle('selected', parseInt(r.dataset.fps, 10) === o.value);
        });
      });

      dd.appendChild(row);
    });

    item.appendChild(dd);

    var infotext = topbar.querySelector('.infotext');
    if (infotext) topbar.insertBefore(item, infotext);
    else topbar.appendChild(item);

    item.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.opt')) return; // 选项点击不切换抽屉
      e.stopPropagation();
      toggleDrawer(item);
    });
  }

  // ---------- 初始化 ----------
  function init() {
    applyFps();
    var topbar = document.getElementById('topbar');
    var icon = document.getElementById('toggle-icon');
    initSettings(topbar);
    initTopbarDrag(topbar);
    initDrawers(topbar);
    initToggleIcon(icon, topbar);

    // 窗口尺寸变化时，重新校准已展开抽屉的高度
    window.addEventListener('resize', function () {
      document.querySelectorAll('#topbar .menu-item.open > .dropdown').forEach(function (dd) {
        dd.style.maxHeight = dd.scrollHeight + 'px';
      });
    });

    // 静态版有 i18n：注入设置项后补一次翻译
    if (window.languageManager && typeof window.languageManager.applyTranslations === 'function') {
      try { window.languageManager.applyTranslations(); } catch (e) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
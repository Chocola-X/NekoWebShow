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

  // ---------- 角色锁定 / 静音 / 壁纸状态 ----------
  var LOCK_KEY = 'nekoWebShowLock';
  var MUTE_KEY = 'nekoWebShowMute';
  var WP_KEY = 'nekoWebShowWallpaper';

  function readBool(key, def) {
    var raw = null;
    try { raw = localStorage.getItem(key); } catch (e) {}
    if (raw === null) return def;
    return raw === '1';
  }
  function writeBool(key, v) {
    try { localStorage.setItem(key, v ? '1' : '0'); } catch (e) {}
  }

  function isLocked() { return readBool(LOCK_KEY, false); }
  function isMuted() { return readBool(MUTE_KEY, false); }

  // 静态版壁纸清单回退：PHP 版会由 index.php 扫描 img/ 动态注入 window.NekoWallpapers（覆盖此值）；
  // 静态版没有 PHP 扫描，走这里的手工清单。往 img/ 加新图后，请同时在此数组里补文件名。
  var STATIC_WALLPAPERS = ['bakery.png', 'bathroom.png', 'fancy_pink_bedroom.png', 'japanese_corridor.png', 'japanese_room.png', 'pink_bathroom.png', 'street.png'];

  function wallpaperList() {
    return (window.NekoWallpapers && Array.isArray(window.NekoWallpapers)) ? window.NekoWallpapers : STATIC_WALLPAPERS;
  }
  function currentWallpaper() {
    var list = wallpaperList();
    var raw = null;
    try { raw = localStorage.getItem(WP_KEY); } catch (e) {}
    if (raw && list.indexOf(raw) !== -1) return raw;
    if (window.NekoDefaultWallpaper && list.indexOf(window.NekoDefaultWallpaper) !== -1) return window.NekoDefaultWallpaper;
    return list[0] || 'bakery.png';
  }
  function applyWallpaper(name) {
    if (!name) return;
    try { document.body.style.backgroundImage = 'url("./img/' + name + '")'; } catch (e) {}
  }
  function setWallpaper(name) {
    try { localStorage.setItem(WP_KEY, name); } catch (e) {}
    applyWallpaper(name);
  }
  function applyCharCursor() {
    try { document.body.classList.toggle('char-unlocked', !isLocked()); } catch (e) {}
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
    toggleDrawer: toggleDrawer,
    isLocked: isLocked,
    isMuted: isMuted,
    applyCharCursor: applyCharCursor
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

  // ---------- 视口边界约束（拖动窗口时不让图标/侧边栏飞出界面） ----------
  function viewportSize() {
    return {
      w: window.innerWidth || document.documentElement.clientWidth || 0,
      h: window.innerHeight || document.documentElement.clientHeight || 0
    };
  }

  // 元素“显示态”下的布局矩形（忽略隐藏时的 translateX 等 transform）
  function restRect(el) {
    var cs = window.getComputedStyle(el);
    var left = parseFloat(cs.left);
    var top = parseFloat(cs.top);
    if (!Number.isFinite(left)) left = 0;
    if (!Number.isFinite(top)) top = 0;
    return { left: left, top: top, width: el.offsetWidth || 0, height: el.offsetHeight || 0 };
  }

  function isFullyInViewport(el, pad) {
    pad = pad || 0;
    var vp = viewportSize();
    var r = restRect(el);
    return r.left >= pad && r.top >= pad &&
           (r.left + r.width) <= (vp.w - pad) &&
           (r.top + r.height) <= (vp.h - pad);
  }

  function clampToViewport(el, pad) {
    pad = pad || 0;
    var vp = viewportSize();
    var r = restRect(el);
    var maxLeft = Math.max(pad, vp.w - pad - r.width);
    var maxTop = Math.max(pad, vp.h - pad - r.height);
    var left = Math.min(Math.max(r.left, pad), maxLeft);
    var top = Math.min(Math.max(r.top, pad), maxTop);
    el.style.left = left + 'px';
    el.style.top = top + 'px';
    el.style.right = 'auto';
    return { left: left, top: top };
  }

  function resetTopbarToInitial(topbar) {
    topbar.classList.remove('free');
    topbar.style.left = '8px';
    topbar.style.top = '8px';
    topbar.style.right = 'auto';
    try { localStorage.removeItem(TOPBAR_POS_KEY); } catch (e) {}
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
    if (icon.style.left === '' || icon.style.left === 'auto') {
      // 默认定位到右上角：用视口宽度 + 固定尺寸（CSS 已固定 44px）计算，
      // 不依赖图片是否加载完成，刷新后图标不再消失。
      var vw = viewportSize().w;
      var iw = icon.offsetWidth || 44;
      icon.style.top = '8px';
      icon.style.left = Math.max(8, vw - iw - 8) + 'px';
      icon.style.right = 'auto';
    }
    // 防御：即使保存的位置越界，也把图标夹回视口内
    clampToViewport(icon, 8);

    var drag = enableDrag(icon, ICON_POS_KEY, icon);
    icon.addEventListener('click', function () {
      if (drag.wasMoved()) return;
      var willOpen = !topbar.classList.contains('open');
      if (willOpen && !isFullyInViewport(topbar, 8)) {
        // 侧边栏处于隐藏态且不完整位于界面内：恢复显示时回到初始位置
        resetTopbarToInitial(topbar);
      }
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

    // ---------- 角色设置 ----------
    var charTitle = document.createElement('div');
    charTitle.className = 'opt';
    charTitle.style.cursor = 'default';
    charTitle.style.fontWeight = 'bold';
    charTitle.setAttribute('data-i18n', 'characterSettings');
    charTitle.textContent = '角色';
    dd.appendChild(charTitle);

    function makeToggle(i18nKey, defLabel, checked, onChange) {
      var row = document.createElement('div');
      row.className = 'opt' + (checked ? ' on' : '');
      var text = document.createElement('span');
      text.setAttribute('data-i18n', i18nKey);
      text.textContent = defLabel;
      row.appendChild(text);
      var sw = document.createElement('span');
      sw.className = 'switch';
      var knob = document.createElement('span');
      knob.className = 'knob';
      sw.appendChild(knob);
      row.appendChild(sw);
      row.addEventListener('click', function (e) {
        e.stopPropagation();
        checked = !checked;
        row.classList.toggle('on', checked);
        onChange(checked);
      });
      return row;
    }

    dd.appendChild(makeToggle('lockCharacter', '锁定人物位置与大小', isLocked(), function (on) {
      writeBool(LOCK_KEY, on);
      applyCharCursor();
    }));

    dd.appendChild(makeToggle('muteSound', '关闭声音', isMuted(), function (on) {
      writeBool(MUTE_KEY, on);
    }));

    // 重设角色位置：把被拖到屏外、找不到的角色拉回默认位置与大小
    var resetRow = document.createElement('div');
    resetRow.className = 'opt reset-opt';
    var resetText = document.createElement('span');
    resetText.setAttribute('data-i18n', 'resetCharacter');
    resetText.textContent = '重设角色位置';
    resetRow.appendChild(resetText);
    resetRow.addEventListener('click', function (e) {
      e.stopPropagation();
      document.dispatchEvent(new CustomEvent('neko:reset-character'));
    });
    dd.appendChild(resetRow);

    // ---------- 壁纸选择 ----------
    var wpTitle = document.createElement('div');
    wpTitle.className = 'opt';
    wpTitle.style.cursor = 'default';
    wpTitle.style.fontWeight = 'bold';
    wpTitle.setAttribute('data-i18n', 'wallpaper');
    wpTitle.textContent = '壁纸选择';
    dd.appendChild(wpTitle);

    var wps = wallpaperList();
    var currentWp = currentWallpaper();
    wps.forEach(function (name) {
      var row = document.createElement('div');
      row.className = 'opt' + (name === currentWp ? ' selected' : '');
      row.dataset.wallpaper = name;
      var dot = document.createElement('span');
      dot.className = 'dot';
      row.appendChild(dot);
      var text = document.createElement('span');
      text.textContent = name;
      row.appendChild(text);
      row.addEventListener('click', function (e) {
        e.stopPropagation();
        setWallpaper(name);
        dd.querySelectorAll('.opt[data-wallpaper]').forEach(function (r) {
          r.classList.toggle('selected', r.dataset.wallpaper === name);
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
    applyWallpaper(currentWallpaper());
    applyCharCursor();
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
      // 拖动窗口时，确保控制按钮始终留在界面内；
      // 侧边栏仅在“显示中”时才夹回视口，隐藏态保持原位，
      // 这样点击按钮恢复显示时才会整块回到默认初始位置，而不是就近卡进视口。
      clampToViewport(icon, 8);
      if (topbar.classList.contains('open')) {
        clampToViewport(topbar, 8);
      }
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
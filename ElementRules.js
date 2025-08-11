// ==UserScript==
// @name         Element Ruler (macOS 无快捷键版 + Esc 退出)
// @namespace    https://github.com/yourname
// @version      1.0.2
// @description  左上角📏按钮开关；按 Esc 立即退出
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_UNIT = 'px';
    const REM_BASE   = 16;

    let overlay, box, active = false, startX, startY, unit = GM_getValue('unit', DEFAULT_UNIT);

    /* ---------- DOM 初始化 ---------- */
    function initOverlay() {
        overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', inset: 0, zIndex: 99998,
            cursor: 'crosshair', display: 'none',
            background: 'rgba(0,0,0,0.1)'
        });

        box = document.createElement('div');
        Object.assign(box.style, {
            position: 'absolute', border: '1px dashed #0078d4',
            background: 'rgba(0,120,212,0.15)',
            pointerEvents: 'none', color: '#fff',
            font: '12px/1.4 sans-serif', padding: '2px 4px',
            boxSizing: 'border-box', whiteSpace: 'nowrap'
        });
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    /* ---------- 事件 ---------- */
    function onStart(e) {
        startX = e.clientX;
        startY = e.clientY;
        updateBox(startX, startY, 0, 0);
    }
    function onMove(e) {
        if (startX === undefined) return;
        const w = Math.abs(e.clientX - startX);
        const h = Math.abs(e.clientY - startY);
        const x = Math.min(e.clientX, startX);
        const y = Math.min(e.clientY, startY);
        updateBox(x, y, w, h);
    }
    function onEnd() { startX = startY = undefined; }

    function updateBox(x, y, w, h) {
        Object.assign(box.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
        const wu = unit === 'rem' ? (w / REM_BASE).toFixed(2) + 'rem' : w + 'px';
        const hu = unit === 'rem' ? (h / REM_BASE).toFixed(2) + 'rem' : h + 'px';
        box.textContent = `${wu} × ${hu}`;
    }

    /* ---------- 开关 ---------- */
    function toggleRuler() {
        if (!overlay) {
            initOverlay();
            overlay.addEventListener('mousedown', onStart);
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onEnd);
            // 监听 Esc
            document.addEventListener('keydown', escListener);
        }
        active = !active;
        overlay.style.display = active ? 'block' : 'none';
        if (!active) onEnd();
    }

    /* ---------- Esc 退出 ---------- */
    function escListener(e) {
        if (e.key === 'Escape' && active) {
            active = false;
            overlay.style.display = 'none';
            onEnd();
        }
    }

    /* ---------- 左上角按钮 ---------- */
    const btn = document.createElement('div');
    Object.assign(btn.style, {
        position: 'fixed', bottom: '8px', right: '8px', zIndex: 99999,
        padding: '10px 10px', background: '#0078d4', color: '#fff',
        borderRadius: '4px', cursor: 'pointer', font: '14px/1 sans-serif'
    });
    btn.textContent = '📏';
    btn.title = '点击开关元素标尺（或按 Esc 退出）';
    btn.onclick = toggleRuler;
    document.body.appendChild(btn);
})();
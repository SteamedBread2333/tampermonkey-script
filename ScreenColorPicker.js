// ==UserScript==
// @name         Screen Color Picker
// @namespace    https://example.com
// @version      1.1
// @description  屏幕取色器：点击按钮→吸管→弹框显示色值并自动复制
// @author       you
// @match        *://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiMwMDAiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjxwYXRoIGQ9Ik0xMiA2Yy0zLjMxIDAtNiAyLjY5LTYgNnMyLjY5IDYgNiA2IDYtMi42OSA2LTYtMi42OS02LTYtNnoiLz48L3N2Zz4=
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
  'use strict';
  if (!window.EyeDropper) return;

  /* ---------- 浮动按钮 ---------- */
  const btn = document.createElement('div');
  Object.assign(btn.style, {
    position: 'fixed', bottom: '20px', right: '20px', width: '48px', height: '48px',
    borderRadius: '50%', background: '#4CAF50', cursor: 'pointer', zIndex: 9999,
    boxShadow: '0 2px 8px rgba(0,0,0,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
  });
  btn.title = '屏幕取色';
  btn.innerHTML = `<svg width="24" height="24" fill="#fff" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>`;
  document.body.appendChild(btn);

  /* ---------- 浮层显示 ---------- */
  function showColor(hex) {
    const box = document.createElement('div');
    box.id = 'colorToast';
    Object.assign(box.style, {
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
      background: hex, color: luminance(hex) > .5 ? '#000' : '#fff',
      padding: '20px 35px', borderRadius: '8px', fontSize: '20px', fontFamily: 'monospace',
      boxShadow: '0 4px 20px rgba(0,0,0,.4)', zIndex: 10000, transition: 'opacity .3s'
    });
    box.innerHTML = `<div>${hex}</div><div style="font-size:14px;margin-top:4px">已复制到剪贴板</div>`;
    document.body.appendChild(box);
    GM_setClipboard(hex);
    setTimeout(() => { box.style.opacity = 0; setTimeout(() => box.remove(), 300); }, 2000);
  }

  /* ---------- 亮度辅助 ---------- */
  function luminance(hex) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  /* ---------- 取色 ---------- */
  btn.addEventListener('click', async () => {
    try {
      const { sRGBHex } = await new EyeDropper().open();
      showColor(sRGBHex);
    } catch {/* 用户取消 */}
  });
})();
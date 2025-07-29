// ==UserScript==
// @name         Toggle DesignMode
// @namespace    https://example.com
// @version      1.1
// @description  点击右下角按钮循环开启/关闭全页可编辑（含 iframe）
// @author       you
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
    // 当前状态
    let isOn = false;
    const btn = document.createElement('button');
    // 初始图标
    btn.textContent = '✏️';
    btn.title = '开启可编辑';
    btn.style.cssText = `
        position:fixed;bottom:20px;right:20px;z-index:9999;
        padding:8px 12px;background:#ff6b00;color:#fff;
        border:none;border-radius:4px;cursor:pointer;font-size:16px;
    `;

    // 递归设置/取消 designMode
    const setDesignMode = (rootDoc, mode) => {
        rootDoc.designMode = mode;
        rootDoc.querySelectorAll('iframe, frame').forEach(iframe => {
            try {
                const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                innerDoc.designMode = mode;
                setDesignMode(innerDoc, mode); // 继续嵌套
            } catch (_) { /* 跨域跳过 */ }
        });
    };

    btn.addEventListener('click', () => {
        isOn = !isOn;
        const mode = isOn ? 'on' : 'off';
        setDesignMode(document, mode);
        btn.textContent = isOn ? '🔒' : '✏️';
        btn.title = isOn ? '关闭可编辑' : '开启可编辑';
    });

    document.body.appendChild(btn);
})();
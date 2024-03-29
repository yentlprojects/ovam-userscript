// ==UserScript==
// @name         EVOA
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  Kennisgevingsdossier specific actions
// @author       Yentl Storms
// @match        https://localhost:9000/*
// @match        https://evoa-test.ovam.be/*
// @match        https://evoa-uat.ovam.be/*
// @grant        GM_getValue
// @grant        GM_setValue
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js
// @require      http://www.openjs.com/scripts/events/keyboard_shortcuts/shortcut.js
// @require      https://raw.githubusercontent.com/yentlprojects/ovam-userscript/master/src/util.js
// @require      https://raw.githubusercontent.com/yentlprojects/ovam-userscript/master/src/sidebar.js
// @require      https://raw.githubusercontent.com/yentlprojects/ovam-userscript/master/src/evoa/kennisgevingen/dossier.js
// ==/UserScript==

/* globals $ */
/* globals waitForKeyElements */
/* globals initSidebar, createSidebarButton */
/* globals dossierActions, registerVakAddons */

(function() {
    'use strict';

    const sidebar = initSidebar();
    $('body').append(sidebar);

    let previousPath = '';
    setInterval(() => {
        const currentPath = location.pathname;
        if (previousPath === currentPath) {
            return;
        }
        previousPath = currentPath;
        let actions;
        switch (true) {
            case /\/kennisgevingen\/.+?\/dossier/.test(location.pathname):
                actions = dossierActions;
                registerVakAddons();
                break;
            default:
                actions = [];
        }
        replaceSidebarActions(actions);
    }, 2000);

    function replaceSidebarActions(actions) {
        sidebar.empty();
        actions.forEach(({id, name, execute}) => sidebar.append(createSidebarButton(id, name, execute)));
    }

})();

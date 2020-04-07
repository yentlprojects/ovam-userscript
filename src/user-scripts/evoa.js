// ==UserScript==
// @name         EVOA
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  Kennisgevingsdossier specific actions
// @author       Yentl Storms
// @match        https://*.evoa.ovam.be/*
// @match        https://localhost:9000/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js
// @require      http://www.openjs.com/scripts/events/keyboard_shortcuts/shortcut.js
// @require      file://C:\Users\yentl\ProgrammingProjects\OVAM\ovam-userscript\src\util.js
// @require      file://C:\Users\yentl\ProgrammingProjects\OVAM\ovam-userscript\src\sidebar.js
// @require      file://C:\Users\yentl\ProgrammingProjects\OVAM\ovam-userscript\src\evoa\kennisgevingen\dossier.js
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

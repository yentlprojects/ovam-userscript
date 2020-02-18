// ==UserScript==
// @name         EVOA - Kennisgevingsdossiers
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Kennisgevingsdossier specific actions
// @author       Yentl Storms
// @match        https://localhost:9000/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js
// @require      http://www.openjs.com/scripts/events/keyboard_shortcuts/shortcut.js
// @require      https://raw.githubusercontent.com/yentlprojects/ovam-userscript/master/src/util.js
// @require      https://raw.githubusercontent.com/yentlprojects/ovam-userscript/master/src/sidebar.js
// @require      https://raw.githubusercontent.com/yentlprojects/ovam-userscript/master/src/kennisgevingen/dossier.js
// ==/UserScript==

/* globals waitForKeyElements */
/* globals initSidebar, createSidebarButton */
/* globals dossierActions */

(function() {
    'use strict';

    waitForKeyElements('nav.vl-side-navigation:contains("Contact"):contains("Dossierkost"):contains("Bankgarantie"):contains("Vakken")', () => {
        const sidebar = initSidebar();
        sidebar.empty();
        dossierActions.forEach(({name, execute}) => sidebar.append(createSidebarButton(name, execute)));
    });
})();
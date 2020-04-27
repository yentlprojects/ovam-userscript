/* globals $ */
/* globals shortcut */
/* globals waitForElementsOnce */
/* globals GM_getValue, GM_setValue */

function initSidebar() {
    const sidebar = $('<div id="evoa-util-sidebar"/>').css({
        "display": GM_getValue("evoa_actions_shown", false) ? 'flex' : 'none',
        "flex-direction": "column",
        "position": "fixed",
        "top": "75%",
        "transform": "translateY(-50%)",
        "right": "0",
        "min-width": "10px",
        "min-height": "40px",
        "padding": "5px",
        "background-color": "rgba(0, 0, 0, 0.5)",
        "z-index": "50000"
    });
    createKeyboardShortcutHandler(sidebar);
    return sidebar;
}

function createSidebarButton(id, text, onClick) {
    return $('<button/>', {
        id: id,
        text: text,
        class: 'vl-button vl-button--narrow',
        style: 'margin: 5px',
        click: onClick
    });
}

function createKeyboardShortcutHandler(sidebar) {
    shortcut.add('Ctrl+Shift+U', function() {
        const showActions = !GM_getValue("evoa_actions_shown", false);
        GM_setValue("evoa_actions_shown", showActions);
        toggleSidebar(sidebar, showActions);
        toggleVakAddons(showActions);
    });
}

function toggleSidebar(sidebar, show) {
    sidebar.css({"display": show ? 'flex' : 'none'});
}

function toggleVakAddons(show) {
    $('button[id$="-vak-action"]').each(function() {
        const button = $(this);
        button.css({"display": show ? 'block' : 'none'});

    })
}
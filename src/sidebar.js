/* globals $ */
/* globals shortcut */
/* globals waitForElementsOnce */

function initSidebar() {
    const sidebar = $('<div id="evoa-util-sidebar"/>').css({
        "display": "none",
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
        const sidebarIsHidden = sidebar.css('display') === 'none';
        sidebar.css({"display": sidebarIsHidden ? 'flex' : 'none'});
    });
}
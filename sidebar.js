/* globals $ */
/* globals shortcut */
/* globals waitForElementsOnce */

function initSidebar(addToSelector = '.view-routes > *:first()') {
    const sidebar = $('<div id="evoa-util-sidebar"/>').css({
        "display": "none",
        "flex-direction": "column",
        "position": "fixed",
        "top": "75%",
        "transform": "translateY(-50%)",
        "right": "0",
        "width": "200px",
        "padding": "5px",
        "background-color": "rgba(0, 0, 0, 0.5)",
        "z-index": "50000"
    });
    // Add it to first child of the actual content of page, so the sidebar gets deleted when navigating (and rebuilt by pages that have one)
    waitForElementsOnce(addToSelector). then(el => el.append(sidebar));
    createKeyboardShortcutHandler(sidebar);
    return sidebar;
}

function createSidebarButton(text, onClick) {
    return $('<button/>', {
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
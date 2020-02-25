/* globals $, waitForKeyElements */

function waitForElementsOnce(selector) {
    return new Promise((resolve, reject) => {
       const jNode = $(selector);
        if (jNode.length > 0) {
            resolve(jNode);
            return;
        }
        waitForKeyElements(selector, function(el) {
            resolve(el);
            return false;
        }, true);
    });
}

function waitForElementOnceById(id) {
    return waitForElementsOnce(`#${id}`);
}

function createMockDataTransfer(fileName = 'programmatically_created.txt', fileBits = ['foobar']) {
    const dataTransfer = new ClipboardEvent('').clipboardData || // Firefox < 62 workaround exploiting https://bugzilla.mozilla.org/show_bug.cgi?id=1422655
            new DataTransfer(); // specs compliant (as of March 2018 only Chrome)
    dataTransfer.items.add(new File(fileBits, fileName));
    return dataTransfer;
}

function addMockAttachment(inputElement) {
    inputElement = inputElement instanceof $ ? inputElement.get(0) : inputElement;
    inputElement.files = createMockDataTransfer().files;
    inputElement.dispatchEvent(new Event('change', { bubbles: true }));
}

function getDateFormattedForInput() {
    const d = new Date();
    return ("0" + d.getDate()).slice(-2) + "." + ("0"+(d.getMonth()+1)).slice(-2) + "." + d.getFullYear();
}

/**
 * Work-around for React-controlled inputs to properly trigger events and store updates to happen.
 * */
function setNativeInputValue(element, value) {
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(element, value);
    } else {
        valueSetter.call(element, value);
    }
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

function selectNativeOption(selectElement, optionElement) {
    optionElement = optionElement instanceof $ ? optionElement : $(optionElement);
    optionElement.prop('selected', true);
    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
}

function sendNativeClick(elementToClick) {
    elementToClick = elementToClick instanceof $ ? elementToClick.get(0) : elementToClick;
    elementToClick.dispatchEvent(new Event('click', { bubbles: true }));
}

function selectOptionByValue(selectElement, value) {
    const selectJNode = selectElement instanceof $ ? selectElement : $(selectElement);
    selectNativeOption(selectJNode.get(0), selectJNode.find(`option[value="${value}"]`).eq(0));
}
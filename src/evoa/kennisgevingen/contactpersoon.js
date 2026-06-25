/* globals $ */
/* globals setNativeInputValue */

const NIEUWE_CONTACT_DEFAULTS = {
  contactPersoon: 'Mock contact naam',
  telefoonnummer: '0498/765432',
  email: 'mockemail@mockprovider.mock',
  faxnummer: '0412/345678'
};

const VUL_CONTACT_BTN_ID = 'vul-contactpersoon-formulier';

function fillNieuweContactPersoon(modal) {
  const nieuweContactBtn = modal.find('button:contains("Nieuwe contactpersoon aanmaken")');
  if (nieuweContactBtn.length) {
    nieuweContactBtn.get(0).click();
  }

  const setField = (selector, value) => {
    const el = modal.find(selector).get(0);
    if (el) {
      setNativeInputValue(el, value);
    }
  };

  setField('input#contactPersoon', NIEUWE_CONTACT_DEFAULTS.contactPersoon);
  setField('input#telefoonnummer', NIEUWE_CONTACT_DEFAULTS.telefoonnummer);
  setField('input#email', NIEUWE_CONTACT_DEFAULTS.email);
  setField('input#faxnummer', NIEUWE_CONTACT_DEFAULTS.faxnummer);

  modal.find('button:contains("Contactpersoon aanmaken")').click();
}

function createVulContactButton(modal) {
  return $('<button/>', {
    id: VUL_CONTACT_BTN_ID,
    type: 'button', // niet 'submit', anders wordt de modal verzonden
    text: 'Nieuwe contactpersoon',
    class: 'vl-button vl-button--narrow',
    style: 'position: absolute; top: 10px; right: 50px;',
    click: function (e) {
      e.preventDefault();
      fillNieuweContactPersoon(modal);
    }
  });
}

function addVulContactButton(modalNode) {
  const modal = $(modalNode);

  // Voorkom dubbele knoppen wanneer de observer meermaals triggert.
  if (modal.find(`#${VUL_CONTACT_BTN_ID}`).length) {
    return;
  }

  const button = createVulContactButton(modal);
  modal.prepend(button);
}

function registerNieuweContactPersoonAddon() {
  const MODAL_SELECTOR = '.contact-selectie-modal';
  const MODAL_TITLE = 'Nieuwe contactpersoon aanmaken';
  const BTN_TEXT = 'Contactpersoon aanmaken';

  const tryInject = (root) => {
    $(root)
      .find(MODAL_SELECTOR)
      .addBack(MODAL_SELECTOR)
      .filter((_, el) => $(el).text().includes(MODAL_TITLE))
      .each((_, el) => addVulContactButton(el));
  };

  // Initiële poging (modal kan al open staan).
  tryInject(document.body);

  // De modal wordt dynamisch (her)opgebouwd => observeer DOM-wijzigingen.
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          tryInject(node);
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

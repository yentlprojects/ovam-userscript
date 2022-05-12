/* globals $ */
/* globals waitForElementsOnce,
           waitForElementOnceById,
           sleep,
           createMockDataTransfer,
           addMockAttachment,
           getDateFormattedForInput,
           setNativeInputValue,
           selectNativeOption,
           sendNativeClick,
           selectOptionByValue
*/
/* globals GM_getValue */

const dossierActions = [
    {
        id: 'dossier-correct-verricht',
        name: 'Correct Verricht',
        execute: markAsCorrectVerricht
    },
    {
        id: 'dossier-vul-in',
        name: 'Vul Dossier In',
        execute: () => fillInDossier(false)
    },
    {
        id: 'dossier-vul-in-save',
        name: 'Vul Dossier In (Save)',
        execute: fillInDossier
    }
];

function markAsCorrectVerricht() {
    $('[id=correct-verklaren-pill]').has('input:not(:checked)').click();
}

async function fillInDossier(save = true) {
    // Saving Vak4 triggers changes in Vak3, possibly resulting in concurrency issues when saved concurrently => move them apart to reduce risk (hacky '=.=)
    console.warn('Filling in dossier...');
    try { await fillInKost(save); } catch(e) { console.error('Filling in kost failed.', e) }
    try { await fillInBankgarantie(save); } catch(e) { console.error('Filling in bankgarantie failed.', e) }
    try { await fillInVak4(save); } catch(e) { console.error('Filling in vak4 failed.', e) }
    try { await fillInVak1(save); } catch(e) { console.error('Filling in vak1 failed.', e) }
    try { await fillInVak2(save); } catch(e) { console.error('Filling in vak2 failed.', e) }
    try { await fillInVak5(save); } catch(e) { console.error('Filling in vak5 failed.', e) }
    try { await fillInVak6(save); } catch(e) { console.error('Filling in vak6 failed.', e) }
    try { await fillInVak7(save); } catch(e) { console.error('Filling in vak7 failed.', e) }
    try { await fillInVak8(save); } catch(e) { console.error('Filling in vak8 failed.', e) }
    try { await fillInVak9(save); } catch(e) { console.error('Filling in vak9 failed.', e) }
    try { await fillInVak10(save); } catch(e) { console.error('Filling in vak10 failed.', e) }
    try { await fillInVak11(save); } catch(e) { console.error('Filling in vak11 failed.', e) }
    try { await fillInVak12(save); } catch(e) { console.error('Filling in vak12 failed.', e) }
    try { await fillInVak13(save); } catch(e) { console.error('Filling in vak13 failed.', e) }
    try { await fillInVak14(save); } catch(e) { console.error('Filling in vak14 failed.', e) }
    try { await fillInVak15(save); } catch(e) { console.error('Filling in vak15 failed.', e) }
    try { await fillInVak16(save); } catch(e) { console.error('Filling in vak16 failed.', e) }
    try { await fillInVak17(save); } catch(e) { console.error('Filling in vak17 failed.', e) }
    try { await fillInVak3(save); } catch(e) { console.error('Filling in vak3 failed.', e) }
    console.warn('Dossier filled in.');
}

function registerVakAddons() {
    for (let vak of Object.values(vakken).filter(vak => !!vak.action)) {
        waitForElementOnceById(vak.id).then(vakNode => vakNode.append(createVakAddonButton(vak)));
    }
}

function createVakAddonButton({id, action}) {
    const button = $('<button/>', {
        id: `${id}-vak-action`,
        text: '< Vul vak in',
        class: 'vl-button vl-button--narrow',
        click: action,
    });
    button.css({
        "display": GM_getValue("evoa_actions_shown", false) ? 'block' : 'none',
        "position": "absolute",
        "overflow": "hidden",
        "top": 0,
        "right": 0,
        "width": "22px"
    });
    button.hover(function() {
        $(this).animate({width: "125px"}, 200);
    }, function() {
        $(this).animate({width: "22px"}, 200);
    });
    return button;
}

const vakken = {
    'kost': {id: 'dossierkost-form', action: fillInKost},
    'bankgarantie': {id: 'bankgarantie-onderdeel-formulier', action: fillInBankgarantie},
    1: {id: 'vak-1-exporteur', action: fillInVak1},
    2: {id: 'vak-2-importeur', action: fillInVak2},
    3: {id: 'vak-3-type-aanvraag', action: fillInVak3},
    4: {id: 'vak-4-aantal-overbrengingen', action: fillInVak4},
    5: {id: 'vak-5-hoeveelheid', action: fillInVak5},
    6: {id: 'vak-6-overbrengingperiode', action: fillInVak6},
    7: {id: 'vak-7-verpakkings-wijze', action: fillInVak7},
    8: {id: 'vak-8-geplande-vervoerders', action: fillInVak8},
    9: {id: 'vak-9-producenten-afvalstoffen', action: fillInVak9},
    10: {id: 'vak-10-inrichting', action: fillInVak10},
    11: {id: 'vak-11-handelingen', action: fillInVak11},
    12: {id: 'vak-12-benaming-materiaal', action: fillInVak12},
    13: {id: 'vak-13-fysische-eigenschappen', action: fillInVak13},
    14: {id: 'vak-14-identificatie-afvalstoffen', action: fillInVak14},
    15: {id: 'vak-15-betrokken-landen', action: fillInVak15},
    16: {id: 'vak-16-douanekantoren', action: fillInVak16},
    17: {id: 'vak-17-verklaring', action: fillInVak17}
};

async function fillInKost(save = true) {
    const onderdeel = await waitForElementOnceById(vakken['kost'].id);

    // Select bedrijf
    const selectKennisgeverLink = onderdeel.find('button:contains("Selecteer factuuradres")');
    if (selectKennisgeverLink.length) {
        sendNativeClick(selectKennisgeverLink);

        const kiesKennisgeverModal = await waitForElementsOnce('#bedrijf-selectie:contains("Kies een factuuradres")');
        selectOptionByValue(kiesKennisgeverModal.find('select[name="landCode"]'), 'BE');
        kiesKennisgeverModal.find('button[type="submit"]').click();

        const selectBedrijfBtns = await waitForElementsOnce('#bedrijf-selectie:contains("Kies een factuuradres") .bedrijf-selectie-box button:contains("Selecteer")');
        selectBedrijfBtns.eq(0).click();
    }

    // Select contactPersoon
    const selectContactPersoonLink = await waitForElementsOnce('button:contains("Selecteer contactpersoon")', onderdeel);
    if (selectContactPersoonLink.length) {
        sendNativeClick(selectContactPersoonLink);

        try {
            const selectContactPersoonBtns = await waitForElementsOnce('.contact-selectie-modal:contains("Kies een contactpersoon") .contact-persoon-selectie-box button:contains("Selecteer")');
            selectContactPersoonBtns.eq(0).click();
        } catch (e) {
            console.warn('No known contact found... making new mock contact.');
            await createNewContact();
        }
    }

    if (save) {
        onderdeel.find('button[type="submit"]').click();
    }
}

async function fillInBankgarantie(save = true) {
    const onderdeel = await waitForElementOnceById(vakken['bankgarantie'].id);

    const waarborgInput = onderdeel.find('input#bankgarantie-onderdeel-documenten');
    if (waarborgInput.length) {
        addMockAttachment(waarborgInput.get(0));
    }

    if (save) {
        onderdeel.find('button[type="submit"]').click();
    }
}

async function fillInVak1(save = true) {
    const vak = await waitForElementOnceById(vakken[1].id);

    // Select bedrijf
    const selectKennisgeverLink = vak.find('button:contains("Selecteer kennisgever")');
    if (selectKennisgeverLink.length) {
        sendNativeClick(selectKennisgeverLink);

        const kiesKennisgeverModal = await waitForElementsOnce('#bedrijf-selectie:contains("Kies een kennisgever")');
        selectOptionByValue(kiesKennisgeverModal.find('select[name="landCode"]'), 'BE');
        kiesKennisgeverModal.find('button[type="submit"]').click();

        const selectBedrijfBtns = await waitForElementsOnce('#bedrijf-selectie:contains("Kies een kennisgever") .bedrijf-selectie-box button:contains("Selecteer")');
        selectBedrijfBtns.eq(0).click();
    }

    // Select contactPersoon
    const selectContactPersoonLink = await waitForElementsOnce('button:contains("Selecteer contactpersoon")', vak);
    if (selectContactPersoonLink.length) {
        sendNativeClick(selectContactPersoonLink);

        try {
            const selectContactPersoonBtns = await waitForElementsOnce('.contact-selectie-modal:contains("Kies een contactpersoon") .contact-persoon-selectie-box button:contains("Selecteer")');
            selectContactPersoonBtns.eq(0).click();
        } catch (e) {
            console.warn('No known contact found... making new mock contact.');
            await createNewContact();
        }
    }

    // Set attachment
    addMockAttachment(vak.find('input#vak1ContractDocumentenUpload').get(0));

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak2(save = true) {
    const vak = await waitForElementOnceById(vakken[2].id);

    // Select bedrijf
    const selectOntvangerLink = vak.find('button:contains("Selecteer ontvanger")');
    if (selectOntvangerLink.length) {
        sendNativeClick(selectOntvangerLink);

        const kiesOntvangerModal = await waitForElementsOnce('#bedrijf-selectie:contains("Kies een ontvanger")');
        selectOptionByValue(kiesOntvangerModal.find('select[name="landCode"]'), 'BE');
        kiesOntvangerModal.find('button[type="submit"]').click();

        const selectBedrijfBtns = await waitForElementsOnce('#bedrijf-selectie:contains("Kies een ontvanger") .bedrijf-selectie-box button:contains("Selecteer")');
        selectBedrijfBtns.eq(0).click();
    }

    // Select contactPersoon
    const selectContactPersoonLink = await waitForElementsOnce('button:contains("Selecteer contactpersoon")', vak);
    if (selectContactPersoonLink.length) {
        sendNativeClick(selectContactPersoonLink);

        try {
            const selectContactPersoonBtns = await waitForElementsOnce('.contact-selectie-modal:contains("Kies een contactpersoon") .contact-persoon-selectie-box button:contains("Selecteer")');
            selectContactPersoonBtns.eq(0).click();
        } catch (e) {
            console.warn('No known contact found... making new mock contact.');
            await createNewContact();
        }
    }

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak3(save = true) {
    const vak = await waitForElementOnceById(vakken[3].id);

    vak.find('label').has('input[value="NUTTIGE_TOEPASSING"]').click();

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak4(save = true) {
    const vak = await waitForElementOnceById(vakken[4].id);

    const input = vak.find('input#aantalOverbrengingen').get(0);
    setNativeInputValue(input, 333);

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak5(save = true) {
    const vak = await waitForElementOnceById(vakken[5].id);

    const input = vak.find('input#hoeveelheid').get(0);
    setNativeInputValue(input, 666);

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak6(save = true) {
    const vak = await waitForElementOnceById(vakken[6].id);

    setNativeInputValue(vak.find('input#eersteVertrek').get(0), getDateFormattedForInput(new Date()));
    setNativeInputValue(vak.find('input#laatsteVertrek').get(0), getDateFormattedForInput(new Date(), 180));

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak7(save = true) {
    const vak = await waitForElementOnceById(vakken[7].id);

    selectOptionByValue(vak.find('select[name="verpakkingsWijze"]'), '1');

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak8(save = true) {
    const vak = await waitForElementOnceById(vakken[8].id);

    // Select vervoerswijze
    selectOptionByValue(vak.find('select[name="selectedVervoerswijze"]'), 'ROAD');
    vak.find('button:contains("Toevoegen")').click();

    // Add vervoerder
    vak.find('button:contains("Vervoerder toevoegen")').click()
    const vervoerderToevoegenModal = await waitForElementOnceById('vak8-wizard');
    selectOptionByValue(vervoerderToevoegenModal.find('select[name="landCode"]'), 'BE');
    vervoerderToevoegenModal.find('button[type="submit"]').click();

    const selectBedrijfBtns = await waitForElementsOnce('#vak8-wizard .bedrijf-selectie-box button:contains("Selecteer")');
    selectBedrijfBtns.eq(0).click();

    const selectContactPersoonBtns = await waitForElementsOnce('#vak8-wizard .contact-persoon-selectie-box button:contains("Selecteer")');
    selectContactPersoonBtns.eq(0).click();

    (await waitForElementsOnce('#vak8-wizard button:contains("Vervoerder toevoegen")')).click();

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak9(save = true) {
    const vak = await waitForElementOnceById(vakken[9].id);

    // Add producent
    vak.find('button:contains("Producent toevoegen")').click();
    const producentToevoegenModal = await waitForElementOnceById('vak9-wizard');
    selectOptionByValue(producentToevoegenModal.find('select[name="landCode"]'), 'BE');
    producentToevoegenModal.find('button[type="submit"]').click();

    const selectBedrijfBtns = await waitForElementsOnce('#vak9-wizard .bedrijf-selectie-box button:contains("Selecteer")');
    selectBedrijfBtns.eq(0).click();

    const selectContactPersoonBtns = await waitForElementsOnce('#vak9-wizard .contact-persoon-selectie-box button:contains("Selecteer")');
    selectContactPersoonBtns.eq(0).click();

    const locatieInput = (await waitForElementsOnce('textarea[name="locatie"]', vak)).get(0);
    setNativeInputValue(locatieInput, 'Mock locatie');

    const procesInput = (await waitForElementsOnce('textarea[name="proces"]', vak)).get(0);
    setNativeInputValue(procesInput, 'Mock proces');

    (await waitForElementsOnce('#vak9-wizard #producent-wizard button[type="submit"]')).click();

    // Set attachment
    addMockAttachment(vak.find('input#vak9ProductieProcesDocumentenUpload').get(0));

    if (save) {
        await sleep(500); // Producenten lijken na het "toevoegen" even niet in de state te zitten, waardoor ze bij save niet mee naar backend gestuurd worden :/
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak10(save = true) {
    const vak = await waitForElementOnceById(vakken[10].id);

    // Select bedrijf
    const selectInrichtingLink = vak.find('button:contains("Selecteer inrichting")');
    if (selectInrichtingLink.length) {
        sendNativeClick(selectInrichtingLink);

        const kiesInrichtingModal = await waitForElementsOnce('#bedrijf-selectie:contains("Kies een inrichting")');
        selectOptionByValue(kiesInrichtingModal.find('select[name="landCode"]'), 'BE');
        kiesInrichtingModal.find('button[type="submit"]').click();

        const selectBedrijfBtns = await waitForElementsOnce('#bedrijf-selectie:contains("Kies een inrichting") .bedrijf-selectie-box button:contains("Selecteer")');
        selectBedrijfBtns.eq(0).click();
    }

    // Select contactPersoon
    const selectContactPersoonLink = await waitForElementsOnce('button:contains("Selecteer contactpersoon")', vak);
    if (selectContactPersoonLink.length) {
        sendNativeClick(selectContactPersoonLink);

        try {
            const selectContactPersoonBtns = await waitForElementsOnce('.contact-selectie-modal:contains("Kies een contactpersoon") .contact-persoon-selectie-box button:contains("Selecteer")');
            selectContactPersoonBtns.eq(0).click();
        } catch (e) {
            console.warn('Geen bestaande contactpersonen gevonden... Nieuw mock contact wordt aangemaakt.');
            await createNewContact();
        }
    }

    // Select typeInrichting
    vak.find('label').has('input[value="VERWIJDERING"]').click();

    // Set feitelijke locatie
    const procesInput = (await waitForElementsOnce('textarea[name="feitelijkeLocatie"]', vak)).get(0);
    setNativeInputValue(procesInput, 'Mock feitelijke locatie');

    // Set attachment
    addMockAttachment(vak.find('input#vak10InrichtingBewijsVanVergunningDocumentenUpload').get(0));
    addMockAttachment(vak.find('input#vak10InrichtingPafVergunningDocumentenUpload').get(0));

    if (save) {
        vak.find('button[type=submit]').click();
    }
}

async function fillInVak11(save = true) {
    const vak = await waitForElementOnceById(vakken[11].id);

    // Select D-Code
    let select = vak.find('select#selectedVerwijderingshandeling');
    let options = select.find('option:not(:disabled)');
    selectOptionByValue(select, options.eq(0).val());
    vak.find('button:contains("Toevoegen")').eq(0).click();

    // Select R-Code
    select = vak.find('select#selectedNuttigeToepassing');
    options = select.find('option:not(:disabled)');
    selectOptionByValue(select, options.eq(0).val());
    vak.find('button:contains("Toevoegen")').eq(1).click();

    // Set attachment
    addMockAttachment(vak.find('input#vak11VerwerkingsprocesDocumentenUpload').get(0));

    if (save) {
        vak.find('button[type=submit]').click();
    }
}

async function fillInVak12(save = true) {
    const vak = await waitForElementOnceById(vakken[12].id);

    const textarea = vak.find('textarea').get(0);
    setNativeInputValue(textarea, 'OK');

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak13(save = true) {
    const vak = await waitForElementOnceById(vakken[13].id);

    selectOptionByValue(vak.find('select[name="geselecteerdeEigenschap.code"]'), 'POEDERIG_POEDER');
    vak.find('button:contains("Toevoegen")').click();

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak14(save = true) {
    const vak = await waitForElementOnceById(vakken[14].id);

    vak.find('label').has('input[name="bazelEnOESOCodeNietVermeld"]:not(:checked)').click();
    vak.find('label').has('input[name="yCodeNietVermeld"]:not(:checked)').click();
    vak.find('label').has('input[name="hNummerCodeNietVermeld"]:not(:checked)').click();
    vak.find('label').has('input[name="vnKlasseCodeNietVermeld"]:not(:checked)').click();
    vak.find('label').has('input[name="vnNummerCodeNietVermeld"]:not(:checked)').click();

    let selectAfvalstoffen = vak.find('select#afvalstoffenEural');
    let options = selectAfvalstoffen.find('option:not(:disabled)');
    selectOptionByValue(selectAfvalstoffen, options.eq(1).val()); // Select 2nd non-disabled option
    vak.find('button:contains("Toevoegen")').eq(0).click();

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak15(save = true) {
    const vak = await waitForElementOnceById(vakken[15].id);
    const dossierType = ($('dt:contains("Dossiertype")').next().find('select#dossierTypeSelect').val() || $('dt:contains("Dossiertype")').next().text()).toUpperCase();
    const isInvoerDossier = dossierType === 'INVOER';
    // const isHoefijzerDossier = dossierType === 'HOEFIJZER'; // TODO: hoefijzer dossier werkt nog niet.

    // Select Uitvoerland (if none present)
   if (!vak.find('table td:contains("Uitvoer")').length) {
        vak.find('button:contains("Uitvoerland selecteren")').click();
        selectOptionByValue(vak.find('select[data-id="land"]'), isInvoerDossier ? 'NL' : 'BE');
        setNativeInputValue(vak.find('input#exit').get(0), isInvoerDossier ? 'Hazeldonk' : 'Meer');
        (await waitForElementsOnce('.vl-modal-dialog__buttons button:contains("Toevoegen"):enabled')).click();
    }

    // Select Invoerland (if none present)
    if (!vak.find('table td:contains("Invoer")').length) {
        vak.find('button:contains("Invoerland selecteren")').click();
        selectOptionByValue(vak.find('select[data-id="land"]'), isInvoerDossier ? 'BE' : 'NL');
        setNativeInputValue(vak.find('input#entry').get(0), isInvoerDossier ? 'Meer' : 'Hazeldonk');
        (await waitForElementsOnce('.vl-modal-dialog__buttons button:contains("Toevoegen"):enabled')).click();
    }

    // Set attachment
    addMockAttachment(vak.find('input#vak15RoutebeschrijvingUpload').get(0));

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak16(save = true) {
    const vak = await waitForElementOnceById(vakken[16].id);

    // Clicking directly on input element does not properly update state1
    vak.find('label.vl-checkbox:has(input#EG:not(:checked))').click();

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak17(save = true) {
    const vak = await waitForElementOnceById(vakken[17].id);

    if (vak.find('p:contains("De info in dit vak ziet u na het indienen van het dossier.")').length) {
        console.warn('Skipping vak17 as it is in a read-only state.');
        return;
    }

    setNativeInputValue(vak.find('input#vak17-kennisgever-naam').get(0), 'Mock kennisgever naam');
    setNativeInputValue(vak.find('input#kennisgeverDatum').get(0), getDateFormattedForInput(new Date(), -3));

    setNativeInputValue(vak.find('input#vak17-producent-naam').get(0), 'Mock producent naam');
    setNativeInputValue(vak.find('input#vak17-producent-datum').get(0), getDateFormattedForInput(new Date(), -2));

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function createNewContact() {
    (await waitForElementsOnce('button:contains("Nieuwe contactpersoon aanmaken")')).click();

    const modal = await waitForElementsOnce('.contact-selectie-modal:contains("Nieuwe contactpersoon aanmaken")');
    setNativeInputValue((await waitForElementsOnce('input#contactPersoon', modal)).get(0), 'Mock contact naam');
    setNativeInputValue((await waitForElementsOnce('input#telefoonnummer', modal)).get(0), '0498/765432');
    setNativeInputValue((await waitForElementsOnce('input#email', modal)).get(0), 'mockemail@mockprovider.mock');
    setNativeInputValue((await waitForElementsOnce('input#faxnummer', modal)).get(0), '0412/345678');

    modal.find('button[type="submit"]').click();

    await sleep(600); // Create contact call immediately closes the modal, but state is updated async later
}

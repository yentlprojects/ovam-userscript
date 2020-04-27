/* globals $ */
/* globals waitForElementsOnce,
           waitForElementOnceById,
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

function fillInDossier(save = true) {
    // Saving Vak4 triggers changes in Vak3, possibly resulting in concurrency issues when saved concurrently => move them apart to reduce risk (hacky '=.=)
    Promise.resolve(console.warn('Filling in dossier...'))
            .then(() => fillInVak4(save))
            .then(() => fillInVak1(save))
            .then(() => fillInVak2(save))
            .then(() => fillInVak5(save))
            .then(() => fillInVak6(save))
            .then(() => fillInVak7(save))
            .then(() => fillInVak8(save))
            .then(() => fillInVak9(save))
            .then(() => fillInVak10(save))
            .then(() => fillInVak11(save))
            .then(() => fillInVak12(save))
            .then(() => fillInVak13(save))
            .then(() => fillInVak14(save))
            .then(() => fillInVak15(save))
            .then(() => fillInVak16(save))
            .then(() => fillInVak3(save))
            .then(() => console.warn('Dossier filled in.'));
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
    16: {id: 'vak-16-douanekantoren', action: fillInVak16}
};

async function fillInVak1(save = true) {
    const vak = await waitForElementOnceById(vakken[1].id);

    // Select bedrijf
    const selectKennisgeverLink = vak.find('a:contains("Selecteer kennisgever")');
    if (selectKennisgeverLink.length) {
        sendNativeClick(selectKennisgeverLink);

        const kiesKennisgeverModal = await waitForElementsOnce('#bedrijf-selectie:contains("Kies een kennisgever")');
        selectOptionByValue(kiesKennisgeverModal.find('select[name="landCode"]'), 'BE');
        kiesKennisgeverModal.find('button[type="submit"]').click();

        const selectBedrijfBtns = await waitForElementsOnce('#bedrijf-selectie:contains("Kies een kennisgever") .bedrijf-selectie-box button:contains("Selecteer")');
        selectBedrijfBtns.eq(0).click();
    }

    // Select contactPersoon
    const selectContactPersoonLink = vak.find('a:contains("Selecteer contactpersoon")');
    if (selectContactPersoonLink.length) {
        sendNativeClick(selectContactPersoonLink);

        const selectContactPersoonBtns = await waitForElementsOnce('.contact-selectie:contains("Kies een contactpersoon") .contact-persoon-selectie-box button:contains("Selecteer")');
        selectContactPersoonBtns.eq(0).click();
    }

    // Set attachment
    addMockAttachment(vak.find('input#vak1ContractDocumentenUpload').get(0));
    addMockAttachment(vak.find('input#vak1WaarborgDocumentenUpload').get(0));

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak2(save = true) {
    const vak = await waitForElementOnceById(vakken[2].id);

    // Select bedrijf
    const selectOntvangerLink = vak.find('a:contains("Selecteer ontvanger")');
    if (selectOntvangerLink.length) {
        sendNativeClick(selectOntvangerLink);

        const kiesOntvangerModal = await waitForElementsOnce('#bedrijf-selectie:contains("Kies een ontvanger")');
        selectOptionByValue(kiesOntvangerModal.find('select[name="landCode"]'), 'BE');
        kiesOntvangerModal.find('button[type="submit"]').click();

        const selectBedrijfBtns = await waitForElementsOnce('#bedrijf-selectie:contains("Kies een ontvanger") .bedrijf-selectie-box button:contains("Selecteer")');
        selectBedrijfBtns.eq(0).click();
    }

    // Select contactPersoon
    const selectContactPersoonLink = vak.find('a:contains("Selecteer contactpersoon")');
    if (selectContactPersoonLink.length) {
        sendNativeClick(selectContactPersoonLink);

        const selectContactPersoonBtns = await waitForElementsOnce('.contact-selectie:contains("Kies een contactpersoon") .contact-persoon-selectie-box button:contains("Selecteer")');
        selectContactPersoonBtns.eq(0).click();
    }

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak3(save = true) {
    const vak = await waitForElementOnceById(vakken[3].id);

    vak.find('label').has('input[value="VERWIJDERING"]').click();

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
    vak.find('button:contains("Producent toevoegen")').click()
    const producentToevoegenModal = await waitForElementOnceById('vak9-wizard');
    selectOptionByValue(producentToevoegenModal.find('select[name="landCode"]'), 'BE');
    producentToevoegenModal.find('button[type="submit"]').click();

    const selectBedrijfBtns = await waitForElementsOnce('#vak9-wizard .bedrijf-selectie-box button:contains("Selecteer")');
    selectBedrijfBtns.eq(0).click();

    const selectContactPersoonBtns = await waitForElementsOnce('#vak9-wizard .contact-persoon-selectie-box button:contains("Selecteer")');
    selectContactPersoonBtns.eq(0).click();

    (await waitForElementsOnce('#vak9-wizard button:contains("Producent toevoegen")')).click();

    // Set attachment
    addMockAttachment(vak.find('input#vak9ProductieProcesDocumentenUpload').get(0));

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak10(save = true) {
    const vak = await waitForElementOnceById(vakken[10].id);

    // Select bedrijf
    const selectInrichtingLink = vak.find('a:contains("Selecteer inrichting")');
    if (selectInrichtingLink.length) {
        sendNativeClick(selectInrichtingLink);

        const kiesInrichtingModal = await waitForElementsOnce('#bedrijf-selectie:contains("Kies een inrichting")');
        selectOptionByValue(kiesInrichtingModal.find('select[name="landCode"]'), 'BE');
        kiesInrichtingModal.find('button[type="submit"]').click();

        const selectBedrijfBtns = await waitForElementsOnce('#bedrijf-selectie:contains("Kies een inrichting") .bedrijf-selectie-box button:contains("Selecteer")');
        selectBedrijfBtns.eq(0).click();
    }

    // Select contactPersoon
    const selectContactPersoonLink = vak.find('a:contains("Selecteer contactpersoon")');
    if (selectContactPersoonLink.length) {
        sendNativeClick(selectContactPersoonLink);

        const selectContactPersoonBtns = await waitForElementsOnce('.contact-selectie:contains("Kies een contactpersoon") .contact-persoon-selectie-box button:contains("Selecteer")');
        selectContactPersoonBtns.eq(0).click();
    }

    // Select typeInrichting
    vak.find('label').has('input[value="VERWIJDERING"]').click();

    // Set attachment
    addMockAttachment(vak.find('input#vak10Inrichting').get(0));

    if (save) {
        vak.find('button[type=submit]').click();
    }
}

async function fillInVak11(save = true) {
    const vak = await waitForElementOnceById(vakken[11].id);

    // Select D-Code
    selectOptionByValue(vak.find('select#selectedVerwijderingshandeling'), 'D01');
    vak.find('button:contains("Toevoegen")').eq(0).click();

    // Select R-Code
    selectOptionByValue(vak.find('select#selectedNuttigeToepassing'), 'R01');
    vak.find('button:contains("Toevoegen")').eq(1).click();

    // Set attachment
    addMockAttachment(vak.find('input#vak11Upload').get(0));

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

    selectOptionByValue(vak.find('select#afvalstoffenEural'), '010101');
    vak.find('button:contains("Toevoegen")').eq(0).click();

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak15(save = true) {
    const vak = await waitForElementOnceById(vakken[15].id);
    const isInvoerDossier = $('dt:contains("Dossiertype")').next().text() === 'Invoer';

    // Select Uitvoerland (if none present)
    if (!vak.find('table td:contains("Uitvoer")').length) {
        vak.find('button:contains("Uitvoerland selecteren")').click();
        selectOptionByValue(vak.find('select#land'), isInvoerDossier ? 'NL' : 'BE');
        setNativeInputValue(vak.find('input#exit').get(0), isInvoerDossier ? 'Hazeldonk' : 'Meer');
        (await waitForElementsOnce('.vl-modal-dialog__buttons button:contains("Opslaan"):enabled')).click();
    }

    // Select Invoerland (if none present)
    if (!vak.find('table td:contains("Invoer")').length) {
        vak.find('button:contains("Invoerland selecteren")').click();
        selectOptionByValue(vak.find('select#land'), isInvoerDossier ? 'BE' : 'NL');
        setNativeInputValue(vak.find('input#entry').get(0), isInvoerDossier ? 'Meer' : 'Hazeldonk');
        (await waitForElementsOnce('.vl-modal-dialog__buttons button:contains("Opslaan"):enabled')).click();
    }

    // Set attachment
    addMockAttachment(vak.find('input#vak15RoutebeschrijvingUpload').get(0));

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}

async function fillInVak16(save = true) {
    const vak = await waitForElementOnceById(vakken[16].id);

    vak.find('label.vl-checkbox').click();

    if (save) {
        vak.find('button[type="submit"]').click();
    }
}
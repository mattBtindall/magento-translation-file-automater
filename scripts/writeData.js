const fs = require('fs')
const keys = require('../keys')
const get = require('./getData')
const filePathMap = {
    DE: 'de_DE.csv',
    FR: 'fr_FR.csv',
    ES: 'es_ES.csv',
    IT: 'it_IT.csv',
    NL: 'nl_NL.csv',
    DK: 'da_DK.csv',
    SE: 'sv_SE.csv',
    NO: 'nb_NO.csv',
    PL: 'pl_PL.csv',
    PT: 'pt_PT.csv',
    FI: 'fi_FI.csv',
    CH_DE: 'de_CH.csv',
    CH_FR: 'ch_FR.csv'
}

/**
 * Concatenates the given translation to the specified file
 * @param {string} translation - magento translation e.g. 'ukWord,translatedWord \n'
 * @param {string} fileName - name of file to write to
 * @param {string} country - country code e.g. ES
 * @return {void}
 */
async function concatToFile(translation, fileName, country) {
    try {
        await fs.promises.appendFile(keys.translationsDir + fileName, translation)
        console.log(`${country}: data appended successfully`)
    } catch (error) {
        console.log(country + ':')
        console.error(error)
    }
}

/**
 * Adds translations to the corresponding files
 * @param {Object} translations - e.g { countryCode: 'translations', countryCode: 'translaltions'... }
 * @return {void}
 */
function addTranslationsToFiles(translations) {
    for (let [countryCode, translation] of Object.entries(translations)) {
        if (filePathMap[countryCode]) {
            concatToFile(translation, filePathMap[countryCode], countryCode)
        }
    }
}

/**
 * adds translations to files from local csv file
 * @param {string} path - file path
 * @return {void}
 */
async function addTranslationsFromLocalFile(path) {
    const translations = await get.readFileFromPath(path)
    addTranslationsToFiles(translations)
}
addTranslationsFromLocalFile('/home/matt/translations.csv')

/**
 * adds translations to files from google sheet
 * @param {string} googleSheetId - id of google sheet
 * @return {void}
 */
async function addTranslationsFromGoogleSheet(googleSheetId) {
    const translations = await get.readFromGoogleSheet(googleSheetId)
    addTranslationsToFiles(translations)
}

module.exports = {
    addTranslationsToFiles
}

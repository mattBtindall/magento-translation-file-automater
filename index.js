const fs = require('fs')
const csv = require('csv-parser')
const axios = require('axios')

const GOOGLE_SHEET_BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/'
const keys = require('./keys')
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
 * Reads local csv file and converts data into POJO
 * @param {string} filePath - path to translation csv file [must be formatted with uk words in first row see readme.md for more details]
 * @returns {promise - object} e.g. { countryCode: 'translations', countryCode: 'translations'... }
 */
function readFileFromPath(filePath) {
    return new Promise((resolve, reject) => {
        const translations = {}
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                let translation = ''
                // first row of data is the country e.g. UK: DE
                const country = data.UK
                delete data.UK
                for (let [ukWord, translatedWord] of Object.entries(data)) {
                    translation += `${ukWord},${translatedWord}\n`
                }
                translations[country] = translation
            })
            .on('end', () => {
                resolve(translations)
            })
            .on('error', (error) => reject(error))
    })
}

/**
 * Reads google sheet and converts data into POJO
 * @param {string} sheetId - google sheet id [sheet must be formatted with uk words in first row see readme.md for more details]
 * @returns {object} e.g. { countryCode: 'translations', countryCode: 'translations'... }
 */
async function readFromGoogleSheet(sheetId) {
    const url = GOOGLE_SHEET_BASE_URL + sheetId + '/values/A1:S40?key=' + keys.googleSheets
    const { data: jsonData } = await axios.get(url, { responseType: 'json'})
    const translations = {}

    // map data to { countryCode: 'translations'}
    const ukRow = jsonData.values.shift() // first row (top of the table) is always the uk
    ukRow.shift()
    jsonData.values.forEach(countryTranslations => {
        const country = countryTranslations.shift() // remove country code from the start
        translation = ''
        ukRow.forEach((ukWord, i) => {
            translation += ukWord + ',' + countryTranslations[i] + '\n'
        })
        translations[country] = translation
    })
    return translations
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

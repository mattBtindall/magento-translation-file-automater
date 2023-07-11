const fs = require('fs')
const csv = require('csv-parser')
const axios = require('axios')

const GOOGLE_SHEET_BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/'
const keys = require('../keys')

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

module.exports = {
    readFileFromPath,
    readFromGoogleSheet
}

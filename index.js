const fs = require('fs')
const csv = require('csv-parser')

/**
 * reads local csv file and converts data into POJO
 * @param {string} filePath - path to translation csv file [must be formatted with uk words in first row see readme.md for more details]
 * @returns {object} e.g. { countryCode: 'translations', countryCode: 'translations'... }
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
readFileFromPath('/home/matt/translations.csv')
    .then(data => console.log(data))
    .catch(err => console.error(err))

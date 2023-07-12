function printUsage() {
    const usageText = `
    imports translations from csv file [either local or remotely from a google sheet] into specified file.

    usage:
        mage-translate <googleSheetId | /path/to/translation/file.csv> </path/to/translations/dir>

        see below for more details:

        googleSheetId:              you can find this in the url of your google sheet e.g. https://docs.google.com/spreadsheets/d/<idIsHere>/edit#gid=0
        pathToLocalTranslation:     the absolute path to the local .csv translations file
        pathToTranslationsDir:      the absolute path to your magento directory that contains the translation files e.g. /home/user/projects/magentoProject/app/design/frontend/Vendor/theme/i18n
        help:                       used to print the usage guide
  `
    console.log(usageText)
}

function printError(err) {
    console.error(err)
    console.log('For information on how to run the application please use `mage-translate help`')
}

module.exports = {
    printUsage,
    printError
}
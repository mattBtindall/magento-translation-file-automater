const fs = require('fs')
const output = require('./output')

function checkInputs(args) {
    // errors on input arg length
    switch (args.length) {
        case 2:
            output.printUsage()
            return
        case 3:
            args[2] === 'help' ? output.printUsage() : output.printError('Not enough arguments specified')
            return
        case 4:
            break
        default:
            output.printError('Too many arguments')
            return
    }
    return true
}

// works both for files and just dirs
async function isCorrectPath(path) {
    try {
        await fs.promises.access(path)
        return true
    } catch (err) {
        return false
    }
}

module.exports = {
    checkInputs,
    isCorrectPath
}
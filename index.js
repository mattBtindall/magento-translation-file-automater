#!/usr/bin/env node

const write = require('./scripts/writeData')
const output = require('./scripts/output')
const args = process.argv
const validate = require('./scripts/validation')

async function main()
{
    if (!validate.checkInputs(args)) {
        return
    }

    // if made it this far then two arguments have been passed
    const arg1 = args[2]
    const arg2 = args[3]
    const isArg1Path = await validate.isCorrectPath(arg1)
    const isArg2Path = await validate.isCorrectPath(arg2)

    if (!isArg2Path) {
        output.printError('The second parameter must be a diriectory on your machine')
        return
    }

    isArg1Path ? write.addTranslationsFromLocalFile(arg1, arg2) : write.addTranslationsFromGoogleSheet(arg1, arg2)
}
main()

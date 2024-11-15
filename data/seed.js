const { faker } = require('@faker-js/faker')
const fs = require('fs')

const args = process.argv.slice(2)
const DEFAULT_NUM = 10
const FILE_NAME = "Account_Data.csv"

const headers = [
    'accountName', 'accountNumber', 'amount', 'firstName', 'email'
]

/**
 * Parses an array of command-line arguments and returns the value associated with the given key.
 * The key is expected to be in the format `--key=value`.
 *
 * @param {Array<string>} args - An array of command-line arguments (e.g., `process.argv`).
 * @param {string} key - The key whose value needs to be extracted.
 * @returns {string | undefined} - The value associated with the given key, or `undefined` if the key is not found.
 */
const parseArgs = (args, key) => {
    const prefix = `--${key}=`;
    const result = args.find(value => value.startsWith(prefix));
    return result ? result.slice(prefix.length) : undefined;
}

/**
 * Creates the file content from the given headers and data, using the specified delimiter.
 * By default, the delimiter is a comma (`,`).
 * 
 *
 * @param {Array<string>} headers - An array of column headers.
 * @param {Array<Object>} data - An array of objects representing rows of data.
 * @param {string} [delimiter=','] - The delimiter used to separate values in the file. Defaults to ','.
 * 
 * @returns {Object} A object with header and data
 * @property {string} header - A string with delimited headers
 * @property {string} data - A string with delimited records
 */
const createFileContent = (headers, data, delimiter=",") => {
    const headerString = headers.join(delimiter) + "\n"
    const rows = data.map(
        row => headers.map(header => JSON.stringify(row[header] || "")).join(delimiter)
    ).join("\n")
    return {
        header: headerString,
        data: rows
    }
}

/**
 * 
 * @param {Object} fileData 
 * @param {string} filepath 
 */
const writeFile = (fileData, filepath) => {

}


const execute = () => {
    try {
        const numOfRecords = parseInt(parseArgs(args, "size")) | DEFAULT_NUM
        const records = Array.from({ length: numOfRecords }, createRecord)
        createFileContent(headers, records)
    } catch (error) {
        console.error("Error occured ::", error)
    }
}

/**
 * Generates a random record containing account and personal details.
 *
 * @function createRecord
 * @returns {Object} A record with the following properties:
 * @property {string} accountName - The name of the account, generated randomly.
 * @property {string} accountNumber - The account number, generated randomly.
 * @property {string} amount - A random financial amount.
 * @property {string} firstName - A random first name.
 * @property {string} email - A randomly generated email address associated with the first name.
 */
const createRecord = () => {
    const accountName = faker.finance.accountName()
    const accountNumber = faker.finance.accountNumber()
    const amount = faker.finance.amount()
    const firstName = faker.person.firstName()
    const email = faker.internet.email({ firstName: firstName })

    return {
        "accountName": accountName,
        "accountNumber": accountNumber,
        "amount": amount,
        "firstName": firstName,
        "email": email
    }
}



execute()
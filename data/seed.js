const { faker } = require('@faker-js/faker')
const fs = require('fs')
const path = require('path')
const { fileURLToPath } = require('url')

const args = process.argv.slice(2)

const DEFAULT_NUM = 10
const OUTPUT_FILE_PATH = __dirname 
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
const createFileContent = (headers, data, delimiter = ",") => {
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
 * Writes the file to filesystem given the file data and file path
 * @param {Object} fileData 
 * @param {string} filepath
 * 
 * @returns {bool} Status of file writing 
 */
const writeFile = (fileData, filepath) => {
    try {
        let dataToWrite = "";
        Object.values(fileData).forEach((value, idx) => {
            dataToWrite += value
        })
        fs.writeFileSync(filepath, dataToWrite)
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}


/**
 * Modifies a filename by appending or incrementing a number before the file extension.
 * 
 * - If the filename already ends with a number (e.g., `file123.txt`), the function increments that number (e.g., `file124.txt`).
 * - If the filename does not have a number before the extension (e.g., `example.txt`), the function appends `1` before the extension (e.g., `example1.txt`).
 * 
 * @param {string} filename - The original filename (must include an extension).
 * @returns {string} - The modified filename with an incremented or appended number.
 * @throws {Error} - Throws an error if the filename does not contain an extension.
 * 
 */
const modifyFilename = (filename) => {
    const dotIndex = filename.lastIndexOf('.');
    if (dotIndex === -1) {
        throw new Error("The provided filename does not have an extension.");
    }
    const name = filename.substring(0, dotIndex);
    const extension = filename.substring(dotIndex);

    // Match a number at the end of the name
    const match = name.match(/(.*?)(\d+)$/);

    if (match) {
        // Increment the number if it exists
        const baseName = match[1];
        const number = parseInt(match[2], 10) + 1;
        return `${baseName}${number}${extension}`;
    } else {
        // Append "1" if no number is found
        return `${name}1${extension}`;
    }
}


/**
 * Recursively checks if a file path exists, and generates a unique file path 
 * by modifying the filename until a non-existing file path is found.
 *
 * @param {string} filepath - The initial file path to check and modify.
 * @throws {TypeError} - Throws an error if the input filepath is not a string.
 * @returns {string} - A unique file path that does not already exist.
 */
const createFilePath = (filepath) => {
    if (typeof filepath !== 'string') {
        throw new TypeError('The filepath must be a string.');
    }
    if(fs.existsSync(filepath)){
        const newFileName = modifyFilename(filepath)
        return createFilePath(newFileName)
    }
    return filepath
};

/**
 * Entry point of this script, executing this generates the specified number of
 * records and a file.
 * It parses command-line arguments to determine the number of records, uses
 * the default value if the argument is not provided.
 * 
 * @function execute
 * @throws {Error} Throw an error if there is an issue in records creation or 
 * file generation
 */
const execute = () => {
    try {
        const size = parseArgs(args, "size")
        const numOfRecords = parseInt(size) ? size : DEFAULT_NUM
        const records = Array.from({ length: numOfRecords }, createRecord)
        const fileData = createFileContent(headers, records)
        const fileName = createFilePath(path.join(OUTPUT_FILE_PATH, FILE_NAME))
        writeFile(fileData, fileName)
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
const { Readable } = require('node:stream')
const csvParser = require('csv-parser')

const results = []

/**
 * Converts a csv data object to JSON
 * @param {Buffer} fileBuffer 
 * @returns {Promise}
 */
const convertToJson = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const readable = Readable.from(fileBuffer)
        readable.pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error))
    })
}

module.exports = convertToJson;
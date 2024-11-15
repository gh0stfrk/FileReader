const convertToJson = require('./methods/convertToJson')

/**
 * Reads a csv file and converts it into a json object
 */
class FileProcessor {
    async process(dataObject, options) {
        try {
            const jsonData = await convertToJson(dataObject, options)
            if(jsonData.length() < 1){
                console.log('No Data Skipping')
            }
            return jsonData

        } catch (exception) {
            console.log(`FileProcessor Failed ::: `, exception)
        }
    }
}


module.exports = FileProcessor;
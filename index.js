const fs = require('fs')
const CSVFileProcessor = require('./api/FileProcessor')


const csvFile = fs.readFileSync('files/sample_data.csv')
const options = {
    
}
// console.log(csvFile)

const FileProcessor = new CSVFileProcessor()
const jsonObject = FileProcessor.process(csvFile)
    .then((data) => console.log(data))


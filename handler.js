'use strict'

const util = require('util')
const AWS = require('aws-sdk')
const Fixy = require('fixy')
const Papa = require('papaparse')
const fixySchema = require('./schema.js')

const s3 = new AWS.S3()

module.exports.processCSV = async (event, context) => {
  const csvBucket = event.Records[0].s3.bucket.name
  const csvKey = event.Records[0].s3.object.key
  const fixedWidthBucket = process.env.FIXED_WIDTH_BUCKET
  const fixedWidthKey = csvKey.replace('.csv', '.txt')

  try {
    // Load the csv file from the csv bucket
    const response = await s3
      .getObject({ Bucket: csvBucket, Key: csvKey })
      .promise() // `.promise()` is unconventional and specific to aws-sdk

    /*
     * Transformations begin
     */
    const csvString = response.Body.toString()
    const parsedData = Papa.parse(csvString).data
    const headers = parsedData.shift()

    // Description: Converts a papaparse row, which is an array of values,
    // into a keyed object with the values mapped to the corresponding header
    // Note: Consider refactoring from a for loop to a lodash zipper function
    // Sample row: ['Josh', 'Stevens', 'josh@gmail.com', '123-456-7890']
    // Sample headers: ['First', 'Last', 'Email', 'Phone']
    // Return: { First: 'Josh', Last: 'Stevens', Email: 'josh@gmail.com', Phone: '123-456-7890' }
    const mappingFunc = row => {
      let dataObj = {}
      for (let i = 0; i < headers.length; i++) {
        dataObj[headers[i]] = row[i]
      }
      return dataObj
    }

    const fixyData = parsedData.map(mappingFunc)
    const fixedWidthString = Fixy.unparse(fixySchema, fixyData)
    /*
     * Transformations end
     */

    // Save the fixed width file to the fixed width bucket
    await s3
      .putObject({
        Bucket: fixedWidthBucket,
        Key: fixedWidthKey,
        Body: fixedWidthString
      })
      .promise()
  } catch (error) {
    console.error(error)
  }
}

'use strict'

const util = require('util')
const AWS = require('aws-sdk')

const s3 = new AWS.S3()

module.exports.processCSV = async (event, context) => {
  const csvBucket = event.Records[0].s3.bucket.name
  const csvKey = event.Records[0].s3.object.key
  const areBucket = process.env.ARE_BUCKET
  const areKey = csvKey.replace('.csv', '.are')

  try {
    // Load the csv file from the csv bucket
    const response = await s3
      .getObject({ Bucket: csvBucket, Key: csvKey })
      .promise() // unconventional and specific to aws-sdk
    const csvString = response.Body.toString()

    /*
     ** Perform transformations here
     */

    // Save the flat file to the are bucket
    await s3
      .putObject({ Bucket: areBucket, Key: areKey, Body: csvString })
      .promise() // unconventional and specific to aws-sdk
  } catch (error) {
    console.error(error)
  }
}

// if (process.env.NODE_ENV === 'dev') {
//   require('dotenv').config()
//   AWS.config.update({ accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY })
// }

### Serverless Lambda S3 Demonstration

This project demonstrates how the [Serverless Framework](https://serverless.com/) can be used to deploy a NodeJS Lambda function that responds to events in an S3 bucket.

In our demonstration, the Lambda function responds to `.csv` files uploaded to an S3 bucket, transforms the data to a fixed width format, and writes the data to a `.txt` file in an output bucket.

##### sampleInputData.csv

```
First,Last,Email,Phone
John,Munson,john.munson@gmail.com,343-231-3893
Ed,Karisch,edward.karisch@gmail.com,680-236-1187
Josh,Stevens,josh.stevens@gmail.com,851-990-4343
```

##### sampleOutputData.txt

```
John                Munson              john.munson@gmail.com                             343-231-3893
Ed                  Karisch             edward.karisch@gmail.com                          680-236-1187
Josh                Stevens             josh.stevens@gmail.com                            851-990-4343
```

### Getting Started

You will need to have the Serverless Framework installed globally with `npm install -g serverless`. In addition, you will need to [configure](https://serverless.com/framework/docs/providers/aws/guide/credentials/) Serverless Framework with your AWS credententials.

Next, go ahead and clone the project and install package dependencies.

- `git clone https://github.com/johncmunson/serverless-lambda-s3`
- `cd serverless-lambda-s3`
- `yarn` or `npm install`

Because the `serverless.yml` file is configured to provision any AWS resources that the Lambda function is dependent on, and because S3 bucket names must be globally unique, you will need to change `CSV-BUCKET-NAME-CHANGE-ME` and `FIXED-WIDTH-BUCKET-NAME-CHANGE-ME` in `serverless.yml` to something that is meaningful but still unique.

At this point, the only thing left to do is deploy our function!

`serverless deploy -v`

### Testing it out

If everything went according to plan, you should be able to login to the AWS S3 console and upload a `.csv` file to the input bucket. It will need to match the schema that `schema.js` is expecting. Feel free to use the `sampleData.csv` file provided with this repo.

The deployed Lambda function will be triggered and should generate a fixed width file that gets saved in the output bucket. Whether the function succeeded or failed, there should be some sort of output in AWS Cloudwatch.

### Cleaning Up

If you were just playing around with this project as a learning exercise, you may want to perform a bit of cleanup when you're all finished.

- Uninstall Serverless Framework: `npm uninstall -g serverless`
- Delete the local repository: `rm -rf serverless-lambda-s3`
- Cleanup AWS resources by deleting the Cloudformation stack

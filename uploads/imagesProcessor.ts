const { v4: uuidv4 } = require('uuid')
let uuid = uuidv4()

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk')

// set S3 vars
const ID = process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID
const SECRET = process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
const REGION = process.env.NEXT_PUBLIC_S3_REGION
const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
})

// main function to initiate the process of uploading an image/file to aws s3.

export const imagesProcessor = async (files: any) => {
  // const fileContent = fs.readFileSync(files);
  let imagesOut: any = []

  await Promise.all(
    files.map(async (file: any, i: any) => {
      let params = {
        Bucket: BUCKET_NAME,
        Key: `${uuid} ${file.name}`, // File name you want to save as in S3
        Body: file,
        ACL: 'public-read', // makes image public. parent folder must have public read permissions.
      }

      // Uploading files to the bucket
      const result = await s3.upload(params).promise()
      imagesOut.push(result.Location)
    }),
  )

  return imagesOut
}

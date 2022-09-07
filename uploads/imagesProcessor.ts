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

//
//
//
//

// TAKE AN ARRAY OF IMAGES
// LOOP EACH TO S3 BUCKET
// STORE RETURNED URLS(KEYS) IN ARRAY
// SEND API REQUEST TO VERYFI (LOOPED FROM ARRAY)
// LOOP THROUGH URL ARRAY AND DELETE FILES FROM THE BUCK (whether pass/fail)
// STORE VERIFY RESULTS IN ARRAY STATE

// main function to initiate the process of uploading an image/file to aws s3.
export const imagesProcessor = async (files: any) => {
  let imagesOut: any = []

  // const fileContent = fs.readFileSync(files);

  for (let i = 0; i < files.length; i++) {
    // Setting up S3 upload parameters

    let base64data = Buffer.from(files[i], 'binary');

    let params = {
      Bucket: BUCKET_NAME,
      Key: [i] + '.jpg', // File name you want to save as in S3
      Body: base64data,
      ACL: 'public-read', // makes image public. parent folder must have public read permissions.
    }

    // Uploading files to the bucket
    const returnedimgURL = await s3.upload(params, function (
      err: any,
      data: any,
    ) {
      if (err) {
        throw err
      }
      // Push to array....
      return data.location
      // the url file is located at data.Location
    })

    imagesOut.push(returnedimgURL)
  }

  return imagesOut
}

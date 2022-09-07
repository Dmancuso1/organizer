const fs = require('fs');

const { v4: uuidv4 } = require('uuid');
let uuid = uuidv4();

// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");

// set S3 vars
const ID = process.env.S3_ACCESS_KEY_ID;
const SECRET = process.env.S3_SECRET_ACCESS_KEY;
const REGION = process.env.S3_REGION;
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});



// main function to initiate the process of uploading an image/file to aws s3.
export const S3Uploader = (file:any) => {
  // Read content from the file
  const fileContent = fs.readFileSync(file);

  // Setting up S3 upload parameters
  const params = {
      Bucket: BUCKET_NAME,
      Key: `${uuid}-ross.jpeg`, // File name you want to save as in S3
      Body: fileContent,
      ACL:'public-read', // makes image public. parent folder must have public read permissions.
  };

  // Uploading files to the bucket
  s3.upload(params, function(err:any, data:any) {
      if (err) {
          throw err;
      }
      console.log('File uploaded successfully', data);
      // the url file is located at data.Location
  });
};












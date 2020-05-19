// Configure Enviroment variables
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  awsS3BucketApiVersion: process.env.AWS_SDK_API_VERSION, 
  awsS3BucketName: process.env.AWS_BUCKET_NAME,
  awsS3BucketAccessKeyId: process.env.AWS_ACCESS_KEY,
  awsS3BucketSecretAccessKey: process.env.AWS_ACCESS_SECRET,
  useProxy:process.env.USE_PROXY
};
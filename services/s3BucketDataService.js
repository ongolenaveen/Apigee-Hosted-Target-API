const AWS = require('aws-sdk');
const proxy = require('proxy-agent');
const config = require('../config');

const options = {
    apiVersion: config.awsS3BucketApiVersion,
    accessKeyId: config.awsS3BucketAccessKeyId,
    secretAccessKey: config.awsS3BucketSecretAccessKey,
    region: config.awsS3BucketRegion
};

// Load the Configuration 
//AWS.config.loadFromPath('./config.json');

// Set the proxy
if (config.useProxy =='true'){
    AWS.config.update({
        httpOptions: { agent: proxy('http://yourproxy:8000') }
    });
};

/**
 * @desc Creates S3 Bucket, if it does not exists
 * @param bucketName - Bucket Name
 * @return object - response received from AWS
 */
exports.createBucketIfNotExists = async function createBucketIfNotExists(bucketName) {

    // Create S3 service object
    let listBucketsPromise = new AWS.S3(options)
        .listBuckets()
        .promise();

    // Get the list of existing buckets
    let bucketsList = await listBucketsPromise.then(list => {
        console.log(`Successfully retrieved buckets list from AWS. response: ${JSON.stringify(list)}`);
        return list;
    });

    // If there are buckets in the list
    if (bucketsList && bucketsList.Buckets) {
        console.log(`Buckets found in AWS`);
        // Find whether received bucket is already there in list 
        let found = bucketsList.Buckets.find(b => {
            return b.Name.toLowerCase() == bucketName.toLowerCase();
        });

        // If the received bucket is not there in existing bucket list, then create new One
        if (!found) {
            return createBucket(bucketName).then(bucket => {
                return bucket;
            });
        }
    }
    else {
        // If theare no existing buckets then create new One
        return createBucket(bucketName).then(bucket => {
            return bucket;
        });
    }
}

/**
 * @desc Creates S3 Bucket
 * @param bucketName - Bucket Name
 * @return object - response received from AWS
 */
async function createBucket(bucketName) {
    // create parameters needed
    let params = {
        Bucket: bucketName
    };

    // create bucket as promise
    let newBucketPromise = new AWS.S3(options).createBucket(params).promise();

    // return the promise
    return newBucketPromise.then(bucket => {
        console.log(`Created bucket with name ${bucketName} sucessfully`);
        return (bucket);
    });
};

/**
 * @desc Creates Object in S3 Bucket
 * @param bucketName - Bucket Name
 * @param key - key of the object in bucket
 * @param content - content of the object which needs to be placed in the bucket
 * @return object - response received from AWS
 */
exports.upsertObject = async function upsertObject(bucketName, key, content) {

    // create parameters needed
    let params = {
        Body: content,
        Bucket: bucketName,
        Key: key,
        ContentType: "application/json"
    };

    // upsert object into bucket as promise
    let upsertObjectPromise = new AWS.S3(options).putObject(params).promise();

    // return the promise
    return upsertObjectPromise.then(object => {
        console.log(`object upserted into bucket ${bucketName} sucessfully`);
        return (object);
    });
};

/**
 * @desc Read Object from S3 Bucket
 * @param bucketName - Bucket Name
 * @param key - key of the object in bucket
 * @return object - response received from AWS
 */
exports.readObject = async function readObject(bucketName, key) {
    console.log(`Reading AWS s3 Bucket ${bucketName} with key ${key}`);
    // create parameters needed
    let params = {
        Bucket: bucketName,
        Key: key,
        ResponseContentType: "application/json"
    };

    // read object from bucket as promise
    let readObjectPromise = new AWS.S3(options).getObject(params).promise();

    return readObjectPromise.then(object => {
        let json = JSON.parse(new Buffer(object.Body).toString("utf8"));
        return (json);
    });
};

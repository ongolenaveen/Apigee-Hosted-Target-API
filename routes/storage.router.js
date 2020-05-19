const s3BucketDataService = require("../services/s3BucketDataService");
const config = require("../config");
const express = require('express');
const router = express.Router();

/**
 * @desc Storage router
 * @param req - Request
 * @param res - Response
 * @Param next - Next Middleware Handler
 * @return object - Json Response
 */
router.get("/:key",async (req, res, next) => {
    let key = req.params.key
    let bucketName = config.awsS3BucketName;
    // Append .json as suffix.
    let appendedKey = `${key}.json`;

    // Read the file from AWS S3 Bucket 
    s3BucketDataService.readObject(bucketName,appendedKey)
    .then((data) => {
        // Success Response
        res.json(data);
    })
    .catch((error)=>{
        // Error While getting file from AWS S3 Bucket
        next(error);
    });
});

module.exports = router;
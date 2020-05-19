const express = require('express');
const router = express.Router();

/**
 * @desc Health check router
 * @param req - Request
 * @param res - Response
 * @Param next - Next Middleware Handler
 * @return object - Json Response
 */
router.get("/",(req, res, next) =>{
    res.json({
        hello: "Hi Naveen!"
    })
});

module.exports = router;
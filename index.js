var express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = express.Router();
const healthCheckController = require("./routes/healthcheck.router");
const storageController =  require("./routes/storage.router");

var app = express();

// Use Media Formatters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Register Routes and Route Handlers
app.use('/', healthCheckController);
app.use('/storage', storageController);

// Start the server
var server = app.listen(process.env.PORT || 9000, function() {
    console.log('Listening on port %d', server.address().port)
})

// Route not found Handler
app.use(function (req, res, next) {
    res.status(404).json({
        message:"End point not found"
    });
  });
  
// Exception Handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});


var express = require('express'),
    app     = express(),
    port    =  8080,
    bodyParser = require('body-parser'),
    http = require("http"),
    request = require("request"),
    rp = require("request-promise"),
    morgan = require("morgan");
    
// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
//     res.header('Access-Control-Allow-Methods', 'GET,POST');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// 
//     next();
// }    

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(express.static(__dirname + '/public'));
app.use('/assets', express.static(__dirname + '/assets/'));
app.use('/app', express.static(__dirname + '/app/'));


// app.use(allowCrossDomain);


require('./routes.js')(app, rp)

app.listen(port);


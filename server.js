var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    http = require("http"),
    request = require("request"),
    rp = require("request-promise"),
    morgan = require("morgan"),
    cla = require("command-line-args");
    
// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
//     res.header('Access-Control-Allow-Methods', 'GET,POST');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// 
//     next();
// }    

//app.use(bodyParser.json());

var cli = cla([
    { name: 'webport', alias: 'p', type: Number, defaultValue: 8080 },
    { name: 'rpcport', alias: 'r', type: Number, defaultValue: 9091 },
    { name: 'rpcurl' , alias: 'l', type: String, defaultValue: "http://localhost" }
])

var options = cli.parse();

app.use(bodyParser.urlencoded({limit: '5mb'}));
app.use(bodyParser.json({limit: '5mb'}))

//app.use(morgan('combined'));
app.use(express.static(__dirname + '/public'));
app.use('/assets', express.static(__dirname + '/assets/'));
app.use('/app', express.static(__dirname + '/app/'));


// app.use(allowCrossDomain);


require('./routes.js')(app, rp, options)

app.listen(options.port);


var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var morgan = require('morgan');
var routers = require('./routes.js');
var config = require('./config');
var mongoose = require('mongoose');
mongoose.connect(config.db);

app.use( bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(morgan('combined'));
app.use('/', routers);

app.listen(config.port, function () {
  console.log('Climax listening on port 3000!');
});


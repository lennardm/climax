var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var morgan = require('morgan');
var routers = require('./routes.js');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/climax');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

app.use( bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(morgan('combined'));
app.use('/', routers);

function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
}

app.use(errorHandler);


app.listen(3000, function () {
  console.log('Climax listening on port 3000!');
});


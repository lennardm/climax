var models = require('../models/');
var mongoose = require('mongoose');
var DailyData = mongoose.model('DailyData');

exports.getAll = function(req, res) {
    var query = {};
    if (req.query.station) {
        query.station = req.query.station;
    }

    DailyData.find(query, function(err, dds) {
        if(err) {
            return console.log(err);
        }
        res.send(JSON.stringify(dds));

    });
};

exports.deleteAll = function(req, res) {
    DailyData.remove({}, function(err, remove) {
        if(err) {
            return console.log(err);
        }
        res.sendStatus(204);
    });
};
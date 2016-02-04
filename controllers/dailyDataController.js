var models = require('../models/');
var mongoose = require('mongoose');
var DailyData = mongoose.model('DailyData');

exports.getAll = function(req, res) {
    DailyData.find({}, function(err, dds) {
        if(err) {
            return console.log(err);
        }
        res.send(JSON.stringify(dds));

    });
}

exports.deleteAll = function(req, res) {
    DailyData.remove({}, function(err, remove) {
        if(err) {
            return console.log(err);
        }
        res.sendStatus(204);
    });
}
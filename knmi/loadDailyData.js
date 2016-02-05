var config = require('../config');
var models = require('../models/');
var async = require('async');
var mongoose = require('mongoose');
mongoose.connect(config.dbConnectionString);
var knmiConnector = require('./library');
var Station = mongoose.model('Station');

var dailyData = function() {
    Station.find({}, function(err, stations) {
        async.each(stations, function(item, callback) {
            knmiConnector.retrieve(item._id, item.externalId, function(results) {
                async.each(results, function(item, callback) {
                    item.save(function(err) {
                        callback()
                    })
                }, function(err) {
                    callback()
                })
            })
        }, function(err){
            if(err) {
                return console.log(err);
            }
            console.log('Done');
            process.exit();
        });
    });
};

dailyData();

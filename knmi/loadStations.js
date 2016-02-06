var config = require('../config');
var models = require('../models/');
var async = require('async');
var fs = require('fs');
var parse = require('csv-parse');
var mongoose = require('mongoose');
mongoose.connect(config.db);
var Station = mongoose.model('Station');
var argv = require('yargs').argv;

loadStations = function(file) {
    fs.readFile(file, 'utf8', function(err, data) {
        parse(data, {columns: true}, function(err, parsedResponse){
            async.each(parsedResponse, function(item, callback) {
                var station = new Station;
                station.externalId = item.externalId;
                station.name = item.name;
                station.latitude = item.latitude;
                station.longitude = item.longitude;
                station.altitude = item.altitude;
                station.save(function(err, station) {
                    callback();
                });
            }, function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log('Loaded ' + parsedResponse.length + ' stations');
                process.exit();
            });
        });
    });
};

if(!argv.file) {
    console.log('You must provide a filename');
    process.exit();
} else if (argv.purge) {
    Station.remove({}, function(err, removed) {
       loadStations(argv.file);
    });
} else {
    loadStations(argv.file);
}


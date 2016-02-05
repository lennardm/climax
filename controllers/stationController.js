var models = require('../models/');
var mongoose = require('mongoose');
var async = require('async');
var knmiConnector = require('../knmi/library');
var fs = require('fs');
var parse = require('csv-parse');
var Station = mongoose.model('Station');
var DailyData = mongoose.model('DailyData');

exports.getAll = function(req, res) {
    Station.find({}, function(err, stations) {
        if(err) {
            return res.sendStatus(500);
        }
        res.send(JSON.stringify(stations));
    });
};

exports.getById = function(req, res) {
    Station.findById(req.params.id, function(err, station) {
        if(err) {
            return res.sendStatus(500);
        }
        res.send(JSON.stringify(station));
    });
};

exports.create = function(req, res) {
    var station = new Station;
    setProperties(station, req, function(station) {
        station.save(function(err) {
            if(err) {
                return res.sendStatus(500);
            }
            res.send(JSON.stringify(station));
        });
    });
};

exports.update = function(req, res) {
    Station.findById(req.params.id, function(err, station) {
        setAttributes(station, req, function(station) {
            station.save(function(err) {
                if(err) {
                    return res.sendStatus(500)
                }
                res.send(JSON.stringify(station));
            });
        });
    });
};

exports.delete = function(req, res) {
    Station.findById(req.params.id, function(err, station) {
        station.remove(function(err) {
            if(err) {
                return res.sendStatus(500);
            }
            res.send(204);
        })
    });
};

exports.deleteAll = function(req, res) {
    Station.remove({}, function(err, removed) {
        if(err) {
            return res.sendStatus(500);
        }
        res.sendStatus(204);
    });
};

var setProperties = function(station, req, callback) {
    station.externalId = req.body.externalId;
    station.name = req.body.name;
    station.latitude = req.body.latitude;
    station.longitude = req.body.longitude;
};

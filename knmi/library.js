var config = require('../config');
var models = require('../models/');
var http = require('http');
var querystring = require('querystring');
var mongoose = require('mongoose');
var parse = require('csv-parse');
var async = require('async');
var Station = mongoose.model('Station');
var DailyData = mongoose.model('DailyData');

exports.retrieve = function(station, purge, callback) {
    async.waterfall([
        function(callback) {
            if (purge) {
                DailyData.remove({}, function(err, removed) {
                    callback();
                });
            } else {
                callback();
            }
        },
        function(callback) {
            setKnmiParameters(station, purge, function(err, knmiParameters) {
                callback(err, knmiParameters);
            });
        },
        function(knmiParameters, callback) {
            setPostData(knmiParameters, function(err, postData) {
                callback(err, postData);
            });
        },
        function(postData, callback) {
            setOptions(postData, function(err, options) {
                callback(err, options, postData);
            });
        },
        function(options, postData, callback) {
            performHttpRequest(options, postData, function(err, response) {
                callback(err, response)
            });
        },
        function(response, callback) {
            parseResponse(response, columns, function(err, parsedResponse) {
                callback(err, parsedResponse);
            });
        },
        function(parsedResponse, callback) {
            convertParsedResponse(parsedResponse, station, function(err, convertedParsedResponse) {
                callback(err, convertedParsedResponse);
            });
        }
    ], function (err, result) {
        if(err) {
            callback(err);
        } else {
            callback(result);
        }
    });
};

var setKnmiParameters = function(station, purge, callback) {
    var endDate = new Date();
    var knmiParameters = {
        'station': station.externalId,
        'variables': config.dailyData.vars,
        'beginDate': {
            'year': config.dailyData.beginYear,
            'month': config.dailyData.beginMonth,
            'day': config.dailyData.beginDay,
        },
        'endDate': {
            'year': endDate.getFullYear(),
            'month': endDate.getMonth() + 1,
            'day': endDate.getDay()
        }
    };

    if (purge) {
        callback(null, knmiParameters);
    } else {
        DailyData.latestOfStation(station, function(err, latest) {
            if (latest) {
                knmiParameters.beginDate.year = latest.date.getFullYear();
                knmiParameters.beginDate.month = latest.date.getMonth() + 1;
                knmiParameters.beginDate.day = latest.date.getDay();
            }
            callback(null, knmiParameters);
        });
    };
};

var setPostData = function(knmiParameters, callback) {
    var postData = querystring.stringify({
        'stns': knmiParameters.station,
        'vars': knmiParameters.variables,
        'byear': knmiParameters.beginDate.year,
        'bmonth': knmiParameters.beginDate.month,
        'bday': knmiParameters.beginDate.day,
        'eyear': knmiParameters.endDate.year,
        'emonth': knmiParameters.endDate.month,
        'eday': knmiParameters.endDate.day
    });
    callback(null, postData);
};

var setOptions = function(postData, callback) {
    var options = {
        host: 'projects.knmi.nl',
        port: 80,
        path: '/klimatologie/daggegevens/getdata_dag.cgi',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };
    callback(null, options);
};

var performHttpRequest = function(options, postData, callback) {
    var response = [];
    var postReq = http.request(options, function(resp) {
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            response.push(chunk);
        });

        resp.on('end', function () {
            callback(null, response.join());
        });
    });
    postReq.write(postData);
    postReq.end();
};

var columns = ['STN','YYYYMMDD','TG','TN','TNH','TX','TXH','T10N','T10NH','SQ','SP','Q'];

var parseResponse = function(response, columns, callback) {
    parse(response, {comment: '#', trim: true, columns: columns}, function(err, parsedResponse) {
        callback(null, parsedResponse);
    });
};

var convertParsedResponse = function(parsedResponse, stationId, callback) {
    var convertedParsedResponse = [];
    async.each(parsedResponse, function(item, callback) {
        convertItem(item, stationId, function(err, convertedItem) {
            convertedParsedResponse.push(convertedItem);
            callback();
        });
    }, function(err) {
        callback(null, convertedParsedResponse);
    });
};

var convertItem = function(item, station, callback) {
    var dd = new DailyData;
    dd.station = station._id;
    dd.date = new Date(item.YYYYMMDD.substr(0,4) + '-' + item.YYYYMMDD.substr(4,2) + '-' + item.YYYYMMDD.substr(6,2));
    dd.averageTemperature = item.TG / 10;
    dd.minimumTemperature = item.TN / 10;
    dd.minimumTemperatureHour = item.TNH;
    dd.maximumTemperature = item.TX / 10;
    dd.maximumTemperatureHour = item.TXH;
    dd.sunshineDuration = item.SQ;
    dd.percentageOfMaximumPotentialSunshineDuration = item.SP;
    dd.globalRadiation = item.Q;
    callback(null, dd);
};

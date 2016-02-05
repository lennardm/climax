var models = require('../models/');
var http = require('http');
var querystring = require('querystring');
var mongoose = require('mongoose');
var parse = require('csv-parse');
var async = require('async');
var Station = mongoose.model('Station');
var DailyData = mongoose.model('DailyData');

exports.retrieve = function(stationLocalId, stationExternalId, callback) {
    async.waterfall([
        function(callback) {
            setPostData(stationExternalId, function(err, postData) {
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
            convertParsedResponse(parsedResponse, stationLocalId, function(err, convertedParsedResponse) {
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

var setPostData = function(stationExternalId, callback) {
    var postData = querystring.stringify({
        'stns': stationExternalId,
        'vars': 'TEMP:SUNR',
        'byear': '2016',
        'bmonth': '1',
        'bday': '20',
        'eyear': '2016',
        'emonth': '1',
        'eday': '29'
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

var columns = ['STN','YYYYMMDD','TG','TN','TNH','TX','TXH','T10N','T10NH','SQ','SP','Q'];

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

var parseResponse = function(response, columns, callback) {
    parse(response, {comment: '#', trim: true, columns: columns}, function(err, parsedResponse){
        callback(null, parsedResponse);
    });
};

var convertParsedResponse = function(parsedResponse, stationId, callback) {
    var convertedParsedResponse = [];
    async.each(parsedResponse, function(item, callback) {
        convertItem(item, stationId, function(err, convertedItem) {
            convertedParsedResponse.push(convertedItem);
            callback();
        })
    }, function(err){
        callback(null, convertedParsedResponse);
    });
};

var convertItem = function(item, stationId, callback) {
    var dd = new DailyData;
    dd.station = stationId;
    dd.date = new Date(item.YYYYMMDD.substr(0,4) + '-' + item.YYYYMMDD.substr(4,2) + '-' + item.YYYYMMDD.substr(6,2));
    dd.averageTemperature = item.TG;
    dd.minimumTemperature = item.TN;
    dd.minimumTemperatureHour = item.TNH;
    dd.maximumTemperature = item.TX;
    dd.maximumTemperatureHour = item.TXH;
    dd.sunshineDuration = item.SQ;
    dd.percentageOfMaximumPotentialSunshineDuration = item.SP;
    dd.globalRadiation = item.Q;
    callback(null, dd);
};


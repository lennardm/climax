var config = require('./config');
var models = require('./models/');
var mongoose = require('mongoose');
var Station = mongoose.model('Station');
var DailyData = mongoose.model('DailyData');

/**
 * Finds the weather station closest to a location.
 *
 * @param location An object with latitude and longitude properties
 * @param callback
 */
exports.closest = function(location, callback) {
        Station.find({}, function(err, stations) {
        var distance = getDistance(location, stations[0]);
        var closest = stations[0];
        closest.distance = distance;
        for (var i = 1; i < stations.length; i++) {
            var distance = getDistance(location, stations[i]);
            if (distance < closest.distance) {
                closest = stations[i];
                closest.distance = distance
            }
        }
        callback(null, closest);
    });
};

if(typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}

/**
 * Calculates the distance between two locations with a latitude and longitude.
 *
 * @param location1
 * @param location2
 * @param decimals
 * @returns {number}
 */
var getDistance = function(location1, location2, decimals) {
    decimals = decimals || 2;
    var earthRadius = 6371; // km
    lat1 = parseFloat(location1.latitude);
    lat2 = parseFloat(location2.latitude);
    lon1 = parseFloat(location1.longitude);
    lon2 = parseFloat(location2.longitude);

    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = earthRadius * c;
    return Math.round(d * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Calculates degree days of a temperature.
 *
 * @param temperature
 * @returns {number}
 */
exports.getDegreeDays = function(temperature) {
    if (temperature >= config.degreeDaysBaseTemperature) {
        return 0;
    } else {
        return Math.round((config.degreeDaysBaseTemperature - temperature) * 10) / 10;
    };
};

/**
 * Calculates the weighted degree days of a temperature at a date.
 *
 * @param temperature
 * @param date
 * @returns {number}
 */
exports.getWeightedDegreeDays = function(temperature, date) {
    if (temperature >= config.degreeDaysBaseTemperature) {
        return 0;
    } else {
        var weights = [1.1, 1.1, 1.0, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 1.0, 1.1, 1.1];
        var weight = weights[date.getMonth()];
        return Math.round((config.degreeDaysBaseTemperature - temperature) * weight * 10) / 10;
    };
};
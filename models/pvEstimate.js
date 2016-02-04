var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pvEstimateSchema = new Schema({
    station: {type : Schema.ObjectId, ref : 'station'},
    averageTemperature: {type: String},
    solarRadiation: {type: String},
    angle: '',
    azimuth: ''
});

mongoose.model('PvEstimate', pvEstimateSchema);
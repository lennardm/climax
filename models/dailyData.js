var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dailyDataSchema = new Schema({
    station: { type : Schema.ObjectId, ref : 'station', required: true },
    date: { type: Date, required: true },
    averageTemperature: { type: Number, required: true },
    minimumTemperature: { type: Number },
    minimumTemperatureHour: { type: Number },
    maximumTemperature: { type: Number },
    maximumTemperatureHour: { type: Number },
    sunshineDuration: { type: Number },
    percentageOfMaximumPotentialSunshineDuration: { type: Number },
    globalRadiation: { type: Number }
});

dailyDataSchema.statics.latestOfStation = function(station, callback) {
    this.findOne({ station: station._id })
        .sort('-date')
        .exec(callback);
}

dailyDataSchema.set('toJSON', {virtuals:true});
dailyDataSchema.options.toJSON.transform = function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
}


mongoose.model('DailyData', dailyDataSchema);

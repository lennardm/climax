var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dailyDataSchema = new Schema({
    station: { type : Schema.ObjectId, ref : 'station' },
    date: { type: Date },
    averageTemperature: { type: Number },
    minimumTemperature: { type: Number },
    minimumTemperatureHour: { type: Number },
    maximumTemperature: { type: Number },
    maximumTemperatureHour: { type: Number },
    sunshineDuration: { type: Number },
    percentageOfMaximumPotentialSunshineDuration: { type: Number },
    globalRadiation: { type: Number }
});


dailyDataSchema.set('toJSON', {virtuals:true});
dailyDataSchema.options.toJSON.transform = function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
}


mongoose.model('DailyData', dailyDataSchema);

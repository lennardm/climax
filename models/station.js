var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stationSchema = new Schema({
    externalId: { type: String, required: true },
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    altitude: { type: Number }
});

stationSchema.set('toJSON', { virtuals:true });
stationSchema.options.toJSON.transform = function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
}

mongoose.model('Station', stationSchema);

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var meterSchema = new Schema({
  head_type: { type: String },
  time_limit: { type: String },
  rate: { type: String },
  pay_by_phone: { type: String },
  in_effect: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  date_updated: { type: Date, default: Date.now }
});

var Meter = mongoose.model("Meters", meterSchema);

module.exports = Meter;

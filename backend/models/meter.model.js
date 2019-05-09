var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const meterSchema = new Schema({
  meter_type: String,
  meter_id: String,
  limits_and_rates: {
    weekdays: [
      {
        start: String,
        end: String,
        rate: String,
        hour_limit: String
      }
    ],
    saturday: [
      {
        start: String,
        end: String,
        rate: String,
        hour_limit: String
      }
    ],
    sunday: [
      {
        start: String,
        end: String,
        rate: String,
        hour_limit: String
      }
    ],
    time_misc: String,
    rate_misc: String
  },
  pay_by_phone_num: String,
  in_effect: {
    start: String,
    end: String
  },
  credit_card: String,
  prohibitions: String,
  lat: Number,
  lng: Number,
  date_updated: String
});

var Meter = mongoose.model("meters", meterSchema);

module.exports = Meter;

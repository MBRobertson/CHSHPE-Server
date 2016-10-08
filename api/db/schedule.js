var mongoose = require('mongoose');

var scheduleSchema = mongoose.Schema({
    slot: String,
    locations: Object
})

var Schedule = mongoose.model('Schedule', scheduleSchema)


module.exports = Schedule;

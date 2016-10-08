var mongoose = require('mongoose');

var classSchema = mongoose.Schema({
    name: String,
    teacher: String,
    teacherID: String,
    timetable: [String]
})

var Class = mongoose.model('Class', classSchema)


module.exports = Class;

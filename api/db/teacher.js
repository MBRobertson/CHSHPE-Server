var mongoose = require('mongoose');

var teacherSchema = mongoose.Schema({
    name: String,
    code: String,
    version: { type: String, default: ''}
})

var Teacher = mongoose.model('Teacher', teacherSchema)


module.exports = Teacher;

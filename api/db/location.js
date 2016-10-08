var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
    name: String,
})

var Location = mongoose.model('Location', locationSchema)


module.exports = Location;

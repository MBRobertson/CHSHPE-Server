var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

var locationSchema = mongoose.Schema({
    name: String,
    temp: { type: Boolean, default: false }
})

locationSchema.plugin(findOrCreate);

var Location = mongoose.model('Location', locationSchema)


module.exports = Location;

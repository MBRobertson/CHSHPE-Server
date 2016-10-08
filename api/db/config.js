var mongoose = require('mongoose');

var configSchema = mongoose.Schema({
    weekAEven: Boolean
})

var Config = mongoose.model('Config', configSchema)


module.exports = Config;

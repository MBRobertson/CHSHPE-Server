var passport = require('passport');
var Config = require('./db/config');
var router = require('express').Router();

function config(values, callback, res) {
    Config.findOne({}, values, function(err, config) {
        if (err) res.send(500, {error: err});
        else {
            callback(config);
        }

    });
}

function setConfig(values, callback, res) {
    Config.findOneAndUpdate({}, values, {upsert: true, new: true}, function(err, config) {
        if (err) res.send(500, {error: err});
        else {
            callback(config);
        }
    });
}


router.get('/week', function(req, res) {
    config('weekAEven', function(c) {
        res.json({weekAEven: c.weekAEven});
    }, res)
});

router.put('/week', passport.authenticate('jwt', { session: false}), function(req, res) {
    var even = (req.body.weekAEven == 'true') ? true : false
    setConfig({ weekAEven: even }, function(c) {
        res.json({success: true, weekAEven: c.weekAEven});
    }, res)
});


module.exports = {
    handler: router
}

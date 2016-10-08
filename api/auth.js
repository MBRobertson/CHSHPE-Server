var settings = require('./config/settings');
var jwt = require('jwt-simple');

module.exports = {
    handler: function(req, res) {
        console.log(req.body);
        console.log(req.body.key);
        if (req.body.key == "doorframe") {
            var token = jwt.encode({ key: "doorframe" }, settings.secret);
            res.json({success: true, token: token});
        } else {
            res.json({success: false, msg: 'Authentication failed. User not found.'});
        }
    },
    checkHandler: function(req, res) {
        res.json({ valid: true })
    }
}

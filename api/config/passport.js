var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var settings = require('./settings')

module.exports = function(passport) {
    var opts = {};
    opts.secretOrKey = settings.secret;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        if (jwt_payload.key == "doorframe") {
            done(null, jwt_payload.key);
        } else {
            done(null, false);
        }
    }));
};

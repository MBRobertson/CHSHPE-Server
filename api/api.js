var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
//var bodyParser = require('body-parser');
var bb = require('express-busboy');
var settings = require('./config/settings')
var path = require('path');
mongoose.connect(settings.mongo);
mongoose.Promise = require('q').Promise;

//Sub-APIS
var day = require('./day');
var config = require('./config');
var classes = require('./class');
var locations = require('./location');
var teachers = require('./teacher');
var schedule = require('./schedule')
var auth = require('./auth');

var app = express();

//console.log(__dirname);

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

bb.extend(app, {
    upload: true,
    path: path.join(__dirname, 'uploads'),
    allowedPath: /./
});

require('./config/passport')(passport);
app.use(passport.initialize());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/time', day.handler)
app.use('/config', config.handler)
app.use('/class', classes.handler)
app.use('/loc', locations.handler)
app.use('/teacher', teachers.handler)
app.use('/schedule', schedule.handler)

app.use('/auth', auth.handler);
app.use('/authcheck', passport.authenticate('jwt', { session: false}), auth.checkHandler);

module.exports = app;

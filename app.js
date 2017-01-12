var express = require('express');
var morgan = require('morgan');

var api = require('./api/api');
var path = require('path');

var app = express();
//app.use(morgan("dev"));

//Routing logic
app.use('/', express.static(path.join(__dirname, 'client', 'bin')));
app.use('/api', api);

app.use('/*', function(res, req) {
    req.sendFile(path.join(__dirname, 'client', 'bin', 'index.html'));
})

//Start the server

var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3001
var ip = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1'

var server = app.listen(port, ip, () => {
    console.log('App listening on port %s', server.address().port);
    console.log('Press Ctrl+C to quit.');
});

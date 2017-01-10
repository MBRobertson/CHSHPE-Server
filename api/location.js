var passport = require('passport');
var Location = require('./db/location');
var router = require('express').Router();

var auth = function() {
    return passport.authenticate('jwt', { session: false});
}

router.get('/', function(req, res) {
    Location.find({}).sort('name').exec(function(err, loc) {
        if (err)
            res.send(err);

        res.json(loc);
    });
});

router.post('/', auth(), function(req, res) {
    var c = new Location();
    c.name = req.body.name;

    if (c.name != '') {
        c.save(function(err) {
            if (err)
                res.send(err);

            res.json({ success: true });
        });
    } else {
        res.json({success: false});
    }

});

router.post('/temp', auth(), function(req, res) {
    Location.findOrCreate({ name: req.body.name, temp: true }, function(err, c, created) {
        if (err)
            res.send(err);
        res.json(c);
    })
});

router.get('/:Location_id', function(req, res) {
    Location.findById(req.params.Location_id, function(err, c) {
        if (err)
            res.send(err);
        res.json(c);
    });
});

router.put('/:location_id', auth(), function(req, res) {
    // use our bear model to find the bear we want
    Location.findById(req.params.location_id, function(err, c) {

        if (err)
            res.send(err);

        if (req.body.name && req.body.name != '')
            c.name = req.body.name;  // update the bears info

        // save the bear
        c.save(function(err) {
            if (err)
                res.send(err);

            res.json({ success: true });
        });

    });
});

router.delete('/:location_id', auth(), function(req, res) {
    Location.remove({
        _id: req.params.location_id
    }, function(err, bear) {
        if (err)
            res.send(err);

        res.json({ success: true });
    });
});



module.exports = {
    handler: router
}

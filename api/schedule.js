var passport = require('passport');
var Schedule = require('./db/schedule');
var router = require('express').Router();

var auth = function() {
    return passport.authenticate('jwt', { session: false});
}

router.get('/', function(req, res) {
    Schedule.find().sort('slot').exec(function(err, bears) {
        if (err)
            res.send(err);

        res.json(bears);
    });
});

/*router.post('/', auth(), function(req, res) {
    var c = new Schedule();
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

});*/

router.get('/:slot', function(req, res) {
    Schedule.findOne({ slot: req.params.slot }, function(err, c) {
        if (err)
            res.json({ slot: req.params.slot, locations: {} })
        if (c) {
            if (c.locations == null)
                c.locations = {};
            res.json(c);
        }

        else
            res.send({ slot: req.params.slot, locations: {} })
    });
});

router.put('/:slot', auth(), function(req, res) {
    // use our bear model to find the bear we want
    Schedule.findOneAndUpdate({ slot: req.params.slot }, { locations: req.body.locations }, { upsert: true }, function(err) {
        if (err)
            res.send(err)
        else {
            res.json({success: true})
        }
    })
    //Schedule.findOneAndUpdate
});

/*router.delete('/:location_id', auth(), function(req, res) {
    Location.remove({
        _id: req.params.location_id
    }, function(err, bear) {
        if (err)
            res.send(err);

        res.json({ success: true });
    });
});*/



module.exports = {
    handler: router
}

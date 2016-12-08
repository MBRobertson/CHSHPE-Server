var passport = require('passport');
var Class = require('./db/class');
var router = require('express').Router();

var auth = function() {
    return passport.authenticate('jwt', { session: false});
}

router.get('/cat/:cat', function(req, res) {
    Class.find({ catagory: req.params.cat }).sort('catagory').exec(function(err, c) {
        if (err)
            res.send(err);

        res.json(c);
    });
});

router.get('/', function(req, res) {
    Class.find().sort('catagory').exec(function(err, c) {
        if (err)
            res.send(err);

        res.json(c);
    });
});

router.post('/', auth(), function(req, res) {
    var c = new Class();
    c.name = req.body.name || '';
    c.teacher = req.body.teacher || '';
    c.teacherID = req.body.teacherID || '';
    c.timetable = (req.body.timetable || '').split('-')
    c.catagory = (req.body.catagory || '');

    if (c.name != '' && c.teacher != '' & c.timetable != '') {
        c.save(function(err) {
            if (err)
                res.send(err);

            res.json({ success: true });
        });
    } else {
        res.json({success: false});
    }

});

router.get('/:class_id', function(req, res) {
    Class.findById(req.params.class_id, function(err, c) {
        if (err)
            res.send(err);
        res.json(c);
    });
});

router.put('/:class_id', auth(), function(req, res) {
    Class.findById(req.params.class_id, function(err, c) {

        if (err)
            res.send(err);

        if (req.body.name && req.body.name != '')
            c.name = req.body.name;
        if (req.body.teacher && req.body.teacher != '')
            c.teacher = req.body.teacher;
        if (req.body.teacherID)
            c.teacherID = req.body.teacherID
        if (req.body.timetable && req.body.timetable != '')
            c.timetable = (req.body.timetable).split('-')
        if (req.body.catagory)
            c.catagory = req.body.catagory


        c.save(function(err) {
            if (err)
                res.send(err);

            res.json({ success: true });
        });

    });
});

router.delete('/:class_id', auth(), function(req, res) {
    Class.remove({
        _id: req.params.class_id
    }, function(err, bear) {
        if (err)
            res.send(err);

        res.json({ success: true });
    });
});



module.exports = {
    handler: router
}

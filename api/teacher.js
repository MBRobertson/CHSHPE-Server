var passport = require('passport');
var Teacher = require('./db/teacher');
var router = require('express').Router();
var cloudinary = require('cloudinary');
var path = require('path');
var rmdir = require('rmdir');

cloudinary.config({
    cloud_name: 'chspe',
    api_key: '321664268728616',
    api_secret: 'EF5bwLRs93Cz46GRbd66pMKqejA'
});

var auth = function() {
    return passport.authenticate('jwt', { session: false});
}

router.get('/', function(req, res) {
    Teacher.find().sort('name').exec(function(err, bears) {
        if (err)
            res.send(err);

        res.json(bears);
    });
});

router.post('/', auth(), function(req, res) {
    var c = new Teacher();
    c.name = req.body.name || '';
    c.code = req.body.code || '';

    if (c.name != '' && c.code != '') {
        c.save(function(err, t) {
            if (err)
                res.send(err);

            cloudinary.uploader.upload(
                path.join(__dirname, 'uploads', 'default.png'),
                function(result) {
                    res.json({ success: true, id: t.id });
                    c.version = 'v' + result.version + '/';
                    c.save();
                },
                {
                    public_id: t.id,
                    crop: 'thumb',
                    width: 200,
                    height: 300
                }
            )


        });
    } else {
        res.json({success: false});
    }

});

//TODO: Fix auth on image upload...
router.post('/image/:teacher_id', function(req, res) {
    //console.log(req.files.teacherImage);
    if (req.files.teacherImage) {
        cloudinary.uploader.upload(
            req.files.teacherImage.file,
            function(result) {
                Teacher.findById(req.params.teacher_id, function(err, c) {
                    if (!err) {
                        c.version = 'v' + result.version + '/';
                        c.save(function() {
                            res.json(result);
                        });
                    }
                });
                rmdir(path.join(__dirname, 'uploads', req.files.teacherImage.uuid));
            },
            {
                public_id: req.params.teacher_id,
                crop: 'thumb',
                width: 200,
                height: 300
            }
        )
    } else {
        res.json({ success: false, file: 'none'})
    }
});

router.get('/:Teacher_id', function(req, res) {
    Teacher.findById(req.params.Teacher_id, function(err, c) {
        if (err)
            res.send(err);
        res.json(c);
    });
});

router.put('/:Teacher_id', auth(), function(req, res) {
    // use our bear model to find the bear we want
    Teacher.findById(req.params.Teacher_id, function(err, c) {

        if (err)
            res.send(err);

        if (req.body.name && req.body.name != '')
            c.name = req.body.name;  // update the bears info

        if (req.body.code && req.body.code != '')
            c.code = req.body.code;  // update the bears info

        // save the bear
        c.save(function(err, t) {
            if (err)
                res.send(err);

            res.json({ success: true, id: t.id });
        });

    });
});

router.delete('/:Teacher_id', auth(), function(req, res) {
    Teacher.remove({
        _id: req.params.Teacher_id
    }, function(err, bear) {
        if (err)
            res.send(err);
        cloudinary.v2.uploader.destroy(req.params.Teacher_id)
        res.json({ success: true });
    });
});



module.exports = {
    handler: router
}

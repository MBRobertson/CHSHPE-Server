var moment = require('moment-timezone');

var Config = require('./db/config');

var periods = {
    1: {
        start: moment.tz("8:30am", "h:mma", "NZ"),
        end: moment.tz("9:35am", "h:mma", "NZ")
    },
    2: {
        start: moment.tz("9:35am", "h:mma", "NZ"),
        end: moment.tz("10:40am", "h:mma", "NZ")
    },
    3: {
        start: moment.tz("10:40am", "h:mma", "NZ"),
        end: moment.tz("12:25pm", "h:mma", "NZ")
    },
    4: {
        start: moment.tz("12:25pm", "h:mma", "NZ"),
        end: moment.tz("1:30pm", "h:mma", "NZ")
    },
    5: {
        start: moment.tz("1:30pm", "h:mma", "NZ"),
        end: moment.tz("3:15pm", "h:mma", "NZ")
    }
}

var getDay = function(weekAEven) {
    var now = moment.tz('NZ');
    var reference = weekAEven ? 2 : 1
    var week = (now.week() % 2 == reference % 2) ? 'A' : 'B'
    return {week: week, day: now.day().toString() }
}

var getPeriod = function() {
    var now = moment.tz('NZ');
    for (var p = 1; p <= 5; p++) {
        if (now.isBetween(periods[p].start, periods[p].end)) {
            return p;
        }
    }
    if (now.isAfter(periods[5].end)) return -1;
    return 0;
}
var getTime = function(weekAEven) {
    var day = getDay(weekAEven);
    var now = moment.tz('NZ');
    var now2 = moment.tz('NZ', "10:40am", "h:mma");
    var now3 = moment.tz('NZ', "1:30pm", "h:mma");
    return {
        week: day.week,
        day: day.day,
        period: getPeriod(),
        time: now.format(),
        now2: now2.format(),
        now3: now3.format()
    }
}

module.exports = {
    getDay: getDay,
    getPeriod: getPeriod,
    getTime: getTime,
    handler: function(req, res) {
        Config.findOne({}, 'weekAEven', function(err, config) {
            if (err) res.send(500, {error: err});
            else {
                var time = getTime(config.weekAEven);
                //time.day = 4;
                //time.period = 2;
                res.json(time);
            }
        });
    }
}

import 'whatwg-fetch';

var config = {
    //api: 'http://localhost:3001/api'
    api: '/api'
}

let teachers = {
    get: (callback) => {
        fetch(config.api + '/teacher/').then((response) => {
            return response.json()
        }).then((json) => {
            callback(json);
        });
    },
    image: (teacher) => {
        return "http://res.cloudinary.com/chspe/image/upload/" + teacher.version + teacher._id + ".jpg";
    }
}

let classes = {
    get: (callback) => {
        fetch(config.api + '/class').then((response) => {
            return response.json();
        }).then((json) => {
            callback(json)
        })
    }
}

let locations = {
    get: (callback) => {
        fetch(config.api + '/loc').then((response) => {
            return response.json();
        }).then((json) => {
            callback(json)
        })
    }
}

let time = {
    getDay: (callback) => {
        fetch(config.api + '/time').then((response) => {
            return response.json()
        }).then((json) => {
            callback(json);
        })
    },
    toString: (time, short) => {
        if (short)
            return (time.week + time.day)
        else
            return (time.week + time.day + ':' + time.period);
    },
    getSchedule: (timeString, callback) => {
        fetch(config.api + '/schedule/' + timeString).then((response) => {
            return response.json();
        }).then((json) => {
            callback(json);
        })
    }
}

let user = {
    getClass: () => {
        return {
            _id: '57f87921b5f5a439cc4013ac',
            name: '9Test',
            teacher: 'JW'
        }
    }
}

config['teachers'] = teachers;
config['time'] = time;
config['user'] = user;
config['classes'] = classes;
config['locations'] = locations;

export default config
export { config as Config }

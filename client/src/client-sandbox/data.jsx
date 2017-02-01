import { Config } from './config.jsx';

/* This page is currently unused */

var teachers = {}
var classes = {}
var time = {}
var schedule = {}
var locations = {}

var gotData = {}
function resetData() {
    gotData = {
        'teachers': false,
        'classes': false,
        'time': false,
        'schedule': false,
        'locations': false
    }
}

function getTime() {
    //gotData['time'] = false;
    Config.time.getDay((day) => {
        time = {
            'week': day.week,
            'day': day.day,
            'period': day.period
        };
        gotData.time = true;
        verifyData();
    });
}

function getSchedule(dayOverride) {
    if (dayOverride)
    {
        time = dayOverride;
        gotData.time = true;
        Config.time.getSchedule(Config.time.toString(dayOverride, true), (scheduleData) => {
            schedule = scheduleData;
            gotData.schedule = true;
            verifyData();
        })
    }
    else
    {
        Config.time.getDay((day) => {
            time = {
                'week': day.week,
                'day': day.day,
                'period': day.period
            };
            gotData.time = true;
            Config.time.getSchedule(Config.time.toString(day, true), (scheduleData) => {
                schedule = scheduleData;
                gotData.schedule = true;
                verifyData();
            })
        });
    }
    //gotData['time'] = false;
    //gotData['schedule'] = false;
    
}

function getClasses() {
    Config.classes.get((classList) => {
        classes = classList;
        gotData.classes = true;
        verifyData();
    });
}

function getLocations() {
    Config.locations.get((locationList) => {
        locations = locationList;
        gotData.locations = true;
        verifyData();
    });
}

function getTeachers() {
    Config.teachers.get((teachersData) => {
        teachers = teachersData
        gotData.teachers = true;
        verifyData();
    })
}

function checkData() {
    return gotData.teachers && gotData.classes && gotData.time && gotData.schedule && gotData.locations
}

var waiting = false;

function beginFetch(dayOverride) {
    if (waiting) return;
    resetData();
    getSchedule(dayOverride);
    getClasses();
    getLocations();
    getTeachers();
    waiting = true;
}

function verifyData() {
    if (!checkData()) return;

    setReady();
}

function setReady() {
    //console.log("Ready!");
    //ready = true;
    var dataReadyEvent = new Event('dataready')
    //readyFunc();
    document.dispatchEvent(dataReadyEvent);
}

function getData() {
    return {
        teachers: teachers,
        classes: classes,
        time: time,
        schedule: schedule,
        locations: locations
    }
}

export default { 'checkData': checkData, 'getData': getData, 'beginFetch': beginFetch, 'verifyData': verifyData, 'getSchedule': getSchedule,
'getClasses': getClasses,
'getLocations': getLocations,
'getTeachers': getTeachers }
export { getData }

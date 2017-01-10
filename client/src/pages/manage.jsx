import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Link } from 'react-router';

import ClassEditor from './manage/class-editor.jsx';
import LocEditor from './manage/loc-editor.jsx';
import TeacherEditor from './manage/teacher-editor.jsx';
import ImageEditor from './manage/image-editor.jsx';

import auth from 'auth';

let parseString = (time) => {
    return {
        week: time.substring(0, 1),
        day: Number(time.substring(1, 2)),
        period: Number(time.substring(3))
    }
}

let parseTime = (time) => {
    return time.week + String(time.day) + ":" + String(time.period);
}

class Manage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            classList: [],
            locationList: [],
            teacherList: [],
            week: '',
            day: 0,
            period: 0,
            changingWeek: false
        }

        this.refreshTime = this.refreshTime.bind(this);
        this.refreshClasses = this.refreshClasses.bind(this);
        this.refreshLocations = this.refreshLocations.bind(this);
        this.refreshTeachers = this.refreshTeachers.bind(this);
    }

    componentDidMount() {
        auth.req('/api/time', {
            success: (time) => {
                let week = time.week
                if (time.day >= 6) {
                    if (week == 'A')
                        week = 'B';
                    else
                        week = 'A';
                }

                this.setState({
                    week: week,
                    day: time.day,
                    period: time.period
                })
            }
        })
        auth.req('/api/class/', {
            success: (cList) => {
                this.setState({ classList: cList });
            }
        });
        auth.req('/api/loc/', {
            success: (lList) => {
                var nList = [];
                lList.forEach(function(loc) {
                    if (!loc.temp)
                        nList.push(loc);
                })
                this.setState({ locationList: nList });
            }
        });
        auth.req('/api/teacher/', {
            success: (lList) => {
                this.setState({ teacherList: lList });
            }
        });
    }

    changeWeek() {
        if (!this.state.changingWeek) {
            this.setState({
                changingWeek: true
            })
            auth.req('/api/config/week/', {
                success: (config) => {
                    let newWeek = !config.weekAEven;
                    auth.req('/api/config/week/', {
                        success: () => {
                            this.refreshTime();
                        }
                    }, {weekAEven: newWeek}, 'PUT');
                }
            })
        }
    }

    refreshTime() {
        this.setState({
            week: '',
            day: 0,
            period: 0,
            changingWeek: false
        })
        auth.req('/api/time', {
            success: (time) => {
                let week = time.week
                if (time.day >= 6)
                    if (week == 'A')
                        week = 'B';
                    else
                        week = 'A';
                this.setState({
                    week: week,
                    day: time.day,
                    period: time.period
                })
            }
        })
    }

    refreshClasses() {
        this.setState({ classList: [] });
        auth.req('/api/class/', {
            success: (cList) => {
                this.setState({ classList: cList });
            }
        });
    }

    refreshLocations() {
        this.setState({ locationList: [] });
        auth.req('/api/loc/', {
            success: (lList) => {
                var nList = [];
                lList.forEach(function(loc) {
                    if (!loc.temp)
                        nList.push(loc);
                })
                this.setState({ locationList: nList });
            }
        });
    }

    refreshTeachers() {
        this.setState({ teacherList: [] });
        auth.req('/api/teacher/', {
            success: (lList) => {
                this.setState({ teacherList: lList });
            }
        });
    }

    render() {
        var classItems = (<p className="message">Loading Classes...</p>);
        var locationItems = (<p className="message">Loading Locations...</p>);
        var teacherItems = (<p className="message">Loading Teachers...</p>);

        var currentClasses = [];
        var time = parseTime(this.state);

        if (this.state.classList.length > 0) {
            classItems = this.state.classList.map((c) => {
                if (c.timetable.indexOf(time) >= 0)
                    currentClasses.push((<span key={c._id}>{ c.name + " (" + c.teacher + ")"}</span>));
                return (<ListItem refresh={this.refreshClasses} api='class' key={c._id} id={c._id} text={ c.name + " (" + c.teacher + ")"}/>);
            })
        }
        if (this.state.locationList.length > 0) {
            locationItems = this.state.locationList.map((c) => {
                return (<ListItem refresh={this.refreshLocations} api='loc' key={c._id} id={c._id} text={ c.name }/>);
            })
        }
        if (this.state.teacherList.length > 0) {
            teacherItems = this.state.teacherList.map((c) => {
                return (<ListItem refresh={this.refreshTeachers} api='teacher' key={c._id} id={c._id} text={ c.name + " (" + c.code + ")" }/>);
            })
        }

        if (currentClasses.length <= 0) {
            currentClasses.push(<span key="k">No classes found...</span>);
        }

        var time = (<p>Loading...</p>);
        if (this.state.week != '') {
            var weekend = this.state.day >= 6 || this.state.day <= 0;
            if (weekend) {
                time = (<div>
                    <h3>Current Period</h3>
                    <p className="subheader">{'Weekend - Next week is \'Week ' + this.state.week + '\''}</p>
                </div>)
            } else {
                if (this.state.period >= 1) {
                    time = (
                        <div>
                            <h3>Current Period</h3>
                            <p className="subheader">{'Week ' + this.state.week + ' - Day ' + this.state.day + ' - Period ' + this.state.period}</p>
                            <div className="cur-classes">
                                <h4>Current Classes:</h4>
                                <div className="cur-list">
                                    {currentClasses}
                                </div>
                            </div>
                    </div>
                    )
                } else {
                    let period = (this.state.period == 0 ? 'before school' : 'after school');
                    time = (
                        <div>
                            <h3>Current Period</h3>
                            <p className="subheader">{'Week ' + this.state.week + ' - Day ' + this.state.day + ' - ' + period}</p>
                        </div>
                    )
                }
            }
        }
        return (
            <div id="managePage">
                <div className="card">
                    {time}
                    {/* <Link className="button" to="/schedule">Schedule</Link> */}
                    <a className="button" onClick={this.changeWeek.bind(this)} href="#">{ this.state.changingWeek ? 'Changing...' : 'Swap Week'}</a>
                </div>
                <div className="card">
                    <h3>Classes</h3>
                    <ul id="classList" className="list">
                        {/*classItems*/}
                        <CatagoryItem id="y9" cat="y9" text="Year 9"/>
                        <CatagoryItem id="y10" cat="y10" text="Year 10"/>
                        <CatagoryItem id="y11" cat="y11" text="Year 11"/>
                        <CatagoryItem id="y12" cat="y12" text="Year 12"/>
                        <CatagoryItem id="y13" cat="y13" text="Year 13"/>
                    </ul>
                    <Link className="button" to="/manage/class/">Add Class</Link>
                </div>
                <div className="card">
                    <h3>Teachers</h3>
                    <ul id="classList" className="list">
                        {teacherItems}
                    </ul>
                    <Link className="button" to="/manage/teacher/">Add Teacher</Link>
                </div>
                <div className="card">
                    <h3>Locations</h3>
                    <ul id="classList" className="list">
                        {locationItems}
                    </ul>
                    <Link className="button" to="/manage/loc/">Add Location</Link>
                </div>

            </div>
        );
    }
}

class ListItem extends React.Component {
    onDelete() {
        let check = confirm('Are you sure you want to delete \'' + this.props.text + '\'?');

        if (check) {
            auth.req('/api/' + this.props.api + '/' + this.props.id, {
                success: (res) => {
                    if (res.success) {
                        this.props.refresh();
                    }
                }
            }, null, 'DELETE');
        }
    }
    render() {
        return (<li className="list-item" id={this.props.id}>
            <Link className="list-title" to={'/manage/' + this.props.api + '/' + this.props.id}>{this.props.text}</Link>
            <a className="list-link" onClick={this.onDelete.bind(this)} href="#">Delete</a>
            <Link className="list-link" to={'/manage/' + this.props.api + '/' + this.props.id}>Edit</Link>
        </li>);
    }
}

class CatagoryItem extends React.Component {
    render() {
        return (<li className="list-item" id={this.props.id}>
            <Link className="list-title" to={'/manage/class/catagory/' + this.props.cat}>{this.props.text}</Link>
        </li>);
    }
}

export default Manage
export { Manage, ClassEditor, LocEditor, TeacherEditor, ImageEditor }

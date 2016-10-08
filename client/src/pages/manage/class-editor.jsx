import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Link } from 'react-router';

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

let timetableToString = (timetable) => {
    let ret = "";
    for (var i = 0; i < timetable.length; i++) {
        ret += "-" + timetable[i];
    }
    return ret.substring(1);
}

let teacherReference = {};

class ClassEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.params.id || '',
            ready: false,
            update: false,
            saving: false,
            name: '',
            teacher: 'No Teacher',
            teacherID: '',
            timetable: [],
            teacherList: []
        }
    }

    componentDidMount() {
        teacherReference = {};
        if (this.state.id != '') {
            auth.req('/api/class/' + this.state.id, {
                success: (c) => {
                    console.log(c);
                    this.setState({
                        ready: true,
                        update: true,
                        name: c.name,
                        teacher: c.teacher,
                        teacherID: c.teacherID,
                        timetable: c.timetable
                    })
                },
                error: () => {
                    this.setState({
                        ready: true,
                        update: false
                    })
                }
            })
        } else {
            this.setState({
                ready: true,
                update: false
            });
        }
        auth.req('/api/teacher/', {
            success: (lList) => {
                this.setState({ teacherList: lList });
            }
        });
    }

    onChangeName(e) {
        this.setState({name: e.target.value});
    }

    onChangeTeacher(e) {
        console.log({
            teacherID: e.target.value,
            teacher: teacherReference[e.target.value]
        });
        this.setState({
            teacherID: e.target.value,
            teacher: teacherReference[e.target.value]
        });
    }

    updateTimetable(newValues) {
        this.setState({ timetable: newValues });
    }

    save() {
        this.setState({
            saving: true
        });
        auth.req('/api/class/' + this.state.id, {
            success: (data) => {
                /*if (data.success) {

                }*/
                browserHistory.push('/manage');
            }
        }, {
            name: this.state.name,
            teacher: this.state.teacher,
            teacherID: this.state.teacherID,
            timetable: timetableToString(this.state.timetable)
        }, (this.state.update ? 'PUT' : 'POST'))
    }

    render() {
        if (!this.state.ready) {
            return (<div id="managePage">
                <div className="card">
                    <h3>Please wait...</h3>
                </div>
            </div>)
        } else {
            var teacherItems = [];
            if (this.state.teacherList.length > 0) {
                teacherItems = this.state.teacherList.map((c) => {
                    teacherReference[c._id] = c.code;
                    return (<option key={c._id} id={c._id} value={c._id}>{ c.name + " (" + c.code + ")" }</option>);
                })
            }
            teacherReference[""] = "No Teacher";
            teacherItems.unshift(<option key="1" id="none" value="">No Teacher</option>);
            return (
                <div id="managePage">
                    <div className="card">
                        <h3>{this.state.update ? 'Edit Class' : 'New Class'}</h3>
                        <form id="manageClass">
                            <div className='input-block half'>
                                <label htmlFor="className">Class Name:</label>
                                <input type="text" id="className" placeholder='ie. "9PE"' value={this.state.name} onChange={this.onChangeName.bind(this)}/>
                            </div>
                            <div className='input-block half'>
                                <label htmlFor="teacher">Teacher:</label>
                                {/* <input type="text" id="teacher" placeholder="Teacher Code" value={this.state.teacher} onChange={this.onChangeTeacher.bind(this)}/> */}
                                <select id="teacher" value={this.state.teacherID} onChange={this.onChangeTeacher.bind(this)} name="teacher">{teacherItems}</select>
                            </div>
                            <div className='input-block'>
                                <input type="hidden" id="timetable" value={this.state.timetable} />
                                <Timetable callback={this.updateTimetable.bind(this)} values={this.state.timetable} />
                            </div>
                        </form>
                        <a className="button" href="#" onClick={this.save.bind(this)}>{this.state.saving ? 'Saving...' : 'Save'}</a>
                        <Link className="button left" to="/manage">Cancel</Link>
                    </div>
                </div>
            )
        }
    }
}

class Timetable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timetable: this.props.values
        }

        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(slot) {
        return (e) => {
            let index = this.state.timetable.indexOf(slot);
            let values = this.state.timetable.slice();
            if (index >= 0) {
                values.splice(index, 1);
                this.setState({
                    timetable: values
                })
            } else {
                values.push(slot);
                this.setState({
                    timetable: values
                })
            }
            if (this.props.callback)
                this.props.callback(values);
        }
    }

    render() {
        let headers = ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5"];
        var headerElements = headers.map((header) => {
            return (<th key={header} id={header} className="timetable-header-box">{header}</th>);
        })
        let numRows = 5;
        var rows = [];
        for (var period = 1; period <= numRows; period++) {
            var row = [];
            for (var day = 0; day < headers.length; day++) {
                let slot = headers[day] + ":" + period;
                row.push((<td key={slot} data-slot={slot} className={"timetable-slot" + (this.state.timetable.indexOf(slot) >= 0 ? " selected" : "")} onClick={this.clickHandler(slot)}></td>));
            }
            rows.push((<tr key={"p" + period} className="timetable-row" data-period={period}>{row}</tr>));
        }

        return (
            <table className="timetable">
                <tbody>
                    <tr className="timetable-header">{headerElements}</tr>
                    {rows}
                </tbody>
            </table>
        );
    }
}


export default ClassEditor
export { ClassEditor }

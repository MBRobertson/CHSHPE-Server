import React from 'react';
import { browserHistory, Link } from 'react-router';

import auth from 'auth';

function timeFromString(str) {
    return {
        week: str.substring(0, 1),
        day: Number(str.substring(1))
    };
}

var scheduleReady = true;
class Schedule extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            ready: false,
            classList: null,
            locationList: null,
            time: null,
            currentPage: '',
            period: 1
        }

        this.changePage = this.changePage.bind(this);
    }

    changePage(newPage) {
        this.setState({
            currentPage: newPage
        })
    }

    changePeriod(period) {
        this.setState({
            period: period
        })
    }

    componentDidMount() {
        auth.req('/api/class/', {
            success: (cList) => {
                this.setState({
                    classList: cList
                });
            }
        });
        auth.req('/api/loc/', {
            success: (lList) => {
                lList.unshift({ _id: '', name: '(None)'})
                this.setState({ locationList: lList });
            }
        });
        auth.req('/api/time', {
            success: (time) => {
                let week = time.week
                if (time.day >= 6) {
                    time.day = 1;
                    if (week == 'A')
                        week = 'B';
                    else
                        week = 'A';
                } else if (time.day == 0) {
                    time.day = 1;
                }
                if (time.period <= 0)
                    time.period = 1;
                // console.log({
                //     currentPage: time.week + time.day,
                //     time: time,
                //     period: time.period
                // });
                time.week = week;
                this.setState({
                    currentPage: time.week + time.day,
                    time: time,
                    period: time.period
                })
            }
        })
    }

    render() {
        if (!(this.state.time && this.state.classList && this.state.locationList)) {
            return (
                <div id="schedulePage">
                    <h3>Please wait...</h3>
                </div>
            )
        } else {
            let time = timeFromString(this.state.currentPage);
            time['period'] = this.state.period;
            let dnum = time.week == 'B' ? time.day + 5 : time.day;

            return (
                <div id="schedulePage">
                    {/*<h3>Schedule</h3>*/}
                    {/*<Link to="/print" className="button print-button">Print Schedule</Link>*/}
                    <a href="/print" target="_blank" className="button print-button">Print Schedule</a>
                    <ScheduleHeader handler={this.changePage} periodChange={this.changePeriod.bind(this)} currentPage={this.state.currentPage} time={this.state.time}/>
                    <ClassHandler time={time} classList={this.state.classList} locationList={this.state.locationList} dnum={dnum}/>
                </div>
            )
        }
    }
}

class ClassHandler extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            ready: false,
            scheduleData: {},
            saving: false
        }

        this.getTime = this.getTime.bind(this);
        this.getClasses = this.getClasses.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setSchedule = this.setSchedule.bind(this);
        this.save = this.save.bind(this);
    }

    getTime(props) {
        var p = props || this.props
        return (p.time.week + p.time.day + ':' + p.time.period);
    }

    setSchedule(props) {
        this.setState({
            ready: false
        })
        auth.req('/api/schedule/' + this.getTime(props), {
            success: (d) => {
                this.setState({
                    ready: true,
                    scheduleData: (d[0] || { locations: {}}).locations || {}
                })
            }
        })
    }

    save() {
        if (!this.state.saving) {
            this.setState({
                saving: true
            })
            var data = {};
            for (var key in this.state.scheduleData) {
                if (this.state.scheduleData.hasOwnProperty(key)) {
                    if (this.state.scheduleData[key] != '')
                        data[key] = this.state.scheduleData[key];
                }
            }


            auth.req('/api/schedule/' + this.getTime(), {
                success: (d) => {
                    this.setState({
                        saving: false
                    })
                }
            }, { locations: data}, 'PUT');
        }

    }

    componentWillReceiveProps(newProps) {
        this.setSchedule(newProps);
    }

    componentDidMount() {
        this.setSchedule(this.props);
    }

    getClasses() {
        var classes = [];
        var time = this.getTime();

        for (var i = 0; i < this.props.classList.length; i++) {
            let c = this.props.classList[i]
            if (c.timetable.indexOf(time) >= 0) {
                classes.push(c)
            }
        }

        return classes;
    }

    onChange(locationID, classID) {
        var data = this.state.scheduleData
        data[classID] = locationID;
        this.setState({
            scheduleData: data
        })
    }

    render() {
        let time = this.props.time;
        if (this.state.ready) {
            return (
                <div className="cardHolder" id="classList">
                    <div className="card">
                        <h5>{'Week ' + time.week + ' - Day ' + this.props.dnum + ' - Period ' + time.period}</h5>
                        {this.getClasses().map((c) => {
                            return (<ClassPicker handler={this.onChange} schedule={this.state.scheduleData} key={c._id} class={c} locations={this.props.locationList}/>)
                        })}
                        <span className="button" onClick={this.save}>{this.state.saving ? 'Saving...' : 'Save'}</span>
                    </div>
                </div>
            )
        }
        else {
            return (<div className="cardHolder" id="classList">
                <div className="card">
                    <h5>Please wait...</h5>
                </div>
            </div>)
        }
    }
}

class LocationPicker extends React.Component {
    constructor(props) {
        super(props);

        var temporary = false;
        var val = '';
        props.locations.forEach(function(loc) {
            if (loc._id == props.schedule[props.class._id] && loc.temp) {
                temporary = true;
                val = loc.name;
            }
        })
        console.log(props.schedule[props.class._id]);
        
 
        this.state = {
            loc: this.props.locations,
            select: !temporary,
            customLoc: val
        }

        this.state.loc.push({ _id: "temp-value", name: "=> Other...", temp: false })
    }

    onSelect(id) {
        return (e) => {
            let val = e.target.value;
            if (val != "temp-value") {
                this.props.handler(e.target.value, id);
            } else {
                this.setState({
                    select: false
                })
            }
            
        }
    }

    onTextChange(id) {
        return (e) => {
            let val = e.target.value;
            this.props.handler("temp:" + val, id);
            this.setState({ customLoc: val });
        }
    }

    render() {
        if (this.state.select) {
            return (<div key={"loc-selection"}>
                <select value={this.props.schedule[this.props.class._id]} onChange={(this.onSelect(this.props.class._id)).bind(this)}>
                    {
                        this.state.loc.map((l) => {
                            if (!l.temp)
                                return (<option key={l._id} value={l._id}>{l.name}</option>)
                        })
                    }
                </select>
            </div>)
        } else {
            return (
                <div key={"loc-custom"}>
                    <input placeholder="Enter custom location here..." type="text" name="custom-loc" value={this.state.customLoc} onChange={(this.onTextChange(this.props.class._id)).bind(this)}/>
                    <a onClick={function() {
                        this.props.handler('', this.props.class._id);
                        this.setState({
                            select: true,
                            customLoc: ''
                        })
                    }.bind(this)} className="back-to-select">{"< Back"}</a>
                </div>
            )
        }
    }
}

class ClassPicker extends React.Component {
    onSelect(id) {
        return (e) => {
            this.props.handler(e.target.value, id);
        }
    }

    render() {
        return (
            <div className="classPicker">
                <span>{this.props.class.name + ' (' + this.props.class.teacher + ')'}</span>
                <LocationPicker locations={this.props.locations} schedule={this.props.schedule} class={this.props.class} handler={this.props.handler} />
            </div>
        )
    }
}

class ScheduleHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            period: this.props.time.period
        }
    }

    changePageHandler(id) {
        return (e) => {
            this.setState({
                period: 1
            })
            this.props.periodChange(1);
            this.props.handler(id);
        }
    }

    changePeriodHandler(period) {
        return (e) => {
            this.setState({
                period: period
            })
            this.props.periodChange(period);
        }
    }

    render() {
        var weeks = ['A', 'B'];

        var dayButtons = [];
        var weekHeaders = [];
        var periodButtons = [];

        let dnum = 1;
        for (var i = 0; i < weeks.length; i++) {
            let w = weeks[i]
            let thisWeek = this.props.time.week == w;
            weekHeaders.push(<th key={w} className={thisWeek ? 'today' : ''} colSpan="5">{'Week ' + w}</th>);

            for (var d = 1; d <= 5; d++) {
                let today = (this.props.time.day == d && thisWeek)
                let id = w + d
                var element = (<HeaderDay key={id} id={id} onClick={(this.changePageHandler(id)).bind(this)} currentPage={this.props.currentPage} today={today} day={d} dnum={dnum}/>)
                dnum++;
                dayButtons.push(element);
            }
        }

        for (var p = 1; p <= 5; p++) {
            let curP = this.state.period;
            let today = (p == this.props.time.period)
            periodButtons.push(
                <td
                    onClick={(this.changePeriodHandler(p)).bind(this)}
                    key={'p'+p}
                    className={'period-button' + (today ? ' today' : '') + (curP == p ? ' active' : '')} >
                    {'Period ' + p}
                </td>
            )
        }


        return (
            <div>
                <table className="schedule-nav">
                    <tbody>
                        <tr>{weekHeaders}</tr>
                        <tr>{dayButtons}</tr>
                    </tbody>
                </table>
                <table className="schedule-nav period-table">
                    <tbody>
                        <tr>{periodButtons}</tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

class HeaderDay extends React.Component {
    render() {
        return (
            <td onClick={this.props.onClick} className={'day-button' + (this.props.today ? ' today' : '') + (this.props.id == this.props.currentPage ? ' active' : '')}>{'Day ' + this.props.dnum}</td>
        )
    }
}

export default Schedule
export { Schedule }

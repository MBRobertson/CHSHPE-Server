import React from 'react';
import { UI } from './components/ui.jsx';
import { PeriodView } from './components/period-view.jsx';
import { Link } from 'react-router';

import { Config } from './config.jsx';

import data from './data.jsx';

class Schedule extends React.Component {
    constructor(props) {
        super(props)

        if (data.checkData()) {
            let info = data.getData();
            this.state = {
                class: Config.user.getClass(),
                day: {
                    week: this.props.params.time.substring(0, 1),
                    day: this.props.params.time.substring(1, 2),
                    period: 1
                },
                schedule: info.schedule,
                classList: info.classes,
                locationList: info.locations
            }
        } else {
            this.state = {
                class: Config.user.getClass(),
                day: {
                    week: this.props.params.time.substring(0, 1),
                    day: this.props.params.time.substring(1, 2),
                    period: 1
                },
                schedule: null,
                classList: null,
                locationList: null
            }
        }

        this.refresh = this.refresh.bind(this);
        this.populateData = this.populateData.bind(this);
    }

    populateData() {
        console.log("Data gotten!");
        let info = data.getData();
        this.setState({
            day: {
                week: this.props.params.time.substring(0, 1),
                day: this.props.params.time.substring(1, 2),
                period: 1
            },
            schedule: info.schedule,
            classList: info.classes,
            locationList: info.locations
        })
    }

    componentDidMount() {
        data.beginFetch({
                week: this.props.params.time.substring(0, 1),
                day: this.props.params.time.substring(1, 2),
                period: 1
            });
        //data.setReadyFunc(this.populateData)
        document.addEventListener("dataready", this.populateData, false);
    }

    componentWillUnmount() {
        document.removeEventListener("dataready", this.populateData, false);
    }

    refresh() {
        data.getSchedule(this.state.day);
        data.getClasses();
        data.getLocations();
        data.verifyData();
    }

    render() {
        if (!(this.state.day && this.state.schedule && this.state.classList && this.state.locationList)) {
            return (
                <UI.Card>
                    <UI.Header text="Loading Schedule"/>
                </UI.Card>
            )
        }
        else if (this.state.day.day <= 0 || this.state.day.day >= 6) {
            return (
                <UI.Card>
                    <UI.Header text="It's currently the weekend"/>
                    <UI.SubHeader text="Nothing to show at the moment"/>
                </UI.Card>
            )
        }
        /*else if (this.state.day.period <= 0) {
            return (
                <UI.Card>
                    <UI.Header text={'It is currently ' + (this.state.day.period == 0 ? 'before school' : 'after school')}/>
                    <UI.SubHeader text={'Week ' + this.state.day.week + ' - Day ' + this.state.day.day}/>
                </UI.Card>
            )
        }*/
        else {
            var scheduleItems = [];
            for (var i = 1; i <= 5; i++) {
                scheduleItems.push(
                    <PeriodView key={i} period={i} time={this.state.day} schedule={this.state.schedule} classList={this.state.classList} locationList={this.state.locationList}/>
                )
            }

            let weekdays = {
                0: "Monday",
                1: "Tuesday",
                2: "Wednesday",
                3: "Thursday",
                4: "Friday"
            }

            let time = this.props.params.time;
            let week = time.substring(0, 1);
            let day = parseInt(time.substring(1, 2)) + (week == 'B' ? 5 : 0);
            let weekday = weekdays[(day-1) % 5];

            return (
                <div id="printPage">
                    <div className="print-header">
                        <h1 className="print-header-daytext">{weekday}</h1>
                        <h1 className="print-header-day">{"Day " + day}</h1>
                    </div>
                    {scheduleItems}
                    <a to="/print" onClick={window.close} className="button no-print">Back</a>
                </div>)
            ;
        }

    }
}
//id="homePage"

export default Schedule
export { Schedule }

import './css/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';
import $ from 'jquery';
import auth from 'auth';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

import Nav from './components/nav.jsx';

import Login from './pages/login.jsx';
import { Manage, ClassEditor, LocEditor, TeacherEditor, ImageEditor } from './pages/manage.jsx';
import { Schedule } from './pages/schedule.jsx';

//import { Home } from './pages/home.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (auth.valid()) {
            auth.req('/api/authcheck', {
                success: (data) => {
                    if (data.valid != true) {
                        browserHistory.push('/login')
                    }
                },
                error: () => {
                    browserHistory.push('/login')
                }
            });
        }
    }

    render() {
        return (
            <main>
                <Nav loc={this.props.location}/>
                <section id="mainContent" key={this.props.location.pathname}>
                    {this.props.children}
                </section>
            </main>
        );
    }
}

class Home extends React.Component {
    render() {
        return (<p>Hello world!</p>);
    }
}

ReactDOM.render(
    (<Router history={browserHistory}>
        <Route path="/login" component={Login}/>
        <Route path="/" component={App}>
            <IndexRoute path="" component={Home} />
            <Route path="schedule" component={Schedule}/>
            <Route path="manage">
                <IndexRoute path="" component={Manage} />
                <Route path="class(/:id)" component={ClassEditor} />
                <Route path="loc(/:id)" component={LocEditor} />
                <Route path="teacher(/:id)" component={TeacherEditor} />
                <Route path="teacher/image/:id" component={ImageEditor} />
            </Route>
        </Route>
    </Router>),
    document.getElementById('app')
);

//<Route path="timetable" component={Timetable}/>

import React from 'react';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';
import $ from 'jquery';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

import auth from 'auth';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authed: false,
            failed: false,
            pass: ''
        }

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        if (auth.valid()) {
            auth.req('/api/authcheck', {
                success: (data) => {
                    if (data.valid == true) {
                        this.setState({authed: true})
                        browserHistory.push('/');
                    }
                    else {
                        auth.set('');
                        this.setState({ authed: false });
                    }
                },
                error: () => {
                    auth.set('');
                    this.setState({authed: false});
                }
            });
        }
    }

    onPassChange(e) {
        this.setState({pass: e.target.value});
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({ authed: true });
        auth.req('/api/auth', {
            success: (data) => {
                if (data.success) {
                    auth.set(data.token);
                    browserHistory.push('/');
                } else {
                    this.setState({ authed: false, failed: true, pass: '' });
                }
            },
            error: () => {
                this.setState({ authed: false, failed: true, pass: '' });
            }
        }, 'key=' + this.state.pass, 'POST');
        return false;
    }

    render() {
        if (this.state.authed) {
            return (
                <main id="login">
                    <form>
                        <h2>Please wait...</h2>
                    </form>
                </main>
            );
        }
        else {
            return (
                <main id="login">
                    <form onSubmit={this.onSubmit}>
                        <h2>CHS PE</h2>
                        <input type="password" value={this.state.pass} onChange={this.onPassChange.bind(this)} name="key"/>
                        <input type="submit" value="Login"/>
                    </form>
                </main>
            );
        }
    }
}

export default Login
export { Login }

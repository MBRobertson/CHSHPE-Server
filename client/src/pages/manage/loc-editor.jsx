import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Link } from 'react-router';

import auth from 'auth';


class LocEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.params.id || '',
            ready: false,
            update: false,
            saving: false,
            name: ''
        }
    }

    componentDidMount() {
        if (this.state.id != '') {
            auth.req('/api/loc/' + this.state.id, {
                success: (c) => {
                    this.setState({
                        ready: true,
                        update: true,
                        name: c.name
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
    }

    onChangeName(e) {
        this.setState({name: e.target.value});
    }

    save() {
        this.setState({
            saving: true
        });
        auth.req('/api/loc/' + this.state.id, {
            success: (data) => {
                /*if (data.success) {

                }*/
                browserHistory.push('/manage');
            }
        }, {
            name: this.state.name
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
            return (
                <div id="managePage">
                    <div className="card">
                        <h3>{this.state.update ? 'Edit Location' : 'New Location'}</h3>
                        <form id="manageClass">
                            <div className='input-block half'>
                                <label htmlFor="className">Location Name:</label>
                                <input type="text" id="className" placeholder='ie. "New Gym"' value={this.state.name} onChange={this.onChangeName.bind(this)}/>
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


export default LocEditor
export { LocEditor }

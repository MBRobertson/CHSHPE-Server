import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Link } from 'react-router';

import auth from 'auth';

class CatagoryView extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            classList: [],
            loaded: false
        }
        this.refreshClasses = this.refreshClasses.bind(this);
    }

    componentDidMount() {
        console.log("Class view");
        auth.req('/api/class/cat/' + this.props.params.cat, {
            success: (cList) => {
                this.setState({ classList: cList, loaded: true });
            }
        });
    }

    refreshClasses() {
        this.setState({ classList: [], loaded: false });
        auth.req('/api/class/cat/' + this.props.params.cat, {
            success: (cList) => {
                this.setState({ classList: cList, loaded: true });
            }
        });
    }

    render() {
        var classItems = (<p className="message">{this.state.loaded ? 'No classes found' : 'Loading Classes...'}</p>);


        if (this.state.classList.length > 0) {
            classItems = this.state.classList.map((c) => {
                return (<ListItem refresh={this.refreshClasses} api='class' key={c._id} id={c._id} text={ c.name + " (" + c.teacher + ")"}/>);
            })
        }

        return (
            <div id="managePage">
                <div className="card">
                    <h3>{this.props.params.cat + " Classes"}</h3>
                    <ul id="classList" className="list">
                        {classItems}
                    </ul>
                    <Link className="button" to="/manage/class/">Add Class</Link>
                    <Link className="button left" to="/manage">Back</Link>
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

export default CatagoryView
export { CatagoryView }

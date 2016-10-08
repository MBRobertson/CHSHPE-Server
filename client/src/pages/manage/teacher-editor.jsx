import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Link } from 'react-router';

import auth from 'auth';

class TeacherEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.params.id || '',
            ready: false,
            update: false,
            saving: false,
            name: '',
            code: '',
            version: ''
        }
    }

    componentDidMount() {
        if (this.state.id != '') {
            auth.req('/api/teacher/' + this.state.id, {
                success: (c) => {
                    this.setState({
                        ready: true,
                        update: true,
                        name: c.name,
                        code: c.code,
                        version: c.version
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

    onChangeCode(e) {
        this.setState({code: e.target.value});
    }

    save() {
        if (!this.state.saving) {
            this.setState({
                saving: true
            });
            auth.req('/api/teacher/' + this.state.id, {
                success: (data) => {
                    /*if (data.success) {

                    }*/
                    browserHistory.push(this.state.update ? '/manage' : ('/manage/teacher/image/' + data.id));
                }
            }, {
                name: this.state.name,
                code: this.state.code
            }, (this.state.update ? 'PUT' : 'POST'))
        }
    }

    render() {
        var imagePreview = '';
        if (this.state.update) {
            imagePreview = (
                <div className='input-block center'>
                    <label>Current Image:</label>
                    <img className="preview-image" src={"http://res.cloudinary.com/chspe/image/upload/" + this.state.version + this.state.id + ".jpg"} />
                </div>
            )
        }
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
                        <h3>{this.state.update ? 'Edit Teacher' : 'New Teacher'}</h3>
                        <form id="manageClass">
                            {imagePreview}
                            <div className='input-block half'>
                                <label htmlFor="teacherName">Teacher Name:</label>
                                <input type="text" id="teacherName" placeholder='' value={this.state.name} onChange={this.onChangeName.bind(this)}/>
                            </div>
                            <div className='input-block half'>
                                <label htmlFor="teacherCode">Teacher Code:</label>
                                <input type="text" id="teacherCode" placeholder="" value={this.state.code} onChange={this.onChangeCode.bind(this)}/>
                            </div>
                        </form>
                        <a className="button" href="#" onClick={this.save.bind(this)}>{this.state.saving ? 'Saving...' : (this.state.update ? 'Save' : 'Next') }</a>
                        {this.state.update ? (<Link className="button" to={"/manage/teacher/image/" + this.state.id}>Change Photo</Link>) : ''}
                        <Link className="button left" to="/manage">Cancel</Link>
                    </div>
                </div>
            )
        }
    }
}

export default TeacherEditor
export { TeacherEditor }

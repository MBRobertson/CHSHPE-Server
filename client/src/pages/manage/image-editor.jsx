import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Link } from 'react-router';

import auth from 'auth';

class ImageEditor extends React.Component {
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

        this.refresh = this.refresh.bind(this);
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
                ready: false,
                update: false
            });
            browserHistory.push('/manage');
        }
    }

    refresh() {
        console.log("Refresh");
        console.log(this.state.id);
        console.log('/api/teacher/' + this.state.id);
        auth.req('/api/teacher/' + this.state.id, {
            success: (c) => {
                console.log("Req success", c);
                this.setState({
                    saving: false,
                    name: c.name,
                    code: c.code,
                    version: c.version
                })
            }
        })
    }

    save() {
        if (!this.state.saving) {
            this.setState({
                saving: true
            });
            document.getElementById('manageClass').submit();
            /*auth.req('/api/teacher/' + this.state.id, {
                success: (data) => {
                    browserHistory.push(this.state.update ? '/manage' : ('/manage/teacher/image/' + data.id));
                }
            }, {
                name: this.state.name,
                code: this.state.code
            }, (this.state.update ? 'PUT' : 'POST'))*/
            console.log("#success");
        }
    }

    finishSaving() {
        /*this.setState({
            saving: false
        });*/
        this.refresh()
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
                        <h3>{this.state.ready ? ('Update - ' +  this.state.name + ' (' + this.state.code + ')') : 'Update Image'}</h3>
                        <form action={ "/api/teacher/image/" + this.state.id } method="POST" target="asyncFrame" id="manageClass" encType="multipart/form-data">
                            <div className='input-block center'>
                                <label>Current Image:</label>
                                <img className="preview-image" src={"http://res.cloudinary.com/chspe/image/upload/" + this.state.version + this.state.id + ".jpg"} />
                                <label htmlFor="teacherName">New Image:</label>
                                <input type="file" accept="image/*" name="teacherImage" id="teacherImage" />
                            </div>
                        </form>
                        <iframe style={{display: "none"}} name="asyncFrame" id="asyncFrame" src="" onLoad={this.finishSaving.bind(this)}></iframe>
                        <Link className="button" to="/manage">Done</Link>
                        <a className="button" href="#" onClick={this.save.bind(this)}>{this.state.saving ? 'Uploading...' : 'Upload' }</a>
                        <Link className="button left" to={"/manage/teacher/" + this.state.id}>Back</Link>

                    </div>
                </div>
            )
        }
    }
}

export default ImageEditor
export { ImageEditor }

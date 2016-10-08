import cookie from 'react-cookie';
import $ from 'jquery';

function setAuth() {
    //console.log("Setting header: " + "JWT " + authToken());
    //xhr.setRequestHeader('Authorization', "JWT " + authToken());
    return {
        "Authorization": "JWT " + authToken()
    }
}

function request(url, callbacks, data, method="GET") {
    $.ajax({
        url: url,
        type: method,
        data: data,
        datatype: 'json',
        headers: {
            "Authorization": "JWT " + authToken()
        },
        success: (data) => {
            if (data.name != "CastError")
                callbacks.success(data)
            else
                callbacks.error(data)
        },
        error: callbacks.error
    });
}

function authToken() {
    return (cookie.load('auth') || '');
}

function setAuth(key) {
    cookie.save('auth', key);
}

function valid() {
    return (cookie.load('auth') || '').length >= 0;
}

let auth = {
    token: authToken,
    headers: setAuth,
    set: setAuth,
    valid: valid,
    req: request
}

export default auth
export { auth as Auth }

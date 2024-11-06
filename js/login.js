import {login, refreshToken} from './connectionApi.js';

document.querySelector('.btn_submit button').addEventListener('click', async function () {
    // Lấy thông tin email và password
    const userName = document.getElementById('userName').value;
    const password = document.getElementById('password').value;

    const usernameField = document.getElementsByClassName('username')[0];
    const passwordField = document.getElementsByClassName('password')[0];

    usernameField.setCustomValidity("");
    passwordField.setCustomValidity("");

    // Kiểm tra thông tin
    if (!userName) {
        usernameField.setCustomValidity('Please enter userName.');
        usernameField.reportValidity();
        return;
    }
    if (!password) {
        passwordField.setCustomValidity('please enter password.');
        passwordField.reportValidity();
        return;
    }

    loginFun(userName, password);
});

function loginFun(userName, password) {
    fetch(login, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userName: userName, password: password})
    })
        .then(response => response.json().then(data =>{
            if (data.status === 404) {
                alert(`Login failed: ${data.message}`);
            } else if (data.code === 'SA11') {
                refreshToken();
                loginFun(userName, password);
            }else if (data.code === '00'){
                const tokens = data.data;
                const token = tokens['token'];
                const refreshToken = tokens['refreshToken']
                console.log('Token:', token);

                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);

                // Chuyển hướng đến trang home
                window.location.href = '../index.html';
            }
        }))
        .catch(error => console.error('Error:', error));
}

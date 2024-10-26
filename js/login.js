import {login} from './api.js';

document.querySelector('.btn_submit button').addEventListener('click', async function() {
    // Lấy thông tin email và password
    const userName = document.getElementById('userName').value;
    const password = document.getElementById('password').value;

    // Kiểm tra thông tin
    if (!userName || !password) {
        alert('Please enter both email and password.');
        return;
    }

    fetch(login,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: userName, password: password })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            const token = data['access_token'];
            const refreshToken = data['refresh_token']
            console.log('Token:', token);

            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);

            // Chuyển hướng đến trang home
            window.location.href = '../index.html';

        })
        .catch(error => console.error('Error:', error));
});

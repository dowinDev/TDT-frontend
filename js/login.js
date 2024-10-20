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
            const token = data.data['access_token'];  // Lưu token từ response
            console.log('Token:', token);
            // Lưu token vào localStorage hoặc sessionStorage để sử dụng sau này
            localStorage.setItem('token', token);

            // Chuyển hướng đến trang home
            window.location.href = '../index.html';

        })
        .catch(error => console.error('Error:', error));
});

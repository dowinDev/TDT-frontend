import {register, sendOtp, verifyOtp} from "./connectionApi.js";

const inputOtp = document.getElementById('otp-input');
const countDown = document.getElementById('timer');
const reSendOtp = document.getElementById('reSendOtp');
const submitOtp = document.getElementById('submitOtp');
const submitRegister = document.getElementById('submitRegister');

const info = [];

submitRegister.addEventListener('click', async function () {
    // Lấy thông tin từ các input
    info.name = document.getElementById('name').value;
    info.email = document.getElementById('email').value;
    info.password = document.getElementById('password').value;
    info.confirmPassword = document.getElementById('repeatPassword').value;
    info.check = document.getElementById('checkBox').checked;

    // Kiểm tra thông tin
    if (!checkError()) {
        return;
    }

    // Gửi ma otp toi email
    otpSend();
});

// Xử lý sự kiện gửi OTP
submitOtp.addEventListener('click', async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    const otp = inputOtp.value;

    try {
        // Gửi yêu cầu xác thực OTP
        fetch(verifyOtp, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: info.email,
                otp: otp
            }),
        })
            .then(response => response.json())
            .then(response => {
                // Kiểm tra phản hồi từ server
                const data = response.data;
                if (response.status === 200) {
                    // Xử lý nếu xác thực OTP thành công
                    alert('OTP verified successfully! Proceeding to register.');
                    // Gọi API đăng ký
                    fetch(register, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userName: info.name,
                            email: info.email,
                            password: info.password,
                            authKey: data.authKey
                        }),
                    })
                        .then(response => response.json())
                        .then(response => {
                            const data = response.data;
                            if (response.status === 200) {
                                // Đăng ký thành công
                                alert('Registration successful!');
                                const token = data['token'];
                                const refreshToken = data['refreshToken']
                                console.log('Token:', token);

                                localStorage.setItem('token', token);
                                localStorage.setItem('refreshToken', refreshToken);

                                window.location.href = '../index.html';
                            } else {
                                // Đăng ký thất bại
                                alert(data.message || 'Registration failed. Please try again.');
                            }
                        });
                } else {
                    // Xử lý nếu xác thực OTP thất bại
                    alert(data.message || 'OTP verification failed. Please try again.');
                }
            });
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while trying to verify OTP.');
    }
});

reSendOtp.addEventListener('click', async function () {
    otpSend();
})

function otpSend() {
    try {
        fetch(sendOtp, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: info.email,
            }),
        })
            .then(response => response.json())
            .then(response => {
                if (response.ok) {
                    alert('OTP has been sent to your email!');
                } else {
                    // Xử lý nếu gửi OTP thất bại
                    alert(response.message || 'Failed to send OTP. Please try again.');
                }
            });
        registerUser();
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while trying to send OTP.');
    }
}

function registerUser() {
    document.getElementById('registrationForm').classList.add('d-none');
    document.getElementById('otpSection').classList.remove('d-none');

    startTimer(60);
}

function startTimer(duration) {
    reSendOtp.classList.add('disabled');
    let timer = duration, minutes, seconds;

    const interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        seconds = seconds < 10 ? "0" + seconds : seconds;

        countDown.textContent = `Thời gian hiệu lực: ${minutes}:${seconds}`;

        if (--timer < 0) {
            clearInterval(interval);
            alert("Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.");
            reSendOtp.classList.remove('disabled');
        }
    }, 1000);
}

function checkError() {
    const nameField = document.getElementsByClassName('name')[0];
    const emailField = document.getElementsByClassName('email')[0];
    const passwordField = document.getElementsByClassName('password')[0];
    const repeatPasswordField = document.getElementsByClassName('repeatPassword')[0];
    const checkBoxField = document.getElementsByClassName('checkbox')[0];

    nameField.setCustomValidity("");
    emailField.setCustomValidity("");
    passwordField.setCustomValidity("");
    repeatPasswordField.setCustomValidity("");
    checkBoxField.setCustomValidity("");

    // Kiểm tra các trường hợp còn thiếu thông tin
    if (!info.name) {
        nameField.setCustomValidity('Please fill in UserName fields.');
        nameField.reportValidity();
        return false;
    }

    // Không cho phép khoảng trống và dấu trong username
    const namePattern = /^[a-zA-Z0-9]*$/;
    if (/\s/.test(info.name)) {
        nameField.setCustomValidity('Username must not contain spaces.');
        nameField.reportValidity();
        return false;
    }

    if (!namePattern.test(info.name)) {
        nameField.setCustomValidity('Username must not contain accented characters or special characters.');
        nameField.reportValidity();
        return false;
    }

    // Kiểm tra độ dài của tên (ví dụ, tên phải từ 2-30 ký tự)
    if (info.name.length < 2 || info.name.length > 30) {
        nameField.setCustomValidity('Name must be between 2 and 30 characters.');
        nameField.reportValidity();
        return false;
    }

    // Kiểm tra định dạng email (sử dụng regex cho định dạng email cơ bản)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(info.email) || !info.email) {
        emailField.setCustomValidity('Please enter a valid email address.');
        emailField.reportValidity();
        return false;
    }

    // Kiểm tra độ dài của mật khẩu (ví dụ, tối thiểu 8 ký tự)
    if (info.password.length < 8) {
        passwordField.setCustomValidity('Password must be at least 8 characters.');
        passwordField.reportValidity();
        return false;
    }

    // Kiểm tra ký tự đặc biệt và số trong mật khẩu
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordPattern.test(info.password) || !info.password) {
        passwordField.setCustomValidity('Password must include at least one letter, one number, and one special character or fill in password.');
        passwordField.reportValidity();
        return false;
    }

    // Kiểm tra mật khẩu trùng khớp
    if (info.password !== info.confirmPassword || !info.confirmPassword) {
        repeatPasswordField.setCustomValidity('Passwords do not match.');
        repeatPasswordField.reportValidity();
        return false;
    }

    // Kiểm tra chấp nhận các điều khoản
    if (!info.check) {
        checkBoxField.setCustomValidity('You must agree to all statements in the Terms of Service.');
        checkBoxField.reportValidity();
        return false;
    }

    return true;
}



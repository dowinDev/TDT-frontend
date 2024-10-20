document.querySelector('.Shared .btn-primary').addEventListener('click', async function() {
    // Lấy thông tin từ các input
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('repeatPassword').value;

    // Kiểm tra thông tin
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    // Gửi thông tin đến Node.js
    try {
        const response = await fetch('http://localhost:3000/register', { // Thay đổi URL nếu cần
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            }),
        });

        // Kiểm tra phản hồi từ server
        const data = await response.json();
        if (response.ok) {
            // Xử lý nếu đăng ký thành công
            alert('Registration successful!');
            console.log(data); // In ra thông tin nhận được từ server
            // Bạn có thể chuyển hướng người dùng hoặc tự động đăng nhập
        } else {
            // Xử lý nếu đăng ký thất bại
            alert(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while trying to Shared.');
    }
});
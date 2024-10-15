document.querySelector('.btn_submit button').addEventListener('click', async function() {
    // Lấy thông tin email và password
    const email = document.getElementById('form3Example3c').value;
    const password = document.getElementById('form3Example4c').value;

    // Kiểm tra thông tin
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    // Gửi thông tin đến Node.js
    try {
        const response = await fetch('http://localhost:3000/api/acounts/login', { // Thay đổi URL nếu cần
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });

        // Kiểm tra phản hồi từ server
        const data = await response.json();
        if (response.ok) {
            // Xử lý nếu đăng nhập thành công
            alert('Login successful!');
            console.log(data); // In ra thông tin nhận được từ server
            // Bạn có thể chuyển hướng người dùng hoặc lưu token ở đây
        } else {
            // Xử lý nếu đăng nhập thất bại
            alert(data.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while trying to log in.');
    }
});
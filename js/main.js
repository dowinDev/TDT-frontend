import {refresh, logOut, checkToken} from './api.js';

(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Initiate the wowjs
    new WOW().init();


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Testimonial carousel
    $(".testimonial-carousel-1").owlCarousel({
        loop: true,
        dots: false,
        margin: 25,
        autoplay: true,
        slideTransition: 'linear',
        autoplayTimeout: 0,
        autoplaySpeed: 10000,
        autoplayHoverPause: false,
        responsive: {
            0: {
                items: 1
            },
            575: {
                items: 1
            },
            767: {
                items: 2
            },
            991: {
                items: 3
            }
        }
    });

    $(".testimonial-carousel-2").owlCarousel({
        loop: true,
        dots: false,
        rtl: true,
        margin: 25,
        autoplay: true,
        slideTransition: 'linear',
        autoplayTimeout: 0,
        autoplaySpeed: 10000,
        autoplayHoverPause: false,
        responsive: {
            0: {
                items: 1
            },
            575: {
                items: 1
            },
            767: {
                items: 2
            },
            991: {
                items: 3
            }
        }
    });

})(jQuery);

let isLoggedIn = false;
let search;

function loadHeaderAndFooter() {
    fetch('../Shared/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data; // Chèn nội dung vào #header

            search = document.getElementById("searchButton");
            handlePageLoad();
            document.dispatchEvent(new Event('mainLoaded'));

            // Login button functionality
            document.getElementById("login-btn").addEventListener("click", function () {
                logout();
            });
            // Kiểm tra trạng thái đăng nhập và cập nhật nút khi tải trang
            const token = localStorage.getItem("token");
            isLoggedIn = token !== null;
            updateLoginButton();
        })
        .catch(error => console.error('Error loading header:', error));

    fetch('../Shared/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data; // Chèn nội dung vào #footer
        })
        .catch(error => console.error('Error loading footer:', error));
    fetchData();
}

function loadContent(page, url) {
    buttonSearch();
    fetch(url)
        .then(response => response.text())
        .then(data => {
            if (window.location.pathname !== url) {
                window.location.href = url; // Chèn nội dung vào #content
            } else {
                updateActiveLink(page); // Cập nhật class active cho liên kết
                console.log('success');
            }
        })
        .catch(error => console.error('Error loading content:', error));
}

window.onpopstate = function (event) {
    if (event.state && event.state.path) {
        loadHeaderAndFooter(); // Tải lại header và footer
        loadContent(event.state.path, event.state.path); // Tải lại nội dung khi nhấn Back/Forward
        updateActiveLink(event.state.path); // Cập nhật class active cho liên kết
    }
};

// Hàm cập nhật class active cho liên kết
function updateActiveLink(url) {
    const links = document.querySelectorAll('nav a');
    links.forEach(link => link.classList.remove('active')); // Xóa class active khỏi tất cả liên kết

    // Thêm class active cho liên kết tương ứng với URL hiện tại
    switch (url) {
        case '/blog':
            document.getElementById('blog-link').classList.add('active');
            break;
        case '/contact':
            document.getElementById('contact-link').classList.add('active');
            break;
        case '/map':
            document.getElementById('map-link').classList.add('active');
            break;
        case '/event':
            document.getElementById('event-link').classList.add('active');
            break;
        default:
            document.getElementById('home-link').classList.add('active');
            break;
    }
}

// Hàm xử lý khi trang được reload hoặc tải lần đầu
function handlePageLoad() {
    //  loadHeaderAndFooter();
    const path = window.location.pathname;  // Lấy đường dẫn hiện tại
    switch (path) {
        case '/page/blog.html':
            loadContent('/blog', '/page/blog.html');
            break;
        case '/page/contact.html':
            loadContent('/contact', '/page/contact.html');
            break;
        case '/page/map.html':
            loadContent('/map', '/page/map.html');
            break;
        case '/page/event.html':
            loadContent('/event', '/page/event.html');
            break;
        case'/page/blog2.html':
            loadContent('/blog', '/page/blog2.html');
            break;
        case'/index.html#':
            break;
        default:
            loadContent('/home', '/index.html');
            break;
    }
}

// Update login button icon
function updateLoginButton() {
    const loginBtn = document.getElementById("login-btn");
    if (isLoggedIn) {
        loginBtn.innerHTML = "&#128100;";
    } else {
        loginBtn.innerHTML = "Login/Register";
    }
}

function buttonSearch() {

    search.addEventListener("click", function () {
        const input = document.getElementById("searchInput");
        if (input.classList.contains("show")) {
            input.classList.remove("show");
        } else {
            input.classList.add("show");
            input.focus(); // focus vào input khi thanh được mở
        }
    });
}

function logout() {
    if (isLoggedIn) {
        isLoggedIn = false;
        localStorage.removeItem("token");
        document.getElementById("login-btn").innerHTML = "Login";
    } else {
        window.location.href = "login.html";
    }
}
// Hàm fetch API với cơ chế tự động làm mới access token
async function fetchWithRefreshToken(url, options = {}) {
    try {
        const token = localStorage.getItem('token');
        options.headers = {
            headers: {'Authorization': `Bearer ${token}`},
        }
        // Thực hiện request API với access token hiện tại
        let response = await fetch(url, options);

        // Kiểm tra nếu token hết hạn (401 Unauthorized)
        if (response.status === 401) {
            // Thực hiện làm mới access token bằng refresh token
            const refreshToken = localStorage.getItem('refreshToken'); // Hoặc từ cookie nếu lưu ở đó
            await fetch(refresh, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken }),
            })
                .then(response => response.json())
                .then(response => {
                    // Kiểm tra nếu refresh token hợp lệ
                    if (response.status === 200) {
                        const newAccessToken = response.data;

                        // Cập nhật access token mới vào localStorage
                        localStorage.setItem('token', newAccessToken);
                    } else {
                        // Xử lý nếu refresh token hết hạn hoặc không hợp lệ
                        console.error('Refresh token expired or invalid');
                        window.location.href = '../page/login.html';
                    }
                });
        }
        return response;
    } catch (error) {
        console.error('Error in fetchWithRefreshToken:', error);
        throw error;
    }
}

// Sử dụng fetchWithRefreshToken
function fetchData() {
    try {
        const response = fetchWithRefreshToken(checkToken, {
            method: 'POST',
        });

        if (response.ok) {
            const data = response.json();
            console.log('Data:', data);
        } else {
            console.error('Failed to fetch data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


window.onload = function (){
    loadHeaderAndFooter();
};
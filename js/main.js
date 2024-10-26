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
}

function loadContent(page, url) {
    buttonSearch(page);
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

function buttonSearch(page) {

    search.addEventListener("click", function () {
        const input = document.getElementById("searchInput");
        if (input.classList.contains("show")) {
            input.classList.remove("show");
        } else {
            input.classList.add("show");
            input.focus(); // focus vào input khi thanh được mở
        }
    });

    if (page === '/map') {
        // document.getElementById('searchInput').addEventListener('keydown', function (event) {
        //     if (event.key === 'Enter') { // Kiểm tra nếu phím nhấn là Enter
        //         const query = document.getElementById('searchInput').value.trim(); // Lấy giá trị và loại bỏ khoảng trắng
        //
        //         if (query === '') {
        //             // Nếu ô nhập liệu trống, không gửi yêu cầu và không thông báo
        //             return; // Kết thúc hàm nếu không có giá trị
        //         }
        //         searchLocation(query); // Gọi hàm tìm kiếm nếu có giá trị
        //         document.getElementById('searchInput').value = ''; // Xóa giá trị trong ô tìm kiếm
        //     }
        // });

    }
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

window.onload = function (){
    loadHeaderAndFooter();
};
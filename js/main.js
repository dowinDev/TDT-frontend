// Imports và khởi tạo biến
import {checkToken, logOut, refresh} from './connectionApi.js';

const localToken = localStorage.getItem('token');
const localRefreshToken = localStorage.getItem('refreshToken');
let isLoggedIn = false;
let search;

// Utility Functions
function spinner() {
    setTimeout(() => {
        if ($('#spinner').length > 0) {
            $('#spinner').removeClass('show');
        }
    }, 1);
}

function updateActiveLink(url) {
    const links = document.querySelectorAll('nav a');
    links.forEach(link => link.classList.remove('active'));
    const linkIdMap = {
        '/blog': 'blog-link',
        '/contact': 'contact-link',
        '/map': 'map-link',
        '/event': 'event-link'
    };
    const activeLink = linkIdMap[url] || 'home-link';
    document.getElementById(activeLink).classList.add('active');
}

function buttonSearch() {
    search.addEventListener("click", () => {
        const input = document.getElementById("searchInput");
        input.classList.toggle("show");
        input.focus();
    });
}

// Spinner, animation, carousel, and counter init
(function ($) {
    "use strict";
    spinner();
    new WOW().init();
    // Back to top button
    $(window).scroll(() => {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(() => {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    // Modal Video handling
    $(document).ready(() => {
        let $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        $('#videoModal').on('shown.bs.modal', () => {
            $("#video").attr('src', `${$videoSrc}?autoplay=1&amp;modestbranding=1&amp;showinfo=0`);
        });
        $('#videoModal').on('hide.bs.modal', () => {
            $("#video").attr('src', $videoSrc);
        });
    });
    // Counter up, carousel initializations
    $('[data-toggle="counter-up"]').counterUp({delay: 10, time: 2000});
    $(".testimonial-carousel-1, .testimonial-carousel-2").each(function () {
        $(this).owlCarousel({
            loop: true,
            dots: false,
            autoplay: true,
            slideTransition: 'linear',
            autoplayTimeout: 0,
            autoplaySpeed: 10000,
            autoplayHoverPause: false,
            margin: 25,
            rtl: $(this).hasClass('testimonial-carousel-2'),
            responsive: {0: {items: 1}, 575: {items: 1}, 767: {items: 2}, 991: {items: 3}}
        });
    });
})(jQuery);

// Header and Footer loading
function loadHeaderAndFooter() {
    fetch('../Shared/header.html').then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
            search = document.getElementById("searchButton");
            handlePageLoad();
            document.dispatchEvent(new Event('mainLoaded'));
            document.getElementById("login-btn").addEventListener("click", logout);
            isLoggedIn = localToken !== null;
            updateLoginButton();
        }).catch(error => console.error('Error loading header:', error));
    fetch('../Shared/footer.html').then(response => response.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
    fetchData();
}

function loadContent(page, url) {
    buttonSearch();
    fetch(url).then(response => response.text())
        .then(data => {
            if (window.location.pathname !== url) {
                history.pushState({ path: page }, '', page);
            } else {
                updateActiveLink(page);
            }
        }).catch(error => console.error('Error loading content:', error));
}

window.onpopstate = event => {
    if (event.state && event.state.path) {
        loadHeaderAndFooter();
        loadContent(event.state.path, event.state.path);
        updateActiveLink(event.state.path);
    }
};

// Page load handler
function handlePageLoad() {
    const path = window.location.pathname;
    const pageMap = {
        '/page/blog.html': '/blog',
        '/page/contact.html': '/contact',
        '/page/map.html': '/map',
        '/page/event.html': '/event',
        '/page/blog2.html': '/blog',
    };
    loadContent(pageMap[path] || '/home', path);
}

// Login and Logout handling
function updateLoginButton() {
    const loginBtn = document.getElementById("login-btn");
    loginBtn.innerHTML = isLoggedIn ? "&#128100;" : "Login/Register";
}

async function logout() {
    if (isLoggedIn) {
        isLoggedIn = false;
        await fetch(logOut, {
            method: 'POST',
            headers: {'Authorization': `Bearer ${localToken}`, 'Content-Type': 'application/json'}
        })
            .then(() => {
                localStorage.removeItem("token");
                document.getElementById("login-btn").innerHTML = "Login/Register";
            });
    } else {
        window.location.href = "login.html";
    }
}

async function fetchWithRefreshToken(url, options = {}) {
    try {
        options.headers = {'Authorization': `Bearer ${localToken}`};
        let response = await fetch(url, options);
        if (response.status === 403) {
            await fetch(refresh, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({refreshToken: localRefreshToken})
            })
                .then(res => res.json())
                .then(res => {
                    if (res.status === 200) {
                        const newAccessToken = res.data;
                        localStorage.setItem('token', newAccessToken);
                    } else {
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

// Fetch data using fetchWithRefreshToken
function fetchData() {
    try {
        fetchWithRefreshToken(checkToken, {method: 'POST'}).then(response => {
            if (response.ok) {
                response.json().then(data => console.log('Data:', data));
            } else {
                console.error('Failed to fetch data:', response.status);
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// On window load
window.onload = loadHeaderAndFooter;

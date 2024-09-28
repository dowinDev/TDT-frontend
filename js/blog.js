function toggleDropdown() {
    document.getElementById("dropdown-menu").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.fa-user') && !event.target.matches('.fa-caret-down')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

let currentIndex = 0;

function moveSlider(direction) {
    const sliderWrapper = document.getElementById('sliderWrapper');
    const items = document.querySelectorAll('.slider-item');
    const totalItems = items.length;
    const itemsPerView = 3; // Hiển thị 3 item mỗi lần

    // Tính toán vị trí mới
    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = totalItems - itemsPerView; // Vòng lặp ngược lại về cuối
    } else if (currentIndex >= totalItems - itemsPerView + 1) {
        currentIndex = 0; // Vòng lặp lại về đầu
    }

    const offset = -(currentIndex * 100 / itemsPerView);
    sliderWrapper.style.transform = `translateX(${offset}%)`;
}

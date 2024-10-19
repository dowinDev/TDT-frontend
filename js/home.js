// Lấy thông tin sản phẩm từ LocalStorage
import {products} from "./api.js";

let currentPage = 1;
const limit = 5;

let totalPages = 1;

// Hàm tải sản phẩm
function loadProducts(page) {
    const productsUrl = products + `?page=${page}&limit=${limit}`;
    fetch(productsUrl)
        .then(response => response.json())
        .then(data => {
            // Lấy danh sách sản phẩm từ thuộc tính 'content'
            const products = data.data.content;

            // Kiểm tra xem dữ liệu trả về từ API có phải là mảng không
            if (Array.isArray(products)) {
                // Xóa dữ liệu cũ
                document.getElementById('productList').innerHTML = '';

                // Kiểm tra xem có sản phẩm không
                if (products.length > 0) {
                    products.forEach(product => {
                        document.getElementById('productList').innerHTML += createProductHTML(product);
                    });
                } else {
                    document.getElementById('productList').innerHTML = '<p>No product to display.</p>';
                }

                // Cập nhật nút phân trang
                updatePagination(data.data);
                product();
            } else {
                console.error('Fetched content is not an array.');
            }
        })
        .catch(error => {
            alert('An error occurred while fetching the products. Please try again later.');
            console.error('Error:', error);
        });
}

// Hàm cập nhật phân trang
function updatePagination(data) {
    const paginationElement = document.getElementById('pagination');
    totalPages = data.totalPages;

    paginationElement.innerHTML = '';

    const previousClass = data.hasPrevious ? 'page-item' : 'page-item disabled';
    paginationElement.innerHTML += `
        <li class="${previousClass}">
            <a class="page-link" href="#" style="cursor: pointer" id="previous">Previous</a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'page-item active' : 'page-item';
        paginationElement.innerHTML += `
            <li class="${activeClass}">
                <a class="page-link" href="#" style="cursor: pointer" data-page="${i}">${i}</a>
            </li>
        `;
    }

    // Nút Next
    const nextClass = data.hasNext ? 'page-item' : 'page-item disabled';
    paginationElement.innerHTML += `
        <li class="${nextClass}">
            <a class="page-link" href="#" style="cursor: pointer" id="next">Next</a>
        </li>
    `;
}

function product () {
    const paginationLinks = document.querySelectorAll('.pagination .page-link');

// Gán sự kiện click cho mỗi liên kết
    paginationLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định khi nhấn vào liên kết

            // Lấy số trang từ thuộc tính data-page
            const page = parseInt(this.getAttribute('data-page'));

            // Kiểm tra nếu có giá trị trang hợp lệ
            if (!isNaN(page)) {
                changePage(page);
            }
        });
    });

    document.getElementById('next').addEventListener('click', function (event) {
        event.preventDefault();
        if (currentPage < totalPages) {
            changePage(currentPage + 1);
        }
    });

    document.getElementById('previous').addEventListener('click', function (evnet){
        evnet.preventDefault();
        if(currentPage > 1){
            changePage(currentPage - 1);
        }
    });
}

// Hàm thay đổi trang
function changePage(page) {
    if (page < 1 || page > totalPages) return; // Kiểm tra nếu trang ngoài phạm vi
    currentPage = page;
    loadProducts(currentPage); // Tải lại sản phẩm cho trang mới
}

// Hàm tạo HTML cho sản phẩm
function createProductHTML(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="Product Image" class="product-image">
            <div class="product-info">
                <h3>${product.nameProduct}</h3>
                <p><strong>Quantity:</strong> ${product.quantity}</p>
                <p class="price">${product.price}</p>
                <button class="button">Order Now</button>
            </div>
        </div>
    `;
}

// Tải sản phẩm lần đầu
loadProducts(currentPage);
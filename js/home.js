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
                orderNow();
            } else {
                console.error('Fetched content is not an array.');
            }
        })
        .catch(error => {
            alert('An error occurred while fetching the products. Please try again later.');
            console.error('Error:', error);
        });
}

function loadProductById(id) {
    const quick = document.getElementById('quick-view');
    const overlay = document.getElementById('overlay');
    const token = localStorage.getItem('token');

    fetch(products + `/${id}`, {
        headers: {'Authorization': `Bearer ${token}`},
    })
        .then(response => response.json())
        .then(data => {
            const product = data.data;

            if (product) {
                quick.innerHTML = '';

                quick.style.display = 'block';
                overlay.style.display = 'block';

                quick.innerHTML = createQuickView(product);
            } else {
                console.error('Fetched data is not an product.');
            }
        })
        .catch(error => {
            alert('An error occurred while fetching the product. Please try again later.');
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

function orderNow() {
    document.querySelectorAll('#btn-orderNow').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định nếu có
            const productId = this.value; // Lấy productId từ thuộc tính value của nút
            console.log('Product ID:', productId);
            loadProductById(productId); // Gọi hàm tạo Quick View với productId
        });
    });
}

function product() {
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

    document.getElementById('previous').addEventListener('click', function (evnet) {
        evnet.preventDefault();
        if (currentPage > 1) {
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
                <button id="btn-orderNow" class="button" value="${product.id}">Order Now</button>
            </div>
        </div>
    `;
}

function createQuickView(product) {
    return `<div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <a href="#" data-dismiss="modal" class="class pull-right"><span class="glyphicon glyphicon-remove"></span></a>
                <h3 class="modal-title">${product.nameProduct}</h3>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6 product_img">
                        <img src="${product.image}" class="img-responsive">
                    </div>
                    <div class="col-md-6 product_content">
                        <h4>Product Id: <span>CD${product.id}</span></h4>
                        <div class="rating">
                            <span class="glyphicon glyphicon-star"></span>
                            <span class="glyphicon glyphicon-star"></span>
                            <span class="glyphicon glyphicon-star"></span>
                            <span class="glyphicon glyphicon-star"></span>
                            <span class="glyphicon glyphicon-star"></span>
                            (10 reviews)
                        </div>
                        <p>${product.description}</p>
                        <h3 class="cost"></span> ${product.price}đ</h3><p class="price">${product.price}</p>
                        
                        <p><strong>Quantity Available:</strong> ${product.quantity}</p>
                        <!-- Thêm input cho số lượng mua -->
                        <label for="quantityInput-${product.id}">Enter Quantity to Buy:</label>
                        <input type="number" id="quantityInput-${product.id}" name="quantity" min="1" max="${product.quantity}" value="1" class="quantity-input">
                        
                        <p for="${product.eatery.id}"><strong>Store:</strong> ${product.eatery.nameStore}</p>
                        <p><strong>Phone:</strong> ${product.contact}</p>
                        <p><strong>expiration Date:</strong> ${product.expirationDate}</p>
                        <div class="space-ten"></div>
                        <div class="btn-ground">
                            <button type="button" class="btn btn-primary"><span class="glyphicon glyphicon-shopping-cart"></span> Add To Cart</button>
                            <button type="button" class="btn btn-primary"><span class="glyphicon glyphicon-heart"></span> Add To Wishlist</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// Tải sản phẩm lần đầu
loadProducts(currentPage);
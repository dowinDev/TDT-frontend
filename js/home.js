import {products, limitProduct, refreshToken} from "./connectionApi.js";

let currentPage = 1;
const limit = limitProduct;

let totalPages = 1;

// Hàm để lấy query parameters từ URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function removeQueryParam(param) {
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.replaceState({}, document.title, url);
}

function close() {
    document.getElementById("close-btn").addEventListener("click", function () {
        removeQueryParam('id');
    });
}

// Lấy ID sản phẩm từ URL
const productId = getQueryParam('id');

// Hàm tải sản phẩm
function loadProducts(page) {
    if (productId != null) {
        loadProductById(productId);
    }
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

function orderNow() {
    document.querySelectorAll('#btn-orderNow').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định nếu có
            const productId = this.value; // Lấy productId từ thuộc tính value của nút
            console.log('Product ID:', productId);
            loadProductById(productId);
        });
    });
}

let checkLoadProduct = false;

function loadProductById(id) {
    const token = localStorage.getItem('token');

    fetch(products + `/${id}`, {
        headers: {'Authorization': `Bearer ${token}`},
    })
        .then(response => response.json().then(data => {
            if (data.code === 'SA11') {
                if (!checkLoadProduct) {
                    refreshToken();
                    checkLoadProduct = true;
                    loadProductById(id);
                } else {}
            } else if (data.code === '00') {
                const product = data.data;

                if (product) {
                    openProductDetail(product);
                } else {
                    console.error('Fetched data is not an product.');
                }
            } else {
                console.error('cannot get product: ' + id);
            }
        }))
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

function openProductDetail(product) {
    // Hiển thị thông tin sản phẩm vào modal
    document.getElementById('productDetail').innerHTML = createProductDetail(product);
    initializeMap(product.eatery.location);
    document.dispatchEvent(new Event('reviewLoaded'));
    close();

    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById("productDetailModal"));
    modal.show();
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
                <p class="price">${product.price === "Free" ? "Free" :
        Number(product.price).toLocaleString("de-DE") + " đ"}</p>
                <p><strong>Store:</strong> ${product.eatery.nameStore}</p>
                <button id="btn-orderNow" class="button" value="${product.id}">Order Now</button>
            </div>
        </div>
    `;
}

function createProductDetail(product) {
    const [longitude, latitude] = product.eatery.location.split(',').map(coord => coord.trim());
    return `<div class="modal-header">
                <h5 class="modal-title fw-bold" id="productDetailLabel" value="${product.id}">Product detail</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="container py-4">
                    <div class="row">
                        <div class="col-lg-6">
                            <img src="${product.image}" class="img-fluid" alt="Product Image">
                        </div>
                        <div class="col-lg-6">
                            <h2 class="fw-bold">${product.nameProduct}</h2>
                            <p class="text-muted">Quantity: ${product.quantity}</p>
                            <h3 class="my-4">${
        product.price === "Free" ? "Free" :
            Number(product.price).toLocaleString("de-DE") + " đ"
    }</h3>
                            <p class="mb-4">HSD: ${product.expirationDate}</p>
                            <div class="d-flex gap-3 mb-4">
                                <input type="number" class="form-control" value="1" style="max-width: 80px;">
                                <button class="btn btn-primary" type="button">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                    <ul class="nav nav-tabs mt-5" id="productTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="description-tab" data-bs-toggle="tab"
                                    data-bs-target="#description"
                                    type="button" role="tab" aria-controls="description" aria-selected="true">
                                Description
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="specs-tab" data-bs-toggle="tab" data-bs-target="#specs"
                                    type="button"
                                    role="tab" aria-controls="specs" aria-selected="false">Specifications
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews"
                                    type="button"
                                    role="tab" aria-controls="reviews" aria-selected="false">Reviews
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button data-mdb-tab-init class="nav-link" id="map-tab"
                                    data-bs-toggle="tab" data-bs-target="#maps" type="button"
                                    role="tab" aria-controls="map" aria-selected="false">Map
                            </button>
                        </li>
                    </ul>
                    <div class="tab-content" id="productTabContent" style="overflow: hidden;">
                        <div class="tab-pane fade show active" id="description" role="tabpanel"
                             aria-labelledby="description-tab">
                            <p class="mt-3">${product.description} </p>
                        </div>
                        <div class="tab-pane fade" id="specs" role="tabpanel" aria-labelledby="specs-tab">
                            <table class="table mt-3">
                                <tr>
                                    <th><span value="${product.eatery.id}">Store</span></th>
                                    <td>${product.eatery.nameStore}</td>
                                </tr>
                                <tr>
                                    <th>Phone</th>
                                    <td>${product.contact}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                            <div class="mt-3">
                                <div class="text-end">
                                    <th><span id="productSpan" value="${product.id}"></span></th>
                                    <button class="btn btn-success" id="open-review-box">Comments</button>
                                </div>
                                <div id="post-review-box" style="display: none;">
                                    <form accept-charset="UTF-8" action="" method="post">
                                        <input id="ratings-hidden" name="rating" type="hidden">
                                        <textarea class="form-control mb-3" id="new-review" name="comment"
                                                  placeholder="Enter your review here..." rows="4"></textarea>
                                        <div class="star-rating d-flex justify-content-end gap-2" style="margin-bottom: 10px">
                                            <i class="far fa-star" id="star1" data-value="1"></i>
                                            <i class="far fa-star" id="star2" data-value="2"></i>
                                            <i class="far fa-star" id="star3" data-value="3"></i>
                                            <i class="far fa-star" id="star4" data-value="4"></i>
                                            <i class="far fa-star" id="star5" data-value="5"></i>
                                        </div>
                                        <div class="d-flex justify-content-end gap-2">
                                            <button class="btn btn-danger btn-sm" id="close-review-box">Cancel</button>
                                            <button id="save-comment" class="btn btn-success" type="button">Save</button>
                                        </div>
                                    </form>
                                </div>
                                <div id="card-comment"></div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="maps" role="tabpanel" aria-labelledby="map-tab">
                            <div class="mt-4 tabs-mapping">
                                <div class="top">
                                    <p>location: <span>${product.eatery.nameStore}</span></p>
                                </div>
                                <div class="bottom">
                                    <a href="https://www.google.com/maps?q=${latitude},${longitude}">
                                        <div id="formMap"></div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="close-btn" data-bs-dismiss="modal">Close</button>
            </div>`;
}

function initializeMap(location) {

    document.addEventListener('shown.bs.tab', (event) => {
        if (event.target.id === 'map-tab') {
            const [longitude, latitude] = location.split(',').map(coord => coord.trim());

            tt.setProductInfo('MyMapApp', '1.0');

            const markerPosition = [longitude, latitude];
            const zoomThresholdDistance = 500;

            // Khởi tạo bản đồ
            const map = tt.map({
                key: 'szTHucPplAtuPjuDVkmfgcuJqgemDk6y',
                container: 'formMap',
                center: markerPosition,
                zoom: 12,
                scrollZoom: false,
            });

            // Thêm điều khiển zoom và một marker vào bản đồ
            map.addControl(new tt.NavigationControl());
            new tt.Marker().setLngLat(markerPosition).addTo(map);

            // Kích hoạt scrollZoom khi con trỏ gần marker
            map.on('mousemove', (event) => {
                const distanceToMarker = tt.LngLat.convert(markerPosition).distanceTo(event.lngLat);
                if (distanceToMarker <= zoomThresholdDistance) {
                    map.scrollZoom.enable();  // Cho phép cuộn zoom gần marker
                } else {
                    map.scrollZoom.disable(); // Tắt cuộn zoom khi ra khỏi phạm vi
                }
            });
        }
    });
}

// Tải sản phẩm lần đầu
loadProducts(currentPage);
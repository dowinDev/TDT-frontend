import {products, refreshToken} from './connectionApi.js';

document.addEventListener('mainLoaded', function () {
    console.log("Map.js executed after main.js");
    // Code của map.js sẽ chạy sau khi main.js đã tải xong

    fetchLocations();
});
// Đoạn code thiết lập bản đồ
tt.setProductInfo('FoodSharing', '1.0');
const map = tt.map({
    key: 'szTHucPplAtuPjuDVkmfgcuJqgemDk6y',  // API Key của bạn
    container: 'map',
    center: [105.8342, 21.0278],  // Tọa độ trung tâm (Hà Nội)
    zoom: 12
});

// Function tìm kiếm địa điểm
function searchLocation(query) {
    const apiKey = 'szTHucPplAtuPjuDVkmfgcuJqgemDk6y';
    const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(query)}.json?key=${apiKey}`;
    fetch(url)
        .then(response => response.json().then(data => {
            if (data.results && data.results.length > 1) {
                const firstResult = data.results[0];
                const location = {
                    lng: firstResult.position.lon,
                    lat: firstResult.position.lat,
                };
                map.setCenter(location);
                map.setZoom(14);
            } else {
                alert('No location found.');
            }
        }))
        .catch(error => {
            console.error('An error occurred:', error);
        });
}

// Thêm control điều khiển bản đồ
map.addControl(new tt.NavigationControl());
var markers = [];
var currentLocation;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        currentLocation = {
            lng: position.coords.longitude,
            lat: position.coords.latitude
        };
        var currentMarker = new tt.Marker({element: createMarkerElement()})
            .setLngLat(currentLocation)
            .addTo(map);
        map.setCenter(currentLocation);
        map.setZoom(14);
        document.getElementById('info').innerHTML = 'Current location: ' + currentLocation.lat + ', ' + currentLocation.lng;
    }, function () {
        alert('Unable to get current location.');
    });
} else {
    alert('Your browser does not support Geolocation. Please open the website in another browser.');
}

// Sự kiện click để lấy vị trí hiện tại
document.getElementById('currentLocationButton').addEventListener('click', function () {
    if (currentLocation) {
        map.setCenter(currentLocation);
        map.setZoom(14);
    } else {
        alert('Please wait for current location to be retrieved.');
    }
});

// Tạo phần tử marker
function createMarkerElement() {
    var markerDiv = document.createElement('div');
    markerDiv.className = 'marker';
    return markerDiv;
}

let selectedLat, selectedLng;
//Xử lý sự kiện click trên bản đồ
map.on('click', function (event) {
    const lngLat = event.lngLat;
    selectedLat = lngLat.lat;
    selectedLng = lngLat.lng;

    document.getElementById('info').innerHTML = 'Coordinates clicked: ' + '<br>' + selectedLat + '<br>' + selectedLng + '<button id="infomation_form">Add</button>';

    document.getElementById('infomation_form').addEventListener('click', function () {
        let form = document.getElementById('formmon');
        let infoDiv = document.getElementById('info');
        form.style.display = 'block';
        infoDiv.style.display = 'block';
    });
    // Tạo một marker mới tại vị trí đã nhấp
    const newMarker = new tt.Marker().setLngLat(lngLat).addTo(map);
    markers.push(newMarker);

    let form = document.getElementById('info');
    let overlay = document.getElementById('overlay');
    let formon = document.getElementById('formmon');

    form.style.display = 'block';
    overlay.style.display = 'block';

    // thoát khỏi màn info
    overlay.addEventListener('click', () => {
        overlay.style.display = 'none'; // Ẩn overlay
        form.style.display = 'none'; // Ẩn info
        formon.style.display = 'none';

        newMarker.remove();
        fetchLocations();
    });
});


// Xử lý submit form
document.getElementById('formmon').addEventListener('submit', function (event) {
    event.preventDefault();

    const nameStore = document.getElementById('storeName').value;
    const phone = document.getElementById('storePhone').value;
    const nameProduct = document.getElementById('foodName').value;
    const quantity = document.getElementById('quantity').value;
    const priceOption = document.getElementById('price_option').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const imageUpload = document.getElementById('imageUpload').files[0];

    const formData = new FormData();
    formData.append('image', imageUpload);
    formData.append('nameStore', nameStore);
    formData.append('phone', phone);
    formData.append('nameProduct', nameProduct);
    formData.append('quantity', quantity);
    formData.append('description', description);
    formData.append('price', priceOption === 'free' ? 'Free' : price);
    formData.append('location', selectedLng + ", " + selectedLat)


    if (!imageUpload) {
        alert("Please upload an image.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {

        postProduct(formData)
    };

    reader.readAsDataURL(imageUpload);
});

// Gọi API POST để lưu trữ thông tin
let count = 1;

function postProduct(formData) {
    const token = localStorage.getItem('token');
    fetch(products, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    })
        .then(response => response.json().then(data => {
            if (data.code === 'SA11') {
                if (count === 2) {
                    refreshToken();
                    count = 2;
                    postProduct(formData);
                } else {
                    alert('You don\'t have account');
                }
            } else if (data.code === '00') {
                alert('Product information has been successfully saved!');
            } else {
                alert('Failed to save product information. Error: You don\'t have account');
            }
            map.flyTo({center: [selectedLng, selectedLat], zoom: 15});
            document.getElementById('formmon').reset();
            location.reload();
        }))
        .catch(error => {
            alert('Failed to save product information.');
            console.error('Error:', error);
        });
}

// Gọi API GET để lấy dữ liệu và lưu vào localStorage
function fetchLocations() {

    fetch(products)
        .then(response => response.json().then(data => {
            if (data.code === 'SA11') {
                refreshToken();
                fetchLocations();
            } else if (data.code === '00') {
                // Lấy danh sách sản phẩm từ thuộc tính 'content'
                const products = data.data.content;

                // Kiểm tra xem dữ liệu trả về từ API có phải là mảng không
                if (Array.isArray(products)) {
                    // Lưu dữ liệu vào localStorage
                    localStorage.setItem('locations', JSON.stringify(products));

                    // Hiển thị các sản phẩm đã lưu
                    displayProducts(products);
                } else {
                    console.error('Fetched content is not an array.');
                }
            }
        }))
        .then(data => {

        })
        .catch(error => {
            alert('Failed to fetch locations.');
            console.error('Error:', error);
        });
    document.getElementById('searchInput').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') { // Kiểm tra nếu phím nhấn là Enter
            const query = document.getElementById('searchInput').value.trim(); // Lấy giá trị và loại bỏ khoảng trắng

            if (query === '') {
                // Nếu ô nhập liệu trống, không gửi yêu cầu và không thông báo
                return; // Kết thúc hàm nếu không có giá trị
            }
            searchLocation(query); // Gọi hàm tìm kiếm nếu có giá trị
            document.getElementById('searchInput').value = ''; // Xóa giá trị trong ô tìm kiếm
        }
    });
}

// Hàm hiển thị sản phẩm ra HTML
function displayProducts(data) {
    data.forEach(product => {
        // Tạo marker và popup
        const [longitude, latitude] = product.eatery.location.split(',').map(coord => coord.trim());
        const marker = new tt.Marker().setLngLat([longitude, latitude]).addTo(map);

        const popupContent = `
            Thực phẩm: ${product.nameProduct}<br>
            Giá: ${product.price}<br>
            <a href="../index.html?id=${product.id}"><img class="popup-image" src="${product.image}" alt="${product.nameProduct}"></a>
        `;
        var popup = new tt.Popup({offset: 35}).setHTML(popupContent);
        marker.setPopup(popup).togglePopup();
    });
}





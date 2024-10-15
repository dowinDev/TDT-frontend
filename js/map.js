tt.setProductInfo('FoodSharing', '1.0');
var map = tt.map({
    key: 'szTHucPplAtuPjuDVkmfgcuJqgemDk6y',  // API Key của bạn
    container: 'map',
    center: [105.8342, 21.0278],  // Tọa độ trung tâm ( Hà Nội)
    zoom: 12
});


// fuction tìm kiếm start 
document.getElementById('searchButton').addEventListener('click', function () {
    var query = document.getElementById('searchInput').value.trim(); // Lấy giá trị và loại bỏ khoảng trắng

    if (query === '') {
        // Nếu ô nhập liệu trống, không gửi yêu cầu và không thông báo
        return; // Kết thúc hàm nếu không có giá trị
    }
    searchLocation(query); // Gọi hàm tìm kiếm nếu có giá trị
    document.getElementById('searchInput').value = '';

});
function searchLocation(query) {
    var apiKey = 'szTHucPplAtuPjuDVkmfgcuJqgemDk6y';
    var url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(query)}.json?key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 1) {
                var firstResult = data.results[0];
                var location = {
                    lng: firstResult.position.lon,
                    lat: firstResult.position.lat,
                };
                map.setCenter(location);
                map.setZoom(14);
            } else {
                alert('Không tìm thấy địa điểm nào.');
            }
        })
        .catch(error => {
            console.error('Có lỗi xảy ra:', error);
        });
}
// fuction tìm kiếm end 
// Thêm control để điều khiển bản đồ
map.addControl(new tt.NavigationControl());
var markers = []; // Mảng để lưu trữ các marker đã được thêm
var currentLocation; // Biến để lưu trữ vị trí hiện tại
// Đánh dấu vị trí hiện tại của người dùng
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        currentLocation = {
            lng: position.coords.longitude,
            lat: position.coords.latitude
        };
        // Hiển thị vị trí hiện tại
        var currentMarker = new tt.Marker({ element: createMarkerElement() })
            .setLngLat(currentLocation)
            .addTo(map);
        map.setCenter(currentLocation); // Đặt trung tâm bản đồ vào vị trí hiện tại
        map.setZoom(14); // Đặt zoom lớn hơn để dễ thấy vị trí
        // Hiển thị thông tin tọa độ hiện tại
        var infoDiv = document.getElementById('info');
        infoDiv.innerHTML = 'Vị trí hiện tại: ' + currentLocation.lat + ', ' + currentLocation.lng;
    }, function () {
        alert('Không thể lấy vị trí hiện tại.');
    });
} else {
    alert('Trình duyệt của bạn không hỗ trợ Geolocation. Vui lòng mở trang web trên một trình duyệt khác!!!');
}
// Thêm sự kiện click cho nút "Đi tới vị trí hiện tại"
document.getElementById('currentLocationButton').addEventListener('click', function () {
    if (currentLocation) {
        map.setCenter(currentLocation); // Đặt trung tâm bản đồ tại vị trí hiện tại
        map.setZoom(14); // Phóng to bản đồ
    } else {
        alert('Vui lòng chờ một chút để lấy vị trí hiện tại.');
    }
});

// Tạo phần tử cho dấu chấm xanh
function createMarkerElement() {
    var markerDiv = document.createElement('div');
    markerDiv.className = 'marker';
    return markerDiv;
}

let selectedLat, selectedLng;
//Xử lý sự kiện click trên bản đồ
map.on('click', function (event) {
    var lngLat = event.lngLat;  // Lấy tọa độ khi click
    var infoDiv = document.getElementById('info');

    selectedLat = lngLat.lat;
    selectedLng = lngLat.lng;
    
    infoDiv.innerHTML = 'Tọa độ bạn đã nhấp: ' + '<br>' +selectedLat + '<br>' + selectedLng + '<button id="infomation_form">Add</button>'; 
    
    document.getElementById('infomation_form').addEventListener('click', function() { 
        var form = document.getElementById('formmon');
        var form1 = document.getElementById('info');
        form.style.display = 'block'; 
        form1.style.display = 'block';
// lưu giá trị toạn độ của vị tris nhấp vào localStorage
        // var storedLocations = JSON.parse(localStorage.getItem('locations')) || [];
        // storedLocations.push({ lat: selectedLat, lng: selectedLng });
        // localStorage.setItem('locations', JSON.stringify(storedLocations));
    });
    // Tạo một marker mới tại vị trí đã nhấp
    var newMarker = new tt.Marker().setLngLat(lngLat).addTo(map);
    markers.push(newMarker);

    var form = document.getElementById('info');
    var overlay = document.getElementById('overlay');
    var popupContent = document.getElementById('popupContent');
    form.style.display = 'block'; 
    overlay.style.display = 'block'; 
    popupContent.style.display = 'block';
});

const openFormBtn = document.getElementById('openFormBtn');
const myForm = document.getElementById('info');
const overlay = document.getElementById('overlay');
const forminfopro = document.getElementById('formmon');
openFormBtn.addEventListener('click', function () {
    myForm.style.display = 'block';
    overlay.style.display = 'block';
});
overlay.addEventListener('click', function () {
    
    if (markers.length > 0) {
        var lastMarker = markers.pop();  
        lastMarker.remove(); 
    }
    myForm.style.display = 'none'; 
    overlay.style.display = 'none'; 
    forminfopro.style.display = 'none'; 
});

//thêm địa chỉ vào map

document.getElementById('formmon').addEventListener('submit', function (event) {
    event.preventDefault();

    var storeName = document.getElementById('storeName').value;
    var storePhone = document.getElementById('storePhone').value;
    var foodName = document.getElementById('foodName').value;
    var quantity = document.getElementById('quantity').value;
    var priceOption = document.getElementById('price_option').value;
    var price = document.getElementById('price').value;
    var imageUpload = document.getElementById('imageUpload').files[0]; // Đảm bảo đây là tệp hình ảnh

    if (!imageUpload) {
        alert("Vui lòng tải lên một hình ảnh.");
        return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
        var imageUrl = e.target.result; // Lấy URL hình ảnh

        // Tạo marker và popup
        var marker = new tt.Marker().setLngLat([selectedLng, selectedLat]).addTo(map);
        
        var popupContent = `
            Thực phẩm: ${foodName}<br>
            Giá: ${priceOption === 'free' ? 'Miễn phí' : '$' + price}<br>
            <a href="index.html"><img class="popup-image" src="${imageUrl}" alt="${foodName}"></a>
        `;
        var popup = new tt.Popup({ offset: 35 }).setHTML(popupContent);
        marker.setPopup(popup).togglePopup();

        // Lưu thông tin vào localStorage
        var storedLocations = JSON.parse(localStorage.getItem('locations')) || [];
        storedLocations.push({
            lat: selectedLat,
            lng: selectedLng,
            storeName: storeName,
            storePhone: storePhone,
            foodName: foodName,
            quantity: quantity,
            priceOption: priceOption,
            price: price,
            imageUrl: imageUrl // Lưu URL hình ảnh vào localStorage
        });
        localStorage.setItem('locations', JSON.stringify(storedLocations));

        // Di chuyển bản đồ đến vị trí của marker
        map.flyTo({ center: [selectedLng, selectedLat], zoom: 15 });
        // Xóa các trường trong form
        document.getElementById('formmon').reset();
    };

    myForm.style.display = 'none'; 
    overlay.style.display = 'none'; 
    forminfopro.style.display = 'none'; 

    reader.readAsDataURL(imageUpload); // Đọc tệp hình ảnh
});

// Tải dữ liệu từ localStorage và hiển thị trên bản đồ khi trang được tải
window.addEventListener('load', function () {
    var storedLocations = JSON.parse(localStorage.getItem('locations')) || [];
    storedLocations.forEach(function (location) {
        var marker = new tt.Marker().setLngLat([location.lng, location.lat]).addTo(map);

        var popupContent = `
        Food Name: ${location.foodName}<br>
        Price: ${location.priceOption === 'free' ? 'Miễn phí' : '$' + location.price}<br>
        <a href="index.html"><img class="popup-image" src="${location.imageUrl}" alt="${location.foodName}"></a>
    `;
        var popup = new tt.Popup({ offset: 30 }).setHTML(popupContent);
        marker.setPopup(popup).togglePopup();
    });
});
// Xóa tất cả dữ liệu trong Local Storage
//xử lý sự kiênj thêm danh sách sản phẩm vào homepage
var priceOption = document.getElementById('price_option');
var priceInput = document.getElementById('price');
var form = document.getElementById('formmon');
var imageInput = document.getElementById('imageUpload');

priceOption.addEventListener('change', function() {
    if (priceOption.value === 'free') {
        priceInput.value = '';          
        priceInput.disabled = true;    
        priceInput.removeAttribute('required');
    } else if (priceOption.value === 'paid') {
        priceInput.disabled = false;   
        priceInput.setAttribute('required', 'required');
    }
});
form.addEventListener('submit', function(event) {
    event.preventDefault();

    var storeName = document.getElementById('storeName').value.trim();
    var storePhone = document.getElementById('storePhone').value.trim();
    var foodName = document.getElementById('foodName').value.trim();
    var quantity = document.getElementById('quantity').value.trim();

    if (!storeName || !storePhone || !foodName || !quantity) {
        alert("Please fill in all required fields.");
        return;
    }

    var price = priceOption.value === 'free' ? 0 : priceInput.value;

    if (priceOption.value === 'paid' && (!priceInput.value || isNaN(priceInput.value))) {
        alert("Please enter a valid price.");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(event) {
        var imageBase64 = event.target.result;

        var product = {
            storeName: storeName,
            storePhone: storePhone,
            foodName: foodName,
            quantity: quantity,
            price: price,
            image: imageBase64 
        };
        localStorage.setItem('product', JSON.stringify(product));
        alert("Product added successfully successful!");
        form.reset();
        priceInput.disabled = true; // Reset price input state
        priceInput.removeAttribute('required'); // Reset required attribute
    };

    if (imageInput.files.length > 0) {
        reader.readAsDataURL(imageInput.files[0]); 
    } else {
        alert("Please upload an image.");
    }
});


// Hàm xử lý sự kiện khi bấm Submit
document.getElementById('formmon').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn chặn submit form mặc định

    // Lấy dữ liệu từ form
    const storeName = document.getElementById('storeName').value;
    const storePhone = document.getElementById('storePhone').value;
    const foodName = document.getElementById('foodName').value;
    const quantity = document.getElementById('quantity').value;
    const priceOption = document.getElementById('price_option').value;
    const price = document.getElementById('price').value || 'Free';
    const imageFile = document.getElementById('imageUpload').files[0];

    // Đọc hình ảnh
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;

        // Tạo một phần tử sản phẩm mới
        const productHTML = `
            <div style="border: 1px solid #ccc; margin: 10px; padding: 10px;">
                <h3>${foodName}</h3>
                <p><strong>Store Name:</strong> ${storeName}</p>
                <p><strong>Phone:</strong> ${storePhone}</p>
                <p><strong>Quantity:</strong> ${quantity}</p>
                <p><strong>Price:</strong> ${priceOption === 'free' ? 'Free' : '$' + price}</p>
                <img src="${imageUrl}" alt="${foodName}" style="width: 100px; height: 100px;">
            </div>
        `;

        // Thêm sản phẩm mới vào danh sách sản phẩm
        document.getElementById('productList').innerHTML += productHTML;
    };

    // Kiểm tra nếu có hình ảnh được upload, sau đó đọc file
    if (imageFile) {
        reader.readAsDataURL(imageFile);
    }
});


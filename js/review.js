import {FeedBack} from "./connectionApi.js";

document.addEventListener('reviewLoaded', function () {
    console.log("Map.js executed after main.js");
    // Code của map.js sẽ chạy sau khi main.js đã tải xong

    review();
});

function review() {
    const openReviewBox = document.getElementById("open-review-box");
    const closeReviewBox = document.getElementById("close-review-box");
    const postReviewBox = document.getElementById("post-review-box");
    const cardComment = document.getElementById("card-comment");
    const newReview = document.getElementById("new-review")

    openReviewBox.addEventListener("click", () => {
        postReviewBox.style.display = "block";
        openReviewBox.style.display = "none";
        cardComment.style.display = "none";
    });

    closeReviewBox.addEventListener("click", (event) => {
        event.preventDefault();
        postReviewBox.style.display = "none";
        cardComment.style.display = "block";
        newReview.value = '';
        openReviewBox.style.display = "inline-block";
    });

    getComment();
    pickStar();
}

function getComment() {
    const id = document.getElementById('productSpan').getAttribute('value');
    const token = localStorage.getItem('token');

    document.getElementById('reviews-tab').addEventListener('click', () => {
        fetch(FeedBack + `?productId=${id}`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
        }).then(response => response.json())
            .then(response => {
                for (const data of response.data.content) {
                    document.getElementById('card-comment').innerHTML += showComment(data);
                }
            })
    })
}

function postComment(){
    const id = document.getElementById('productSpan').getAttribute('value');
    const token = localStorage.getItem('token');
    const message = document.getElementById('new-review').value;
    const rating = document.getElementById('')

    document.getElementById('save-comment').addEventListener('click', () => {
        fetch(FeedBack, {
            method: 'POST',
            headers: {'Authorization':`Bearer ${token}`},
            body: {
                productId: id,
                message: message,
                rating: rating,
            }
        })
    })
}

function pickStar(){
    const stars = document.querySelectorAll('.star-rating i');
    let selectedRating = 0;

    // Thêm sự kiện click cho từng ngôi sao
    stars.forEach(star => {
        star.addEventListener('click', function () {
            selectedRating = this.getAttribute('data-value'); // Lấy giá trị số sao

            // Đổi màu các ngôi sao khi chọn
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= selectedRating) {
                    s.classList.remove('far'); // Xóa lớp sao rỗng
                    s.classList.add('fas'); // Thêm lớp sao đầy
                } else {
                    s.classList.remove('fas'); // Xóa lớp sao đầy
                    s.classList.add('far'); // Thêm lớp sao rỗng
                }
            });

            // Hiển thị giá trị đã chọn
        });
    });
}

function showComment(user) {
    const numberOfStars = user.rating || 0;

    // Tạo chuỗi HTML cho sao
    let starRatingHTML = '';
    for (let i = 0; i < numberOfStars; i++) {
        starRatingHTML += `<span class="float-right" style="font-size: 10px"><i class="text-warning fa fa-star"></i></span>`;
    }
    return `<div class="card" style="margin-top: 10px">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-2">
                        <img src="https://image.ibb.co/jw55Ex/def_face.jpg"
                             class="img img-rounded img-fluid"/>
<!--                        <p class="text-secondary text-center">15 Minutes Ago</p>-->
                    </div>
                    <div class="col-md-10">
                        <p>
                            <a class="float-left"
                               href="#"><strong>${user.user.userName}</strong></a>
                            </br>${starRatingHTML}
                        </p>
                        <div class="clearfix"></div>${user.message}</p>
                        <p>
                            <a class="float-right btn text-white btn-danger"><i
                                    class="fa fa-heart"></i> Like</a>
                        </p>
                    </div>
                </div>
            </div>
            </div>`;
}



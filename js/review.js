import {FeedBack, refreshToken} from "./connectionApi.js";

let starValue;

document.addEventListener('reviewLoaded', function () {
    console.log("Map.js executed after main.js");
    // Code của map.js sẽ chạy sau khi main.js đã tải xong

    review();
    getComment();
});

function review() {
    const openReviewBox = document.getElementById("open-review-box");
    const closeReviewBox = document.getElementById("close-review-box");
    const postReviewBox = document.getElementById("post-review-box");
    const cardComment = document.getElementById("card-comment");
    const newReview = document.getElementById("new-review");

    openReviewBox.addEventListener("click", () => {
        postReviewBox.style.display = "block";
        openReviewBox.style.display = "none";
        cardComment.style.display = "none";
    });

    closeReviewBox.addEventListener("click", (event) => {
        event.preventDefault();
        getComment();

        postReviewBox.style.display = "none";
        cardComment.style.display = "block";
        newReview.value = '';
        openReviewBox.style.display = "inline-block";
    });

    postComment();
    pickStar();
}

function getComment() {
    const id = document.getElementById('productSpan').getAttribute('value');
    const token = localStorage.getItem('token');

    document.getElementById('reviews-tab').addEventListener('click', () => {
        fetch(FeedBack + `?productId=${id}`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
        })
            .then(response => response.json().then(comment => {
                if (comment.code === 'SA11') {
                    refreshToken();
                    alert('You don\'t have account');
                } else if (comment.code === '00') {
                    document.getElementById('card-comment').innerHTML = '';
                    for (const data of comment.data.content) {
                        document.getElementById('card-comment').innerHTML += showComment(data);
                    }
                }
            }));
    })
}

function postComment() {
    const openReviewBox = document.getElementById("open-review-box");
    const postReviewBox = document.getElementById("post-review-box");
    const cardComment = document.getElementById("card-comment");
    const newReview = document.getElementById("new-review");

    document.getElementById('save-comment').addEventListener('click', () => {
        const id = document.getElementById('productSpan').getAttribute('value');
        const token = localStorage.getItem('token');
        let message = newReview.value;
        const rating = pickStar();

        fetch(FeedBack, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' // Đảm bảo server nhận đúng kiểu dữ liệu
            },
            body: JSON.stringify({
                productId: id,
                message: message,
                rating: rating,
            })
        }).then(response => response.json().then(data => {
            if (data.code === 'SA11') {
                alert('You don\'t have account');
                refreshToken();
                postComment();
            } else if (data.code === '00') {
                getComment();

                postReviewBox.style.display = "none";
                cardComment.style.display = "block";
                newReview.value = '';
                openReviewBox.style.display = "inline-block";
            }
        }))
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error('Error:', error);
            })
    })
}

function pickStar() {
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
                starValue = selectedRating;
            });
        });
    });
    return starValue;
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



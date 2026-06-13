const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const productDetail = document.getElementById("product-detail");

const productImg = document.getElementById("product-img");
const productCategory = document.getElementById("product-category");
const productTitle = document.getElementById("product-title");
const productRatingStars = document.getElementById("product-rating-stars");
const productRatingText = document.getElementById("product-rating-text");
const productPrice = document.getElementById("product-price");
const productDescription = document.getElementById("product-description");
const productQtyInput = document.getElementById("product-qty");
const btnAddToCart = document.getElementById("btn-add-to-cart");

let currentProduct = null;
document.addEventListener("DOMContentLoaded", async () => {
    const productId = getProductIdFromUrl();
    if (productId) {
        await loadProductDetail(productId);
    } else {
    
    }
});

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

async function loadProductDetail(id) {
    try {
        loadingState.classList.remove("d-none");
        productDetail.classList.add("d-none");
        errorState.classList.add("d-none");
        currentProduct = await fetchAPI(`/products/${id}`);
        renderProductDetail(currentProduct);

    } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
        showError();
    } finally {
        loadingState.classList.add("d-none");
    }
}

function renderProductDetail(product) {
    productImg.src = product.thumbnail;
    productImg.alt = product.title;
    productCategory.textContent = product.category;
    productTitle.textContent = product.title;
    productPrice.textContent = `$${product.price.toFixed(2)}`;
    productDescription.textContent = product.description;
   
    const fakeReviewCount = Math.floor(product.rating * 15);
    productRatingText.textContent = `(${product.rating} / 5.0 từ ${fakeReviewCount} đánh giá)`;
    renderRatingStars(product.rating);
    productDetail.classList.remove("d-none");
    setupAddToCartButton();
}

function renderRatingStars(rating) {
    productRatingStars.innerHTML = "";
    const roundedRating = Math.round(rating); // Làm tròn số sao 

    for (let i = 1; i <= 5; i++) {
        const starIcon = document.createElement("i");
        if (i <= roundedRating) {
            starIcon.className = "bi bi-star-fill me-1"; // Sao vàng nguyên vẹn
        } else {
            starIcon.className = "bi bi-star text-muted me-1"; // Sao trống màu xám
        }
        productRatingStars.appendChild(starIcon);
    }
}

function setupAddToCartButton() {
    btnAddToCart.addEventListener("click", () => {
        let quantity = parseInt(productQtyInput.value);
        if (isNaN(quantity) || quantity <= 0) {
            alert("Vui lòng nhập số lượng hợp lệ (lớn hơn hoặc bằng 1)!");
            productQtyInput.value = 1;
            return;
        }

        if (typeof addToCart === "function" && currentProduct) {
            addToCart({
                id: currentProduct.id,
                title: currentProduct.title,
                price: currentProduct.price,
                img: currentProduct.thumbnail,
                quantity: quantity
            });
        }
    });
}

function showError() {
    errorState.classList.remove("d-none");
    loadingState.classList.add("d-none");
    productDetail.classList.add("d-none");
}
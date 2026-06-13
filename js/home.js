const productGrid = document.getElementById("product-grid");
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const categorySelect = document.getElementById("category-select");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

let allProducts = [];
document.addEventListener("DOMContentLoaded", async () => {
    updateCartBadge();      // Cập nhật số lượng giỏ hàng trên navbar ngay khi vào trang
    await loadCategories(); // Tải danh mục vào ô chọn
    await loadProducts();   // Tải danh sách sản phẩm ra lưới
    setupEventListeners(); 
});
async function loadCategories() {
    try {
        const categories = await fetchAPI('/products/categories');
        
        categories.slice(0, 8).forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.slug;         
            option.textContent = cat.name;   
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Không tải được danh mục:", error);
    }
}

async function loadProducts() {
    try {
        loadingState.classList.remove("d-none");
        productGrid.innerHTML = "";
        errorState.classList.add("d-none");
        const result = await fetchAPI('/products?limit=20');
        allProducts = result.products; 

        renderProductCards(allProducts);

    } catch (error) {
        errorState.classList.remove("d-none");
    } finally {
        loadingState.classList.add("d-none");
    }
}

function renderProductCards(productsList) {
    productGrid.innerHTML = "";
    if (productsList.length === 0) {
        productGrid.innerHTML = `
            <div class="text-center w-100 py-5 text-muted">
                <i class="bi bi-search display-4"></i>
                <p class="mt-2">Không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn.</p>
            </div>`;
        return;
    }

    productsList.forEach(product => {
        const colDiv = document.createElement("div");
        colDiv.className = "col";
        colDiv.innerHTML = `
            <div class="card h-100 shadow-sm border-0 position-relative card-hover">
                <div class="p-3 d-flex align-items-center justify-content-center" style="height: 200px; background: #fff;">
                    <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}" style="max-height: 100%; object-fit: contain;">
                </div>
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-light text-secondary align-self-start mb-2 text-uppercase" style="font-size: 0.7rem;">${product.category}</span>
                    <h6 class="card-title text-dark fw-bold text-truncate mb-2" title="${product.title}">${product.title}</h6>
                    <p class="card-text text-muted text-truncate small mb-3">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <span class="text-danger fw-bold fs-5">$${product.price}</span>
                        <span class="text-warning small"><i class="bi bi-star-fill"></i> ${product.rating}</span>
                    </div>
                </div>
                <div class="card-footer bg-transparent border-top-0 p-3 pt-0 d-flex gap-2">
                    <a href="product.html?id=${product.id}" class="btn btn-outline-dark btn-sm flex-grow-1 fw-semibold">Xem chi tiết</a>
                    <button class="btn btn-warning btn-sm btn-add-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-img="${product.thumbnail}">
                        <i class="bi bi-cart-plus-fill"></i>
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(colDiv);
    });
}

function setupEventListeners() {
    searchInput.addEventListener("input", filterAndSortProducts);
    categorySelect.addEventListener("change", filterAndSortProducts);
    sortSelect.addEventListener("change", filterAndSortProducts);

    productGrid.addEventListener("click", (e) => {
        const button = e.target.closest(".btn-add-cart");
        if (button) {
            const id = button.getAttribute("data-id");
            const title = button.getAttribute("data-title");
            const price = parseFloat(button.getAttribute("data-price"));
            const img = button.getAttribute("data-img");
            if (typeof addToCart === "function") {
                addToCart({ id, title, price, img, quantity: 1 });
            }
        }
    });
}

function filterAndSortProducts() {
    let filtered = [...allProducts];

    const keyword = searchInput.value.toLowerCase().trim();
    if (keyword) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(keyword));
    }
    const selectedCat = categorySelect.value;
    if (selectedCat) {
        filtered = filtered.filter(p => p.category === selectedCat);
    }
    const sortValue = sortSelect.value;
    if (sortValue === "price-asc") {
        filtered.sort((a, b) => a.price - b.price); // Thấp đến Cao
    } else if (sortValue === "price-desc") {
        filtered.sort((a, b) => b.price - a.price); // Cao đến Thấp
    }
    renderProductCards(filtered);
}

function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (badge) {
        const cart = JSON.parse(localStorage.getItem("shoplite_cart")) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
}
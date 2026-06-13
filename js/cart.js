const CART_STORAGE_KEY = "shoplite_cart";

function getCart() {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge(); // Mỗi lần lưu giỏ hàng đều cập nhật lại số lượng hiển thị trên Navbar
}

function addToCart(product) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id == product.id);//ktra xem sp đã tồn tại chưa

    if (existingItem) {
        existingItem.quantity += product.quantity;//Nếu có, tăng số lượng lên
    } else {
        cart.push(product);//Nếu chưa, đẩy sp mới vào giỏ
    }

    saveCart(cart);
    alert(`Đã thêm "${product.title}" vào giỏ hàng thành công!`);
}

function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (badge) {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);//tính tổng
        badge.textContent = totalItems;
    }
}

const cartContainer = document.getElementById("cart-container");
const cartTotal = document.getElementById("cart-total");
const btnCheckout = document.getElementById("btn-checkout");

if (cartContainer && cartTotal) {

    document.addEventListener("DOMContentLoaded", () => {
        updateCartBadge(); 
        renderCart();
        setupCartEventListeners(); //tăng/giảm/xóa
    });

    function renderCart() {
        const cart = getCart();
        cartContainer.innerHTML = ""; 

        // Trường hợp giỏ hàng trống 
        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-cart-x display-1 text-muted"></i>
                    <p class="mt-3 fs-5 text-muted">Giỏ hàng của bạn đang trống.</p>
                    <a href="index.html" class="btn btn-warning mt-2 fw-semibold">Tiếp tục mua sắm</a>
                </div>`;
            cartTotal.textContent = "$0.00";
            if(btnCheckout) btnCheckout.disabled = true; // Khóa nút thanh toán nếu không có hàng
            return;
        }

        if(btnCheckout) btnCheckout.disabled = false; // Mở nút thanh toán

        // Có sản phẩm
        cart.forEach(item => {
            const itemRow = document.createElement("div");
            itemRow.className = "card mb-3 p-3 shadow-sm border-0";
            itemRow.innerHTML = `
                <div class="row align-items-center g-3">
                    <div class="col-3 col-md-2 text-center">
                        <img src="${item.img}" alt="${item.title}" class="img-fluid rounded" style="max-height: 80px; object-fit: contain;">
                    </div>
                    <div class="col-9 col-md-4">
                        <h6 class="text-dark fw-bold text-truncate mb-1" title="${item.title}">${item.title}</h6>
                        <span class="text-muted small">Đơn giá: $${item.price}</span>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="input-group input-group-sm" style="max-width: 120px;">
                            <button class="btn btn-outline-secondary btn-minus" data-id="${item.id}" type="button">-</button>
                            <input type="text" class="form-control text-center bg-white" value="${item.quantity}" readonly>
                            <button class="btn btn-outline-secondary btn-plus" data-id="${item.id}" type="button">+</button>
                        </div>
                    </div>
                    <div class="col-6 col-md-3 d-flex align-items-center justify-content-between justify-content-md-end gap-3">
                        <span class="text-danger fw-bold fs-5">$${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="btn btn-outline-danger btn-sm btn-delete" data-id="${item.id}">
                            <i class="bi bi-trash3-fill"></i>
                        </button>
                    </div>
                </div>
            `;
            cartContainer.appendChild(itemRow);
        });
        calculateTotalPrice(cart);
    }
     
    function calculateTotalPrice(cart) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    function setupCartEventListeners() {
        cartContainer.addEventListener("click", (e) => {
            let cart = getCart();
            //khi nhấn nút Tăng số lượng 
            const btnPlus = e.target.closest(".btn-plus");
            if (btnPlus) {
                const id = btnPlus.getAttribute("data-id");
                const item = cart.find(i => i.id == id);
                if (item) item.quantity += 1;
                saveCart(cart);
                renderCart();
                return;
            }

            // khi nhấn nút Giảm số lượng 
            const btnMinus = e.target.closest(".btn-minus");
            if (btnMinus) {
                const id = btnMinus.getAttribute("data-id");
                const item = cart.find(i => i.id == id);
                if (item) {
                    item.quantity -= 1;
                    if (item.quantity <= 0) {
                        cart = cart.filter(i => i.id != id);
                    }
                }
                saveCart(cart);
                renderCart();
                return;
            }

            //khi nhấn nút Xóa sản phẩm (Thùng rác)
            const btnDelete = e.target.closest(".btn-delete");
            if (btnDelete) {
                const id = btnDelete.getAttribute("data-id");
                cart = cart.filter(i => i.id != id);
                saveCart(cart);
                renderCart();
                return;
            }
        });
        //nút thanh toán
        if(btnCheckout) {
            btnCheckout.addEventListener("click", () => {
                alert("Cảm ơn bạn đã mua sắm tại ShopLite! Đơn hàng của bạn đã được giả lập thanh toán thành công.");
                localStorage.removeItem(CART_STORAGE_KEY); // Xóa giỏ hàng sau khi mua xong
                window.location.href = "index.html"; // Chuyển hướng người dùng về trang chủ
            });
        }
    }
} else {
    document.addEventListener("DOMContentLoaded", updateCartBadge);
}

document.addEventListener("DOMContentLoaded", () => {
    checkAuthNavbar();
});
function checkAuthNavbar() {
    const registerBtn = document.getElementById("nav-register-btn");
    const userDropdown = document.getElementById("nav-user-dropdown");
    const userNameSpan = document.getElementById("nav-user-name");
    const userAvatarDiv = document.getElementById("nav-user-avatar");
    const logoutBtn = document.getElementById("nav-logout-btn");

    const savedUser = localStorage.getItem("shoplite_user");

    if (savedUser && userDropdown && registerBtn) {
        registerBtn.classList.add("d-none");
        userDropdown.classList.remove("d-none");

        const nameParts = savedUser.trim().split(" ");
        const shortName = nameParts[nameParts.length - 1];
        
        if (userNameSpan) {
            userNameSpan.textContent = shortName;
        }

        if (userAvatarDiv) {
            userAvatarDiv.textContent = shortName.charAt(0).toUpperCase();
        }
    } else if (userDropdown && registerBtn) {
        registerBtn.classList.remove("d-none");
        userDropdown.classList.add("d-none");
    }
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("shoplite_user");
            window.location.reload();
        });
    }
}
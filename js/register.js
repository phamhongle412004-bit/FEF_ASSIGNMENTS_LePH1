const registerForm = document.getElementById("register-form");
const successMessage = document.getElementById("success-message");

const fullnameInput = document.getElementById("fullname");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const phoneInput = document.getElementById("phone");
const citySelect = document.getElementById("city");
const termsCheckbox = document.getElementById("terms");

document.addEventListener("DOMContentLoaded", () => {
    if (registerForm) {
        setupFormValidation();
    }
});

function setupFormValidation() {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        successMessage.classList.add("d-none");
        const isFullnameValid = validateFullname();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isPhoneValid = validatePhone();
        const isCityValid = validateCity();
        const isTermsValid = validateTerms();

        if (isFullnameValid && isEmailValid && isPasswordValid && isPhoneValid && isCityValid && isTermsValid) {

            const fullname = fullnameInput.value.trim();
            const email = emailInput.value.trim();
            localStorage.setItem("shoplite_user", fullname);

            const registeredUsers = JSON.parse(localStorage.getItem("shoplite_accounts")) || [];
            registeredUsers.push({
                fullname: fullname,
                email: email,
                password: passwordInput.value 
            });
            localStorage.setItem("shoplite_accounts", JSON.stringify(registeredUsers));
            
            const toastElement = document.getElementById('liveToast');
            if (toastElement) {
                const toast = new bootstrap.Toast(toastElement, { delay: 4000 });
                toast.show();
            }
            successMessage.classList.remove("d-none");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            registerForm.reset();
            clearValidationClasses();
            console.log("Đăng ký tài khoản thành công! Tên người dùng đã được đồng bộ lên hệ thống.");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);//tự động chuyển hướng người dùng về trang chủ sau 1.5s
        }
    });
    fullnameInput.addEventListener("blur", validateFullname);
    emailInput.addEventListener("blur", validateEmail);
    passwordInput.addEventListener("blur", validatePassword);
    phoneInput.addEventListener("blur", validatePhone);
    citySelect.addEventListener("change", validateCity);
    termsCheckbox.addEventListener("change", validateTerms);
}

function validateFullname() {
    const value = fullnameInput.value.trim();
    if (value === "" || value.length < 2) {
        showFieldError(fullnameInput, "Họ và tên không được để trống và phải từ 2 ký tự trở lên.");
        return false;
    }
    showFieldSuccess(fullnameInput);
    return true;
}

function validateEmail() {
    const value = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value === "") {
        showFieldError(emailInput, "Email không được để trống.");
        return false;
    } else if (!emailRegex.test(value)) {
        showFieldError(emailInput, "Địa chỉ email không đúng định dạng (Ví dụ: name@example.com).");
        return false;
    }
    const registeredUsers = JSON.parse(localStorage.getItem("shoplite_accounts")) || [];
    const isEmailExist = registeredUsers.some(user => user.email === value);
    
    if (isEmailExist) {
        showFieldError(emailInput, "Email này đã được sử dụng để đăng ký tài khoản khác.");
        return false;
    }
    showFieldSuccess(emailInput);
    return true;
}

function validatePassword() {
    const value = passwordInput.value; 
    if (value === "" || value.length < 6) {
        showFieldError(passwordInput, "Mật khẩu không được để trống và phải có ít nhất 6 ký tự.");
        return false;
    }
    showFieldSuccess(passwordInput);
    return true;
}

function validatePhone() {
    const value = phoneInput.value.trim();
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

    if (value === "") {
        showFieldError(phoneInput, "Số điện thoại không được để trống.");
        return false;
    } else if (!phoneRegex.test(value)) {
        showFieldError(phoneInput, "Số điện thoại phải gồm 10 chữ số hợp lệ tại Việt Nam.");
        return false;
    }
    showFieldSuccess(phoneInput);
    return true;
}

function validateCity() {
    const value = citySelect.value;
    if (value === "") {
        showFieldError(citySelect, "Vui lòng lựa chọn một khu vực sinh sống của bạn.");
        return false;
    }
    showFieldSuccess(citySelect);
    return true;
}

function validateTerms() {
    if (!termsCheckbox.checked) {
        showFieldError(termsCheckbox, "Bạn phải đồng ý với điều khoản dịch vụ để đăng ký.");
        return false;
    }
    showFieldSuccess(termsCheckbox);
    return true;
}

function showFieldError(inputElement, errorMessage) {
    inputElement.classList.add("is-invalid");
    inputElement.classList.remove("is-valid");
    const errorDiv = inputElement.parentElement.querySelector(".invalid-feedback");
    if (errorDiv) {
        errorDiv.textContent = errorMessage;
    }
}

function showFieldSuccess(inputElement) {
    inputElement.classList.add("is-valid");
    inputElement.classList.remove("is-invalid");
}
function clearValidationClasses() {
    const inputs = registerForm.querySelectorAll(".form-control, .form-select, .form-check-input");
    inputs.forEach(input => {
        input.classList.remove("is-valid", "is-invalid");
    });
}
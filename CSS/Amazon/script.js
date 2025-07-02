
let cartCount = document.getElementById("cartCount");

if (localStorage.getItem("cartCount") !== null) {
    cartCount.textContent = JSON.parse(localStorage.getItem("cartCount"));
} else {
    cartCount.textContent = "0";
}

cartPaddingFix();

function cartPaddingFix() {
    if (cartCount.textContent >= 10) {
        cartCount.style.paddingLeft = "17px";
    }
    else {
        cartCount.style.paddingLeft = "20px";
    }
}

function addCart() {
    const quantityInput = document.getElementById("quantity1").value;
    cartCount.textContent = Number(cartCount.textContent) + Number(quantityInput); 
    localStorage.setItem("cartCount", JSON.stringify(cartCount.textContent));
    cartPaddingFix();
}

function removeCart() {
    cartCount.textContent = "0";
    localStorage.removeItem("cartCount");
    localStorage.setItem("cartCount", JSON.stringify(cartCount.textContent));
    cartPaddingFix();
}


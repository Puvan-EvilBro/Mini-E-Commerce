
/* ==========================================
   TECHNOVA - MINI E-COMMERCE APP
========================================== */


/* 1. PRODUCT DATABASE */

const products = [

    {
        id: 1,
        name: "iPhone 16",
        category: "Phones",
        price: 79999,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"
    },

    {
        id: 2,
        name: "MacBook Air",
        category: "Laptops",
        price: 99999,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"
    },

    {
        id: 3,
        name: "AirPods Pro",
        category: "Accessories",
        price: 24999,
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500"
    },

    {
        id: 4,
        name: "Gaming Headset",
        category: "Accessories",
        price: 3499,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    },

    {
        id: 5,
        name: "Smart Watch",
        category: "Accessories",
        price: 4999,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
    },

    {
        id: 6,
        name: "Samsung Galaxy",
        category: "Phones",
        price: 59999,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
    },

    {
        id: 7,
        name: "Gaming Laptop",
        category: "Laptops",
        price: 84999,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
    },

    {
        id: 8,
        name: "Wireless Speaker",
        category: "Accessories",
        price: 2999,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500"
    }

];


/* 2. GET HTML ELEMENTS */

const productContainer =
    document.getElementById("productContainer");

const cartCount =
    document.getElementById("cartCount");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const cartSection =
    document.getElementById("cartSection");

const cartOverlay =
    document.getElementById("cartOverlay");

const checkoutModal =
    document.getElementById("checkoutModal");

const successModal =
    document.getElementById("successModal");

const checkoutDetails =
    document.getElementById("checkoutDetails");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const checkoutBtn =
    document.getElementById("checkoutBtn");


/* 3. SHOPPING CART DATA */

let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("technovaCart")) || [];

    if (!Array.isArray(cart)) {
        cart = [];
    }
} catch (error) {
    cart = [];
}


/* 4. FORMAT PRICE */

function formatPrice(price) {

    return price.toLocaleString("en-IN");

}


/* 5. DISPLAY PRODUCTS */

function displayProducts(productList) {

    productContainer.innerHTML = "";

    document.getElementById("noProducts").style.display =
        productList.length === 0 ? "block" : "none";


    productList.forEach(product => {

        const productCard = document.createElement("div");

        productCard.className = "product-card";

        productCard.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

            </div>

            <p class="product-category">
                ${product.category}
            </p>

            <h3>${product.name}</h3>

            <p class="product-price">
                ₹${formatPrice(product.price)}
            </p>

            <button
                class="add-btn"
                data-id="${product.id}"
            >
                🛒 Add to Cart
            </button>

        `;

        productContainer.appendChild(productCard);

    });

}


/* 6. ADD PRODUCT TO CART */

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }

    updateCart();

}


/* 7. UPDATE CART */

function updateCart() {

    localStorage.setItem(
        "technovaCart",
        JSON.stringify(cart)
    );

    displayCart();

    updateCartCount();

}


/* 8. UPDATE CART COUNT */

function updateCartCount() {

    const totalItems = cart.reduce(

        (total, item) => total + item.quantity,

        0

    );

    cartCount.textContent = totalItems;

}


/* 9. CALCULATE TOTAL PRICE */

function calculateTotal() {

    return cart.reduce(

        (total, item) => {

            return total + (item.price * item.quantity);

        },

        0

    );

}


/* 10. DISPLAY CART ITEMS */

function displayCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <h3>Your cart is empty!</h3>

                <p>Add some products to get started.</p>

            </div>

        `;

    }


    cart.forEach(item => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <p>₹${formatPrice(item.price)}</p>

                <div class="quantity-controls">

                    <button
                        class="quantity-btn"
                        data-action="decrease"
                        data-id="${item.id}"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        class="quantity-btn"
                        data-action="increase"
                        data-id="${item.id}"
                    >+</button>

                </div>

            </div>

            <button
                class="remove-btn"
                data-action="remove"
                data-id="${item.id}"
                aria-label="Remove ${item.name}"
            >🗑</button>

        `;

        cartItems.appendChild(cartItem);

    });


    cartTotal.textContent = formatPrice(calculateTotal());

    checkoutBtn.disabled = cart.length === 0;

}


/* 11. CHANGE PRODUCT QUANTITY */

function changeQuantity(productId, action) {

    const item = cart.find(
        product => product.id === productId
    );

    if (!item) return;


    if (action === "increase") {

        item.quantity++;

    }

    else if (action === "decrease") {

        item.quantity--;

        if (item.quantity <= 0) {

            cart = cart.filter(
                product => product.id !== productId
            );

        }

    }

    else if (action === "remove") {

        cart = cart.filter(
            product => product.id !== productId
        );

    }


    updateCart();

}


/* 12. SEARCH PRODUCTS */

function searchProducts() {

    const searchValue =
        searchInput.value.toLowerCase().trim();

    const activeCategory =
        document.querySelector(".filter-btn.active")
            .dataset.category;


    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue);

        const matchesCategory =
            activeCategory === "All" ||
            product.category === activeCategory;

        return matchesSearch && matchesCategory;

    });


    displayProducts(filteredProducts);

}


/* 13. CATEGORY FILTER */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        searchProducts();

    });

});


/* 14. ADD TO CART BUTTON EVENTS */

productContainer.addEventListener("click", event => {

    const button = event.target.closest(".add-btn");

    if (!button) return;

    const productId = Number(button.dataset.id);

    addToCart(productId);

    const originalText = button.textContent;

    button.textContent = "✓ Added!";

    setTimeout(() => {

        button.textContent = originalText;

    }, 800);

});


/* 15. CART QUANTITY AND REMOVE EVENTS */

cartItems.addEventListener("click", event => {

    const button = event.target.closest("button");

    if (!button) return;

    const productId = Number(button.dataset.id);

    const action = button.dataset.action;

    if (!productId || !action) return;

    changeQuantity(productId, action);

});


/* 16. OPEN CART */

function openCart() {

    cartSection.classList.add("active");

    cartOverlay.classList.add("active");

}


 /* 17. CLOSE CART */

function closeCart() {

    cartSection.classList.remove("active");

    cartOverlay.classList.remove("active");

}


document.getElementById("cartButton")
    .addEventListener("click", openCart);


document.getElementById("closeCart")
    .addEventListener("click", closeCart);


cartOverlay.addEventListener("click", closeCart);


/* 18. SHOP NOW BUTTON */

document.getElementById("shopNowBtn")
    .addEventListener("click", () => {

        document.getElementById("productsSection")
            .scrollIntoView({

                behavior: "smooth"

            });

    });


/* 19. CHECKOUT PREVIEW */

function openCheckout() {

    if (cart.length === 0) return;


    checkoutDetails.innerHTML = "";


    cart.forEach(item => {

        const checkoutItem = document.createElement("div");

        checkoutItem.className = "checkout-item";

        checkoutItem.innerHTML = `

            <span>
                ${item.name} × ${item.quantity}
            </span>

            <span>
                ₹${formatPrice(item.price * item.quantity)}
            </span>

        `;

        checkoutDetails.appendChild(checkoutItem);

    });


    checkoutTotal.textContent =
        formatPrice(calculateTotal());


    closeCart();

    checkoutModal.classList.add("active");

}


checkoutBtn.addEventListener("click", openCheckout);


/* 20. CLOSE CHECKOUT MODAL */

document.getElementById("closeModal")
    .addEventListener("click", () => {

        checkoutModal.classList.remove("active");

    });


checkoutModal.addEventListener("click", event => {

    if (event.target === checkoutModal) {

        checkoutModal.classList.remove("active");

    }

});


/* 21. CONFIRM ORDER */

document.getElementById("confirmOrder")
    .addEventListener("click", () => {

        if (cart.length === 0) return;

        checkoutModal.classList.remove("active");

        cart = [];

        updateCart();

        successModal.classList.add("active");

    });


/* 22. CONTINUE SHOPPING */

document.getElementById("continueShopping")
    .addEventListener("click", () => {

        successModal.classList.remove("active");

        document.getElementById("productsSection")
            .scrollIntoView({

                behavior: "smooth"

            });

    });


/* 23. SEARCH INPUT EVENT */

searchInput.addEventListener("input", searchProducts);


/* 24. KEYBOARD ESCAPE SUPPORT */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeCart();

        checkoutModal.classList.remove("active");

        successModal.classList.remove("active");

    }

});


/* 25. INITIALIZE WEBSITE */

displayProducts(products);

updateCart();

console.log("TechNova E-Commerce App Loaded Successfully!");


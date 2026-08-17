
function calculateItemTotal(price, quantity) {
    return price * quantity;
}

let cartRows = document.querySelectorAll(
    "#shopping-cart tbody tr"
);


function calculateSubtotal() {
    let subtotal = 0;
    cart.forEach(function (item) {
        let itemTotal = calculateItemTotal(item.price, item.quantity);
        subtotal += itemTotal;
    });

    return subtotal;
}


function calculateDeliveryCharge(subtotal) {
    if (subtotal === 0) {
        return 0;
    }
    return 40;
}


function calculatePackagingCharge(subtotal) {
    if (subtotal === 0) {
        return 0;
    }
    return 20;
}


function calculateDiscount(subtotal) {
    if (subtotal > 500) {
        return subtotal * 0.10;
    }
    return 0;
}


function calculateTotal(subtotal, deliveryCharge, packagingCharge, discount) {
    return subtotal + deliveryCharge + packagingCharge - discount;
}


function updateOrderSummary() {

    let subtotalElement =
        document.getElementById("subtotal-amount");

    if (!subtotalElement) {
        return;
    }

    let subtotal = calculateSubtotal();

    let deliveryCharge = calculateDeliveryCharge(subtotal);

    let packagingCharge = calculatePackagingCharge(subtotal);

    let discount = calculateDiscount(subtotal);

    let totalAmount = calculateTotal(subtotal, deliveryCharge, packagingCharge, discount);


    document.getElementById("subtotal-amount").textContent = "₹" + subtotal.toFixed(2);

    document.getElementById("delivery-amount").textContent = "₹" + deliveryCharge.toFixed(2);

    document.getElementById("packaging-amount").textContent = "₹" + packagingCharge.toFixed(2);

    document.getElementById("discount-amount").textContent = "-₹" + discount.toFixed(2);

    document.getElementById("total-amount").textContent = "₹" + totalAmount.toFixed(2);

}



let cart = JSON.parse(
    localStorage.getItem("biteboxCart")
) || [];

let menuContainer = document.getElementById("menu-items");


if (menuContainer) {

    menuContainer.addEventListener(
        "click",
        function (event) {

            let button =
                event.target.closest("button");


            if (!button) {
                return;
            }


            if (
                button.textContent.includes(
                    "Add to Cart"
                )
            ) {

                let card =
                    button.closest("article");


                addToCart(card);

            }

        }
    );

}


function addToCart(card) {
    let name = card.querySelector("h3").textContent.trim();

    let priceText = card.querySelector(".price").textContent;

    let price = parseFloat(priceText.replace("₹", ""));

    let image = card.querySelector("img").getAttribute("src");


    let cartItem = {

        name: name,
        price: price,
        image: image,
        quantity: 1

    };

    let existingItem =
        cart.find(function (item) {
            return item.name === name;
        });


    if (existingItem) {
        existingItem.quantity++;
    }
    else {
        cart.push(cartItem);
    }


    console.log("Name:", name);
    console.log("Price:", price);
    console.log("Image:", image);

    console.log("Cart:", cart);

    localStorage.setItem(
        "biteboxCart",
        JSON.stringify(cart)
    );

    renderCart();
    updateCartCount();
}


let cartBody = document.querySelector("#shopping-cart tbody");

function renderCart() {

    if (!cartBody) {
        return;
    }

    cartBody.innerHTML = "";

    if (cart.length === 0) {

        let row = document.createElement("tr");


        row.innerHTML = `

        <td colspan="5">

            <div class="empty-cart">

                <h3>
                    Your Cart is Empty
                </h3>

                <p>
                    Add some delicious food
                    from our Menu!
                </p>

            </div>

        </td>

    `;


        cartBody.appendChild(row);

        return;

    }


    cart.forEach(function (item, index) {

        let itemTotal = item.price * item.quantity;
        let row = document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="cart-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <div>

                        <h3>
                            ${item.name}
                        </h3>

                    </div>

                </div>

            </td>


            <td>
                ₹${item.price}
            </td>


            <td>

                <div class="quantity-box">

                    <button
                        class="decrease"
                        data-index="${index}">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        class="increase"
                        data-index="${index}">
                        +
                    </button>

                </div>

            </td>


            <td>
                ₹${itemTotal.toFixed(2)}
            </td>


            <td>

                 <a href="#" class="remove-item" data-index="${index}">

    <img src="assets/icons/delete.png" alt="Delete" width="25">

    </a>

            </td>

        `;


        cartBody.appendChild(row);

    });

}

function increaseQuantity(index) {
    cart[index].quantity++;
    localStorage.setItem(
        "biteboxCart",
        JSON.stringify(cart)
    );
    renderCart();
    updateOrderSummary();
    updateCartCount();
}


function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem(
            "biteboxCart",
            JSON.stringify(cart)
        );
    }
    renderCart();
    updateOrderSummary();
    updateCartCount();
}


function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("biteboxCart", JSON.stringify(cart));

    renderCart();
    updateOrderSummary();
     updateCartCount();

}

function clearCart() {
    cart = [];
    localStorage.removeItem("biteboxCart");
    renderCart();
    updateOrderSummary();
     updateCartCount();
}


let clearCartButton =
    document.getElementById("clear-cart");


if (clearCartButton) {

    clearCartButton.addEventListener(
        "click",
        function () {

            clearCart();

        }
    );

}



if (cartBody) {
    cartBody.addEventListener("click", function (event) {

        let button = event.target.closest("button");

        if (button) {
            let index = parseInt(button.dataset.index);
            if (button.classList.contains("increase")) {
                increaseQuantity(index);
            }

            if (button.classList.contains("decrease")) {
                decreaseQuantity(index);
            }
        }


        let link = event.target.closest("a");
        if (link && link.classList.contains("remove-item")) {
            event.preventDefault();
            let index = parseInt(link.dataset.index);
            removeFromCart(index);
        }

    });
}


let menuCards = document.querySelectorAll("#menu-items article");
let searchInput = document.getElementById("menu-search");
let searchButton = document.getElementById("search-button");

function searchMenu(searchText) {
    let searchValue = searchText.trim().toLowerCase();

    menuCards.forEach(function (card) {
        let foodName = card.querySelector("h3").textContent.trim().toLowerCase();

        if (foodName.includes(searchValue)) {
            card.style.display = "";
        }
        else {
            card.style.display = "none";
        }
    });

}

if (searchButton) {
    searchButton.addEventListener(
        "click",
        function () {
            searchMenu(
                searchInput.value
            );
        }
    );

}


let categoryCards = document.querySelectorAll("#categories article");

function filterMenu(category) {

    menuCards.forEach(function (card) {
        let cardCategory = card.dataset.category.toLowerCase();

        if (cardCategory === category) {
            card.style.display = "";
        }
        else {
            card.style.display = "none";
        }
    });

}



categoryCards.forEach(
    function (card) {

        card.addEventListener("click", function () {
            let category = card.querySelector("h3")
                .textContent
                .trim()
                .toLowerCase();
            filterMenu(category);
        }
        );

    }
)







let themeButton = document.getElementById("theme-toggle");


function toggleTheme() {
    document.body.classList.toggle("dark-theme");

    let themeIcon = themeButton.querySelector(".theme-icon");
    let themeText = themeButton.querySelector(".theme-text");

    if (document.body.classList.contains("dark-theme")) {
        themeIcon.textContent = "☾";
        themeText.textContent ="NIGHT MODE";
        localStorage.setItem("biteboxTheme","dark");
    }  
    else {
        themeIcon.textContent = "☀";
        themeText.textContent ="DAY MODE";
        localStorage.setItem("biteboxTheme","light");

    }
}



function loadTheme() {

    let savedTheme =
        localStorage.getItem(
            "biteboxTheme"
        );


    /* Disable animation while loading */

    document.body.classList.add(
        "theme-loading"
    );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

    }
    else {

        document.body.classList.remove(
            "dark-theme"
        );

    }


    let themeIcon =
        themeButton.querySelector(
            ".theme-icon"
        );


    let themeText =
        themeButton.querySelector(
            ".theme-text"
        );


    if (
        savedTheme === "dark"
    ) {

        if (themeIcon) {

            themeIcon.textContent =
                "☾";

        }


        if (themeText) {

            themeText.textContent =
                "NIGHT MODE";

        }

    }
    else {

        if (themeIcon) {

            themeIcon.textContent =
                "☀";

        }


        if (themeText) {

            themeText.textContent =
                "DAY MODE";

        }

    }


    /* Allow animation again */

    setTimeout(function () {

        document.body.classList.remove(
            "theme-loading"
        );

    }, 50);

}

if (themeButton) {

    themeButton.addEventListener(
        "click",
        function () {

            toggleTheme();

        }
    );

}


function updateCartCount() {

    let cartCount = 0;
    cart.forEach(function (item) {
        cartCount += item.quantity;
    });

    let cartCountElement = document.getElementById("cart-count");

    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}


loadTheme();
renderCart();
updateOrderSummary(); 
 updateCartCount();



 function showToast(message, type) {

    let toast = document.createElement("div");

    toast.className = "toast " + type;

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(function () {
        toast.classList.add("show");
    }, 100);

    setTimeout(function () {

        toast.classList.remove("show");

        setTimeout(function () {
            toast.remove();
        }, 300);

    }, 3000);
}


let contactForm = document.querySelector(".right-column form");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            let name =
                contactForm.querySelector(
                    'input[name="name"]'
                );

            let email =
                contactForm.querySelector(
                    'input[name="email"]'
                );

            let phone =
                contactForm.querySelector(
                    'input[name="phone"]'
                );

            let subject =
                contactForm.querySelector(
                    'input[name="subject"]'
                );

            let message =
                contactForm.querySelector(
                    'textarea[name="message"]'
                );


            if (!name.value.trim()) {

                showToast(
                    "⚠ Please enter your name.",
                    "error"
                );

                return;
            }


            if (!email.value.trim()) {

                showToast(
                    "⚠ Please enter your email address.",
                    "error"
                );

                return;
            }


            if (!email.validity.valid) {

                showToast(
                    "⚠ Please enter a valid email address.",
                    "error"
                );

                return;
            }


            let phonePattern = /^[6-9]\d{9}$/;


            if (!phone.value.trim()) {

                showToast(
                    "⚠ Please enter your phone number.",
                    "error"
                );

                return;
            }


            if (!phonePattern.test(phone.value.trim())) {

                showToast(
                    "⚠ Please enter a valid 10-digit phone number.",
                    "error"
                );

                return;
            }


            if (!subject.value.trim()) {

                showToast(
                    "⚠ Please enter a subject.",
                    "error"
                );

                return;
            }


            if (!message.value.trim()) {

                showToast(
                    "⚠ Please enter your message.",
                    "error"
                );

                return;
            }


            showToast(
                "✓ Message sent successfully!",
                "success"
            );


            contactForm.reset();

        }
    );
}

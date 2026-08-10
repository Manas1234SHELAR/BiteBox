function calculateItemTotal(price, quantity) {
    return price * quantity;
}

let cartRows = document.querySelectorAll(
    "#shopping-cart tbody tr"
);


function calculateSubtotal() {

    let subtotal = 0;

    let cartRows = document.querySelectorAll(
        "#shopping-cart tbody tr"
    );

    cartRows.forEach(function (row) {

        let priceText = row.children[1].textContent;

        let price = parseFloat(priceText.replace("₹", ""));

        let quantityText = row.querySelector(".quantity-box span").textContent;

        let quantity = parseInt(quantityText);

        let itemTotal = calculateItemTotal(price, quantity);

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

    let subtotal = calculateSubtotal();

    let deliveryCharge = calculateDeliveryCharge(subtotal);

    let packagingCharge = calculatePackagingCharge(subtotal);

    let discount = calculateDiscount(subtotal);

    let totalAmount = calculateTotal(subtotal,deliveryCharge,packagingCharge,discount);


    document.getElementById("subtotal-amount").textContent = "₹" + subtotal.toFixed(2);

    document.getElementById("delivery-amount").textContent = "₹" + deliveryCharge.toFixed(2);

    document.getElementById("packaging-amount").textContent = "₹" + packagingCharge.toFixed(2);

    document.getElementById("discount-amount").textContent = "-₹" + discount.toFixed(2);

    document.getElementById("total-amount").textContent ="₹" + totalAmount.toFixed(2);

}

updateOrderSummary();
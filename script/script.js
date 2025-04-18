let currentOrder = [];
let total = 0;

const menuPrices = {
    "Corn Ribs": 15,
    "Crab Hushpuppies": 14,
    "House Salad Half": 8,
    "House Salad Full": 11,
    "Fried Wings Small": 10,
    "Fried Wings Large": 16,
    "Fried Okra": 12,
    "Firecracker Shrimp": 16,

    "Water": 1,
    "Coca Cola": 2,
    "Sprite": 2,
    "Pepsi": 2,
    "Fanta": 2,
    "Mountain Dew": 2,
    "Ice Tea": 5
};

document.addEventListener('DOMContentLoaded', function() {
    function populateQuantityDropdown(selectId) {
        const qtySelect = document.getElementById(selectId);
        for (let i = 1; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            qtySelect.appendChild(option);
        }
    }

    populateQuantityDropdown('qty');
    populateQuantityDropdown('drink-qty');

    document.getElementById("item").addEventListener("change", displayOrder);
    document.getElementById("qty").addEventListener("change", displayOrder);
    document.getElementById("drink").addEventListener("change", displayOrder);
    document.getElementById("drink-qty").addEventListener("change", displayOrder);
    
})

document.getElementById("phone-entry-form").addEventListener('submit', function(e) {
    e.preventDefault();
})

function lookupPhone() {
    const phoneField = document.getElementById('phone');
    const rawValue = phoneField.value.trim();
    const digitsOnly = rawValue.replace(/-/g, '');

    if (digitsOnly.length !== 10 || isNaN(digitsOnly)) {
        alert('Enter a valid phone number in the correct format');
        return;
    }


    document.getElementById('customer-info').classList.remove('hidden');
    document.getElementById('order-form').classList.remove('hidden');
}

function clearOrder() {
    document.getElementById('order-info-form').reset();
}

function displayOrder() {
    const order = document.getElementById("display-order");

    const foodElement = document.getElementById("item");
    const amountElement = document.getElementById("qty");
    const drinkElement = document.getElementById("drink");
    const drinkAmountElement = document.getElementById("drink-qty");

    const food = foodElement.value;
    const amount = parseInt(amountElement.value) || 0;
    const drink = drinkElement.value;
    const drinkAmount = parseInt(drinkAmountElement.value) || 0;

    order.innerHTML = "";

    if (!food && !amount) {
        return;
    }

    const orderHeader = document.createElement('h2');
    const orderDetails = document.createElement('p');
    orderHeader.innerText = "Your Order:";
    
    let html = "";
    let total = 0;

    if (food && amount) {
        total += menuPrices[food] * amount;
        html += `<strong>Item:</strong> ${food} &nbsp; | &nbsp; <strong>Quantity:</strong> ${amount}<br>`;
    }
    if (drink && drinkAmount) {
        html += `<strong>Drink:</strong> ${drink} &nbsp; | &nbsp; <strong>Quantity:</strong> ${drinkAmount}`;
        total += menuPrices[drink] * amount;
    }
    
    html += `<br><strong>Total:</strong> $${total.toFixed(2)}`;
    orderDetails.innerHTML = html;

    order.appendChild(orderHeader);
    order.appendChild(orderDetails);

}


// function clearForms() {
//     document.getElementById('phone-entry-form').reset();
//     document.getElementById('customer-info-form').reset();
//     document.getElementById('order-info-form').reset();
// }
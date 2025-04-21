//state object. Holds customer and order info
const state = {
    currentOrder: [],
    total: 0,
    savedPhone: null,
    savedCustomer: null,
};

//object holds snack menu items. {name, price}
const menuSnacks = {
    "Corn Ribs": 15,
    "Crab Hushpuppies": 14,
    "House Salad Half": 8,
    "House Salad Full": 11,
    "Fried Wings Small": 10,
    "Fried Wings Large": 16,
    "Fried Okra": 12,
    "Firecracker Shrimp": 16,
};

//same but drinks
const menuDrinks = {
    "Water": 1,
    "Coca Cola": 2,
    "Sprite": 2,
    "Pepsi": 2,
    "Fanta": 2,
    "Mountain Dew": 2,
    "Ice Tea": 5,
};

//populates quantity, 0 - 10. Dynamic.
function populateQuantityDropdown(selectId) {
    const qtySelect = document.getElementById(selectId);
    for (let i = 0; i <= 10; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        qtySelect.appendChild(option);
    }
}

//populates select element with options. Dynamic
function populateSelect(selectId, dataObj, placeholderText) {
    const sel = document.getElementById(selectId);
    sel.innerHTML = `<option value="" disabled selected>${placeholderText}</option>`;
    Object.entries(dataObj).forEach(([name, price]) => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = `${name} — $${price}`;
        sel.appendChild(opt);
    });
}

//Renders menu into .menu-snacks and -drinks sections
function renderMenu() {
    const snackContainer = document.querySelector(".menu-snacks");
    const drinkContainer = document.querySelector(".menu-drinks");

    snackContainer.innerHTML = "";
    drinkContainer.innerHTML = "";

    //This is for the snacks
    Object.entries(menuSnacks).forEach(([name, price]) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "menu-item";
        const header = document.createElement("div");
        header.className = "menu-header";
        const title = document.createElement("h3");
        title.className = "item-name";
        title.textContent = name.toUpperCase();
        const priceTag = document.createElement("span");
        priceTag.className = "price";
        priceTag.textContent = `$${price}`;
        header.append(title, priceTag);
        itemDiv.appendChild(header);
        snackContainer.appendChild(itemDiv);
    });

    //For drinks
    Object.entries(menuDrinks).forEach(([name, price]) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "menu-item";
        const header = document.createElement("div");
        header.className = "menu-header";
        const title = document.createElement("h3");
        title.className = "item-name";
        title.textContent = name.toUpperCase();
        const priceTag = document.createElement("span");
        priceTag.className = "price";
        priceTag.textContent = `$${price}`;
        header.append(title, priceTag);
        itemDiv.appendChild(header);
        drinkContainer.appendChild(itemDiv);
    });
}

//
//MAIN DOMContentLoaded section
//
document.addEventListener("DOMContentLoaded", function () {
    //sets up quantity dropdowns for snacks and drinks
    populateQuantityDropdown("qty");
    populateQuantityDropdown("drink-qty");

    //calls function to populate select dropdown with menu items
    populateSelect("item", menuSnacks, "Select an item");
    populateSelect("drink", menuDrinks, "Select a drink");

    //if any of these id's sees a change from dropdowns, is then captured and displayOrder is updated.
    ["item", "qty", "drink", "drink-qty"].forEach((id) => {
        document.getElementById(id).addEventListener("change", displayOrder);
    });

    //Call to render menu
    renderMenu();

    //handles customer info form submission, Name AND Address. Stores in state object
    document.getElementById("customer-info-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const address = document.getElementById("address").value.trim();
        state.savedCustomer = { name, address };
        console.log("Customer saved:", state.savedCustomer);
    });

    //handles order submission
    document.getElementById("order-info-form").addEventListener("submit", function (e) {
        e.preventDefault();
        if (!state.savedCustomer) {
            alert("Please save your name & address first.");
            return;
        }

        console.log("Final Order Submitted:", state.currentOrder);
    });


    //Handles add to cart button correctly
    document.getElementById("add-to-cart").addEventListener("click", function () {
        const item = document.getElementById("item").value;
        const qty = parseInt(document.getElementById("qty").value, 10);
        const drink = document.getElementById("drink").value;
        const drinkQty = parseInt(document.getElementById("drink-qty").value, 10);

        //if valid food or drink quantity selected add to cart and add to state object
        if (item && qty > 0) {
            state.currentOrder.push({
                name: item,
                qty: qty,
                price: menuSnacks[item],
                subtotal: qty * menuSnacks[item]
            });
        }

        if (drink && drinkQty > 0) {
            state.currentOrder.push({
                name: drink,
                qty: drinkQty,
                price: menuDrinks[drink],
                subtotal: drinkQty * menuDrinks[drink]
            });
        }
        
        //call to display updated cart
        updateCartSummary();  
    });

    //Allows for button to change style after click
    document.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", function () {
            if (!this.classList.contains("active")) {
                this.classList.add("active");
            }
        });
    });
});

//prevent phone form from reloading page
document.getElementById("phone-entry-form").addEventListener("submit", function (e) {
    e.preventDefault();
});

//handles phone validation with REGEX and unlocks next section via css style class removal if valid
function lookupPhone() {
    const phoneField = document.getElementById("phone");
    const rawValue = phoneField.value.trim();
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    if (!phonePattern.test(rawValue)) {
        alert("Enter phone as 123-456-7890");
        return;
    }

    const digitsOnly = rawValue.replace(/-/g, "");
    state.savedPhone = digitsOnly;
    console.log("Phone saved:", state.savedPhone);

    //reveals customer and order sectinos if phone is valid
    document.getElementById("customer-info").classList.remove("hidden");
    document.getElementById("order-form").classList.remove("hidden");
}

//clears the current order and resets the element basically resetting its display
//essentially, wipes everything
function clearOrder() {
    document.getElementById("order-info-form").reset();
    state.currentOrder = [];
    updateCartSummary();
    document.getElementById("display-order").innerHTML = "";
}

//displays order. shows preview of food/drink order selection before adding to cart
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
    if (!food && !amount) return;

    const orderHeader = document.createElement("h2");
    orderHeader.innerText = "Your Order:";
    const orderDetails = document.createElement("p");

    let html = "";
    state.total = 0;

    if (food && amount) {
        state.total += menuSnacks[food] * amount;
        html += `<strong>Item:</strong> ${food} | <strong>Qty:</strong> ${amount}<br>`;
    }
    if (drink && drinkAmount) {
        state.total += menuDrinks[drink] * drinkAmount;
        html += `<strong>Drink:</strong> ${drink} | <strong>Qty:</strong> ${drinkAmount}<br>`;
    }

    html += `<br><strong>Total:</strong> $${state.total.toFixed(2)}`;
    orderDetails.innerHTML = html;
    order.append(orderHeader, orderDetails);
}

//Displays a dotted list of items in the cart AND the total sum of the order cost
function updateCartSummary() {
    const cartDiv = document.getElementById("cart-summary");
    cartDiv.innerHTML = "<h3>Cart Summary</h3>";

    if (state.currentOrder.length === 0) {
        cartDiv.innerHTML += "<p>Your cart is empty.</p>";
        return;
    }

    let total = 0;
    const ul = document.createElement("ul");

    state.currentOrder.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `${item.name} (x${item.qty}) — $${item.subtotal.toFixed(2)}`;
        ul.appendChild(li);
        total += item.subtotal;
    });

    cartDiv.appendChild(ul);

    const totalLine = document.createElement("p");
    totalLine.innerHTML = `<strong>Total:</strong> $${total.toFixed(2)}`;
    cartDiv.appendChild(totalLine);
}

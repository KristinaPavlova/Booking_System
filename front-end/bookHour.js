// Fetch available hours from the backend
async function fetchAvailableHours() {
    try {
        const response = await fetch('http://127.0.0.1:3000/hours');
        const data = await response.json();
        return data; // Assuming the response is in JSON format
    } catch (error) {
        console.error('Error fetching available hours:', error);
        return [];
    }
}

// Function to dynamically populate available hours
async function populateAvailableHours() {
    const servicesContainer = document.getElementById('servicesContainer');
    const availableHours = await fetchAvailableHours();

    availableHours.forEach(hour => {
        const serviceDiv = document.createElement('div');
        serviceDiv.classList.add('service');
        serviceDiv.innerHTML = `
            <p>Start time of the appointment: </p>
            <h4 class="startTime">${hour.startTime}</h4>
            <p>End time of the appointment: </p>
            <h4 class="endTime">${hour.endTime}</h4>
            <button startTime="${hour.startTime}" endTime="${hour.endTime}" onclick="addHourToBasket(this)">Запази час</button>
        `;
        servicesContainer.appendChild(serviceDiv);
    });
}

// Call the function to populate available hours
populateAvailableHours();

// Function to add an item to the basket
function addToBasket(serviceName, servicePrice) {
    // Check if the item is already in the basket
    // If not, add it to the basket
    var basketItems = document.getElementById('basketItems');
    var newItem = document.createElement('li');

    // Create a container for better styling and flexibility
    var itemContainer = document.createElement('div');
    itemContainer.classList.add('basket-item-container');

    // Item text and price
    var itemText = document.createElement('span');
    itemText.textContent = serviceName + ' - ' + formatCurrency(servicePrice);

    // Set a data attribute to store the service name
    itemContainer.setAttribute('data-service', serviceName.toLowerCase().trim());

    // Append elements to the container
    itemContainer.appendChild(itemText);

    // Append the container to the basket
    newItem.appendChild(itemContainer);
    basketItems.appendChild(newItem);

    // Update the total sum
    updateTotal();
}

// Function to format currency
function formatCurrency(amount) {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + 'лв';
}

// Function to update the total sum
function updateTotal() {
    var basketItems = document.getElementById('basketItems');
    var items = basketItems.getElementsByClassName('basket-item-container');

    var total = 0;

    // Loop through existing items in the basket and sum the prices
    for (var i = 0; i < items.length; i++) {
        var itemText = items[i].getElementsByTagName('span')[0].textContent;
        var price = parseFloat(itemText.split('-')[1].trim().replace('лв', '').replace(',', ''));
        total += price;
    }

    // Display the total sum
    let totalElement = document.getElementById('total');
    totalElement.textContent = 'Общо: ' + formatCurrency(total);
    totalElement.setAttribute('totalAmount', total);
}

// Function to add an hour slot to the basket
function addHourToBasket(button) {
    var startTime = button.getAttribute('startTime');
    var endTime = button.getAttribute('endTime');

    console.log(`${startTime} - ${endTime}`);
    // Check if any hour slot is already added
    if (isAnyHourSlotAdded()) {
        alert('Вече сте запазили час за: ' + getBookedHour());
    } else {
        // Add the hour slot to the basket
        const basketItems = document.getElementById('basketItems');
        const listItem = document.createElement('li');
        listItem.textContent = `${startTime} - ${endTime}`;

        // Add data attributes to the listItem
        listItem.dataset.startTime = startTime;
        listItem.dataset.endTime = endTime;

        // Remove button
        const removeButton = document.createElement('button');
        removeButton.className = 'removeHourButton';
        removeButton.textContent = 'Премахване';
        removeButton.addEventListener('click', function () {
            removeItemFromBasket(listItem);
        });

        listItem.appendChild(removeButton);
        listItem.className = 'basket-item-container'; // Set the class for listItem

        basketItems.appendChild(listItem);

        // Mark the added hour slot
        markHourSlotAsAdded(listItem);

        var reserveButton = document.getElementById('sentReservation');
        reserveButton.disabled = false;
    }
}

// Function to remove an item from the basket
function removeItemFromBasket(listItem) {
    const basketItems = document.getElementById('basketItems');
    basketItems.removeChild(listItem);
    var reserveButton = document.getElementById('sentReservation');
    reserveButton.disabled = true;
}

// Function to mark the added hour slot
function markHourSlotAsAdded(listItem) {
    listItem.classList.add('added');
}

// Function to unmark the removed hour slot
function unmarkHourSlotAsAdded(listItem) {
    listItem.classList.remove('added');
}

// Function to check if any hour slot is already added
function isAnyHourSlotAdded() {
    return document.querySelectorAll('.added').length > 0;
}

// Function to get the booked hour
function getBookedHour() {
    const addedSlot = document.querySelector('.added');
    if (addedSlot) {
        const hourText = addedSlot.textContent;
        return hourText;
    }
    return '';
}

// Function to retrieve basket data from localStorage
function getBasketFromLocalStorage() {
    const storedBasketData = localStorage.getItem('basketData');
    return storedBasketData ? JSON.parse(storedBasketData) : [];
}

// Example of how to use the retrieved basket data
document.addEventListener('DOMContentLoaded', function () {
    var basketData = getBasketFromLocalStorage();
    console.log('Basket Data:', basketData);

    // You can now use the basketData to visualize or manipulate the basket on the page
    // For example, you can dynamically add items to the basket based on the data.

    // Separate the basket data into services and hour slots
    var servicesData = [];
    var hoursData = [];

    for (var i = 0; i < basketData.length; i++) {
        var itemData = basketData[i];

        // Check if it's a service or an hour slot
        if (itemData.includes(' - ')) {
            // It's a service
            servicesData.push(itemData);
        } else {
            // It's an hour slot
            hoursData.push(itemData);
        }
    }

    // Add services to the basket
    var basketItems = document.getElementById('basketItems');
    for (var i = 0; i < servicesData.length; i++) {
        // Split the serviceData into name and price
        var [serviceName, servicePrice] = servicesData[i].split(' - ');
        addToBasket(serviceName, parseFloat(servicePrice));
    }

    var reserveButton = document.getElementById('sentReservation');
    reserveButton.disabled = true;

});

// Function to redirect to the next page with basket data
function sentReservation() {
    var reserveButton = document.getElementById('sentReservation');

    if (reserveButton.disabled === true) {
        alert('Не сте резервирали час за услугата.');
        return; // Stop execution if the basket is empty
    }


    // Create an array to store basket data
    var basketData = [];
    var items = document.getElementById('basketItems').getElementsByClassName('basket-item-container');

    for (var i = 0; i < items.length; i++) {
        // Check if the current 'basket-item' has a <span> element
        var spanElement = items[i].getElementsByTagName('span')[0];
        if (spanElement) {
            // If a <span> element is found, get its text content
            var itemText = spanElement.textContent;
            basketData.push(itemText);
        } else {
            // Handle the case where a 'basket-item' doesn't contain a <span> element
            console.warn("Warning: 'basket-item' without <span> element found.");
        }
    }


    // Collect client information
    let totalAmount = document.getElementById("total").getAttribute("totalAmount");
    console.log(totalAmount);
    let clientName = document.getElementById("clientName").value;
    let clientEmail = document.getElementById("clientEmail").value;
    let clientPhone = document.getElementById("clientPhone").value;
    let clientLocation = document.getElementById("clientLocation").value;

    // Get all elements with the class name "yourClassName"
    let servicesElements = document.getElementsByClassName("basket-item-container");
    let services = [];
    // elements is a live HTMLCollection, you can loop through it
    for (var i = 0; i < servicesElements.length; i++) {
        // Do something with each element
        services.push(`${servicesElements[i].getAttribute("data-service")}`);
    }

    let hourAppointments = document.getElementsByClassName("basket-item-container added");
    // Check if there is at least one element with the specified class
    if (hourAppointments.length > 0) {
        // Access the first element in the collection
        let hourAppointment = hourAppointments[0];

        // Use dataset to access custom attributes
        var startTime = hourAppointment.dataset.startTime;
        var endTime = hourAppointment.dataset.endTime;

        console.log(`${startTime} - ${endTime}`);
    } else {
        console.log("No elements with the specified class found");
    }
    // Create an object with reservation data
    var reservationData = {
        services: services,
        startTime: `${startTime}`,
        endTime: `${endTime}`,
        totalAmount: parseFloat(totalAmount),
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        address: clientLocation
    };

    // Perform the HTTP POST request using the fetch API
    fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Reservation successful:', data);
            // Clear local storage
            localStorage.clear();

            // Redirect to the welcome page
            window.location.href = 'welcomePage.html';

            // Optionally, you can handle the server's response here
            alert('Резервацията е успешна!');
        })
        .catch(error => {
            console.error('Error during reservation:', error);
            // Handle errors here
            alert('Възникна грешка при резервацията. Моля, опитайте отново.');
        });


}

function validateForm() {
    var clientName = document.getElementById("clientName").value;
    var clientEmail = document.getElementById("clientEmail").value;
    var clientPhone = document.getElementById("clientPhone").value;

    // Check if any of the required fields are empty
    if (clientName === "" || clientEmail === "" || clientPhone === "") {
        alert("Попълнете всички полета");
        return false;
    }

    // Check email format using regex
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
        alert("Въведете валиден имейл адрес");
        return false;
    }

    // Check phone format (10 digits starting with 08)
    var phoneRegex = /^08\d{8}$/;
    if (!phoneRegex.test(clientPhone)) {
        alert("Въведете валиден телефонен номер - 10 символа , започващ с 08");
        return false;
    }

    // If all validations pass, return true
    return true;
}

// Functions for modal handling
function openPaymentModal() {
    if (validateForm()) {
        document.getElementById('paymentModal').style.display = 'block';
    }
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// You can implement the payment processing logic here
function processPayment() {
    alert('Payment processed successfully!');
    // You may want to close the modal or navigate to a confirmation page
    closePaymentModal();
}
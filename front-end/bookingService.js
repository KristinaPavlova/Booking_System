document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Fetch services from the backend server
        const response = await fetch('http://127.0.0.1:3000/services');
        const servicesData = await response.json();

        if (!Array.isArray(servicesData)) {
            console.error('Invalid response from the server');
            return;
        }

        // Separate services based on category
        const servicesByCategory = {};
        servicesData.forEach(service => {
            if (!servicesByCategory[service.Category]) {
                servicesByCategory[service.Category] = [];
            }
            servicesByCategory[service.Category].push(service);
        });

        // Display services in their respective categories
        const servicesContainer = document.querySelector('.services');
        Object.keys(servicesByCategory).forEach((category, index, categories) => {
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('category');

            const categoryTitle = document.createElement('h2');
            categoryTitle.textContent = category;
            categoryContainer.appendChild(categoryTitle);

            servicesByCategory[category].forEach(service => {
                const serviceElement = createServiceElement(service);
                categoryContainer.appendChild(serviceElement);
            });

            // Append category container to the services container
            servicesContainer.appendChild(categoryContainer);

            // Add a horizontal line if it's not the last category
            if (index < categories.length - 1) {
                const horizontalLine = document.createElement('hr');
                servicesContainer.appendChild(horizontalLine);
            }
        });
    } catch (error) {
        console.error('Error fetching services:', error);
    }
});

function createServiceElement(service) {
    const serviceContainer = document.createElement('div');
    serviceContainer.classList.add('service');
    serviceContainer.setAttribute('data-price', service.Price);

    const serviceName = document.createElement('h2');
    serviceName.textContent = service.Description;

    const serviceDescription = document.createElement('p');
    serviceDescription.textContent = service.Description;

    const servicePrice = document.createElement('p');
    servicePrice.textContent = 'Цена: ' + formatCurrency(parseFloat(service.Price));

    const addButton = document.createElement('button');
    addButton.textContent = 'Добави услуга';
    addButton.addEventListener('click', function () {
        addToBasket(service.Description, parseFloat(service.Price));
    });

    serviceContainer.appendChild(serviceName);
    serviceContainer.appendChild(serviceDescription);
    serviceContainer.appendChild(servicePrice);
    serviceContainer.appendChild(addButton);

    return serviceContainer;
}

// Function to add an item to the basket
function addToBasket(serviceName, servicePrice) {
    // Check if the item is already in the basket
    if (!isItemInBasket(serviceName)) {
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

        // Remove button
        var removeButton = document.createElement('button');
        removeButton.textContent = 'Премахване';
        removeButton.addEventListener('click', function () {
            removeItemFromBasket(itemContainer);
            updateTotal();
        });

        // Append elements to the container
        itemContainer.appendChild(itemText);
        itemContainer.appendChild(removeButton);

        // Append the container to the basket
        newItem.appendChild(itemContainer);
        basketItems.appendChild(newItem);

        // Update the total sum
        updateTotal();
    } else {
        // If the item is already in the basket, you can show a message or take other actions
        alert('Тази услуга е вече добавена!');
    }
    // Save the basket data to localStorage
    saveBasketToLocalStorage(getBasketData());
}

// Function to check if an item is already in the basket
function isItemInBasket(serviceName) {
    var basketItems = document.getElementById('basketItems');
    var items = basketItems.getElementsByClassName('basket-item-container');

    // Normalize the service name for comparison
    var normalizedServiceName = serviceName.toLowerCase().trim();

    // Loop through existing items in the basket
    for (var i = 0; i < items.length; i++) {
        var itemContainer = items[i];
        
        // Get the stored service name from the data attribute
        var storedServiceName = itemContainer.getAttribute('data-service');

        if (storedServiceName === normalizedServiceName) {
            // Item is already in the basket
            return true;
        }
    }

    // Item is not in the basket
    return false;
}

// Function to remove an item from the basket
function removeItemFromBasket(itemContainer) {
    var basketItems = document.getElementById('basketItems');
    basketItems.removeChild(itemContainer.parentNode);
    // Save the basket data to localStorage
    saveBasketToLocalStorage(getBasketData());
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
    document.getElementById('total').textContent = 'Общо: ' + formatCurrency(total);
    // Save the basket data to localStorage
    saveBasketToLocalStorage(getBasketData());
    
}

// Function to format currency
function formatCurrency(amount) {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + 'лв';
}

// Function to redirect to the next page with basket data
function redirectToNextPage() {
    var basketItems = document.getElementById('basketItems');
    var items = basketItems.getElementsByClassName('basket-item-container');

    // Check if the basket is empty
    if (items.length === 0) {
        alert('Количката е празна. Моля, добавете услуги преди да продължите.');
        return; // Stop execution if the basket is empty
    }

    // Create an array to store basket data
    var basketData = [];

    // Loop through existing items in the basket and add to the array
    for (var i = 0; i < items.length; i++) {
        var itemText = items[i].getElementsByTagName('span')[0].textContent;
        basketData.push(itemText);
    }

    // Pass the basketData to the next page (replace 'nextPage.html' with your actual page)
    window.location.href = 'bookHour.html?basket=' + encodeURIComponent(JSON.stringify(basketData));
}

// Function to get the basket data
function getBasketData() {
    var basketData = [];
    var items = document.getElementById('basketItems').getElementsByClassName('basket-item-container');

    for (var i = 0; i < items.length; i++) {
        var spanElement = items[i].getElementsByTagName('span')[0];
        if (spanElement) {
            var itemText = spanElement.textContent;
            basketData.push(itemText);
        } else {
            console.warn("Warning: 'basket-item' without <span> element found.");
        }
    }

    return basketData;
}

// Function to save basket data to localStorage
function saveBasketToLocalStorage(basketData) {
    localStorage.setItem('basketData', JSON.stringify(basketData));
}

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

    var continueButton = document.getElementById('continueButton');
    continueButton.disabled = true;

});
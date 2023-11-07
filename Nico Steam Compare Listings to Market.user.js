// ==UserScript==
// @name         Nico Steam Compare Listings to Market
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Nico
// @match        https://steamcommunity.com/market/
// @match        https://steamcommunity.com/market/multibuy*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    const currentURL = window.location.href;

    let globalInputValue = "0";

    // Check which site you are on and perform different code
    if (currentURL.includes("https://steamcommunity.com/market/multibuy")) {
        // Code for https://steamcommunity.com/market/multibuy*
        insertButton();
    } else {
        // Code for https://steamcommunity.com/market
        insertElements();
    }

    function insertElements() {
        // Create an input element
        const inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.value = "0"; // Default value

        // Create a button element
        const buttonElement = document.createElement("button");
        buttonElement.innerText = "Log listings 0 to 99";

        // Function to update button text based on input value
        function updateButtonText() {
            const inputValue = parseInt(inputElement.value, 10) || 0;
            const endValue = inputValue + 99;
            buttonElement.innerText = `Log listings ${inputValue} to ${endValue}`;
        }

        // Add event listeners to the input element
        inputElement.addEventListener("input", function() {
            // Ensure only numbers are allowed
            this.value = this.value.replace(/\D/g, '');
            globalInputValue = this.value;
            updateButtonText();
        });

        // Add a click event listener to the custom button
        buttonElement.addEventListener('click', function() {
            myListings();
        });

        // Insert the input and button elements into the target div
        const targetDiv = document.getElementById("tabContentsMyActiveMarketListingsRows");
        targetDiv.appendChild(inputElement);
        targetDiv.appendChild(buttonElement);

        // Initially set the button text based on the default input value
        updateButtonText();
    }

    function myListings () {
        const url = `https://steamcommunity.com/market/mylistings/render/?query=&start=${globalInputValue}&count=100`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
            // Here, 'data' contains the JSON object
            customFunction(data);
        })
            .catch((error) => {
            console.error("Error:", error);
        });
    }

    // Define your custom JavaScript function
    function customFunction(data) {
        // Your custom logic here
        const resultsHtml = data.results_html;
        const parser = new DOMParser();
        const doc = parser.parseFromString(resultsHtml, 'text/html');
        const listingRows = doc.querySelectorAll('.market_recent_listing_row');

        const itemsSet = new Set();

        listingRows.forEach((row) => {
            const nameElement = row.querySelector('.market_listing_item_name a');
            const id = nameElement.getAttribute('href').split('/').pop(); // Extract the ID from the href

            const name = nameElement.textContent;
            const description = row.querySelector('.market_listing_game_name').textContent;

            const priceElement = row.querySelector('.market_listing_price span');
            const priceText = priceElement.textContent;

            // Extract and save only the numeric value (e.g., 115.00 or 115,00)
            const numericValue = priceText.match(/[0-9,.]+/)[0];

            itemsSet.add(JSON.stringify({ id, name, description, numericValue }));
        });

        const items = Array.from(itemsSet).map(JSON.parse);

        console.log(items);
        const logString = items.map(item => `${item.id}\t${item.name}\t${item.description}\t${item.numericValue}`).join('\n');
        console.log(logString);

        const baseURL = "https://steamcommunity.com/market/multibuy?appid=753&contextid=6";

        const itemParams = items.map((item) => `items[]=${item.id}&qty[]=0`).join('&');
        const finalURL = `${baseURL}&${itemParams}`;

        console.log(finalURL);
    }


    function insertButton() {
        // Add the custom button at the start of the specified div
        var customButton = document.createElement('a');
        customButton.className = 'btn_grey_grey btn_medium';
        customButton.innerHTML = '<span>Log sell prices</span>';

        var targetDiv = document.querySelector('#BG_bottom.market_multibuy');
        targetDiv.insertBefore(customButton, targetDiv.firstChild);

        // Add a click event listener to the custom button
        customButton.addEventListener('click', function() {
            // Call your custom JavaScript function here
            customFunction2();
        });

    }

    function customFunction2() {

        // Define an array to store the JSON data
        var jsonData = [];

        // Select the table element with the class "market_multi_table"
        var table = document.querySelector(".market_multi_table");

        // Select all the table rows (tr elements) within the tbody
        var rows = table.querySelectorAll("tbody tr");

        // Loop through each row and extract the required information
        rows.forEach(function(row) {
            // Initialize an object to store the data for each row
            var item = {};

            // Extract the 'id' from the href of the first <a> element with class "market_listing_item_name_link"
            var idElement = row.querySelector(".market_listing_item_name_link");
            item.id = idElement.getAttribute("href").split('/').pop();

            // Extract the 'num_id' from the second <td> element
            var numIdElement = row.querySelector("td:nth-child(2) span");
            item.num_id = numIdElement.id.replace("buy_", "").replace("_name", "");

            // Extract the 'lowest_sell' from the value attribute of the input field in the third <td> element
            var lowestSellElement = row.querySelector("td:nth-child(3) input");
            item.lowest_sell = lowestSellElement.value.trim().split(' ')[1];

            // Push the item object to the JSON data array
            jsonData.push(item);
        });

        const logString = jsonData.map(item => `${item.id}\t${item.num_id}\t${item.lowest_sell}`).join('\n');
        console.log(logString);

    }

})();
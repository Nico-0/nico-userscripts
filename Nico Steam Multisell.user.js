// ==UserScript==
// @name         Nico Steam Multisell
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Nico
// @match        https://steamcommunity.com/market/multisell*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Add the custom button at the start of the specified div
    var customButton = document.createElement('a');
    customButton.className = 'btn_grey_grey btn_medium';
    customButton.innerHTML = '<span>Custom prices</span>';

    var targetDiv = document.querySelector('#BG_bottom.market_multisell');
    targetDiv.insertBefore(customButton, targetDiv.firstChild);

    // Add a click event listener to the custom button
    customButton.addEventListener('click', function() {
        // Call your custom JavaScript function here
        customFunction();
    });

    // Define your custom JavaScript function
    function customFunction() {
        // Your custom logic here
        // Get the table element
        var table = document.querySelector(".market_multi_table");

        if (table) {
            // Add two columns to the <thead> row
            var theadRow = table.querySelector("thead tr");
            var headerCell1 = document.createElement("td");
            var headerCell2 = document.createElement("td");
            headerCell1.textContent = "Lowest Sell";
            headerCell2.textContent = "Highest Buy";
            theadRow.appendChild(headerCell1);
            theadRow.appendChild(headerCell2);
            headerCell2.setAttribute("colspan", "2");

            // Add two columns to each <tbody> row
            var tbodyRows = table.querySelectorAll("tbody tr");
            tbodyRows.forEach(function (row) {
                // Get the input value in the first cell
                var inputField = row.querySelector("td input");

                if (inputField) {
                    var inputValue = parseFloat(inputField.value);

                    // Check if the input value is greater than 0
                    if (inputValue > 0) {
                        var uniqueId = row.getAttribute("data-nameid");
                        var url = `https://steamcommunity.com/market/itemordershistogram?country=AR&language=english&currency=34&item_nameid=${uniqueId}&two_factor=0`;

                        // Make a request to the URL
                        fetch(url)
                            .then((response) => response.json())
                            .then((data) => {
                            // Extract lowest_sell_order and highest_buy_order fields
                            var lowestSellOrder = parseFloat(data.lowest_sell_order) / 100;
                            var highestBuyOrder = parseFloat(data.highest_buy_order) / 100;

                            // Create and format the cells
                            var cell1 = document.createElement("td");
                            var cell2 = document.createElement("td");

                            cell1.textContent = lowestSellOrder.toFixed(2);
                            cell2.textContent = highestBuyOrder.toFixed(2);

                            // Append the new cells to the row
                            row.appendChild(cell1);
                            row.appendChild(cell2);

                            // Look for the input element with the specified ID and update its value
                            var inputToUpdate = document.getElementById(`sell_${uniqueId}_price_paid`);

                            if (inputToUpdate) {
                                inputToUpdate.value = (lowestSellOrder - 0.01).toFixed(2);
                            }
                        });
                    } else {
                        // If the input value is equal to 0, add two empty cells
                        row.appendChild(document.createElement("td"));
                        row.appendChild(document.createElement("td"));
                    }
                }
            });
        }
    }
})();
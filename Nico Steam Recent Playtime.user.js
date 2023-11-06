// ==UserScript==
// @name         Nico Steam Recent Playtime
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Nico
// @match        https://steamcommunity.com/id/*/games*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Add the custom button at the start of the specified div
    var customButton = document.createElement('a');
    customButton.className = 'btn_grey_grey btn_medium';
    customButton.innerHTML = '<span>Log recent playtime</span>';

    var targetDiv = document.querySelector('.profile_small_header_bg');
    targetDiv.appendChild(customButton);

    // Add a click event listener to the custom button
    customButton.addEventListener('click', function() {
        // Call your custom JavaScript function here
        customFunction();
    });

    // Define your custom JavaScript function
    function customFunction() {
        // Your custom logic here
        // Select the container with a specific class that contains the list
        const gamesListContainer = document.querySelector('.gameslistitems_List_3tY9v');

        // Select all divs of a specific class, that correspond to each item
        const gameItems = gamesListContainer.querySelectorAll('.gameslistitems_GamesListItem_2-pQF');

        // Create an array to store the extracted data
        const extractedData = [];

        // Helper function to process playtime values
        function processPlaytime(playtimeText) {
            if (playtimeText.endsWith(" hours")) {
                return playtimeText.replace(" hours", "");
            } else if (playtimeText.endsWith(" minutes")) {
                return playtimeText.replace(" minutes", " min");
            } else {
                return playtimeText;
            }
        }

        function processPlaytimeConvert(playtimeText) {
            if (playtimeText.endsWith(" hours")) {
                return playtimeText.replace(" hours", "");
            } else if (playtimeText.endsWith(" minutes")) {
                const minutes = parseFloat(playtimeText.replace(" minutes", ""));
                const hours = (minutes / 60).toFixed(1).replace(".", ","); // Convert minutes to hours with one decimal place and use a comma as the decimal point
                return hours;
            } else {
                return playtimeText;
            }
        }

        // Loop through each item row
        gameItems.forEach(gameItem => {
            // Extract ID from the href attribute
            const idMatch = gameItem.querySelector('.gameslistitems_GameItemPortrait_1bAC6').getAttribute('href').match(/(\d+)$/);
            const id = idMatch ? idMatch[1] : '';

            // Extract game name
            const gameName = gameItem.querySelector('.gameslistitems_GameName_22awl').textContent.trim();

            // Extract recent playtime
            const recentPlaytimeSpan = gameItem.querySelector('.gameslistitems_Hours2weeks_1_mJZ');
            const recentPlaytimeText = recentPlaytimeSpan ? processPlaytimeConvert(recentPlaytimeSpan.textContent.trim().replace(/LAST TWO WEEKS/g, '')) : '';

            // Extract total playtime
            const totalPlaytimeSpan = gameItem.querySelector('.gameslistitems_Hours_26nl3');
            const totalPlaytimeText = totalPlaytimeSpan ? processPlaytimeConvert(totalPlaytimeSpan.textContent.trim().replace(/TOTAL PLAYED/g, '')) : '';

            // Add the extracted data to the array
            extractedData.push(`${id}\t${recentPlaytimeText}\t${gameName}\t${totalPlaytimeText}`);
        });

        // Join the extracted data with tabs
        const output = extractedData.join('\n');

        console.log(output);
    }
})();
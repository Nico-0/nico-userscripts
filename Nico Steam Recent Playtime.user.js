// ==UserScript==
// @name         Nico Steam Recent Playtime
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Logs game playtimes. To console for excel. For comparing stats after idling card drops. To be used in recently played tab.
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
        customFunction();
    });

    function customFunction() {

        /*
		<div style="top: 0px;"> // item
		   <div class="Panel Focusable">
			  <a href="" class="Focusable"> </a>// picture
			  <span><a href="" class="x1">Game Name</a></span>
			  <div>
				 <span class="x2"><span>LAST TWO WEEKS</span>25 minutes</span>
				 <span class="x3"><span>TOTAL PLAYED</span>51 minutes</span>
			  </div>
		   </div>
		</div>
        */
        // replace with the auto generated css class
        const recentClass= '.x2';
        const totalClass = '.x3';

        // Select the container with a specific class that contains the list
        const gamesListContainer = document.querySelector('div[data-featuretarget="gameslist-root"]');

        // Select all divs of a specific class, that correspond to each item
        const gameItems = gamesListContainer.querySelectorAll('[style*="top"]');

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

        extractedData.push(`id\trecentPlaytime\tgame\ttotalPlaytime`);
        // Loop through each item row
        gameItems.forEach(gameItem => {
            // Extract ID from the href attribute
            const idMatch = gameItem.querySelector('[href].Focusable').getAttribute('href').match(/(\d+)$/);
            const id = idMatch ? idMatch[1] : '';

            // Extract game name
            const gameElement = gameItem.querySelector(':nth-child(1)').querySelector('span > a:only-child');
            const gameName = gameElement.textContent.trim();

            // Extract recent playtime
            const recentPlaytimeSpan = gameItem.querySelector(recentClass);
            const recentPlaytimeText = recentPlaytimeSpan ? processPlaytimeConvert(recentPlaytimeSpan.textContent.trim().replace(/LAST TWO WEEKS/g, '')) : '';

            // Extract total playtime
            const totalPlaytimeSpan = gameItem.querySelector(totalClass);
            const totalPlaytimeText = totalPlaytimeSpan ? processPlaytimeConvert(totalPlaytimeSpan.textContent.trim().replace(/TOTAL PLAYED/g, '')) : '';

            // Add the extracted data to the array
            extractedData.push(`${id}\t${recentPlaytimeText}\t${gameName}\t${totalPlaytimeText}`);
        });

        // Join the extracted data with tabs
        const output = extractedData.join('\n');

        console.log(output);
    }
})();
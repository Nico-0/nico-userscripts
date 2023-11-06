// ==UserScript==
// @name         Nico Steam Card Drops Remaining
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Nico
// @match        https://steamcommunity.com/id/*/badges*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Add the custom button at the start of the specified div
    var customButton = document.createElement('a');
    customButton.className = 'btn_grey_grey btn_medium';
    customButton.innerHTML = '<span>Log drops remaining</span>';

    var targetDiv = document.querySelector('.badges_sheet');
    targetDiv.insertBefore(customButton, targetDiv.firstChild);

    // Add a click event listener to the custom button
    customButton.addEventListener('click', function() {
        // Call your custom JavaScript function here
        customFunction();
    });

    // Define your custom JavaScript function
    function customFunction() {
        // Your custom logic here
        // Select the div with class "badges_sheet"
        const badgesSheet = document.querySelector('.badges_sheet');

        // Select all divs with class "badge_row is_link" inside the "badges_sheet" div
        const badgeRows = badgesSheet.querySelectorAll('.badge_row.is_link');

        // Create an array to store the extracted data
        const extractedData = [];

        // Loop through each badge row
        badgeRows.forEach(badgeRow => {
            // Extract drops remaining
            const dropsRemainingSpan = badgeRow.querySelector('.progress_info_bold');
            const dropsRemainingText = dropsRemainingSpan ? dropsRemainingSpan.textContent : '';
            const dropsRemainingMatch = dropsRemainingText.match(/(\d+) card drop/);
            const dropsRemaining = dropsRemainingMatch ? dropsRemainingMatch[1] : '';

            // Check if dropsRemaining is not empty
            if (dropsRemaining !== '') {
                // Extract ID from the href attribute
                const idMatch = badgeRow.querySelector('.badge_row_overlay').getAttribute('href').match(/gamecards\/(\d+)/);
                const id = idMatch ? idMatch[1] : '';

                // Extract current hours
                const playtimeText = badgeRow.querySelector('.badge_title_stats_playtime').textContent.trim();
                const currentHoursMatch = playtimeText.match(/([\d.]+) hrs on record/);
                const currentHours = currentHoursMatch ? currentHoursMatch[1] : '0';

                // Extract game name
                const gameName = badgeRow.querySelector('.badge_title').textContent.trim().split('\t')[0];

                // Add the extracted data to the array
                extractedData.push(`${id}\t${currentHours}\t${gameName}\t${dropsRemaining}`);
            }
        });

        // Join the extracted data with commas and newlines
        const output = extractedData.join('\n');

        console.log(output);
    }
})();
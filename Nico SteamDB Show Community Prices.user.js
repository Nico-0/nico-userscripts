// ==UserScript==
// @name         Nico SteamDB Show Community Prices
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://steamdb.info/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const appid = document.querySelector('.scope-app').getAttribute('data-appid');

    // Add the custom button
    var customButton = document.createElement('a');
    customButton.className = 'btn btn-info';
    customButton.innerHTML = '<span>Show prices</span>';
    customButton.style.marginLeft = '10px';
    customButton.style.alignSelf = 'center';
    customButton.style.backgroundColor = '#3a75b0';

    var targetDiv = document.getElementById('communityitems').querySelector('.d-flex');
    targetDiv.appendChild(customButton);

    // Add a click event listener to the custom button
    customButton.addEventListener('click', function() {
        // Call your custom JavaScript function here
        customFunction();
    });

    // Add button link to Steam Exchange
    const newButton = customButton.cloneNode(true);
    newButton.innerHTML = '<span>Exchange</span>';
    newButton.href = `https://www.steamcardexchange.net/index.php?gamepage-appid-${appid}`;
    newButton.target = "_blank";
    targetDiv.appendChild(newButton);

    // Temporary floating field to show prices
    var customField = document.createElement('div');
    customField.innerHTML = '-----';
    customField.setAttribute("id", "myExtraField");
    customField.style.position = 'fixed';
    customField.style.top = '25%';
    customField.style.right = '0';
    customField.style.fontSize = '24px';

    var targetDiv2 = document.getElementById('communityitems');
    targetDiv2.appendChild(customField);

    function customFunction() {

        // API examples:
        // https://github.com/DrKain/steam-market-search

        var url = `https://steamcommunity.com/market/search/render/?query=&category_753_Game[]=tag_app_${appid}&category_753_cardborder[]=tag_cardborder_0&start=0&count=20&appid=753&norender=1`

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const items = data.results;

                    var priceTable = "<table class=\"table table-bordered\"><tr><th align=\"right\">Card</th><th align=\"right\">Price</th><th align=\"right\">Amount</th></tr>";

                    for (var i = 0; i < items.length; i++) {
                        var name = items[i].name;
                        var price = items[i].sell_price_text;
                        var amount = items[i].sell_listings;
                        priceTable += "<tr><td align=\"right\" class=\"\">" + name.slice(0, 16) + "</td><td align=\"right\">" + price + "</td><td align=\"right\">" + amount + "</td></tr>";
                    }
                    priceTable += "</table>";

                    customField.insertAdjacentHTML('afterbegin', priceTable);

                } else {
                    console.error('Failed to fetch data:', response.statusText);
                }
            },
            onerror: function(error) {
                console.error('Error during data fetch:', error);
            }
        });

    }

})();
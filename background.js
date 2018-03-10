'use strict';

var map;

loadMap();

function onClickedListener() {
    handleCurrentTab(function (tab) {
            var status = isInMap(tab.url);
            if (status) {
                chrome.tabs.update(tab.id, {url: status.url})
            } else {
                loadMap();
            }
        }
    )
}

chrome.browserAction.onClicked.addListener(onClickedListener);
chrome.tabs.onActivated.addListener(tabActivated);
chrome.tabs.onUpdated.addListener(tabActivated);


function tabActivated() {
    handleCurrentTab(function (tab) {
        var status = isInMap(tab.url);
        if (status) {
            chrome.browserAction.setIcon({path: status.icon});
        } else {
            chrome.browserAction.setIcon({path: 'default.png'});
        }

    })
}

function handleCurrentTab(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };
    chrome.tabs.query(queryInfo, function (tabs) {
        callback(tabs[0]);
    });
}


function loadMap() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        map = JSON.parse(xhr.responseText);
    };
    xhr.open('GET', 'https://raw.githubusercontent.com/DiamondYuan/switch-document/master/data.json');
    xhr.send();
}

function isInMap(url) {
    for (var key in map) {
        if (url.match(key)) {
            return {
                icon: "cn.png",
                url: url.replace(key, map[key])
            }
        }
        if (url.match(map[key])) {
            return {
                icon: "en.png",
                url: url.replace(map[key], key)
            }
        }
    }
}





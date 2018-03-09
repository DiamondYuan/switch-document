'use strict';

var map;
var xhr = new XMLHttpRequest();
xhr.onload = function() {
    var json = xhr.responseText;
    json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); 
    map = JSON.parse(json);
    console.log(json)
};
xhr.open('GET', 'https://raw.githubusercontent.com/DiamondYuan/switch-document/master/data.json');
xhr.send();

chrome.browserAction.onClicked.addListener(iconClick);
chrome.tabs.onActivated.addListener(tabActivated);
chrome.tabs.onUpdated.addListener(tabActivated);

function iconClick() {
  getCurrentTabUrl(goTo)
};

function tabActivated() {
  getCurrentTabUrl(chaneIcon)
};

function goTo(url) {
  for (var key in map) {
    if (url.match(key)) {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
        var currentUrl = tab[0].url;
        chrome.tabs.update(tab.id, { url: currentUrl.replace(key, map[key]) });
      });
      return
    }
    if (url.match(map[key])) {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
        var currentUrl = tab[0].url;
        chrome.tabs.update(tab.id, { url: currentUrl.replace(map[key], key) });
      });
      return
    }
  }
}

function chaneIcon(url) {
  console.log(url)
  for (var key in map) {
    if (url.match(key)) {
      chrome.browserAction.setIcon({ path: "cn.png" });
      return
    }
    if (url.match(map[key])) {
      chrome.browserAction.setIcon({ path: 'en.png' });
      return
    }
  }
  chrome.browserAction.setIcon({ path: 'default.png' });
}

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function (tabs) {
    callback(tabs[0].url);
  });
}
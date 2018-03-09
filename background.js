// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var map = {
  "https://kubernetes.io/": "https://k8smeetup.github.io",
  "http://reactivex.io/rxjs":"http://cn.rx.js.org",
  "https://reactjs.org/":"https://doc.react-china.org/",
  "https://webpack.js.org/":"https://doc.webpack-china.org/",
  "highcharts.com/":"hcharts.cn/"
}

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
    var tab = tabs[0];
    var url = tab.url;
    callback(url);
  });
}
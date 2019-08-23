class Loading {
  start() {
    chrome.browserAction.setIcon({ path: 'loading.gif' });
  }
  end() {
    chrome.browserAction.setIcon({ path: 'default.png' });
  }
}

const loading = new Loading();
let map = {};

function urlChangeHandler(url) {
  var status = isInMap(url);
  console.log('urlChangeHandler', status, url, map);
  if (status) {
    chrome.browserAction.setIcon({ path: status.icon });
  } else {
    chrome.browserAction.setIcon({ path: 'default.png' });
  }
}

async function loadData() {
  loading.start();
  const response = await fetch(
    'https://raw.githubusercontent.com/DiamondYuan/switch-document/master/data.json',
  );
  loading.end();
  map = await response.json();
}

loadData();

function isInMap(url) {
  for (var key in map) {
    if (url.match(key)) {
      return {
        icon: 'cn.png',
        url: url.replace(key, map[key]),
      };
    }
    if (url.match(map[key])) {
      return {
        icon: 'en.png',
        url: url.replace(map[key], key),
      };
    }
  }
}

chrome.browserAction.onClicked.addListener(tab => {
  var status = isInMap(tab.url);
  if (status) {
    chrome.tabs.update(tab.id, { url: status.url });
  } else {
    loadData();
  }
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, ({ url }) => {
    urlChangeHandler(url);
  });
});
chrome.tabs.onUpdated.addListener((_, { url }) => {
  urlChangeHandler(url);
});

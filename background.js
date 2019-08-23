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
  if (!url) {
    return;
  }
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
    'https://api.github.com/repos/diamondyuan/switch-document/contents/data.json',
  );
  loading.end();
  map = JSON.parse(window.atob((await response.json()).content));
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

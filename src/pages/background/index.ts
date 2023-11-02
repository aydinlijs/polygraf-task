import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';

reloadOnUpdate('pages/background');

console.log('background loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchProductDetails') {
    // console.log(message.data);
    sendResponse(true);
  }
});

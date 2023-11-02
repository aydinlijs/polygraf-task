/* eslint-disable no-var */
import './../../../utils/parser';

var data = window['parser'].parseProductPage();

console.log(data);
console.log("Please view the extension's terminal to see the data formatted");

chrome.runtime.sendMessage({
  action: 'fetchProductDetails',
  data,
});

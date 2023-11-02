import {
  getProductASIN,
  getProductPrice,
  getReviews,
  getSellerInformation,
  queryProductInfo,
  queryProductInfoByAttribute,
} from '@root/utils/helpers';

const data = {
  title: document.title,
  in_platform_id: getProductASIN(),
  platform_rating: queryProductInfo('#acrPopover a span'),
  img: queryProductInfoByAttribute('#landingImage', 'src'),
  reviews_count: queryProductInfo('#acrCustomerReviewText'),
  price: getProductPrice(),
  seller: {
    ...getSellerInformation(),
    platform: {
      name: 'amazon',
      url: 'https://www.amazon.com',
    },
  },
  url: document.URL,
  reviews: getReviews(),
};
console.log(data);
console.log("Please view the extension's terminal to see the data formatted");

chrome.runtime.sendMessage({
  action: 'fetchProductDetails',
  data,
});

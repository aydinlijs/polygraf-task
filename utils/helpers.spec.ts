import {
  queryProductInfo,
  queryProductInfoByAttribute,
  getProductASIN,
  getSellerInformation,
  getProductPrice,
  parseInPlatformAccountId,
  getReviews,
} from './helpers';

// Mocking the document to simulate the DOM structure
const setupDOM = html => {
  document.body.innerHTML = html;
};

describe('Amazon Product Page Scraper Utils', () => {
  test('queryProductInfo', () => {
    setupDOM(`<div class="product-name">Test Product</div>`);

    const result = queryProductInfo('.product-name');
    expect(result).toBe('Test Product');
  });

  test('queryProductInfoByAttribute', () => {
    setupDOM(`<div class="product" data-id="123">Test Product</div>`);

    const result = queryProductInfoByAttribute('.product', 'data-id');
    expect(result).toBe('123');
  });

  test('getProductASIN', () => {
    setupDOM(`
        <table id="productDetails_detailBullets_sections1">
          <tbody>
            <tr>
              <th class="a-color-secondary a-size-base prodDetSectionEntry">ASIN</th>
              <td class="a-size-base prodDetAttrValue">ABC12345</td>
            </tr>
          </tbody>
        </table>
      `);

    const result = getProductASIN();
    expect(result).toBe('ABC12345');
  });

  test('getSellerInformation', () => {
    setupDOM(`
        <a id="bylineInfo" href="/stores/storename/page/61235123-ABF-4A2C-B534-613214231"></a>
      `);

    const result = getSellerInformation();
    expect(result).toEqual({
      name: 'storename',
      in_platform_id: '61235123-ABF-4A2C-B534-613214231',
      profile_url: '/stores/storename/page/61235123-ABF-4A2C-B534-613214231',
    });
  });

  test('getProductPrice', () => {
    setupDOM(`
        <div class="a-price">
          <span class="a-price-symbol">$</span>
          <span class="a-price-whole">20</span>
          <span class="a-price-fraction">.99</span>
        </div>
      `);

    const result = getProductPrice();
    expect(result).toBe('$20.99');
  });

  test('getReviews', () => {
    setupDOM(`
      <div class="a-section review" id="rev1">
        <span class="a-icon review-rating a-star-5">5 out of 5 stars</span>
        <div class="a-row">
          <span class="review-text">
            <span class="reviewText">Great product!</span>
          </span>
        </div>
        <a class="a-profile" href="/gp/profile/john.doe.123/ref=cm_cr_dp_d_gw_tr">
          <div class="a-profile-name">John Doe</div>
        </a>
      </div>
      <div class="a-section review" id="rev2">
        <span class="a-icon review-rating a-star-2">2 out of 5 stars</span>
        <div class="a-row">
          <span class="review-text">
            <span class="reviewText">Not as expected.</span>
          </span>
        </div>
        <a class="a-profile" href="/gp/profile/jane.doe.456/ref=cm_cr_dp_d_gw_tr">
          <div class="a-profile-name">Jane Doe</div>
        </a>
      </div>
    `);

    const reviews = getReviews();
    expect(reviews).toEqual([
      {
        in_platform_id: 'rev1',
        review: 'Great product!',
        is_recommended: true,
        platform_rating: '5 out of 5 stars',
        author: {
          full_name: 'John Doe',
          profile_url: '/gp/profile/john.doe.123/ref=cm_cr_dp_d_gw_tr',
          in_platform_id: '123',
        },
      },
      {
        in_platform_id: 'rev2',
        review: 'Not as expected.',
        is_recommended: false,
        platform_rating: '2 out of 5 stars',
        author: {
          full_name: 'Jane Doe',
          profile_url: '/gp/profile/jane.doe.456/ref=cm_cr_dp_d_gw_tr',
          in_platform_id: '456',
        },
      },
    ]);
  });

  test('parseInPlatformAccountId', () => {
    const url1 = '/gp/profile/john.doe.12345/ref=cm_cr_dp_d_gw_tr';
    const result1 = parseInPlatformAccountId(url1);
    expect(result1).toBe('12345');

    const url2 = '/gp/profile/user.abc/ref=cm_cr_dp_d_gw_tr';
    const result2 = parseInPlatformAccountId(url2);
    expect(result2).toBe('abc');

    const url3 = 'N/A';
    const result3 = parseInPlatformAccountId(url3);
    expect(result3).toBe('');
  });
});

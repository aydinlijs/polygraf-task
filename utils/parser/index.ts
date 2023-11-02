export default (function () {
  const queryProductInfo = (query: string, doc: Element | Document = document) =>
    doc.querySelector(query)?.textContent?.trim() || 'N/A';

  const queryProductInfoByAttribute = (query: string, attr: string, doc: Element | Document = document) =>
    doc.querySelector(query)?.getAttribute(attr) || 'N/A';

  const getProductASIN = () => {
    const rows = document.querySelectorAll('#productDetails_detailBullets_sections1 tbody tr');

    let ASIN = null;
    for (const row of rows) {
      const header = row.querySelector('th.a-color-secondary.a-size-base.prodDetSectionEntry');
      if (header && header.textContent.trim() === 'ASIN') {
        const valueCell = row.querySelector('td.a-size-base.prodDetAttrValue');
        if (valueCell) {
          ASIN = valueCell.textContent.trim();
          break;
        }
      }
    }

    return ASIN;
  };

  const getSellerInformation = () => {
    const byline = document.getElementById('bylineInfo');
    const profile_url = byline?.getAttribute('href') || 'N/A';
    const url_pieces = profile_url.split('/');
    const last_piece = url_pieces.pop();

    return {
      in_platform_id: last_piece.split('?')[0],
      name: url_pieces[2],
      profile_url,
    };
  };

  const getProductPrice = () => {
    const symbol = document.querySelector('.a-price .a-price-symbol')?.textContent || '';
    const whole = document.querySelector('.a-price .a-price-whole')?.textContent || '0';
    const fraction = document.querySelector('.a-price .a-price-fraction')?.textContent || '.00';

    return `${symbol}${whole}${fraction}`;
  };

  const parseInPlatformAccountId = profile_url => {
    if (profile_url === 'N/A') return '';
    const account_piece_of_url = profile_url.split('/')[3];
    const in_platform_id = account_piece_of_url.split('.').pop();

    return in_platform_id;
  };

  const getReviews = () => {
    const list = document.querySelectorAll('.a-section.review');
    return Array.from(list).map(item => {
      const review = queryProductInfo('.a-row .review-text .reviewText', item);
      const rating = item.querySelector('.a-icon.review-rating');
      const starClass = Array.from(rating.classList).find(cl => cl.startsWith('a-star'));
      const star = starClass.split('-').pop();
      const profile_url = queryProductInfoByAttribute('.a-profile', 'href', item);
      return {
        in_platform_id: item?.getAttribute('id') || 'N/A',
        review,
        is_recommended: +star > 3, //true if number is >3
        platform_rating: rating?.textContent || 'N/A',
        author: {
          full_name: queryProductInfo('.a-profile .a-profile-name', item),
          profile_url,
          in_platform_id: parseInPlatformAccountId(profile_url),
        },
      };
    });
  };

  const parseProductPage = () => ({
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
  });

  window['parser'] = { parseProductPage };

  return {
    queryProductInfo,
    queryProductInfoByAttribute,
    parseProductPage,
    getReviews,
    parseInPlatformAccountId,
    getSellerInformation,
    getProductASIN,
    getProductPrice,
  };
})();

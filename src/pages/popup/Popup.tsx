import '@pages/popup/Popup.css';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import withSuspense from '@src/shared/hoc/withSuspense';
import { useState, useEffect, useRef, useCallback } from 'react';

const MAX_REVIEW_LENGTH = 150;
const RATE_LIMIT = 3000; // use can request a scrape every three seconds

const product_labels = {
  img: 'Image',
  in_platform_id: 'In Platform ID',
  platform_rating: 'Platform rating',
  price: 'Price',
  reviews_count: 'Reviews count',
  title: 'Title',
  url: 'URL',
};

const logTitle = title => {
  console.log(new Array(150).fill('-').join(''));
  console.log(`${new Array(70).fill(' ').join('')}${title}`);
  console.log(new Array(150).fill('-').join(''));
};

const trimReview = (rev: string) =>
  rev.length > MAX_REVIEW_LENGTH ? rev.substr(0, MAX_REVIEW_LENGTH - 3) + '...' : rev;

const Popup = () => {
  const lastClicked = useRef(0);
  const extraClicked = useRef(0);
  const timeout = useRef(null);
  const [message, setMessage] = useState({ text: '', type: 'warning' });

  const displayMessage = useCallback(
    (text, type = 'warning') => {
      if (!message.text) {
        setMessage({ text, type });
        timeout.current = setTimeout(() => setMessage({ text: '', type: 'warning' }), RATE_LIMIT);
      }
    },
    [message.text],
  );

  useEffect(() => {
    const messageListener = message => {
      if (message.action === 'fetchProductDetails') {
        if (!message.data.in_platform_id) {
          displayMessage('The page is not a product page, please navigate to one.', 'error');
          return;
        }
        logTitle('Product details');

        Object.keys(product_labels).forEach(key => {
          console.log(`\n${product_labels[key]}:\n        ${message.data[key]}\n\n`);
        });

        const { seller, reviews } = message.data;

        console.log(`\nSeller:\n
        Name: ${seller.name}\n
        Seller ID: ${seller.in_platform_id}\n
        Profile URL: ${seller.platform.url}/${seller.profile_url}\n
        Platform: ${seller.platform.name} [${seller.platform.url}]
        `);

        logTitle('Reviews');

        reviews.forEach((review, index) => {
          console.log(`\n${index + 1}. ${review.author.full_name} (${review.platform_rating})\n
          ${trimReview(review.review)}\n
          [Full review in profile] -> ${seller.platform.url}/${review.author.profile_url}\n
          Recommended: ${review.is_recommended ? 'Yes' : 'No'}\n
          `);
        });
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // cleanup listener on unmount
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [displayMessage]);

  const scrape = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const now = Date.now();

      if (now - lastClicked.current < RATE_LIMIT) {
        if (!extraClicked.current) {
          displayMessage('Too fast! Wait for a little before clicking again.');
        }

        extraClicked.current = now;
        return;
      }

      extraClicked.current = 0;
      lastClicked.current = now;
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          files: ['src/pages/content/index.js'],
        },
        function () {
          if (chrome.runtime.lastError) {
            displayMessage(`There was an error: ${chrome.runtime.lastError.message}`, 'error');
          }
        },
      );
    });
  };

  return (
    <div className="extension-popup">
      <button className="scraper-btn" onClick={scrape}>
        Scrape
      </button>
      {message.text ? <p className={`message ${message.type}`}>{message.text}</p> : null}
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occured </div>);

import packageJson from './package.json';

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: 'Polygraf Amazon Scraper',
  version: packageJson.version,
  description: packageJson.description,
  permissions: ['scripting', 'storage', 'tabs'],
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module',
  },
  host_permissions: ['https://www.amazon.com/*', 'https://www.amazon.co.uk/*'],
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'icon-34.png',
  },
  icons: {
    '128': 'icon-128.png',
  },
  content_scripts: [],
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/css/*.css', 'icon-128.png', 'icon-34.png'],
      matches: ['*://*/*'],
    },
  ],
};

export default manifest;

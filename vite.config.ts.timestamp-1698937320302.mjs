// vite.config.ts
import { defineConfig } from 'file:///Users/aydinlijs/Documents/GitHub/polygraf-task/node_modules/.pnpm/vite@3.2.7_@types+node@18.15.11_sass@1.62.1/node_modules/vite/dist/node/index.js';
import react from 'file:///Users/aydinlijs/Documents/GitHub/polygraf-task/node_modules/.pnpm/@vitejs+plugin-react@2.2.0_vite@3.2.7/node_modules/@vitejs/plugin-react/dist/index.mjs';
import path3, { resolve as resolve4 } from 'path';

// utils/plugins/make-manifest.ts
import * as fs from 'fs';
import * as path from 'path';

// utils/log.ts
function colorLog(message, type) {
  let color;
  switch (type) {
    case 'success':
      color = COLORS.FgGreen;
      break;
    case 'info':
      color = COLORS.FgBlue;
      break;
    case 'error':
      color = COLORS.FgRed;
      break;
    case 'warning':
      color = COLORS.FgYellow;
      break;
    default:
      color = COLORS[type];
      break;
  }
  console.log(color, message);
}
var COLORS = {
  Reset: '\x1B[0m',
  Bright: '\x1B[1m',
  Dim: '\x1B[2m',
  Underscore: '\x1B[4m',
  Blink: '\x1B[5m',
  Reverse: '\x1B[7m',
  Hidden: '\x1B[8m',
  FgBlack: '\x1B[30m',
  FgRed: '\x1B[31m',
  FgGreen: '\x1B[32m',
  FgYellow: '\x1B[33m',
  FgBlue: '\x1B[34m',
  FgMagenta: '\x1B[35m',
  FgCyan: '\x1B[36m',
  FgWhite: '\x1B[37m',
  BgBlack: '\x1B[40m',
  BgRed: '\x1B[41m',
  BgGreen: '\x1B[42m',
  BgYellow: '\x1B[43m',
  BgBlue: '\x1B[44m',
  BgMagenta: '\x1B[45m',
  BgCyan: '\x1B[46m',
  BgWhite: '\x1B[47m',
};

// utils/manifest-parser/index.ts
var ManifestParser = class {
  constructor() {}
  static convertManifestToString(manifest2) {
    if (process.env.__FIREFOX__) {
      manifest2 = this.convertToFirefoxCompatibleManifest(manifest2);
    }
    return JSON.stringify(manifest2, null, 2);
  }
  static convertToFirefoxCompatibleManifest(manifest2) {
    var _a;
    const manifestCopy = {
      ...manifest2,
    };
    manifestCopy.background = {
      scripts: [(_a = manifest2.background) == null ? void 0 : _a.service_worker],
      type: 'module',
    };
    manifestCopy.options_ui = {
      page: manifest2.options_page,
      browser_style: false,
    };
    manifestCopy.content_security_policy = {
      extension_pages: "script-src 'self'; object-src 'self'",
    };
    delete manifestCopy.options_page;
    return manifestCopy;
  }
};
var manifest_parser_default = ManifestParser;

// utils/plugins/make-manifest.ts
var __vite_injected_original_dirname = '/Users/aydinlijs/Documents/GitHub/polygraf-task/utils/plugins';
var { resolve } = path;
var distDir = resolve(__vite_injected_original_dirname, '..', '..', 'dist');
var publicDir = resolve(__vite_injected_original_dirname, '..', '..', 'public');
function makeManifest(manifest2, config) {
  function makeManifest2(to) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to);
    }
    const manifestPath = resolve(to, 'manifest.json');
    if (config.contentScriptCssKey) {
      manifest2.content_scripts.forEach(script => {
        script.css = script.css.map(css => css.replace('<KEY>', config.contentScriptCssKey));
      });
    }
    fs.writeFileSync(manifestPath, manifest_parser_default.convertManifestToString(manifest2));
    colorLog(`Manifest file copy complete: ${manifestPath}`, 'success');
  }
  return {
    name: 'make-manifest',
    buildStart() {
      if (config.isDev) {
        makeManifest2(distDir);
      }
    },
    buildEnd() {
      if (config.isDev) {
        return;
      }
      makeManifest2(publicDir);
    },
  };
}

// utils/plugins/custom-dynamic-import.ts
function customDynamicImport() {
  return {
    name: 'custom-dynamic-import',
    renderDynamicImport({ moduleId }) {
      if (!moduleId.includes('node_modules')) {
        if (process.env.__FIREFOX__) {
          return {
            left: `
          {
            const dynamicImport = (path) => import(path);
            dynamicImport(browser.runtime.getURL('./') + 
            `,
            right: ".split('../').join(''))}",
          };
        }
        return {
          left: `
          {
            const dynamicImport = (path) => import(path);
            dynamicImport(
            `,
          right: ')}',
        };
      }
      return {
        left: 'import(',
        right: ')',
      };
    },
  };
}

// utils/plugins/add-hmr.ts
import * as path2 from 'path';
import { readFileSync } from 'fs';
var __vite_injected_original_dirname2 = '/Users/aydinlijs/Documents/GitHub/polygraf-task/utils/plugins';
var isDev = process.env.__DEV__ === 'true';
var DUMMY_CODE = `export default function(){};`;
function getInjectionCode(fileName) {
  return readFileSync(path2.resolve(__vite_injected_original_dirname2, '..', 'reload', 'injections', fileName), {
    encoding: 'utf8',
  });
}
function addHmr(config) {
  const { background = false, view = true } = config || {};
  const idInBackgroundScript = 'virtual:reload-on-update-in-background-script';
  const idInView = 'virtual:reload-on-update-in-view';
  const scriptHmrCode = isDev ? getInjectionCode('script.js') : DUMMY_CODE;
  const viewHmrCode = isDev ? getInjectionCode('view.js') : DUMMY_CODE;
  return {
    name: 'add-hmr',
    resolveId(id) {
      if (id === idInBackgroundScript || id === idInView) {
        return getResolvedId(id);
      }
    },
    load(id) {
      if (id === getResolvedId(idInBackgroundScript)) {
        return background ? scriptHmrCode : DUMMY_CODE;
      }
      if (id === getResolvedId(idInView)) {
        return view ? viewHmrCode : DUMMY_CODE;
      }
    },
  };
}
function getResolvedId(id) {
  return '\0' + id;
}

// utils/plugins/watch-rebuild.ts
import { resolve as resolve3 } from 'path';
var __vite_injected_original_dirname3 = '/Users/aydinlijs/Documents/GitHub/polygraf-task/utils/plugins';
var rootDir = resolve3(__vite_injected_original_dirname3, '..', '..');
var manifestFile = resolve3(rootDir, 'manifest.ts');
var viteConfigFile = resolve3(rootDir, 'vite.config.ts');
function watchRebuild() {
  return {
    name: 'watch-rebuild',
    async buildStart() {
      this.addWatchFile(manifestFile);
      this.addWatchFile(viteConfigFile);
    },
  };
}

// package.json
var package_default = {
  name: 'polygraf-amazon-scraper-task',
  version: '0.0.1',
  description: 'Amazon product page scraper',
  license: 'MIT',
  scripts: {
    build: 'tsc --noEmit && vite build',
    'build:firefox': 'tsc --noEmit && cross-env __FIREFOX__=true vite build',
    'build:watch': 'cross-env __DEV__=true vite build -w --mode development',
    'build:firefox:watch': 'cross-env __DEV__=true __FIREFOX__=true vite build -w --mode development',
    'build:hmr': 'rollup --config utils/reload/rollup.config.ts',
    wss: 'node utils/reload/initReloadServer.js',
    dev: 'pnpm build:hmr && (run-p wss build:watch)',
    'dev:firefox': 'pnpm build:hmr && (run-p wss build:firefox:watch)',
    test: 'jest',
    commitlint: 'commitlint --edit',
    lint: 'eslint src --ext .ts',
    'lint:fix': 'pnpm lint -- --fix',
    prettier: 'prettier . --write',
  },
  type: 'module',
  dependencies: {
    'construct-style-sheets-polyfill': '^3.1.0',
    react: '18.2.0',
    'react-dom': '18.2.0',
  },
  devDependencies: {
    '@commitlint/cli': '^17.7.2',
    '@commitlint/config-conventional': '^17.7.0',
    '@rollup/plugin-typescript': '^8.5.0',
    '@testing-library/react': '13.4.0',
    '@types/chrome': '0.0.224',
    '@types/jest': '29.0.3',
    '@types/node': '18.15.11',
    '@types/react': '18.2.29',
    '@types/react-dom': '18.2.13',
    '@types/ws': '^8.5.4',
    '@typescript-eslint/eslint-plugin': '^6.7.5',
    '@typescript-eslint/parser': '^6.7.5',
    '@vitejs/plugin-react': '2.2.0',
    chokidar: '^3.5.3',
    'cross-env': '^7.0.3',
    eslint: '^8.36.0',
    'eslint-config-airbnb-typescript': '^17.1.0',
    'eslint-config-prettier': '^8.10.0',
    'eslint-plugin-import': '^2.28.1',
    'eslint-plugin-jsx-a11y': '^6.7.1',
    'eslint-plugin-prettier': '^4.2.1',
    'eslint-plugin-react': '^7.32.2',
    'eslint-plugin-react-hooks': '^4.6.0',
    'fs-extra': '11.1.0',
    husky: '^8.0.3',
    jest: '29.0.3',
    'jest-environment-jsdom': '29.5.0',
    'lint-staged': '^14.0.1',
    'npm-run-all': '^4.1.5',
    prettier: '^2.8.8',
    rollup: '2.79.1',
    sass: '1.62.1',
    tslib: '^2.6.2',
    'ts-jest': '29.0.2',
    'ts-loader': '9.4.2',
    typescript: '4.9.5',
    vite: '3.2.7',
    ws: '8.13.0',
  },
  'lint-staged': {
    '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
  },
  packageManager: 'pnpm@8.9.2',
};

// manifest.ts
var manifest = {
  manifest_version: 3,
  name: 'Polygraf Amazon Scraper',
  version: package_default.version,
  description: package_default.description,
  permissions: ['scripting', 'storage', 'tabs'],
  options_page: 'src/pages/options/index.html',
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
    128: 'icon-128.png',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: ['src/pages/content/index.js'],
      css: ['assets/css/contentStyle<KEY>.chunk.css'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/css/*.css', 'icon-128.png', 'icon-34.png'],
      matches: ['*://*/*'],
    },
  ],
};
var manifest_default = manifest;

// vite.config.ts
var __vite_injected_original_dirname4 = '/Users/aydinlijs/Documents/GitHub/polygraf-task';
var rootDir2 = resolve4(__vite_injected_original_dirname4);
var srcDir = resolve4(rootDir2, 'src');
var pagesDir = resolve4(srcDir, 'pages');
var assetsDir = resolve4(srcDir, 'assets');
var outDir = resolve4(rootDir2, 'dist');
var publicDir2 = resolve4(rootDir2, 'public');
var isDev2 = process.env.__DEV__ === 'true';
var isProduction = !isDev2;
var enableHmrInBackgroundScript = true;
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      '@root': rootDir2,
      '@src': srcDir,
      '@assets': assetsDir,
      '@pages': pagesDir,
    },
  },
  plugins: [
    react(),
    makeManifest(manifest_default, {
      isDev: isDev2,
      contentScriptCssKey: regenerateCacheInvalidationKey(),
    }),
    customDynamicImport(),
    addHmr({ background: enableHmrInBackgroundScript, view: true }),
    watchRebuild(),
  ],
  publicDir: publicDir2,
  build: {
    outDir,
    minify: isProduction,
    modulePreload: false,
    reportCompressedSize: isProduction,
    rollupOptions: {
      input: {
        content: resolve4(pagesDir, 'content', 'index.ts'),
        background: resolve4(pagesDir, 'background', 'index.ts'),
        contentStyle: resolve4(pagesDir, 'content', 'style.scss'),
        popup: resolve4(pagesDir, 'popup', 'index.html'),
      },
      output: {
        entryFileNames: 'src/pages/[name]/index.js',
        chunkFileNames: isDev2 ? 'assets/js/[name].js' : 'assets/js/[name].[hash].js',
        assetFileNames: assetInfo => {
          const { dir, name: _name } = path3.parse(assetInfo.name);
          const assetFolder = dir.split('/').at(-1);
          const name = assetFolder + firstUpperCase(_name);
          if (name === 'contentStyle') {
            return `assets/css/contentStyle${cacheInvalidationKey}.chunk.css`;
          }
          return `assets/[ext]/${name}.chunk.[ext]`;
        },
      },
    },
  },
});
function firstUpperCase(str) {
  const firstAlphabet = new RegExp(/( |^)[a-z]/, 'g');
  return str.toLowerCase().replace(firstAlphabet, L => L.toUpperCase());
}
var cacheInvalidationKey = generateKey();
function regenerateCacheInvalidationKey() {
  cacheInvalidationKey = generateKey();
  return cacheInvalidationKey;
}
function generateKey() {
  return `${(Date.now() / 100).toFixed()}`;
}
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidXRpbHMvcGx1Z2lucy9tYWtlLW1hbmlmZXN0LnRzIiwgInV0aWxzL2xvZy50cyIsICJ1dGlscy9tYW5pZmVzdC1wYXJzZXIvaW5kZXgudHMiLCAidXRpbHMvcGx1Z2lucy9jdXN0b20tZHluYW1pYy1pbXBvcnQudHMiLCAidXRpbHMvcGx1Z2lucy9hZGQtaG1yLnRzIiwgInV0aWxzL3BsdWdpbnMvd2F0Y2gtcmVidWlsZC50cyIsICJtYW5pZmVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9heWRpbmxpanMvRG9jdW1lbnRzL0dpdEh1Yi9wb2x5Z3JhZi10YXNrXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYXlkaW5saWpzL0RvY3VtZW50cy9HaXRIdWIvcG9seWdyYWYtdGFzay92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYXlkaW5saWpzL0RvY3VtZW50cy9HaXRIdWIvcG9seWdyYWYtdGFzay92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCBwYXRoLCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBtYWtlTWFuaWZlc3QgZnJvbSAnLi91dGlscy9wbHVnaW5zL21ha2UtbWFuaWZlc3QnO1xuaW1wb3J0IGN1c3RvbUR5bmFtaWNJbXBvcnQgZnJvbSAnLi91dGlscy9wbHVnaW5zL2N1c3RvbS1keW5hbWljLWltcG9ydCc7XG5pbXBvcnQgYWRkSG1yIGZyb20gJy4vdXRpbHMvcGx1Z2lucy9hZGQtaG1yJztcbmltcG9ydCB3YXRjaFJlYnVpbGQgZnJvbSAnLi91dGlscy9wbHVnaW5zL3dhdGNoLXJlYnVpbGQnO1xuaW1wb3J0IG1hbmlmZXN0IGZyb20gJy4vbWFuaWZlc3QnO1xuXG5jb25zdCByb290RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUpO1xuY29uc3Qgc3JjRGlyID0gcmVzb2x2ZShyb290RGlyLCAnc3JjJyk7XG5jb25zdCBwYWdlc0RpciA9IHJlc29sdmUoc3JjRGlyLCAncGFnZXMnKTtcbmNvbnN0IGFzc2V0c0RpciA9IHJlc29sdmUoc3JjRGlyLCAnYXNzZXRzJyk7XG5jb25zdCBvdXREaXIgPSByZXNvbHZlKHJvb3REaXIsICdkaXN0Jyk7XG5jb25zdCBwdWJsaWNEaXIgPSByZXNvbHZlKHJvb3REaXIsICdwdWJsaWMnKTtcblxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5fX0RFVl9fID09PSAndHJ1ZSc7XG5jb25zdCBpc1Byb2R1Y3Rpb24gPSAhaXNEZXY7XG5cbi8vIEVOQUJMRSBITVIgSU4gQkFDS0dST1VORCBTQ1JJUFRcbmNvbnN0IGVuYWJsZUhtckluQmFja2dyb3VuZFNjcmlwdCA9IHRydWU7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0Byb290Jzogcm9vdERpcixcbiAgICAgICdAc3JjJzogc3JjRGlyLFxuICAgICAgJ0Bhc3NldHMnOiBhc3NldHNEaXIsXG4gICAgICAnQHBhZ2VzJzogcGFnZXNEaXIsXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgbWFrZU1hbmlmZXN0KG1hbmlmZXN0LCB7XG4gICAgICBpc0RldixcbiAgICAgIGNvbnRlbnRTY3JpcHRDc3NLZXk6IHJlZ2VuZXJhdGVDYWNoZUludmFsaWRhdGlvbktleSgpLFxuICAgIH0pLFxuICAgIGN1c3RvbUR5bmFtaWNJbXBvcnQoKSxcbiAgICBhZGRIbXIoeyBiYWNrZ3JvdW5kOiBlbmFibGVIbXJJbkJhY2tncm91bmRTY3JpcHQsIHZpZXc6IHRydWUgfSksXG4gICAgd2F0Y2hSZWJ1aWxkKCksXG4gIF0sXG4gIHB1YmxpY0RpcixcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXIsXG4gICAgLyoqIENhbiBzbG93RG93biBidWlsZCBzcGVlZC4gKi9cbiAgICAvLyBzb3VyY2VtYXA6IGlzRGV2LFxuICAgIG1pbmlmeTogaXNQcm9kdWN0aW9uLFxuICAgIG1vZHVsZVByZWxvYWQ6IGZhbHNlLFxuICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBpc1Byb2R1Y3Rpb24sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgZGV2dG9vbHM6IHJlc29sdmUocGFnZXNEaXIsICdkZXZ0b29scycsICdpbmRleC5odG1sJyksXG4gICAgICAgIHBhbmVsOiByZXNvbHZlKHBhZ2VzRGlyLCAncGFuZWwnLCAnaW5kZXguaHRtbCcpLFxuICAgICAgICBjb250ZW50OiByZXNvbHZlKHBhZ2VzRGlyLCAnY29udGVudCcsICdpbmRleC50cycpLFxuICAgICAgICBiYWNrZ3JvdW5kOiByZXNvbHZlKHBhZ2VzRGlyLCAnYmFja2dyb3VuZCcsICdpbmRleC50cycpLFxuICAgICAgICBjb250ZW50U3R5bGU6IHJlc29sdmUocGFnZXNEaXIsICdjb250ZW50JywgJ3N0eWxlLnNjc3MnKSxcbiAgICAgICAgcG9wdXA6IHJlc29sdmUocGFnZXNEaXIsICdwb3B1cCcsICdpbmRleC5odG1sJyksXG4gICAgICAgIG9wdGlvbnM6IHJlc29sdmUocGFnZXNEaXIsICdvcHRpb25zJywgJ2luZGV4Lmh0bWwnKSxcbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdzcmMvcGFnZXMvW25hbWVdL2luZGV4LmpzJyxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IGlzRGV2ID8gJ2Fzc2V0cy9qcy9bbmFtZV0uanMnIDogJ2Fzc2V0cy9qcy9bbmFtZV0uW2hhc2hdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IGFzc2V0SW5mbyA9PiB7XG4gICAgICAgICAgY29uc3QgeyBkaXIsIG5hbWU6IF9uYW1lIH0gPSBwYXRoLnBhcnNlKGFzc2V0SW5mby5uYW1lKTtcbiAgICAgICAgICBjb25zdCBhc3NldEZvbGRlciA9IGRpci5zcGxpdCgnLycpLmF0KC0xKTtcbiAgICAgICAgICBjb25zdCBuYW1lID0gYXNzZXRGb2xkZXIgKyBmaXJzdFVwcGVyQ2FzZShfbmFtZSk7XG4gICAgICAgICAgaWYgKG5hbWUgPT09ICdjb250ZW50U3R5bGUnKSB7XG4gICAgICAgICAgICByZXR1cm4gYGFzc2V0cy9jc3MvY29udGVudFN0eWxlJHtjYWNoZUludmFsaWRhdGlvbktleX0uY2h1bmsuY3NzYDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvW2V4dF0vJHtuYW1lfS5jaHVuay5bZXh0XWA7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcblxuZnVuY3Rpb24gZmlyc3RVcHBlckNhc2Uoc3RyOiBzdHJpbmcpIHtcbiAgY29uc3QgZmlyc3RBbHBoYWJldCA9IG5ldyBSZWdFeHAoLyggfF4pW2Etel0vLCAnZycpO1xuICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZShmaXJzdEFscGhhYmV0LCBMID0+IEwudG9VcHBlckNhc2UoKSk7XG59XG5cbmxldCBjYWNoZUludmFsaWRhdGlvbktleTogc3RyaW5nID0gZ2VuZXJhdGVLZXkoKTtcbmZ1bmN0aW9uIHJlZ2VuZXJhdGVDYWNoZUludmFsaWRhdGlvbktleSgpIHtcbiAgY2FjaGVJbnZhbGlkYXRpb25LZXkgPSBnZW5lcmF0ZUtleSgpO1xuICByZXR1cm4gY2FjaGVJbnZhbGlkYXRpb25LZXk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlS2V5KCk6IHN0cmluZyB7XG4gIHJldHVybiBgJHsoRGF0ZS5ub3coKSAvIDEwMCkudG9GaXhlZCgpfWA7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9heWRpbmxpanMvRG9jdW1lbnRzL0dpdEh1Yi9wb2x5Z3JhZi10YXNrL3V0aWxzL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9heWRpbmxpanMvRG9jdW1lbnRzL0dpdEh1Yi9wb2x5Z3JhZi10YXNrL3V0aWxzL3BsdWdpbnMvbWFrZS1tYW5pZmVzdC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYXlkaW5saWpzL0RvY3VtZW50cy9HaXRIdWIvcG9seWdyYWYtdGFzay91dGlscy9wbHVnaW5zL21ha2UtbWFuaWZlc3QudHNcIjtpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGNvbG9yTG9nIGZyb20gJy4uL2xvZyc7XG5pbXBvcnQgTWFuaWZlc3RQYXJzZXIgZnJvbSAnLi4vbWFuaWZlc3QtcGFyc2VyJztcbmltcG9ydCB0eXBlIHsgUGx1Z2luT3B0aW9uIH0gZnJvbSAndml0ZSc7XG5cbmNvbnN0IHsgcmVzb2x2ZSB9ID0gcGF0aDtcblxuY29uc3QgZGlzdERpciA9IHJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnZGlzdCcpO1xuY29uc3QgcHVibGljRGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICcuLicsICdwdWJsaWMnKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFrZU1hbmlmZXN0KFxuICBtYW5pZmVzdDogY2hyb21lLnJ1bnRpbWUuTWFuaWZlc3RWMyxcbiAgY29uZmlnOiB7IGlzRGV2OiBib29sZWFuOyBjb250ZW50U2NyaXB0Q3NzS2V5Pzogc3RyaW5nIH0sXG4pOiBQbHVnaW5PcHRpb24ge1xuICBmdW5jdGlvbiBtYWtlTWFuaWZlc3QodG86IHN0cmluZykge1xuICAgIGlmICghZnMuZXhpc3RzU3luYyh0bykpIHtcbiAgICAgIGZzLm1rZGlyU3luYyh0byk7XG4gICAgfVxuICAgIGNvbnN0IG1hbmlmZXN0UGF0aCA9IHJlc29sdmUodG8sICdtYW5pZmVzdC5qc29uJyk7XG5cbiAgICAvLyBOYW1pbmcgY2hhbmdlIGZvciBjYWNoZSBpbnZhbGlkYXRpb25cbiAgICBpZiAoY29uZmlnLmNvbnRlbnRTY3JpcHRDc3NLZXkpIHtcbiAgICAgIG1hbmlmZXN0LmNvbnRlbnRfc2NyaXB0cy5mb3JFYWNoKHNjcmlwdCA9PiB7XG4gICAgICAgIHNjcmlwdC5jc3MgPSBzY3JpcHQuY3NzLm1hcChjc3MgPT4gY3NzLnJlcGxhY2UoJzxLRVk+JywgY29uZmlnLmNvbnRlbnRTY3JpcHRDc3NLZXkpKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZzLndyaXRlRmlsZVN5bmMobWFuaWZlc3RQYXRoLCBNYW5pZmVzdFBhcnNlci5jb252ZXJ0TWFuaWZlc3RUb1N0cmluZyhtYW5pZmVzdCkpO1xuXG4gICAgY29sb3JMb2coYE1hbmlmZXN0IGZpbGUgY29weSBjb21wbGV0ZTogJHttYW5pZmVzdFBhdGh9YCwgJ3N1Y2Nlc3MnKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ21ha2UtbWFuaWZlc3QnLFxuICAgIGJ1aWxkU3RhcnQoKSB7XG4gICAgICBpZiAoY29uZmlnLmlzRGV2KSB7XG4gICAgICAgIG1ha2VNYW5pZmVzdChkaXN0RGlyKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGJ1aWxkRW5kKCkge1xuICAgICAgaWYgKGNvbmZpZy5pc0Rldikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBtYWtlTWFuaWZlc3QocHVibGljRGlyKTtcbiAgICB9LFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYXlkaW5saWpzL0RvY3VtZW50cy9HaXRIdWIvcG9seWdyYWYtdGFzay91dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2F5ZGlubGlqcy9Eb2N1bWVudHMvR2l0SHViL3BvbHlncmFmLXRhc2svdXRpbHMvbG9nLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9heWRpbmxpanMvRG9jdW1lbnRzL0dpdEh1Yi9wb2x5Z3JhZi10YXNrL3V0aWxzL2xvZy50c1wiO3R5cGUgQ29sb3JUeXBlID0gJ3N1Y2Nlc3MnIHwgJ2luZm8nIHwgJ2Vycm9yJyB8ICd3YXJuaW5nJyB8IGtleW9mIHR5cGVvZiBDT0xPUlM7XG50eXBlIFZhbHVlT2Y8VD4gPSBUW2tleW9mIFRdO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb2xvckxvZyhtZXNzYWdlOiBzdHJpbmcsIHR5cGU/OiBDb2xvclR5cGUpIHtcbiAgbGV0IGNvbG9yOiBWYWx1ZU9mPHR5cGVvZiBDT0xPUlM+O1xuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3N1Y2Nlc3MnOlxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdHcmVlbjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2luZm8nOlxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdCbHVlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZXJyb3InOlxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdSZWQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlICd3YXJuaW5nJzpcbiAgICAgIGNvbG9yID0gQ09MT1JTLkZnWWVsbG93O1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGNvbG9yID0gQ09MT1JTW3R5cGVdO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICBjb25zb2xlLmxvZyhjb2xvciwgbWVzc2FnZSk7XG59XG5cbmNvbnN0IENPTE9SUyA9IHtcbiAgUmVzZXQ6ICdcXHgxYlswbScsXG4gIEJyaWdodDogJ1xceDFiWzFtJyxcbiAgRGltOiAnXFx4MWJbMm0nLFxuICBVbmRlcnNjb3JlOiAnXFx4MWJbNG0nLFxuICBCbGluazogJ1xceDFiWzVtJyxcbiAgUmV2ZXJzZTogJ1xceDFiWzdtJyxcbiAgSGlkZGVuOiAnXFx4MWJbOG0nLFxuICBGZ0JsYWNrOiAnXFx4MWJbMzBtJyxcbiAgRmdSZWQ6ICdcXHgxYlszMW0nLFxuICBGZ0dyZWVuOiAnXFx4MWJbMzJtJyxcbiAgRmdZZWxsb3c6ICdcXHgxYlszM20nLFxuICBGZ0JsdWU6ICdcXHgxYlszNG0nLFxuICBGZ01hZ2VudGE6ICdcXHgxYlszNW0nLFxuICBGZ0N5YW46ICdcXHgxYlszNm0nLFxuICBGZ1doaXRlOiAnXFx4MWJbMzdtJyxcbiAgQmdCbGFjazogJ1xceDFiWzQwbScsXG4gIEJnUmVkOiAnXFx4MWJbNDFtJyxcbiAgQmdHcmVlbjogJ1xceDFiWzQybScsXG4gIEJnWWVsbG93OiAnXFx4MWJbNDNtJyxcbiAgQmdCbHVlOiAnXFx4MWJbNDRtJyxcbiAgQmdNYWdlbnRhOiAnXFx4MWJbNDVtJyxcbiAgQmdDeWFuOiAnXFx4MWJbNDZtJyxcbiAgQmdXaGl0ZTogJ1xceDFiWzQ3bScsXG59IGFzIGNvbnN0O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYXlkaW5saWpzL0RvY3VtZW50cy9HaXRIdWIvcG9seWdyYWYtdGFzay91dGlscy9tYW5pZmVzdC1wYXJzZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9heWRpbmxpanMvRG9jdW1lbnRzL0dpdEh1Yi9wb2x5Z3JhZi10YXNrL3V0aWxzL21hbmlmZXN0LXBhcnNlci9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYXlkaW5saWpzL0RvY3VtZW50cy9HaXRIdWIvcG9seWdyYWYtdGFzay91dGlscy9tYW5pZmVzdC1wYXJzZXIvaW5kZXgudHNcIjt0eXBlIE1hbmlmZXN0ID0gY2hyb21lLnJ1bnRpbWUuTWFuaWZlc3RWMztcblxuY2xhc3MgTWFuaWZlc3RQYXJzZXIge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuXG4gIHN0YXRpYyBjb252ZXJ0TWFuaWZlc3RUb1N0cmluZyhtYW5pZmVzdDogTWFuaWZlc3QpOiBzdHJpbmcge1xuICAgIGlmIChwcm9jZXNzLmVudi5fX0ZJUkVGT1hfXykge1xuICAgICAgbWFuaWZlc3QgPSB0aGlzLmNvbnZlcnRUb0ZpcmVmb3hDb21wYXRpYmxlTWFuaWZlc3QobWFuaWZlc3QpO1xuICAgIH1cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QsIG51bGwsIDIpO1xuICB9XG5cbiAgc3RhdGljIGNvbnZlcnRUb0ZpcmVmb3hDb21wYXRpYmxlTWFuaWZlc3QobWFuaWZlc3Q6IE1hbmlmZXN0KSB7XG4gICAgY29uc3QgbWFuaWZlc3RDb3B5ID0ge1xuICAgICAgLi4ubWFuaWZlc3QsXG4gICAgfSBhcyB7IFtrZXk6IHN0cmluZ106IHVua25vd24gfTtcblxuICAgIG1hbmlmZXN0Q29weS5iYWNrZ3JvdW5kID0ge1xuICAgICAgc2NyaXB0czogW21hbmlmZXN0LmJhY2tncm91bmQ/LnNlcnZpY2Vfd29ya2VyXSxcbiAgICAgIHR5cGU6ICdtb2R1bGUnLFxuICAgIH07XG4gICAgbWFuaWZlc3RDb3B5Lm9wdGlvbnNfdWkgPSB7XG4gICAgICBwYWdlOiBtYW5pZmVzdC5vcHRpb25zX3BhZ2UsXG4gICAgICBicm93c2VyX3N0eWxlOiBmYWxzZSxcbiAgICB9O1xuICAgIG1hbmlmZXN0Q29weS5jb250ZW50X3NlY3VyaXR5X3BvbGljeSA9IHtcbiAgICAgIGV4dGVuc2lvbl9wYWdlczogXCJzY3JpcHQtc3JjICdzZWxmJzsgb2JqZWN0LXNyYyAnc2VsZidcIixcbiAgICB9O1xuICAgIGRlbGV0ZSBtYW5pZmVzdENvcHkub3B0aW9uc19wYWdlO1xuICAgIHJldHVybiBtYW5pZmVzdENvcHkgYXMgTWFuaWZlc3Q7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFuaWZlc3RQYXJzZXI7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9heWRpbmxpanMvRG9jdW1lbnRzL0dpdEh1Yi9wb2x5Z3JhZi10YXNrL3V0aWxzL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9heWRpbmxpanMvRG9jdW1lbnRzL0dpdEh1Yi9wb2x5Z3JhZi10YXNrL3V0aWxzL3BsdWdpbnMvY3VzdG9tLWR5bmFtaWMtaW1wb3J0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9heWRpbmxpanMvRG9jdW1lbnRzL0dpdEh1Yi9wb2x5Z3JhZi10YXNrL3V0aWxzL3BsdWdpbnMvY3VzdG9tLWR5bmFtaWMtaW1wb3J0LnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3VzdG9tRHluYW1pY0ltcG9ydCgpOiBQbHVnaW5PcHRpb24ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdjdXN0b20tZHluYW1pYy1pbXBvcnQnLFxuICAgIHJlbmRlckR5bmFtaWNJbXBvcnQoeyBtb2R1bGVJZCB9KSB7XG4gICAgICBpZiAoIW1vZHVsZUlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAvLyBcdTIxOTEgZG9udCBtb2RpZnkgYW55IGltcG9ydCBmcm9tIG5vZGVfbW9kdWxlc1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuX19GSVJFRk9YX18pIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVmdDogYFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IGR5bmFtaWNJbXBvcnQgPSAocGF0aCkgPT4gaW1wb3J0KHBhdGgpO1xuICAgICAgICAgICAgZHluYW1pY0ltcG9ydChicm93c2VyLnJ1bnRpbWUuZ2V0VVJMKCcuLycpICsgXG4gICAgICAgICAgICBgLFxuICAgICAgICAgICAgcmlnaHQ6IFwiLnNwbGl0KCcuLi8nKS5qb2luKCcnKSl9XCIsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxlZnQ6IGBcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBkeW5hbWljSW1wb3J0ID0gKHBhdGgpID0+IGltcG9ydChwYXRoKTtcbiAgICAgICAgICAgIGR5bmFtaWNJbXBvcnQoXG4gICAgICAgICAgICBgLFxuICAgICAgICAgIHJpZ2h0OiAnKX0nLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGVmdDogJ2ltcG9ydCgnLFxuICAgICAgICByaWdodDogJyknLFxuICAgICAgfTtcbiAgICB9LFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYXlkaW5saWpzL0RvY3VtZW50cy9HaXRIdWIvcG9seWdyYWYtdGFzay91dGlscy9wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYXlkaW5saWpzL0RvY3VtZW50cy9HaXRIdWIvcG9seWdyYWYtdGFzay91dGlscy9wbHVnaW5zL2FkZC1obXIudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2F5ZGlubGlqcy9Eb2N1bWVudHMvR2l0SHViL3BvbHlncmFmLXRhc2svdXRpbHMvcGx1Z2lucy9hZGQtaG1yLnRzXCI7aW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB0eXBlIHsgUGx1Z2luT3B0aW9uIH0gZnJvbSAndml0ZSc7XG5cbmNvbnN0IGlzRGV2ID0gcHJvY2Vzcy5lbnYuX19ERVZfXyA9PT0gJ3RydWUnO1xuXG5jb25zdCBEVU1NWV9DT0RFID0gYGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCl7fTtgO1xuXG5mdW5jdGlvbiBnZXRJbmplY3Rpb25Db2RlKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICdyZWxvYWQnLCAnaW5qZWN0aW9ucycsIGZpbGVOYW1lKSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xufVxuXG50eXBlIENvbmZpZyA9IHtcbiAgYmFja2dyb3VuZD86IGJvb2xlYW47XG4gIHZpZXc/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRkSG1yKGNvbmZpZz86IENvbmZpZyk6IFBsdWdpbk9wdGlvbiB7XG4gIGNvbnN0IHsgYmFja2dyb3VuZCA9IGZhbHNlLCB2aWV3ID0gdHJ1ZSB9ID0gY29uZmlnIHx8IHt9O1xuICBjb25zdCBpZEluQmFja2dyb3VuZFNjcmlwdCA9ICd2aXJ0dWFsOnJlbG9hZC1vbi11cGRhdGUtaW4tYmFja2dyb3VuZC1zY3JpcHQnO1xuICBjb25zdCBpZEluVmlldyA9ICd2aXJ0dWFsOnJlbG9hZC1vbi11cGRhdGUtaW4tdmlldyc7XG5cbiAgY29uc3Qgc2NyaXB0SG1yQ29kZSA9IGlzRGV2ID8gZ2V0SW5qZWN0aW9uQ29kZSgnc2NyaXB0LmpzJykgOiBEVU1NWV9DT0RFO1xuICBjb25zdCB2aWV3SG1yQ29kZSA9IGlzRGV2ID8gZ2V0SW5qZWN0aW9uQ29kZSgndmlldy5qcycpIDogRFVNTVlfQ09ERTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdhZGQtaG1yJyxcbiAgICByZXNvbHZlSWQoaWQpIHtcbiAgICAgIGlmIChpZCA9PT0gaWRJbkJhY2tncm91bmRTY3JpcHQgfHwgaWQgPT09IGlkSW5WaWV3KSB7XG4gICAgICAgIHJldHVybiBnZXRSZXNvbHZlZElkKGlkKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGxvYWQoaWQpIHtcbiAgICAgIGlmIChpZCA9PT0gZ2V0UmVzb2x2ZWRJZChpZEluQmFja2dyb3VuZFNjcmlwdCkpIHtcbiAgICAgICAgcmV0dXJuIGJhY2tncm91bmQgPyBzY3JpcHRIbXJDb2RlIDogRFVNTVlfQ09ERTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlkID09PSBnZXRSZXNvbHZlZElkKGlkSW5WaWV3KSkge1xuICAgICAgICByZXR1cm4gdmlldyA/IHZpZXdIbXJDb2RlIDogRFVNTVlfQ09ERTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRSZXNvbHZlZElkKGlkOiBzdHJpbmcpIHtcbiAgcmV0dXJuICdcXDAnICsgaWQ7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9heWRpbmxpanMvRG9jdW1lbnRzL0dpdEh1Yi9wb2x5Z3JhZi10YXNrL3V0aWxzL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9heWRpbmxpanMvRG9jdW1lbnRzL0dpdEh1Yi9wb2x5Z3JhZi10YXNrL3V0aWxzL3BsdWdpbnMvd2F0Y2gtcmVidWlsZC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYXlkaW5saWpzL0RvY3VtZW50cy9HaXRIdWIvcG9seWdyYWYtdGFzay91dGlscy9wbHVnaW5zL3dhdGNoLXJlYnVpbGQudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuXG5jb25zdCByb290RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICcuLicpO1xuY29uc3QgbWFuaWZlc3RGaWxlID0gcmVzb2x2ZShyb290RGlyLCAnbWFuaWZlc3QudHMnKTtcbmNvbnN0IHZpdGVDb25maWdGaWxlID0gcmVzb2x2ZShyb290RGlyLCAndml0ZS5jb25maWcudHMnKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd2F0Y2hSZWJ1aWxkKCk6IFBsdWdpbk9wdGlvbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3dhdGNoLXJlYnVpbGQnLFxuICAgIGFzeW5jIGJ1aWxkU3RhcnQoKSB7XG4gICAgICB0aGlzLmFkZFdhdGNoRmlsZShtYW5pZmVzdEZpbGUpO1xuICAgICAgdGhpcy5hZGRXYXRjaEZpbGUodml0ZUNvbmZpZ0ZpbGUpO1xuICAgIH0sXG4gIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9heWRpbmxpanMvRG9jdW1lbnRzL0dpdEh1Yi9wb2x5Z3JhZi10YXNrXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYXlkaW5saWpzL0RvY3VtZW50cy9HaXRIdWIvcG9seWdyYWYtdGFzay9tYW5pZmVzdC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYXlkaW5saWpzL0RvY3VtZW50cy9HaXRIdWIvcG9seWdyYWYtdGFzay9tYW5pZmVzdC50c1wiO2ltcG9ydCBwYWNrYWdlSnNvbiBmcm9tICcuL3BhY2thZ2UuanNvbic7XG5cbi8qKlxuICogQWZ0ZXIgY2hhbmdpbmcsIHBsZWFzZSByZWxvYWQgdGhlIGV4dGVuc2lvbiBhdCBgY2hyb21lOi8vZXh0ZW5zaW9uc2BcbiAqL1xuY29uc3QgbWFuaWZlc3Q6IGNocm9tZS5ydW50aW1lLk1hbmlmZXN0VjMgPSB7XG4gIG1hbmlmZXN0X3ZlcnNpb246IDMsXG4gIG5hbWU6ICdQb2x5Z3JhZiBBbWF6b24gU2NyYXBlcicsXG4gIHZlcnNpb246IHBhY2thZ2VKc29uLnZlcnNpb24sXG4gIGRlc2NyaXB0aW9uOiBwYWNrYWdlSnNvbi5kZXNjcmlwdGlvbixcbiAgcGVybWlzc2lvbnM6IFsnc2NyaXB0aW5nJywgJ3N0b3JhZ2UnLCAndGFicyddLFxuICBvcHRpb25zX3BhZ2U6ICdzcmMvcGFnZXMvb3B0aW9ucy9pbmRleC5odG1sJyxcbiAgYmFja2dyb3VuZDoge1xuICAgIHNlcnZpY2Vfd29ya2VyOiAnc3JjL3BhZ2VzL2JhY2tncm91bmQvaW5kZXguanMnLFxuICAgIHR5cGU6ICdtb2R1bGUnLFxuICB9LFxuICBob3N0X3Blcm1pc3Npb25zOiBbJ2h0dHBzOi8vd3d3LmFtYXpvbi5jb20vKicsICdodHRwczovL3d3dy5hbWF6b24uY28udWsvKiddLFxuICBhY3Rpb246IHtcbiAgICBkZWZhdWx0X3BvcHVwOiAnc3JjL3BhZ2VzL3BvcHVwL2luZGV4Lmh0bWwnLFxuICAgIGRlZmF1bHRfaWNvbjogJ2ljb24tMzQucG5nJyxcbiAgfSxcbiAgaWNvbnM6IHtcbiAgICAnMTI4JzogJ2ljb24tMTI4LnBuZycsXG4gIH0sXG4gIGNvbnRlbnRfc2NyaXB0czogW1xuICAgIHtcbiAgICAgIG1hdGNoZXM6IFsnaHR0cDovLyovKicsICdodHRwczovLyovKicsICc8YWxsX3VybHM+J10sXG4gICAgICBqczogWydzcmMvcGFnZXMvY29udGVudC9pbmRleC5qcyddLFxuICAgICAgLy8gS0VZIGZvciBjYWNoZSBpbnZhbGlkYXRpb25cbiAgICAgIGNzczogWydhc3NldHMvY3NzL2NvbnRlbnRTdHlsZTxLRVk+LmNodW5rLmNzcyddLFxuICAgIH0sXG4gIF0sXG4gIHdlYl9hY2Nlc3NpYmxlX3Jlc291cmNlczogW1xuICAgIHtcbiAgICAgIHJlc291cmNlczogWydhc3NldHMvanMvKi5qcycsICdhc3NldHMvY3NzLyouY3NzJywgJ2ljb24tMTI4LnBuZycsICdpY29uLTM0LnBuZyddLFxuICAgICAgbWF0Y2hlczogWycqOi8vKi8qJ10sXG4gICAgfSxcbiAgXSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG1hbmlmZXN0O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErVCxTQUFTLG9CQUFvQjtBQUM1VixPQUFPLFdBQVc7QUFDbEIsT0FBT0EsU0FBUSxXQUFBQyxnQkFBZTs7O0FDRitVLFlBQVksUUFBUTtBQUNqWSxZQUFZLFVBQVU7OztBQ0VQLFNBQVIsU0FBMEIsU0FBaUIsTUFBa0I7QUFDbEUsTUFBSTtBQUVKLFVBQVEsTUFBTTtBQUFBLElBQ1osS0FBSztBQUNILGNBQVEsT0FBTztBQUNmO0FBQUEsSUFDRixLQUFLO0FBQ0gsY0FBUSxPQUFPO0FBQ2Y7QUFBQSxJQUNGLEtBQUs7QUFDSCxjQUFRLE9BQU87QUFDZjtBQUFBLElBQ0YsS0FBSztBQUNILGNBQVEsT0FBTztBQUNmO0FBQUEsSUFDRjtBQUNFLGNBQVEsT0FBTztBQUNmO0FBQUEsRUFDSjtBQUVBLFVBQVEsSUFBSSxPQUFPLE9BQU87QUFDNUI7QUFFQSxJQUFNLFNBQVM7QUFBQSxFQUNiLE9BQU87QUFBQSxFQUNQLFFBQVE7QUFBQSxFQUNSLEtBQUs7QUFBQSxFQUNMLFlBQVk7QUFBQSxFQUNaLE9BQU87QUFBQSxFQUNQLFNBQVM7QUFBQSxFQUNULFFBQVE7QUFBQSxFQUNSLFNBQVM7QUFBQSxFQUNULE9BQU87QUFBQSxFQUNQLFNBQVM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLFFBQVE7QUFBQSxFQUNSLFdBQVc7QUFBQSxFQUNYLFFBQVE7QUFBQSxFQUNSLFNBQVM7QUFBQSxFQUNULFNBQVM7QUFBQSxFQUNULE9BQU87QUFBQSxFQUNQLFNBQVM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLFFBQVE7QUFBQSxFQUNSLFdBQVc7QUFBQSxFQUNYLFFBQVE7QUFBQSxFQUNSLFNBQVM7QUFDWDs7O0FDakRBLElBQU0saUJBQU4sTUFBcUI7QUFBQSxFQUVYLGNBQWM7QUFBQSxFQUFDO0FBQUEsRUFFdkIsT0FBTyx3QkFBd0JDLFdBQTRC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LGdCQUFnQjtBQUMzQixtQkFBTywwQkFBMEI7QUFBQSxVQUNuQztBQUNBLGlCQUFPLGdCQUFnQjtBQUFBLFFBQ3pCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQztBQUVELFNBQVMsZUFBZSxLQUFhO0FBQ25DLFFBQU0sZ0JBQWdCLElBQUksT0FBTyxjQUFjLEdBQUc7QUFDbEQsU0FBTyxJQUFJLFlBQVksRUFBRSxRQUFRLGVBQWUsT0FBSyxFQUFFLFlBQVksQ0FBQztBQUN0RTtBQUVBLElBQUksdUJBQStCLFlBQVk7QUFDL0MsU0FBUyxpQ0FBaUM7QUFDeEMseUJBQXVCLFlBQVk7QUFDbkMsU0FBTztBQUNUO0FBRUEsU0FBUyxjQUFzQjtBQUM3QixTQUFPLElBQUksS0FBSyxJQUFJLElBQUksS0FBSyxRQUFRO0FBQ3ZDOyIsCiAgIm5hbWVzIjogWyJwYXRoIiwgInJlc29sdmUiLCAibWFuaWZlc3QiLCAibWFuaWZlc3QiLCAibWFrZU1hbmlmZXN0IiwgInBhdGgiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicmVzb2x2ZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJyZXNvbHZlIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgInJvb3REaXIiLCAicmVzb2x2ZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJwdWJsaWNEaXIiLCAiaXNEZXYiLCAicGF0aCJdCn0K

import 'url-search-params-polyfill';
import * as smoothscroll from 'smoothscroll-polyfill';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { CacheProvider } from '@emotion/react';
import { TssCacheProvider } from 'tss-react';
import createCache from '@emotion/cache';
import GA4React from 'ga-4-react';
import App from './App';
import { getDomain } from './utils/resource';
import reduxStore from './store';

smoothscroll.polyfill();

const muiCache = createCache({
  key: 'mui',
  prepend: true,
});

const tssCache = createCache({
  key: 'tss',
});
const env = process.env.NODE_ENV;

// eslint-disable-next-line no-undef
const GAKey1 = (getDomain() === 'eu.integrator.io' ? GA_KEY_1_EU : GA_KEY_1);
// eslint-disable-next-line no-undef
const GAKey2 = (getDomain() === 'eu.integrator.io' ? GA_KEY_2_EU : GA_KEY_2);
const container = document.getElementById('root');
const root = createRoot(container);

if (env !== 'development' && GAKey1?.length > 1) {
  const ga4react = new GA4React(GAKey1);

  // We do this asynchronously so that we ensure GA script is loaded
  // before we "attach" the React app to the DOM. This ensures we don't lose any
  // tracked events.
  (async () => {
    try {
      await ga4react.initialize()
        .then(ga4 => {
        // If we want to connect a subordinate GA tracker, we simply need to add
        // a ref by pushing a new config entry which is monitored by the GA script.
          if (GAKey2?.length > 1) {
            ga4.gtag('config', GAKey2);
          }
        });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('GA initialization failed');
    }

    root.render(
      <Provider store={reduxStore}>
        <App />
      </Provider>
    );
  })();
} else { // DEV ENV
  // We don't need to register Google Analytics here.
  root.render(
    <CacheProvider value={muiCache}>
      <TssCacheProvider value={tssCache}>
        <Provider store={reduxStore}>
          <App />
        </Provider>
      </TssCacheProvider>
    </CacheProvider>
  );
}

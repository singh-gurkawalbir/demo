import 'url-search-params-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import LogRocket from 'logrocket';
import GA4React from 'ga-4-react';
import App from './App';
import rootReducer from './reducers';
import rootSaga from './sagas';
import actions from './actions';

let store;
const env = process.env.NODE_ENV;
const middleware = [];
const sagaMiddleware = createSagaMiddleware({
  onError: error => {
    // eslint-disable-next-line no-console
    console.warn('saga middleware crashed on error ', error);
    store.dispatch(actions.app.errored());
    LogRocket.captureException(error);
  },
});

middleware.push(sagaMiddleware);

middleware.push(LogRocket.reduxMiddleware({
  stateSanitizer: state => ({
    ...state,
    auth: null,
    data: null,
    session: null,
  }),
  actionSanitizer: () => null,
}));

if (env === 'development' && process.env.REDUX_LOGGER === 'true') {
  // redux-logger options reference: https://www.npmjs.com/package/redux-logger#options
  const logOptions = {
    predicate: (getState, action) => !['API_WATCHER_SUCCESS', 'API_COMPLETE'].includes(action.type),
    diff: true,
    duration: true,
    collapsed: (getState, action, logEntry) => !logEntry.error,
  };

  middleware.push(createLogger(logOptions));
}

// trace true allows us to determine the origin of dispatched actions
// using the redux dev tools plugin we can see the stack trace of where the request is originated from.
const composeEnhancers =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  // TODO: check if we need to enable it in staging.
  env === 'development' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      traceLimit: 25,
    })) || compose;

store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

sagaMiddleware.run(rootSaga);

const GAKey1 = process.env.GA_KEY_1;
const GAKey2 = process.env.GA_KEY_2;

if (env !== 'development' && GAKey1?.length > 1) {
  const ga4react = new GA4React(GAKey1);

  // We do this asynchronously so that we ensure GA script is loaded
  // before we "attach" the React app to the DOM. This ensures we don't lose any
  // tracked events.
  (async () => {
    await ga4react.initialize()
      .then(ga4 => {
        // If we want to connect a subordinate GA tracker, we simply need to add
        // a ref by pushing a new config entry which is monitored by the GA script.
        if (GAKey2?.length > 1) {
          ga4.gtag('config', GAKey2);
        }
      });

    render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    );
  })();
} else { // DEV ENV
  // We don't need to register Google Analytics here.
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
}

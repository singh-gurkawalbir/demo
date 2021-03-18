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

const GA4key = process.env.GA4_KEY;

if (env !== 'development' && GA4key) {
  const ga4react = new GA4React(GA4key);

  (async () => {
    await ga4react.initialize();
    // If we want to register multiple GA analytics buckets,
    // we can register them with the code below.
    // .then(ga4 => {
    //   ga4.gtag('config', 'UA-123'); // old tracker
    // });

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

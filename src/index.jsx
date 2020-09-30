import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import App from './App';
import rootReducer, { selectors } from './reducers';
import rootSaga from './sagas';
import actions from './actions';
import { getDomain } from './utils/resource';

let store;
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
    authentication: null,
    data: null,
    session: null,
  }),
  actionSanitizer: () => null,
}));

if (process.env.NODE_ENV === 'development') {
  // redux-logger options reference: https://www.npmjs.com/package/redux-logger#options
  const logOptions = {
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
  process.env.NODE_ENV === 'development' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      traceLimit: 25,
    })) || compose;

store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

// eslint-disable-next-line no-undef
store.dispatch(actions.app.updateUIVersion(VERSION));
const isProduction = getDomain() === 'integrator.io';
const disableTelemetry = selectors.disableTelemetry(store.getState());

if (!isProduction && !disableTelemetry) {
  // init MUST happen before saga run
  LogRocket.init('yb95vd/glad', {
    // eslint-disable-next-line no-undef
    release: VERSION,
    console: {
      isEnabled: {
        debug: false,
        log: false,
      },
    },
    dom: {
    // Yang: this is an overkill
    // but it is the safest, we need to tag input/text tags with data-public attributes to allow them to be captured
    // however, it might not be easy to do for components coming from other packages
      inputSanitizer: true,
      textSanitizer: true,
    },
    network: {
      requestSanitizer: req => {
        if (req.url.search(/aptrinsic\.com/) > -1) return null;
        // Yang: this is likely too broad
        // we may want to track non-sensitive/error request data later
        // eslint-disable-next-line no-param-reassign
        req.body = null;

        return req;
      },
      responseSanitizer: response => {
        // Yang: this is likely too broad
        // we may want to track non-sensitive/error response data later
        response.body = null;

        return response;
      },
    },
  });
  setupLogRocketReact(LogRocket);
}

sagaMiddleware.run(rootSaga);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

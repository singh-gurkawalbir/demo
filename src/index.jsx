import React from 'react';
import { whyDidYouUpdate } from 'why-did-you-update';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import App from './App';
import rootReducer from './reducers';
import rootSaga from './sagas';
import actions from './actions';
// import scriptHelp from '../scriptHelp';

const middleware = [];
let store;
const sagaMiddleware = createSagaMiddleware({
  onError: error => {
    // eslint-disable-next-line no-console
    console.warn('saga middleware crashed on error ', error);
    store.dispatch(actions.app.errored());
  },
});

// TODO:delete this after done using this script
/*
console.log('see here');
scriptHelp();
console.log('ends here');
*/
middleware.push(sagaMiddleware);

// redux-logger options reference: https://www.npmjs.com/package/redux-logger#options
const logOptions = {
  diff: true,
  duration: true,
  collapsed: (getState, action, logEntry) => !logEntry.error,
};

if (
  process.env.NODE_ENV === 'development' &&
  process.env.WHY_RERENDER === 'true'
)
  whyDidYouUpdate(React);

if (process.env.NODE_ENV === 'development') {
  middleware.push(createLogger(logOptions));
}

// trace true allows us to determine the origin of dispatched actions
// using the redux dev tools plugin we can see the stack trace of where the request is originated from.

const composeEnhancers =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 25,
      })
    : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

sagaMiddleware.run(rootSaga);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

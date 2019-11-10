import React from 'react';
import { whyDidYouUpdate } from 'why-did-you-update';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { SnackbarProvider } from 'notistack';
import App from './App';
import rootReducer from './reducers';
import rootSaga from './sagas';
import actions from './actions';

const middleware = [];
let store;
const sagaMiddleware = createSagaMiddleware({
  onError: error => {
    // eslint-disable-next-line no-console
    console.warn('saga middleware crashed on error ', error);
    store.dispatch(actions.app.errored());
  },
});

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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

sagaMiddleware.run(rootSaga);

render(
  <Provider store={store}>
    <SnackbarProvider maxSnack={3}>
      <App />
    </SnackbarProvider>
  </Provider>,
  document.getElementById('root')
);

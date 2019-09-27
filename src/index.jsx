import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { throttle } from 'lodash';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { SnackbarProvider } from 'notistack';
import App from './App';
import AppNew from './AppNew';
import rootReducer from './reducers';
import rootSaga from './sagas';
import { loadState, saveState } from './utils/session';
import actions from './actions';

const middleware = [];
let store;
const sagaMiddleware = createSagaMiddleware({
  onError: error => {
    // eslint-disable-next-line no-console
    console.warn('saga middlware crashed on error ', error);
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

// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

if (process.env.NODE_ENV === `development`) {
  middleware.push(createLogger(logOptions));
}

const preloadedState = loadState();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

store = createStore(
  rootReducer,
  preloadedState,
  composeEnhancers(applyMiddleware(...middleware))
);

store.subscribe(
  throttle(() => {
    saveState(store.getState());
  }, 1000)
);

sagaMiddleware.run(rootSaga);

render(
  <Provider store={store}>
    <SnackbarProvider maxSnack={3}>
      {process.env.USE_NEW_APP === 'true' ? <AppNew /> : <App />}
    </SnackbarProvider>
  </Provider>,
  document.getElementById('root')
);

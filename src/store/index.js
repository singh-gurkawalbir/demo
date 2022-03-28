import 'url-search-params-polyfill';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import LogRocket from 'logrocket';
import rootReducer from '../reducers';
import rootSaga from '../sagas';
import actions from '../actions';

export const getCreatedStore = () => {
// eslint-disable-next-line import/no-mutable-exports
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

  return store;
};
export const store = getCreatedStore();
export const getReduxState = () => store.getState();

export default store;

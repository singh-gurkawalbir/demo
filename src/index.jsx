import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import App from './App';
import rootReducer from './reducers';
import rootSaga from './sagas';

const middleware = [];
const sagaMiddleware = createSagaMiddleware();

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

const store = createStore(rootReducer, applyMiddleware(...middleware));

sagaMiddleware.run(rootSaga);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

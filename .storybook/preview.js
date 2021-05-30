import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { ThemeProvider } from '@material-ui/core/styles';
import themeProvider from '../src/theme/themeProvider';
import FontStager from '../src/components/FontStager';
import rootReducer from '../src/reducers';
import rootSaga from '../src/sagas';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Change theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'mirror',
      // array of plain string values or "MenuItem shape" (see storybook docs)
      items: ['light', 'sandbox', 'dark (not supported)'],
    },
  },
};

const withThemeProvider = (Story, context) => {
  const theme = themeProvider(context.globals.theme);

  return (
    <ThemeProvider theme={theme}>
      <Story {...context} />
    </ThemeProvider>
  )
}

const withRedux = (Story, context) => {
  const middleware = [];
  const sagaMiddleware = createSagaMiddleware({
    onError: error => {
      // eslint-disable-next-line no-console
      console.warn('saga middleware crashed on error ', error);
    },
  });
  
  middleware.push(sagaMiddleware);
    
  // redux-logger options reference: https://www.npmjs.com/package/redux-logger#options
  const logOptions = {
    predicate: (getState, action) => !['API_WATCHER_SUCCESS', 'API_COMPLETE'].includes(action.type),
    diff: true,
    duration: true,
    collapsed: (getState, action, logEntry) => !logEntry.error,
  };

  middleware.push(createLogger(logOptions));

  const composeEnhancers =
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    // TODO: check if we need to enable it in staging.
    env === 'development' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 25,
      })) || compose;

  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middleware))
  );

  sagaMiddleware.run(rootSaga);

  return (
    <Provider store={store}>
      <Story {...context} />
    </Provider>
  )
}

export const decorators = [
  // provide access to react-redux store to all stories.
  // possibly this does not need to be global as many
  // atomic components do not need redux.
  withRedux,

  // this decorator forces stories to re-render any time the
  // global storybook context changes. This happens when a 
  // user changes the global theme value in the Storybook toolbar.
  withThemeProvider,

  // Inject the font stager to lazy-load custom fonts 
  // for each story just like our UI does.
  (Story) => (
    <>
      <FontStager/>
      <Story />
    </>
  ),
];
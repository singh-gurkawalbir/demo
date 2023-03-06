import { MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import produce from 'immer';
import themeProvider from '../theme/themeProvider';
import {getCreatedStore} from '../store';
import server from './api/server';
import { API } from './api/utils';
import rootReducer from '../reducers';

const theme = themeProvider();
export const renderWithProviders = (ui, { initialStore, renderFun = render } = {}) => {
  const reduxStore = initialStore || getCreatedStore();
  const utils = renderFun(
    <Provider store={reduxStore}>
      <MuiThemeProvider theme={theme}>
        <SnackbarProvider>
          {ui}
        </SnackbarProvider>
      </MuiThemeProvider>
    </Provider>
  );

  return {
    utils,
    store: reduxStore,
  };
};

const returnReducer = mutationFunction => state => produce(state, mutationFunction);

export const mutateStore = (store, mutationFunction = () => {}) => {
  store.replaceReducer(returnReducer(mutationFunction));
  store.replaceReducer(rootReducer);
};

export const reduxStore = (() => {
  const initialStore = getCreatedStore();

  return initialStore;
})();

export const mockGetRequestOnce = (url, resolver) => {
  server.use(API.getOnce(url, resolver));
};
export const mockPutRequestOnce = (url, resolver) => {
  server.use(API.putOnce(url, resolver));
};
export const mockPostRequestOnce = (url, resolver) => {
  server.use(API.postOnce(url, resolver));
};
export const mockPostRequest = (url, resolver) => {
  server.use(API.post(url, resolver));
};
export const mockDeleteRequestOnce = (url, resolver) => {
  server.use(API.deleteOnce(url, resolver));
};
export const mockPatchRequestOnce = (url, resolver) => {
  server.use(API.patchOnce(url, resolver));
};

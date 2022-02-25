import { MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import themeProvider from '../theme/themeProvider';
import {getCreatedStore} from '../store';
import server from './api/server';
import { API } from './api/utils';

const theme = themeProvider();
export const renderWithProviders = (ui, initialState, initialEntries = []) => {
  const reduxStore = getCreatedStore(initialState);
  const utils = render(
    <Provider store={reduxStore}>
      <MuiThemeProvider theme={theme}>
        <SnackbarProvider>
          <MemoryRouter initialEntries={initialEntries}>
            {ui}
          </MemoryRouter>
        </SnackbarProvider>
      </MuiThemeProvider>
    </Provider>
  );

  return {
    utils,
    store: reduxStore,
  };
};

export const mockGetRequestOnce = (url, resolver) => {
  server.use(API.getOnce(url, resolver));
};

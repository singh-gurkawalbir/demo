import { MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import themeProvider from '../theme/themeProvider';
import {getCreatedStore} from '../store';

const theme = themeProvider();
export const renderWithProviders = (ui, initialState) => {
  const reduxStore = getCreatedStore(initialState);
  const utils = render(
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


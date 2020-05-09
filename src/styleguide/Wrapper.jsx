import { useState } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ConfirmDialogProvider } from '../components/ConfirmDialog';
import FontStager from '../components/FontStager';
import themeProvider from '../theme/themeProvider';
import rootReducer from '../reducers';

export default function Wrapper ({ themeName = 'light', children }) {
    const theme = themeProvider(themeName);
    const store = createStore(rootReducer);

    return (
      <Provider store={store}>
        <FontStager />
        <ConfirmDialogProvider>
          <SnackbarProvider maxSnack={3}>
            <MuiThemeProvider theme={theme}>
              {children}
            </MuiThemeProvider>
          </SnackbarProvider>
        </ConfirmDialogProvider>
      </Provider>
    );
  }

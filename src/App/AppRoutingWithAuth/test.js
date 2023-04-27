
import React from 'react';
// add react-router in package.json as actual dependency breaks test, may be version related
// eslint-disable-next-line import/no-extraneous-dependencies
import { withRouter } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import { createMemoryHistory } from 'history';
import { render, cleanup, waitFor } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { act } from 'react-dom/test-utils';
import { AppRoutingWithAuth } from './index';
import reducer from '../../reducers';
import getRoutePath from '../../utils/routePaths';
import themeProvider from '../../theme/themeProvider';
import { PageContentComponents as AppRouting } from '..';
import {HOME_PAGE_PATH} from '../../constants';
import actions from '../../actions';

// fireEvent
// Ok, so here's what your tests might look like

// this is a handy function that I would utilize for any component
// that relies on the router being in context

// This functional component creates a dummy redux state
// and wraps out custom component with react router

const theme = themeProvider();

function reduxRouterWrappedComponent({
  Component,
  history,
  store,
  componentProps,
}) {
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <Component {...componentProps} />
          </Router>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
}

window.zE = jest.fn();

describe('AppRoutingWith authentication redirection behavior', () => {
  const initSession = jest.fn();
  const clearAppError = jest.fn();
  // Should i bring a reducer and deduce the states form there
  const initializedStateProps = {
    isAuthenticated: false,
    shouldShowAppRouting: false,
    isSessionExpired: false,
    location: null,
    isAuthInitialized: false,
    initSession,
    clearAppError,
  };
  const authenticationFailed = {
    isAuthenticated: false,
    shouldShowAppRouting: true,
    isSessionExpired: false,
    isAuthInitialized: true,
    initSession,
    clearAppError,
  };
  const authenticationSucceeded = {
    isAuthenticated: true,
    shouldShowAppRouting: true,
    isSessionExpired: false,
    isAuthInitialized: true,
    initSession,
    clearAppError,
  };
  const someRoute = '/some-route';
  const WithAuth = props => (
    <SnackbarProvider>
      <AppRoutingWithAuth {...props}>
        <AppRouting />
      </AppRoutingWithAuth>
    </SnackbarProvider>
  );
  const wrappedHistory = withRouter(WithAuth);
  // We have to default the state to satisfy the state dependencies of the
  // lower order components of our targeted test component
  const store = createStore(reducer, {});

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('clear app error message', () => {
    test('should clear the app error message on refresh', () => {
      const history = createMemoryHistory({
        initialEntries: [getRoutePath(someRoute)],
      });
      const store = createStore(reducer, {app: {appErrored: true}});

      // app mounting for the first time or refreshing app
      render(
        reduxRouterWrappedComponent({
          Component: wrappedHistory,
          componentProps: initializedStateProps,
          history,
          store,
        })
      );

      expect(store.getState().app).toEqual({});
    });

    test('should not clear the app error message in any state after refresh', () => {
      const history = createMemoryHistory({
        initialEntries: [getRoutePath(someRoute)],
      });
      const store = createStore(reducer, {app: {errored: true}});

      const { rerender } = render(
        reduxRouterWrappedComponent({
          Component: wrappedHistory,
          componentProps: initializedStateProps,
          history,
          store,
        })
      );

      // a subsequent render with some state
      rerender(
        reduxRouterWrappedComponent({
          Component: wrappedHistory,
          componentProps: authenticationSucceeded,
          history,
          store,
        })
      );

      expect(store.getState().app).toEqual({errored: true});
    });
  });
  describe('test attempted Route state behavior', () => {
    test('should save the location state when the app is initialized for the very first', () => {
      const history = createMemoryHistory({
        initialEntries: [getRoutePath(someRoute)],
      });
      const store = createStore(reducer, {});
      const { rerender } = render(
        reduxRouterWrappedComponent({
          Component: wrappedHistory,
          componentProps: initializedStateProps,
          history,
          store,
        })
      );

      expect(store.getState().auth).toEqual({ initialized: false, commStatus: 'loading', authenticated: false });
      act(() => { store.dispatch(actions.auth.failure('Session expired due to extended inactivity')); });
      // if the session is invalid and the authentication
      // has failed redirect to signin page preserving the
      // state of attempted url
      rerender(
        reduxRouterWrappedComponent({
          Component: wrappedHistory,
          componentProps: authenticationFailed,
          history,
          store,
        })
      );

      expect(history.location.pathname).toBe(getRoutePath('signin'));
      expect(history.location.state.attemptedRoute).toBe(
        getRoutePath(someRoute)
      );
    });
    test('should redirect the user to attempted route when the user successfully authenticates', () => {
      const history = createMemoryHistory({
        initialEntries: [
          {
            pathname: getRoutePath('signin'),
            state: { attemptedRoute: getRoutePath(someRoute) },
          },
        ],
      });
      const store = createStore(reducer, {auth: {authenticated: true}});

      render(
        reduxRouterWrappedComponent({
          Component: wrappedHistory,
          componentProps: authenticationSucceeded,
          history,
          store,
        })
      );
      expect(history.location.pathname).toBe(getRoutePath(someRoute));
      waitFor(() => { expect(history.location.state).toBeUndefined(); });
    });
    test('should preserve attempted route state when the user authentication attempts fails', () => {
      const history = createMemoryHistory({
        initialEntries: [
          {
            pathname: getRoutePath('signin'),
            state: { attemptedRoute: getRoutePath(someRoute) },
          },
        ],
      });

      render(
        reduxRouterWrappedComponent({
          Component: wrappedHistory,
          componentProps: authenticationFailed,
          history,
          store,
        })
      );

      expect(history.location.pathname).toBe(getRoutePath('signin'));
      expect(history.location.state.attemptedRoute).toBe(
        getRoutePath(someRoute)
      );
    });

    test('should redirect the user to the mfa verify route when the user successfully authenticates and the user has mfa configured', () => {
      const history = createMemoryHistory({
        initialEntries: [
          {
            pathname: getRoutePath('signin'),
          },
        ],
      });

      const store = createStore(reducer, { auth: { mfaRequired: true } });

      render(
        reduxRouterWrappedComponent({
          Component: wrappedHistory,
          componentProps: authenticationSucceeded,
          history,
          store,
        })
      );

      expect(history.location.pathname).toBe(getRoutePath('/mfa/verify'));
      expect(history.location.state).toBeUndefined();
    });
  });

  const sessionExpired = {
    isAuthenticated: false,
    shouldShowAppRouting: true,
    isSessionExpired: true,
    isAuthInitialized: true,
    initSession,
    clearAppError,
  };

  test('should stay in the same route when the user session has expired', () => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: getRoutePath(HOME_PAGE_PATH),
        },
      ],
    });

    const sessionState = {
      mfa: {
        sessionInfo:
        {
          status: 'received',
          data: {
            mfaVerified: true, mfaRequired: true, mfaSetupRequired: true,
          },
        },
      },
    };

    const store = createStore(reducer, { session: sessionState });

    render(
      reduxRouterWrappedComponent({
        Component: wrappedHistory,
        componentProps: sessionExpired,
        history,
        store,
      })
    );

    expect(history.location.pathname).toBe(getRoutePath(HOME_PAGE_PATH));
  });

  const loggedOut = {
    isAuthenticated: false,
    shouldShowAppRouting: true,
    isSessionExpired: false,
    isAuthInitialized: false,
    initSession,
    clearAppError,
  };

  test('should redirect the user to the signin route when the user has logged out', () => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: getRoutePath(''),
        },
      ],
    });
    const store = createStore(reducer, { auth: {loggedOut: true} });
    const { getByPlaceholderText } = render(
      reduxRouterWrappedComponent({
        Component: wrappedHistory,
        componentProps: loggedOut,
        history,
        store,
      })
    );

    expect(history.location.pathname).toBe(getRoutePath('signin'));
    expect(getByPlaceholderText('Email*')).toBeTruthy();
    expect(getByPlaceholderText('Password*')).toBeTruthy();
  });

  test('should redirect the user to the agreeTOSAndPP route when the user has not agreed to TOS', () => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: getRoutePath('/home'),
        },
      ],
    });
    const sessionState = {
      mfa: {
        sessionInfo:
        {
          status: 'received',
          data: {
            mfaVerified: true, mfaRequired: true, mfaSetupRequired: false, authenticated: true, agreeTOSAndPP: false,
          },
        },
      },
    };
    const store = createStore(reducer, { session: sessionState, user: {profile: {agreeTOSAndPP: false}} });

    render(
      reduxRouterWrappedComponent({
        Component: wrappedHistory,
        componentProps: loggedOut,
        history,
        store,
      })
    );

    expect(history.location.pathname).toBe(getRoutePath('/agreeTOSAndPP'));
  });
  test('should redirect the user to the agreeTOSAndPP route when the user has not agreed to TOS1', () => {
    jest.spyOn(window, 'location', 'get').mockReturnValue({
      value: {
        href: '',
      },
      writable: true,
    });
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: getRoutePath('/signin'),
          search: '?application=shopify&code=123&host=abc',
        },
      ],
    });
    const store = createStore(reducer, { auth: {authenticated: true} });

    render(
      reduxRouterWrappedComponent({
        Component: wrappedHistory,
        componentProps: loggedOut,
        history,
        store,
      })
    );
    expect(window.location.href).toBe(getRoutePath('/connection/shopify/oauth2callback?application=shopify&code=123&host=abc'));
  });
});

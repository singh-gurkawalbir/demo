/* global describe, test, expect, afterEach ,jest */
import React from 'react';
import { withRouter } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core';
import { createMemoryHistory } from 'history';
import { render, cleanup } from '@testing-library/react';
import { AppRoutingWithAuth } from './index';
import reducer from '../../reducers';
import getRoutePath from '../../utils/routePaths';
import themeProvider from '../themeProvider';
import AppRouting from '../AppRouting';

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
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
          <Component {...componentProps} />
        </Router>
      </MuiThemeProvider>
    </Provider>
  );
}

describe.skip('AppRoutingWith authentication redirection behavior', () => {
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
    <AppRoutingWithAuth {...props}>
      <AppRouting />
    </AppRoutingWithAuth>
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

      // app mounting for the first time or refreshing app
      render(
        reduxRouterWrappedComponent({
          Component: wrappedHistory,
          componentProps: initializedStateProps,
          history,
          store,
        })
      );

      expect(clearAppError).toHaveBeenCalled();
    });

    test('should not clear the app error message in any state after refresh', () => {
      const history = createMemoryHistory({
        initialEntries: [getRoutePath(someRoute)],
      });
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

      expect(clearAppError).toHaveBeenCalledTimes(1);
    });
  });
  describe('test attempted Route state behavior', () => {
    test('should save the location state when the app is initialized for the very first', () => {
      const history = createMemoryHistory({
        initialEntries: [getRoutePath(someRoute)],
      });
      const { rerender } = render(
        reduxRouterWrappedComponent({
          Component: wrappedHistory,
          componentProps: initializedStateProps,
          history,
          store,
        })
      );

      expect(initSession).toHaveBeenCalled();

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
    test('should redirect the user to attempted route when the user successfully authenticates ', () => {
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
          componentProps: authenticationSucceeded,
          history,
          store,
        })
      );

      expect(history.location.pathname).toBe(getRoutePath(someRoute));
      expect(history.location.state).toBe(undefined);
    });
    test('should preserve attempted route state when the user authentication attempts fails  ', () => {
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

    test('should redirect the user to the /pg route when the user successfully authenticates and the user has never previously intialized to a route', () => {
      const history = createMemoryHistory({
        initialEntries: [
          {
            pathname: getRoutePath('signin'),
          },
        ],
      });

      render(
        reduxRouterWrappedComponent({
          Component: wrappedHistory,
          componentProps: authenticationSucceeded,
          history,
          store,
        })
      );

      expect(history.location.pathname).toBe('/pg/dashboard');
      expect(history.location.state).toBe(undefined);
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
          pathname: '/pg',
        },
      ],
    });

    render(
      reduxRouterWrappedComponent({
        Component: wrappedHistory,
        componentProps: sessionExpired,
        history,
        store,
      })
    );

    expect(history.location.pathname).toBe('/pg/dashboard');
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
          pathname: '/pg',
        },
      ],
    });
    const { queryByLabelText } = render(
      reduxRouterWrappedComponent({
        Component: wrappedHistory,
        componentProps: loggedOut,
        history,
        store,
      })
    );

    expect(history.location.pathname).toBe(getRoutePath('signin'));
    expect(queryByLabelText('Email')).toBeTruthy();
    expect(queryByLabelText('Password')).toBeTruthy();
  });
});


/* global describe, test, expect, jest, beforeEach, afterEach */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import Endpoint from './Endpoint';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';
// import actions from '../../../actions';

async function initEndpoint(
  {
    resource = {
      licenseEntitlementUsage: {
        production: {},
        sandbox: {},
      },
    },
    expires = Date.now(),
  } = {}
) {
  const initialStore = reduxStore;

  initialStore.getState().user.preferences = {
    defaultAShareId: 'own',
    environment: 'production',
  };
  initialStore.getState().user.org = {
    accounts: [{
      _id: 'own',
      accessLevel: 'owner',
      ownerUser: {
        licenses: [{
          type: 'endpoint',
          tier: 'free',
          supportTier: 'preferred',
          sandbox: true,
          expires,
          trialEndDate: '2019-03-09T06:02:00.255Z',
          endpoint: {
            apiManagement: true,
            production: {
              numAddOnAgents: 0,
              numAddOnEndpoints: 55,
              numAddOnFlows: 100,
              numAddOnTradingPartners: 0,
              numAgents: 3,
              numEndpoints: 20,
              numFlows: 5000,
              numTradingPartners: 15,
            },
            sandbox: {
              numAddOnAgents: 0,
              numAddOnEndpoints: 0,
              numAddOnFlows: 0,
              numAddOnTradingPartners: 0,
              numAgents: 3,
              numEndpoints: 20,
              numFlows: 5000,
              numTradingPartners: 15,
            },
          },
        }],
      },
    }],
  };
  initialStore.getState().session.resource = resource;
  const ui = (
    <MemoryRouter>
      <Endpoint />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('Endpoint test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should pass the initial render with default value/spinner', async () => {
    await initEndpoint({
      resource: {},
    });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('should pass the initial render with expired date', async () => {
    const expires = new Date();

    expires.setMonth(expires.getMonth() - 2);
    await initEndpoint({
      expires,
    });
    expect(screen.queryByText(/Subscription/i)).toBeInTheDocument();
    expect(screen.queryByText(/Expired/i)).toBeInTheDocument();
    expect(screen.queryByText(/Production entitlements/i)).toBeInTheDocument();
  });

  test('should pass the initial render with about to expire', async () => {
    const expires = new Date();

    expires.setHours(expires.getHours() + 48);
    await initEndpoint({
      expires,
    });
    expect(screen.queryByText(/Subscription/i)).toBeInTheDocument();
    // expect(screen.queryByText(/Active/i)).toBeInTheDocument();
    expect(screen.queryByText(/Production entitlements/i)).toBeInTheDocument();
    // expect(screen.queryByText(/Oh, no! Your free trial expires in 2 days! This will disable all of your flows, then you can enable one flow to keep. Or better yet,/i)).toBeInTheDocument();
    // const upgradeButton = screen.getByRole('button', { name: /upgrade now/i});

    // expect(upgradeButton).toBeInTheDocument();

    // userEvent.click(upgradeButton);
    // expect(mockDispatchFn).toBeCalledWith(actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED'));
  });

  test('should pass the initial render with long way to expire', async () => {
    const expires = new Date();

    expires.setMonth(expires.getMonth() + 2);
    await initEndpoint({
      expires,
    });
    expect(screen.queryByText(/Subscription/i)).toBeInTheDocument();
    // expect(screen.queryByText(/Active/i)).toBeInTheDocument();
    expect(screen.queryByText(/Production entitlements/i)).toBeInTheDocument();
  });
});

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { cleanup, screen } from '@testing-library/react';
import Subscription from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';

async function initSubscription(
  {
    resource = {
      licenseEntitlementUsage: {
        production: {},
        sandbox: {},
      },
    },
    expires = (new Date()).toISOString(),
    renderFn,
    rest = {},
  } = {}
) {
  const initialStore = reduxStore;

  initialStore.getState().user.preferences = {
    defaultAShareId: 'own',
    environment: 'production',
    dateFormat: 'DD MMMM, YYYY',
  };
  initialStore.getState().user.org = {
    accounts: [{
      _id: 'own',
      accessLevel: 'owner',
      ownerUser: {
        licenses: [{
          type: 'integrator',
          tier: 'standard',
          sandbox: true,
          expires,
          trialEndDate: '2019-03-09T06:02:00.255Z',
          ...rest,
          integrator: {
            apiManagement: true,
            production: {
              numAddOnAgents: 0,
              numAddOnSubscriptions: 55,
              numAddOnFlows: 100,
              numAddOnTradingPartners: 0,
              numAgents: 3,
              numSubscriptions: 20,
              numFlows: 5000,
              numTradingPartners: 15,
            },
            sandbox: {
              numAddOnAgents: 0,
              numAddOnSubscriptions: 0,
              numAddOnFlows: 50,
              numAddOnTradingPartners: 0,
              numAgents: 3,
              numSubscriptions: 20,
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
      <Subscription />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore, renderFn });

  return {
    store,
    utils,
  };
}

describe('integrator test cases', () => {
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
    cleanup();
  });

  test('should pass the initial render with default value/spinner', async () => {
    await initSubscription({
      resource: {},
    });
    expect(screen.getAllByRole('progressbar')[0]).toBeInTheDocument();
  });

  test('should pass the initial render with expired date', async () => {
    const expires = new Date();

    expires.setMonth(expires.getMonth() - 2);
    await initSubscription({
      expires: expires.toISOString(),
    });
    expect(screen.queryByText('Subscription')).toBeInTheDocument();
    expect(screen.queryByText(/Expired/i)).toBeInTheDocument();
  });
});

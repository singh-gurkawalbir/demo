import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UpgradeDrawer from '.';
import { runServer } from '../../../../../test/api/server';
import { renderWithProviders } from '../../../../../test/test-utils';
import actions from '../../../../../actions';

async function initUpgradeDrawer() {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: 'myAccount/subscription/upgrade'}]}
    >
      <Route
        path="myAccount/subscription"
      >
        <UpgradeDrawer />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

describe('upgradeDrawer test cases', () => {
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

  test('should pass the initial render with default value', async () => {
    await initUpgradeDrawer();

    const yesButton = screen.getByRole('button', { name: /Yes, I'm interested/i});

    expect(screen.queryByText(/Upgrade your subscription/i)).toBeInTheDocument();
    expect(yesButton).toBeInTheDocument();
    await userEvent.click(yesButton);
    expect(mockDispatchFn).toHaveBeenCalledTimes(2);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.license.requestTrialLicense());
  });
});

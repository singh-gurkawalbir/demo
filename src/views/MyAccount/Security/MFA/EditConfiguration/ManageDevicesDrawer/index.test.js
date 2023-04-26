
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import ManageDevicesDrawer from '.';
import { getCreatedStore } from '../../../../../../store';
import { runServer } from '../../../../../../test/api/server';
import { mutateStore, renderWithProviders } from '../../../../../../test/test-utils';

let initialStore;

async function initManageDeviceDrawer({mfaValues} = {}) {
  mutateStore(initialStore, draft => {
    draft.data.mfa = mfaValues;
  });
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/myAccount/security/mfa/trustedDevices/manage'}]}
    >
      <Route
        path="/myAccount/security/mfa"
      >
        <ManageDevicesDrawer />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for Manage Device Drawer', () => {
  runServer();
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  test('should test the Manage device drawer with some devices', async () => {
    await initManageDeviceDrawer({
      mfaValues: {
        userSettings: {
          trustedDevices: [
            {
              _id: '1234',
              browser: 'Chrome',
              os: 'Mac OS',
            },
          ],
        },
        status: {
          userSettings: 'received',
        },
      },
    });
    expect(screen.getByRole('heading', {name: 'Manage devices'})).toBeInTheDocument();
    expect(screen.getByRole('columnheader', {name: /name/i})).toBeInTheDocument();
    expect(screen.getByRole('columnheader', {name: /actions/i})).toBeInTheDocument();
    expect(screen.getByRole('row', {name: /chrome mac os/i})).toBeInTheDocument();
  });
  test('should test the Manage device drawer with no devices', async () => {
    const { utils } = await initManageDeviceDrawer({
      mfaValues: {
        userSettings: {
          trustedDevices: [
          ],
        },
        status: {
          userSettings: 'received',
        },
      },
    });

    expect(utils.container).toBeEmptyDOMElement();
  });
});

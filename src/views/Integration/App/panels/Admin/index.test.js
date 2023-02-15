
import React from 'react';
import {screen} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import AdminPanel from '.';

async function initAdminPanel(props = {}) {
  const initialStore = getCreatedStore();

  initialStore.getState().user.preferences = {defaultAShareId: '1234567890'};
  initialStore.getState().user.org = {accounts: [{
    _id: '1234567890',
    accessLevel: props.access,
  },
  ],
  };

  const ui = (
    <MemoryRouter initialEntries={[{pathname: `/integrations/5ff579d745ceef7dcd797c15/${props.child}/admin/readme`}]}>
      <Route path={`/integrations/5ff579d745ceef7dcd797c15/${props.child}/admin`}>
        <AdminPanel {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Admin Panel UI tests', () => {
  test('should display all the 3 panels when user is of accessLevel "owner"', () => {
    initAdminPanel({integrationId: '60e6f83f3499084a689178cc', access: 'owner'});
    expect(screen.getByText('API tokens')).toBeInTheDocument();
    expect(screen.getByText('Subscription')).toBeInTheDocument();
    expect(screen.getByText('Uninstall')).toBeInTheDocument();
  });
  test('should not display the API tokens panel when childId is present', () => {
    initAdminPanel({integrationId: '60e6f83f3499084a689178cc', access: 'owner', childId: '60e6f83f3499084a689189bb'});
    expect(screen.getByText('Subscription')).toBeInTheDocument();
    expect(screen.getByText('Uninstall')).toBeInTheDocument();

    expect(screen.queryByText('API tokens')).toBeNull();
  });
  test('should not display the Uninstall panel when user has monitor level access', () => {
    initAdminPanel({integrationId: '60e6f83f3499084a689178cc', access: 'monitor'});
    expect(screen.queryByText('Uninstall')).toBeNull();
  });
});

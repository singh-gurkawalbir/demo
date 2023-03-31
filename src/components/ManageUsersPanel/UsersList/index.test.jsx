import React from 'react';
import { screen, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UsersList from '.';
import { runServer } from '../../../test/api/server';
import { mockGetRequestOnce, renderWithProviders } from '../../../test/test-utils';
import actions from '../../../actions';

describe('users List Test Cases', () => {
  runServer();
  afterEach(() => { cleanup; });
  test('cases for the UsersList', async () => {
    mockGetRequestOnce('/api/integrations/5ffad3d1f08d35214ed200f7', {_id: '5ffad3d1f08d35214ed200f7'});
    mockGetRequestOnce('/api/notifications', []);
    mockGetRequestOnce('/api/integrations/5ffad3d1f08d35214ed200f7/ashares', []);
    mockGetRequestOnce('/api/integrations/5ffad3d1f08d35214ed200f7/connections', []);
    const {store} = renderWithProviders(
      <MemoryRouter>
        <UsersList integrationId="5ffad3d1f08d35214ed200f7" />
      </MemoryRouter>
    );

    store.dispatch(actions.resource.requestCollection('connections'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.connections).toBeDefined());
    store.dispatch(actions.resource.requestCollection('integrations'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    store.dispatch(actions.resource.requestCollection('notifications'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.notifications).toBeDefined());
    const nameText = await screen.findByText('Name');

    expect(nameText).toBeInTheDocument();
    const emailText = screen.getByText('Email');

    expect(emailText).toBeInTheDocument();
    const accessLevelText = screen.getByText('Access level');

    expect(accessLevelText).toBeInTheDocument();
    const statusText = screen.getByText('Status');

    expect(statusText).toBeInTheDocument();
  });

  test('should return null when user delete request is set to requested', () => {
    const { utils, store } = renderWithProviders(
      <MemoryRouter>
        <UsersList integrationId="5ffad3d1f08d35214ed200f7" />
      </MemoryRouter>
    );

    store.dispatch(actions.user.org.users.delete('id_1'));

    expect(utils.container).toBeEmptyDOMElement();
  });
});

/* global describe, test, expect, jest */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { waitFor, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import {createMemoryHistory} from 'history';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { mockGetRequestOnce, renderWithProviders } from '../../test/test-utils';
import { runServer } from '../../test/api/server';
import actions from '../../actions';
import ManageUsersPanel from '.';

const props = {
  integrationId: '5rdqtswdywgd8wu8',
  childId: 'hsay7dy9hdoh',
};

describe('Test cases for Manage User Panel', () => {
  runServer();
  const history = createMemoryHistory();

  jest.mock('./UsersList', () => ({
    __esModule: true,
    ...jest.requireActual('./UsersList'),
    default: () => (
      <div>Hi</div>
    ),
  }));

  test('Test case for the Invite user button for a account owner', async () => {
    mockGetRequestOnce('/api/integrations/5rdqtswdywgd8wu8', {_id: '5rdqtswdywgd8wu8' });
    mockGetRequestOnce('/api/integrations/5rdqtswdywgd8wu8/connections', {_id: '5rdqtswdywgd8wu8' });

    const { store } = renderWithProviders(
      <Router history={history}>
        <ManageUsersPanel {...props} />
      </Router>
    );

    store.dispatch(actions.user.preferences.request());
    await waitFor(() => expect(store.getState().user.preferences.defaultAShareId).toBeDefined());
    history.push = jest.fn();
    const value1 = screen.getByText('Users');

    expect(value1).toBeInTheDocument();
    userEvent.click(screen.getByText('Invite user'));
    expect(history.push).toHaveBeenCalledTimes(1);
  });
  test('Test case for the Invite user button who is not a account owner', () => {
    mockGetRequestOnce('/api/integrations/5rdqtswdywgd8wu8', {_id: '5rdqtswdywgd8wu8' });
    mockGetRequestOnce('/api/integrations/5rdqtswdywgd8wu8/connections', {_id: '5rdqtswdywgd8wu8' });

    renderWithProviders(
      <Router history={history}>
        <ManageUsersPanel {...props} />
      </Router>
    );
    history.push = jest.fn();
    const value1 = screen.getByText('Users');

    expect(value1).toBeInTheDocument();
    expect(history.push).not.toBeCalled();
  });
  test('Test case for the Invite user button when there is no integration ID', () => {
    mockGetRequestOnce('/api/integrations/5rdqtswdywgd8wu8', {_id: '5rdqtswdywgd8wu8' });
    mockGetRequestOnce('/api/integrations/5rdqtswdywgd8wu8/connections', {_id: '5rdqtswdywgd8wu8' });

    renderWithProviders(
      <Router history={history}>
        <ManageUsersPanel {...props} integrationId="" />
      </Router>
    );
    history.push = jest.fn();
    const value1 = screen.getByText('Users');

    expect(value1).toBeInTheDocument();
    expect(history.push).not.toBeCalled();
  });
});

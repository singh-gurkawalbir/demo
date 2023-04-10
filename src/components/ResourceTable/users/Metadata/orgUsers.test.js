
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import CeligoTable from '../../../CeligoTable';
import metadata from './orgUsers';
import { getCreatedStore } from '../../../../store';
import customCloneDeep from '../../../../utils/customCloneDeep';

const integrationId = '62eca1efe386b563f638451e';
const user = {
  name: 'User name',
  email: 'mail@user.in',
};
const mockTableContext = {
  integrationId,
  isUserInErrMgtTwoDotZero: true,
};
const mockRouteMatch = {
  path: '/integrations/:integrationId([a-f\\d]{24}|none)/:tab',
  url: `/integrations/${integrationId}/users`,
  isExact: true,
  params: {
    integrationId,
    tab: 'users',
  },
};

jest.mock('../../../CeligoTable/TableContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../../CeligoTable/TableContext'),
  useGetTableContext: () => mockTableContext,
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: () => mockRouteMatch,
}));

function initOrgUsers(data = [], initialStore) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={data} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe('test suite for orgUsers', () => {
  test('should render the table accordingly', () => {
    const data = [{
      sharedWithUser: user,
      accessLevel: 'manage',
    }];

    initOrgUsers(data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Name',
      'Email',
      'Access level',
      'Status',
      'Notifications',
    ]);

    expect(screen.getByRole('rowheader', { name: 'User name'})).toBeInTheDocument();
    const rowsData = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(rowsData).toEqual([
      'mail@user.in',
      'Manage',
      'Pending',
      '',
    ]);
    const addNotificationsButton = screen.getByRole('link');

    //  should show the options to add notification if user is allowed to manage notifications, but there are not notifications
    expect(addNotificationsButton).toHaveAttribute('aria-label', 'Add notifications');
    expect(addNotificationsButton).toHaveAttribute('href', `${mockRouteMatch.url}/${user.email}/manageNotifications`);
  });

  test('should allow to edit notifications if user is allowed to manage notifications and has some notifications', () => {
    const data = [{
      sharedWithUser: user,
      accessLevel: 'manage',
    }];
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources = {
        notifications: [{
          subscribedByUser: user,
          type: 'connection',
          _connectionId: 'conn123',
          _id: 'notification123',
        }],
        connections: [{
          _id: 'conn123',
          name: 'The Connection',
        }],
        integrations: [{
          _id: integrationId,
          _registeredConnectionIds: ['conn123'],
        }],
      };
    });

    initOrgUsers(data, initialStore);
    const addNotificationsButton = screen.getByRole('link');

    expect(addNotificationsButton).toHaveAttribute('aria-label', 'Edit notifications');
    expect(addNotificationsButton).toHaveAttribute('href', `${mockRouteMatch.url}/${user.email}/manageNotifications`);
  });

  test('should allow only to view notifications if user is not allowed to manage notifications', () => {
    const cloneUser = customCloneDeep(user);

    cloneUser._id = 'userid123';
    const data = [{
      sharedWithUser: cloneUser,
      accessLevel: 'monitor',
      accepted: true,
    }];
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources = {
        notifications: [{
          subscribedByUser: cloneUser,
          type: 'connection',
          _connectionId: 'conn123',
          _id: 'notification123',
        }],
        connections: [{
          _id: 'conn123',
          name: 'The Connection',
        }],
        integrations: [{
          _id: integrationId,
          _registeredConnectionIds: ['conn123'],
        }],
      };
    });

    initOrgUsers(data, initialStore);
    const addNotificationsButton = screen.getByRole('link');

    expect(addNotificationsButton).toHaveAttribute('aria-label', 'View notifications');
    expect(addNotificationsButton).toHaveAttribute('href', `${mockRouteMatch.url}/${user.email}/notifications`);
  });

  test('should not show Notifications for users not in EM2.0', () => {
    delete mockTableContext.isUserInErrMgtTwoDotZero;
    initOrgUsers();
    expect(screen.queryByRole('columnheader', {name: 'Notifications'})).not.toBeInTheDocument();
  });

  test('should show the correct access level', () => {
    delete mockTableContext.integrationId;
    const data = [{
      sharedWithUser: user,
      accessLevel: 'monitor',
      integrationAccessLevel: ['int1', 'int2'],
    }];

    initOrgUsers(data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Name',
      'Email',
      'Access level',
      'Status',
    ]);

    expect(screen.getByRole('rowheader', { name: 'User name'})).toBeInTheDocument();
    const rowsData = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(rowsData).toEqual([
      'mail@user.in',
      'Tile',
      'Pending',
    ]);
  });
});

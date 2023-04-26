
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { mockPostRequestOnce, renderWithProviders, mockDeleteRequestOnce, mockPutRequestOnce } from '../../../../test/test-utils';
import CeligoTable from '../../../CeligoTable';
import { getCreatedStore } from '../../../../store';
import metadata from './orgOwnerUsers';
import actions from '../../../../actions';
import { runServer } from '../../../../test/api/server';
import { ConfirmDialogProvider } from '../../../ConfirmDialog';

let initialStore;
const integrationId = '62eca1efe386b563f638451e';
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
const mockHistoryPush = jest.fn();
const mockDispatchFn = jest.fn(action => initialStore.dispatch(action));

jest.mock('../../../CeligoTable/TableContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../../CeligoTable/TableContext'),
  useGetTableContext: () => mockTableContext,
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: () => mockRouteMatch,
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

function initOrgOwnerUsers(data = []) {
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <CeligoTable {...metadata} data={data} />
      </ConfirmDialogProvider>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test suite for orgOwnerUsers', () => {
  runServer();

  beforeEach(() => {
    initialStore = getCreatedStore();
  });

  afterEach(() => {
    mockDispatchFn.mockClear();
    mockHistoryPush.mockClear();
  });

  test('should render the table accordingly', () => {
    const data = [{
      sharedWithUser: {
        name: 'User name',
        email: 'mail@user.in',
      },
      accessLevel: 'monitor',
      accepted: true,
      disabled: false,
    }];

    initOrgOwnerUsers(data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Name',
      'Email',
      'Access level',
      'Status',
      'Enable user',
      'Notifications',
      'Actions',
    ]);
    const rowsData = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(rowsData).toEqual([
      'User name',
      'mail@user.in',
      'Monitor',
      'Accepted',
      '',
      '',
      '',
    ]);
    const addNotificationsButton = screen.getByRole('link');
    const disableUserButton = screen.getByRole('checkbox');

    expect(disableUserButton).toBeChecked();

    //  should show the options to add notification if user is allowed to manage notifications, but there are not notifications
    expect(addNotificationsButton).toHaveAttribute('title', 'Add notifications');
    const actionButton = screen.getByRole('button', {name: /more/i});

    userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Manage permissions',
    ]);
  });

  test('should be able to modify permissions of a user', () => {
    const data = [{
      _id: 'sharedUser123',
      sharedWithUser: {
        name: 'User name',
        email: 'mail@user.in',
      },
      accessLevel: 'monitor',
      accepted: true,
      disabled: false,
    }];

    initOrgOwnerUsers(data);
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    const managePermissionsButton = screen.getByRole('menuitem', {name: 'Manage permissions'});

    userEvent.click(managePermissionsButton);
    expect(mockHistoryPush).toHaveBeenCalledWith(`${mockRouteMatch.url}/edit/sharedUser123`);
  });

  test('should be able to reset MFA if has permissions', async () => {
    const mockResolverFunction = jest.fn();

    mockPostRequestOnce('/api/ashares/sharedUser123/mfa/reset', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });

    delete mockTableContext.integrationId;
    const data = [{
      _id: 'sharedUser123',
      sharedWithUser: {
        name: 'User 1',
        email: 'mail@user.in',
        allowedToResetMFA: true,
      },
      accessLevel: 'monitor',
      accepted: true,
      disabled: false,
    }];

    initOrgOwnerUsers(data);
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Manage permissions',
      'Reset MFA',
      'Remove user from account',
    ]);
    const resetMfaButton = screen.getByRole('menuitem', {name: 'Reset MFA'});

    userEvent.click(resetMfaButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mfa.resetMFA({ aShareId: 'sharedUser123' }));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.asyncTask.clear('MFA_RESET_ASYNC_KEY')));
    expect(mockResolverFunction).toHaveBeenCalledTimes(1);

    const snackBar = screen.getByRole('alert');

    expect(snackBar).toHaveTextContent('MFA reset for User 1');
  });
  test('should be able to reset owner MFA if user is an admin', async () => {
    const mockResolverFunction = jest.fn();

    mockPostRequestOnce('/api/owner/mfa/reset', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });

    delete mockTableContext.integrationId;
    mockTableContext.isAccountOwnerMFAEnabled = true;
    mockTableContext.accessLevel = 'administrator';
    const data = [{
      _id: 'own',
      sharedWithUser: {
        name: 'User 1',
        email: 'mail@user.in',
        _id: '123',
      },
      accessLevel: 'owner',
      accepted: true,
      disabled: false,
    }];

    initOrgOwnerUsers(data);
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual(['Reset MFA']);
    const resetMfaButton = screen.getByRole('menuitem', {name: 'Reset MFA'});

    userEvent.click(resetMfaButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mfa.resetOwnerMFA());
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.asyncTask.clear('MFA_OWNER_RESET_ASYNC_KEY')));
    expect(mockResolverFunction).toHaveBeenCalledTimes(1);

    const snackBar = screen.getByRole('alert');

    expect(snackBar).toHaveTextContent('MFA reset for User 1');
  });

  test('should be able to remove a user from the account', async () => {
    const mockResolverFunction = jest.fn();

    mockDeleteRequestOnce('/api/ashares/sharedUser123', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });

    const data = [{
      _id: 'sharedUser123',
      sharedWithUser: {
        name: 'User 1',
        email: 'mail@user.in',
        allowedToResetMFA: true,
      },
      accessLevel: 'monitor',
      accepted: true,
      disabled: false,
    }];

    initOrgOwnerUsers(data);
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    const deleteUserButton = screen.getByRole('menuitem', {name: 'Remove user from account'});

    userEvent.click(deleteUserButton);

    const confirmDialog = screen.getByRole('dialog');
    const confirmButton = screen.getByRole('button', {name: 'Delete'});

    expect(confirmDialog).toContainElement(confirmButton);
    expect(confirmDialog.textContent).toContain('Confirm delete');
    userEvent.click(confirmButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.user.org.users.delete('sharedUser123', false));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('should show the error if unable to remove the user from the account', async () => {
    const mockResolverFunction = jest.fn();
    const errorMessage = 'Server Error !!!';

    mockDeleteRequestOnce('/api/ashares/sharedUser123', (req, res, ctx) => {
      mockResolverFunction();

      return res.once(ctx.status(404), ctx.json({message: errorMessage}));
    });

    const data = [{
      _id: 'sharedUser123',
      sharedWithUser: {
        email: 'mail@user.in',
        allowedToResetMFA: true,
      },
      accessLevel: 'monitor',
      accepted: true,
      disabled: false,
    }];

    initOrgOwnerUsers(data);
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    const deleteUserButton = screen.getByRole('menuitem', {name: 'Remove user from account'});

    userEvent.click(deleteUserButton);
    const confirmButton = screen.getByRole('button', {name: 'Delete'});

    userEvent.click(confirmButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.user.org.users.delete('sharedUser123', false));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(errorMessage));
  });

  test('should be able to transfer ownership to anyone by degrading to manager oneself', async () => {
    const mockResolverFunction = jest.fn();

    mockPostRequestOnce('/api/transfers/invite', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });

    const data = [{
      _id: 'sharedUser123',
      sharedWithUser: {
        name: 'User 1',
        email: 'mail@user.in',
        allowedToResetMFA: true,
      },
      accessLevel: 'monitor',
      accepted: true,
      disabled: false,
    }];

    mockTableContext.accessLevel = 'owner';
    initOrgOwnerUsers(data);
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    const makeOwnerButton = screen.getByRole('menuitem', {name: 'Make account owner'});

    userEvent.click(makeOwnerButton);
    const confirmDialog = screen.getByRole('dialog');
    const confirmButton = screen.getByRole('button', {name: 'Make owner'});

    expect(confirmDialog).toContainElement(confirmButton);
    userEvent.click(confirmButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.user.org.users.makeOwner('mail@user.in'));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(
      'An Account Ownership invitation has been sent to User 1 (mail@user.in). Once accepted, your account will be converted to a regular user account with Manager access.'
    ));
  });

  test('should show the error message if ownership transfer fails', async () => {
    const mockResolverFunction = jest.fn();
    const errorMessage = 'Server Error !!!';

    mockPostRequestOnce('/api/transfers/invite', (req, res, ctx) => {
      mockResolverFunction();

      return res.once(ctx.status(404), ctx.json({message: errorMessage}));
    });

    const data = [{
      _id: 'sharedUser123',
      sharedWithUser: {
        name: 'User 1',
        email: 'mail@user.in',
        allowedToResetMFA: true,
      },
      accessLevel: 'monitor',
      accepted: true,
      disabled: false,
    }];

    mockTableContext.accessLevel = 'owner';
    initOrgOwnerUsers(data);
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    const makeOwnerButton = screen.getByRole('menuitem', {name: 'Make account owner'});

    userEvent.click(makeOwnerButton);
    const confirmDialog = screen.getByRole('dialog');
    const confirmButton = screen.getByRole('button', {name: 'Make owner'});

    expect(confirmDialog).toContainElement(confirmButton);
    userEvent.click(confirmButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.user.org.users.makeOwner('mail@user.in'));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(
      `Request to make user User 1 as account owner is failed due to the error "${errorMessage}"`
    ));
  });

  test('should be able to enable / disable a user', async () => {
    const mockResolverFunction = jest.fn();

    mockPutRequestOnce('/api/ashares/user123/disable', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });

    const data = [{
      sharedWithUser: {
        name: 'sampleName',
        email: 'mail@user.in',
      },
      _id: 'user123',
      accessLevel: 'monitor',
      accepted: true,
      disabled: false,
    }];

    initOrgOwnerUsers(data);
    const disableUserButton = document.querySelector('[data-test="disableUser"]');

    userEvent.click(disableUserButton);
    const confirmDialog = screen.getByRole('dialog');
    const confirmButton = screen.getByRole('button', {name: 'Disable'});

    expect(confirmDialog).toContainElement(confirmButton);
    expect(confirmDialog.textContent).toContain('Confirm disable');
    userEvent.click(confirmButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.user.org.users.disable('user123', false, false));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('User sampleName disabled successfully'));
  });

  test('should show the error if unable to enable / disable a user', async () => {
    const mockResolverFunction = jest.fn();
    const errorMessage = 'Server Error !!!';

    mockPutRequestOnce('/api/ashares/user123/disable', (req, res, ctx) => {
      mockResolverFunction();

      return res.once(ctx.status(404), ctx.json({message: errorMessage}));
    });

    const data = [{
      sharedWithUser: {
        name: 'sampleName',
        email: 'mail@user.in',
      },
      _id: 'user123',
      accessLevel: 'monitor',
      accepted: true,
      disabled: false,
    }];

    initOrgOwnerUsers(data);
    const disableUserButton = document.querySelector('[data-test="disableUser"]');

    userEvent.click(disableUserButton);
    const confirmDialog = screen.getByRole('dialog');
    const confirmButton = screen.getByRole('button', {name: 'Disable'});

    expect(confirmDialog).toContainElement(confirmButton);
    expect(confirmDialog.textContent).toContain('Confirm disable');
    userEvent.click(confirmButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.user.org.users.disable('user123', false, false));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(`Disabling user sampleName failed due to the error "${errorMessage}"`));
  });

  test('should not be able to enable / disable oneself', () => {
    const data = [{
      sharedWithUser: {
        name: 'sampleName',
        email: 'mail@user.in',
      },
      _id: 'own',
      accessLevel: 'monitor',
      accepted: true,
      disabled: false,
    }];

    initOrgOwnerUsers(data);
    const disableUserButton = document.querySelector('[data-test="disableUser"]');

    expect(disableUserButton).toBeDisabled();
  });

  test('should be able to reinvite a user if invitation was rejected earlier', async () => {
    const data = [{
      sharedWithUser: {
        name: 'sampleName',
        email: 'mail@user.in',
      },
      _id: 'user123',
      accessLevel: 'monitor',
      dismissed: true,
    }];

    initOrgOwnerUsers(data);
    const reinviteButton = screen.getByRole('button', {name: 'Reinvite'});

    userEvent.click(reinviteButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.user.org.users.reinvite('user123'));
  });

  test('should be able to enable / disable MFA requirements for invited users', async () => {
    const mockResolverFunction = jest.fn();

    mockPutRequestOnce('/api/ashares/user123', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });

    const data = [{
      sharedWithUser: {
        name: 'sampleName',
        email: 'mail@user.in',
      },
      _id: 'user123',
      accessLevel: 'owner',
      accepted: true,
    }];

    initOrgOwnerUsers(data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Name',
      'Email',
      'Access level',
      'Status',
      'Enable user',
      'Require MFA?',
      'Actions',
    ]);

    const rowDatas = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(rowDatas).toEqual([
      'sampleName',
      'mail@user.in',
      'Owner',
      '', // should not show user status for account owner
      '',
      '',
      '',
    ]);

    const enableMFA = document.querySelector('[data-test="mfaRequired"]');

    expect(enableMFA).toBeEnabled();
    expect(enableMFA).not.toBeChecked();
    userEvent.click(enableMFA);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.user.org.users.update('user123', {
      accountMFARequired: true,
      _id: 'user123',
      ...data[0],
    }));
    expect(enableMFA).toBeDisabled();
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('MFA is now required for sampleName'));
    expect(enableMFA).toBeEnabled();
  });

  test('should not show the option to modify MFA settings for oneself', async () => {
    const data = [{
      sharedWithUser: {
        name: 'sampleName',
        email: 'mail@user.in',
      },
      _id: 'own',
      accessLevel: 'owner',
      accepted: true,
    }];

    initOrgOwnerUsers(data);
    expect(document.querySelector('[data-test="mfaRequired"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-test="ssoRequired"]')).not.toBeInTheDocument();
  });

  test('should not be able to modify MFA settings if SSO enabled', async () => {
    const data = [{
      sharedWithUser: {
        name: 'sampleName',
        email: 'mail@user.in',
      },
      _id: 'user123',
      accountSSORequired: true,
      accessLevel: 'owner',
      accepted: true,
    }];

    initOrgOwnerUsers(data);
    const disableMfaButton = document.querySelector('[data-test="ssoRequired"]');

    userEvent.hover(disableMfaButton.parentElement);
    await waitFor(() => expect(screen.getByRole('tooltip', { name: 'You can’t require both MFA and SSO for a user.'})).toBeInTheDocument());
  });

  test('should show SSO status if SSO service is enabled for account', () => {
    mockTableContext.isSSOEnabled = true;
    const data = [{
      sharedWithUser: {
        name: 'sampleName',
        email: 'mail@user.in',
        accountSSOLinked: 'this_account',
      },
      _id: 'user123',
      accountSSORequired: true,
      accessLevel: 'administrator',
      accepted: true,
    }];

    initOrgOwnerUsers(data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Name',
      'Email',
      'Access level',
      'Status',
      'Enable user',
      'Account SSO linked?',
      'Require account SSO?',
      'Require MFA?',
      'Actions',
    ]);
    const rowsData = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(rowsData).toEqual([
      'sampleName',
      'mail@user.in',
      'Administrator',
      'Accepted',
      '',
      'Yes',
      '',
      '',
      '',
    ]);
  });

  test('should be able to toggle SSO', async () => {
    const mockResolverFunction = jest.fn();

    mockPutRequestOnce('/api/ashares/user123', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });

    const data = [{
      sharedWithUser: {
        name: 'sampleName',
        email: 'mail@user.in',
        accountSSOLinked: 'not_linked',
      },
      _id: 'user123',
      accountSSORequired: false,
      accessLevel: 'administrator',
      accepted: true,
    }];

    initOrgOwnerUsers(data);
    const rowsData = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(rowsData).toEqual([
      'sampleName',
      'mail@user.in',
      'Administrator',
      'Accepted',
      '',
      'No',
      '',
      '',
      '',
    ]);
    const requireSsoButton = document.querySelector('[data-test="ssoRequired"]');

    expect(requireSsoButton).toBeEnabled();
    expect(requireSsoButton).not.toBeChecked();
    userEvent.click(requireSsoButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.user.org.users.update('user123', {
      ...data[0],
      accountSSORequired: true,
    }));
    expect(requireSsoButton).toBeDisabled();
    await waitFor(() => expect(requireSsoButton).toBeEnabled());
    expect(screen.getByRole('alert')).toHaveTextContent('User sampleName requires SSO to sign in');
  });

  test('should not be able to toggle SSO if MFA enabled', async () => {
    const data = [{
      sharedWithUser: {
        name: 'sampleName',
        email: 'mail@user.in',
      },
      _id: 'user123',
      accessLevel: 'administrator',
      accepted: true,
      accountMFARequired: true,
    }];

    initOrgOwnerUsers(data);
    const requireSsoButton = document.querySelector('[data-test="ssoRequired"]');

    expect(requireSsoButton).toBeDisabled();
    userEvent.hover(requireSsoButton.parentElement);
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('You can’t require both MFA and SSO for a user.'));
  });

  test('should not show toggler for SSO for own account', async () => {
    const data = [{
      sharedWithUser: {
        name: 'sampleName',
        email: 'mail@user.in',
      },
      _id: 'own',
      accessLevel: 'administrator',
      accepted: true,
      accountMFARequired: true,
    }];

    initOrgOwnerUsers(data);
    expect(document.querySelector('[data-test="ssoRequired"]')).not.toBeInTheDocument();
  });
});

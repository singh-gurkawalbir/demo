
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import DynaNetsuiteUserRoles from './DynaNetsuiteUserRoles';
import { getCreatedStore } from '../../../store';

const onFieldChange = jest.fn();

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

describe('tests for netsuiteUserRoles in netsuite connection', () => {
  afterEach(() => {
    onFieldChange.mockClear();
  });

  test('should show the fields only once connection is validated', () => {
    renderWithProviders(<DynaNetsuiteUserRoles />);
    expect(document.querySelector('body > div')).toBeEmptyDOMElement();
  });

  test('should auto-set itself to environment if value already exists', async () => {
    const props = {
      resourceId: 'connection123',
      resourceType: 'connections',
      type: 'netsuiteuserroles',
      label: 'Environment',
      fieldId: 'netsuite.environment',
      netsuiteResourceType: 'environment',
      id: 'netsuite.environment',
      name: '/netsuite/environment',
      formKey: 'connections-frm123',
      value: 'production',
      onFieldChange,
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.netsuiteUserRole = {
        connection123: {
          hideNotificationMessage: true,
          userRoles: {
            production: {
              success: true,
              accounts: [],
            },
            beta: {
              success: true,
              accounts: [],
            },
            sandbox: {
              success: true,
              accounts: [],
            },
          },
          status: 'success',
        },
      };
    });

    renderWithProviders(<DynaNetsuiteUserRoles {...props} />, {initialStore});
    const label = document.querySelector('label');
    const selectedEnvironment = document.querySelector('[id="netsuite.environment"]');

    expect(label).toHaveTextContent(props.label);
    expect(selectedEnvironment).toHaveValue('production');

    await userEvent.click(screen.getByRole('button', {name: 'production'}));
    const availableEnvironments = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(availableEnvironments).toEqual([
      'Please select',
      'beta',
      'production',
      'sandbox',
    ]);

    await userEvent.click(screen.getByRole('menuitem', {name: 'beta'}));
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'beta');

    //  should reset account and role fields if environment is changed
    expect(onFieldChange).toHaveBeenCalledWith('netsuite.account', '', true);
    expect(onFieldChange).toHaveBeenCalledWith('netsuite.roleId', '', true);
  });

  test('should set itself to other environment if the only other one is beta', async () => {
    const props = {
      resourceId: 'connection123',
      resourceType: 'connections',
      type: 'netsuiteuserroles',
      label: 'Environment',
      fieldId: 'netsuite.environment',
      netsuiteResourceType: 'environment',
      id: 'netsuite.environment',
      name: '/netsuite/environment',
      formKey: 'connections-frm123',
      onFieldChange,
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.netsuiteUserRole = {
        connection123: {
          hideNotificationMessage: true,
          userRoles: {
            beta: {
              success: true,
              accounts: [],
            },
            sandbox: {
              success: true,
              accounts: [],
            },
          },
          status: 'success',
        },
      };
    });

    renderWithProviders(<DynaNetsuiteUserRoles {...props} />, {initialStore});

    await userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    const availableEnvironments = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(availableEnvironments).toEqual([
      'Please select',
      'beta',
      'sandbox',
    ]);
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'sandbox', true);
  });

  test('should default to the only option when selecting environment', async () => {
    const props = {
      resourceId: 'connection123',
      resourceType: 'connections',
      type: 'netsuiteuserroles',
      label: 'Environment',
      fieldId: 'netsuite.environment',
      netsuiteResourceType: 'environment',
      id: 'netsuite.environment',
      name: '/netsuite/environment',
      formKey: 'connections-frm123',
      onFieldChange,
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.netsuiteUserRole = {
        connection123: {
          hideNotificationMessage: true,
          userRoles: {
            production: {
              success: true,
              accounts: [],
            },
          },
          status: 'success',
        },
      };
    });

    renderWithProviders(<DynaNetsuiteUserRoles {...props} />, {initialStore});

    await userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    const availableEnvironments = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(availableEnvironments).toEqual([
      'Please select',
      'production',
    ]);
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'production', true);
  });

  test('should default to the only option when selecting account', async () => {
    const props = {
      resourceId: 'connection123',
      resourceType: 'connections',
      type: 'netsuiteuserroles',
      label: 'Account ID',
      fieldId: 'netsuite.account',
      netsuiteResourceType: 'account',
      id: 'netsuite.account',
      name: '/netsuite/account',
      helpKey: 'connection.netsuite.account',
      formKey: 'connections-frm123',
      options: {
        env: 'production',
      },
      onFieldChange,
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.netsuiteUserRole = {
        connection123: {
          hideNotificationMessage: true,
          userRoles: {
            production: {
              success: true,
              accounts: [
                {
                  account: {
                    internalId: 'TSTDRV12345',
                    name: 'Celigo Epicenter',
                    type: 'PRODUCTION',
                  },
                },
              ],
            },
          },
          status: 'success',
        },
      };
    });

    renderWithProviders(<DynaNetsuiteUserRoles {...props} />, {initialStore});

    await userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    const availableAccounts = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(availableAccounts).toEqual([
      'Please select',
      'Celigo Epicenter',
    ]);
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'TSTDRV12345', true);
  });

  test('should default to the only option when selecting role', async () => {
    const props = {
      resourceId: 'connection123',
      resourceType: 'connections',
      type: 'netsuiteuserroles',
      label: 'Role',
      fieldId: 'netsuite.roleId',
      netsuiteResourceType: 'role',
      onFieldChange,
      id: 'netsuite.roleId',
      name: '/netsuite/roleId',
      formKey: 'connections-frm123',
      options: {
        env: 'production',
        acc: 'TSTDRV12345',
      },
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.netsuiteUserRole = {
        connection123: {
          hideNotificationMessage: true,
          userRoles: {
            production: {
              success: true,
              accounts: [
                {
                  account: {
                    internalId: 'TSTDRV12345',
                    name: 'Celigo Epicenter',
                    type: 'PRODUCTION',
                  },
                  role: {
                    internalId: 1074,
                    name: 'Administrator',
                  },
                },
              ],
            },
          },
          status: 'success',
        },
      };
    });

    renderWithProviders(<DynaNetsuiteUserRoles {...props} />, {initialStore});

    await userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    const availableAccounts = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(availableAccounts).toEqual([
      'Please select',
      'Administrator',
    ]);
    expect(onFieldChange).toHaveBeenCalledWith(props.id, '1074', true);
  });
});

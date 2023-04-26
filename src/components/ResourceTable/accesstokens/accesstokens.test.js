
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import CeligoTable from '../../CeligoTable';
import { ConfirmDialogProvider } from '../../ConfirmDialog';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';
import metadata from './metadata';

jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  TimeAgo: ({date}) => (<span>{date}</span>),
}));

jest.mock('../../CeligoTable/TableContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTable/TableContext'),
  useGetTableContext: () => ({
    resourceType: 'accesstokens',
  }),
}));

function initAccessTokens(data = {}, initialStore, renderFun) {
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <CeligoTable {...metadata} data={data} />
      </ConfirmDialogProvider>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore, renderFun});
}

describe('access Tokens test suite', () => {
  const globalStore = getCreatedStore();
  let useDispatchSpy;
  let mockDispatchFn;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'ACCESSTOKEN_DISPLAY': {
          mutateStore(globalStore, draft => {
            draft.session.apiAccessTokens = [{
              _id: 'token123',
              token: 'TOKEN_VALUE',
            }];
          });
          break;
        }
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should render the table accordingly', async () => {
    const lastModified = moment().format('DD/MM/YYYY');
    const data = [{
      _id: 'token123',
      name: 'The API token',
      revoked: false,
      fullAccess: true,
      lastModified,
      permissions: {
        displayToken: true,
        generateToken: true,
        revoke: true,
        activate: false,
        edit: true,
        delete: false,
        permissionReasons: {
          delete: 'To delete this api token you need to revoke it first.',
        },
      },
    }];

    initAccessTokens(data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Name',
      'Status',
      'Scope',
      'Auto purge',
      'Last updated',
      'Token',
      'Actions',
    ]);

    //  first for table headings and the second as data row
    expect(screen.getAllByRole('row')).toHaveLength(2);

    expect(screen.getByRole('rowheader', { name: data[0].name })).toBeInTheDocument();
    const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(cells).toEqual([
      'Active',
      'Full Access',
      'Never',
      lastModified,
      'Show token',
      '',
    ]);
    expect(screen.getByRole('link', {name: data[0].name})).toBeInTheDocument();

    const actionButton = screen.getByRole('button', {name: /more/i});

    await userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Edit API token',
      'View audit log',
      'Revoke API token',
      'Generate new token',
      'Delete API token',
    ]);

    const deleteButton = Array.from(document.querySelectorAll('[role="menuitem"]')).filter(ele => ele.textContent === 'Delete API token')[0];

    expect(deleteButton).toHaveAttribute('aria-disabled', 'true');

    deleteButton.style.pointerEvents = 'initial';
    userEvent.hover(deleteButton);

    await waitFor(() => expect(screen.getByRole('tooltip', { name: 'To delete this API token you need to revoke it first.'})).toBeInTheDocument());
  });

  test('should show the reason if not able to show API token', () => {
    const data = [{
      _id: 'token123',
      name: 'The API token',
      revoked: false,
      fullAccess: true,
      lastModified: moment().format('DD/MM/YYYY'),
      permissions: {
        displayToken: false,
        generateToken: true,
        revoke: true,
        activate: false,
        edit: true,
        delete: false,
        permissionReasons: {
          delete: 'To delete this api token you need to revoke it first.',
        },
      },
      permissionReasons: {
        displayToken: 'You are not authorized to view this token.',
      },
    }];

    initAccessTokens(data);
    const apiToken = screen.getAllByRole('cell').filter(ele => ele.getAttribute('data-private'))[0];

    expect(apiToken).toHaveTextContent('You are not authorized to view this token.');
  });

  test('should show Purged instead of the API token if purged', () => {
    const data = [{
      _id: 'token123',
      name: 'The API token',
      revoked: false,
      fullAccess: true,
      autoPurgeAt: new Date(new Date() + 10000).toDateString(),
      lastModified: moment().format('DD/MM/YYYY'),
      permissions: {
        displayToken: true,
        generateToken: true,
        revoke: true,
        activate: false,
        edit: true,
        delete: false,
        permissionReasons: {
          delete: 'To delete this api token you need to revoke it first.',
        },
      },
    }];

    initAccessTokens(data);
    const apiToken = screen.getAllByRole('cell').filter(ele => ele.getAttribute('data-private'))[0];

    expect(apiToken).toHaveTextContent('Purged');
  });

  test('should be able to show the API token', async () => {
    const data = [{
      _id: 'token123',
      name: 'The API token',
      revoked: false,
      fullAccess: true,
      lastModified: moment().format('DD/MM/YYYY'),
      permissions: {
        displayToken: true,
        generateToken: true,
        revoke: true,
        activate: false,
        edit: true,
        delete: false,
        permissionReasons: {
          delete: 'To delete this api token you need to revoke it first.',
        },
      },
    }];

    const {utils, store} = initAccessTokens(data, globalStore);
    const showToken = screen.getByRole('button', {name: 'Show token'});

    await userEvent.click(showToken);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.accessToken.displayToken('token123'));
    initAccessTokens(data, store, utils.rerender);
    const apiToken = screen.getAllByRole('cell').filter(ele => ele.getAttribute('data-private'))[0];

    expect(apiToken).toHaveTextContent('TOKEN_VALUE');
  });

  test('should be able to reactivate a revoked token', async () => {
    const lastModified = moment().format('DD/MM/YYYY');
    const data = [{
      _id: 'token123',
      name: 'The API token',
      _connectorId: 'conn123',
      revoked: true,
      fullAccess: true,
      lastModified,
      permissions: {
        displayToken: true,
        generateToken: true,
        revoke: true,
        activate: false,
        edit: true,
        delete: true,
      },
    }];

    initAccessTokens(data);
    const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(cells).toEqual([
      'Revoked',
      'Full Access',
      'Never',
      lastModified,
      'Show token',
      '',
    ]);

    expect(screen.getByRole('link', {name: data[0].name})).toBeInTheDocument();

    const actionButton = screen.getByRole('button', {name: /more/i});

    await userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    //  Should not show delete option if connector id is not present
    expect(actionItems).toEqual([
      'Edit API token',
      'View audit log',
      'Reactivate token',
      'Generate new token',
    ]);
    const reactivateButton = screen.getByRole('menuitem', {name: 'Reactivate token'});

    await userEvent.click(reactivateButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchAndCommitStaged(
      'accesstokens',
      'token123',
      [{
        op: 'replace',
        path: '/revoked',
        value: false,
      }]
    ));
  });

  test('should be able to regenerate a token', async () => {
    const data = [{
      _id: 'token123',
      name: 'The API token',
      revoked: false,
      fullAccess: true,
      lastModified: moment().format('DD/MM/YYYY'),
      permissions: {
        displayToken: true,
        generateToken: true,
        revoke: true,
        activate: false,
        edit: true,
        delete: false,
        permissionReasons: {
          delete: 'To delete this api token you need to revoke it first.',
        },
      },
    }];

    initAccessTokens(data);
    const actionButton = screen.getByRole('button', {name: /more/i});

    await userEvent.click(actionButton);
    const regenerateButton = screen.getByRole('menuitem', {name: 'Generate new token'});

    await userEvent.click(regenerateButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.accessToken.generateToken(
      'token123'
    ));
  });

  test('should be able to revoke an active token', async () => {
    const data = [{
      _id: 'token123',
      name: 'The API token',
      revoked: false,
      fullAccess: true,
      lastModified: moment().format('DD/MM/YYYY'),
      permissions: {
        displayToken: true,
        generateToken: true,
        revoke: true,
        activate: false,
        edit: true,
        delete: false,
        permissionReasons: {
          delete: 'To delete this api token you need to revoke it first.',
        },
      },
    }];

    initAccessTokens(data);
    const actionButton = screen.getByRole('button', {name: /more/i});

    await userEvent.click(actionButton);
    const revokeButton = screen.getByRole('menuitem', {name: 'Revoke API token'});

    await userEvent.click(revokeButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchAndCommitStaged(
      'accesstokens',
      'token123',
      [{
        op: 'replace',
        path: '/revoked',
        value: true,
      }]
    ));
  });

  test('should show the time left to automatically purge', () => {
    const data = [{
      _id: 'token123',
      name: 'The API token',
      revoked: false,
      fullAccess: true,
      lastModified: moment().format('DD/MM/YYYY'),
      autoPurgeAt: '5 hours',
      permissions: {
        displayToken: true,
        generateToken: true,
        revoke: true,
        activate: false,
        edit: true,
        delete: false,
        permissionReasons: {
          delete: 'To delete this api token you need to revoke it first.',
        },
      },
    }];

    initAccessTokens(data);
    expect(screen.getAllByRole('cell')[2]).toHaveTextContent('5 hours');
  });

  test('should be able to extract the value of scope', () => {
    const columns = metadata.useColumns();
    const scope = columns.find(col => col.key === 'scope');
    const scopeValue1 = scope.Value({
      rowData: {
        fullAccess: true,
      },
    });

    expect(scopeValue1).toBe('Full Access');
    const scopeValue2 = scope.Value({
      rowData: {
        _connectorId: 'conn123',
        autoPurgeAt: '4 hours',
      },
    });

    expect(scopeValue2).toBe('Full Access');
    const scopeValue3 = scope.Value({
      rowData: {
        fullAccess: false,
      },
    });

    expect(scopeValue3).toBe('Custom');
    const scopeValue4 = scope.Value({
      rowData: {
        _connectorId: 'conn123',
      },
    });

    expect(scopeValue4).toBe('Custom');
  });
});

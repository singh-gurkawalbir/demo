import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { ConfirmDialogProvider } from '../../../components/ConfirmDialog';
import useHandleDelete from './useHandleDelete';
import messageStore, { message } from '../../../utils/messageStore';
import actions from '../../../actions';
import { getCreatedStore } from '../../../store';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

async function initUseHandleDelete(props = {}, initialStore) {
  const DummyComponent = () => {
    const cb = useHandleDelete(props._integrationId, props.ops);

    return (
      <>
        <div>
          <button type="button" onClick={cb}>
            Remove
          </button>
        </div>
      </>
    );
  };
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <DummyComponent />
      </ConfirmDialogProvider>
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe('test suite for useHandleDelete hook', () => {
  let useDispatchSpy;
  let mockDispatchFn;

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
    mockHistoryPush.mockClear();
  });

  test('should opt for delete when connector id not given', async () => {
    const _integrationId = '123integration';

    await initUseHandleDelete({_integrationId});
    const deleteButton = screen.getByRole('button', {name: 'Remove'});

    await userEvent.click(deleteButton);
    let confirmDialog = screen.getByRole('dialog');
    const { getByRole, getByText } = within(confirmDialog);

    expect(getByText('Confirm delete')).toBeInTheDocument();
    expect(getByText('Are you sure you want to delete this integration?')).toBeInTheDocument();
    const cancelButton = getByRole('button', {name: 'Cancel'});

    //  Should close the dialog and do nothing on Cancelling
    await userEvent.click(cancelButton);
    expect(confirmDialog).not.toBeInTheDocument();

    //  Should initiate delete process on confirming
    await userEvent.click(deleteButton);
    confirmDialog = screen.getByRole('dialog');
    const confirmButton = within(confirmDialog).getByRole('button', {name: 'Delete'});

    await userEvent.click(confirmButton);
    expect(confirmDialog).not.toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.integrations.delete(_integrationId));
    expect(screen.queryByText(messageStore('INTEGRATION.INTEGRATION_DELETE_VALIDATE'))).not.toBeInTheDocument();
    expect(screen.queryByText(messageStore('INTEGRATION.INTEGRATION_WITH_CONNECTORS_DELETE_VALIDATE'))).not.toBeInTheDocument();
  });

  describe('should show info snackbar if error deleting', () => {
    test('when integration contains connector as dependency', async () => {
      const _integrationId = '123integration';
      const initialStore = getCreatedStore();

      mutateStore(initialStore, draft => {
        draft.session.resource.references = {
          connectors: [{
            id: '123connector',
            name: 'Connector 1',
          }],
        };
      });

      await initUseHandleDelete({_integrationId}, initialStore);
      const deleteButton = screen.getByRole('button', {name: 'Remove'});

      await userEvent.click(deleteButton);
      const confirmButton = screen.getByRole('button', {name: 'Delete'});

      await userEvent.click(confirmButton);
      const snackbar = screen.getByRole('alert');

      expect(snackbar).toBeInTheDocument();
      expect(snackbar).toHaveTextContent(messageStore('INTEGRATION.INTEGRATION_WITH_CONNECTORS_DELETE_VALIDATE'));
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.clearReferences());
    });

    test('when integration contains flows', async () => {
      const _integrationId = '123integration';
      const initialStore = getCreatedStore();

      mutateStore(initialStore, draft => {
        draft.session.resource.references = {
          flows: [{
            id: '123flow',
            name: 'Flow 1',
          }],
        };
      });

      await initUseHandleDelete({_integrationId}, initialStore);
      const deleteButton = screen.getByRole('button', {name: 'Remove'});

      await userEvent.click(deleteButton);
      const confirmButton = screen.getByRole('button', {name: 'Delete'});

      await userEvent.click(confirmButton);
      const snackbar = screen.getByRole('alert');

      expect(snackbar).toBeInTheDocument();
      expect(snackbar).toHaveTextContent(message.INTEGRATION.INTEGRATION_DELETE_VALIDATE);
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.clearReferences());
    });
  });

  test('should opt for uninstall when connector id given', async () => {
    const _integrationId = '123integration';
    const userId = '123abcdef';
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.user.preferences.defaultAShareId = userId;
      draft.user.org.accounts = [{
        _id: userId,
        accessLevel: 'administrator',
      }];
    });

    await initUseHandleDelete({_integrationId, ops: {_connectorId: '123conn'}}, initialStore);
    const deleteButton = screen.getByRole('button', {name: 'Remove'});

    await userEvent.click(deleteButton);
    let confirmDialog = screen.getByRole('dialog');
    const { getByRole, getByText } = within(confirmDialog);

    expect(getByText('Confirm uninstall')).toBeInTheDocument();
    expect(getByText('Are you sure you want to uninstall?')).toBeInTheDocument();
    const cancelButton = getByRole('button', {name: 'Cancel'});

    //  Should close the dialog and do nothing on Cancelling
    await userEvent.click(cancelButton);
    expect(confirmDialog).not.toBeInTheDocument();

    //  Should initiate uninstall process on confirming
    await userEvent.click(deleteButton);
    confirmDialog = screen.getByRole('dialog');
    const confirmButton = within(confirmDialog).getByRole('button', {name: 'Uninstall'});

    await userEvent.click(confirmButton);
    expect(confirmDialog).not.toBeInTheDocument();
    expect(mockHistoryPush).toHaveBeenCalledWith(`/integrationapps/integrationApp/${_integrationId}/uninstall`);
  });

  describe('should throw snackbar error if error uninstalling', () => {
    test('when not owner or admin', async () => {
      const _integrationId = '123integration';
      const userId = '123abcdef';
      const initialStore = getCreatedStore();

      mutateStore(initialStore, draft => {
        draft.user.preferences.defaultAShareId = userId;
        draft.user.org.accounts = [{
          _id: userId,
          accessLevel: 'manage',
        }];
      });

      await initUseHandleDelete({_integrationId, ops: {_connectorId: '123conn'}}, initialStore);
      const deleteButton = screen.getByRole('button', {name: 'Remove'});

      await userEvent.click(deleteButton);
      expect(screen.getByText('Contact your account owner to uninstall this integration app.')).toBeInTheDocument();
      expect(screen.queryByText('Confirm uninstall')).not.toBeInTheDocument();
    });

    test('when supports multi store', async () => {
      const _integrationId = '123integration';
      const userId = '123abcdef';
      const initialStore = getCreatedStore();

      mutateStore(initialStore, draft => {
        draft.user.preferences.defaultAShareId = userId;
        draft.user.org.accounts = [{
          _id: userId,
          accessLevel: 'owner',
        }];
      });

      await initUseHandleDelete({_integrationId, ops: {_connectorId: '123conn', supportsMultiStore: true, name: 'Connector'}}, initialStore);
      const deleteButton = screen.getByRole('button', {name: 'Remove'});

      await userEvent.click(deleteButton);
      expect(screen.getByText('To uninstall, please navigate to Admin → Uninstall inside the Integration App and select the desired store.')).toBeInTheDocument();
      expect(screen.queryByText('Confirm uninstall')).not.toBeInTheDocument();
    });
  });
});

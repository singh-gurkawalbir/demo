
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import actions from '../../../../actions';
import { ConfirmDialogProvider } from '../../../ConfirmDialog';
import SaveAndClose from './SaveAndClose';

const mockHandleSubmit = jest.fn();

jest.mock('./hooks/useHandleSubmit', () => ({
  __esModule: true,
  ...jest.requireActual('./hooks/useHandleSubmit'),
  default: () => mockHandleSubmit,
}));

async function initSaveAndClose(props = {}, initialStore) {
  const ui = (
    <ConfirmDialogProvider>
      <MemoryRouter>
        <SaveAndClose {...props} />
      </MemoryRouter>
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test suite for SaveAndClose', () => {
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
  });

  test('should pass initial rendering', async () => {
    await initSaveAndClose();
    const saveButton = screen.getByRole('button', {name: 'Save'});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(saveButton).toBeDisabled();
    expect(closeButton).toBeEnabled();
  });

  test('should be able to close successfully', async () => {
    const onCancel = jest.fn();

    await initSaveAndClose({onCancel, disabled: true});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    await userEvent.click(closeButton);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('should be able to save successfully', async () => {
    const resourceType = 'exports';
    const resourceId = 'new-287dgf';
    const formKey = 'form-123';
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[formKey] = {
        isValid: true,
        fields: {
          tempField: { touched: true },
        },
      };
    });

    await initSaveAndClose({formKey, resourceType, resourceId}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Save'});

    expect(saveButton).toBeEnabled();
    await userEvent.click(saveButton);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  test('should display a dialog box on replacing connection for existing imports / exports', async () => {
    const onCancel = jest.fn();
    const formKey = 'form-123';
    const flowId = '345dns';
    const integrationId = '872vss';
    const connectionId = 'zkdzj33';
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[formKey] = {
        isValid: true,
        fields: {
          tempField: { touched: true },
        },
        value: {
          '/_connectionId': connectionId,
        },
      };
      draft.data.resources = {
        flows: [{
          _id: flowId,
          _integrationId: integrationId,
        }],
        integrations: [{
          _id: integrationId,
          _registeredConnectionIds: [],
        }],
      };
    });

    await initSaveAndClose({formKey, resourceType: 'imports', resourceId: '287dgf', onCancel, flowId}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Save'});

    await userEvent.click(saveButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm replace')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to replace the connection for this flow? Replacing a connection will cancel all jobs currently running.')).toBeInTheDocument();
    const cancelButton = screen.getByRole('button', {name: 'Cancel'});

    await userEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalledTimes(1);

    await userEvent.click(saveButton);
    const confirmButton = screen.getByRole('button', {name: 'Replace'});

    await userEvent.click(confirmButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.connection.completeRegister(
      [connectionId], integrationId
    ));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});

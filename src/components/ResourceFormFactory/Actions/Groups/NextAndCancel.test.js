
import React from 'react';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import NextAndCancel from './NextAndCancel';

async function initNextAndCancel(props = {}, initialStore) {
  const ui = (
    <MemoryRouter>
      <NextAndCancel {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test suite for NextAndCancel', () => {
  test('should pass initial rendering', async () => {
    await initNextAndCancel();
    const saveButton = screen.getByRole('button', {name: 'Save & close'});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(saveButton).toBeDisabled();
    expect(closeButton).toBeEnabled();
  });

  test('should be able to change save button label', async () => {
    const submitButtonLabel = 'SUBMIT HERE';
    const onCancel = jest.fn();

    await initNextAndCancel({onCancel, submitButtonLabel});
    expect(screen.getByRole('button', {name: submitButtonLabel})).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Close'}));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('should be able to save the form', async () => {
    const useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    const mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });

    useDispatchSpy.mockReturnValue(mockDispatchFn);
    const submitButtonLabel = 'SAVE BUTTON';
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

    await initNextAndCancel({submitButtonLabel,
      closeAfterSave: true,
      resourceType: 'exports',
      resourceId: '123abcd',
      flowId: '9678flws',
      formKey}, initialStore);
    const saveButton = screen.getByRole('button', {name: submitButtonLabel});

    expect(saveButton).toBeEnabled();
    await userEvent.click(saveButton);
    expect(mockDispatchFn).toBeCalled();
  });

  test('should be able to provide the correct formSaveStatus', async () => {
    const resourceType = 'exports';
    const resourceId = '626cbsc';
    const KEY = `${resourceType}-${resourceId}`;
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.resourceForm[KEY] = {
        formSaveStatus: 'loading',
      };
    });
    await initNextAndCancel({resourceType, resourceId}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Saving...'});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(saveButton).toBeDisabled();
    expect(closeButton).toBeDisabled();
  });
});

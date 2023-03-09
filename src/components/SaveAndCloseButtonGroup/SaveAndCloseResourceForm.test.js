
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, reduxStore, renderWithProviders } from '../../test/test-utils';
import { getCreatedStore } from '../../store';
import SaveAndCloseResourceForm from './SaveAndCloseResourceForm';
import { FORM_SAVE_STATUS } from '../../constants/resourceForm';
import { CLOSE_AFTER_SAVE } from '.';

jest.mock('./hooks/useHandleCancelBasic', () => ({
  __esModule: true,
  ...jest.requireActual('./hooks/useHandleCancelBasic'),
  default: ({onClose}) => onClose,
}));

async function initSaveAndCloseResourceForm(props = {}, initialStore = reduxStore) {
  const ui = (
    <MemoryRouter>
      <SaveAndCloseResourceForm {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test cases for SaveAndCloseResourceForm', () => {
  test('should pass initial rendering', async () => {
    await initSaveAndCloseResourceForm();
    const saveButton = screen.getByRole('button', {name: 'Save'});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(saveButton).toBeDisabled();
    expect(closeButton).toBeEnabled();
  });

  test('should be able to handle save, close, save & close functionality', async () => {
    const formKey = 'form-123';
    const onSave = jest.fn();
    const onClose = jest.fn();
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[formKey] = {
        isValid: true,
        fields: {
          tempField: { touched: true },
        },
      };
    });

    await initSaveAndCloseResourceForm({formKey, onSave, onClose, status: FORM_SAVE_STATUS.COMPLETE, disableOnCloseAfterSave: false}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Save'});
    const saveAndCloseButton = screen.getByRole('button', {name: 'Save & close'});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    await userEvent.click(saveButton);
    expect(onSave).toHaveBeenLastCalledWith(!CLOSE_AFTER_SAVE);

    await userEvent.click(saveAndCloseButton);
    expect(onSave).toHaveBeenCalledTimes(2);
    expect(onClose).toHaveBeenCalledTimes(1);

    await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test('save and Save & close buttons should behave same when disableOnCloseAfterSave flag is set', async () => {
    const formKey = 'form-123';
    const onSave = jest.fn();
    const onClose = jest.fn();
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[formKey] = {
        isValid: true,
        fields: {
          tempField: { touched: true },
        },
      };
    });

    await initSaveAndCloseResourceForm({formKey, onSave, onClose, status: FORM_SAVE_STATUS.COMPLETE, disableOnCloseAfterSave: true}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Save'});
    const saveAndCloseButton = screen.getByRole('button', {name: 'Save & close'});

    await userEvent.click(saveButton);
    expect(onSave).toHaveBeenLastCalledWith(!CLOSE_AFTER_SAVE);

    await userEvent.click(saveAndCloseButton);
    expect(onSave).toHaveBeenCalledTimes(2);
  });

  test('save button should be disabled when disabled flag is set', async () => {
    const formKey = 'form-123';
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[formKey] = {
        fields: {
          tempField: { touched: true },
        },
      };
    });

    await initSaveAndCloseResourceForm({formKey, status: FORM_SAVE_STATUS.COMPLETE, disabled: true}, initialStore);
    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
  });
});

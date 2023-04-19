
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { getCreatedStore } from '../../store';
import { mutateStore, reduxStore, renderWithProviders } from '../../test/test-utils';
import SaveAndCloseMiniResourceForm from './SaveAndCloseMiniResourceForm';
import { FORM_SAVE_STATUS } from '../../constants/resourceForm';

async function initSaveAndCloseMiniResourceForm(props = {}, initialStore = reduxStore) {
  const ui = (
    <MemoryRouter>
      <SaveAndCloseMiniResourceForm {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test cases for SaveAndCloseMiniResourceForm', () => {
  test('should pass initial rendering', async () => {
    await initSaveAndCloseMiniResourceForm();

    expect(screen.getByRole('button', {name: 'Save & close'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Close'})).toBeEnabled();
  });

  test('should be able to forcefully enable save button', async () => {
    const formKey = 'form-123';
    const handleSave = jest.fn();
    const handleCancel = jest.fn();
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[formKey] = {
        isValid: true,
        fields: {
          tempField: { touched: false },
        },
      };
    });

    await initSaveAndCloseMiniResourceForm({
      formKey,
      forceIsDirty: true,
      formSaveStatus: FORM_SAVE_STATUS.COMPLETE,
      submitButtonLabel: 'Save & authorize',
      handleSave,
      handleCancel},
    initialStore);
    const saveButton = screen.getByRole('button', {name: 'Save & authorize'});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(saveButton).toBeEnabled();
    await userEvent.click(saveButton);
    expect(handleSave).toHaveBeenCalledTimes(1);
    await userEvent.click(closeButton);
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  test('should be able to disable save button forcefully', async () => {
    await initSaveAndCloseMiniResourceForm({disabled: true, submitButtonLabel: 'SUBMIT', submitTransientLabel: 'transientSubmit'});
    expect(screen.getByRole('button', { name: 'SUBMIT'})).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'transientSubmit'})).not.toBeInTheDocument();
  });
});

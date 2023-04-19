
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import ValidateAndSave from '.';

async function initValidateAndSave(props = {}, initialStore) {
  const ui = (
    <MemoryRouter>
      <ValidateAndSave {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('test suite for ValidateAndSave', () => {
  test('should pass initial rendering', async () => {
    await initValidateAndSave();
    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Close'})).toBeEnabled();
  });

  test('should pass the correct values', async () => {
    const props = {
      formKey: 'connections-123dfg',
      isNew: false,
      resourceType: 'connections',
      resourceId: '123dfg',
      cancelButtonLabel: 'Cancel',
      submitButtonLabel: 'Save & close',
      submitButtonColor: 'secondary',
      onCancel: jest.fn(),
      mode: 'group',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.asyncTask[props.formKey] = {
        status: 'loading',
      };
      draft.session.form[props.formKey] = {
        isValid: true,
        fields: {
          tempField: { touched: true },
        },
      };
    });

    await initValidateAndSave(props, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Save'});
    const closeButton = screen.getByRole('button', {name: 'Close'});
    const testButton = screen.getByRole('button', {name: 'Test connection'});

    expect(saveButton).toBeDisabled();
    expect(testButton).toBeDisabled();
    expect(closeButton).toBeEnabled();
    await userEvent.click(closeButton);
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });
});

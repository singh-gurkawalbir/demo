
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import IntegrationSettings from './IntegrationSettingsGroup';
import { getCreatedStore } from '../../../../store';

const mockSave = jest.fn();

jest.mock('./hooks/useHandleIntegrationSettings', () => ({
  __esModule: true,
  ...jest.requireActual('./hooks/useHandleIntegrationSettings'),
  default: () => mockSave,
}));

async function initIntegrationSettings(props = {}, initialStore) {
  const ui = (
    <MemoryRouter>
      <IntegrationSettings {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

const getStateKey = (integrationId, flowId, sectionId) =>
  `${integrationId}${flowId ? `-${flowId}` : ''}${
    sectionId ? `-${sectionId}` : ''
  }`;

describe('test suite for IntegrationSettings', () => {
  test('should pass initial rendering', async () => {
    await initIntegrationSettings();
    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Close'})).toBeEnabled();
  });

  test('should fetch and provide the correct value of isDirty and formSaveStatus', async () => {
    const formKey = 'form-123';
    const integrationId = 'asdfgh';
    const flowId = 'qwerty';
    const sectionId = 'zxcvb';
    const KEY = getStateKey(integrationId, flowId, sectionId);
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[formKey] = {
        fields: {
          tempField: { touched: true },
        },
      };
      draft.session.integrationApps.settings[KEY] = {
        formSaveStatus: 'loading',
      };
    });

    await initIntegrationSettings({integrationId, flowId, sectionId, formKey, disabled: true}, initialStore);
    expect(screen.getByRole('button', {name: 'Saving...'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Close'})).toBeDisabled();
  });

  test('should be able to close successfully', async () => {
    const onCancel = jest.fn();
    const formKey = 'form-123';
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[formKey] = {
        fields: {
          tempField: { touched: false },
        },
      };
    });
    await initIntegrationSettings({formKey, onCancel}, initialStore);
    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(closeButton).toBeEnabled();
    await userEvent.click(closeButton);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('should be able to save successfully', async () => {
    const formKey = 'form-123';
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[formKey] = {
        fields: {
          tempField: { touched: true },
        },
      };
    });
    await initIntegrationSettings({formKey}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Save'});
    const closeButton = screen.getByRole('button', {name: 'Close'});
    const saveAndCloseButton = screen.getByRole('button', {name: 'Save & close'});

    expect(saveButton).toBeEnabled();
    expect(closeButton).toBeEnabled();
    expect(saveAndCloseButton).toBeEnabled();
    await userEvent.click(saveButton);
    expect(mockSave).toHaveBeenCalledTimes(1);
    await userEvent.click(saveAndCloseButton);
    expect(mockSave).toHaveBeenCalledTimes(2);
  });
});

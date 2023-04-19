
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import IntegrationSettingsSaveButton from './IntegrationSettingsSaveButton';

async function initIntegrationSettingsSaveButton(props = {}, initialStore = reduxStore) {
  const ui = (
    <MemoryRouter>
      <IntegrationSettingsSaveButton {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test suite for IntegrationSettingsSaveButton', () => {
  test('should pass initial rendering', async () => {
    await initIntegrationSettingsSaveButton();

    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
  });

  test('should show Saving... when loading', async () => {
    const integrationId = 'integration-123';
    const flowId = 'flow-456';
    const sectionId = 'section-789';
    const KEY = `${integrationId}-${flowId}-${sectionId}`;
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.integrationApps.settings[KEY] = {
        formSaveStatus: 'loading',
      };
    });
    await initIntegrationSettingsSaveButton({integrationId, flowId, sectionId}, initialStore);
    expect(screen.getByRole('button', {name: 'Saving...'})).toBeInTheDocument();
  });

  test('should be able to save successfully', async () => {
    const formKey = 'settings-123';
    const initialStore = getCreatedStore();
    const postProcessValuesFn = jest.fn(() => ({}));

    mutateStore(initialStore, draft => {
      draft.session.form[formKey] = {
        isValid: true,
        fields: {
          tempField: {touched: true},
        },
      };
    });

    await initIntegrationSettingsSaveButton({formKey, postProcessValuesFn}, initialStore);

    const saveButton = screen.getByRole('button', {name: 'Save'});

    expect(saveButton).toBeEnabled();
    expect(postProcessValuesFn).not.toHaveBeenCalled();
    await userEvent.click(saveButton);
    expect(postProcessValuesFn).toHaveBeenCalledTimes(1);
  });
});

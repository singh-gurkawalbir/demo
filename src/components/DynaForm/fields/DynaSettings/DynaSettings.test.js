
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import DynaSettings from '.';

const onFieldChange = jest.fn();

describe('dynaSettings tests', () => {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      flows: [
        {
          _id: 'flow1',
          _integrationId: '_integrationId1',
          settingsForm: { form: { fieldMap: {} }, init: { _scriptId: '123' } },
          settings: {},
        },
        {
          _id: 'flow3',
          _integrationId: '_integrationId1',
          settingsForm: { form: { fieldMap: {} }, init: { _scriptId: '123' } },
          settings: {},
        },
      ],
      integrations: [{
        _id: '_integrationId1',
      }],
    };
    draft.user = {
      profile: {
        developer: true,
        allowedToPublish: false,
      },
    };
    draft.session.form = {
      'settingsForm-flow3': {isValid: false},
    };
    draft.session.editors = {
      'settings-flow3-general': {saveStatus: 'success'},
    };
  });

  test('should able to test DynaSettings without user having settingsForm [non-devs]', async () => {
    const props = {
      resourceContext: {resourceType: 'flows', resourceId: 'flow2'}, collapsed: false,
    };

    renderWithProviders(<MemoryRouter> <DynaSettings {...props} /></MemoryRouter>, { initialStore });
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Custom settings'})).toBeInTheDocument();
    await userEvent.click(screen.getByText('Custom settings'));
  });
  test('should able to test DynaSettings with fields only', async () => {
    const props = {
      resourceContext: {resourceType: 'flows', resourceId: 'flow1'}, fieldsOnly: true, sectionId: 'general', onFieldChange,
    };

    renderWithProviders(<MemoryRouter> <DynaSettings {...props} /></MemoryRouter>, { initialStore });
    expect(screen.queryByRole('button', {name: 'Custom settings'})).not.toBeInTheDocument();
    expect(onFieldChange).toHaveBeenCalledWith(undefined, {}, true);
  });
  test('should able to test DynaSettings with allowFormEdit: false', async () => {
    mutateStore(initialStore, draft => {
      draft.user.profile.developer = false;
    });
    const props = {
      resourceContext: {resourceType: 'flows', resourceId: 'flow2'}, onFieldChange,
    };

    renderWithProviders(<MemoryRouter> <DynaSettings {...props} /></MemoryRouter>, { initialStore });
    expect(screen.queryByRole('button', {name: 'Custom settings'})).not.toBeInTheDocument();
  });
});

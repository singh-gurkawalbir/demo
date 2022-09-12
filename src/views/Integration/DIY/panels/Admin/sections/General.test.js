/* global describe, test, expect */
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import GeneralSection from './General';
import {reduxStore, renderWithProviders} from '../../../../../../test/test-utils';

async function initGeneralSection(props = {}) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources.integrations = [{_id: '678901234567890', name: 'demo integration', description: 'demo descriptoon', readme: 'Demo HTML content'}];
  initialStore.getState().user.preferences.defaultAShareId = 'own';
  initialStore.getState().user.org.accounts = [
    {
      _id: 'own',
      accessLevel: 'owner',
      ownerUser: {
        licenses: [],
      },
    },
  ];

  return renderWithProviders(<MemoryRouter><GeneralSection {...props} /></MemoryRouter>, {initialStore});
}

describe('General Section UI tests', () => {
  test('should pass the initial render', async () => {
    await initGeneralSection({integrationId: '678901234567890'});
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
  test('keivbhrfbf', async () => {
    await initGeneralSection({integrationId: '678901234567890'});
    const input = document.querySelector('[name="name"]');

    userEvent.click(input);
    userEvent.type(input, 'demo');
    userEvent.click(screen.getByText('Save'));
  });
});

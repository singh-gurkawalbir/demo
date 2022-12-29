
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactredux from 'react-redux';
import { renderWithProviders} from '../../../../../../test/test-utils';
import { runServer } from '../../../../../../test/api/server';
import actions from '../../../../../../actions';
import { getCreatedStore } from '../../../../../../store';
import GeneralPanel from './General';

describe('GeneralPanel UI tests', () => {
  runServer();
  async function addInteration() {
    const initialStore = getCreatedStore();

    initialStore.dispatch(actions.resource.requestCollection('integrations'));
    await waitFor(() => expect(initialStore?.getState()?.data?.resources?.integrations).toBeDefined());

    return {initialStore};
  }
  function renderFunction(initialStore) {
    renderWithProviders(
      <MemoryRouter>
        <GeneralPanel integrationId="5a2e4cccc147dd5f5cfdddd" childId="g3uzz5c7jx" sectionId="SomeTitle" />
      </MemoryRouter>, {initialStore});
  }
  test('should test the form generated', async () => {
    const {initialStore} = await addInteration();

    renderFunction(initialStore);
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Some Lable for general')).toBeInTheDocument();
    const option1 = screen.getByText('Option1');

    expect(option1).toBeInTheDocument();
    userEvent.click(option1);
    expect(screen.getByText('Option2')).toBeInTheDocument();
  });
  test('should test when form status is loading', async () => {
    const {initialStore} = await addInteration();

    const mockDispatch = jest.fn();

    jest.spyOn(reactredux, 'useDispatch').mockReturnValue(mockDispatch);

    initialStore.getState().session.integrationApps.settings['5a2e4cccc147dd5f5cfdddd'] = {formSaveStatus: 'loading'};

    renderFunction(initialStore);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getAllByText('Saving...')[0]).toBeInTheDocument();
  });
});

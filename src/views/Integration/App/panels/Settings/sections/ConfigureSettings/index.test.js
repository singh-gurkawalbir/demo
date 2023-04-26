import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactredux from 'react-redux';
import { mutateStore, renderWithProviders} from '../../../../../../../test/test-utils';
import { runServer } from '../../../../../../../test/api/server';
import actions from '../../../../../../../actions';
import { getCreatedStore } from '../../../../../../../store';
import ConfigureSettings from './index';

jest.mock('../../../../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../../components/LoadResources'),
  default: props => <div>{props.children}</div>,
}));

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

describe('ConfigureSettings UI tests', () => {
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
        <ConfigureSettings integrationId="5a2e4cc68147dd5f5cfdddd" childId="someChildId" sectionId="SomeTitle" />
      </MemoryRouter>, {initialStore});
  }
  test('should test the form based on field provided', async () => {
    const {initialStore} = await addInteration();

    renderFunction(initialStore);
    expect(screen.getByText('SomeLabel')).toBeInTheDocument();
    const option1 = screen.getByText('SomeOption1');

    expect(option1).toBeInTheDocument();
    await userEvent.click(option1);
    expect(screen.getByText('SomeOption2')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
  test('should test when the form status is loading', async () => {
    const {initialStore} = await addInteration();
    const mockDispatch = jest.fn();

    jest.spyOn(reactredux, 'useDispatch').mockReturnValue(mockDispatch);

    mutateStore(initialStore, draft => {
      draft.session.integrationApps.settings['5a2e4cc68147dd5f5cfdddd-SomeTitle'] = {formSaveStatus: 'loading'};
    });

    renderFunction(initialStore);
    expect(screen.getAllByText('Saving...')[0]).toBeInTheDocument();
  });
});

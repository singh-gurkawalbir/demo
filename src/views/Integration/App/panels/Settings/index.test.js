
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { act } from 'react-dom/test-utils';
import { renderWithProviders} from '../../../../../test/test-utils';
import { runServer } from '../../../../../test/api/server';
import actions from '../../../../../actions';
import { getCreatedStore } from '../../../../../store';
import SettingsPanel from './index';

describe('SettingsPanel UI tests', () => {
  runServer();
  async function initStoreOnly() {
    const initialStore = getCreatedStore();

    act(() => { initialStore.dispatch(actions.resource.requestCollection('integrations')); });
    await waitFor(() => expect(initialStore?.getState()?.data?.resources?.integrations).toBeDefined());

    return {initialStore};
  }
  async function renderFunction(integrationId, childId, path, initialStore) {
    if (path) {
      renderWithProviders(
        <MemoryRouter initialEntries={[path]}>
          <Route path="/:sectionId">
            <SettingsPanel integrationId={integrationId} childId={childId} />
          </Route>
        </MemoryRouter>, {initialStore});
    } else {
      renderWithProviders(
        <MemoryRouter >
          <Route >
            <SettingsPanel integrationId={integrationId} childId={childId} />
          </Route>
        </MemoryRouter>, {initialStore});
    }
  }
  test('should test the panel and links', async () => {
    const {initialStore} = await initStoreOnly();

    await renderFunction('5a2e4cc68147dd5f5cf8d6f8', 'g3uzz5c7jx', '/Fulfillment', initialStore);

    const fulfillment = screen.getByText('Fulfillment');
    const general = screen.getByText('General');

    expect(fulfillment).toHaveAttribute('href', '/Fulfillment');
    expect(general).toHaveAttribute('href', '/common');

    expect(screen.getByText('Configure all Fulfillment flows')).toBeInTheDocument();

    await userEvent.click(screen.getByText('General'));
    expect(screen.getByText('Your store')).toBeInTheDocument();
    expect(screen.getByText('Option1')).toBeInTheDocument();
  });

  test('should test when flow section is not in integration', async () => {
    const {initialStore} = await initStoreOnly();

    await renderFunction('5ff579d745ceef7dcd797c15', 'g3uzz5c7jx', null, initialStore);

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText("You don 't have any custom settings for this integration.")).toBeInTheDocument();
  });
  test('should test when isparent view is true', async () => {
    const {initialStore} = await initStoreOnly();

    await renderFunction('5ff579d745ceef7dcd797777', null, null, initialStore);

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Choose a someStoreLabel from the someStoreLabel drop-down to view settings.')).toBeInTheDocument();
  });
  test('should test the history.replace call', async () => {
    const history = createMemoryHistory({ initialEntries: ['/wrongsectionId'] });

    jest.spyOn(history, 'replace').mockImplementation();
    const {initialStore} = await initStoreOnly();

    renderWithProviders(
      <Router history={history}>
        <Route path="/:sectionId">
          <SettingsPanel integrationId="5a2e4cc68147dd5f5cf8d6f9" />
        </Route>
      </Router>, {initialStore});
    expect(history.replace).toHaveBeenCalledWith('/Fulfillment');
  });
});

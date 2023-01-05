
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import {renderWithProviders, mockGetRequestOnce} from '../../../../../../test/test-utils';
import actions from '../../../../../../actions';
import { runServer } from '../../../../../../test/api/server';
import SettingsDrawer from '.';

jest.mock('..', () => ({
  __esModule: true,
  ...jest.requireActual('..'),
  IAFormStateManager: () => (
    <>
      IAFormStateManager
    </>
  ),
}));

describe('SettingsDrawer UI tests', () => {
  runServer();

  async function prepareStore(store) {
    store.dispatch(actions.resource.requestCollection('connections'));
    store.dispatch(actions.resource.requestCollection('integrations'));
    store.dispatch(actions.resource.requestCollection('imports'));
    store.dispatch(actions.resource.requestCollection('flows'));
    store.dispatch(actions.resource.requestCollection('exports'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.flows).toBeDefined());
    await waitFor(() => expect(store?.getState()?.data?.resources?.exports).toBeDefined());
    await waitFor(() => expect(store?.getState()?.data?.resources?.connections).toBeDefined());
    await waitFor(() => expect(store?.getState()?.data?.resources?.imports).toBeDefined());
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
  }
  test('should test when resources are not present in the redux store', () => {
    const {utils} = renderWithProviders(
      <MemoryRouter initialEntries={[{pathname: '/integrations/5fc5e0e66cfe5b44bb95de70/flowBuilder/60db46af9433830f8f0e0fe7/settings'}]}>
        <Route path="/integrations/:integrationId/flowBuilder"><SettingsDrawer /></Route>
      </MemoryRouter>);

    expect(utils.container.textContent).toBe('');
  });

  test('should test aswhen resources are present in the redux store', async () => {
    mockGetRequestOnce('/api/flows', [{
      _id: '5ea16c600e2fab71928a6152',
      lastModified: '2021-08-13T08:02:49.712Z',
      name: ' Bulk insert with harcode and mulfield mapping settings',
      disabled: true,
      _integrationId: '5ff579d745ceef7dcd797c15',
      skipRetries: false,
      pageProcessors: [
        {
          responseMapping: {
            fields: [],
            lists: [],
          },
          type: 'import',
          _importId: '5ea16cd30e2fab71928a6166',
        },
      ],
      pageGenerators: [
        {
          _exportId: '5d00b9f0bcd64414811b2396',
        },
      ],
      createdAt: '2020-04-23T10:22:24.290Z',
      lastExecutedAt: '2020-04-23T11:08:41.093Z',
      autoResolveMatchingTraceKeys: true,
    }]);
    mockGetRequestOnce('/api/imports', [{}]);
    mockGetRequestOnce('/api/exports', [{}]);

    const {store} = renderWithProviders(
      <MemoryRouter initialEntries={[{pathname: '/integrations/5ff579d745ceef7dcd797c15/flowBuilder/5ea16c600e2fab71928a6152/settings'}]}>
        <Route path="/integrations/:integrationId/flowBuilder"><SettingsDrawer /></Route>
      </MemoryRouter>);

    await prepareStore(store);

    expect(screen.getByText('IAFormStateManager')).toBeInTheDocument();
  });
});

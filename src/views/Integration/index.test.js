/* global describe, test, expect ,jest */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Integration from '.';
import {mockGetRequestOnce, renderWithProviders} from '../../test/test-utils';
import { runServer } from '../../test/api/server';
import actions from '../../actions/index';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: () => ({ url: '/', params: {integrationId: '5ff579d745ceef7dcd797c15'} }),
}));

jest.mock('../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/LoadResources'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));
jest.mock('./DIY/index', () => ({
  __esModule: true,
  ...jest.requireActual('./DIY/index'),
  default: () => (
    <>
      isIntegrationAppV2
    </>
  ),
}));
jest.mock('./App/index', () => ({
  __esModule: true,
  ...jest.requireActual('./DIY/index'),
  default: () => (
    <>
      isIntegrationAppV1
    </>
  ),
}));

describe('Integration UI tests', () => {
  runServer();
  test('should test integration of App version 2', async () => {
    const {store} = renderWithProviders(<MemoryRouter><Integration /></MemoryRouter>);

    store.dispatch(actions.resource.received('integrations', [{
      _id: '5ff579d745ceef7dcd797c15',
      lastModified: '2021-01-19T06:34:17.222Z',
      name: " AFE 2.0 refactoring for DB's",
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c97',
        '5ff57a8345ceef7dcd797c21',
      ],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2021-01-06T08:50:31.935Z',
    }]));
    await waitFor(() => expect(screen.queryByText('isIntegrationAppV2')).toBeInTheDocument());
  });
  test('should test integration of App version 1', async () => {
    const {store} = renderWithProviders(<MemoryRouter><Integration /></MemoryRouter>);

    mockGetRequestOnce('/api/integrations', [{
      _id: '5ff579d745ceef7dcd797c15',
      lastModified: '2021-01-19T06:34:17.222Z',
      name: " AFE 2.0 refactoring for DB's",
      install: [],
      _connectorId: 'someid',
      sandbox: false,
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c97',
        '5ff57a8345ceef7dcd797c21',
      ],
      flowGroupings: [],
      createdAt: '2021-01-06T08:50:31.935Z',
    }]);

    store.dispatch(actions.resource.requestCollection('integrations'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    await waitFor(() => expect(screen.queryByText('isIntegrationAppV1')).toBeInTheDocument());
  });
  test('should test integration integration Id not in the redux store', async () => {
    renderWithProviders(<MemoryRouter><Integration /></MemoryRouter>);

    await waitFor(() => expect(screen.queryByText('isIntegrationAppV2')).toBeInTheDocument());
  });
});

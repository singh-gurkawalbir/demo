
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import Integration from '.';
import { mutateStore, renderWithProviders} from '../../test/test-utils';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';

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
  function initFunction(_connectorId) {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.integrations = [{
        _id: '5ff579d745ceef7dcd797c15',
        lastModified: '2021-01-19T06:34:17.222Z',
        _connectorId,
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
      }];
    });

    renderWithProviders(
      <MemoryRouter
        initialEntries={[{pathname: '/62d2ef8aa7777017e5a8081a'}]}>
        <Route path="/:integrationId" ><Integration /></Route>
      </MemoryRouter>, {initialStore});
  }
  test('should test integration of App version 2', () => {
    initFunction();

    waitFor(() => expect(screen.queryByText('isIntegrationAppV2')).toBeInTheDocument());
  });
  test('should test integration of App version 1', () => {
    initFunction('someid');

    waitFor(() => expect(screen.queryByText('isIntegrationAppV1')).toBeInTheDocument());
  });
  test('should test when integration Id not in the redux store', () => {
    renderWithProviders(<MemoryRouter><Integration /></MemoryRouter>);

    waitFor(() => expect(screen.queryByText('isIntegrationAppV2')).toBeInTheDocument());
  });
});

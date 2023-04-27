
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { renderWithProviders} from '../../../test/test-utils';
import { runServer } from '../../../test/api/server';
import actions from '../../../actions/index';
import IntegrationApp from '.';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: () => ({ url: '/', params: {integrationId: '5ff579d745ceef7dcd797c15'} }),
}));

jest.mock('./TabRedirection', () => ({
  __esModule: true,
  ...jest.requireActual('./TabRedirection'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));
jest.mock('../../../components/drawer/Resource', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/drawer/Resource'),
  default: () => (
    <div>
      Resource
    </div>
  ),
}));

jest.mock('./IntegrationTabs', () => ({
  __esModule: true,
  ...jest.requireActual('./IntegrationTabs'),
  default: () => (
    <div>
      IntegrationTabs
    </div>
  ),
}));
jest.mock('./PageBar', () => ({
  __esModule: true,
  ...jest.requireActual('./PageBar'),
  default: () => (
    <div>
      PageBar
    </div>
  ),
}));
jest.mock('../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer'),
  default: () => (
    <div>
      QueuedJobsDrawer
    </div>
  ),
}));

describe('IntegrationApp UI testing', () => {
  runServer();

  async function renderWithStore(integrationId) {
    const {store} = renderWithProviders(<MemoryRouter><IntegrationApp integrationId={integrationId} /></MemoryRouter>);

    waitFor(async () => {
      act(() => { store.dispatch(actions.resource.requestCollection('integrations')); });
      await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    });
  }

  test('should test when no integration id is provided', () => {
    renderWithProviders(<MemoryRouter><IntegrationApp /></MemoryRouter>);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should test when resources are not loaded', () => {
    renderWithProviders(<MemoryRouter><IntegrationApp integrationId="someId" /></MemoryRouter>);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should test the components which are rendered', async () => {
    await renderWithStore('5ff579d745ceef7dcd797c15');
    waitFor(() => {
      expect(screen.getByText('PageBar')).toBeInTheDocument();
      expect(screen.getByText('IntegrationTabs')).toBeInTheDocument();
      expect(screen.getByText('Resource')).toBeInTheDocument();
      expect(screen.getByText('QueuedJobsDrawer')).toBeInTheDocument();
    });
  });
});

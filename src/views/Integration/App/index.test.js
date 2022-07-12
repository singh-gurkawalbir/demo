/* global describe, test, expect ,jest */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {mockGetRequestOnce, renderWithProviders} from '../../../test/test-utils';
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

describe('ItegraionApp UI testing', () => {
  runServer();
  test('should test when no intgeration id is provided', () => {
    const {utils} = renderWithProviders(<MemoryRouter><IntegrationApp /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should test when resources are not loaded', () => {
    const {utils} = renderWithProviders(<MemoryRouter><IntegrationApp integrationId="someId" /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should test the component', async () => {
    mockGetRequestOnce('/api/integrations', [{
      _id: '5ff579d745ceef7dcd797c15',
      lastModified: '2021-01-19T06:34:17.222Z',
      name: " AFE 2.0 refactoring for DB's",
      install: [],
      _connectorId: 'someconnectorid',
      sandbox: false,
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c97',
        '5ff57a8345ceef7dcd797c21',
      ],
      flowGroupings: [],
      createdAt: '2021-01-06T08:50:31.935Z',
    }]);
    const {store} = renderWithProviders(<MemoryRouter><IntegrationApp integrationId="5ff579d745ceef7dcd797c15" /></MemoryRouter>);

    store.dispatch(actions.resource.requestCollection('integrations'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    expect(screen.getByText('PageBar')).toBeInTheDocument();
    expect(screen.getByText('IntegrationTabs')).toBeInTheDocument();
    expect(screen.getByText('Resource')).toBeInTheDocument();
    expect(screen.getByText('QueuedJobsDrawer')).toBeInTheDocument();

    screen.debug();
  });
});

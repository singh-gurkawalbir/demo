/* global describe, test, expect, jest */
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import { MemoryRouter, Route} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore} from '../../../../../../test/test-utils';
import FlowGroupRow from '.';

const initialStore = reduxStore;

function initFlowGroupRow(props = {}) {
  initialStore.getState().user.preferences = {
    environment: 'production',
    defaultAShareId: 'own',
  };
  initialStore.getState().user.org = {
    users: [],
    accounts: [
      {
        _id: 'own',
        accessLevel: 'owner',
        ownerUser: {
          licenses: [],
        },
      },
    ],
  };
  initialStore.getState().data.resources.exports = [{
    _id: '5ac5e4d75b88ee52fd41d188',
    createdAt: '2018-04-05T08:56:56.295Z',
    lastModified: '2021-11-15T06:17:42.689Z',
    name: 'expp',
    _connectionId: '5ac5e47106bd2615df9fba31',
    _integrationId: '62d826bf5645756e8300beac',
    _connectorId: '62712c1edd4afe56b5a10c3c',
    apiIdentifier: 'ec7c805b8b',
    asynchronous: true,
  }];
  initialStore.getState().user.profile.useErrMgtTwoDotZero = true;
  initialStore.getState().session.errorManagement.latestIntegrationJobDetails = {
    '62d826fd4b0ebc7de72f3433': {
      status: 'received',
      data: [
        {
          _id: '5fa2bf2a3471267e3da2d79a',
          numError: 1,
          numIgnore: 0,
          numPagesGenerated: 1,
          numResolved: 0,
          numSuccess: 12,
        },
        {
          _id: '5fa2bf2a3471267e3da2d79b',
          numError: 2,
          numIgnore: 0,
          numPagesGenerated: 1,
          numResolved: 0,
          numSuccess: 6,
        },
      ],
    },
  };
  initialStore.getState().data.resources.flows = [{
    _id: '5fa2bf2a3471267e3da2d79a',
    lastModified: '2020-11-04T14:48:10.687Z',
    name: 'flow1',
    _integrationId: '62d826bf5645756e8300beac',
    _connectorId: '5b61ae4aeb538642c26bdbe6',
    _flowGroupingId: '6257b33a722b313acd1df1bf',
    disabled: false,
    pageGenerators: [
      {
        _exportId: '5ac5e4d75b88ee52fd41d188',
      },
    ],
    createdAt: '2020-11-04T14:48:10.403Z',
    free: false,
    externalId: 'netsuite_contact_to_salesforce_contact_flow',
  }, { _id: '5fa2bf2a3471267e3da2d79b',
    lastModified: '2020-11-04T14:48:10.687Z',
    name: 'flow2',
    _flowGroupingId: '626a97698f8f350e19611501',
    disabled: false,
    _integrationId: '62d826bf5645756e8300beac',
    _connectorId: '5b61ae4aeb538642c26bdbe6',
    pageGenerators: [
      {
        _exportId: '5ac5e4d75b88ee52fd41d188',
      },
    ],
    createdAt: '202' }, { _id: '6fa2bf2a3471267e3da2d79c',
    lastModified: '2020-11-04T14:48:10.687Z',
    name: 'flow3',
    disabled: false,
    _integrationId: '62d826bf5645756e8300beac',
    _connectorId: '5b61ae4aeb538642c26bdbe6',
    pageGenerators: [
      {
        _exportId: '5ac5e4d75b88ee52fd41d188',
      },
    ],
    createdAt: '202' }];
  initialStore.getState().session.errorManagement.openErrors = {
    '62d826bf5645756e8300beac': {
      status: 'received',
      data: {
        '5fa2bf2a3471267e3da2d79a': {
          _flowId: '5fa2bf2a3471267e3da2d79a',
          numError: 2,
        },
        '5fa2bf2a3471267e3da2d79b': {
          _flowId: '5fa2bf2a3471267e3da2d79b',
          numError: 2,
        },
      },
    },
  };
  initialStore.getState().data.resources.integrations = [{
    _id: '62d826bf5645756e8300beac',
    lastModified: '2022-07-20T16:02:05.025Z',
    name: 'Shopify - Microsoft Dynamics 365 Business Central',
    _connectorId: props.conn,
    install: [],
    mode: 'settings',
    settings: {
      tenantId: '1daca9ee-f1be-4c01-8eb2-0bd1e07155ad',
      environment: 'Sandbox',
      company_name: 'CRONUS USA, Inc.',
      companyInternalId: '64d41503-fcd7-eb11-bb70-000d3a299fca',
    },
    installSteps: [
      {
        name: 'Configure Microsoft Dynamics 365 Business Central connection',
      },
      {
        name: 'Configure the default company',
      },
      {
        name: 'Install and verify Microsoft Dynamics 365 Business Central extension',
      },
    ],
    flowGroupings: [
      {
        name: 'Orders',
        _id: '6257b33a722b313acd1df1bf',
      },
      {
        name: 'Fulfillment',
        _id: '626a97698f8f350e19611500',
      },
      {
        name: 'Inventory',
        _id: '626a97698f8f350e19611501',
      },
    ],
    childDisplayName: 'Shopify-Store',
    initChild: {
      _scriptId: '62712819db631b0ec2e385b9',
      function: 'addNewChild',
    },
    createdAt: '2022-07-20T16:01:03.673Z',
    _sourceId: '62714407dd4afe56b5a11f6d',
  }, { _id: '62d826bf5645756e8300bead',
    lastModified: '2022-07-20T16:02:05.025Z',
    name: 'Shopify - Microsoft Dynamics 365 Business Central',
    _connectorId: props.conn,
    install: [],
    mode: 'settings',
    createdAt: '2022-07-20T16:01:03.673Z' }];
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/integrationapps/ShopifyMicrosoftDynamics365BusinessCentral/62d826bf5645756e8300beac/flows/sections/6257b33a722b313acd1df1bf'}]}>
      <Route
        path="/integrationapps/ShopifyMicrosoftDynamics365BusinessCentral/62d826bf5645756e8300beac/flows/sections/:sectionId"
            >
        <FlowGroupRow {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('../../../../../../components/Sortable/SortableHandle', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../components/Sortable/SortableHandle'),
  default: () =>
    (
      <div>SortableHandle</div>
    )
  ,
}));
describe('FlowGroupRow UI tests', () => {
  test('should render empty DOM when sectionId is not present in the url', () => {
    const props = {rowData: {}, flows: []};
    const {utils} = renderWithProviders(<MemoryRouter><FlowGroupRow {...props} /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should render empty DOM when sectionId is unassigned and "hasUnassignedSection" is false', () => {
    const props = {rowData: {sectionId: 'unassigned'}, flows: [], hasUnassignedSection: false};
    const {utils} = renderWithProviders(<MemoryRouter><FlowGroupRow {...props} /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should not display the SortableHandle component by default', () => {
    const props = {rowData: {sectionId: 'unassigned'}, flows: []};

    renderWithProviders(<MemoryRouter><FlowGroupRow {...props} /></MemoryRouter>);
    expect(screen.queryByText('SortableHandle')).toBeNull();
  });
  test('should display the SortableHandle when hovered on section title and should not display it when cursor is removed from section title', () => {
    const props = {rowData: {sectionId: '6257b33a722b313acd1df1bf', title: 'demo section'}, flows: []};

    initFlowGroupRow(props);
    userEvent.hover(screen.getByText('demo section'));
    expect(screen.getByText('SortableHandle')).toBeInTheDocument();
    userEvent.unhover(screen.getByText('demo section'));
    waitFor(() => expect(screen.queryByText('SortableHandle')).toBeNull());
    screen.debug(undefined, Infinity);
  });
});

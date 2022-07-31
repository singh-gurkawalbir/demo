/* global describe, test, expect, jest */
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import { MemoryRouter, Route} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore} from '../../../../../test/test-utils';
import FlowsPanel from '.';

const initialStore = reduxStore;

function initFlowsPanel(props = {}) {
  initialStore.getState().user.preferences = {
    environment: 'production',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm:ss a',
    drawerOpened: true,
    expand: 'Tools',
    scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
    showReactSneakPeekFromDate: '2019-11-05',
    showReactBetaFromDate: '2019-12-26',
    defaultAShareId: 'own',
    dashboard: {
      view: 'tile',
      tilesOrder: [
        '62be9cf14a6daf23ece8ed33',
        '62bedcdca0f5f21448171ea2',
        '6253af74cddb8a1ba550a010',
        '62beb29aa0f5f2144816f80c',
      ],
    },
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
    name: '',
    _connectionId: '5ac5e47106bd2615df9fba31',
    _integrationId: '62d826bf5645756e8300beac',
    _connectorId: '62712c1edd4afe56b5a10c3c',
    apiIdentifier: 'ec7c805b8b',
    asynchronous: true,
    http: {
      relativeURI: '/V1/products/attribute-sets/sets/list?searchCriteria[filter_groups][1][filters][0][field]=entity_type_code&searchCriteria[filter_groups][1][filters][0][value]=catalog_product&searchCriteria[filter_groups][1][filters][0][conditionType]=eq',
      method: 'GET',
      headers: [],
      successMediaType: 'json',
      errorMediaType: 'json',
      formType: 'http',
      response: {
        resourcePath: 'items',
      },
    },
    sampleData: {
      entity_type_id: 4,
      sort_order: 1,
      attribute_set_name: 'Default',
      attribute_set_id: 4,
    },
    rest: {
      relativeURI: '/V1/products/attribute-sets/sets/list?searchCriteria[filter_groups][1][filters][0][field]=entity_type_code&searchCriteria[filter_groups][1][filters][0][value]=catalog_product&searchCriteria[filter_groups][1][filters][0][conditionType]=eq',
      method: 'GET',
      headers: [],
      resourcePath: 'items',
    },
    adaptorType: 'RESTExport',
    _rest: {
      relativeURI: '/V1/products/attribute-sets/sets/list?searchCriteria[filter_groups][1][filters][0][field]=entity_type_code&searchCriteria[filter_groups][1][filters][0][value]=catalog_product&searchCriteria[filter_groups][1][filters][0][conditionType]=eq',
      method: 'GET',
      headers: [],
      resourcePath: 'items',
    },
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
    skipRetries: false,
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
    skipRetries: false,
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
    skipRetries: false,
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
    version: '1.0.0',
    tag: 'Demo',
    sandbox: false,
    _registeredConnectionIds: [],
    settingsForm: {
      init: {
        _scriptId: '62712819db631b0ec2e385b9',
        function: 'getShopifyGeneralSettings',
      },
    },
    preSave: {
      function: 'processShopifySettingSave',
      _scriptId: '62712819db631b0ec2e385b9',
    },
    update: {
      _scriptId: '62712819db631b0ec2e385b9',
      function: 'updateIntegrationApp',
    },
    installSteps: [
      {
        name: 'Configure Microsoft Dynamics 365 Business Central connection',
        description: "Click <b>Configure</b> to <a href='https://docs.celigo.com/hc/en-us/articles/360038524992-Set-up-a-connection-to-Microsoft-Dynamics-365-Business-Central' target='_blank'>set up a connection to Microsoft Dynamics 365 Business Central.</a>",
        completed: true,
        type: 'connection',
        sourceConnection: {
          type: 'http',
          name: 'Microsoft Dynamics 365 Business Central connection',
          externalId: 'msbc_connection',
          assistant: 'microsoftbusinesscentral',
          http: {
            _iClientId: '627119f0db631b0ec2e37d83',
            unencrypted: {
              apiType: 'odata',
            },
          },
        },
      },
      {
        name: 'Configure the default company',
        description: 'Select a Microsoft Dynamics 365 Business Central company to be applied when syncing all your records.',
        completed: true,
        type: 'form',
        form: {
          layout: {
            fields: [],
          },
        },
        function: 'processCompanyInput',
        initFormFunction: 'getTenantIdAndListOfCompanies',
        _scriptId: '62712819db631b0ec2e385b9',
      },
      {
        name: 'Install and verify Microsoft Dynamics 365 Business Central extension',
        description: 'Before you install the integration app, you must install the extension in the Microsoft Dynamics 365 Business Central account. Click <b>Install</b> to be redirected to the Microsoft Dynamics 365 Business Central Marketplace extension app page.',
        completed: true,
        type: 'url',
        url: 'https://docs.celigo.com/hc/en-us/articles/4428222496923-Install-and-configure-extension-fields-and-custom-OData-services',
        function: 'verifyBusinessCentralExtension',
        _scriptId: '62712819db631b0ec2e385b9',
      },
    ],
    uninstallSteps: [],
    flowGroupings: props.fg,
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
    <MemoryRouter initialEntries={[{pathname: `/integrationapps/ShopifyMicrosoftDynamics365BusinessCentral/62d826bf5645756e8300beac/flows/sections/${props.sectionId}`}]}>
      <Route
        path="/integrationapps/ShopifyMicrosoftDynamics365BusinessCentral/62d826bf5645756e8300beac/flows/sections/:sectionId"
            >
        <FlowsPanel {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/LoadResources'),
  default: props =>
    (
      props.children
    )
  ,
}));
jest.mock('../../../../MappingDrawer', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../MappingDrawer'),
  default: () =>
    (
      <div>Mapping Drawer</div>
    )
  ,
}));
jest.mock('../../../../FlowBuilder/drawers/Schedule', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../FlowBuilder/drawers/Schedule'),
  default: () =>
    (
      <div>Schedule Drawer</div>
    )
  ,
}));
jest.mock('../../../common/ErrorsList', () => ({
  __esModule: true,
  ...jest.requireActual('../../../common/ErrorsList'),
  default: () =>
    (
      <div>ErrorList Drawer</div>
    )
  ,
}));
const flowgroups = [
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
];

// '6257b33a722b313acd1df1bf'
describe('Flows Panel UI tests', () => {
  test('should render the title along with the error count and searchbar', () => {
    const props = {integrationId: '62d826bf5645756e8300beac', fg: flowgroups, sectionId: '6257b33a722b313acd1df1bf'};

    initFlowsPanel(props);
    expect(screen.getByText(/Integration flows/i)).toBeInTheDocument();
    expect(screen.getByText(/4 error/i)).toBeInTheDocument();

    const element = document.querySelector('[aria-label="search"]');

    expect(element).toBeInTheDocument();
  });
  test('should render the flow groupings in the DOM', () => {
    const props = {integrationId: '62d826bf5645756e8300beac', fg: flowgroups, sectionId: '6257b33a722b313acd1df1bf'};

    initFlowsPanel(props);
    expect(screen.getByText(/order/i)).toBeInTheDocument();
    expect(screen.getByText(/fulfillment/i)).toBeInTheDocument();
    expect(screen.getByText(/Inventory/i)).toBeInTheDocument();
  });
  test('should render the flow operations when acceccLevel is not of monitor level', () => {
    const props = {integrationId: '62d826bf5645756e8300beac', fg: flowgroups, sectionId: '6257b33a722b313acd1df1bf'};

    initFlowsPanel(props);
    expect(screen.getByText(/Create flow/i)).toBeInTheDocument();
    expect(screen.getByText(/Load data/i)).toBeInTheDocument();
    expect(screen.getByText(/More/i)).toBeInTheDocument();
  });
  test('should only display the search bar and no flow operations in case of integration apps', () => {
    const props = {integrationId: '62d826bf5645756e8300beac', fg: flowgroups, sectionId: '6257b33a722b313acd1df1bf', conn: '5357b33a722b313acd1df1bf'};

    initFlowsPanel(props);
    expect(screen.queryByText(/Create flow/i)).toBeNull();
    expect(screen.queryByText(/Load data/i)).toBeNull();
    expect(screen.queryByText(/More/i)).toBeNull();
    const element = document.querySelector('[aria-label="search"]');

    expect(element).toBeInTheDocument();
  });
  test('should display the mapping drawer when clicked on edit mapping icon', () => {
    const props = {integrationId: '62d826bf5645756e8300beac', fg: flowgroups, sectionId: '6257b33a722b313acd1df1bf', conn: '5357b33a722b313acd1df1bf'};

    initFlowsPanel(props);
    const element = document.querySelector('[title="Edit mappings"]');

    userEvent.click(element);
    expect(screen.getByText('Mapping Drawer')).toBeInTheDocument();       // mocked component//
  });
  test('should display the schedule drawer when clicked on edit mapping icon', () => {
    const props = {integrationId: '62d826bf5645756e8300beac', fg: flowgroups, sectionId: '6257b33a722b313acd1df1bf', conn: '5357b33a722b313acd1df1bf'};

    initFlowsPanel(props);
    const element = document.querySelector('[title="Configure all steps to allow scheduling your flow"]');

    userEvent.click(element);
    expect(screen.getByText('Schedule Drawer')).toBeInTheDocument();       // mocked component//
  });
  test('should display the errorList drawer when clicked on the number of errors', () => {
    const props = {integrationId: '62d826bf5645756e8300beac', fg: flowgroups, sectionId: '6257b33a722b313acd1df1bf', conn: '5357b33a722b313acd1df1bf'};

    initFlowsPanel(props);
    userEvent.click(screen.getByText(/4 errors/i));
    expect(screen.getByText('ErrorList Drawer')).toBeInTheDocument();       // mocked component//
  });
  test('should display the predefined unassigned flowgrouping when flowGroupingId is not present in any of the flows', () => {
    const props = {integrationId: '62d826bf5645756e8300beac', fg: flowgroups, sectionId: '6257b33a722b313acd1df1bf', conn: '5357b33a722b313acd1df1bf'};

    initFlowsPanel(props);
    expect(screen.getByText(/Unassigned/i)).toBeInTheDocument();
  });
  test('should display different flows when clicked on different flow grouping', () => {
    const props = {integrationId: '62d826bf5645756e8300beac', fg: flowgroups, sectionId: '6257b33a722b313acd1df1bf', conn: '5357b33a722b313acd1df1bf'};

    initFlowsPanel(props);
    expect(screen.getByText('flow1')).toBeInTheDocument();
    userEvent.click(screen.getByText('Unassigned'));
    expect(screen.getByText('flow3')).toBeInTheDocument();
    expect(screen.queryByText('flow1')).toBeNull();    // only flows of respective flowgrouping have to be displayed //
  });
  test('should display the flows that match with the keyword in the searchbar', async () => {
    const props = {integrationId: '62d826bf5645756e8300beac', fg: flowgroups, sectionId: '6257b33a722b313acd1df1bf'};

    initFlowsPanel(props);
    const element = document.querySelector('[aria-label="search"]');

    userEvent.click(element);
    userEvent.type(element, 'senorita');
    await waitFor(() => expect(screen.getByText('Your search didn’t return any matching results. Try expanding your search criteria.')).toBeInTheDocument());
    screen.debug(undefined, Infinity);
  });
  test('should display the flows that match the keywords in the searchbar', async () => {
    const props = {integrationId: '62d826bf5645756e8300beac', fg: flowgroups, sectionId: '6257b33a722b313acd1df1bf'};

    initFlowsPanel(props);
    const element = document.querySelector('[aria-label="search"]');

    userEvent.clear(element);
    userEvent.click(element);
    userEvent.type(element, 'flow');
    await waitFor(() => expect(screen.getByText('Showing all flow groups that contain search matches.')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('flow1')).toBeInTheDocument());
  });
  test('bhardo jholi', () => {
    const props = {integrationId: '62d826bf5645756e8300bead', sectionId: undefined};

    initFlowsPanel(props);
    screen.debug(undefined, Infinity);
  });
});

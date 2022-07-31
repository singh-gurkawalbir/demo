/* global describe, test, expect, jest */
import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter, Route} from 'react-router-dom';
import {renderWithProviders, reduxStore} from '../../../../../../test/test-utils';
import FlowGroupRow from '.';

const initialStore = reduxStore;

// eslint-disable-next-line no-unused-vars
function initFlowGroupRow(props = {}) {
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
  }];
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
    <MemoryRouter initialEntries={[{pathname: '/integrationapps/ShopifyMicrosoftDynamics365BusinessCentral/62d826bf5645756e8300beac/flows/sections/unassigned'}]}>
      <Route
        path="/integrationapps/ShopifyMicrosoftDynamics365BusinessCentral/62d826bf5645756e8300beac/flows/sections/:sectionId"
            >
        <FlowGroupRow {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('../../../../common/FlowSectionTitle', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../common/FlowSectionTitle'),
  default: () =>
    (
      <div>FlowSection Title</div>
    )
  ,
}));
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
  //   test('wbiwbfe', () => {
  //     const props = {rowData: {sectionId: 'unassigned'}, flows: []};

//     initFlowGroupRow(props);
//     userEvent.hover(screen.getByText('FlowSection title'));
//     expect(screen.getByText('SortableHandle')).toBeInTheDocument();
//     screen.debug(undefined, Infinity);
//   });
});

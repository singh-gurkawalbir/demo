/* global describe, test, expect, jest, afterEach, beforeEach */
import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, waitFor, cleanup, waitForElementToBeRemoved } from '@testing-library/react';
import * as reactRedux from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore } from '../../test/test-utils';
import MappingDrawerRoute from '.';
import { runServer } from '../../test/api/server';
import actions from '../../actions';

const initialStore = reduxStore;

initialStore.getState().data.resources.integrations = [{
  _id: '60e2efb81797d0701d813755',
  lastModified: '2021-07-09T13:36:01.738Z',
  name: 'Test Integration',
  install: [],
  sandbox: false,
  _registeredConnectionIds: [
    '5d529bfbdb0c7b14a6011a55',
    '5d70b2d8b0cc4065d0982c55',
  ],
  installSteps: [],
  uninstallSteps: [],
  flowGroupings: [],
  createdAt: '2021-07-05T11:40:40.494Z',
}];
initialStore.getState().data.resources.flows = [[
  {
    _id: '60e8509f7d1015493bcabf55',
    lastModified: '2021-07-09T13:43:25.939Z',
    name: 'Test Flow 1 to Test Flow 2',
    disabled: true,
    _integrationId: '60e2efb81797d0701d813755',
    skipRetries: false,
    pageProcessors: [
      {
        responseMapping: {
          fields: [],
          lists: [],
        },
        type: 'import',
        _importId: '5fe2f66953d36d03e6210255',
      },
    ],
    pageGenerators: [
      {
        _exportId: '601ab2f54f118265bb62ae55',
      },
    ],
    createdAt: '2021-07-09T13:35:27.628Z',
    lastExecutedAt: '2021-07-09T13:42:34.410Z',
  },
]];
initialStore.getState().data.resources.exports = [{
  _id: '601ab2f54f118265bb62ae55',
  createdAt: '2021-02-03T14:28:05.875Z',
  lastModified: '2022-03-15T20:27:19.411Z',
  name: 'Test Export',
  _connectionId: '5d529bfbdb0c7b14a6011a55',
  apiIdentifier: 'eeff33bdbb',
  asynchronous: true,
  sampleData: {
    id: 922,
    company: 'Company B',
    first_name: 'demo1',
    last_name: 'customer654585',
    email: 'demo1customer654585@example.com',
    phone: '',
    form_fields: [
      {
        name: 'Order placed by:',
        value: null,
      },
    ],
    date_created: 'Tue, 02 Apr 2019 14:17:53 +0000',
    date_modified: 'Wed, 09 Mar 2022 10:21:14 +0000',
    store_credit: '10.0000',
    registration_ip_address: '',
    customer_group_id: 42,
    notes: '',
    tax_exempt_category: '',
    reset_pass_on_login: false,
    accepts_marketing: false,
    addresses: {
      url: 'https://api.bigcommerce.com/stores/3re2gdo/v2/customers/922/addresses',
      resource: '/customers/922/addresses',
    },
  },
  ftp: {
    directoryPath: '/ChaitanyaReddyMule',
    fileNameStartsWith: 'test_json',
  },
  file: {
    output: 'records',
    skipDelete: true,
    type: 'json',
  },
  adaptorType: 'FTPExport',
}];
initialStore.getState().data.resources.imports = [{
  _id: '5fe2f66953d36d03e6210255',
  createdAt: '2020-12-23T07:48:57.517Z',
  lastModified: '2021-07-09T13:39:33.448Z',
  name: 'Test Import',
  _connectionId: '5d70b2d8b0cc4065d0982c55',
  distributed: false,
  apiIdentifier: 'i896cc4c89',
  assistant: 'acumatica',
  sandbox: false,
  assistantMetadata: {
    resource: 'payment',
    version: 'v18.200.001',
    operation: 'create_update_payment',
    lookups: {},
  },
  mapping: {
    fields: [
      {
        generate: 'Type.value',
        hardCodedValue: 'test',
      },
      {
        extract: '0',
        generate: 'CustomerID.value',
      },
      {
        extract: 'amount',
        generate: 'CashAccount.value',
      },
      {
        extract: 'automatic',
        generate: 'PaymentAmount.value',
      },
    ],
  },
  http: {
    relativeURI: [
      '/Payment',
    ],
    method: [
      'PUT',
    ],
    body: [
      null,
    ],
    batchSize: 1,
    requestMediaType: 'json',
    successMediaType: 'json',
    errorMediaType: 'json',
    strictHandlebarEvaluation: true,
    sendPostMappedData: true,
    formType: 'assistant',
    response: {
      resourceIdPath: [
        null,
      ],
    },
  },
  rest: {
    relativeURI: [
      '/Payment',
    ],
    method: [
      'PUT',
    ],
    body: [
      null,
    ],
    responseIdPath: [
      null,
    ],
    successPath: [
      null,
    ],
    successValues: [
      null,
    ],
  },
  adaptorType: 'RESTImport',
}];
initialStore.getState().data.resources.connections = [{
  _id: '5d529bfbdb0c7b14a6011a55',
  createdAt: '2019-08-13T11:16:11.951Z',
  lastModified: '2022-06-24T11:44:40.123Z',
  type: 'ftp',
  name: 'Test Connection 1',
  offline: true,
  debugDate: '2021-02-08T12:50:45.678Z',
  sandbox: false,
  ftp: {
    type: 'sftp',
    hostURI: 'celigo.files.com',
    username: 'chaitanyareddy.mule@celigo.com',
    password: '******',
    port: 22,
    usePassiveMode: true,
    userDirectoryIsRoot: false,
    useImplicitFtps: true,
    requireSocketReUse: false,
  },
  queues: [
    {
      name: '5d529bfbdb0c7b14a6011a57',
      size: 0,
    },
  ],
},
{
  _id: '5d70b2d8b0cc4065d0982c55',
  createdAt: '2019-09-05T07:01:44.098Z',
  lastModified: '2022-02-06T08:11:14.170Z',
  type: 'rest',
  name: 'Test Connection 2',
  assistant: 'acumatica',
  offline: true,
  _integrationId: '5f8f000a6eb5c6461949c155',
  debugDate: '2021-07-09T14:41:48.688Z',
  sandbox: false,
  debugUntil: '2021-07-09T14:41:48.688Z',
  isHTTP: false,
  http: {
    formType: 'assistant',
    mediaType: 'json',
    requestMediaType: 'xml',
    baseURI: 'https://6d5eff63dc32.ngrok.io/acumaticadb2020r2/entity/Default/20.200.001',
    concurrencyLevel: 1,
    ping: {
      relativeURI: '/FinancialPeriod',
      method: 'GET',
      successValues: [],
      failValues: [],
    },
    headers: [
      {
        name: 'content-type',
        value: 'application/json',
      },
    ],
    unencrypted: {
      endpointName: 'Default',
      endpointVersion: '20.200.001',
      username: 'admin',
      company: '',
    },
    encrypted: '******',
    encryptedFields: [],
    auth: {
      type: 'cookie',
      oauth: {
        scope: [],
      },
      token: {
        refreshHeaders: [],
      },
      cookie: {
        uri: 'https://6d5eff63dc32.ngrok.io/acumaticadb2020r2/entity/auth/login',
        body: '{"name": "admin","password": "admin","company": ""}',
        method: 'POST',
        successStatusCode: 204,
      },
    },
  },
  rest: {
    baseURI: 'https://6d5eff63dc32.ngrok.io/acumaticadb2020r2/entity/Default/20.200.001',
    isHTTPProxy: false,
    mediaType: 'json',
    authType: 'cookie',
    headers: [
      {
        name: 'content-type',
        value: 'application/json',
      },
    ],
    encrypted: '******',
    encryptedFields: [],
    unencrypted: {
      endpointName: 'Default',
      endpointVersion: '20.200.001',
      username: 'admin',
      company: '',
    },
    unencryptedFields: [],
    scope: [],
    pingRelativeURI: '/FinancialPeriod',
    pingSuccessValues: [],
    pingFailureValues: [],
    pingMethod: 'GET',
    concurrencyLevel: 1,
    refreshTokenHeaders: [],
    cookieAuth: {
      uri: 'https://6d5eff63dc32.ngrok.io/acumaticadb2020r2/entity/auth/login',
      body: '******',
      method: 'POST',
      successStatusCode: 204,
    },
  },
  queues: [
    {
      name: '5d70b2d8b0cc4065d0982cca',
      size: 0,
    },
  ],
}];
initialStore.getState().session.mapping.mapping = {
  mappings: [
    {
      generate: 'Type.value',
      hardCodedValue: 'test',
      isRequired: true,
      key: 'vS6-ynPit',
    },
    {
      extract: '0',
      generate: 'CustomerID.value',
      isRequired: true,
      key: 'o3n59YkmOg',
    },
    {
      extract: 'amount',
      generate: 'CashAccount.value',
      isRequired: true,
      key: 'dLTt6FeqL6',
    },
    {
      extract: 'automatic',
      generate: 'PaymentAmount.value',
      isRequired: true,
      key: 'Ox-3XikhBO',
    },
  ],
  lookups: [],
  v2TreeData: [
    {
      key: 'ml-gFzRkzBkLtLpXcnt5I',
      isEmptyRow: true,
      title: '',
      disabled: false,
      dataType: 'string',
    },
  ],
  expandedKeys: [],
  flowId: '60e8509f7d1015493bcabf55',
  importId: '5fe2f66953d36d03e6210255',
  status: 'received',
  isGroupedSampleData: false,
  isMonitorLevelAccess: false,
  version: 1,
  requiredMappings: [
    'Type.value',
    'CustomerID.value',
    'CashAccount.value',
    'PaymentAmount.value',
  ],
  extractsTree: [
    {
      key: '2L_Ijack97CTTerpctcgY',
      title: '',
      dataType: 'object',
      propName: '$',
      children: [
        {
          key: 'blp9dNh9tQVCJw7dv9zIO',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'id',
          propName: 'id',
          dataType: 'number',
        },
        {
          key: 'j9aetmZWQVawkaVO0Vfu0',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'company',
          propName: 'company',
          dataType: 'string',
        },
        {
          key: 'cYDm8jpifeLFpzQS-xYbX',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'first_name',
          propName: 'first_name',
          dataType: 'string',
        },
        {
          key: 'I9VheVF4Yih6_170wNNKp',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'last_name',
          propName: 'last_name',
          dataType: 'string',
        },
        {
          key: 's_2Laun4pE0Bj3DhPxekH',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'email',
          propName: 'email',
          dataType: 'string',
        },
        {
          key: 'LRzmiovwCCxVkccnMH9Gj',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'phone',
          propName: 'phone',
          dataType: 'string',
        },
        {
          key: '7abhb3qP7n-ua_SNW6uBB',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'form_fields[*]',
          propName: 'form_fields',
          dataType: '[object]',
          children: [
            {
              key: 'TDx-k_nPDGaZ0wHlf_YUe',
              parentKey: '7abhb3qP7n-ua_SNW6uBB',
              title: '',
              jsonPath: 'form_fields[*].name',
              propName: 'name',
              dataType: 'string',
            },
            {
              key: 'xOHQvwM2KMomrmmz9H1M0',
              parentKey: '7abhb3qP7n-ua_SNW6uBB',
              title: '',
              jsonPath: 'form_fields[*].value',
              propName: 'value',
              dataType: 'string',
            },
          ],
        },
        {
          key: 'zMBikoNSFYShGxt0AU3VT',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'date_created',
          propName: 'date_created',
          dataType: 'string',
        },
        {
          key: 'TlM_D7cABdQMhg4FcyC8J',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'date_modified',
          propName: 'date_modified',
          dataType: 'string',
        },
        {
          key: '0wpmNF5m1--cyiClVnvbn',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'store_credit',
          propName: 'store_credit',
          dataType: 'string',
        },
        {
          key: 'oo3wrSSC7p22ac9tiyohj',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'registration_ip_address',
          propName: 'registration_ip_address',
          dataType: 'string',
        },
        {
          key: 'DfiQLUAyEXQEhf7rJVD9m',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'customer_group_id',
          propName: 'customer_group_id',
          dataType: 'number',
        },
        {
          key: 'AYsyoIsEgUg2VMWkqV0W-',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'notes',
          propName: 'notes',
          dataType: 'string',
        },
        {
          key: '3gTbH0iXvK63YAtNgFOmh',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'tax_exempt_category',
          propName: 'tax_exempt_category',
          dataType: 'string',
        },
        {
          key: 'meRS_TbHd0CFRSlW-49rU',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'reset_pass_on_login',
          propName: 'reset_pass_on_login',
          dataType: 'boolean',
        },
        {
          key: 'i1fRDv6OjH4OLLRbD7vA8',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'accepts_marketing',
          propName: 'accepts_marketing',
          dataType: 'boolean',
        },
        {
          key: 'SOtWuPGqGvG3RO9HwUgCp',
          parentKey: '2L_Ijack97CTTerpctcgY',
          title: '',
          jsonPath: 'addresses',
          propName: 'addresses',
          dataType: 'object',
          children: [
            {
              key: 'pPp_Jlvnv_uOEWZs3Gwof',
              parentKey: 'SOtWuPGqGvG3RO9HwUgCp',
              title: '',
              jsonPath: 'addresses.url',
              propName: 'url',
              dataType: 'string',
            },
            {
              key: '4z93d9RWTqvAzJfYasE7F',
              parentKey: 'SOtWuPGqGvG3RO9HwUgCp',
              title: '',
              jsonPath: 'addresses.resource',
              propName: 'resource',
              dataType: 'string',
            },
          ],
        },
      ],
    },
  ],
  importSampleData: {
    id: 'b2d1e4b8-1a6c-4acb-8f00-4aad2a0713f0',
    rowNumber: 1,
    note: '',
    ApplicationDate: {
      value: '2014-03-28T00:00:00+00:00',
    },
    AppliedToDocuments: {
      value: 0,
    },
    CardAccountNbr: {
      value: 'USD',
    },
    CashAccount: {
      value: '10200',
    },
    CurrencyID: {
      value: 'USD',
    },
    CustomerID: {
      value: 'JOHNGOOD',
    },
    Description: {
      value: 'USD',
    },
    Hold: {
      value: false,
    },
    PaymentAmount: {
      value: 0,
    },
    PaymentMethod: {
      value: 'CHECK',
    },
    PaymentRef: {
      value: 'PMT00183',
    },
    ApplicationHistory: [
      {
        AdjustingDocType: {
          value: 76.24,
        },
        AdjustingRefNbr: {
          value: 0,
        },
        AdjustingNbr: {
          value: 0,
        },
        AdjustsVAT: {
          value: 0,
        },
        AmountPaid: {
          value: 'Prepayment',
        },
        ApplicationPeriod: {
          value: '001715',
        },
        Balance: {
          value: 'BALWOFF',
        },
        BatchNbr: {
          value: '001715',
        },
        BalanceWriteOff: {
          value: 'BALWOFF',
        },
        CashDiscountBalance: {
          value: 'BALWOFF',
        },
        CashDiscountDate: {
          value: '001715',
        },
        CashDiscountTaken: {
          value: 'BALWOFF',
        },
        CurrencyID: {
          value: 'BALWOFF',
        },
        Customer: {
          value: '001715',
        },
        CustomerOrder: {
          value: 'BALWOFF',
        },
        Date: {
          value: 'BALWOFF',
        },
        Description: {
          value: '001715',
        },
        AdjustedRefNbr: {
          value: 'BALWOFF',
        },
        DisplayRefNbr: {
          value: 'BALWOFF',
        },
        VATCreditMemo: {
          value: 'BALWOFF',
        },
        custom: {},
        files: [],
      },
    ],
    DocumentsToApply: [
      {
        id: '2fc8a12b-dd6b-4bac-a8a4-e031f50a2a71',
        rowNumber: 1,
        note: '',
        AmountPaid: {
          value: 76.24,
        },
        BalanceWriteOff: {
          value: 0,
        },
        CustomerOrder: {
          value: 0,
        },
        Description: {
          value: 0,
        },
        DocType: {
          value: 'Prepayment',
        },
        ReferenceNbr: {
          value: '001715',
        },
        WriteOffReasonCode: {
          value: 'BALWOFF',
        },
        custom: {},
        files: [],
      },
    ],
    OrdersToApply: [
      {
        AppliedToOrder: {
          value: 'BALWOFF',
        },
        OrderNbr: {
          value: 'BALWOFF',
        },
        OrderType: {
          value: 'BALWOFF',
        },
      },
    ],
    CreditCardProcessingInfo: [
      {
        TransactionAmount: {
          value: 'BALWOFF',
        },
        TransactionStatus: {
          value: 'BALWOFF',
        },
      },
    ],
    ReferenceNbr: {
      value: '000404',
    },
    Status: {
      value: 'Balanced',
    },
    Type: {
      value: 'Payment',
    },
    custom: {
      value: 'USD',
    },
    files: [],
  },
  isGroupedOutput: false,
  mappingsCopy: [
    {
      generate: 'Type.value',
      hardCodedValue: 'test',
      isRequired: true,
      key: 'vS6-ynPit',
    },
    {
      extract: '0',
      generate: 'CustomerID.value',
      isRequired: true,
      key: 'o3n59YkmOg',
    },
    {
      extract: 'amount',
      generate: 'CashAccount.value',
      isRequired: true,
      key: 'dLTt6FeqL6',
    },
    {
      extract: 'automatic',
      generate: 'PaymentAmount.value',
      isRequired: true,
      key: 'Ox-3XikhBO',
    },
  ],
  lookupsCopy: [],
  v2TreeDataCopy: [
    {
      key: 'ml-gFzRkzBkLtLpXcnt5I',
      isEmptyRow: true,
      title: '',
      disabled: false,
      dataType: 'string',
    },
  ],
};

async function initMappingDrawerRoute(props) {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/integrations/60e2efb81797d0701d813755/flows/mapping/60e8509f7d1015493bcabf55/5fe2f66953d36d03e6210255/view/editor/mappings-5fe2f66953d36d03e6210255'}]}>
      <Route
        path="/integrations/:integrationId/flows"
        >
        <MappingDrawerRoute {...props} />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

jest.mock('../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/LoadResources'),
  default: newprops => (
    <div>{newprops.children}</div>
  ),
}
));

const mockHistoryBack = jest.fn();
const mockHistoryReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryBack,
    replace: mockHistoryReplace,
  }),
}));
describe('Mapping Drawer', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    cleanup();
  });

  test('Should be able to test the toggle button Mapping Drawer and verifying the link for Lear about Mapper 2.0 and verify the auto preview checkbox', async () => {
    const props = {
      integrationId: '60e2efb81797d0701d813755',
    };

    await initMappingDrawerRoute(props);
    const editMappingHeadingTextNode = screen.getByRole('heading', {name: 'Edit mapping: Test Import'});

    expect(editMappingHeadingTextNode).toBeInTheDocument();
    const mapper1ButtonNode = screen.getByRole('button', {name: 'Mapper 1.0'});

    expect(mapper1ButtonNode).toBeInTheDocument();
    userEvent.click(mapper1ButtonNode);
    const mapper2ButtonNode = screen.getByRole('button', {name: 'Mapper 2.0 BETA'});

    expect(mapper2ButtonNode).toBeInTheDocument();
    userEvent.click(mapper2ButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.toggleVersion(2));
    userEvent.click(mapper1ButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.toggleVersion(1));
    const learnAboutMapper2LinkNode = screen.getByRole('link', {name: 'Learn about Mapper 2.0'});

    expect(learnAboutMapper2LinkNode.closest('a')).toHaveAttribute('href', 'https://docs.celigo.com/hc/en-us/articles/4536629083035-Mapper-2-0');
    const autoPreviewCheckBoxNode = screen.getByRole('checkbox', {name: 'Auto preview'});

    userEvent.click(autoPreviewCheckBoxNode);
    expect(autoPreviewCheckBoxNode).toBeChecked();

    userEvent.click(autoPreviewCheckBoxNode);

    expect(autoPreviewCheckBoxNode).not.toBeChecked();
  });
  test('Should be able to test the preview button', async () => {
    const props = {
      integrationId: '60e2efb81797d0701d813755',
    };

    await initMappingDrawerRoute(props);
    const previewButtonNode = screen.getByRole('button', {name: 'Preview'});

    expect(previewButtonNode).toBeInTheDocument();
    userEvent.click(previewButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.previewRequest('mappings-5fe2f66953d36d03e6210255'));
  });
  test('Should be able to test the list box', async () => {
    const props = {
      integrationId: '60e2efb81797d0701d813755',
    };

    await initMappingDrawerRoute(props);
    const toggleLayoutNode = document.querySelectorAll('div[id="toggle-layout"]');

    expect(toggleLayoutNode[0]).toBeInTheDocument();
    userEvent.click(toggleLayoutNode[0]);
    const listBoxNode = document.querySelectorAll('ul[aria-labelledby="toggle-layout-label"]');

    expect(listBoxNode[0]).toBeInTheDocument();
    const listItem1Node = document.querySelectorAll('li[data-value="compact2"]');

    expect(listItem1Node[0]).toBeInTheDocument();
    const listItem2Node = document.querySelectorAll('li[data-value="compactRow"]');

    expect(listItem2Node[0]).toBeInTheDocument();
    userEvent.click(listItem1Node[0]);
    await waitForElementToBeRemoved(listItem1Node[0]);
  });
  test('Should be able to test the cancel drawer button', async () => {
    const props = {
      integrationId: '60e2efb81797d0701d813755',
    };

    await initMappingDrawerRoute(props);
    const rules = screen.getByText('Rules');

    expect(rules).toBeInTheDocument();
    const input = screen.getByText('Input');

    expect(input).toBeInTheDocument();
    const output = screen.getByText('Output');

    expect(output).toBeInTheDocument();
    const closeButton1Node = screen.getAllByRole('button', {name: 'Close'});

    expect(closeButton1Node[0]).toBeInTheDocument();
    userEvent.click(closeButton1Node[0]);
  });
  test('Should be able to test the close button', async () => {
    const props = {
      integrationId: '60e2efb81797d0701d813755',
    };

    await initMappingDrawerRoute(props);
    const closeButtonNode = document.querySelectorAll('button[data-test="cancel"]');

    expect(closeButtonNode[0]).toBeInTheDocument();
    userEvent.click(closeButtonNode[0]);
    await waitFor(() => expect(closeButtonNode[0]).not.toBeInTheDocument());

    expect(mockHistoryBack).toHaveBeenCalledTimes(1);
  });
});

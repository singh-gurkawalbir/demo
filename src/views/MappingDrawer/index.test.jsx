
import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, waitFor, cleanup, waitForElementToBeRemoved, fireEvent } from '@testing-library/react';
import * as reactRedux from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import MappingDrawerRoute from '.';
import { runServer } from '../../test/api/server';
import actions from '../../actions';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.resources.integrations = [{
    _id: '60e2efb81797d0701d813755',
    lastModified: '2021-07-09T13:36:01.738Z',
    name: 'Test Integration',
    sandbox: false,
    _registeredConnectionIds: [
      '5d529bfbdb0c7b14a6011a55',
      '5d70b2d8b0cc4065d0982c55',
    ],
  }];
  draft.data.resources.flows = [[
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
  draft.data.resources.exports = [{
    _id: '601ab2f54f118265bb62ae55',
    name: 'Test Export',
    sampleData: {
      amount: '10',
      automatic: true,
    },
    ftp: {
      directoryPath: '/ChaitanyaReddyMule',
      fileNameStartsWith: 'test_json',
    },
    adaptorType: 'FTPExport',
  }];
  draft.data.resources.imports = [{
    _id: '5fe2f66953d36d03e6210255',
    name: 'Test Import',
    _connectionId: '5d70b2d8b0cc4065d0982c55',
    assistant: 'acumatica',
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
    adaptorType: 'RESTImport',
  }];
  draft.data.resources.connections = [{
    _id: '5d529bfbdb0c7b14a6011a55',
    type: 'ftp',
    name: 'Test Connection 1',
    offline: true,
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
  },
  {
    _id: '5d70b2d8b0cc4065d0982c55',
    type: 'rest',
    name: 'Test Connection 2',
    assistant: 'acumatica',
    offline: true,
    _integrationId: '5f8f000a6eb5c6461949c155',
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
  }];
  draft.session.mapping.mapping = {
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
    importSampleData: {
      CashAccount: {
        value: '10200',
      },
      CustomerID: {
        value: 'JOHNGOOD',
      },
      PaymentAmount: {
        value: 0,
      },
      Type: {
        value: 'Payment',
      },
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
  };
});

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
    await userEvent.click(mapper1ButtonNode);
    const mapper2ButtonNode = screen.getByRole('button', {name: 'Mapper 2.0'});

    expect(mapper2ButtonNode).toBeInTheDocument();
    await userEvent.click(mapper2ButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.toggleVersion(2));
    await userEvent.click(mapper1ButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.toggleVersion(1));
    const learnAboutMapper2LinkNode = screen.getByRole('link', {name: 'Learn about Mapper 2.0'});

    expect(learnAboutMapper2LinkNode.closest('a')).toHaveAttribute('href', 'https://docs.celigo.com/hc/en-us/articles/4536629083035-Mapper-2-0');
    const autoPreviewCheckBoxNode = screen.getByRole('checkbox', {name: 'Auto preview'});

    await userEvent.click(autoPreviewCheckBoxNode);
    expect(autoPreviewCheckBoxNode).toBeChecked();

    await userEvent.click(autoPreviewCheckBoxNode);

    expect(autoPreviewCheckBoxNode).not.toBeChecked();
  });
  test('Should be able to test the preview button', async () => {
    const props = {
      integrationId: '60e2efb81797d0701d813755',
    };

    await initMappingDrawerRoute(props);
    const previewButtonNode = screen.getByRole('button', {name: 'Preview'});

    expect(previewButtonNode).toBeInTheDocument();
    await userEvent.click(previewButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.previewRequest('mappings-5fe2f66953d36d03e6210255'));
  });
  test('Should be able to test the list box', async () => {
    const props = {
      integrationId: '60e2efb81797d0701d813755',
    };

    await initMappingDrawerRoute(props);
    const toggleLayoutNode = document.querySelectorAll('div[id="toggle-layout"]');

    expect(toggleLayoutNode[0]).toBeInTheDocument();
    await userEvent.click(toggleLayoutNode[0]);
    const listBoxNode = document.querySelectorAll('ul[aria-labelledby="toggle-layout-label"]');

    expect(listBoxNode[0]).toBeInTheDocument();
    const listItem1Node = document.querySelectorAll('li[data-value="compact2"]');

    expect(listItem1Node[0]).toBeInTheDocument();
    const listItem2Node = document.querySelectorAll('li[data-value="compactRow"]');

    expect(listItem2Node[0]).toBeInTheDocument();
    await fireEvent.click(listItem1Node[0]);
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
    const closeButton1Node = document.querySelector('button[data-test="closeRightDrawer"]');

    expect(closeButton1Node).toBeInTheDocument();
    await userEvent.click(closeButton1Node);
  });
  test('Should be able to test the close button', async () => {
    const props = {
      integrationId: '60e2efb81797d0701d813755',
    };

    await initMappingDrawerRoute(props);
    const closeButtonNode = document.querySelectorAll('button[data-test="cancel"]');

    expect(closeButtonNode[0]).toBeInTheDocument();
    await userEvent.click(closeButtonNode[0]);
    await waitFor(() => expect(closeButtonNode[0]).not.toBeInTheDocument());

    expect(mockHistoryBack).toHaveBeenCalledTimes(1);
  });
});

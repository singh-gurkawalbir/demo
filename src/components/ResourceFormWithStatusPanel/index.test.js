
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { renderWithProviders, mutateStore } from '../../test/test-utils';
import ResourceFormWithStatusPanel from '.';
import actions from '../../actions';
import {getCreatedStore} from '../../store';

jest.mock('react-resize-detector', () => ({onResize}) => {
  onResize(1, 2);

  return (<></>);
});

const imports = [{
  _id: '60e6f88e3499084a68917986',
  createdAt: '2021-07-08T13:07:27.001Z',
  lastModified: '2021-07-08T13:07:27.434Z',
  name: 'Post order refunds to Shopify',
  parsers: [],
  _connectionId: '5e7068331c056a75e6df19b2',
  _integrationId: '60e6f83f3499084a689178cc',
  _connectorId: '5656f5e3bebf89c03f5dd77e',
  externalId: 'shopify_refund_import_adaptor',
  distributed: false,
  apiIdentifier: 'i063b7d580',
  lookups: [],
  adaptorType: 'RESTImport',
},
{
  _id: '5f2d839ff238932d6c7593f6',
  createdAt: '2020-08-07T16:38:55.677Z',
  lastModified: '2021-08-02T08:15:14.643Z',
  name: 'ADP Payroll To NetSuite Journal Entry Add Import',
  parsers: [],
  _connectionId: '5f2d82549b82dc2956e783e7',
  _integrationId: '5f2d8254f238932d6c7593cc',
  _connectorId: '570222ce6c99305e0beff026',
  distributed: true,
  apiIdentifier: 'if72a025ab',
  ignoreExisting: true,
  lookups: [],
  adaptorType: 'NetSuiteDistributedImport',
},
];

const exports = [
  {
    _id: '5e74798ec2c20f66f05cd370',
    createdAt: '2020-03-20T08:06:38.855Z',
    lastModified: '2021-03-02T12:33:04.541Z',
    name: 'Bank File to NetSuite [BAI2 - Check - 66666] Export',
    _connectionId: '5e7068331c056a75e6df19b2',
    _connectorId: '57c8199e8489cc1a298cc6ea',
    externalId: 'bank_file_to_netsuite_bai2_check_export',
    apiIdentifier: 'e2a86ad402',
    asynchronous: true,
    type: 'simple',
    pageSize: 5000000,
    hooks: {
      preSavePage: {
        function: 'bankPreSavePageFunction',
      },
    },
    sampleData: {
      Key: null,
    },
    file: {
      encoding: 'utf8',
      skipDelete: false,
      type: 'csv',
      csv: {
        columnDelimiter: '#@&^#',
        rowDelimiter: '\r\n',
        hasHeaderRow: false,
      },
    },
    adaptorType: 'SimpleExport',
  },
  {
    _id: '52a196ce1bf5be58603a5417',
    createdAt: '2022-06-12T20:08:25.708Z',
    lastModified: '2022-06-12T20:08:25.773Z',
    name: 'random',
    _connectionId: '629f0d8accb94d35de6f4363',
    apiIdentifier: 'e1c8c7aa8c',
    asynchronous: true,
    sandbox: false,
    parsers: [],
    sampleData: 'ISA*02',
    ftp: {
      directoryPath: '/',
    },
    file: {
      output: 'records',
      skipDelete: false,
      type: 'filedefinition',
      fileDefinition: {
        _fileDefinitionId: '62a647b86e4b5b50f5560578',
      },
      xlsx: {
        keyColumns: ['1', '2'],
      },
    },
    adaptorType: '',
  },
];

const connections = [
  {
    _id: '5e2557e8305adc5f80b6910e',
    createdAt: '2020-01-20T07:34:00.566Z',
    lastModified: '2020-01-23T00:33:08.959Z',
    type: 'rest',
    name: '3dcart',
    assistant: '3dcart',
    offline: false,
    sandbox: false,
    isHTTP: false,
  },
  {
    _id: '5e7068331c056a75e6df19b2',
    createdAt: '2020-03-17T06:03:31.798Z',
    lastModified: '2020-03-19T23:47:55.181Z',
    type: 'rest',
    name: '3D Cart Staging delete',
    assistant: '3dcart',
    offline: true,
    sandbox: false,
    isHTTP: true,
  },
];

describe('resourceFormWithStatusPanel UI test', () => {
  async function readyStore() {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.imports = imports;
      draft.data.resources.exports = exports;
      draft.data.resources.connections = connections;
    });

    return {store: initialStore};
  }

  function renderWithStoreAsndProps(initialStore, props) {
    renderWithProviders(
      <MemoryRouter>
        <ResourceFormWithStatusPanel {...props} />
      </MemoryRouter>, {initialStore}
    );
  }
  test('should test for offline connection', async () => {
    const {store} = await readyStore();
    const props = {
      className: 'makeStyles-resourceFormWrapper-250',
      flowId: undefined,
      isFlowBuilderView: false,
      isNew: false,
      resourceType: 'connections',
      resourceId: '5e7068331c056a75e6df19b2',
      formKey: 'connections-5e7068331c056a75e6df19b2',
      variant: 'edit',
    };

    renderWithStoreAsndProps(store, props);
    const message = screen.queryByText('This connection is currently offline. Re-enter your credentials to bring it back online.');

    expect(message).toBeInTheDocument();
  });
  test('should test for online connection', async () => {
    const {store} = await readyStore();
    const props = {
      className: 'makeStyles-resourceFormWrapper-250',
      flowId: undefined,
      isFlowBuilderView: false,
      isNew: false,
      resourceType: 'connections',
      resourceId: '5e2557e8305adc5f80b6910e',
      formKey: 'connections-5e2557e8305adc5f80b6910e',
      variant: 'edit',
    };

    renderWithStoreAsndProps(store, props);
    const message = screen.queryByText('This connection is currently offline. Re-enter your credentials to bring it back online.');

    expect(message).not.toBeInTheDocument();
  });
  test('should test for depricated export', async () => {
    const {store} = await readyStore();
    const props = {
      className: 'makeStyles-resourceFormWrapper-250',
      flowId: undefined,
      isFlowBuilderView: false,
      isNew: false,
      resourceType: 'exports',
      resourceId: '52a196ce1bf5be58603a5417',
      formKey: 'exports-52a196ce1bf5be58603a5417',
      variant: 'edit',
    };

    renderWithStoreAsndProps(store, props);
    const message = screen.getByText('Learn more');

    expect(message).toBeInTheDocument();
    expect(message).toHaveAttribute('href',
      'https://docs.celigo.com/hc/en-us/articles/4405373029019-Sort-and-group-content-for-all-file-providers'
    );
  });
  test('should test for bundle install notification', async () => {
    const {store} = await readyStore();
    const props = {
      className: 'makeStyles-resourceFormWrapper-250',
      flowId: undefined,
      isFlowBuilderView: false,
      isNew: false,
      resourceType: 'exports',
      resourceId: '5e74798ec2c20f66f05cd370',
      formKey: 'exports-5e74798ec2c20f66f05cd370',
      occupyFullWidth: true,
    };

    renderWithStoreAsndProps(store, props);

    act(() => { store.dispatch(actions.resourceForm.showBundleInstallNotification('/', 'exports', '5e74798ec2c20f66f05cd370')); });
    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', '/');
  });
  test('should test for notification toaster', async () => {
    const {store} = await readyStore();
    const props = {
      className: 'makeStyles-resourceFormWrapper-250',
      flowId: undefined,
      isFlowBuilderView: false,
      isNew: false,
      resourceType: 'imports',
      resourceId: '5f2d839ff238932d6c7593f6',
      formKey: 'imports-52a196ce1bf5be58603a5417',
      variant: '',
      showNotificationToaster: true,

    };

    renderWithStoreAsndProps(store, props);
    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Let us know to prioritize this');
    expect(link).toHaveAttribute('href', 'mailto:product_feedback@celigo.com');
  });
});

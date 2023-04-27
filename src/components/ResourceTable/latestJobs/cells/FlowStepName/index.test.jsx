
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FlowStepName from '.';
import { JOB_STATUS } from '../../../../../constants';
import {
  renderWithProviders,
  reduxStore,
  mutateStore,
} from '../../../../../test/test-utils';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.resources.exports = [
    {
      _id: '634b79db0cbd27707a2d5080',
      name: 'Exportname1',
    },
    {
      _id: '634b79db0cbd27707a2d5081',
      name: 'Exportname2',
      _connectionId: '5e7068331c056a75e6df19b2',
    },
  ];
  draft.data.resources.connections = [
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
      http: {
        formType: 'assistant',
        mediaType: 'json',
        baseURI: 'https://apirest.3dcart.com',
        concurrencyLevel: 11,
        ping: {
          relativeURI: '/3dCartWebAPI/v1/Customers',
          method: 'GET',
        },
        headers: [
          {
            name: 'SecureUrl',
            value: 'https://celigoc1.com',
          },
          {
            name: 'PrivateKey',
            value: '{{{connection.http.encrypted.PrivateKey}}}',
          },
          {
            name: 'content-type',
            value: 'application/json',
          },
        ],
        encrypted: '******',
        encryptedFields: [],
        auth: {
          type: 'token',
          oauth: {
            scope: [],
          },
          token: {
            token: '******',
            location: 'header',
            headerName: 'Token',
            scheme: ' ',
            refreshMethod: 'POST',
            refreshMediaType: 'urlencoded',
          },
        },
      },
      rest: {
        baseURI: 'https://apirest.3dcart.com',
        bearerToken: '******',
        tokenLocation: 'header',
        mediaType: 'json',
        authType: 'token',
        authHeader: 'Token',
        authScheme: ' ',
        headers: [
          {
            name: 'SecureUrl',
            value: 'https://celigoc1.com',
          },
          {
            name: 'PrivateKey',
            value: '{{{connection.rest.encrypted.PrivateKey}}}',
          },
        ],
        encrypted: '******',
        encryptedFields: [],
        unencryptedFields: [],
        scope: [],
        pingRelativeURI: '/3dCartWebAPI/v1/Customers',
        concurrencyLevel: 11,
        refreshTokenHeaders: [],
      },
    },
  ];
  draft.session.data = {};
});

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const jobdata = {
  _exportId: '634b79db0cbd27707a2d5080',
  _id: '634cc85cc485937caa99e6a1',
  _integrationId: '56d6b23fe1fc35de53914730',
  createdAt: '2022-10-17T03:13:32.088Z',
  duration: '00:00:05',
  endedAt: '2022-10-17T03:13:37.156Z',
  lastExecutedAt: '2022-10-17T03:13:37.156Z',
  lastModified: '2022-10-17T03:13:57.480Z',
  name: 'Exportname',
  numError: 1,
  numExport: 0,
  numIgnore: 0,
  numOpenError: 1,
  numPagesGenerated: 0,
  numPagesProcessed: 1,
  numResolved: 0,
  numSuccess: 0,
  oIndex: 1,
  parentStartedAt: '2022-10-17T03:13:27.838Z',
  percentComplete: 100,
  purgeAt: '2022-11-16T03:13:32.088Z',
  retriable: false,
  startedAt: '2022-10-17T03:13:32.088Z',
  status: JOB_STATUS.RUNNING,
  type: 'export',
};
const jobdata1 = {
  _importId: '634b79db0cbd27707a2d5080',
  _id: '634cc85cc485937caa99e6a1',
  _integrationId: '56d6b23fe1fc35de53914730',
  createdAt: '2022-10-17T03:13:32.088Z',
  duration: '00:00:05',
  endedAt: '2022-10-17T03:13:37.156Z',
  lastExecutedAt: '2022-10-17T03:13:37.156Z',
  lastModified: '2022-10-17T03:13:57.480Z',
  name: 'Importname',
  numError: 1,
  numExport: 0,
  numIgnore: 0,
  numOpenError: 1,
  numPagesGenerated: 0,
  numPagesProcessed: 1,
  numResolved: 0,
  numSuccess: 0,
  oIndex: 1,
  parentStartedAt: '2022-10-17T03:13:27.838Z',
  percentComplete: 100,
  purgeAt: '2022-11-16T03:13:32.088Z',
  retriable: false,
  startedAt: '2022-10-17T03:13:32.088Z',
  status: JOB_STATUS.COMPLETED,
  type: 'import',
};

const jobdata2 = {
  _importId: '634b79db0cbd27707a2d5080',
  _id: '634cc85cc485937caa99e6a1',
  _integrationId: '56d6b23fe1fc35de53914730',
  createdAt: '2022-10-17T03:13:32.088Z',
  duration: '00:00:05',
  endedAt: '2022-10-17T03:13:37.156Z',
  lastExecutedAt: '2022-10-17T03:13:37.156Z',
  lastModified: '2022-10-17T03:13:57.480Z',
  numError: 1,
  numExport: 0,
  numIgnore: 0,
  numOpenError: 1,
  numPagesGenerated: 0,
  numPagesProcessed: 1,
  numResolved: 0,
  numSuccess: 0,
  oIndex: 1,
  parentStartedAt: '2022-10-17T03:13:27.838Z',
  percentComplete: 100,
  purgeAt: '2022-11-16T03:13:32.088Z',
  retriable: false,
  startedAt: '2022-10-17T03:13:32.088Z',
  status: JOB_STATUS.COMPLETED,
  type: 'import',
};
const jobdata4 = {
  _exportId: '634b79db0cbd27707a2d5081',
  name: 'Exportname2',
  type: 'export',
};

describe('uI test cases for Flowstep name', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should display export when job type is of export', () => {
    renderWithProviders(<FlowStepName job={jobdata} />);
    const response = screen.getByText('Export');

    expect(response).toBeInTheDocument();
  });
  test('should display job name when status is completed', () => {
    renderWithProviders(<FlowStepName job={jobdata1} />);
    const response = screen.getByText('Importname');

    expect(response).toBeInTheDocument();
  });
  test('should display import when job type is import', () => {
    renderWithProviders(<FlowStepName job={jobdata2} />);
    const res = screen.getByText('Import');

    expect(res).toBeInTheDocument();
  });
  test('should pass the initialsd render with default value', () => {
    renderWithProviders(<FlowStepName job={jobdata2} />);
    const res = screen.getByText('Import');

    expect(res).toBeInTheDocument();
  });
  test('should pass the initialsd render with default value duplicate', () => {
    renderWithProviders(<FlowStepName job={jobdata} />, { initialStore });

    const res = screen.getByText('Exportname1');

    expect(res).toBeInTheDocument();
  });
  test('should display provided export name in the export', () => {
    renderWithProviders(<FlowStepName job={jobdata4} />, { initialStore });

    const res = screen.getByText('Exportname2');

    expect(res).toBeInTheDocument();
  });
  test('should click on connection down button when connection is offline', async () => {
    renderWithProviders(<FlowStepName job={jobdata4} />, { initialStore });
    const response = screen.getByLabelText('Connection down');

    expect(response).toBeInTheDocument();
    const response1 = screen.getByRole('button');

    await userEvent.click(response1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'BOTTOM_DRAWER_SET_ACTIVE_TAB',
      index: undefined,
      tabType: 'connections',
    });
  });
});

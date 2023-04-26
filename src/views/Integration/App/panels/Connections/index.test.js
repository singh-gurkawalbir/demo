
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import * as utils from '../../../../../utils/resource';
import ConnectionsPanel from '.';

const mockDispatch = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/LoadResources'),
  default: props => <div>{props.children}</div>,
}));

describe('ConnectionsPanel UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
  });
  function initStoreAndRender(_connectorId, storeConnections) {
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
      draft.user.profile = { timezone: 'Asia/Calcutta' };
      draft.user.preferences = {defaultAShareId: 'own'};
    });

    if (storeConnections) {
      mutateStore(initialStore, draft => {
        draft.data.resources.connections = [
          {
            _id: '5ee0b67a3c11e4201f43102d',
            createdAt: '2020-06-10T10:31:22.431Z',
            _integrationId: '5ff579d745ceef7dcd797c15',
            lastModified: '2020-07-08T04:32:09.756Z',
            type: 'rest',
            name: 'Acumatica Agent HTTP',
            assistant: 'acumatica',
            offline: true,
            sandbox: false,
            _agentId: '5ed8c824f1188372591a32c4',
            isHTTP: true,
            http: {
              formType: 'assistant',
              mediaType: 'json',
              baseURI: 'http://isvtest.acumatica.com/certification_celigo_19r2/entity/Default/18.200.001',
              ping: {
                relativeURI: '/FinancialPeriod',
                method: 'GET',
              },
              headers: [
                {
                  name: 'content-type',
                  value: 'application/json',
                },
              ],
              unencrypted: {
                endpointName: 'Default',
                endpointVersion: '18.200.001',
                username: 'admin',
              },
              encrypted: '******',
              auth: {
                type: 'cookie',
                cookie: {
                  uri: 'http://isvtest.acumatica.com/certification_celigo_19r2/entity/auth/login',
                  body: '{"name": "admin","password": "Setup2","company": ""}',
                  method: 'POST',
                  successStatusCode: 204,
                },
              },
            },
            rest: {
              baseURI: 'http://isvtest.acumatica.com/certification_celigo_19r2/entity/Default/18.200.001',
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
                endpointVersion: '18.200.001',
                username: 'admin',
              },
              unencryptedFields: [],
              scope: [],
              pingRelativeURI: '/FinancialPeriod',
              pingMethod: 'GET',
              cookieAuth: {
                uri: 'http://isvtest.acumatica.com/certification_celigo_19r2/entity/auth/login',
                body: '******',
                method: 'POST',
                successStatusCode: 204,
              },
            },
          },
        ];
      });
    }
    renderWithProviders(
      <MemoryRouter initialEntries={['someinitalURL']}>
        <ConnectionsPanel integrationId="5ff579d745ceef7dcd797c15" />
      </MemoryRouter>, {initialStore});
  }
  test('should click on create connection button', async () => {
    initStoreAndRender('some_connectorId', false);
    await userEvent.click(screen.getByText('Create connection'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_STAGE_PATCH',
        patch: [
          {
            op: 'add',
            path: '/_integrationId',
            value: '5ff579d745ceef7dcd797c15',
          },
          { op: 'add', path: '/applications', value: [] },
          { op: 'add', path: '/_connectorId', value: 'some_connectorId' },
          { op: 'add', path: '/newIA', value: true },
        ],
        id: 'somegeneratedID',
      }
    );
    expect(mockHistoryPush).toHaveBeenCalledWith('someinitalURL/add/connections/somegeneratedID');
  });

  test('should click on register connection button', async () => {
    initStoreAndRender(null, false);
    await userEvent.click(screen.getByText('Register connections'));
    await userEvent.click(screen.getByText('Register'));
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  test('should test Create connection when connection is present in store', async () => {
    initStoreAndRender(null, true);
    await userEvent.click(screen.getByText('Create connection'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_STAGE_PATCH',
        patch: [
          {
            op: 'add',
            path: '/_integrationId',
            value: '5ff579d745ceef7dcd797c15',
          },
          { op: 'add', path: '/applications', value: ['acumatica'] },
        ],
        id: 'somegeneratedID',
      }
    );
    expect(mockHistoryPush).toHaveBeenCalledWith('someinitalURL/add/connections/somegeneratedID');
  });
  test('should test use effects dispatch call', () => {
    initStoreAndRender(null, true);
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'PATCH_FILTER',
        name: '5ff579d745ceef7dcd797c15+undefined+connections',
        filter: { sort: { order: 'asc', orderBy: 'name' } },
      }
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'REFRESH_CONNECTION_STATUS',
        integrationId: '5ff579d745ceef7dcd797c15',
      }
    );
  });
});


import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import SelectSource from './SelectSource';
import actions from '../../../../actions';
import { mutateStore, reduxStore, renderWithProviders } from '../../../../test/test-utils';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.errorManagement.metadata.data = {
    source: ['Connection', 'HTTP', 'Import filter'] };
  draft.data.resources = {
    exports: [{
      _id: '621ce7db7988314f51662c09',
      createdAt: '2022-02-28T15:18:51.954Z',
      lastModified: '2022-02-28T15:18:52.009Z',
      name: '123',
      _connectionId: '59e06b30c147fc42676175c0',
      apiIdentifier: 'e27e85646b',
      asynchronous: true,
      type: 'delta',
      oneToMany: false,
      sandbox: false,
      parsers: [],
      http: {
        relativeURI: 'abc/{{lastExportDateTime}}',
        method: 'GET',
        formType: 'http',
      },
      delta: {
        dateFormat: 'D/M/YY',
      },
      adaptorType: 'HTTPExport',
    }],
    connections:
      [{
        _id: '59e06b30c147fc42676175c0',
        lastModified: '2017-07-14T12:00:40.973Z',
        type: 'rest',
        name: '3D Cart SANDBOX',
        assistant: 'googledrive',
        debugDate: '2017-04-20T08:42:59.904Z',
        sandbox: true,
        isHTTP: true,
        http: {
          formType: 'assistant',
          mediaType: 'json',
          baseURI: 'https://apirest.googledrive.com',
          ping: {
            relativeURI: '/3dCartWebAPI/v1/Customers',
            method: 'GET',
          },
          headers: [
            {
              name: 'SecureUrl',
              value: 'https://sandbox-integrator-io.3dcartstores.com',
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
          isHTTPProxy: true,
          bearerToken: '******',
          tokenLocation: 'header',
          mediaType: 'json',
          authType: 'token',
          authHeader: 'Token',
          authScheme: ' ',
          headers: [
            {
              name: 'SecureUrl',
              value: 'https://sandbox-integrator-io.3dcartstores.com',
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
        },
      }],
    flows: [{
      _id: '5ea16c600e2fab71928a6152',
      lastModified: '2021-08-13T08:02:49.712Z',
      name: ' Bulk insert with harcode and mulfield mapping settings',
      disabled: true,
      _integrationId: '5e9bf6c9edd8fa3230149fbd',
      skipRetries: false,
      pageProcessors: [
        {
          responseMapping: {
            fields: [],
            lists: [],
          },
          type: 'import',
          _importId: '5ea16cd30e2fab71928a6166',
        },
      ],
      pageGenerators: [
        {
          _exportId: '5d00b9f0bcd64414811b2396',
        },
      ],
      createdAt: '2020-04-23T10:22:24.290Z',
      lastExecutedAt: '2020-04-23T11:08:41.093Z',
      autoResolveMatchingTraceKeys: true,
    }],
  };
});

const mockDispatch = jest.fn(actions => {
  initialStore.dispatch(actions);
});

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('uI test cases for SelectSource', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const flowId = '5ea16c600e2fab71928a6152';
  const resourceId = '621ce7db7988314f51662c09';

  test('should test source options are checked and filterkey is set to resolved', async () => {
    renderWithProviders(<SelectSource flowId={flowId} resourceId={resourceId} isResolved="true" />, {initialStore});
    const sourcebutton = screen.getByRole('button');

    await userEvent.click(sourcebutton);
    const options = screen.getAllByRole('checkbox');

    await userEvent.click(options[1]);

    const apply = screen.getByText('Apply');

    await userEvent.click(apply);
    expect(mockDispatch).toHaveBeenCalledWith(actions.errorManager.flowErrorDetails.request({
      flowId: '5ea16c600e2fab71928a6152',
      resourceId: '621ce7db7988314f51662c09',
      isResolved: 'true',
    }));
  });

  test('should test source options are checked and filter key is set to open', async () => {
    renderWithProviders(<SelectSource flowId={flowId} resourceId={resourceId} isResolved="false" />, {initialStore});
    const sourcebutton = screen.getByRole('button');

    await userEvent.click(sourcebutton);
    const options = screen.getAllByRole('checkbox');

    await userEvent.click(options[1]);

    const apply = screen.getByText('Apply');

    await userEvent.click(apply);
    expect(mockDispatch).toHaveBeenCalledWith(actions.errorManager.flowErrorDetails.request({
      flowId: '5ea16c600e2fab71928a6152',
      resourceId: '621ce7db7988314f51662c09',
      isResolved: 'false',
    }));
  });
  test('should test cancel button is working fine', async () => {
    renderWithProviders(<SelectSource flowId={flowId} resourceId={resourceId} isResolved="true" />, {initialStore});
    const sourcebutton = screen.getByRole('button');

    await userEvent.click(sourcebutton);
    const options = screen.getAllByRole('checkbox');

    await userEvent.click(options[1]);

    const cancel = screen.getByText('Cancel');

    await userEvent.click(cancel);
    expect(screen.queryByText('Apply')).not.toBeInTheDocument();
  });
});

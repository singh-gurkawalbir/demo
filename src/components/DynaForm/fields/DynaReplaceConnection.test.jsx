
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import DynaReplaceConnection from './DynaReplaceConnection';
import * as formContext from '../../Form/FormContext';
import { mutateStore, reduxStore, renderWithProviders } from '../../../test/test-utils';

const initialStore = reduxStore;

const mockDispatch = jest.fn(actions => {
  initialStore.dispatch(actions);
});

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('./DynaSelectResource', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaSelectResource'),
  default: props => {
    function fieldChange() {
      props.onFieldChange('oldId', 'newId');
    }

    return (
      <div><button type="button" onClick={fieldChange}>Replace Connection</button></div>
    );
  }}
));

mutateStore(initialStore, draft => {
  draft.user.preferences = {
    environment: 'production',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm:ss a',
    scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
    showReactSneakPeekFromDate: '2019-11-05',
    showReactBetaFromDate: '2019-12-26',
    defaultAShareId: 'own',
    expand: 'Resources',
    accounts: {
      '6040b99a7671bb3ddf6a368b': {
        drawerOpened: true,
        fbBottomDrawerHeight: 257,
        expand: null,
        dashboard: {
          view: 'tile',
        },
      },
      '61c45e7b11cd027c01583984': {
        expand: null,
      },
    },
  };

  draft.data.resources.integrations = [
    {
      _id: '5ff579d745ceef7dcd797c15',
      lastModified: '2021-01-19T06:34:17.222Z',
      name: " AFE 2.0 refactoring for DB's",
      _parentId: 'someparentId',
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c97',
        '62f2b141d0402833c6fec36f',
        '62f2b141d0402833c6fhxwef',
      ],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2021-01-06T08:50:31.935Z',
    },
    {
      _id: 'someparentId',
      lastModified: '2021-01-19T06:34:17.222Z',
      name: " AFE 2.0 refactoring for DB's",
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c97',
        '5ff57a8345ceef7dcd797c21',
        '62f2b141d0402833c6fhxwef',
      ],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2021-01-06T08:50:31.935Z',
    }];
  draft.data.resources.connections = [
    {
      _id: '5cd51efd3607fe7d8eda9c97',
      createdAt: '2022-06-30T06:33:44.780Z',
      lastModified: '2022-06-30T06:33:44.870Z',
      type: 'http',
      name: 'demo',
      assistant: 'acumatica',
      sandbox: false,
      http: {
        formType: 'rest',
        mediaType: 'json',
        baseURI: 'https://3jno0syp47.execute-api.us-west-2.amazonaws.com/test/orders',
        unencrypted: {
          field: 'value',
        },
        encrypted: '******',
        auth: {
          type: 'basic',
          basic: {
            username: 'demo',
            password: '******',
          },
        },
      },
    },
    {
      _id: '62f2b141d0402833c6fec36f',
      createdAt: '2022-08-09T19:10:57.420Z',
      lastModified: '2022-08-09T19:10:57.495Z',
      type: 'rest',
      name: 'Act-on',
      sandbox: false,
      isHTTP: true,
      http: {
        formType: 'assistant',
        mediaType: 'urlencoded',
        baseURI: 'https://restapi.actonsoftware.com',
        headers: [
          {
            name: 'Accept',
            value: 'application/json',
          },
          {
            name: 'content-type',
            value: 'application/x-www-form-urlencoded',
          },
        ],
        auth: {
          type: 'oauth',
          oauth: {
            authURI: 'https://restapi.actonsoftware.com/authorize',
            tokenURI: 'https://restapi.actonsoftware.com/token',
            scope: [
              'PRODUCTION',
            ],
            scopeDelimiter: ' ',
          },
          token: {
            scheme: 'Bearer',
            refreshMethod: 'POST',
            refreshMediaType: 'urlencoded',
          },
        },
      },
      rest: {
        baseURI: 'https://restapi.actonsoftware.com',
        isHTTPProxy: true,
        mediaType: 'urlencoded',
        authType: 'oauth',
        authURI: 'https://restapi.actonsoftware.com/authorize',
        oauthTokenURI: 'https://restapi.actonsoftware.com/token',
        authScheme: 'Bearer',
        headers: [
          {
            name: 'Accept',
            value: 'application/json',
          },
        ],
        encryptedFields: [],
        unencryptedFields: [],
        scope: [
          'PRODUCTION',
        ],
        scopeDelimiter: ' ',
        pingSuccessValues: [],
        pingFailureValues: [],
        refreshTokenMethod: 'POST',
        refreshTokenMediaType: 'urlencoded',
        refreshTokenHeaders: [],
      },
    },
    {
      _id: '62f2b141d0402833c6fhxwef',
      createdAt: '2022-08-09T19:10:57.420Z',
      lastModified: '2022-08-09T19:10:57.495Z',
      type: 'zoom',
      name: 'zoom',
      assistant: 'zoom',
      assistantMetadata: {
        resource: 'r1',
        operation: 'ep1',
        version: 'v1',
      },
      sandbox: false,
    }];
});
function initDynaReplaceConnection(props = {}) {
  const ui = (
    <MemoryRouter>
      <DynaReplaceConnection
        {...props}
    />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaReplaceConnection UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const genralProps = {
    connectionId: '5cd51efd3607fe7d8eda9c97',
    connectorId: '6322bc4c0899513ede0ae545',
    flowId: '67890',
    resourceId: '12',
    parentResourceType: 'integrations',
    formKey: 'imports-6375d5edc1b1ee732dd2b1e3',
    integrationId: '5ff579d745ceef7dcd797c15',
    resourceContext: [],
  };

  test('should test replace connection with touched set to true', async () => {
    mutateStore(initialStore, draft => {
      draft.session.form['imports-6375d5edc1b1ee732dd2b1e3'] = {
        fields: {
          _connectionId: { touched: true, value: '62f76fd2dd7931633948ee7a'},
        },
        value: {
          '/_connectionId': '62f76fd2dd7931633948ee7a',
        },
      };
    });

    initDynaReplaceConnection(genralProps);
    const button = screen.getByText('Replace Connection');

    await userEvent.click(button);
    expect(mockDispatch).toHaveBeenCalledWith({id: '12', patch: [{op: 'replace', path: '/_connectionId', value: 'newId'}, {op: 'remove', path: '/assistantMetadata'}], type: 'RESOURCE_STAGE_PATCH'});
    expect(mockDispatch).toHaveBeenCalledWith({flowId: '67890', initData: [{id: undefined, value: '62f76fd2dd7931633948ee7a'}, {id: 'oldId', value: 'newId'}], integrationId: undefined, isNew: false, resourceId: '12', resourceType: 'integrations', skipCommit: false, type: 'RESOURCE_FORM_INIT'});
  });

  test('should test replace connection with touched set to false', async () => {
    mutateStore(initialStore, draft => {
      draft.session.form['imports-6375d5edc1b1ee732dd2b1e3'] = {
        fields: {
          _connectionId: { touched: false, value: '123'},
        },
        value: {
          '/_connectionId': '123',
        },
      };
    });
    initDynaReplaceConnection(genralProps);
    const button = screen.getByText('Replace Connection');

    await userEvent.click(button);
    expect(mockDispatch).toHaveBeenCalledWith({id: '12', patch: [{op: 'replace', path: '/_connectionId', value: 'newId'}, {op: 'remove', path: '/assistantMetadata'}], type: 'RESOURCE_STAGE_PATCH'});
    expect(mockDispatch).toHaveBeenCalledWith({flowId: '67890', initData: [{id: 'oldId', value: 'newId'}], integrationId: undefined, isNew: false, resourceId: '12', resourceType: 'integrations', skipCommit: false, type: 'RESOURCE_FORM_INIT'});
  });

  test('should test replace connection with touched set to false and no assistant', async () => {
    const genralProps = {
      connectionId: '62f2b141d0402833c6fec36f',
      connectorId: '6322bc4c0899513ede0ae545',
      flowId: '67890',
      resourceId: '12',
      parentResourceType: 'integrations',
      formKey: 'imports-6375d5edc1b1ee732dd2b1e3',
      integrationId: '5ff579d745ceef7dcd797c15',
      resourceContext: [],
    };

    mutateStore(initialStore, draft => {
      draft.session.form['imports-6375d5edc1b1ee732dd2b1e3'] = {
        fields: {
          _connectionId: { touched: false, value: '123'},
        },
        value: {
          '/_connectionId': '123',
        },
      };
    });
    initDynaReplaceConnection(genralProps);
    const button = screen.getByText('Replace Connection');

    await userEvent.click(button);
    expect(mockDispatch).toHaveBeenCalledWith({id: '12', patch: [{op: 'replace', path: '/_connectionId', value: 'newId'}], type: 'RESOURCE_STAGE_PATCH'});
    expect(mockDispatch).toHaveBeenCalledWith({flowId: '67890', initData: [{id: 'oldId', value: 'newId'}], integrationId: undefined, isNew: false, resourceId: '12', resourceType: 'integrations', skipCommit: false, type: 'RESOURCE_FORM_INIT'});
  });
  test('should test replace connection with touched set to true and no assistant', async () => {
    const genralProps = {
      connectionId: '62f2b141d0402833c6fec36f',
      connectorId: '6322bc4c0899513ede0ae545',
      flowId: '67890',
      resourceId: '12',
      parentResourceType: 'integrations',
      formKey: 'imports-6375d5edc1b1ee732dd2b1e3',
      integrationId: '5ff579d745ceef7dcd797c15',
      resourceContext: [],
    };

    mutateStore(initialStore, draft => {
      draft.session.form['imports-6375d5edc1b1ee732dd2b1e3'] = {
        fields: {
          _connectionId: { touched: true, value: '123'},
        },
        value: {
          '/_connectionId': '123',
        },
      };
    });
    initDynaReplaceConnection(genralProps);
    const button = screen.getByText('Replace Connection');

    await userEvent.click(button);
    expect(mockDispatch).toHaveBeenCalledWith({id: '12', patch: [{op: 'replace', path: '/_connectionId', value: 'newId'}], type: 'RESOURCE_STAGE_PATCH'});
    expect(mockDispatch).toHaveBeenCalledWith({flowId: '67890', initData: [{id: undefined, value: '123'}, {id: 'oldId', value: 'newId'}], integrationId: undefined, isNew: false, resourceId: '12', resourceType: 'integrations', skipCommit: false, type: 'RESOURCE_FORM_INIT'});
  });

  test('should test replace connection with assistant metadata', async () => {
    const genralProps = {
      connectionId: '62f2b141d0402833c6fhxwef',
      connectorId: '6322bc4c0899513ede0ae545',
      flowId: '67890',
      resourceId: '12',
      parentResourceType: 'integrations',
      formKey: 'imports-6375d5edc1b1ee732dd2b1e3',
      integrationId: '5ff579d745ceef7dcd797c15',
      resourceContext: [],
    };

    mutateStore(initialStore, draft => {
      draft.session.form['imports-6375d5edc1b1ee732dd2b1e3'] = {
        fields: {id: 'oldId',
          field: {touched: true,
            id: [{ assistantMetadata: {
              resource: 'someresource',
              operation: 'update',
              version: 'v1',
            }}]}},
        value: {
          '/_connectionId': '62f76fd2dd7931633948ee7a',
        },
      };
    });
    initDynaReplaceConnection(genralProps);
    const button = screen.getByText('Replace Connection');

    await userEvent.click(button);
    expect(mockDispatch).toHaveBeenCalledWith({id: '12', patch: [{op: 'replace', path: '/_connectionId', value: 'newId'}, {op: 'remove', path: '/assistantMetadata'}], type: 'RESOURCE_STAGE_PATCH'});
    expect(mockDispatch).toHaveBeenCalledWith({flowId: '67890', initData: [{id: [{assistantMetadata: {operation: 'update', resource: 'someresource', version: 'v1'}}], value: undefined}, {id: 'oldId', value: 'newId'}], integrationId: undefined, isNew: false, resourceId: '12', resourceType: 'integrations', skipCommit: false, type: 'RESOURCE_FORM_INIT'});
  });
  test('should test replace connection without store', async () => {
    const genralProps = {
      connectionId: '62f2b141d0402833c6fhxwef',
      connectorId: '6322bc4c0899513ede0ae545',
      flowId: '67890',
      resourceId: '12',
      parentResourceType: 'integrations',
      formKey: 'imports-6375d5edc1b1ee732dd2b1e3',
      integrationId: '5ff579d745ceef7dcd797c15',
      resourceContext: [],
    };

    jest.spyOn(formContext, 'default').mockReturnValue({fields: {id: 'oldId', field: {touched: true}},
      value: {
        '/_connectionId': '62f76fd2dd7931633948ee7a',
      } });
    renderWithProviders(<MemoryRouter><DynaReplaceConnection {...genralProps} /></MemoryRouter>);
    const button = screen.getByText('Replace Connection');

    await userEvent.click(button);
    expect(mockDispatch).toHaveBeenCalledWith({id: '12', patch: [{op: 'replace', path: '/_connectionId', value: 'newId'}], type: 'RESOURCE_STAGE_PATCH'});
  });
});

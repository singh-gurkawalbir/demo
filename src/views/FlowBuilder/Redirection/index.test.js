
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import * as reactRedux from 'react-redux';
import {reduxStore, renderWithProviders} from '../../../test/test-utils';
import Redirection from '.';
import ResourceButton from '../ResourceButton';
import actions from '../../../actions';

function initRedirection(ui, props = {}, env = false) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources.flows = [{
    _id: '62c6f122a2f4a703c3dee3d0',
    lastModified: '2022-07-07T14:46:06.187Z',
    name: 'New flow',
    disabled: false,
    _integrationId: '6253af74cddb8a1ba550a010',
    isSimpleImport: true,
    skipRetries: false,
    _connectorId: props.connId,
    pageProcessors: [
      {
        responseMapping: {
          fields: [],
          lists: [],
        },
        type: 'import',
        _importId: '62c6f15aae93a81493321a87',
      },
    ],
    pageGenerators: [
      {
        _exportId: '62c6f121a2f4a703c3dee3ce',
        skipRetries: false,
      },
    ],
    sandbox: env,
    createdAt: '2022-07-07T14:43:46.730Z',
    lastExecutedAt: '2022-07-07T14:46:57.185Z',
    autoResolveMatchingTraceKeys: true,
  }];
  initialStore.getState().data.resources.integrations = [{
    _id: '6253af74cddb8a1ba550a010',
    lastModified: '2022-06-30T06:39:32.607Z',
    name: 'demoint',
    description: 'demo integration',
    install: [],
    sandbox: false,
    _registeredConnectionIds: [
      '62bd43c87b94d20de64e9ab3',
      '62bd452420ecb90e02f2a6f0',
    ],
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2022-04-11T04:32:52.823Z',
  }];
  initialStore.getState().data.resources.exports = [{
    _id: '62c6f121a2f4a703c3dee3ce',
    createdAt: '2022-07-07T14:43:45.064Z',
    lastModified: '2022-07-07T14:43:45.114Z',
    name: 'demoexp',
    _connectionId: '62bd43c87b94d20de64e9ab3',
    apiIdentifier: 'e9de6ee3c5',
    asynchronous: true,
    oneToMany: false,
    sandbox: false,
    parsers: [],
    type: props.type,
    http: {
      relativeURI: 'demo',
      method: 'GET',
      successMediaType: 'json',
      errorMediaType: 'json',
      formType: 'rest',
      paging: {},
    },
    adaptorType: 'HTTPExport',
    _rest: {
      relativeURI: 'demo',
    },
  }];
  initialStore.getState().user.profile = {useErrMgtTwoDotZero: true};
  initialStore.getState().user.preferences = {defaultAShareId: false, environment: 'production'};
  initialStore.getState().session.resource['new-mnbvcxz'] = {isExact: true};
  initialStore.getState().session.errorManagement.openErrors['62c6f122a2f4a703c3dee3d0'] = {
    status: 'received',
    data: {
      '62c6f121a2f4a703c3dee3ce': {
        _expOrImpId: '62c6f121a2f4a703c3dee3ce',
        numError: props.numErrors,
        lastErrorAt: '2022-08-08T13:44:03.841Z',
      },
    },
  };

  renderWithProviders(ui, {initialStore});
}

const mockHistoryReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
  matchPath: () => (
    {isExact: true}
  ),
}));

describe('Redirection UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('should pass the initial render with the component passed as props', () => {
    const props = {children: <ResourceButton variant="import" />};
    const ui = (
      <MemoryRouter initialEntries={[{pathname: '/integrations/6253af74cddb8a1ba550a010/flowBuilder/62c6f122a2f4a703c3dee3d0'}]} >
        <Route
          path="/integrations/:integrationId/flowBuilder/:flowId"
            >
          <Redirection {...props} />
        </Route>
      </MemoryRouter>
    );

    initRedirection(ui, props);
    expect(screen.getByText('Import')).toBeInTheDocument();
  });
  test('should make 3 dispatch calls when flowId starts with "new"', async () => {
    const props = {children: <ResourceButton variant="import" />};
    const ui = (
      <MemoryRouter initialEntries={[{pathname: '/integrations/6253af74cddb8a1ba550a010/flowBuilder/new'}]} >
        <Route
          path="/integrations/:integrationId/flowBuilder/:flowId"
            >
          <Redirection {...props} />
        </Route>
      </MemoryRouter>
    );

    initRedirection(ui, props);
    await waitFor(() => expect(mockHistoryReplace).toBeCalled());
  });
  test('should make the respective dispatch calls when flowId is not "new"', async () => {
    const props = {children: <ResourceButton variant="import" />};
    const ui = (
      <MemoryRouter initialEntries={[{pathname: '/integrations/6253af74cddb8a1ba550a010/flowBuilder/62c6f122a2f4a703c3dee3d0'}]} >
        <Route
          path="/integrations/:integrationId/flowBuilder/:flowId"
            >
          <Redirection {...props} />
        </Route>
      </MemoryRouter>
    );

    initRedirection(ui, props);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.errorManager.openFlowErrors.requestPoll({ flowId: '62c6f122a2f4a703c3dee3d0' })));
  });
  test('should make the respective dispatch call when the flowId starts with "new"', async () => {
    const props = {children: <ResourceButton variant="import" />};
    const ui = (
      <MemoryRouter initialEntries={[{pathname: '/integrations/6253af74cddb8a1ba550a010/flowBuilder/dataloader/new-mnbvcxz'}]} >
        <Route
          path="/integrations/:integrationId/flowBuilder/dataloader/:flowId"
            >
          <Redirection {...props} />
        </Route>
      </MemoryRouter>
    );

    initRedirection(ui, props);
    await waitFor(() => expect(mockDispatchFn).toBeCalledTimes(1));
    await waitFor(() => expect(mockHistoryReplace).toBeCalled());
  });
  test('should make a dispatch call to update preferences when flow.sandbox is true', async () => {
    const props = {children: <ResourceButton variant="import" />};
    const ui = (
      <MemoryRouter initialEntries={[{pathname: '/integrations/6253af74cddb8a1ba550a010/flowBuilder/dataloader/62c6f122a2f4a703c3dee3d0'}]} >
        <Route
          path="/integrations/:integrationId/flowBuilder/dataloader/:flowId"
            >
          <Redirection {...props} />
        </Route>
      </MemoryRouter>
    );

    initRedirection(ui, props, true);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.user.preferences.update({environment: 'sandbox'})));
  });
});

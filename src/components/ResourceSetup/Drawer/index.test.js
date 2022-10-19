/* global describe, test, expect, jest, afterEach */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore} from '../../../test/test-utils';
import ResourceSetupDrawer from '.';
import { getCreatedStore } from '../../../store';

const initialStore = reduxStore;

const mockonSubmitComplete = jest.fn();
const mockonClose = jest.fn();
const mockhandleStackClose = jest.fn();
const mocksetIsResourceStaged = jest.fn();
const mockDispatch = jest.fn();
const mockObjectCall = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryPush,
  }),
}));

jest.mock('../../drawer/Resource/Panel/ResourceFormActionsPanel', () => ({
  __esModule: true,
  ...jest.requireActual('../../drawer/Resource/Panel/ResourceFormActionsPanel'),
  default: props => (
    <>
      <button type="button" onClick={props.onSubmitComplete}>Save & close</button>
      <button type="button" onClick={props.onCancel}>Cancel</button>
    </>
  ),
}));

jest.mock('../../ResourceFormWithStatusPanel', () => ({
  __esModule: true,
  ...jest.requireActual('../../ResourceFormWithStatusPanel'),
  default: props => (
    <>
      <button type="button" onClick={props.onSubmitComplete}>onSubmitComplete</button>
    </>
  ),
}));

jest.mock('../AddOrSelect', () => ({
  __esModule: true,
  ...jest.requireActual('../AddOrSelect'),
  default: props => {
    function onClick() {
      mockObjectCall(props.resource);
      props.onSubmitComplete();
    }

    return (
      <>
        <button type="button" onClick={onClick}>AddOrSelectonSubmitComplete</button>
        <button type="button" onClick={props.onClose}>Cancel</button>
      </>
    );
  },
}));

const connections = [
  {
    _id: '56d6b7786f8ed15e4d0f9b91',
    createdAt: '2019-02-25T15:45:33.131Z',
    lastModified: '2022-07-14T02:19:55.849Z',
    type: 'netsuite',
    name: 'Netsuite-connection',
    offline: true,
    netsuite: {
      account: 'TSTDRV1389770',
      roleId: '3',
      email: 'autouser2@foobar.com',
      password: '******',
      environment: 'production',
      requestLevelCredentials: false,
      dataCenterURLs: {
        restDomain: 'https://tstdrv1389770.restlets.api.netsuite.com',
        webservicesDomain: 'https://tstdrv1389770.suitetalk.api.netsuite.com',
        systemDomain: 'https://tstdrv1389770.app.netsuite.com',
      },
      concurrencyLevel: 2,
      suiteAppInstalled: false,
    },
    queues: [
      {
        name: '56d6b7786f8ed15e4d0f9b91',
        size: 0,
      },
    ],
  },
  {
    _id: '56d6b7786f8ed15e4d0f9b92',
    createdAt: '2019-02-25T15:45:33.131Z',
    lastModified: '2022-07-14T02:19:55.849Z',
    type: 'netsuite',
    name: 'Netsuite-connection',
    offline: false,
    netsuite: {
      authType: 'token-auto',
      account: 'TSTDRV1389770',
      roleId: '3',
      email: 'autouser2@foobar.com',
      password: '******',
      environment: 'production',
      requestLevelCredentials: false,
      dataCenterURLs: {
        restDomain: 'https://tstdrv1389770.restlets.api.netsuite.com',
        webservicesDomain: 'https://tstdrv1389770.suitetalk.api.netsuite.com',
        systemDomain: 'https://tstdrv1389770.app.netsuite.com',
      },
      concurrencyLevel: 2,
      suiteAppInstalled: false,
    },
    queues: [
      {
        name: '56d6b7786f8ed15e4d0f9b91',
        size: 0,
      },
    ],
  },
];
const integrations = [{
  _id: '60e2efb81797d0701d813755',
  lastModified: '2021-07-09T13:36:01.738Z',
  name: 'Test Integration',
  sandbox: false,
  _registeredConnectionIds: [
    '5d529bfbdb0c7b14a6011a55',
    '5d70b2d8b0cc4065d0982c55',
  ],
}];

initialStore.getState().data.resources.connections = connections;

initialStore.getState().user.preferences = {
  environment: 'production',
  defaultAShareId: 'own',
};

function renderFunction(initialStore, props, initialEntries) {
  renderWithProviders(
    <MemoryRouter initialEntries={[initialEntries]}>
      <Route path="/parent">
        <ResourceSetupDrawer
          {...props}
        />
      </Route>
    </MemoryRouter>, {initialStore});
}

describe('ResourceDrawer UI test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call onsubmitcomplete function and reddirect to parent ', () => {
    const props = {
      resourceId: '/parent',
      resource: {type: 'netsuite'},
      onSubmitComplete: mockonSubmitComplete,
      handleStackClose: mockhandleStackClose,
      onClose: mockonClose,
    };

    renderFunction(initialStore, props, '/parent/configure/connections/resourceId');
    expect(screen.getByText('Set up connection')).toBeInTheDocument();
    userEvent.click(screen.getByText('AddOrSelectonSubmitComplete'));

    expect(mockHistoryPush).toHaveBeenCalledWith('/parent');
  });
  test('should redirect to parent on clicking cancel button', () => {
    const props = {
      resourceId: '/parent',
      resource: {type: 'netsuite'},
      onSubmitComplete: mockonSubmitComplete,
      handleStackClose: mockhandleStackClose,
      onClose: mockonClose,
    };

    renderFunction(initialStore, props, '/parent/configure/connections/resourceId');

    expect(screen.getByText('Set up connection')).toBeInTheDocument();
    userEvent.click(screen.getByText('Cancel'));

    expect(mockonClose).toHaveBeenCalled();
    expect(mockHistoryPush).toHaveBeenCalledWith('/parent');
  });
  test('should reLaunch Drawer with created connectionId when mode is clone', () => {
    initialStore.getState().data.resources.integrations = [{
      _id: '60e2efb81797d0701d813755',
      lastModified: '2021-07-09T13:36:01.738Z',
      name: 'Test Integration',
      _connectorId: '_connectorId',
      sandbox: false,
      _registeredConnectionIds: [
        '5d529bfbdb0c7b14a6011a55',
        '5d70b2d8b0cc4065d0982c55',
      ],
    }];

    initialStore.getState().session.resource.resourceId = '56d6b7786f8ed15e4d0f9b92';
    const props = {
      resource: {type: 'netsuite'},
      onSubmitComplete: mockonSubmitComplete,
      handleStackClose: mockhandleStackClose,
      onClose: mockonClose,
      integrationId: '60e2efb81797d0701d813755',
      mode: 'clone',
    };

    renderFunction(initialStore, props, '/parent/configure/connections/resourceId');

    userEvent.click(screen.getByText('onSubmitComplete'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/parent/configure/connections/56d6b7786f8ed15e4d0f9b92');
  });
  test('should make a dispatch call when isResourceStaged set to true ', () => {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = integrations;

    initialStore.getState().session.resource.resourceId = '56d6b7786f8ed15e4d0f9b92';
    const props = {
      resource: {type: 'netsuite'},
      onSubmitComplete: mockonSubmitComplete,
      handleStackClose: mockhandleStackClose,
      onClose: mockonClose,
      integrationId: '60e2efb81797d0701d813755',
      mode: 'clone',
      isResourceStaged: false,
      setIsResourceStaged: mocksetIsResourceStaged,
    };

    renderFunction(initialStore, props, '/parent/configure/connections/new-resourceId');

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_STAGE_PATCH',
        patch: [
          { op: 'replace', path: '/_id', value: 'new-resourceId' },
          {
            op: 'replace',
            path: '/_integrationId',
            value: '60e2efb81797d0701d813755',
          },
          { op: 'replace', path: '/installStepConnection', value: true },
        ],
        id: 'new-resourceId',
        scope: 'value',
      }
    );
  });
  test('should make make a dispatch call when setIsResourceStaged is not passed', () => {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = integrations;

    initialStore.getState().session.resource.resourceId = '56d6b7786f8ed15e4d0f9b92';
    const props = {
      resource: {type: 'netsuite'},
      onSubmitComplete: mockonSubmitComplete,
      handleStackClose: mockhandleStackClose,
      onClose: mockonClose,
      integrationId: '60e2efb81797d0701d813755',
      mode: 'clone',
      isResourceStaged: true,
      setIsResourceStaged: mocksetIsResourceStaged,
    };

    renderFunction(initialStore, props, '/parent/configure/connections/new-resourceId');
    expect(mockDispatch).not.toHaveBeenCalledWith();
  });
  test('should handle submit when isAutoried is set to true', () => {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = integrations;
    initialStore.getState().session.oAuthAuthorize = {resourceId: {authorized: true}};
    initialStore.getState().session.resource.resourceId = '56d6b7786f8ed15e4d0f9b92';

    const props = {
      resource: {type: 'netsuite'},
      onSubmitComplete: mockonSubmitComplete,
      handleStackClose: mockhandleStackClose,
      onClose: mockonClose,
      integrationId: '60e2efb81797d0701d813755',
      mode: 'clone',
      isResourceStaged: false,
      setIsResourceStaged: mocksetIsResourceStaged,
    };

    renderFunction(initialStore, props, '/parent/configure/connections/resourceId');

    expect(mockHistoryPush).toHaveBeenCalled();
  });
  test('should go back to parent on submit when resource type not connection', () => {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = integrations;
    initialStore.getState().session.oAuthAuthorize = {resourceId: {authorized: true}};
    initialStore.getState().session.resource.resourceId = '56d6b7786f8ed15e4d0f9b92';

    const props = {
      resource: {type: 'netsuite'},
      onSubmitComplete: mockonSubmitComplete,
      handleStackClose: mockhandleStackClose,
      onClose: mockonClose,
      integrationId: '60e2efb81797d0701d813755',
      mode: 'unknownmode',
      isResourceStaged: false,
      setIsResourceStaged: mocksetIsResourceStaged,
    };

    renderFunction(initialStore, props, '/parent/configure/connections/resourceId');

    userEvent.click(screen.getByText('AddOrSelectonSubmitComplete'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/parent');
  });
  test('should call handleStackClose when resource type is not connection', () => {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = integrations;
    initialStore.getState().session.oAuthAuthorize = {resourceId: {authorized: true}};
    initialStore.getState().session.resource.resourceId = '56d6b7786f8ed15e4d0f9b92';
    const props = {
      resource: {type: 'netsuite'},
      onSubmitComplete: mockonSubmitComplete,
      handleStackClose: mockhandleStackClose,
      onClose: mockonClose,
      integrationId: '60e2efb81797d0701d813755',
      mode: 'unknownmode',
      isResourceStaged: false,
      setIsResourceStaged: mocksetIsResourceStaged,
    };

    renderFunction(initialStore, props, '/parent/configure/integrations/resourceId');

    userEvent.click(screen.getByText('Cancel'));
    expect(mockhandleStackClose).toHaveBeenCalled();
  });

  test('should go back to parents on cancel when handleStackClose or onclose is no provided', () => {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = integrations;
    initialStore.getState().session.oAuthAuthorize = {resourceId: {authorized: true}};
    initialStore.getState().session.resource.resourceId = '56d6b7786f8ed15e4d0f9b92';
    const props = {
      resource: {type: 'netsuite'},
      onSubmitComplete: mockonSubmitComplete,
      integrationId: '60e2efb81797d0701d813755',
      mode: 'unknownmode',
      isResourceStaged: false,
      setIsResourceStaged: mocksetIsResourceStaged,
    };

    renderFunction(initialStore, props, '/parent/configure/integrations/resourceId');

    userEvent.click(screen.getByText('Cancel'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/parent');
  });
  test('should click on cancel when install = "ss-install"', () => {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = integrations;
    initialStore.getState().session.oAuthAuthorize = {resourceId: {authorized: true}};
    initialStore.getState().session.resource.resourceId = '56d6b7786f8ed15e4d0f9b92';
    const props = {
      resource: {type: 'netsuite'},
      onSubmitComplete: mockonSubmitComplete,
      integrationId: '60e2efb81797d0701d813755',
      mode: 'ss-install',
      isResourceStaged: false,
      setIsResourceStaged: mocksetIsResourceStaged,
    };

    renderFunction(initialStore, props, '/parent/configure/integrations/resourceId');

    userEvent.click(screen.getByText('Cancel'));
    expect(mockHistoryPush).not.toHaveBeenCalled();
    userEvent.click(screen.getByText('AddOrSelectonSubmitComplete'));
    expect(mockHistoryPush).not.toHaveBeenCalled();
  });
  test('should verify the resourceobject which has been passed in Add or select componenet', () => {
    const props = {
      resourceId: '/parent',
      mode: 'ss-install',
      resource: {type: 'netsuite'},
      onSubmitComplete: mockonSubmitComplete,
      handleStackClose: mockhandleStackClose,
      onClose: mockonClose,
    };

    renderFunction(initialStore, props, '/parent/configure/integrations/resourceId');

    userEvent.click(screen.getByText('AddOrSelectonSubmitComplete'));
    expect(mockObjectCall).toHaveBeenCalledWith({netsuite: {type: 'netsuite'}, type: 'netsuite'});
  });
});

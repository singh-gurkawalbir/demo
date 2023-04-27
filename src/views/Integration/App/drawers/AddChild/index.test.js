import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import IntegrationAppAddNewChild from '.';
import { getCreatedStore } from '../../../../../store';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import actions from '../../../../../actions';

let initialStore;
let mockConnectionId;
let mockInstallURL;
let mockForm;
let mockIsTriggered;
let mockIsVerifying;
const mockInstallerFunction = jest.fn();
const mockHistoryPush = jest.fn();
const mockOpenExternalURL = jest.fn();
const mockStep = (_connectionId, installURL, form, isTriggered, verifying) => ({
  _connectionId,
  installURL,
  installerFunction: mockInstallerFunction,
  form,
  isTriggered,
  verifying,
});

// Mocking useHistory & Redirect as part of unit testing
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

// Mocking Spinner as part of unit testing
jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  Spinner: () => (
    <div>
      <div>Mocking Spinner</div>
    </div>
  ),
}));

// Mocking child component loader as part of unit testing
jest.mock('../../../../../components/Loader', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/Loader'),
  default: props => (
    <div>
      Mocking Loader
      <div>{props.children}</div>
    </div>
  ),
}));

jest.mock('../../../../../utils/window', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../utils/window'),
  default: props => mockOpenExternalURL(props),
}));

// Mocking buildDrawerUrl as part of unit testing
jest.mock('../../../../../utils/rightDrawer', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../utils/rightDrawer'),
  buildDrawerUrl: jest.fn().mockReturnValue('Mock BuildDrawerURL'),
}));

// Mocking load resources as part of unit testing
jest.mock('../../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/LoadResources'),
  default: props => (
    <div>
      <div>Mock Load Resources</div>
      <div>resources = {JSON.stringify(props.resources)}</div>
      <div>{props.children}</div>
    </div>
  ),
}));

// Mocking CeligoPageBar component as part of unit testing
jest.mock('../../../../../components/CeligoPageBar', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/CeligoPageBar'),
  default: props => (
    <>
      <div>Mocking CeligoPageBar</div>
      <div>title = {props.title}</div>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking CloseIcon component as part of unit testing
jest.mock('../../../../../components/icons/CloseIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/icons/CloseIcon'),
  default: () => (
    <>
      <div>Mocking Close Icon</div>
    </>
  ),
}));

// Mocking FormStepDrawer component as part of unit testing
jest.mock('../../../../../components/InstallStep/FormStep', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/InstallStep/FormStep'),
  default: props => (
    <>
      <div>Mocking FormStepDrawer</div>
      <div>integrationId = {props.integrationId}</div>
      <button type="button" onClick={() => props.formCloseHandler()}>Close</button>
    </>
  ),
}));

// Mocking ResourceSetup component as part of unit testing
jest.mock('../../../../../components/ResourceSetup/Drawer', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/ResourceSetup/Drawer'),
  default: props => (
    <>
      <div>Mocking ResourceSetupDrawer</div>
      <div>integrationId = {props.integrationId}</div>
      <button type="button" onClick={() => props.onSubmitComplete()}>Submit</button>
    </>
  ),
}));

// Mocking InstallationStep component as part of unit testing
jest.mock('../../../../../components/InstallStep', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/InstallStep'),
  default: props => (
    <>
      <div>Mocking InstallationStep</div>
      <div>key = {props.key}</div>
      <button type="button" onClick={() => props.handleStepClick(mockStep(mockConnectionId, mockInstallURL, mockForm, mockIsTriggered, mockIsVerifying))}>Handle Step Click</button>
      <div>index = {props.index}</div>
      <div>step = {JSON.stringify(props.step)}</div>
    </>
  ),
}));

function initIntegrationAppAddNewChild({addChildData, integrationData}) {
  mutateStore(initialStore, draft => {
    draft.session.integrationApps.addChild = addChildData;
    draft.data.resources.integrations = integrationData;
  });
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/test/123'}]}
    >
      <Route
        path="/test/:integrationId"
        params={{integrationId: '123'}}
      >
        <IntegrationAppAddNewChild />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for IntegrationAppAddNewChild', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
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
    mockDispatchFn.mockClear();
    mockInstallerFunction.mockClear();
    mockHistoryPush.mockClear();
    mockOpenExternalURL.mockClear();
  });
  test('should test loader and spinner when there are no addNewChildSteps', () => {
    initIntegrationAppAddNewChild({addChildData: {}});
    expect(screen.getByText(/mocking loader/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking spinner/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', {
      name: /loading/i,
    })).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.child.addNew('123'));
  });
  test('should test addNewChild when there are errors', () => {
    initIntegrationAppAddNewChild(
      {
        addChildData:
            {
              123: {error: 'Testing Error'},
            },
        integrationData: [
          {
            _id: '123',
            name: 'Integration Name',
            _connectorId: 'connectorId',
          },
        ],
      }
    );
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/IntegrationName/123/flows');
  });
  test('should test addNewChild when there are addNewChildSteps when there is a store label in the settings', () => {
    initIntegrationAppAddNewChild(
      {
        addChildData:
            {
              123: {
                steps: [
                  {
                    type: 'form',
                    isCurrentStep: true,
                  },
                ],
              },
            },
        integrationData: [
          {
            _id: '123',
            name: 'Integration Name',
            _connectorId: 'connectorId',
            settings: {
              defaultSectionId: '',
              storeLabel: 'Test store label',
            },
            children: [],
          },
        ],
      }
    );
    expect(screen.getByText(/mock load resources/i)).toBeInTheDocument();
    expect(screen.getByText(/resources = \["integrations","connections"\]/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking celigopagebar/i)).toBeInTheDocument();
    expect(screen.getByText(/title = add new test store label/i)).toBeInTheDocument();
    expect(screen.getByText(/complete the below steps to add new test store label\./i)).toBeInTheDocument();
    expect(screen.getByText('Mocking InstallationStep')).toBeInTheDocument();
  });
  test('should test addNewChild when there are addNewChildSteps with the store label in the settings and test the handle step click when there is connection id and isTriggered is set to true', async () => {
    mockConnectionId = '4567';
    mockIsTriggered = true;
    initIntegrationAppAddNewChild(
      {
        addChildData:
            {
              123: {
                steps: [
                  {
                    type: 'form',
                    isCurrentStep: true,
                  },
                ],
              },
            },
        integrationData: [
          {
            _id: '123',
            name: 'Integration Name',
            _connectorId: 'connectorId',
            settings: {
              defaultSectionId: '',
              storeLabel: 'Test store label',
            },
            children: [],
          },
        ],
      }
    );
    expect(screen.getByText(/mocking installationstep/i)).toBeInTheDocument();
    const handleStepButtonNode = screen.getByRole('button', {
      name: /handle step click/i,
    });

    expect(handleStepButtonNode).toBeInTheDocument();
    await userEvent.click(handleStepButtonNode);
    expect(mockDispatchFn).not.toHaveBeenCalled();
    expect(mockHistoryPush).not.toHaveBeenCalled();
  });
  test('should test addNewChild when there are addNewChildSteps with the store label in the settings and test the handle step click when there is connection id and isTriggered is set to false', async () => {
    mockConnectionId = '4567';
    mockIsTriggered = false;
    initIntegrationAppAddNewChild(
      {
        addChildData:
            {
              123: {
                steps: [
                  {
                    type: 'form',
                    isCurrentStep: true,
                  },
                ],
              },
            },
        integrationData: [
          {
            _id: '123',
            name: 'Integration Name',
            _connectorId: 'connectorId',
            settings: {
              defaultSectionId: '',
              storeLabel: 'Test store label',
            },
            children: [],
          },
        ],
      }
    );
    expect(screen.getByText(/mocking installationstep/i)).toBeInTheDocument();
    const handleStepButtonNode = screen.getByRole('button', {
      name: /handle step click/i,
    });

    expect(handleStepButtonNode).toBeInTheDocument();
    await userEvent.click(handleStepButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('Mock BuildDrawerURL');
  });
  test('should test addNewChild when there are addNewChildSteps with the store label in the settings and test the handle step click when there is installURL, no connection id and isTriggered is set to false', async () => {
    mockConnectionId = '';
    mockIsTriggered = false;
    mockInstallURL = '/test';
    initIntegrationAppAddNewChild(
      {
        addChildData:
            {
              123: {
                steps: [
                  {
                    type: 'form',
                    isCurrentStep: true,
                  },
                ],
              },
            },
        integrationData: [
          {
            _id: '123',
            name: 'Integration Name',
            _connectorId: 'connectorId',
            settings: {
              defaultSectionId: '',
              storeLabel: 'Test store label',
            },
            children: [],
          },
        ],
      }
    );
    expect(screen.getByText(/mocking installationstep/i)).toBeInTheDocument();
    const handleStepButtonNode = screen.getByRole('button', {
      name: /handle step click/i,
    });

    expect(handleStepButtonNode).toBeInTheDocument();
    await userEvent.click(handleStepButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.child.updateStep('123', mockInstallerFunction, 'inProgress'));
    expect(mockOpenExternalURL).toHaveBeenCalledWith({url: '/test'});
  });
  test('should test addNewChild when there are addNewChildSteps with the store label in the settings and test the handle step click when there is installURL, no connection id and isVerifying is set to false', async () => {
    mockConnectionId = '';
    mockInstallURL = '/test';
    mockIsTriggered = true;
    mockIsVerifying = false;
    initIntegrationAppAddNewChild(
      {
        addChildData:
            {
              123: {
                steps: [
                  {
                    type: 'form',
                    isCurrentStep: true,
                  },
                ],
              },
            },
        integrationData: [
          {
            _id: '123',
            name: 'Integration Name',
            _connectorId: 'connectorId',
            settings: {
              defaultSectionId: '',
              storeLabel: 'Test store label',
            },
            children: [],
          },
        ],
      }
    );
    expect(screen.getByText(/mocking installationstep/i)).toBeInTheDocument();
    const handleStepButtonNode = screen.getByRole('button', {
      name: /handle step click/i,
    });

    expect(handleStepButtonNode).toBeInTheDocument();
    await userEvent.click(handleStepButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.child.updateStep('123', mockInstallerFunction, 'verify'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.child.installStep('123', mockInstallerFunction));
  });
  test('should test addNewChild when there are addNewChildSteps with the store label in the settings and test the handle step click when there is installURL, no connection id and verifying is set to true', async () => {
    mockInstallURL = '/test';
    mockIsTriggered = true;
    mockIsVerifying = true;
    initIntegrationAppAddNewChild(
      {
        addChildData:
            {
              123: {
                steps: [
                  {
                    type: 'form',
                    isCurrentStep: true,
                  },
                ],
              },
            },
        integrationData: [
          {
            _id: '123',
            name: 'Integration Name',
            _connectorId: 'connectorId',
            settings: {
              defaultSectionId: '',
              storeLabel: 'Test store label',
            },
            children: [],
          },
        ],
      }
    );
    expect(screen.getByText(/mocking installationstep/i)).toBeInTheDocument();
    const handleStepButtonNode = screen.getByRole('button', {
      name: /handle step click/i,
    });

    expect(handleStepButtonNode).toBeInTheDocument();
    await userEvent.click(handleStepButtonNode);
    expect(mockDispatchFn).not.toHaveBeenCalled();
  });
  test('should test addNewChild when there are addNewChildSteps with the store label in the settings and test the handle step click when the form is not empty', async () => {
    mockConnectionId = '';
    mockInstallURL = '';
    mockIsTriggered = true;
    mockForm = 'test form';
    initIntegrationAppAddNewChild(
      {
        addChildData:
            {
              123: {
                steps: [
                  {
                    type: 'form',
                    isCurrentStep: true,
                  },
                ],
              },
            },
        integrationData: [
          {
            _id: '123',
            name: 'Integration Name',
            _connectorId: 'connectorId',
            settings: {
              defaultSectionId: '',
              storeLabel: 'Test store label',
            },
            children: [],
          },
        ],
      }
    );
    expect(screen.getByText(/mocking installationstep/i)).toBeInTheDocument();
    const handleStepButtonNode = screen.getByRole('button', {
      name: /handle step click/i,
    });

    expect(handleStepButtonNode).toBeInTheDocument();
    await userEvent.click(handleStepButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.child.updateStep('123', mockInstallerFunction, 'inProgress', true));
    expect(mockHistoryPush).toHaveBeenCalledWith('Mock BuildDrawerURL');
  });
  test('should test addNewChild when there are addNewChildSteps with the store label in the settings and test the handle step click when the triggered is false', async () => {
    mockConnectionId = '';
    mockInstallURL = '';
    mockForm = '';
    mockIsTriggered = false;
    initIntegrationAppAddNewChild(
      {
        addChildData:
            {
              123: {
                steps: [
                  {
                    type: 'form',
                    isCurrentStep: true,
                  },
                ],
              },
            },
        integrationData: [
          {
            _id: '123',
            name: 'Integration Name',
            _connectorId: 'connectorId',
            settings: {
              defaultSectionId: '',
              storeLabel: 'Test store label',
            },
            children: [],
          },
        ],
      }
    );
    expect(screen.getByText(/mocking installationstep/i)).toBeInTheDocument();
    const handleStepButtonNode = screen.getByRole('button', {
      name: /handle step click/i,
    });

    expect(handleStepButtonNode).toBeInTheDocument();
    await userEvent.click(handleStepButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.child.updateStep('123', mockInstallerFunction, 'inProgress'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.child.installStep('123', mockInstallerFunction));
  });
  test('should test addNewChild by clicking on handlSubmitComplete', async () => {
    initIntegrationAppAddNewChild(
      {
        addChildData:
            {
              123: {
                steps: [
                  {
                    type: 'form',
                    isCurrentStep: true,
                    installerFunction: mockInstallerFunction,
                  },
                ],
              },
            },
        integrationData: [
          {
            _id: '123',
            name: 'Integration Name',
            _connectorId: 'connectorId',
            settings: {
              defaultSectionId: '',
              storeLabel: 'Test store label',
            },
            children: [],
          },
        ],
      }
    );
    expect(screen.getByText(/mocking resourcesetupdrawer/i)).toBeInTheDocument();
    const submitButtonNode = screen.getByRole('button', {
      name: /submit/i,
    });

    expect(submitButtonNode).toBeInTheDocument();
    await userEvent.click(submitButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.child.updateStep('123', mockInstallerFunction, 'inProgress'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.child.installStep('123', mockInstallerFunction));
  });
  test('should test addNewChild by clicking on close button', async () => {
    initIntegrationAppAddNewChild(
      {
        addChildData:
            {
              123: {
                steps: [
                  {
                    type: 'form',
                    isCurrentStep: true,
                    installerFunction: mockInstallerFunction,
                  },
                ],
              },
            },
        integrationData: [
          {
            _id: '123',
            name: 'Integration Name',
            _connectorId: 'connectorId',
            settings: {
              defaultSectionId: '',
              storeLabel: 'Test store label',
            },
            children: [],
          },
        ],
      }
    );
    expect(screen.getByText(/mocking formstepdrawer/i)).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {
      name: /close/i,
    });

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.child.updateStep('123', mockInstallerFunction, 'reset'));
  });
  test('should test addNewChild uninstall button when the integration app settings has defaultSectionId', async () => {
    initIntegrationAppAddNewChild(
      {
        addChildData:
            {
              123: {
                steps: [
                  {
                    type: 'form',
                    isCurrentStep: true,
                    installerFunction: mockInstallerFunction,
                  },
                ],
              },
            },
        integrationData: [
          {
            _id: '123',
            name: 'Integration Name',
            _connectorId: 'connectorId',
            settings: {
              defaultSectionId: 'testid',
              storeLabel: 'Test store label',
            },
            children: [],
          },
        ],
      }
    );
    expect(screen.getByText(/mocking close icon/i)).toBeInTheDocument();
    expect(screen.getByText(/uninstall/i)).toBeInTheDocument();
    const uninstallButtonNode = screen.getByRole('button', { name: 'Mocking Close Icon Uninstall' });

    expect(uninstallButtonNode).toBeInTheDocument();
    await userEvent.click(uninstallButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/IntegrationName/123/uninstall/child/testid');
  });
  test('should test addNewChild when the step setup is completed', () => {
    initIntegrationAppAddNewChild(
      {
        addChildData:
            {
              123: {
                steps: [
                  {
                    type: 'form',
                    isCurrentStep: true,
                    installerFunction: mockInstallerFunction,
                    completed: true,
                  },
                ],
              },
            },
        integrationData: [
          {
            _id: '123',
            name: 'Integration Name',
            _connectorId: 'connectorId',
            settings: {
              defaultSectionId: 'testid',
              storeLabel: 'Test store label',
            },
            children: [{
              value: 'childid',
            }],
          },
        ],
      }
    );

    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.child.clearSteps('123'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.request('integrations', '123'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('flows'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('exports', undefined, undefined, '123'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('imports', undefined, undefined, '123'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('connections', undefined, undefined, '123'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('asynchelpers', undefined, undefined, '123'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/IntegrationName/123/flows');
  });
});

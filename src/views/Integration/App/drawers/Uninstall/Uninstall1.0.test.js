
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import Uninstaller1 from './Uninstall1.0';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import actions from '../../../../../actions';

let initialStore;
let mockInstallerStep;
let mockIsTriggeredData;
let mockVerifyingData;
const mockUninstallerFunction = jest.fn();

const mockStep = (installURL, isTriggered, verifying) => ({
  installURL,
  uninstallerFunction: mockUninstallerFunction,
  isTriggered,
  verifying,
});
const mockOpenExternalURL = jest.fn();
const mockHistoryPush = jest.fn();

// Mocking useHistory & Redirect as part of unit testing
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  Redirect: props => (
    <>
      <div>Mocking Redirect</div>
      <div>push = {props.push}</div>
      <div>to = {props.to}</div>
    </>
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

// Mocking child component Spinner as part of unit testing
jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  Spinner: () => <div>Mocking Spinner</div>,
}));

// Mocking LoadResources component Spinner as part of unit testing
jest.mock('../../../../../components/LoadResource', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/LoadResource'),
  default: props => (
    <>
      <div>Mocking LoadResources</div>
      <div>resources = {props.resourceType}</div>
    </>
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
// Mocking InstallationStep component as part of unit testing
jest.mock('../../../../../components/InstallStep', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/InstallStep'),
  default: props => {
    if (mockInstallerStep) {
      return (
        <>
          <div>Mocking InstallationStep</div>
          <div>key = {props.key}</div>
          <div>mode = {props.mode}</div>
          <button type="button" onClick={() => props.handleStepClick(mockStep(true, mockIsTriggeredData, mockVerifyingData))}>Handle Step Click</button>
          <div>index = {props.index}</div>
          <div>step = {JSON.stringify(props.step)}</div>
        </>
      );
    }

    return (
      <>
        <div>Mocking InstallationStep</div>
        <div>key = {props.key}</div>
        <div>mode = {props.mode}</div>
        <button type="button" onClick={() => props.handleStepClick(mockStep(false, mockIsTriggeredData, mockVerifyingData))}>Handle Step Click</button>
        <div>index = {props.index}</div>
        <div>step = {JSON.stringify(props.step)}</div>
      </>
    );
  },
}));

jest.mock('../../../../../utils/window', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../utils/window'),
  default: props => mockOpenExternalURL(props),
}));

function initUninstaller1({ integration, integrationId, childId, uninstallerData }) {
  mutateStore(initialStore, draft => {
    draft.session.integrationApps.uninstaller = uninstallerData;
  });
  const ui = (
    <MemoryRouter>
      <Uninstaller1 integration={integration} integrationId={integrationId} childId={childId} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for Uninstaller', () => {
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
    mockHistoryPush.mockClear();
    mockOpenExternalURL.mockClear();
    mockUninstallerFunction.mockClear();
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should return mock load resource when there is no integrations', () => {
    initUninstaller1({integration: {}, integrationId: '12345', childId: '67890', uninstallerData: {}});
    expect(screen.getByText(/Mocking LoadResources/i)).toBeInTheDocument();
    expect(screen.getByText(/resources = integrations/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller.preUninstall('67890', '12345'));
  });
  test('should test the spinner when ther are no uninstall steps', () => {
    initUninstaller1({integration: {
      _id: '12345',
      mode: 'settings',
      name: 'Test Integration App',
      children: [{
        label: 'Test Label',
        hidden: false,
        mode: 'uninstall',
        value: '67890',
      }],
      settings: {defaultSectionId: '67890'},
    },
    integrationId: '12345',
    childId: '67890',
    uninstallerData: {}});
    expect(screen.getByText(/mocking loader/i)).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking spinner/i)).toBeInTheDocument();
  });
  test('should test redirect when there are errors', () => {
    initUninstaller1({integration: {
      _id: '12345',
      mode: 'settings',
      name: 'Test Integration App',
      children: [{
        label: 'Test Label',
        hidden: false,
        mode: 'uninstall',
        value: '67890',
      }],
      settings: {defaultSectionId: '67890'},
    },
    integrationId: '12345',
    childId: '67890',
    uninstallerData: {12345: {steps: [{name: 'Test App', description: 'Test Description', completed: false, removeIntegration: 'true',
    }],
    error: 'test error'}}});
    expect.anything();
    expect(screen.getByText(/Mocking Redirect/i)).toBeInTheDocument();
    expect(screen.getByText('to = /home')).toBeInTheDocument();
  });
  test('should test title and infotext when there a child name', () => {
    initUninstaller1({integration: {
      _id: '12345',
      mode: 'settings',
      name: 'Test Integration App',
      children: [{
        label: 'Test Label',
        hidden: false,
        mode: 'uninstall',
        value: '67890',
      }],
      settings: {defaultSectionId: '67890'},
    },
    integrationId: '12345',
    childId: '67890',
    uninstallerData: {12345: {steps: [{name: 'Test App', description: 'Test Description', completed: false, removeIntegration: 'true',
    }]}}});
    expect.anything();
    expect(screen.getByText(/mocking celigopagebar/i)).toBeInTheDocument();
    expect(screen.getByText(/title = uninstall app: test integration app - test label/i)).toBeInTheDocument();
    expect(screen.getByText(
      /complete the below steps to uninstall your integration app child test label/i
    )).toBeInTheDocument();
  });
  test('should test title and infotext when there is no child name', () => {
    initUninstaller1({integration: {
      _id: '12345',
      mode: 'settings',
      name: 'Test Integration App',
      settings: {defaultSectionId: '67890'},
    },
    integrationId: '12345',
    childId: '67890',
    uninstallerData: {12345: {steps: [{name: 'Test App', description: 'Test Description', completed: false, removeIntegration: 'true',
    }]}}});
    expect(screen.getByText(/mocking celigopagebar/i)).toBeInTheDocument();
    expect(screen.getByText(/title = uninstall app: test integration app/i)).toBeInTheDocument();
    expect(screen.getByText(
      /complete the below steps to uninstall your integration app/i
    )).toBeInTheDocument();
  });
  test('should test the installation steps by clicking on a step and when installURL set to true and istriggered set to false', async () => {
    mockInstallerStep = true;
    mockIsTriggeredData = false;
    mockVerifyingData = false;
    initUninstaller1({integration: {
      _id: '12345',
      mode: 'settings',
      name: 'Test Integration App',
      settings: {defaultSectionId: '67890'},
    },
    integrationId: '12345',
    childId: '67890',
    uninstallerData: {12345: {steps: [{name: 'Test App', description: 'Test Description', completed: false, removeIntegration: 'true',
    }]}}});
    expect(screen.getByText(/mocking celigopagebar/i)).toBeInTheDocument();
    expect(screen.getByText(/title = uninstall app: test integration app/i)).toBeInTheDocument();
    expect(screen.getByText(
      /complete the below steps to uninstall your integration app/i
    )).toBeInTheDocument();
    const handleStepClick = screen.getByRole('button', {name: /Handle Step Click/i});

    expect(handleStepClick).toBeInTheDocument();
    await userEvent.click(handleStepClick);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller.updateStep('12345', mockUninstallerFunction, 'inProgress'));
    expect(mockOpenExternalURL).toHaveBeenCalledWith({url: true});
  });
  test('should test the installation steps by clicking on a step and when installURL set to true and istriggered set to true', async () => {
    mockInstallerStep = true;
    mockIsTriggeredData = true;
    mockVerifyingData = false;
    initUninstaller1({integration: {
      _id: '12345',
      mode: 'settings',
      name: 'Test Integration App',
      settings: {defaultSectionId: '67890'},
    },
    integrationId: '12345',
    childId: '67890',
    uninstallerData: {12345: {steps: [{name: 'Test App', description: 'Test Description', completed: false, removeIntegration: 'true',
    }]}}});
    expect(screen.getByText(/mocking celigopagebar/i)).toBeInTheDocument();
    expect(screen.getByText(/title = uninstall app: test integration app/i)).toBeInTheDocument();
    expect(screen.getByText(
      /complete the below steps to uninstall your integration app/i
    )).toBeInTheDocument();
    const handleStepClick = screen.getByRole('button', {name: /Handle Step Click/i});

    expect(handleStepClick).toBeInTheDocument();
    await userEvent.click(handleStepClick);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller.updateStep('12345', mockUninstallerFunction, 'verify'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller.stepUninstall('12345', mockUninstallerFunction));
  });
  test('should test the installation steps by clicking on a step and when installURL set to false and istriggered set to false', async () => {
    mockInstallerStep = false;
    mockIsTriggeredData = false;
    mockVerifyingData = false;
    initUninstaller1({integration: {
      _id: '12345',
      mode: 'settings',
      name: 'Test Integration App',
      settings: {defaultSectionId: '67890'},
    },
    integrationId: '12345',
    childId: '67890',
    uninstallerData: {12345: {steps: [{name: 'Test App', description: 'Test Description', completed: false, removeIntegration: 'true',
    }]}}});
    expect(screen.getByText(/mocking celigopagebar/i)).toBeInTheDocument();
    expect(screen.getByText(/title = uninstall app: test integration app/i)).toBeInTheDocument();
    expect(screen.getByText(
      /complete the below steps to uninstall your integration app/i
    )).toBeInTheDocument();
    const handleStepClick = screen.getByRole('button', {name: /Handle Step Click/i});

    expect(handleStepClick).toBeInTheDocument();
    await userEvent.click(handleStepClick);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller.updateStep('12345', mockUninstallerFunction, 'inProgress'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller.stepUninstall('67890', '12345', mockUninstallerFunction));
  });
  test('should test the loader with uninstalling text', () => {
    mockInstallerStep = false;
    mockIsTriggeredData = false;
    mockVerifyingData = false;
    initUninstaller1({integration: {
      _id: '12345',
      mode: 'uninstall',
      name: 'Test Integration App',
      settings: {defaultSectionId: '67890'},
    },
    integrationId: '12345',
    childId: '67890',
    uninstallerData: {12345: {steps: {name: 'Test App', description: 'Test Description', completed: false, removeIntegration: true,
    }}}});
    expect(screen.getByText(/Mocking Loader/i)).toBeInTheDocument();
    expect(screen.getByText(/Uninstalling/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller.uninstallIntegration('12345'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/home');
  });
  test('should test uninstall when uninstall is set to completed and when mode is not set to uninstall', () => {
    mockInstallerStep = false;
    mockIsTriggeredData = false;
    mockVerifyingData = false;
    initUninstaller1({integration: {
      _id: '12345',
      mode: 'settings',
      name: 'Test Integration App',
      settings: {defaultSectionId: '67890'},
    },
    integrationId: '12345',
    childId: '67890',
    uninstallerData: {12345: {steps: [{name: 'Test App', description: 'Test Description', completed: true, removeIntegration: true,
    }]}}});
    expect(screen.getByText(/Mocking CeligoPageBar/i)).toBeInTheDocument();
    expect(screen.getByText(/title = Uninstall app: Test Integration App/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller.clearSteps('12345'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/TestIntegrationApp/12345/flows');
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.child.clearSteps('12345'));
  });
  test('should test uninstall when completed is set to true and when mode is set to uninstall', () => {
    mockInstallerStep = false;
    mockIsTriggeredData = false;
    mockVerifyingData = false;
    initUninstaller1({integration: {
      _id: '12345',
      mode: 'uninstall',
      name: 'Test Integration App',
      settings: {defaultSectionId: '67890'},
    },
    integrationId: '12345',
    childId: '67890',
    uninstallerData: {12345: {steps: [{name: 'Test App', description: 'Test Description', completed: true, removeIntegration: true,
    }]}}});
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller.uninstallIntegration('12345'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/home');
  });
});

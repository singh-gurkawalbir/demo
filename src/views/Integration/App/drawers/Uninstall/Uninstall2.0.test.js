import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {screen} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import Uninstaller2 from './Uninstall2.0';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import actions from '../../../../../actions';

let initialStore;
let mockTypeData;
let mockIsTriggeredData;
let mockFormData;
let mockUrlData;
let mockVerifyingData;

const mockStep = (type, isTriggered, form, url, verifying) => ({
  type,
  isTriggered,
  form,
  url,
  verifying,
});
const mockOpenExternalURL = jest.fn();
const mockBuildURL = jest.fn();
const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

// Mocking Route paths as part of unit testing
jest.mock('../../../../../utils/routePaths', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../utils/routePaths'),
  default: jest.fn().mockReturnValue('Mock Route Path'),
}));

// Mocking Redirect as part of unit testing
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: mockHistoryReplace,
  }),
  Redirect: props => (
    <div>
      <div>Mocking Redirect</div>
      <div>push = {props.push}</div>
      <div>to = {props.to}</div>
    </div>
  ),
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

// Mocking FormStepDrawer component as part of unit testing
jest.mock('../../../../../components/InstallStep/FormStep', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/InstallStep/FormStep'),
  default: props => (
    <>
      <div>Mocking FormStepDrawer</div>
      <div>integrationId = {props.integrationId}</div>
      <button type="button" onClick={() => props.formCloseHandler()}>Close</button>
      <button type="button" onClick={() => props.formSubmitHandler('formVal')} >Submit</button>
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
      <div>mode = {props.mode}</div>
      <button type="button" onClick={() => props.handleStepClick(mockStep(mockTypeData, mockIsTriggeredData, mockFormData, mockUrlData, mockVerifyingData))}>Handle Step Click</button>
      <div>index = {props.index}</div>
      <div>step = {JSON.stringify(props.step)}</div>
    </>
  ),
}));

jest.mock('../../../../../utils/window', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../utils/window'),
  default: props => mockOpenExternalURL(props),
}));

jest.mock('../../../../../utils/rightDrawer', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../utils/rightDrawer'),
  buildDrawerUrl: jest.fn().mockReturnValue('Mock BuildDrawerURL'),
}));

function initUninstaller2({integration, integrationId, uninstaller2Data, integrationsData}) {
  mutateStore(initialStore, draft => {
    draft.session.integrationApps.uninstaller2 = uninstaller2Data;
    draft.data.resources.integrations = integrationsData;
  });
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/test'}]}
    >
      <Route
        path="/test"
      >
        <Uninstaller2 integration={integration} integrationId={integrationId} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for Uninstaller2', () => {
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
    mockHistoryReplace.mockClear();
    mockOpenExternalURL.mockClear();
    mockBuildURL.mockClear();
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should test uninstaller 2 and it should render mock redirect when error is set to true', () => {
    initUninstaller2(
      {
        integration: {mode: 'settings', name: 'Test Integration Name'},
        integrationId: '12345',
        uninstaller2Data: {
          12345: {
            steps: [
            ],
            isFetched: true,
            error: true,
            isComplete: true,
          },
        },
        integrationsData: [
          {
            _id: '12345',
          },
        ],
      }
    );
    expect(screen.getByText(/Mocking Redirect/i)).toBeInTheDocument();
    expect(screen.getByText(/push =/i)).toBeInTheDocument();
    expect(screen.getByText(/to = Mock Route Path/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller2.init('12345'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller2.clearSteps('12345'));
    expect(mockHistoryReplace).toHaveBeenCalledWith('Mock Route Path');
  });
  test('should test spinner when there are no uninstaller steps', () => {
    initUninstaller2(
      {
        integration: {mode: 'settings', name: 'Test Integration Name'},
        integrationId: '12345',
        uninstaller2Data: {
          12345: {
            steps: [
            ],
            isFetched: true,
            error: false,
            isComplete: true,
          },
        },
        integrationsData: [
          {
            _id: '12345',
          },
        ],
      }
    );
    expect(screen.getByText(/Mocking Spinner/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller2.init('12345'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller2.clearSteps('12345'));
  });
  test('should test uninstaller 2 when the steps are being fetched', () => {
    initUninstaller2(
      {
        integration: {mode: 'uninstall', name: 'Test Integration Name'},
        integrationId: '12345',
        uninstaller2Data: {
          12345: {
            steps: [
              {
                type: 'form',
                stepName: 'stepName',
                stepId: 'stepId',
                completed: false,
              },
            ],
            isFetched: false,
            error: false,
            isComplete: true,
          },
        },
        integrationsData: [
          {
            _id: '12345',
          },
        ],
      }
    );
    expect(screen.getByText(/mocking celigopagebar/i)).toBeInTheDocument();
    expect(screen.getByText(/title = uninstall app: test integration name/i)).toBeInTheDocument();
    expect(screen.getByText(
      /complete the below steps to uninstall your integration app\./i)).toBeInTheDocument();
    expect(screen.getByText(/mocking installationstep/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller2.requestSteps('12345'));
  });
  test('should test uninstaller2 by clicking on steps when type has set to url and is triggere has set to false', async () => {
    mockTypeData = 'url';
    mockIsTriggeredData = false;
    mockFormData = true;
    mockUrlData = '/test';
    mockVerifyingData = false;
    initUninstaller2(
      {
        integration: {mode: 'uninstall', name: 'Test Integration Name'},
        integrationId: '12345',
        uninstaller2Data: {
          12345: {
            steps: [
              {
                type: 'url',
                stepName: 'stepName',
                stepId: 'stepId',
                completed: false,
              },
            ],
            isFetched: true,
            error: false,
            isComplete: true,
          },
        },
        integrationsData: [
          {
            _id: '12345',
          },
        ],
      }
    );
    expect(screen.getByText(/mocking celigopagebar/i)).toBeInTheDocument();
    expect(screen.getByText(/title = uninstall app: test integration name/i)).toBeInTheDocument();
    expect(screen.getByText(
      /complete the below steps to uninstall your integration app\./i)).toBeInTheDocument();
    expect(screen.getByText(/mocking installationstep/i)).toBeInTheDocument();
    const handleStepClickButtonNode = screen.getByRole('button', {name: 'Handle Step Click'});

    expect(handleStepClickButtonNode).toBeInTheDocument();
    await userEvent.click(handleStepClickButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller2.updateStep('12345', 'inProgress'));
    expect(mockOpenExternalURL).toHaveBeenCalledWith({url: '/test'});
  });
  test('should test uninstaller2 by clicking on steps when type has set to url and is triggere has set to true and verifying to true', async () => {
    mockTypeData = 'url';
    mockIsTriggeredData = true;
    mockFormData = true;
    mockUrlData = '/test';
    mockVerifyingData = true;
    initUninstaller2(
      {
        integration: {mode: 'uninstall', name: 'Test Integration Name'},
        integrationId: '12345',
        uninstaller2Data: {
          12345: {
            steps: [
              {
                type: 'url',
                stepName: 'stepName',
                stepId: 'stepId',
                completed: false,
              },
            ],
            isFetched: true,
            error: false,
            isComplete: true,
          },
        },
        integrationsData: [
          {
            _id: '12345',
          },
        ],
      }
    );
    expect(screen.getByText(/mocking celigopagebar/i)).toBeInTheDocument();
    expect(screen.getByText(/title = uninstall app: test integration name/i)).toBeInTheDocument();
    expect(screen.getByText(
      /complete the below steps to uninstall your integration app\./i)).toBeInTheDocument();
    expect(screen.getByText(/mocking installationstep/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller2.clearSteps('12345'));
    mockDispatchFn.mockClear();
    const handleStepClickButtonNode = screen.getByRole('button', {name: 'Handle Step Click'});

    expect(handleStepClickButtonNode).toBeInTheDocument();
    await userEvent.click(handleStepClickButtonNode);
    expect(mockDispatchFn).not.toHaveBeenCalled();
  });
  test('should test uninstaller2 by clicking on steps when type has set to url and is triggere has set to true', async () => {
    mockTypeData = 'url';
    mockIsTriggeredData = true;
    mockFormData = true;
    mockUrlData = '/test';
    mockVerifyingData = false;
    initUninstaller2(
      {
        integration: {mode: 'uninstall', name: 'Test Integration Name'},
        integrationId: '12345',
        uninstaller2Data: {
          12345: {
            steps: [
              {
                type: 'url',
                stepName: 'stepName',
                stepId: 'stepId',
                completed: false,
              },
            ],
            isFetched: true,
            error: false,
            isComplete: true,
          },
        },
        integrationsData: [
          {
            _id: '12345',
          },
        ],
      }
    );
    expect(screen.getByText(/mocking celigopagebar/i)).toBeInTheDocument();
    expect(screen.getByText(/title = uninstall app: test integration name/i)).toBeInTheDocument();
    expect(screen.getByText(
      /complete the below steps to uninstall your integration app\./i)).toBeInTheDocument();
    expect(screen.getByText(/mocking installationstep/i)).toBeInTheDocument();
    const handleStepClickButtonNode = screen.getByRole('button', {name: 'Handle Step Click'});

    expect(handleStepClickButtonNode).toBeInTheDocument();
    await userEvent.click(handleStepClickButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller2.updateStep('12345', 'verify'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller2.uninstallStep('12345'));
  });
  test('should test uninstaller2 by clicking on steps when type has set to form and is triggere has set to false', async () => {
    mockTypeData = 'form';
    mockIsTriggeredData = false;
    mockFormData = true;
    mockUrlData = '/test';
    mockVerifyingData = false;
    initUninstaller2(
      {
        integration: {mode: 'uninstall', name: 'Test Integration Name'},
        integrationId: '12345',
        uninstaller2Data: {
          12345: {
            steps: [
              {
                type: 'form',
                stepName: 'stepName',
                stepId: 'stepId',
                completed: false,
              },
            ],
            isFetched: true,
            error: false,
            isComplete: true,
          },
        },
        integrationsData: [
          {
            _id: '12345',
          },
        ],
      }
    );
    expect(screen.getByText(/mocking celigopagebar/i)).toBeInTheDocument();
    expect(screen.getByText(/title = uninstall app: test integration name/i)).toBeInTheDocument();
    expect(screen.getByText(
      /complete the below steps to uninstall your integration app\./i)).toBeInTheDocument();
    expect(screen.getByText(/mocking installationstep/i)).toBeInTheDocument();
    const handleStepClickButtonNode = screen.getByRole('button', {name: 'Handle Step Click'});

    expect(handleStepClickButtonNode).toBeInTheDocument();
    await userEvent.click(handleStepClickButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller2.updateStep('12345', 'inProgress'));
    expect(mockHistoryPush).toHaveBeenCalledWith('Mock BuildDrawerURL');
  });
  test('should test uninstaller2 by clicking on steps when type has not set to form and is triggere has set to false', async () => {
    mockTypeData = 'settings';
    mockIsTriggeredData = false;
    mockFormData = true;
    mockUrlData = '/test';
    mockVerifyingData = false;
    initUninstaller2(
      {
        integration: {mode: 'uninstall', name: 'Test Integration Name'},
        integrationId: '12345',
        uninstaller2Data: {
          12345: {
            steps: [
              {
                type: 'settings',
                stepName: 'stepName',
                stepId: 'stepId',
                completed: false,
              },
            ],
            isFetched: true,
            error: false,
            isComplete: true,
          },
        },
        integrationsData: [
          {
            _id: '12345',
          },
        ],
      }
    );
    expect(screen.getByText(/mocking celigopagebar/i)).toBeInTheDocument();
    expect(screen.getByText(/title = uninstall app: test integration name/i)).toBeInTheDocument();
    expect(screen.getByText(
      /complete the below steps to uninstall your integration app\./i)).toBeInTheDocument();
    expect(screen.getByText(/mocking installationstep/i)).toBeInTheDocument();
    const handleStepClickButtonNode = screen.getByRole('button', {name: 'Handle Step Click'});

    expect(handleStepClickButtonNode).toBeInTheDocument();
    await userEvent.click(handleStepClickButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller2.uninstallStep('12345'));
  });
  test('should test uninstaller2 form step drawer close button', async () => {
    mockTypeData = 'settings';
    mockIsTriggeredData = false;
    mockFormData = true;
    mockUrlData = '/test';
    mockVerifyingData = false;
    initUninstaller2(
      {
        integration: {mode: 'uninstall', name: 'Test Integration Name'},
        integrationId: '12345',
        uninstaller2Data: {
          12345: {
            steps: [
              {
                type: 'settings',
                stepName: 'stepName',
                stepId: 'stepId',
                completed: false,
              },
            ],
            isFetched: true,
            error: false,
            isComplete: true,
          },
        },
        integrationsData: [
          {
            _id: '12345',
          },
        ],
      }
    );
    expect(screen.getByText(/Mocking FormStepDrawer/i)).toBeInTheDocument();
    expect(screen.getByText(/integrationId = 12345/i)).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {name: /close/i});

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller2.updateStep('12345', 'reset'));
  });
  test('should test uninstaller2 form step drawer submit button', async () => {
    mockTypeData = 'settings';
    mockIsTriggeredData = false;
    mockFormData = true;
    mockUrlData = '/test';
    mockVerifyingData = false;
    initUninstaller2(
      {
        integration: {mode: 'uninstall', name: 'Test Integration Name'},
        integrationId: '12345',
        uninstaller2Data: {
          12345: {
            steps: [
              {
                type: 'settings',
                stepName: 'stepName',
                stepId: 'stepId',
                completed: false,
              },
            ],
            isFetched: true,
            error: false,
            isComplete: true,
          },
        },
        integrationsData: [
          {
            _id: '12345',
          },
        ],
      }
    );
    expect(screen.getByText(/Mocking FormStepDrawer/i)).toBeInTheDocument();
    expect(screen.getByText(/integrationId = 12345/i)).toBeInTheDocument();
    const submitButtonNode = screen.getByRole('button', {name: /submit/i});

    expect(submitButtonNode).toBeInTheDocument();
    await userEvent.click(submitButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.uninstaller2.uninstallStep('12345', 'formVal'));
  });
});

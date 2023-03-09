
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import InstallationStep from '.';
import actions from '../../actions';

const initialStore = reduxStore;

function initInstallation(props = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [{
      _id: '62bd4ab37b94d20de64e9eaa',
      lastModified: '2022-06-30T07:03:15.558Z',
      name: 'Clone - demoint',
      description: 'demo integration',
      install: [],
      mode: 'install',
      sandbox: false,
      _connectionid: '62bd43c87b94d20de64e9ab3',
      _registeredConnectionIds: [],
      installSteps: [
        {
          name: 'demo',
          completed: false,
          type: 'connection',
          sourceConnection: {
            _id: '62bd43c87b94d20de64e9ab3',
            type: 'http',
            name: 'demo',
            http: {
              formType: 'rest',
            },
          },
        },
        {
          name: 'demo sales',
          completed: false,
          type: 'connection',
          sourceConnection: {
            _id: '62bd452420ecb90e02f2a6f0',
            type: 'salesforce',
            name: 'demo sales',
          },
        },
        {
          name: 'Copy resources now from template zip',
          completed: false,
          type: 'template_zip',
          templateZip: true,
          isClone: true,
        },
      ],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2022-06-30T07:03:15.558Z',
      _sourceId: '6253af74cddb8a1ba550a010',
    }];
    draft.data.resources.connections = [{
      _id: '62bd43c87b94d20de64e9ab3',
      createdAt: '2022-06-30T06:33:44.780Z',
      lastModified: '2022-06-30T06:33:44.870Z',
      type: 'http',
      name: 'demo',
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
    }];
  });

  const ui = (<MemoryRouter><InstallationStep {...props} /></MemoryRouter>);

  return renderWithProviders(ui, {initialStore});
}

describe('installationStep UI tests', () => {
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
  test('should render all the options in the ui correctly', () => {
    let type = 'connection';
    const props = {
      index: 1,
      step: {
        name: 'demo',
        completed: false,
        type: {type},
        sourceConnection: {
          _id: '62bd43c87b94d20de64e9ab3',
          type: 'http',
          name: 'demo',
          http: {
            formType: 'rest',
          },
        },
        isCurrentStep: true,
      },
      integrationId: '62bd4ab37b94d20de64e9eaa',
      isFrameWork2: 3,
    };

    initInstallation(props);
    expect(screen.getByText(/1/i)).toBeInTheDocument();
    expect(screen.getByText(/demo/i)).toBeInTheDocument();
    expect(screen.getByText(/configure/i)).toBeInTheDocument();

    type = 'merge';
  });
  test('should run the handleStepclick function on clicking of configure button', async () => {
    const mockClick = jest.fn();
    const props = {
      index: 1,
      handleStepClick: mockClick,
      step: {
        name: 'demo',
        completed: false,
        type: 'connection',
        sourceConnection: {
          _id: '62bd43c87b94d20de64e9ab3',
          type: 'http',
          name: 'demo',
          http: {
            formType: 'rest',
          },
        },
        isCurrentStep: true,
      },
      integrationId: '62bd4ab37b94d20de64e9eaa',
      isFrameWork2: 3,
    };

    initInstallation(props);
    await userEvent.click(screen.getByText(/configure/i));

    expect(mockClick).toHaveBeenCalled();
  });
  test('should make the respective dispatch calls when step.type equals "install package"', () => {
    const mockClick = jest.fn();
    const props = {
      index: 1,
      handleStepClick: mockClick,
      step: {
        name: 'Integrator Bundle',
        completed: false,
        type: 'installPackage',
        options: {_connectionId: '62bd43c87b94d20de64e9ab3' },
        sourceConnection: {
          _id: '62bd43c87b94d20de64e9ab3',
          type: 'http',
          name: 'demo',
          http: {
            formType: 'rest',
          },
        },
        isCurrentStep: true,
      },
      integrationId: '62bd4ab37b94d20de64e9eaa',
      isFrameWork2: 3,
    };

    initInstallation(props);
    expect(mockDispatchFn).toHaveBeenCalledTimes(2);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.template.updateStep(
      { ...props.step, status: 'verifying' },
      undefined
    ));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.template.verifyBundleOrPackageInstall(
      props.step,
      initialStore.getState().data.resources.connections[0],
      undefined,
      'suitebundle',
      false
    ));
  });
  test('should make a dispatch call for suiteapp verification for templates when the Installation step name starts with "Integrator SuiteApp"', () => {
    const mockClick = jest.fn();
    const props = {
      index: 1,
      handleStepClick: mockClick,
      step: {
        name: 'Integrator SuiteApp',
        completed: false,
        type: 'installPackage',
        options: {_connectionId: '62bd43c87b94d20de64e9ab3' },
        sourceConnection: {
          _id: '62bd43c87b94d20de64e9ab3',
          type: 'http',
          name: 'demo',
          http: {
            formType: 'rest',
          },
        },
        isCurrentStep: true,
      },
      integrationId: '62bd4ab37b94d20de64e9eaa',
      isFrameWork2: 3,
    };

    initInstallation(props);
    expect(mockDispatchFn).toHaveBeenCalledTimes(2);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.template.updateStep(
      { ...props.step, status: 'verifying' },
      undefined
    ));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.template.verifyBundleOrPackageInstall(
      props.step,
      initialStore.getState().data.resources.connections[0],
      undefined,
      'suiteapp',
      false
    ));
  });
  test('should make the respective dispatch calls when revisionId,step.isCurrentStep,step.url,step.connectionId are defined', () => {
    const mockClick = jest.fn();
    const props = {
      revisionId: '123456789abcdefgh',
      index: 1,
      handleStepClick: mockClick,
      step: {
        name: 'Integrator Bundle',
        completed: false,
        url: 'http://demourlforTests',
        type: 'installPackage',
        connectionId: '62bd43c87b94d20de64e9ab3',
        options: {_connectionId: '62bd43c87b94d20de64e9ab3' },
        sourceConnection: {
          _id: '62bd43c87b94d20de64e9ab3',
          type: 'http',
          name: 'demo',
          http: {
            formType: 'rest',
          },
        },
        isCurrentStep: true,
      },
      integrationId: '62bd4ab37b94d20de64e9eaa',
      isFrameWork2: 3,
    };

    initInstallation(props);
    expect(mockDispatchFn).toHaveBeenCalledTimes(2);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.installSteps.updateStep('123456789abcdefgh', 'verify'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.installSteps.verifyBundleOrPackageInstall({
      integrationId: '62bd4ab37b94d20de64e9eaa',
      connectionId: '62bd43c87b94d20de64e9ab3',
      revisionId: '123456789abcdefgh',
      variant: 'suitebundle',
      isManualVerification: false,
    }));
  });
  test('should make dispatch call to verify suiteApp installation for integration LCM when step name starts with "Integration SuiteApp"', () => {
    const mockClick = jest.fn();
    const props = {
      revisionId: '123456789abcdefgh',
      index: 1,
      handleStepClick: mockClick,
      step: {
        name: 'Integrator SuiteApp',
        completed: false,
        url: 'http://demourlforTests',
        type: 'installPackage',
        connectionId: '62bd43c87b94d20de64e9ab3',
        options: {_connectionId: '62bd43c87b94d20de64e9ab3' },
        sourceConnection: {
          _id: '62bd43c87b94d20de64e9ab3',
          type: 'http',
          name: 'demo',
          http: {
            formType: 'rest',
          },
        },
        isCurrentStep: true,
      },
      integrationId: '62bd4ab37b94d20de64e9eaa',
      isFrameWork2: 3,
    };

    initInstallation(props);
    expect(mockDispatchFn).toHaveBeenCalledTimes(2);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.installSteps.updateStep('123456789abcdefgh', 'verify'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.installSteps.verifyBundleOrPackageInstall({
      integrationId: '62bd4ab37b94d20de64e9eaa',
      connectionId: '62bd43c87b94d20de64e9ab3',
      revisionId: '123456789abcdefgh',
      variant: 'suiteapp',
      isManualVerification: false,
    }));
  });
  test('should make the respective dispatch calls when currentStep,connectionId,installURL, are defined and it is not an integration App', () => {
    const mockClick = jest.fn();
    const props = {
      revisionId: '123456789abcdefgh',
      index: 1,
      handleStepClick: mockClick,
      step: {
        name: 'Integrator Bundle',
        completed: false,
        url: 'http://demourlforTests',
        _connId: '987654321abcdefgh',
        type: 'connection',
        options: {_connectionId: '62bd43c87b94d20de64e9ab3' },
        sourceConnection: {
          _id: '62bd43c87b94d20de64e9ab3',
          type: 'http',
          name: 'demo',
          http: {
            formType: 'rest',
          },
        },
        isCurrentStep: true,
      },
      integrationId: '62bd4ab37b94d20de64e9eaa',
      isFrameWork2: 3,
    };

    initInstallation(props);
    expect(mockDispatchFn).toHaveBeenCalledTimes(2);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.installer.updateStep(
      '62bd4ab37b94d20de64e9eaa',
      undefined,
      'verify'
    ));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.templates.installer.verifyBundleOrPackageInstall(
      '62bd4ab37b94d20de64e9eaa',
      '987654321abcdefgh',
      undefined,
      3,
      'suitebundle',
      false
    ));
  });
  test('should make the dispatch calls for suiteapp verification for integrationApp when installStep name starts with "Integrator SuiteApp"', () => {
    const mockClick = jest.fn();
    const props = {
      revisionId: '123456789abcdefgh',
      index: 1,
      handleStepClick: mockClick,
      step: {
        name: 'Integrator SuiteApp',
        completed: false,
        url: 'http://demourlforTests',
        _connId: '987654321abcdefgh',
        type: 'connection',
        options: {_connectionId: '62bd43c87b94d20de64e9ab3' },
        sourceConnection: {
          _id: '62bd43c87b94d20de64e9ab3',
          type: 'http',
          name: 'demo',
          http: {
            formType: 'rest',
          },
        },
        isCurrentStep: true,
      },
      integrationId: '62bd4ab37b94d20de64e9eaa',
      isFrameWork2: true,
    };

    initInstallation(props);
    expect(mockDispatchFn).toHaveBeenCalledTimes(2);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.installer.updateStep(
      '62bd4ab37b94d20de64e9eaa',
      undefined,
      'verify'
    ));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.templates.installer.verifyBundleOrPackageInstall(
      '62bd4ab37b94d20de64e9eaa',
      '987654321abcdefgh',
      undefined,
      true,
      'suiteapp',
      false
    ));
  });
  test('should render empty DOM when improper props are provided', () => {
    const props = {
      index: 1,
      integrationId: '62bd4ab37b94d20de64e9eaa',
      isFrameWork2: 3,
    };

    const {utils} = renderWithProviders(<MemoryRouter><InstallationStep {...props} /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
});


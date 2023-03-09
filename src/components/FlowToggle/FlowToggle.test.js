
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { ConfirmDialogProvider } from '../ConfirmDialog';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import actions from '../../actions';
import FlowToggle from '.';

const demoIntegration = [
  {
    _id: '626bda66987bb423914b486f',
    lastModified: '2022-04-29T12:31:49.587Z',
    name: 'development',
    description: 'demo integration',
    install: [],
    mode: 'settings',
    sandbox: false,
    _registeredConnectionIds: [
      '626bda95c087e064dcc7f501',
      '626bdaafc087e064dcc7f505',
    ],
    installSteps: [
      {
        name: 'REST API connection',
        completed: true,
        type: 'connection',
        sourceConnection: {
          type: 'http',
          name: 'REST API connection',
          http: {
            formType: 'rest',
          },
        },
      },
      {
        name: 'demo REST',
        completed: true,
        type: 'connection',
        sourceConnection: {
          type: 'http',
          name: 'demo REST',
          http: {
            formType: 'rest',
          },
        },
      },
      {
        name: 'Copy resources now from template zip',
        completed: true,
        type: 'template_zip',
        templateZip: true,
        isClone: true,
      },
    ],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2022-04-29T12:30:30.857Z',
    _sourceId: '626bd993987bb423914b484f',
  },
];

const demoFlows = [
  {
    _id: '626bdab2987bb423914b487d',
    lastModified: '2022-06-16T08:25:54.454Z',
    name: 'New flow',
    _integrationId: '626bda66987bb423914b486f',
    _connectorId: '626bda95c087e064dcc7f501',
    skipRetries: false,
    pageProcessors: [
      {
        responseMapping: {
          fields: [],
          lists: [],
        },
        _importId: '626bdab2987bb423914b487b',
        type: 'import',
      },
    ],
    pageGenerators: [
      {
        _exportId: '626bdab2987bb423914b4879',
        skipRetries: false,
      },
    ],
    disabled: true,
    createdAt: '2022-04-29T12:31:46.612Z',
    free: false,
    _sourceId: '626bda35987bb423914b4868',
    autoResolveMatchingTraceKeys: true,
  },
];
const initialStore = reduxStore;

async function flowTog(props = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources.flows = demoFlows;
    draft.data.resources.flows[0].disabled = props.disabled;
    draft.data.resources.integrations = props.integ;
  });
  const ui = (

    <ConfirmDialogProvider>
      <FlowToggle {...props} />
    </ConfirmDialogProvider>

  );

  return renderWithProviders(ui, { initialStore });
}

describe('unit tests for FlowToggle button', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('should render the flow toggle switch', async () => {
    await flowTog({resource: demoFlows, flowId: '626bdab2987bb423914b487d', integrationId: '626bda66987bb423914b486f', disabled: false, integ: demoIntegration});
    const toggleButton = screen.getByRole('checkbox');

    expect(toggleButton).toBeInTheDocument();
  });
  test('should display the confirm dialog box when flow is disabled', async () => {
    await flowTog({resource: demoFlows, integrationId: '626bda66987bb423914b486f', disabled: false, integ: demoIntegration});
    const toggleButton = screen.getByRole('checkbox');

    expect(toggleButton).toBeInTheDocument();
    await userEvent.click(toggleButton);
    await waitFor(() =>
      expect(screen.queryByText(/Confirm disable/i)).toBeInTheDocument()
    );
    const enButton = screen.getByText('Disable');

    await waitFor(() => expect(enButton).toBeInTheDocument());
    const cancelButton = screen.getByText('Cancel');

    await waitFor(() => expect(cancelButton).toBeInTheDocument());
  });
  test('should make the respective the respective dispatch calls when clicked on disable in the confirm dialog box', async () => {
    const patchSet = [
      {
        op: 'replace',
        path: '/disabled',
        value: true,
      },
    ];

    await flowTog({resource: demoFlows, flowId: '626bdab2987bb423914b487d', integrationId: '626bda66987bb423914b486f', disabled: false, integ: demoIntegration});
    const toggleButton = screen.getByRole('checkbox');

    expect(toggleButton).toBeInTheDocument();
    await userEvent.click(toggleButton);
    await waitFor(() =>
      expect(screen.getByText(/Confirm disable/i)).toBeInTheDocument()
    );
    const disButton = screen.getByText('Disable');

    expect(disButton).toBeInTheDocument();
    await userEvent.click(disButton);
    await waitFor(() =>
      expect(mockDispatchFn).toHaveBeenCalledWith(
        actions.flow.isOnOffActionInprogress(true, '626bdab2987bb423914b487d')
      )
    );
    await waitFor(() =>
      expect(mockDispatchFn).toHaveBeenCalledWith(
        actions.resource.patchAndCommitStaged(
          'flows',
          '626bdab2987bb423914b487d',
          patchSet,
          {
            options: {
              action: 'flowEnableDisable',
            },
          }
        )
      )
    );
  });
  test('should make the respective dipatch calls for flows which are not of twoDotZero framework', async () => {
    await flowTog({resource: demoFlows, integrationId: '626bda66987bb423914b486f', flowId: '626bdab2987bb423914b487d', disabled: false, integ: []});
    const toggleButton = screen.getByRole('checkbox');

    await userEvent.click(toggleButton);
    const disButton = screen.getByText('Disable');

    await userEvent.click(disButton);
    await waitFor(() =>
      expect(mockDispatchFn).toHaveBeenCalledWith(
        actions.flow.isOnOffActionInprogress(true, '626bdab2987bb423914b487d')
      )
    );
    await waitFor(() =>
      expect(mockDispatchFn).toHaveBeenCalledWith(
        actions.integrationApp.settings.update(
          '626bda66987bb423914b486f',
          '626bdab2987bb423914b487d',
          undefined,
          null,
          { '/flowId': '626bdab2987bb423914b487d', '/disabled': true },
          { action: 'flowEnableDisable' }
        )
      )
    );
  });
});

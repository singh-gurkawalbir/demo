/* eslint-disable no-param-reassign */
/* global test, expect, jest,describe,beforeEach,afterEach */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { ConfirmDialogProvider } from '../ConfirmDialog';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore } from '../../test/test-utils';
import actions from '../../actions';
import FlowToggle from '.';

async function flowTog(
  {
    integ = [
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
    ],
  } = {},
  props = {}, disableValue = false
) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources.flows = [
    {
      _id: '626bdab2987bb423914b487d',
      lastModified: '2022-06-16T08:25:54.454Z',
      name: 'New flow',
      disabled: disableValue,
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
      createdAt: '2022-04-29T12:31:46.612Z',
      free: false,
      _sourceId: '626bda35987bb423914b4868',
      autoResolveMatchingTraceKeys: true,
    },
  ];
  initialStore.getState().data.resources.integrations = integ;
  // eslint-disable-next-line prefer-destructuring
  props.resource = initialStore.getState().data.resources.flows[0];
  props.integrationId = initialStore.getState().data.resources.flows[0]._integrationId;
  props.disabled = disableValue;
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <FlowToggle {...props} />
      </ConfirmDialogProvider>
    </MemoryRouter>
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
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('Checking whether toggle switch is present', async () => {
    await flowTog({}, {});
    const toggleButton = screen.getByRole('checkbox');

    expect(toggleButton).toBeInTheDocument();
  });
  test('Checking the functioning of toggle switch in the ui', async () => {
    await flowTog({}, {}, true);
    const toggleButton = screen.getByRole('checkbox');

    userEvent.click(toggleButton);
    waitFor(() => expect(toggleButton).toBeChecked());
  });
  test('Checking for dialogue box when the flow is enabled and its functionality', async () => {
    await flowTog({}, {}, false);
    const toggleButton = screen.getByRole('checkbox');

    userEvent.click(toggleButton);
    waitFor(() =>
      expect(screen.queryByText(/Confirm disable/i)).toBeInTheDocument()
    );
    const enButton = screen.getByText('Disable');

    waitFor(() => expect(enButton).toBeInTheDocument());
    const cancelButton = screen.getByText('Cancel');

    waitFor(() => expect(cancelButton).toBeInTheDocument());
    waitFor(() => expect(toggleButton).not.toBeChecked());
  });
  test('Checking the functioning of Disable button', async () => {
    const patchSet = [
      {
        op: 'replace',
        path: '/disabled',
        value: true,
      },
    ];

    await flowTog({}, {}, false);
    const toggleButton = screen.getByRole('checkbox');

    userEvent.click(toggleButton);
    waitFor(() =>
      expect(screen.getByText('/Confirm disable/i')).toBeInTheDocument()
    );
    const disButton = screen.getByText('Disable');

    userEvent.click(disButton);
    waitFor(() =>
      expect(mockDispatchFn).toBeCalledWith(
        actions.flow.isOnOffActionInprogress(true, '626bdab2987bb423914b487d')
      )
    );
    waitFor(() =>
      expect(mockDispatchFn).toBeCalledWith(
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
  test('checking functionality of flows which are not of twoDotZero framework', async () => {
    await flowTog({ integ: [] }, {});
    const toggleButton = screen.getByRole('checkbox');

    userEvent.click(toggleButton);
    const disButton = screen.getByText('Disable');

    userEvent.click(disButton);
    waitFor(() =>
      expect(mockDispatchFn).toBeCalledWith(
        actions.flow.isOnOffActionInprogress(true, '626bdab2987bb423914b487d')
      )
    );
    waitFor(() =>
      expect(mockDispatchFn).toBeCalledWith(
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
  test('checking the functionality of enable button', () => {
    const props = {
      resource: {
        _id: '626bdab2987bb423914b487d',
        lastModified: '2022-06-16T08:25:54.454Z',
        name: 'New flow',
        disabled: true,
        _integrationId: '626bda66987bb423914b486f',
        _connectorId: '626bda95c087e064dcc7f501',

      },
      disabled: true,
      childId: null,
      integrationId: '62662cc4e06ff462c3db470e',
    };

    renderWithProviders(<MemoryRouter><ConfirmDialogProvider><FlowToggle {...props} /></ConfirmDialogProvider></MemoryRouter>);
    const toggleButton = screen.getByRole('checkbox');

    expect(toggleButton).not.toBeChecked();
    userEvent.click(toggleButton);
    waitFor(() =>
      expect(toggleButton).toBeChecked()
    );
  });
});

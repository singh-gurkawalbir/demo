import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import FlowBuilderBody from '.';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';

function initFlowBuilderBody(props = {}) {
  const initialStore = getCreatedStore();

  mutateStore(initialStore, draft => {
    draft.data.resources.flows = [
      {
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
        createdAt: '2022-07-07T14:43:46.730Z',
        lastExecutedAt: '2022-07-07T14:46:57.185Z',
        autoResolveMatchingTraceKeys: true,
      },
    ];
    draft.data.resources.integrations = [
      {
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
      },
    ];
    draft.data.resources.exports = [
      {
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
      },
    ];
    draft.user.profile = { useErrMgtTwoDotZero: true };
    draft.user.preferences = { defaultAShareId: false };
    draft.session.flowbuilder = {
      '62c6f122a2f4a703c3dee3d0': {
        dragStepIdInProgress: true,
        status: props.status,
      },
    };

    draft.session.errorManagement.openErrors[
      '62c6f122a2f4a703c3dee3d0'
    ] = {
      status: 'received',
      data: {
        '62c6f121a2f4a703c3dee3ce': {
          _expOrImpId: '62c6f121a2f4a703c3dee3ce',
          numError: props.numErrors,
          lastErrorAt: '2022-08-08T13:44:03.841Z',
        },
      },
    };
  });
  const ui = (
    <DndProvider backend={HTML5Backend}>
      <MemoryRouter
        initialEntries={[
          {
            pathname:
            '/integrations/6253af74cddb8a1ba550a010/flowBuilder/62c6f122a2f4a703c3dee3d0',
          },
        ]}
    >
        <Route path="/integrations/:integrationId/flowBuilder/:flowId">
          <FlowBuilderBody {...props} />
        </Route>
      </MemoryRouter>
    </DndProvider>
  );

  renderWithProviders(ui, { initialStore });
}

jest.mock('reactflow', () => ({
  __esModule: true,
  ...jest.requireActual('reactflow'),
  default: props => (
    <div>
      {/* eslint-disable-next-line react/button-has-type */}
      <>
        <button type="button" onClick={props.onNodeDragStart}>
          DragStart
        </button>
        <button type="button" onClick={props.onNodeDragStop}>
          DragStop
        </button>
        <button type="button" onClick={props.onNodeDrag}>
          NodeDrag
        </button>
      </>
      {props.children}
    </div>
  ),
  MiniMap: () => <div>MiniMap</div>,
}));

jest.mock('./titles/SourceTitle', () => ({
  __esModule: true,
  ...jest.requireActual('./titles/SourceTitle'),
  default: props => (
    // eslint-disable-next-line react/button-has-type
    <button onClick={props.onClick}>SOURCES</button>
  ),
}));

describe('FlowBuilderBody UI tests', () => {
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
  test('should pass the initial render with all the available operations', () => {
    const props = { flowId: '62c6f122a2f4a703c3dee3d0' };

    initFlowBuilderBody(props);
    expect(screen.getByText('New flow')).toBeInTheDocument();
    expect(screen.getByText('SOURCES')).toBeInTheDocument();
    expect(screen.getByText('DESTINATIONS & LOOKUPS')).toBeInTheDocument();
    const flowToggleButton = document.querySelector(
      '[ data-test="switchFlowOnOff"]'
    );

    expect(flowToggleButton).toBeInTheDocument();
    const scheduleFlowButton = document.querySelector(
      '[ data-test="scheduleFlow"]'
    );

    expect(scheduleFlowButton).toBeInTheDocument();
    const settingsButton = document.querySelector(
      '[ data-test="flowSettings"]'
    );

    expect(settingsButton).toBeInTheDocument();
    const runFlowButton = document.querySelector('[ data-test="runFlow"]');

    expect(runFlowButton).toBeInTheDocument();
  });

  test('should display all 4 control buttons: zoom in, out, fit, and hide miniMap', async () => {
    const props = {
      flowId: '62c6f122a2f4a703c3dee3d0',
      fullScreen: true,
      status: 'saving',
    };

    initFlowBuilderBody(props);
    const controlButtons = document.querySelectorAll('.react-flow__controls-button > span');

    const actualTitles = Array.from(controlButtons).map(cb => cb.getAttribute('aria-label'));

    const expectedButtonTitles = [
      'Zoom in',
      'Zoom out',
      'Zoom to fit',
      'Hide map',
    ];

    expect(actualTitles).toEqual(expectedButtonTitles);
  });

  test('should make the respective dispatch calls when navigating the mini map', async () => {
    const props = { flowId: '62c6f122a2f4a703c3dee3d0' };

    initFlowBuilderBody(props);
    await userEvent.click(screen.getByText('DragStop')); // Drag events have been modified as buttons //
    expect(mockDispatchFn).toBeCalled();
    await userEvent.click(screen.getByText('NodeDrag'));
    expect(mockDispatchFn).toBeCalled();
  });
  test('should make the respective dispatch call when clicked on SourceTitle', async () => {
    const props = { flowId: '62c6f122a2f4a703c3dee3d0' };

    initFlowBuilderBody(props);
    await userEvent.click(screen.getByText('SOURCES'));
    expect(mockDispatchFn).toBeCalledWith(
      actions.flow.addNewPGStep('62c6f122a2f4a703c3dee3d0')
    );
  });
});

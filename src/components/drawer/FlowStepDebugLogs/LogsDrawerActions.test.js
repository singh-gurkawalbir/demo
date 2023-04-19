
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import moment from 'moment';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import LogsDrawerActions from './LogsDrawerActions';
import actions from '../../../actions';

const mockDate = new Date('2022-10-20');
const mockTime = {
  startDate: moment(new Date('2022-10-20')).startOf('day').toDate(),
  endDate: moment(new Date('2022-10-20')).endOf('day').toDate(),
};

const props = {
  flowId: 'random_mock_flowId',
  resourceType: 'imports',
  resourceId: 'random_resource_id_mock',
};

async function initLogsDrawerActions({props,
  logsStatus = 'recieved',
  logsSummary = [{
    key: 'randomActiveLogKey',
    stage: 'import',
  },
  {
    key: 'randomActiveLogKey',
    stage: 'import',
  },
  {
    key: 'randomActiveLogKey',
    stage: 'import',
  },
  {
    key: 'randomActiveLogKey',
    stage: 'import',
  },
  {
    key: 'randomActiveLogKey',
    stage: 'import',
  }],
  hasNewLogs = false,
  time = {}}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.logs.flowStep = {
      random_resource_id_mock: {
        logsStatus,
        logsSummary,
        loadMoreStatus: 'received',
        hasNewLogs,
        fetchStatus: 'completed',
        currQueryTime: mockDate.getTime(),
        activeLogKey: 'randomActiveLogKey',
        nextPageURL: '/v1(api)/flows/:_flowId',
      },
    };
    draft.session.filters = {
      flowStepLogs: { paging: {currPage: 1},
        codes: [
          'not_all',
        ],
        time,
      },
    };
    draft.user = {
      preferences: {
        defaultAShareId: '_Id',
        accounts: { shareMockId: {}},
      },
      org: {accounts: [
        { _id: '_Id',
          accepted: true,
          accessLevel: 'manage',
          integrationAccessLevel: [],
        }],
      },
    };
  });

  const ui = (
    <MemoryRouter>
      <LogsDrawerActions {...props} />
    </MemoryRouter>
  );

  const { store, utils } = renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}
jest.mock('../../../utils/flowStepLogs', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/flowStepLogs'),
  DEFAULT_ROWS_PER_PAGE: 2,
}));

jest.mock('../../FetchProgressIndicator', () => ({
  __esModule: true,
  ...jest.requireActual('../../FetchProgressIndicator'),
  default: props => {
    const {pauseHandler: onPause, resumeHandler: onResume } = props;

    return (
      <>
        <button type="button" onClick={onPause}>Pause</button>
        <button type="button" onClick={onResume}>Resume</button>
      </>
    );
  },
}));

jest.mock('../../StartDebugEnhanced', () => ({
  __esModule: true,
  ...jest.requireActual('../../StartDebugEnhanced'),
  default: props => {
    const {startDebugHandler: onClick, stopDebugHandler: onCancel } = props;

    return (
      <>
        <button type="button" onClick={() => onClick(15)}>Start debug</button>
        <button type="button" onClick={onCancel}>Stop debug</button>
      </>
    );
  },
}));

describe('LogsDrawerActions tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;
  let dateSpy;

  beforeEach(() => {
    // jest.useFakeTimers();
    dateSpy = jest.spyOn(global.Date, 'now').mockImplementation(() => mockDate);

    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    dateSpy.mockRestore();
  });

  test('Should able to pass initial render with default values having logs > 0 and navigate to next and previous Page', async () => {
    await initLogsDrawerActions({props});
    expect(screen.queryByText(/3 - 4 of 5+/i)).toBeInTheDocument();
    expect(screen.queryByText(/Start debug/i)).toBeInTheDocument();
    expect(screen.queryByText(/Refresh logs/i)).toBeInTheDocument();
    const buttons = screen.queryAllByRole('button');
    const nextPage = buttons.find(button => button.getAttribute('data-testid') === 'nextPage');

    expect(nextPage).toBeInTheDocument();
    await userEvent.click(nextPage);
    expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.logs.flowStep.request({flowId: props.flowId, resourceId: props.resourceId, loadMore: true}));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.patchFilter('flowStepLogs', {paging: {currPage: 2}}));
  });
  test('Should able to pass initial render with logsCount = 0 And start & stop debug', async () => {
    await initLogsDrawerActions({props,
      logsSummary: []});
    expect(screen.queryByText(/3 - 4 of 5+/i)).not.toBeInTheDocument();
    const startDebug = screen.queryByText(/Start debug/i);
    const stopDebug = screen.queryByText(/Stop debug/i);

    expect(startDebug).toBeInTheDocument();
    expect(stopDebug).toBeInTheDocument();
    await userEvent.click(startDebug);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.flowStep.startDebug(props.flowId, props.resourceId, props.resourceType, 15));
    await userEvent.click(stopDebug);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.flowStep.stopDebug(props.flowId, props.resourceId, props.resourceType));
  });

  test('Should able to pass render with logsCount = 0 And pause & Resume debug logs', async () => {
    await initLogsDrawerActions({props,
      logsSummary: [],
      time: mockTime});
    const pauseFetch = screen.queryByText(/Pause/i);
    const resumeFetch = screen.queryByText(/Resume/i);

    expect(pauseFetch).toBeInTheDocument();
    expect(resumeFetch).toBeInTheDocument();
    await userEvent.click(pauseFetch);
    expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.logs.flowStep.setFetchStatus(props.resourceId, 'paused'));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.logs.flowStep.pauseFetch(props.flowId, props.resourceId));
    await userEvent.click(resumeFetch);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.flowStep.request({flowId: props.flowId, resourceId: props.resourceId, loadMore: true}));
  });

  test('Should able to pass render with logsCount > 0, status requested and hasNewLogs', async () => {
    await initLogsDrawerActions({props,
      logsStatus: 'requested',
      hasNewLogs: true,
    });
    expect(screen.queryByText(/3 - 4 of 5+/i)).not.toBeInTheDocument();
    const refreshLogs = screen.getByText(/Refresh logs/i);

    expect(refreshLogs).toBeInTheDocument();
    await userEvent.click(refreshLogs);
    expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.clearFilter('flowStepLogs'));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.logs.flowStep.request({flowId: props.flowId, resourceId: props.resourceId, loadMore: undefined}));
  });
});

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import LogsTable from './LogsTable';
import actionTypes from '../../../actions/types';
import { message } from '../../../utils/messageStore';
import customCloneDeep from '../../../utils/customCloneDeep';

const props = {
  flowId: 'random_mock_flowId',
  resourceType: 'imports',
  resourceId: 'random_resource_id_mock',
};

async function initLogsTable({props,
  logsSummary = [],
  nextPageURL = '',
  fetchStatus = 'completed',
  logsStatus = 'recieved',
  debugUntil = '2122-12-13T15:03:17.961Z',
}) {
  const initialStore = reduxStore;
  const {resourceId, resourceType} = props;

  mutateStore(initialStore, draft => {
    draft.session.logs.flowStep = {
      random_resource_id_mock: {
        logsSummary,
        nextPageURL,
        fetchStatus,
        logsStatus,
        loadMoreStatus: 'received',
        hasNewLogs: false,
        activeLogKey: 'randomActiveLogKey',
      },
    };
    draft.data.resources[resourceType] = [
      { _id: resourceId,
        debugUntil,
      },
    ];
  });

  const ui = (
    <MemoryRouter>
      <LogsTable {...props} />
    </MemoryRouter>
  );

  const { store, utils } = renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('LogsTable tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;
  let initialStore;

  beforeEach(() => {
    initialStore = customCloneDeep(reduxStore);
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      const {type, resourceId} = action;

      switch (type) {
        case actionTypes.LOGS.FLOWSTEP.START_POLL:
          mutateStore(initialStore, draft => {
            draft.session.logs.flowStep[resourceId].debugOn = true;
          });
          break;
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('Should able to pass initial render with resource table and without any logs', async () => {
    await initLogsTable({props});
    expect(screen.queryByText(/Time/i)).toBeInTheDocument();
    expect(screen.queryByText(/Method/i)).toBeInTheDocument();
    expect(screen.queryByText(/Stage/i)).toBeInTheDocument();
    expect(screen.queryByText(/Response code/i)).toBeInTheDocument();
    expect(screen.queryByText(/Actions/i)).toBeInTheDocument();
    expect(screen.queryByText(message.NO_DEBUG_LOG)).toBeInTheDocument();
  });
  test('Should able to show spinner without any logs and has next page with fetching in progress', async () => {
    await initLogsTable({props, nextPageURL: '/v1(api)/flows/:_flowId', fetchStatus: 'inProgress'});
    expect(screen.queryByText(/Response code/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('Should able to test the Circular progressbar is shown when status = requested', async () => {
    await initLogsTable({props, logsStatus: 'requested'});
    expect(screen.queryByText(/Response code/i)).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('Should able to pass initial render with atleast one log', async () => {
    await initLogsTable({props,
      logsSummary: [{
        key: 'randomActiveLogKey',
        stage: 'import',
      }]});
    expect(screen.queryByText(/Time/i)).toBeInTheDocument();
    expect(screen.queryByText(/import/i)).toBeInTheDocument();
  });
  test('Should able to pass render When Debug time is Over', async () => {
    await initLogsTable({props,
      debugUntil: '1922-12-13T15:03:17.961Z',
      logsSummary: [{
        key: 'randomActiveLogKey',
        stage: 'import',
      }]});
    expect(screen.queryByText(/Time/i)).toBeInTheDocument();
  });
});

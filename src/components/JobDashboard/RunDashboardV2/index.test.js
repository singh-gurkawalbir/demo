
import React from 'react';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import RunDashboardV2 from '.';
import {mutateStore, renderWithProviders} from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';

let initialStore;

function initRunDashboardV2({flowId, statusData}) {
  const mustateState = draft => {
    draft.data.resources.integrations = [{
      _id: '12345',
      name: 'Test integration name',
    }];
    draft.data.resources.flows = [{
      _id: '67890',
      name: 'Test flow name 1',
      _integrationId: '12345',
      disabled: false,
      pageProcessors: [
        {
          type: 'import',
          _importId: 'nxksnn',
        },
      ],
      pageGenerators: [
        {
          _exportId: 'xsjxks',
        },
      ],
    }];
    draft.data.resources.exports = [{
      _id: 'xsjxks',
      name: 'Test export',
      _integrationId: '12345',
    }];
    draft.data.resources.imports = [{
      _id: 'nxksnn',
      name: 'Test import',
      _integrationId: '12345',
    }];
    draft.session.errorManagement = {
      latestFlowJobs: {
        [flowId]: {
          status: statusData,
          data: [
          ],
        },
      },
    };
  };

  mutateStore(initialStore, mustateState);
  const ui = (
    <RunDashboardV2 flowId={flowId} />
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../../ResourceTable', () => ({
  __esModule: true,
  ...jest.requireActual('../../ResourceTable'),
  default: props => (

    // eslint-disable-next-line react/button-has-type
    <div>Mocking Resource Table = {JSON.stringify(props.resources)}</div>
  ),
}));
describe('testsuite for RunDashboardV2', () => {
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
  });
  test('should test the run dashboard drawer with no jobs and test whether we are accessing resource table', async () => {
    initRunDashboardV2({flowId: '67890', statusData: 'received'});
    expect(screen.getByText(/mocking resource table = \[\]/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'FLOW_LATEST_JOBS_REQUEST', flowId: '67890', refresh: true });
  });
  test('should test the run dashboard drawer spinner when data is loading', async () => {
    initRunDashboardV2({flowId: '67890', statusData: 'refresh'});
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'FLOW_LATEST_JOBS_REQUEST', flowId: '67890', refresh: true });
    expect(screen.getByRole('progressbar').className).toEqual(expect.stringContaining('MuiCircularProgress-'));
  });
  test('should test the run dashboard drawer should not make any dispatch call with new flow id', async () => {
    initRunDashboardV2({flowId: 'new-123', statusData: 'received'});
    expect(mockDispatchFn).not.toHaveBeenCalled();
  });
});


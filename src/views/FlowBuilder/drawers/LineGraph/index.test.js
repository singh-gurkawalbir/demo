
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LineGraphDrawer from '.';
import actions from '../../../../actions';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';

async function initLineGraphDrawer({
  props = {
    flowId: 'flow_id',
  },
  integrationId = 'integration_id',
  linegraphData = {},
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.errorManagement = {
      latestIntegrationJobDetails: {
        integration_id: {
          status: 'received',
          data: [{
            _flowId: 'flow_id',
            createdAt: new Date(Date.now() - 360000000),
            endedAt: new Date(Date.now() - 36000000),
          }],
        },
        integration_id_1: {
          data: [{
            _flowId: 'flow_id',
          }],
        },
        integration_id_3: {
          data: [{
            _flowId: 'flow_id_1',
          }],
        },
      },
    };

    draft.user.org = {
      accounts: [{
        accessLevel: 'owner',
        _id: 'own',
        ownerUser: {
          licenses: [],
        },
      }],
    };
    draft.user.preferences = {
      defaultAShareId: 'own',
      ...linegraphData,
    };
  });

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/integrations/${integrationId}/flowBuilder/flow_id/charts`}]}
    >
      <Route
        path="/integrations/:integrationId/flowBuilder/flow_id"
      >
        <LineGraphDrawer {...props} />
      </Route>
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}
const mockHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));

jest.mock('../../../../components/LineGraph/SelectResource', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/LineGraph/SelectResource'),
  default: props => {
    const handleResourcesChange = () => {
      props.onSave(['flow_id', 'export_id']);
    };

    return (
      <>
        <button type="button" onClick={handleResourcesChange}>mock handleResourcesChange</button>
      </>
    );
  },
}));
const startDate = Date.now();
const endDate = Date.now() + 1800000;

const mockDates = jest.fn().mockReturnValue({
  startDate,
  endDate,
});

jest.mock('../../../../components/DateRangeSelector', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/DateRangeSelector'),
  default: props => {
    props?.customPresets?.[0]?.range();
    const handleDateRangeChange = () => {
      const dateVal = mockDates();

      props.onSave(dateVal);
    };

    return (
      <>
        <button type="button" onClick={handleDateRangeChange}>mock handleDateRangeChange</button>
      </>
    );
  },
}));

describe('LineGraphDrawer test cases', () => {
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
    mockDispatchFn.mockClear();
    mockHistoryGoBack.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    await initLineGraphDrawer();
    waitFor(async () => {
      const refreshButton = screen.getByRole('button', { name: 'Refresh'});
      const closeButton = screen.getAllByRole('button').find(eachButton => eachButton.getAttribute('data-test') === 'closeRightDrawer');
      const mockHandleDateRangeButton = screen.getByRole('button', { name: 'mock handleDateRangeChange'});
      const mockHandleResourcesButton = screen.getByRole('button', { name: 'mock handleResourcesChange'});

      expect(screen.queryByText(/Analytics/i)).toBeInTheDocument();
      expect(refreshButton).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
      expect(mockHandleDateRangeButton).toBeInTheDocument();
      expect(mockHandleResourcesButton).toBeInTheDocument();

      await userEvent.click(refreshButton);
      expect(mockDispatchFn).toBeCalledWith(actions.flowMetrics.clear('flow_id'));

      await userEvent.click(closeButton);
      expect(mockHistoryGoBack).toBeCalled();
      mockDispatchFn.mockClear();

      await userEvent.click(mockHandleDateRangeButton);
      expect(mockDispatchFn).toBeCalledWith(actions.flowMetrics.clear('flow_id'));
      expect(mockDispatchFn).toBeCalledWith(actions.user.preferences.update({
        linegraphs: {
          flow_id: {
            range: {
              startDate,
              endDate,
            },
            resource: [
              'flow_id',
            ],
          },
        },
      }));

      await userEvent.click(mockHandleResourcesButton);
      expect(mockDispatchFn).toBeCalledWith(actions.flowMetrics.clear('flow_id'));
      expect(mockDispatchFn).toBeCalledWith(actions.user.preferences.update({
        linegraphs: {
          flow_id: {
            range: {
              startDate,
              endDate,
            },
            resource: [
              'flow_id',
            ],
          },
        },
      }));
    });
  });

  test('should pass the initial render with no latest job status', async () => {
    await initLineGraphDrawer({
      integrationId: 'integration_id_1',
      linegraphData: {
        linegraphs: {
          flow_id: {
            range: {},
          },
        },
      },
    });

    expect(mockDispatchFn).toBeCalledWith(actions.errorManager.integrationLatestJobs.request({ integrationId: 'integration_id_1' }));

    const refreshButton = screen.getByRole('button', { name: 'Refresh'});
    const closeButton = screen.getAllByRole('button').find(eachButton => eachButton.getAttribute('data-test') === 'closeRightDrawer');
    const mockHandleDateRangeButton = screen.getByRole('button', { name: 'mock handleDateRangeChange'});
    const mockHandleResourcesButton = screen.getByRole('button', { name: 'mock handleResourcesChange'});

    expect(screen.queryByText(/Analytics/i)).toBeInTheDocument();
    expect(refreshButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(mockHandleDateRangeButton).toBeInTheDocument();
    expect(mockHandleResourcesButton).toBeInTheDocument();
  });

  test('should pass the initial render with no latest job', async () => {
    await initLineGraphDrawer({
      integrationId: 'integration_id_2',
    });

    expect(mockDispatchFn).toBeCalledWith(actions.errorManager.integrationLatestJobs.request({ integrationId: 'integration_id_2' }));

    const refreshButton = screen.getByRole('button', { name: 'Refresh'});
    const closeButton = screen.getAllByRole('button').find(eachButton => eachButton.getAttribute('data-test') === 'closeRightDrawer');
    const mockHandleDateRangeButton = screen.getByRole('button', { name: 'mock handleDateRangeChange'});
    const mockHandleResourcesButton = screen.getByRole('button', { name: 'mock handleResourcesChange'});

    expect(screen.queryByText(/Analytics/i)).toBeInTheDocument();
    expect(refreshButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(mockHandleDateRangeButton).toBeInTheDocument();
    expect(mockHandleResourcesButton).toBeInTheDocument();
  });
});

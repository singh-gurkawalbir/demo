import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
import { screen, cleanup, waitForElementToBeRemoved, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import { runServer } from '../../test/api/server';
import Reports from '.';
import actions from '../../actions';
import * as utils from '../../utils/resource';

let initialStore;
const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

function store(eventReports) {
  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [{
      _id: '5ffad3d1f08d35214ed200g7',
      lastModified: '2021-01-22T08:40:45.731Z',
      name: 'concur expense',
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c88',
        '5feafe6bf415e15f455dbc89',
      ],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2021-01-10T10:15:45.184Z',
    }];
    draft.data.resources.flows = [{
      _id: '60db46af9433830f8f0e0fe7',
      lastModified: '2022-07-27T18:04:57.044Z',
      name: 'concurexpense - FTP',
      description: 'Testing Flow',
      disabled: false,
      _integrationId: '5ffad3d1f08d35214ed200g7',
      skipRetries: false,
      pageProcessors: [
        {
          responseMapping: {
            fields: [],
            lists: [],
          },
          type: 'import',
          _importId: '605b30767904202f31742092',
        },
      ],
      pageGenerators: [
        {
          _exportId: '60dbc5a8a706701ed4a148ac',
          skipRetries: false,
        },
      ],
      createdAt: '2021-06-29T16:13:35.071Z',
      lastExecutedAt: '2021-06-30T01:55:17.721Z',
      autoResolveMatchingTraceKeys: true,
    }];
    draft.data.resources.eventreports = eventReports;
    draft.session.filters = {
      eventreports: {
        sort: {
          order: 'desc',
          orderBy: 'createdAt',
        },
        paging: {
          rowsPerPage: 1,
          currPage: 0,
        },
        type: 'eventreports',
      },
    };
  });
}

async function initReports(params) {
  const ui = (
    <MemoryRouter
      initialEntries={[{ pathname: params.path }]}
    >
      <Route
        path="/reports/:reportType"
        params={{reportType: params.eventreports}}
        >
        <Reports />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

jest.mock('../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/LoadResources'),
  default: newprops => (
    <div>{newprops.children}</div>
  ),
}
));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: mockHistoryReplace,
  }),
}));
describe('reports', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = reduxStore;
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
    mockDispatchFn.mockClear();
    cleanup();
  });
  test('should able to test the Reports page heading', async () => {
    const params = {
      eventreports: 'eventreports',
      path: '/reports/eventreports',
    };

    await initReports(params);
    const reportsHeadingNode = screen.getByRole('heading', {name: 'Reports'});

    expect(reportsHeadingNode).toBeInTheDocument();
  });
  test('should able to test the Reports page flow events drop-down button', async () => {
    const params = {
      eventreports: 'eventreports',
      path: '/reports/eventreports',
    };

    await initReports(params);
    const flowEventsDropDownButtonNode = screen.getByRole('button', {name: 'Flow events'});

    expect(flowEventsDropDownButtonNode).toBeInTheDocument();
    await userEvent.click(flowEventsDropDownButtonNode);
    const listBoxButtonNode = document.querySelector('ul[role="listbox"]');

    expect(listBoxButtonNode).toBeInTheDocument();
    const optionsNode = screen.getByRole('option', {name: 'Flow events'});

    expect(optionsNode).toBeInTheDocument();
    await fireEvent.click(optionsNode);
    await waitForElementToBeRemoved(optionsNode);
    expect(optionsNode).not.toBeInTheDocument();
  });
  test('should able to test the flow event report results heading', async () => {
    const params = {
      eventreports: 'eventreports',
      path: '/reports/eventreports',
    };

    await initReports(params);
    const headingNode = screen.getByText('Flow events report results');

    expect(headingNode).toBeInTheDocument();
  });
  test('should able to test the run report button and verify the link which got generated', async () => {
    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    const params = {
      eventreports: 'eventreports',
      path: '/reports/eventreports',
    };

    await initReports(params);
    store();
    const runReportButtonNode = screen.getByRole('link', {name: 'Run report'});

    expect(runReportButtonNode).toBeInTheDocument();
    expect(runReportButtonNode).toHaveAttribute('href', '/reports/eventreports/add/eventreports/somegeneratedID');
  });
  test('should able to test the refresh button on the reports page', async () => {
    const params = {
      eventreports: 'eventreports',
      path: '/reports/eventreports',
    };

    await initReports(params);
    store();
    const refreshButtonNode = screen.getByRole('button', {name: 'Refresh'});

    expect(refreshButtonNode).toBeInTheDocument();
    await userEvent.click(refreshButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('eventreports', null, true));
  });
  test('should able to test report page with the reports which has status loading', async () => {
    const eventReports = [
      {
        _id: '62f15359f8b63672312c3299',
        type: 'flow_events',
        _flowIds: [
          '60db46af9433830f8f0e0fe7',
        ],
        startTime: '2022-08-08T17:17:55.739Z',
        endTime: '2022-08-08T18:17:55.738Z',
        status: 'running',
        reportGenerationErrors: [],
        createdAt: '2022-08-08T18:18:01.587Z',
        startedAt: '2022-08-08T18:18:03.082Z',
        endedAt: '2022-08-08T18:18:34.775Z',
        requestedByUser: {
          name: 'Chaitanya Reddy Mula',
          email: 'chaitanyareddy.mule@celigo.com',
        },
      },
    ];

    store(eventReports);
    const params = {
      eventreports: 'eventreports',
      path: '/reports/eventreports',
    };

    await initReports(params);
    waitFor(() => {
      const runnningStatusNode = screen.getByRole('cell', {name: 'Running'});

      expect(runnningStatusNode).toBeInTheDocument();
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.app.polling.start({
        type: 'RESOURCE_REQUEST_COLLECTION',
        resourceType: 'eventreports',
        message: null,
        refresh: true,
      }));
    });
  });
  test('should able to test report page with resource type as undefined', async () => {
    const params = {
      eventreports: 'undefined',
      path: '/reports/undefined',
    };

    store();

    await initReports(params);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/reports/eventreports');
  });
  test('should able to test report page pagination', async () => {
    const eventReports = [
      {
        _id: '62f15359f8b63672312c3299',
        type: 'flow_events',
        _flowIds: [
          '60db46af9433830f8f0e0fe7',
        ],
        startTime: '2022-08-08T17:17:55.739Z',
        endTime: '2022-08-08T18:17:55.738Z',
        status: 'running',
        reportGenerationErrors: [],
        createdAt: '2022-08-08T18:18:01.587Z',
        startedAt: '2022-08-08T18:18:03.082Z',
        endedAt: '2022-08-08T18:18:34.775Z',
        requestedByUser: {
          name: 'Chaitanya Reddy Mula',
          email: 'chaitanyareddy.mule@celigo.com',
        },
      },
      {
        _id: '62f15359f8b63672312c3100',
        type: 'flow_events',
        _flowIds: [
          '60db46af9433830f8f0e0fe7',
        ],
        startTime: '2022-08-08T17:17:55.739Z',
        endTime: '2022-08-08T18:17:55.738Z',
        status: 'success',
        reportGenerationErrors: [],
        createdAt: '2022-08-08T18:18:01.587Z',
        startedAt: '2022-08-08T18:18:03.082Z',
        endedAt: '2022-08-08T18:18:34.775Z',
        requestedByUser: {
          name: 'Chaitanya Reddy Mula',
          email: 'chaitanyareddy.mule@celigo.com',
        },
      },
    ];

    store(eventReports);
    const params = {
      eventreports: 'eventreports',
      path: '/reports/eventreports',
    };

    await initReports(params);
    const prevPageButtonNode = screen.getByTestId('prevPage');

    expect(prevPageButtonNode).toBeInTheDocument();
    const nextPageButtonNode = screen.getByTestId('nextPage');

    expect(nextPageButtonNode).toBeInTheDocument();
    fireEvent.click(nextPageButtonNode);
  });
});

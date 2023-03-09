import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewReportDetails from './index';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';

let initialStore;
const mockGoBackFn = jest.fn();

function store(eventReports, flows) {
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
    draft.data.resources.flows = flows;
    draft.data.resources.eventreports = eventReports;
  });
}

async function initViewReportDetails(params) {
  const ui = (
    <MemoryRouter
      initialEntries={[{ pathname: params.path }]}
        >
      <Route
        path="/reports/:reportType/view/reportDetails/:reportId"
        params={{ reportId: params.reportId, reportType: params.reportType }}
            >
        <ViewReportDetails />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

jest.mock('../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/LoadResources'),
  default: newprops => (
    <div>{newprops.children}</div>
  ),
}
));

jest.mock('../../../components/drawer/Right', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/drawer/Right'),
  default: newprops => (
    <div>{newprops.children}</div>
  ),
}
));
jest.mock('../../../components/drawer/Right/DrawerHeader', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/drawer/Right/DrawerHeader'),
  default: () => (
    <div>Header</div>
  ),
}
));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockGoBackFn,
  }),
}));

describe('viewReportDetails', () => {
  beforeEach(() => {
    initialStore = reduxStore;
  });

  afterEach(() => {
    cleanup();
  });
  test('should able to test the view report details pane by clicking on close button', async () => {
    const eventReports = [
      {
        _id: '62f15359f8b63672312c3299',
        type: 'flow_events',
        _flowIds: [
          '60db46af9433830f8f0e0fe7',
        ],
        startTime: '2022-08-08T17:17:55.739Z',
        endTime: '2022-08-08T18:17:55.738Z',
        status: 'completed',
        reportGenerationErrors: [],
        createdAt: '2022-08-08T18:18:01.587Z',
        startedAt: '2022-08-08T18:18:03.082Z',
        endedAt: '2022-08-08T18:18:34.775Z',
        requestedByUser: {
          name: 'test user',
          email: 'testuser@test.com',
        },
      },
    ];
    const flows = [{
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
    const params = {
      reportId: '62f15359f8b63672312c3299',
      reportType: 'eventreports',
      path: '/reports/eventreports/view/reportDetails/62f15359f8b63672312c3299',
    };

    store(eventReports, flows);
    initViewReportDetails(params);
    const headerNode = screen.getByText('Header');

    expect(headerNode).toBeInTheDocument();
    const tabNode = screen.getByRole('tab', { name: 'View details' });

    expect(tabNode).toBeInTheDocument();
    const listitemNode = screen.getAllByRole('listitem');

    expect(listitemNode).toHaveLength(7);
    const closeButtonNode = screen.getByRole('button', { name: 'Close' });

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockGoBackFn).toHaveBeenCalledTimes(1);
  });
  test('should able to test the view report details pane by giving wrong report type', () => {
    const eventReports = [
      {
        _id: '62f15359f8b63672312c3299',
        type: 'flow_events',
        _flowIds: [
          '60db46af9433830f8f0e0fe7',
        ],
        startTime: '2022-08-08T17:17:55.739Z',
        endTime: '2022-08-08T18:17:55.738Z',
        status: 'completed',
        reportGenerationErrors: [],
        createdAt: '2022-08-08T18:18:01.587Z',
        startedAt: '2022-08-08T18:18:03.082Z',
        endedAt: '2022-08-08T18:18:34.775Z',
        requestedByUser: {
          name: 'test user',
          email: 'testuser@test.com',
        },
      },
    ];
    const flows = [{
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
    const params = {
      reportId: '62f15359f8b63672312c3299',
      reportType: 'test',
      path: '/reports/test/view/reportDetails/62f15359f8b63672312c3299',
    };

    store(eventReports, flows);
    initViewReportDetails(params);
    const headerNode = screen.getByText('Header');

    expect(headerNode).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', { name: 'Close' });

    expect(closeButtonNode).toBeInTheDocument();
  });
  test('should able to test the view report details pane by having no flows', () => {
    const eventReports = [
      {
        _id: '62f15359f8b63672312c3299',
        type: 'flow_events',
        _flowIds: [
          '60db46af9433830f8f0e0fe7',
        ],
        startTime: '2022-08-08T17:17:55.739Z',
        endTime: '2022-08-08T18:17:55.738Z',
        status: 'completed',
        reportGenerationErrors: [],
        createdAt: '2022-08-08T18:18:01.587Z',
        startedAt: '2022-08-08T18:18:03.082Z',
        endedAt: '2022-08-08T18:18:34.775Z',
      },
    ];
    const flows = [];
    const params = {
      reportId: '62f15359f8b63672312c3299',
      reportType: 'eventreports',
      path: '/reports/eventreports/view/reportDetails/62f15359f8b63672312c3299',
    };

    store(eventReports, flows);
    initViewReportDetails(params);
    const flowDetailsNode = screen.getByText('Flow id: 60db46af9433830f8f0e0fe7(Flow deleted)');

    expect(flowDetailsNode).toBeInTheDocument();
  });
  test('should able to test the view report details pane which has only email id as the Requested by details', () => {
    const eventReports = [
      {
        _id: '62f15359f8b63672312c3299',
        type: 'flow_events',
        _flowIds: [
          '60db46af9433830f8f0e0fe7',
        ],
        startTime: '2022-08-08T17:17:55.739Z',
        endTime: '2022-08-08T18:17:55.738Z',
        status: 'completed',
        reportGenerationErrors: [],
        createdAt: '2022-08-08T18:18:01.587Z',
        startedAt: '2022-08-08T18:18:03.082Z',
        endedAt: '2022-08-08T18:18:34.775Z',
        requestedByUser: {
          email: 'testuser@test.com',
        },
      },
    ];
    const flows = [{
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
    const params = {
      reportId: '62f15359f8b63672312c3299',
      reportType: 'eventreports',
      path: '/reports/eventreports/view/reportDetails/62f15359f8b63672312c3299',
    };

    store(eventReports, flows);
    initViewReportDetails(params);
    const requestedByNode = screen.getByText('testuser@test.com');

    expect(requestedByNode).toBeInTheDocument();
  });
});


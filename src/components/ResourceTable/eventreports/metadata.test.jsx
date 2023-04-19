
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.resources = {
    flows: [
      {
        _id: 'flow_id_1',
        name: 'flownametest',
        _integrationId: 456,
        _flowGroupingId: 6748392,
      },
    ],
    integrations: [{
      _id: 456,
      flowGroupings: [{
        _id: 6748392,
        name: 'flownametest2',
      }],
      name: 'integrationTestName',
    }],
    flowGroupings: [{
      _id: 6748392,
      name: 'flownametest2',
    }],
  };
  draft.user = {
    preferences: {
      environment: 'production',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'h:mm:ss a',
      expand: 'Resources',
      scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
      showReactSneakPeekFromDate: '2019-11-05',
      showReactBetaFromDate: '2019-12-26',
      defaultAShareId: 'own',
      dashboard: {
        view: 'tile',
        pinnedIntegrations: [],
      },
      drawerOpened: false,
    },
    profile: {
      _id: '625e84b4a2bca9036eb61252',
      name: 'demo user',
      email: 'demoUser@celigo.com',
      role: 'CEO',
      company: 'celigo',
      createdAt: '2022-04-19T09:45:25.111Z',
      useErrMgtTwoDotZero: true,
      authTypeSSO: null,
      timezone: 'Asia/Kolkata',
    },
    notifications: {
      accounts: [],
      stacks: [],
      transfers: [],
    },
    org: {
      users: [],
      accounts: [
        {
          _id: 'own',
          accessLevel: 'owner',
          ownerUser: {
            licenses: [
              {
                _id: '625e84b5a2bca9036eb61253',
                created: '2022-04-19T09:45:25.125Z',
                lastModified: '2022-04-28T05:05:45.751Z',
                type: 'endpoint',
                tier: 'free',
                trialEndDate: '2022-05-28T05:05:45.740Z',
                supportTier: 'essential',
                sandbox: false,
                resumable: false,
              },
            ],
          },
        },
      ],
    },
    debug: false,
  };
});

jest.mock('../../CeligoTable/TableContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTable/TableContext'),
  useGetTableContext: () => ({
    resourceType: 'eventreports',
  }),
}));

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

function initImports(data = []) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={data} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}
describe('test suite for eventreports', () => {
  const startDate = new Date('2018-12-24T10:33:30.000+05:30');
  const endDate = new Date('2022-10-02T10:33:30.000+05:30');
  const createdDate = new Date('2022-12-22T10:33:30.000+05:30');

  test('should render the table accordingly and status is set to completed', async () => {
    const data = [{_id: 'flow_id_1', status: 'completed', _flowIds: ['flow_id_1'], startTime: startDate, endTime: endDate, createdAt: createdDate, requestedByUser: {name: 'def', email: 'def@gmail.com'}}];

    initImports(data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      ' Integration',
      ' Flows',
      ' Start date',
      ' End date',
      'Timestamp',
      ' Status',
      'Requested by',
      'Actions',
    ]);

    //  first for table headings and the second as data row
    expect(screen.getAllByRole('row')).toHaveLength(2);

    expect(screen.getByRole('rowheader', { name: 'integrationTestName'})).toBeInTheDocument();
    const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(cells).toEqual([
      'flownametest',
      '12/24/2018 10:33:30 am',
      '10/02/2022 10:33:30 am',
      '12/22/2022 10:33:30 am',
      'Completed',
      'def',
      '',
    ]);
    const actionButton = screen.getByRole('button', {name: /more/i});

    await userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'View report details',
      'Download results',
    ]);
  });
  test('should render the table accordingly and status is set to running', async () => {
    const data = [{_id: 'flow_id_1', status: 'running', _flowIds: ['flow_id_1'], startTime: startDate, endTime: endDate, createdAt: createdDate, requestedByUser: {name: 'def', email: 'def@gmail.com'}}];

    initImports(data);
    const actionButton = screen.getByRole('button', {name: /more/i});

    await userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'View report details',
      'Cancel Report',
    ]);
  });
  test('should render the table accordingly and status is set to queued', async () => {
    const data = [{_id: 'flow_id_1', status: 'queued', _flowIds: ['flow_id_1'], startTime: startDate, endTime: endDate, createdAt: createdDate, requestedByUser: {name: 'def', email: 'def@gmail.com'}}];

    initImports(data);
    const actionButton = screen.getByRole('button', {name: /more/i});

    await userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Cancel Report',
    ]);
  });
});

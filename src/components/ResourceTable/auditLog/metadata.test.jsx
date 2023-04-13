
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mutateStore, reduxStore, renderWithProviders } from '../../../test/test-utils';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
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

function initImports(data = []) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={data} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}
describe('test suite for auditlog', () => {
  const testDate = new Date('2018-12-24T10:33:30.000+05:30');

  test('should render the table accordingly', () => {
    const data = [{
      time: testDate,
      byUser: {
        name: 'auditlogs',
        email: 'auditlogtest@celigo.com',
      },
      source: 'UI',
      _resourceId: '6366bee72c1bd1023108c05b',
      resourceType: 'connection',
      event: 'Update',
      fieldChange: {
        fieldPath: 'pageProcessors',
        oldValue: '2022-11-06T20:34:51.426Z',
        newValue: '2022-11-07T20:20:23.020Z',
      },
      _id: 'auditlogs',
    }];

    initImports(data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Time',
      'User',
      'Source',
      'Resource type',
      'Resource name',
      'Action',
      'Field',
      'Old value',
      'New value',
    ]);

    //  first for table headings and the second as data row
    expect(screen.getAllByRole('row')).toHaveLength(2);

    expect(screen.getByRole('rowheader', { name: '12/24/2018 10:33:30 am'})).toBeInTheDocument();

    const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(cells).toEqual([
      'auditlogs',
      'UI',
      'Connection',
      '6366bee72c1bd1023108c05b',
      'Update',
      'pageProcessors',
      '2022-11-06T20:34:51.426Z',
      '2022-11-07T20:20:23.020Z',
    ]);
  });
});

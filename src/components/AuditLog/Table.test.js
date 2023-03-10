import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {renderWithProviders, reduxStore, mutateStore} from '../../test/test-utils';
import AuditLogTable from './AuditLogTable';

const initialStore = reduxStore;

const demoIntegration = {
  integrations: {
    '6253af74cddb8a1ba550a010': [
      {
        _id: '62c6f1aea2f4a703c3dee3fd',
        resourceType: 'flow',
        _resourceId: '62c6f122a2f4a703c3dee3d0',
        source: 'ui',
        fieldChanges: [
          {
            oldValue: true,
            newValue: false,
            fieldPath: 'disabled',
          },
        ],
        event: 'update',
        time: '2022-07-07T14:46:06.187Z',
        byUser: {
          _id: '62386a5fed961b5e22e992c7',
          email: 'testUser@celigo.com',
          name: 'testUser',
        },
      },
      {
        _id: '62c6f15ea2f4a703c3dee3e7',
        resourceType: 'flow',
        _resourceId: '62c6f122a2f4a703c3dee3d0',
        source: 'ui',
        fieldChanges: [
          {
            oldValue: [],
            newValue: [
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                type: 'import',
                _importId: '62c6f15aae93a81493321a87',
              },
            ],
            fieldPath: 'pageProcessors',
          },
        ],
        event: 'update',
        time: '2022-07-07T14:44:46.154Z',
        byUser: {
          _id: '62386a5fed961b5e22e992c7',
          email: 'testUser@celigo.com',
          name: 'testUser',
        },
      },
      {
        _id: '62c6f122a2f4a703c3dee3d1',
        resourceType: 'flow',
        _resourceId: '62c6f122a2f4a703c3dee3d0',
        source: 'ui',
        fieldChanges: [],
        event: 'create',
        time: '2022-07-07T14:43:46.768Z',
        byUser: {
          _id: '62386a5fed961b5e22e992c7',
          email: 'testUser@celigo.com',
          name: 'testUser',
        },
      },
    ],
  },
};
const demoFlow = {
  flow_id: [
    {
      _id: 'script_id_1',
      resourceType: 'script',
      _resourceId: 'script_id',
      source: 'system',
      fieldChanges: [
        {},
      ],
      event: 'update',
      time: '2022-06-06T04:57:57.569Z',
      byUser: {
        _id: 'user_id',
        email: 'test_user@test.com',
        name: 'Test User',
      },
    },
    {
      _id: 'script_id_2',
      resourceType: 'script',
      _resourceId: 'script_id',
      source: 'system',
      fieldChanges: [
        {},
      ],
      event: 'create',
      time: '2022-06-06T04:57:53.569Z',
      byUser: {
        _id: 'user_id',
        email: 'test_user@test.com',
        name: 'Test User',
      },
    },
  ],
};

describe('test cases for audit log table', () => {
  test('should display all the row headers of the auditlog table', () => {
    const resourceType = 'flows';
    const resourceId = 'flow_id';

    mutateStore(initialStore, draft => {
      draft.session.filters = {};
      draft.data.audit.flows = demoFlow;
    });
    renderWithProviders(<MemoryRouter><AuditLogTable resourceId={resourceId} resourceType={resourceType} /></MemoryRouter>, {initialStore});
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Resource type')).toBeInTheDocument();
    expect(screen.getByText('Resource name')).toBeInTheDocument();
    expect(screen.getByText('Field')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Old value')).toBeInTheDocument();
    expect(screen.getByText('New value')).toBeInTheDocument();
  });

  test('should display the default message when no logs are found', () => {
    renderWithProviders(<AuditLogTable resourceId="integration_id" resourceType="integrations" />);
    expect(screen.getByText("You don't have any audit logs.")).toBeInTheDocument();
  });
  test('should display contents of auditlog table when resourceType is flows', () => {
    mutateStore(initialStore, draft => {
      draft.session.filters = {
        'integrations-6253af74cddb8a1ba550a010-auditLogs': {
          sort: {
            order: 'desc',
            orderBy: 'lastModified',
          },
          selected: {},
          isAllSelected: false,
        },
      };
      draft.data.audit = demoIntegration;
    });
    const filters = {
      resourceType: 'flow',
    };
    const props = {resourceId: '6253af74cddb8a1ba550a010', resourceType: 'integrations', filters: {filters}};

    renderWithProviders(<MemoryRouter><AuditLogTable {...props} /></MemoryRouter>, {initialStore});
    expect(screen.getAllByText(/testUser/i)).toHaveLength(3);
    expect(screen.getAllByText('UI')).toHaveLength(3);
    expect(screen.getAllByText('Flow')).toHaveLength(3);
    expect(screen.getAllByText('Update')).toHaveLength(2);
    expect(screen.getByText('disabled')).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();
  });
});

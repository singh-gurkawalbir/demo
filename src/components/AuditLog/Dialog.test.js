import React from 'react';
import {screen} from '@testing-library/react';
import {renderWithProviders, reduxStore, mockGetRequestOnce} from '../../test/test-utils';
import AuditLogDialog from './AuditLogDialog';
import { runServer } from '../../test/api/server';

const resourceType = 'flows';
const resourceId = 'flow_id';
const initialStore = reduxStore;

initialStore.getState().data.resources.flows = [
  {
    _id: 'flow_id',
    name: 'demo flow',
    disabled: false,
    _integrationId: 'integration_id',
    pageProcessors: [{
      type: 'import',
      _importId: 'resource_id',
    }],
  },
];
describe('uI test cases for audit log dialog box', () => {
  runServer();
  afterAll(async () => {
    // normal cleanup things
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  });

  test('should display the auditlog header along with the resource name', () => {
    mockGetRequestOnce('/api/flows/flow_id/audit', []);
    renderWithProviders(<AuditLogDialog resourceId={resourceId} resourceType={resourceType} />, {initialStore});
    expect(screen.getByText(/Audit log: demo flow/i)).toBeInTheDocument();
  });
  test('should only display the auditlog header when no resource is passed', () => {
    mockGetRequestOnce('/api/flows/flow_id/audit', []);
    renderWithProviders(<AuditLogDialog resourceId={resourceId} resourceType={resourceType} />);
    expect(screen.getByText(/Audit log/i)).toBeInTheDocument();
  });
});

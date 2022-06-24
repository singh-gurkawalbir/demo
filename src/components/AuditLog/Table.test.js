/* eslint-disable import/named */
/* global describe, test, expect */
import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore} from '../../test/test-utils';
import AuditLogTable from './AuditLogTable';

const resourceType = 'flows';
const resourceId = 'flow_id';
const initialStore = reduxStore;

initialStore.getState().session.filters = {};
initialStore.getState().data.audit.flows = {
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
  test('Audit log table is visible', () => {
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

  test("You don't have any audit logs message to be visible when no logs are found", () => {
    renderWithProviders(<MemoryRouter><AuditLogTable resourceId="integration_id" resourceType="integrations" /></MemoryRouter>);
    expect(screen.getByText("You don't have any audit logs.")).toBeInTheDocument();
  });
});

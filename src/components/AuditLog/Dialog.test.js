/* eslint-disable import/named */
/* global describe, test, expect, afterAll */
import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore} from '../../test/test-utils';
import AuditLogDialog from './AuditLogDialog';

const resourceType = 'flows';
const resourceId = 'flow_id';
const initialStore = reduxStore;

initialStore.getState().data.resources.flows = [
  {
    _id: 'flow_id',
    name: 'resource_name',
    disabled: false,
    _integrationId: 'integration_id',
    pageProcessors: [{
      type: 'import',
      _importId: 'resource_id',
    }],
  },
];
describe('UI test cases for audit log dialog box', () => {
  afterAll(async () => {
    // normal cleanup things
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  });

<<<<<<< Updated upstream
  test('Audit log text is visible', () => {
    renderWithProviders(<MemoryRouter><AuditLogDialog resourceId={resourceId} resourceType={resourceType} /></MemoryRouter>, {initialStore});
    expect(screen.getByText(/Audit log: resource_name/i)).toBeInTheDocument();
  });
  test("Only 'Audit log' is visible", () => {
=======
  test('should display the audit log text', () => {
    renderWithProviders(<MemoryRouter><AuditLogDialog resourceId={resourceId} resourceType={resourceType} /></MemoryRouter>, {initialStore});
    expect(screen.getByText(/Audit log: resource_name/i)).toBeInTheDocument();
  });
  test('should display the audit log header', () => {
>>>>>>> Stashed changes
    renderWithProviders(<MemoryRouter><AuditLogDialog resourceId={resourceId} resourceType={resourceType} /></MemoryRouter>);
    expect(screen.getByText(/Audit log/i)).toBeInTheDocument();
  });
});

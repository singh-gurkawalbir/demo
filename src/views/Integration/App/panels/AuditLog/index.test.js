
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders} from '../../../../../test/test-utils';
import AuditLogSection from '.';

jest.mock('../../../../../components/AuditLog', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/AuditLog'),
  default: props => (
    <>
      AuditLog called with
      resourceId : {props.resourceId}
      integrationId : {props.integrationId}
      childId : {props.childId}
    </>
  ),
}));

describe('AuditLogSection UI tests', () => {
  test('should test the case when no integration and child is provided', () => {
    const {utils} = renderWithProviders(<MemoryRouter><AuditLogSection /></MemoryRouter>);

    expect(screen.getByText('Audit log')).toBeInTheDocument();

    expect(utils.container.textContent).toBe('Audit logAuditLog called with resourceId : integrationId : childId : ');
  });
  test('should test the case when integration and child is provided', () => {
    const {utils} = renderWithProviders(<MemoryRouter><AuditLogSection integrationId="someintegrationId" childId="somechildId" /></MemoryRouter>);

    expect(screen.getByText('Audit log')).toBeInTheDocument();

    expect(utils.container.textContent).toBe('Audit logAuditLog called with resourceId : someintegrationIdintegrationId : someintegrationIdchildId : somechildId');
  });
});

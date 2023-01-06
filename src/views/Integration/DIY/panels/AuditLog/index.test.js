
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders} from '../../../../../test/test-utils';
import AuditLogSection from '.';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
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
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should test the case when no integration and child is provided', () => {
    const {utils} = renderWithProviders(<MemoryRouter><AuditLogSection /></MemoryRouter>);

    expect(screen.getByText('Audit log')).toBeInTheDocument();

    expect(utils.container.textContent).toBe('Audit logAuditLog called with resourceId : integrationId : childId : ');
  });
  test('should test the case when only integration is provided', () => {
    const {utils} = renderWithProviders(<MemoryRouter><AuditLogSection integrationId="someintegrationId" /></MemoryRouter>);

    expect(utils.container.textContent).toBe('Audit logAuditLog called with resourceId : someintegrationIdintegrationId : someintegrationIdchildId : ');
  });
  test('should test the case when only childId is provided', () => {
    const {utils} = renderWithProviders(<MemoryRouter><AuditLogSection childId="somechildId" /></MemoryRouter>);

    expect(screen.getByText('Audit log')).toBeInTheDocument();
    expect(utils.container.textContent).toBe('Audit logAuditLog called with resourceId : somechildIdintegrationId : somechildIdchildId : somechildId');
  });
  test('should test use effect dispatch call', () => {
    renderWithProviders(<MemoryRouter><AuditLogSection integrationId="someintegrationId" childId="somechildId" /></MemoryRouter>);
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_REQUEST_COLLECTION',
        resourceType: 'integrations/someintegrationId/revisions',
        message: undefined,
        refresh: undefined,
        integrationId: undefined,
      });
  });
  test('should test dispatch call when STANDALONE integration is provided', () => {
    renderWithProviders(<MemoryRouter><AuditLogSection integrationId="none" /></MemoryRouter>);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});

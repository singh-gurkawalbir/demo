/* global test, expect, describe */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore } from '../../../../../test/test-utils';
import TypeCell from './index';

const initialStore = reduxStore;

const end = new Date();
const notExpired = new Date();

end.setMonth(end.getMonth() - 2);
notExpired.setMonth(notExpired.getMonth() + 2);

initialStore.getState().user.preferences = {defaultAShareId: 'own'};

initialStore.getState().user.org.accounts = [
  {_id: 'own',
    ownerUser: {licenses: [
      {_integrationId: '1_integrationId', _connectorId: 'some_connectorId', resumable: false, expires: end},
      {_integrationId: '2_integrationId', _connectorId: 'some_connectorId', resumable: false, trialEndDate: end},
      {_integrationId: '3_integrationId', _connectorId: 'some_connectorId', expires: notExpired},
    ]}}];

describe('TypeCell UI tests', () => {
  test('should show custom message with 2 flow error', () => {
    renderWithProviders(<TypeCell tile={{numFlows: 2}} />);
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.getByText('2 Flows')).toBeInTheDocument();
  });
  test('should show custom message when no flow error is provided', () => {
    renderWithProviders(<TypeCell tile={{}} />);
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.getByText('0 Flows')).toBeInTheDocument();
  });
  test('should show "Integration app" on the screen when no connector id is provided', () => {
    renderWithProviders(<TypeCell tile={{_connectorId: 'some_connectorId'}} />);
    expect(screen.getByText('Integration app')).toBeInTheDocument();
  });
  test('should show the expiring message when integration expires', () => {
    renderWithProviders(<TypeCell tile={{_connectorId: 'some_connectorId', _integrationId: '1_integrationId'}} />, {initialStore});
    expect(screen.getByText('Integration app')).toBeInTheDocument();
    expect(screen.getByText('Expired 61 days ago')).toBeInTheDocument();
  });
  test('should show the expiring message when integration trieal ends', () => {
    renderWithProviders(<TypeCell tile={{_connectorId: 'some_connectorId', _integrationId: '2_integrationId'}} />, {initialStore});
    expect(screen.getByText('Integration app')).toBeInTheDocument();
    expect(screen.getByText('Expired 61 days ago')).toBeInTheDocument();
  });
  test('should not show any expired message when App is not expired', () => {
    renderWithProviders(<TypeCell tile={{_connectorId: 'some_connectorId', _integrationId: '3_integrationId'}} />, {initialStore});
    expect(screen.getByText('Integration app')).toBeInTheDocument();
    expect(screen.queryByText('Expired', {exact: false})).not.toBeInTheDocument();
  });
});

/* global test, expect, describe,beforeEach */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../test/test-utils';
// import obj from './metadata';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';
import actions from '../../../actions';

const resource = {
  _id: '5e7068331c056a75e6df19b2',
  createdAt: '2020-03-17T06:03:31.798Z',
  lastHeartbeatAt: '2021-03-19T23:47:55.111Z',
  lastModified: '2020-03-19T23:47:55.181Z',
  type: 'rest',
  name: 'AgentName',
  assistant: '3dcart',
  offline: true,
  shared: true,
};

describe('Agents metadata UI tests', () => {
  beforeEach(() => {
    const {store} = renderWithProviders(
      <MemoryRouter>
        <CeligoTable
          actionProps={{resourceType: 'agents'}}
          {...metadata}
          data={
               [
                 resource,
               ]
              }
      />
      </MemoryRouter>
    );
    const profile = {timezone: 'Asia/Kolkata'};

    store.dispatch(actions.user.profile.update(profile));
  });
  test('should test Name fields', () => {
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('AgentName')).toBeInTheDocument();
  });
  test('should test Status fields', () => {
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });
  test('should test Last heartbeat fields', () => {
    expect(screen.getByText('Last heartbeat')).toBeInTheDocument();
    expect(screen.getByText('03/20/2021 5:17:55 am')).toBeInTheDocument();
  });
  test('should test Last updated fields', () => {
    expect(screen.getByText('Last updated')).toBeInTheDocument();
    expect(screen.getByText('03/20/2020 5:17:55 am')).toBeInTheDocument();
  });
  test('should test Install fields', () => {
    expect(screen.getByText('Install')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });
  test('should test Access token fields', () => {
    expect(screen.getByText('Access token')).toBeInTheDocument();
    expect(screen.getByText('Show token')).toBeInTheDocument();
  });
  test('should test Actions fields', () => {
    expect(screen.getByText('Actions')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    expect(screen.getByText('Edit agent')).toBeInTheDocument();
    expect(screen.getByText('Used by')).toBeInTheDocument();
    expect(screen.getByText('Generate new token')).toBeInTheDocument();
    expect(screen.getByText('Delete agent')).toBeInTheDocument();
  });
});

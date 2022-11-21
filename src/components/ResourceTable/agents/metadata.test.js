/* global test, expect, describe,beforeEach */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';

const initialStore = reduxStore;

initialStore.getState().user.profile = { timezone: 'Asia/Calcutta' };

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

function existanceOfCellInDom(text, role) {
  const cells = screen.getAllByRole(role);

  return cells.findIndex(each => each.textContent === text);
}
let headerI;
let cellI;

function expectFunction(header, cell) {
  expect(header).toBeGreaterThan(-1);
  expect(cell).toBeGreaterThan(-1);
  expect(cell).toEqual(header);
}

describe('Agents metadata UI tests', () => {
  beforeEach(() => {
    renderWithProviders(
      <MemoryRouter>
        <CeligoTable
          actionProps={{resourceType: 'agents'}}
          {...metadata}
          data={
               [resource]
          } />
      </MemoryRouter>, {initialStore}
    );
  });

  test('should verify all the coulmns', () => {
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('AgentName')).toBeInTheDocument();
    headerI = existanceOfCellInDom('Name', 'columnheader');
    cellI = existanceOfCellInDom('AgentNameShared', 'cell');
    expectFunction(headerI, cellI);

    headerI = existanceOfCellInDom('Status', 'columnheader');
    cellI = existanceOfCellInDom('Offline', 'cell');
    expectFunction(headerI, cellI);

    headerI = existanceOfCellInDom('Last heartbeat', 'columnheader');
    cellI = existanceOfCellInDom('03/20/2021 5:17:55 am', 'cell');

    expectFunction(headerI, cellI);

    headerI = existanceOfCellInDom('Last updated', 'columnheader');
    cellI = existanceOfCellInDom('03/20/2020 5:17:55 am', 'cell');
    expectFunction(headerI, cellI);

    headerI = existanceOfCellInDom('Access token', 'columnheader');
    cellI = existanceOfCellInDom('Show token', 'cell');

    expectFunction(headerI, cellI);
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

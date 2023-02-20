/* eslint-disable jest/expect-expect */

import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';
import metadata from './metadata';
import CeligoTable from '../../../CeligoTable';
import { message } from '../../../../utils/messageStore';

jest.mock('../cells/SelectAllErrors', () => ({
  __esModule: true,
  ...jest.requireActual('../cells/SelectAllErrors'),
  default: () => (
    <div>MockedSelectAll</div>
  ),
}));

jest.mock('../cells/SelectSource', () => ({
  __esModule: true,
  ...jest.requireActual('../cells/SelectSource'),
  default: () => (
    <div>MockedSelectSource</div>
  ),
}));

function initFunction(data = {}, actionProps, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <CeligoTable
        actionProps={actionProps}
        {...metadata}
        data={[data]} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

const initialStore = reduxStore;

initialStore.getState().user.profile = { timezone: 'Asia/Calcutta' };

initialStore.getState().data.resources.exports = [{
  _id: '5e5f495a3a9b335b1a007b43',
  adaptorType: 'NetSuiteExport',
}];

function indexOfCell(text, role) {
  const cells = screen.getAllByRole(role);

  return cells.findIndex(each => each.textContent === text);
}

const props = {
  errorId: 'someErrorId',
  message: 'someMessage',
  code: 'someCode',
  source: 'somesource',
  classification: 'someclassification',
  occurredAt: '2022-05-18T18:16:31.989Z',
};

let headerIndex;
let cellIndex;

function expectFunction(header, cell) {
  expect(header).toBeGreaterThan(-1);
  expect(cell).toBeGreaterThan(-1);
  expect(cell).toEqual(header);
}

describe("openErros table's metadata UI tests", () => {
  test('should verify when error is selected', () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    initialStore.getState().session.filters.openErrors = {activeErrorId: 'someErrorId'};

    initFunction({errorId: 'someErrorId', message: 'first'}, {}, initialStore);
    const rows = screen.getAllByRole('row');
    const classOfLast = rows[rows.length - 1].getAttribute('class');

    expect(classOfLast.indexOf('Mui-selected')).toBeGreaterThan(-1);
  });
  test('should verify the Select All column', () => {
    initFunction(props);

    headerIndex = indexOfCell('MockedSelectAll', 'columnheader');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(screen.getByTitle(message.ERROR_MANAGEMENT_2.SELECT_ERROR_HOVER_MESSAGE)).toBeInTheDocument();
  });
  test('should verify Message cloumn', () => {
    initFunction(props);
    headerIndex = indexOfCell('Message', 'columnheader');
    cellIndex = indexOfCell(' Retry failed someMessage', 'cell');
    expectFunction(headerIndex, cellIndex);
  });
  test('should verify the code coulmn', () => {
    initFunction(props);
    headerIndex = indexOfCell('Code', 'columnheader');
    cellIndex = indexOfCell('someCode', 'cell');
    expectFunction(headerIndex, cellIndex);
  });
  test('should verify the Select Source coulmn', () => {
    initFunction(props);
    headerIndex = indexOfCell('MockedSelectSource', 'columnheader');
    cellIndex = indexOfCell('somesource', 'cell');
    expectFunction(headerIndex, cellIndex);
  });
  test('should verify the Classification coulmn', () => {
    initFunction(props);
    headerIndex = indexOfCell(' Classification', 'columnheader');
    cellIndex = indexOfCell('someclassification', 'cell');
    expectFunction(headerIndex, cellIndex);
  });

  test('should verify SelectDate coulmn', () => {
    initFunction({errorId: 'someErrorId', occurredAt: '2022-05-18T18:16:31.989Z'}, {}, initialStore);
    headerIndex = indexOfCell(' Timestamp', 'columnheader');
    cellIndex = indexOfCell('05/18/2022 11:46:31 pm', 'cell');
    expectFunction(headerIndex, cellIndex);
  });
  test('should not show action button when action is in progress', () => {
    initFunction(props, {actionInProgress: true});
    expect(screen.queryByRole('button', {name: /more/i})).not.toBeInTheDocument();
  });
  test('should show actions options for the non retryable errors', async () => {
    initFunction(props, {actionInProgress: false});
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    expect(screen.getByText('Resolve')).toBeInTheDocument();
    expect(screen.getByText('View error details')).toBeInTheDocument();
  });
  test('should show actions options for the retryable errors', async () => {
    initFunction({...props, retryDataKey: 'someRetryDataKEy'}, {actionInProgress: false});
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    expect(screen.getByText('Edit retry data')).toBeInTheDocument();
    expect(screen.getByText('Resolve')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
    expect(screen.getByText('View error details')).toBeInTheDocument();
  });
  test('should show the option for download when source is FTP bridge', async () => {
    initFunction({...props, source: 'ftp_bridge', retryDataKey: 'someRetryDataKey'}, {actionInProgress: false});
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    const menuItems = screen.getAllByRole('menuitem');
    const list = menuItems.map(each => each.textContent);

    expect(list).toEqual(
      [
        'Edit retry data',
        'Resolve',
        'Retry',
        'View error details',
        'Download retry data',
      ]
    );
  });
  test('should show option for View respone and request for NetSuite', async () => {
    initFunction({...props, source: 'ftp_bridge', reqAndResKey: 'reqAndResKey'}, {actionInProgress: false, resourceId: '5e5f495a3a9b335b1a007b43'}, initialStore);
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    const menuItems = screen.getAllByRole('menuitem');
    const list = menuItems.map(each => each.textContent);

    expect(list).toEqual(
      ['Resolve', 'View error details', 'View request', 'View response']
    );
  });
  test('should show option for View respone and request for HTTP', async () => {
    initFunction({...props, source: 'ftp_bridge', reqAndResKey: 'reqAndResKey'}, {actionInProgress: false, resourceId: '5e5f495a3a9b335b1a007b43'});
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    const menuItems = screen.getAllByRole('menuitem');
    const list = menuItems.map(each => each.textContent);

    expect(list).toEqual(
      [
        'Resolve',
        'View error details',
        'View HTTP request',
        'View HTTP response',
      ]
    );
  });
});

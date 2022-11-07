/* global test, expect, describe, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';
import metadata from './metadata';
import CeligoTable from '../../../CeligoTable';
import messageStore from '../../../../utils/messageStore';

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
const resourceId = '5e5f495a3a9b335b1a007b43';

initialStore.getState().user.profile = { timezone: 'Asia/Calcutta' };

initialStore.getState().data.resources.exports = [{
  _id: resourceId,
  adaptorType: 'NetSuiteExport',
}];

function existanceOfCellInDom(text, role) {
  const cells = screen.getAllByRole(role);
  let indeX = -1;

  cells.find((each, index) => {
    indeX = index;

    return each.textContent === text;
  });

  return indeX;
}

const props = {
  errorId: 'someErrorId',
  message: 'someMessage',
  code: 'someCode',
  source: 'somesource',
  classification: 'someclassification',
  occurredAt: '2022-05-18T18:16:31.989Z',
};

describe("ResolvedErros table's metadata UI tests", () => {
  test('should verify the Select All column', () => {
    initFunction(props);

    const headerI = existanceOfCellInDom('MockedSelectAll', 'columnheader');

    expect(headerI).toBeGreaterThan(-1);
    expect(screen.getByTitle(messageStore('SELECT_ERROR_HOVER_MESSAGE'))).toBeInTheDocument();
  });
  test('should verify Message cloumn', () => {
    initFunction(props);

    const headerI = existanceOfCellInDom('Message', 'columnheader');
    const cellI = existanceOfCellInDom('someMessage', 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);
    expect(cellI).toEqual(headerI);
  });
  test('should verify the code coulmn', () => {
    initFunction(props);

    const headerI = existanceOfCellInDom('Code', 'columnheader');
    const cellI = existanceOfCellInDom('someCode', 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);
    expect(cellI).toEqual(headerI);
  });
  test('should verify the Select Source coulmn', () => {
    initFunction(props);

    const headerI = existanceOfCellInDom('MockedSelectSource', 'columnheader');
    const cellI = existanceOfCellInDom('somesource', 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);
    expect(cellI).toEqual(headerI);
  });
  test('should verify the Classification coulmn', () => {
    initFunction(props);

    const headerI = existanceOfCellInDom(' Classification', 'columnheader');
    const cellI = existanceOfCellInDom('someclassification', 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);
    expect(cellI).toEqual(headerI);
  });
  test('should verify SelectDate coulmn', () => {
    initFunction(props, {}, initialStore);

    const headerI = existanceOfCellInDom(' Timestamp', 'columnheader');
    const cellI = existanceOfCellInDom('05/18/2022 11:46:31 pm', 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);
    expect(cellI).toEqual(headerI);
  });
  test('should not show action button when action is in progress', () => {
    initFunction(props, {actionInProgress: true});

    expect(screen.queryByRole('button', {name: /more/i})).not.toBeInTheDocument();
  });
  test('should show actions options for the non retryable errors', () => {
    initFunction(props, {actionInProgress: false});

    userEvent.click(screen.getByRole('button', {name: /more/i}));
    expect(screen.getByText('View error details')).toBeInTheDocument();
  });
  test('should show actions options for the retryable errors', () => {
    initFunction({...props, retryDataKey: 'someRetryDataKEy'}, {actionInProgress: false});

    userEvent.click(screen.getByRole('button', {name: /more/i}));
    expect(screen.getByText('Edit retry data')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
    expect(screen.getByText('View error details')).toBeInTheDocument();
  });
  test('should show option for View respone and request for Netsuite resource', () => {
    initFunction({...props, reqAndResKey: 'reqAndResKey'}, {actionInProgress: false, resourceId}, initialStore);

    userEvent.click(screen.getByRole('button', {name: /more/i}));
    expect(screen.getByText('View error details')).toBeInTheDocument();
    expect(screen.getByText('View request')).toBeInTheDocument();
  });
  test('should show option for View respone and request for HTTP', () => {
    initFunction({...props, reqAndResKey: 'reqAndResKey'}, {actionInProgress: false, resourceId});

    userEvent.click(screen.getByRole('button', {name: /more/i}));
    expect(screen.getByText('View error details')).toBeInTheDocument();
    expect(screen.getByText('View HTTP request')).toBeInTheDocument();
  });
});

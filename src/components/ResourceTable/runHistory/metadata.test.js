/* eslint-disable jest/expect-expect */

import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import CeligoTable from '../../CeligoTable';
import metadata from './metadata';

function initRunHistoryTable(data = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.user.profile = { timezone: 'Asia/Calcutta' };
  });

  const ui = (
    <CeligoTable {...metadata} data={[data]} />
  );

  renderWithProviders(ui, {initialStore});
}

function indexOfCell(text, role) {
  const cells = screen.getAllByRole(role);

  return cells.findIndex(each => each.textContent === text);
}

let headerIndex;
let cellIndex;

function expectFunction(header, cell) {
  expect(header).toBeGreaterThan(-1);
  expect(cell).toBeGreaterThan(-1);
  expect(cell).toEqual(header);
}

const key = 'someKey';

describe('jobStatusWithTag test cases', () => {
  test('should show completed message with errors', () => {
    initRunHistoryTable({ key, status: 'completedWithErrors'});
    expect(indexOfCell('Status', 'columnheader')).toBeDefined();
    expect(indexOfCell('Completed', 'cell')).toBeDefined();
  });
  test('should show duration', () => {
    initRunHistoryTable({ key, startedAt: '2022-05-18T18:16:31.989Z', endedAt: '2022-05-18T18:16:35.989Z'});
    headerIndex = indexOfCell('Duration', 'columnheader');
    cellIndex = indexOfCell('00:00:04', 'cell');

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expectFunction(headerIndex - 1, cellIndex);
  });
  test('should show Started cloumn', () => {
    initRunHistoryTable({ key, startedAt: '2022-05-18T18:16:31.989Z', endedAt: '2022-05-18T18:16:35.989Z'});
    headerIndex = indexOfCell('Started', 'columnheader');
    cellIndex = indexOfCell('05/18/2022 11:46:31 pm', 'cell');

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expectFunction(headerIndex - 1, cellIndex);
  });
  test('should show Completed(time) cloumn', () => {
    initRunHistoryTable({ key, startedAt: '2022-05-18T18:16:31.989Z', endedAt: '2022-05-18T18:16:35.989Z'});
    headerIndex = indexOfCell('Completed', 'columnheader');
    cellIndex = indexOfCell('05/18/2022 11:46:35 pm', 'cell');

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expectFunction(headerIndex - 1, cellIndex);
  });
  test('should show Success cloumn', () => {
    const numSuccess = '1';

    initRunHistoryTable({ key, numSuccess});

    headerIndex = indexOfCell('Success', 'columnheader');
    cellIndex = indexOfCell(numSuccess, 'cell');

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expectFunction(headerIndex - 1, cellIndex);
  });
  test('should show Ignored cloumn', () => {
    const numIgnore = '2';

    initRunHistoryTable({ key, numIgnore});
    headerIndex = indexOfCell('Ignored', 'columnheader');
    cellIndex = indexOfCell(numIgnore, 'cell');

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expectFunction(headerIndex - 1, cellIndex);
  });
  test('should show Errors cloumn', () => {
    const numError = '3';

    initRunHistoryTable({ key, numError});
    headerIndex = indexOfCell('Errors', 'columnheader');
    cellIndex = indexOfCell(numError, 'cell');

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expectFunction(headerIndex - 1, cellIndex);
  });
  test('should show Pages cloumn', () => {
    const numPagesGenerated = '4';

    initRunHistoryTable({ key, numPagesGenerated: 4});
    headerIndex = indexOfCell('Pages', 'columnheader');
    cellIndex = indexOfCell(numPagesGenerated, 'cell');

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expectFunction(headerIndex - 1, cellIndex);
  });
  test('should click on action button and show only download disgnostics', async () => {
    initRunHistoryTable({ key});
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.getByText('Download diagnostics')).toBeInTheDocument();
    expect(screen.queryByText('Download files')).not.toBeInTheDocument();
  });
  test('should click on action button and show download disgnostics and Download file options', async () => {
    initRunHistoryTable({ key, files: [1]});
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.getByText('Download diagnostics')).toBeInTheDocument();
    expect(screen.getByText('Download files')).toBeInTheDocument();
  });
});

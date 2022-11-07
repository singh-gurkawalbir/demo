/* global test, expect, describe */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore } from '../../../test/test-utils';
import CeligoTable from '../../CeligoTable';
import metadata from './metadata';

function initRunHistoryTable(data = {}) {
  const initialStore = reduxStore;

  initialStore.getState().user.profile = { timezone: 'Asia/Calcutta' };

  const ui = (
    <CeligoTable {...metadata} data={[data]} />
  );

  renderWithProviders(ui, {initialStore});
}

function existanceOfCellInDom(text, role) {
  const cells = screen.getAllByRole(role);
  let indeX = -1;

  cells.find((each, index) => {
    each.textContent === text ? indeX = index : null;

    return each.textContent === text;
  });

  return indeX;
}

const key = 'someKey';

describe('JobStatusWithTag test cases', () => {
  test('should show completed message with errors', () => {
    initRunHistoryTable({ key, status: 'completedWithErrors'});
    expect(existanceOfCellInDom('Status', 'columnheader')).toBeDefined();
    expect(existanceOfCellInDom('Completed', 'cell')).toBeDefined();
  });
  test('should show duration', () => {
    initRunHistoryTable({ key, startedAt: '2022-05-18T18:16:31.989Z', endedAt: '2022-05-18T18:16:35.989Z'});
    const headerI = existanceOfCellInDom('Duration', 'columnheader');
    const cellI = existanceOfCellInDom('00:00:04', 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);
    expect(cellI).toEqual(headerI);
  });
  test('should show Started cloumn', () => {
    initRunHistoryTable({ key, startedAt: '2022-05-18T18:16:31.989Z', endedAt: '2022-05-18T18:16:35.989Z'});
    const headerI = existanceOfCellInDom('Started', 'columnheader');
    const cellI = existanceOfCellInDom('05/18/2022 11:46:31 pm', 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);
    expect(cellI).toEqual(headerI);
  });
  test('should show Completed(time) cloumn', () => {
    initRunHistoryTable({ key, startedAt: '2022-05-18T18:16:31.989Z', endedAt: '2022-05-18T18:16:35.989Z'});
    const headerI = existanceOfCellInDom('Completed', 'columnheader');
    const cellI = existanceOfCellInDom('05/18/2022 11:46:35 pm', 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);
    expect(cellI).toEqual(headerI);
  });
  test('should show Success cloumn', () => {
    const numSuccess = '1';

    initRunHistoryTable({ key, numSuccess});

    const headerI = existanceOfCellInDom('Success', 'columnheader');
    const cellI = existanceOfCellInDom(numSuccess, 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);
    expect(cellI).toEqual(headerI);
  });
  test('should show Ignored cloumn', () => {
    const numIgnore = '2';

    initRunHistoryTable({ key, numIgnore});
    const headerI = existanceOfCellInDom('Ignored', 'columnheader');
    const cellI = existanceOfCellInDom(numIgnore, 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);
    expect(cellI).toEqual(headerI);
  });
  test('should show Errors cloumn', () => {
    const numError = '3';

    initRunHistoryTable({ key, numError});
    const headerI = existanceOfCellInDom('Errors', 'columnheader');
    const cellI = existanceOfCellInDom(numError, 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);
    expect(cellI).toEqual(headerI);
  });
  test('should show Pages cloumn', () => {
    const numPagesGenerated = '4';

    initRunHistoryTable({ key, numPagesGenerated: 4});
    const headerI = existanceOfCellInDom('Pages', 'columnheader');
    const cellI = existanceOfCellInDom(numPagesGenerated, 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);
    expect(cellI).toEqual(headerI);
  });
  test('should click on action button and show only download disgnostics', () => {
    initRunHistoryTable({ key});
    userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.getByText('Download diagnostics')).toBeInTheDocument();
    expect(screen.queryByText('Download files')).not.toBeInTheDocument();
  });
  test('should click on action button and show download disgnostics and Download file options', () => {
    initRunHistoryTable({ key, files: [1]});
    userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.getByText('Download diagnostics')).toBeInTheDocument();
    expect(screen.getByText('Download files')).toBeInTheDocument();
  });
});

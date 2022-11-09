/* global describe, expect, test, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../test/test-utils';
import CeligoTable from '../../CeligoTable';
import metadata from './metadata';

const mockTableContext = { resourceType: 'scripts'};

jest.mock('../../CeligoTimeAgo', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTimeAgo'),
  default: ({date}) => date,
}));

jest.mock('../../CeligoTable/TableContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTable/TableContext'),
  useGetTableContext: () => mockTableContext,
}));

describe('Test suite for scripts', () => {
  test('should render the table accordingly', () => {
    const lastModified = new Date().toISOString();
    const data = [{
      _id: 'script123',
      name: 'scriptName',
      lastModified,
    }];

    renderWithProviders(
      <MemoryRouter>
        <CeligoTable {...metadata} data={data} />
      </MemoryRouter>
    );

    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Name',
      'Last updated',
      'Actions',
    ]);

    const rowValues = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(rowValues).toEqual([
      'scriptName',
      lastModified,
      '',
    ]);
    expect(screen.getByRole('link', {name: 'scriptName'})).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', {name: /more/i}));

    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Edit script',
      'View execution log',
      'View audit log',
      'Used by',
      'Delete script',
    ]);
  });

  test('should not be able to delete script when in flowBuilder', () => {
    mockTableContext.type = 'flowBuilder';
    const data = [{
      _id: 'script123',
      name: 'scriptName',
      lastModified: new Date().toISOString(),
    }];

    renderWithProviders(
      <MemoryRouter>
        <CeligoTable {...metadata} data={data} />
      </MemoryRouter>
    );
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).not.toContain('Delete script');
  });
});

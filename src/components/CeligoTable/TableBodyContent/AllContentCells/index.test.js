
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AllContentCells from '.';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders } from '../../../../test/test-utils';

async function initAllContentCells({ useColumns = jest.fn().mockReturnValue([]), rowData } = {}) {
  const ui = (
    <MemoryRouter>
      <table>
        <tbody>
          <tr>
            <AllContentCells
              useColumns={useColumns}
              rowData={rowData}
            />
          </tr>
        </tbody>
      </table>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('allContentCells component Test cases', () => {
  runServer();
  test('should pass the intial render with default values', async () => {
    const { utils } = await initAllContentCells();

    expect(utils.container.firstChild.firstChild.firstChild).toBeEmptyDOMElement();
  });

  test('should pass the intial render with default values.', async () => {
    const useColumns = jest.fn(() => [
      {
        key: 'name',
        Value: jest.fn(({rowData}) => rowData.name),
        heading: 'Name',
        isLoggable: true,
      },
      {
        key: 'status',
        Value: jest.fn(({rowData}) => rowData.status),
        heading: 'Status',
      },
      {
        key: 'dummy',
        heading: 'Dummy',
        Value: jest.fn(),
      },
    ]);

    await initAllContentCells({
      useColumns,
      rowData: {
        name: 'row name',
        status: 'true',
      },
    });

    const TableHead = screen.getByRole('rowheader', {name: 'row name'});
    const TableData = screen.getByRole('cell', {name: 'true'});

    expect(TableHead).toBeInTheDocument();
    expect(TableData).toBeInTheDocument();
  });
});

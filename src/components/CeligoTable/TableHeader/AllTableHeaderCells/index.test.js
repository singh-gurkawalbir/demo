
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AllTableHeaderCells from '.';
import { runServer } from '../../../../test/api/server';
import customCloneDeep from '../../../../utils/customCloneDeep';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';

async function initAllTableHeaderCells(
  {
    filterKey,
    useColumns = jest.fn().mockReturnValue([]),
  } = {}) {
  const initialStore = customCloneDeep(reduxStore);

  mutateStore(initialStore, draft => {
    draft.session.filters = {
      filter_key: {
        selected: {
          resource_id: true,
        },
        sort: {
          order: 'desc',
          orderBy: 'name',
        },
      },
    };
  });
  const ui = (
    <MemoryRouter>
      <table>
        <tbody>
          <tr>
            <AllTableHeaderCells
              useColumns={useColumns}
              filterKey={filterKey}
            />
          </tr>
        </tbody>
      </table>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('allTableHeaderCells component Test cases', () => {
  runServer();
  test('should pass the intial render with default values', async () => {
    const { utils } = await initAllTableHeaderCells();

    expect(utils.container.firstChild.firstChild.firstChild).toBeEmptyDOMElement(); // table, tbody, tr childs
  });

  describe('allTableHeaderCells component', () => {
    const statusHeader = jest.fn().mockReturnValue('Status');
    const useColumns = jest.fn(() => [
      {
        key: 'name',
        heading: 'Name',
        orderBy: 'name',
        width: 1,
      },
      {
        key: 'type',
        heading: 'Type',
        orderBy: 'type',
      },
      {
        key: 'status',
        HeaderValue: statusHeader,
      },
      {
        key: 'size',
        heading: 'Size',
        width: 1,
      },
      {
        key: 'What',
      },
    ]);

    test('should pass the intial render with useColumns', async () => {
      const filterKey = 'filter_key';
      const { store } = await initAllTableHeaderCells({
        useColumns,
        filterKey,
      });

      const name = screen.getByRole('cell', {name: 'Name sorted descending'});
      const status = screen.getByRole('cell', {name: 'Status'});
      const size = screen.getByRole('cell', {name: 'Size'});
      const type = screen.getByRole('cell', {name: 'Type'});

      expect(name).toBeInTheDocument();
      expect(status).toBeInTheDocument();
      expect(size).toBeInTheDocument();
      expect(type).toBeInTheDocument();

      const nameButton = screen.getByRole('button', {name: 'Name sorted descending'});

      expect(nameButton).toBeInTheDocument();

      await userEvent.click(nameButton);
      await expect(store.getState()?.session?.filters?.[filterKey]?.sort?.order).toBe('asc');

      await userEvent.click(nameButton);
      await expect(store.getState()?.session?.filters?.[filterKey]?.sort?.order).toBe('desc');
    });

    test('should pass the render with out filter key', async () => {
      await initAllTableHeaderCells({
        useColumns,
        filterKey: 'filter_key_1',
      });

      const name = screen.getByRole('cell', {name: 'Name'});
      const status = screen.getByRole('cell', {name: 'Status'});
      const size = screen.getByRole('cell', {name: 'Size'});
      const type = screen.getByRole('cell', {name: 'Type'});

      expect(name).toBeInTheDocument();
      expect(status).toBeInTheDocument();
      expect(size).toBeInTheDocument();
      expect(type).toBeInTheDocument();
    });
  });
});

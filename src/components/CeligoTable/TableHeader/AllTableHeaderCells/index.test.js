/* global describe, test, expect, jest */
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AllTableHeaderCells from '.';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';

async function initAllTableHeaderCells(
  {
    filterKey,
    useColumns = jest.fn().mockReturnValue([]),
  } = {}) {
  const initialStore = cloneDeep(reduxStore);

  initialStore.getState().session.filters = {
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

describe('AllTableHeaderCells component Test cases', () => {
  runServer();
  test('should pass the intial render with default values', async () => {
    const { utils } = await initAllTableHeaderCells();

    expect(utils.container.firstChild.firstChild.firstChild).toBeEmptyDOMElement(); // table, tbody, tr childs
  });

  describe('AllTableHeaderCells component', () => {
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

      userEvent.click(nameButton);
      await expect(store.getState()?.session?.filters?.[filterKey]?.sort?.order).toBe('asc');

      userEvent.click(nameButton);
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

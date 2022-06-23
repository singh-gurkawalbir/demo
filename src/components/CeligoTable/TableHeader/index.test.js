/* global describe, test, expect, jest */
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TableHeader from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';

async function initTableHeader(
  {
    props,
    useColumns = jest.fn().mockReturnValue([]),
    data = [],
    sort,
  } = {}) {
  const initialStore = cloneDeep(reduxStore);

  initialStore.getState().session.filters = {
    filter_key: {
      selected: {
        resource_id: true,
      },
    },
  };
  if (sort) {
    initialStore.getState().session.filters.filter_key.sort = sort;
  }
  const ui = (
    <MemoryRouter>
      <table>
        <TableHeader
          data={data}
          useColumns={useColumns}
          {...props} />
      </table>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('TableHeader component Test cases', () => {
  runServer();
  test('should pass the intial render with default values', async () => {
    const { utils } = await initTableHeader();

    expect(utils.container.firstChild.firstChild.firstChild).toBeEmptyDOMElement(); // table, thead, tr childs
  });

  test('should pass the intial render with useRowActions', async () => {
    await initTableHeader({
      props: {
        useRowActions: true,
      },
    });

    expect(screen.queryByText('Actions')).toBeInTheDocument();
  });

  test('should pass the intial render with selectableRows', async () => {
    const { store } = await initTableHeader({
      props: {
        selectableRows: true,
        filterKey: 'filter_key',
      },
      sort: {
        order: 'desc1',
        orderBy: 'lastModified',
      },
    });

    expect(store.getState()?.session?.filters?.filter_key?.isAllSelected).toBeTruthy();
  });

  test('should pass the intial render with filterKey and without sort', async () => {
    const { store } = await initTableHeader({
      props: {
        filterKey: 'filter_key',
      },
    });

    expect(store.getState()?.session?.filters?.filter_key?.sort).toBeDefined();
    expect(store.getState()?.session?.filters?.filter_key?.sort?.order).toBe('desc');
    expect(store.getState()?.session?.filters?.filter_key?.sort?.orderBy).toBe('lastModified');
    expect(store.getState()?.session?.filters?.filter_key?.isAllSelected).toBeFalsy();
  });
});

/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TableBodyContent from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';

async function initTableBodyContent(
  {
    props,
    data = [],
  } = {}) {
  const ui = (
    <MemoryRouter>
      <table>
        <TableBodyContent
          data={data}
          {...props}
        />
      </table>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('TableBodyContent component Test cases', () => {
  runServer();
  test('should pass the intial render with default values', async () => {
    const { utils } = await initTableBodyContent();

    expect(utils.container.firstChild.firstChild).toBeEmptyDOMElement(); // table, tbody child
  });

  describe('TableBodyContent component with data', () => {
    const data = [
      {
        key: 'id_1',
      },
      {
        _id: 'id_2',
      },
    ];
    const useColumns = jest.fn().mockReturnValue([]);
    const useRowActions = jest.fn();

    test('should pass the intial render with useColumns', async () => {
      const { utils } = await initTableBodyContent({
        data,
        props: {
          useColumns,
        },
      });

      expect(utils.container.firstChild.firstChild).not.toBeEmptyDOMElement();
      expect(screen.getAllByRole('row')).toHaveLength(2);
    });

    test('should pass the intial render with useRowActions', async () => {
      const { utils } = await initTableBodyContent({
        data,
        props: {
          useColumns,
          useRowActions,
        },
      });

      expect(utils.container.firstChild.firstChild).not.toBeEmptyDOMElement();
      expect(screen.getAllByRole('row')).toHaveLength(2);
    });

    test('should pass the intial render with rowKey', async () => {
      const { utils } = await initTableBodyContent({
        data,
        props: {
          useColumns,
          useRowActions,
          rowKey: 'key',
        },
      });

      expect(utils.container.firstChild.firstChild).not.toBeEmptyDOMElement();
      expect(screen.getAllByRole('row')).toHaveLength(2);
    });
  });
});

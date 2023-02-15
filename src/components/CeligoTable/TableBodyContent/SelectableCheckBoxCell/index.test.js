
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SelectableCheckBoxCell from '.';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';

async function initSelectableCheckBoxCell({ props = {}, rowData = {} } = {}) {
  const initialStore = cloneDeep(reduxStore);

  initialStore.getState().session.filters = {
    filter_key: {
      selected: {
        resource_id: true,
      },
    },
  };
  const ui = (
    <MemoryRouter>
      <table>
        <tbody>
          <tr>
            <SelectableCheckBoxCell rowData={rowData} {...props} />
          </tr>
        </tbody>
      </table>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('selectableCheckBoxCell component Test cases', () => {
  runServer();
  test('should pass the intial render with default values', async () => {
    const { utils } = await initSelectableCheckBoxCell();

    expect(utils.container.firstChild.firstChild.firstChild).toBeEmptyDOMElement();
  });

  test('should pass the intial render with isSelectableRow', async () => {
    const isSelectableRow = jest.fn(() => true);
    const onSelectChange = jest.fn();

    await initSelectableCheckBoxCell({
      props: {
        selectableRows: true,
        isSelectableRow,
        onSelectChange,
        filterKey: 'filter_key',
      },
      rowData: {
        _id: 'row_id_1',
      },
    });
    const cellBox1 = await screen.getByRole('cell');

    expect(cellBox1).toBeInTheDocument();
    expect(cellBox1.firstChild).not.toHaveClass('Mui-checked');

    userEvent.click(screen.getByRole('checkbox'));  // check the checkbox
    const cellBox2 = await screen.getByRole('cell');

    expect(cellBox2).toBeInTheDocument();
    expect(cellBox2.firstChild).toHaveClass('Mui-checked'); // Mui-checked class is getting added to span when checked

    userEvent.click(screen.getByRole('checkbox'));  // uncheck the checkbox
    const cellBox3 = await screen.getByRole('cell');

    expect(cellBox3).toBeInTheDocument();
    expect(cellBox3.firstChild).not.toHaveClass('Mui-checked');
  });
});

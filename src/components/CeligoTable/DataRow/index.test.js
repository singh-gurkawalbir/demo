import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DataRow from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';

async function initDataRow({ props, children = (<th>Item1</th>) } = {}) {
  const ui = (
    <MemoryRouter>
      <table>
        <tbody>
          <DataRow {...props}>
            {children}
          </DataRow>
        </tbody>
      </table>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('dataRow component Test cases', () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  runServer();
  test('should pass the intial render with default values', async () => {
    const { utils } = await initDataRow();

    expect(utils.container).not.toBeEmptyDOMElement();
    expect(screen.getByRole('columnheader', {name: 'Item1'})).toBeInTheDocument();
  });

  test('should pass the intial render with onRowOver', async () => {
    const onRowOver = jest.fn();

    await initDataRow({
      props: {
        onRowOver,
      },
    });
    const rowItem = screen.getByRole('columnheader', {name: 'Item1'});

    expect(rowItem).toBeInTheDocument();
    await userEvent.hover(rowItem);
    expect(onRowOver).toHaveBeenCalledTimes(1);
  });

  test('should pass the intial render with onRowOut, onRowOver, onRowClick', async () => {
    const onRowOut = jest.fn();
    const onRowOver = jest.fn();
    const onRowClick = jest.fn();

    await initDataRow({
      props: {
        onRowOut,
        onRowOver,
        onRowClick,
      },
    });
    const rowItem1 = screen.getByRole('columnheader', {name: 'Item1'});

    expect(rowItem1).toBeInTheDocument();

    await userEvent.hover(rowItem1);
    expect(onRowOver).toHaveBeenCalledTimes(1);
    expect(onRowOut).toHaveBeenCalledTimes(0);

    await userEvent.unhover(rowItem1);
    expect(onRowOut).toHaveBeenCalledTimes(1);
    expect(onRowOver).toHaveBeenCalledTimes(1);

    await userEvent.click(rowItem1);
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  test('should pass the intial render without onRowClick and additionalConfigs', async () => {
    await initDataRow({
      props: {
        additionalConfigs: {
          IsActiveRow: () => true,
        },
      },
    });
    const rowItem1 = screen.getByRole('columnheader', {name: 'Item1'});

    expect(rowItem1).toBeInTheDocument();
    await userEvent.click(rowItem1);
    expect(rowItem1).toBeInTheDocument();
  });

  test('should pass the intial render with custom classname', async () => {
    await initDataRow({
      props: {
        className: 'custom_class_name',
      },
    });

    const tableRow = screen.getByRole('row');

    expect(tableRow).toBeInTheDocument();
    expect(tableRow).toHaveClass('custom_class_name');
  });
});

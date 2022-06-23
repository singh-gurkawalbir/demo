/* global describe, test, expect, jest */
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SelectableCheckBox from '.';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';

async function initSelectableCheckBox(
  {
    props,
    data = [],
    isAllSelected = false,
  } = {}) {
  const initialStore = cloneDeep(reduxStore);

  initialStore.getState().session.filters = {
    filter_key: {
      selected: {
        resource_1: true,
        resource_2: true,
      },
      isAllSelected,
    },
  };
  const ui = (
    <MemoryRouter>
      <table>
        <tbody>
          <tr>
            <SelectableCheckBox
              data={data}
              {...props}
          />
          </tr>
        </tbody>
      </table>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('SelectableCheckBox component Test cases', () => {
  runServer();
  test('should pass the intial render with default values', async () => {
    const { utils } = await initSelectableCheckBox();

    expect(utils.container.firstChild.firstChild.firstChild).toBeEmptyDOMElement();  // table, tbody, tr child
  });

  test('should pass the intial render with selectableRows', async () => {
    const { store } = await initSelectableCheckBox({
      props: {
        selectableRows: true,
        filterKey: 'filter_key',
      },
    });

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(store.getState()?.session?.filters?.filter_key?.isAllSelected).toBeTruthy();
  });

  describe('isAllSelectableResourcesSelected test case', () => {
    test('should pass the intial render with isAllSelectableResourcesSelected returns false with empty data', async () => {
      const isSelectableRow = jest.fn(resource => resource.value);
      const { store } = await initSelectableCheckBox({
        props: {
          isSelectableRow,
          selectableRows: true,
          filterKey: 'filter_key',
        },
      });

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      await expect(store.getState()?.session?.filters?.filter_key?.isAllSelected).toBeFalsy();
    });

    test('should pass the intial render with isAllSelectableResourcesSelected returns false', async () => {
      const isSelectableRow = jest.fn(resource => resource.value);
      const { store } = await initSelectableCheckBox({
        props: {
          isSelectableRow,
          selectableRows: true,
          filterKey: 'filter_key',
        },
        data: [
          {
            _id: 'resource_1',
            value: true,
          },
          {
            _id: 'resource_4',
            value: false,
          },
          {
            _id: 'resource_3',
            value: true,
          },
        ],
      });

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      await expect(store.getState()?.session?.filters?.filter_key?.isAllSelected).toBeFalsy();
    });

    test('should pass the intial render with isAllSelectableResourcesSelected returns true[wrong]', async () => {
      const isSelectableRow = jest.fn(resource => resource.value);
      const { store } = await initSelectableCheckBox({
        props: {
          isSelectableRow,
          selectableRows: true,
          filterKey: 'filter_key',
        },
        data: [
          {
            _id: 'resource_1',
            value: true,
          },
          {
            _id: 'resource_3',
            value: true,
          },
          {
            _id: 'resource_4',
            value: false,
          },
        ],
      });

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      await expect(store.getState()?.session?.filters?.filter_key?.isAllSelected).toBeTruthy(); // This doesn't make sense
    });

    test('should pass the intial render with isAllSelectableResourcesSelected returns true', async () => {
      const isSelectableRow = jest.fn(resource => resource.value);
      const { store } = await initSelectableCheckBox({
        props: {
          isSelectableRow,
          selectableRows: true,
          filterKey: 'filter_key',
        },
        data: [
          {
            _id: 'resource_1',
            value: true,
          },
          {
            _id: 'resource_2',
            value: true,
          },
        ],
      });

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      await expect(store.getState()?.session?.filters?.filter_key?.isAllSelected).toBeTruthy();
    });

    test('should pass the intial render with isAllSelectableResourcesSelected returns true without isSelectableRow', async () => {
      const { store } = await initSelectableCheckBox({
        props: {
          selectableRows: true,
          filterKey: 'filter_key',
        },
        data: [
          {
            _id: 'resource_1',
            value: true,
          },
          {
            _id: 'resource_2',
            value: true,
          },
        ],
      });

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      await expect(store.getState()?.session?.filters?.filter_key?.isAllSelected).toBeTruthy();
    });

    test('should pass the intial render with isAllSelectableResourcesSelected returns false without isSelectableRow', async () => {
      const { store } = await initSelectableCheckBox({
        props: {
          selectableRows: true,
          filterKey: 'filter_key',
        },
        data: [
          {
            _id: 'resource_1',
            value: true,
          },
          {
            _id: 'resource_3',
            value: true,
          },
        ],
      });

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      await expect(store.getState()?.session?.filters?.filter_key?.isAllSelected).toBeFalsy();
    });
  });

  describe('handleSelectAllChange test cases', () => {
    test('should pass the intial render with handleSelectAllChange checked', async () => {
      const onSelectChange = jest.fn();
      const { store } = await initSelectableCheckBox({
        props: {
          selectableRows: true,
          onSelectChange,
          filterKey: 'filter_key',
        },
        data: [
          {
            _id: 'resource_1',
            value: true,
          },
          {
            _id: 'resource_2',
            value: true,
          },
        ],
        isAllSelected: true,
      });
      const checkBox = await screen.getByRole('checkbox');

      expect(checkBox).toBeInTheDocument();

      userEvent.click(checkBox);

      await expect(store.getState()?.session?.filters?.filter_key?.isAllSelected).toBeFalsy();
      expect(onSelectChange).toBeCalledTimes(1);
    });

    test('should pass the intial render with handleSelectAllChange unchecked', async () => {
      const onSelectChange = jest.fn();
      const { store } = await initSelectableCheckBox({
        props: {
          selectableRows: true,
          onSelectChange,
          filterKey: 'filter_key',
        },
        data: [
          {
            _id: 'resource_1',
            value: true,
          },
          {
            _id: 'resource_2',
            value: true,
          },
          {
            _id: 'resource_3',
            value: true,
          },
        ],
      });
      const checkBox = await screen.getByRole('checkbox');

      expect(checkBox).toBeInTheDocument();

      userEvent.click(checkBox);

      await expect(store.getState()?.session?.filters?.filter_key?.isAllSelected).toBeTruthy();
      expect(onSelectChange).toBeCalledTimes(1);
    });

    test('should pass the intial render with handleSelectAllChange with isSelectableRow', async () => {
      const isSelectableRow = jest.fn(resource => resource.value);
      const onSelectChange = jest.fn();
      const { store } = await initSelectableCheckBox({
        props: {
          selectableRows: true,
          onSelectChange,
          filterKey: 'filter_key',
          isSelectableRow,
        },
        data: [
          {
            _id: 'resource_3',
            value: false,
          },
          {
            _id: 'resource_1',
            value: true,
          },
          {
            _id: 'resource_2',
            value: true,
          },
        ],
      });
      const checkBox = await screen.getByRole('checkbox');

      expect(checkBox).toBeInTheDocument();

      userEvent.click(checkBox);

      await expect(store.getState()?.session?.filters?.filter_key?.isAllSelected).toBeFalsy();
      expect(onSelectChange).toBeCalledTimes(1);
    });
  });
});

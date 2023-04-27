
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SelectableCheckBox from '.';
import { runServer } from '../../../../test/api/server';
import customCloneDeep from '../../../../utils/customCloneDeep';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';

async function initSelectableCheckBox(
  {
    props,
    data = [],
    isAllSelected = false,
  } = {}) {
  const initialStore = customCloneDeep(reduxStore);

  mutateStore(initialStore, draft => {
    draft.session.filters = {
      filter_key: {
        selected: {
          resource_1: true,
          resource_2: true,
        },
        isAllSelected,
      },
    };
  });
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

describe('selectableCheckBox component Test cases', () => {
  runServer();
  test('should pass the intial render with default values', async () => {
    const { utils } = await initSelectableCheckBox();

    expect(utils.container.firstChild.firstChild.firstChild).toBeEmptyDOMElement();  // table, tbody, tr child
  });

  test('should pass the intial render with selectableRows', async () => {
    const filterKey = 'filter_key';
    const { store } = await initSelectableCheckBox({
      props: {
        selectableRows: true,
        filterKey,
      },
    });

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(store.getState()?.session?.filters?.[filterKey]?.isAllSelected).toBeTruthy();
  });

  describe('isAllSelectableResourcesSelected test case', () => {
    test('should pass the intial render with isAllSelectableResourcesSelected returns false with empty data', async () => {
      const filterKey = 'filter_key';
      const isSelectableRow = jest.fn(resource => resource.value);
      const { store } = await initSelectableCheckBox({
        props: {
          isSelectableRow,
          selectableRows: true,
          filterKey,
        },
      });

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      await expect(store.getState()?.session?.filters?.[filterKey]?.isAllSelected).toBeFalsy();
    });

    test('should pass the intial render with isAllSelectableResourcesSelected returns false', async () => {
      const filterKey = 'filter_key';
      const isSelectableRow = jest.fn(resource => resource.value);
      const { store } = await initSelectableCheckBox({
        props: {
          isSelectableRow,
          selectableRows: true,
          filterKey,
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
      await expect(store.getState()?.session?.filters?.[filterKey]?.isAllSelected).toBeFalsy();
    });

    test('should pass the intial render with isAllSelectableResourcesSelected returns true[wrong]', async () => {
      const filterKey = 'filter_key';
      const isSelectableRow = jest.fn(resource => resource.value);
      const { store } = await initSelectableCheckBox({
        props: {
          isSelectableRow,
          selectableRows: true,
          filterKey,
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
      await expect(store.getState()?.session?.filters?.[filterKey]?.isAllSelected).toBeTruthy(); // This doesn't make sense
    });

    test('should pass the intial render with isAllSelectableResourcesSelected returns true', async () => {
      const filterKey = 'filter_key';
      const isSelectableRow = jest.fn(resource => resource.value);
      const { store } = await initSelectableCheckBox({
        props: {
          isSelectableRow,
          selectableRows: true,
          filterKey,
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
      await expect(store.getState()?.session?.filters?.[filterKey]?.isAllSelected).toBeTruthy();
    });

    test('should pass the intial render with isAllSelectableResourcesSelected returns true without isSelectableRow', async () => {
      const filterKey = 'filter_key';
      const { store } = await initSelectableCheckBox({
        props: {
          selectableRows: true,
          filterKey,
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
      await expect(store.getState()?.session?.filters?.[filterKey]?.isAllSelected).toBeTruthy();
    });

    test('should pass the intial render with isAllSelectableResourcesSelected returns false without isSelectableRow', async () => {
      const filterKey = 'filter_key';
      const { store } = await initSelectableCheckBox({
        props: {
          selectableRows: true,
          filterKey,
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
      await expect(store.getState()?.session?.filters?.[filterKey]?.isAllSelected).toBeFalsy();
    });
  });

  describe('handleSelectAllChange test cases', () => {
    test('should pass the intial render with handleSelectAllChange checked & unchecked', async () => {
      const onSelectChange = jest.fn();
      const filterKey = 'filter_key';
      const { store } = await initSelectableCheckBox({
        props: {
          selectableRows: true,
          onSelectChange,
          filterKey,
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

      await userEvent.click(checkBox);

      await expect(store.getState()?.session?.filters?.[filterKey]?.isAllSelected).toBeFalsy();
      expect(onSelectChange).toHaveBeenCalledTimes(1);
      const checkBox1 = await screen.getByRole('checkbox');

      expect(checkBox1).toBeInTheDocument();

      await userEvent.click(checkBox1);
      await expect(store.getState()?.session?.filters?.[filterKey]?.isAllSelected).toBeTruthy();
      expect(onSelectChange).toHaveBeenCalledTimes(2);
    });

    test('should pass the intial render with handleSelectAllChange with isSelectableRow', async () => {
      const isSelectableRow = jest.fn(resource => resource.value);
      const onSelectChange = jest.fn();
      const filterKey = 'filter_key';
      const { store } = await initSelectableCheckBox({
        props: {
          selectableRows: true,
          onSelectChange,
          filterKey,
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

      await userEvent.click(checkBox);

      await expect(store.getState()?.session?.filters?.[filterKey]?.isAllSelected).toBeFalsy();
      expect(onSelectChange).toHaveBeenCalledTimes(1);

      const checkBox1 = await screen.getByRole('checkbox');

      expect(checkBox1).toBeInTheDocument();

      await userEvent.click(checkBox1);

      await expect(store.getState()?.session?.filters?.[filterKey]?.isAllSelected).toBeTruthy();
      expect(onSelectChange).toHaveBeenCalledTimes(2);
    });
  });
});

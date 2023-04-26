
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MultiSelectFilter from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initMultiSelectFilter({ props } = {}) {
  const Icon = () => (
    <div />
  );
  const ui = (
    <MemoryRouter>
      <div>
        Test Header
        <MultiSelectFilter
          Icon={Icon}
          {...props}
      />
      </div>

    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('multiSelectFilter component Test cases', () => {
  runServer();
  test('should pass the intial render with default values', async () => {
    await initMultiSelectFilter();

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    const header = screen.queryByText(/Test Header/i);

    expect(header).toBeInTheDocument();
    await userEvent.click(header);

    await waitFor(() => expect(screen.queryByText(/apply/i)).not.toBeInTheDocument());
  });

  test('should pass the intial render for SelectedLabelImp and handleClose', async () => {
    const SelectedLabelImp = jest.fn().mockReturnValue('Mock Name');

    await initMultiSelectFilter({
      props: {
        SelectedLabelImp,
        items: [
          {
            _id: 'id_0',
            name: 'Parent 0',
          },
        ],
      },
    });

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(screen.queryByText(/Mock Name/i)).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', {name: 'Cancel'});

    expect(screen.queryByText(/apply/i)).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);
    expect(screen.queryByText(/apply/i)).not.toBeInTheDocument();
  });
  test('should pass the intial render for handleSave', async () => {
    const onSave = jest.fn();

    await initMultiSelectFilter({
      props: {
        onSave,
        items: [
          {
            _id: 'id_0',
            name: 'parent 0',
          },
          {
            _id: 'id_1',
            name: 'Parent 1',
            children: [
              {
                _id: 'child_id_1',
                name: 'Child 1',
              },
              {
                _id: 'child_id_2',
                name: 'Child 2',
              },
            ],
          },
          {
            _id: 'id_2',
            name: 'parent 2',
            children: [
              {
                _id: 'child_id_3',
                name: 'Child 3',
              },
              {
                _id: 'child_id_4',
                name: 'Child 4',
              },
            ],
          },
          {
            _id: 'id_3',
            name: 'parent 3',
            children: [
              {
                _id: 'child_id_5',
                name: 'Child 5',
              },
              {
                _id: 'child_id_6',
                name: 'Child 6',
              },
            ],
          },
          {
            _id: 'id_4',
            name: 'parent 4',
            children: [
              {
                _id: 'child_id_7',
                name: 'Child 7',
              },
            ],
          },
          {
            _id: 'id_5',
            name: 'parent 5',
          },
          {
            _id: 'id_6',
            name: 'parent 6',
            children: [
              {
                _id: 'child_id_8',
                name: 'Child 8',
              },
            ],
          },
          { // 5th element with children
            _id: 'id_7',
            name: 'Parent 7',
            children: [
              {
                _id: 'child_id_9',
                name: 'Child 9',
              },
              {
                _id: 'child_id_10',
                name: 'Child 10',
              },
            ],
          },
        ],
        selected: ['id_1', 'child_id_3', 'child_id_6', 'id_5', 'id_6', 'child_id_8'],
      },
    });

    waitFor(async () => {
      const button = screen.getByRole('button');

      expect(button).toBeInTheDocument();
      await userEvent.click(button);
    });

    waitFor(async () => {
      const parent0Checkbox = screen.getByRole('checkbox', {name: 'parent 0'});
      const parent4Checkbox = screen.getByRole('checkbox', {name: 'parent 4'});
      const parent5Checkbox = screen.getByRole('checkbox', {name: 'parent 5'});
      const expandButtons = screen.getAllByRole('button').filter(eachButton => eachButton.hasAttribute('data-test', 'toggleJobDetail'));

      expect(expandButtons[0]).toBeInTheDocument();
      await userEvent.click(expandButtons[0]);
      expect(expandButtons[5]).toBeInTheDocument();
      await userEvent.click(expandButtons[5]);
      const child1Checkbox = screen.getByRole('checkbox', {name: 'Child 1'});
      const child9Checkbox = screen.getByRole('checkbox', {name: 'Child 9'});
      const child3Checkbox = screen.getByRole('checkbox', {name: 'Child 3'});
      const child4Checkbox = screen.getByRole('checkbox', {name: 'Child 4'});
      const child6Checkbox = screen.getByRole('checkbox', {name: 'Child 6'});
      const child8Checkbox = screen.getByRole('checkbox', {name: 'Child 8'});

      expect(parent0Checkbox).toBeInTheDocument();
      expect(parent4Checkbox).toBeInTheDocument();
      expect(parent5Checkbox).toBeInTheDocument();
      expect(child1Checkbox).toBeInTheDocument(); // uncheck/check
      expect(child9Checkbox).toBeInTheDocument(); // check
      expect(child3Checkbox).toBeInTheDocument(); // uncheck
      expect(child4Checkbox).toBeInTheDocument(); // check
      expect(child6Checkbox).toBeInTheDocument(); // uncheck
      expect(child8Checkbox).toBeInTheDocument(); // uncheck

      await userEvent.click(parent0Checkbox);
      await userEvent.click(parent4Checkbox);
      await userEvent.click(parent5Checkbox);
      await userEvent.click(child1Checkbox);
      await userEvent.click(child9Checkbox);
      await userEvent.click(child4Checkbox);
      await userEvent.click(child3Checkbox);
      await userEvent.click(child6Checkbox);
      await userEvent.click(child8Checkbox);
    });

    waitFor(async () => {
      const applyButton = screen.getByRole('button', {name: /Apply/i});

      expect(screen.queryByText(/cancel/i)).toBeInTheDocument();
      expect(applyButton).toBeInTheDocument();

      await userEvent.click(applyButton);
      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave).toHaveBeenCalledWith(['id_1', 'id_0', 'id_4', 'child_id_1', 'child_id_9', 'child_id_4']);
      expect(screen.queryByText(/apply/i)).not.toBeInTheDocument();
    });
  });

  test('should pass the intial render for onSelect', async () => {
    const onSelect = jest.fn((checked, id) => {
      if (id) {
        return [...checked, id];
      }

      return [...checked];
    });

    await initMultiSelectFilter({
      props: {
        onSelect,
        items: [
          {
            _id: 'id_0',
            name: 'parent 0',
          },
        ],
        selected: [],
      },
    });

    waitFor(async () => {
      const button = screen.getByRole('button');

      expect(button).toBeInTheDocument();
      await userEvent.click(button);
    });

    waitFor(async () => {
      const parent0Checkbox = screen.getByRole('checkbox', {name: 'parent 0'});

      expect(parent0Checkbox).toBeInTheDocument();

      await userEvent.click(parent0Checkbox);

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith([], 'id_0');
    });
  });

  test('should not be able to open filter if disabled', async () => {
    initMultiSelectFilter({
      props: {
        items: [
          {
            _id: 'id_0',
            name: 'parent 0',
          },
        ],
        selected: [],
        ButtonLabel: 'Select canceled by',
        disabled: true,
      },
    });
    expect(screen.getByRole('button', {name: 'Select canceled by'})).toBeDisabled();
  });
});

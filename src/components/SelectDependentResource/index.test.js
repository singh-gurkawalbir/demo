/* global describe, test, expect, jest */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectDependentResource from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initSelectDependentResource({
  props = {},
} = {}) {
  const ui = (
    <MemoryRouter>
      <SelectDependentResource {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('SelectDependentResource test cases', () => {
  runServer();
  test('should pass the initial render with default values', async () => {
    await initSelectDependentResource();
    const buttonRef = screen.getByRole('button', {name: /Step/i});

    expect(buttonRef).toBeInTheDocument();
    userEvent.click(buttonRef);

    expect(screen.getByRole('button', {name: /apply/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Cancel/i})).toBeInTheDocument();
    userEvent.click(buttonRef);
    expect(await screen.queryByText('Apply')).toBeInTheDocument();
  });

  test('should pass the initial render with custom values', async () => {
    const onSave = jest.fn();

    await initSelectDependentResource({
      props: {
        onSave,
        resources: [{
          _id: 'id_1',
          name: 'name_1',
        }, {
          _id: 'id_2',
          name: 'name_2',
        }],
        selectedResources: [{
          _id: 'id_1',
          name: 'name_1',
        }],
      },
    });
    const buttonRef = screen.getByRole('button', {name: /name_1/i});

    expect(buttonRef).toBeInTheDocument();
    userEvent.click(buttonRef);
    const applyButton = screen.getByRole('button', {name: /apply/i});

    expect(applyButton).toBeInTheDocument();
    userEvent.click(applyButton);
    expect(await screen.queryByText('Apply')).not.toBeInTheDocument();
    expect(onSave).toBeCalledTimes(1);
    expect(onSave).toBeCalledWith([{
      _id: 'id_1',
      name: 'name_1',
    }]);

    userEvent.click(buttonRef);
    const cancelButton = screen.getByRole('button', {name: /Cancel/i});

    expect(cancelButton).toBeInTheDocument();
    userEvent.click(cancelButton);
    expect(await screen.queryByText('Apply')).not.toBeInTheDocument();
  });

  test('should pass the initial render with multiple selected values', async () => {
    const onSave = jest.fn();

    await initSelectDependentResource({
      props: {
        onSave,
        resources: [{
          id: 'id_1',
          name: 'name_1',
        }, {
          id: 'id_2',
          name: 'name_2',
        }],
        selectedResources: [{
          id: 'id_1',
          name: 'name_1',
        }, {
          id: 'id_2',
          name: 'name_2',
        }],
      },
    });
    const buttonRef = screen.getByRole('button', {name: /2 resources selected/i});

    expect(buttonRef).toBeInTheDocument();
    userEvent.click(buttonRef);
    const inputButton = screen.getAllByRole('checkbox').find(eachCheckbox => eachCheckbox.getAttribute('name') === null);
    const name1InputButton = screen.getAllByRole('checkbox').find(eachCheckbox => eachCheckbox.getAttribute('name') === 'id_1');

    expect(inputButton).toBeInTheDocument();
    expect(name1InputButton).toBeInTheDocument();
    expect(name1InputButton).toBeChecked();

    userEvent.click(inputButton);
    expect(inputButton).not.toBeChecked();
    expect(name1InputButton).not.toBeChecked();

    userEvent.click(inputButton);
    expect(inputButton).toBeChecked();
    expect(name1InputButton).toBeChecked();

    userEvent.click(name1InputButton);
    expect(name1InputButton).not.toBeChecked();

    userEvent.click(name1InputButton);
    expect(name1InputButton).toBeChecked();
  });
});

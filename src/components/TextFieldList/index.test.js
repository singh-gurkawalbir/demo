
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextFieldList from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initTextFieldList({
  props = {},
} = {}) {
  const ui = (
    <MemoryRouter>
      <TextFieldList {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('textFieldList test cases', () => {
  runServer();

  test('should pass the initial render with default values', async () => {
    await initTextFieldList({
      props: {
        label: 'Test label',
        disabled: false,
      },
    });

    expect(screen.queryByText('Test label')).toBeInTheDocument();
  });

  test('should pass the initial render with custom values', async () => {
    const onChange = jest.fn();

    await initTextFieldList({
      props: {
        label: 'Test label',
        disabled: false,
        onChange,
        value: [
          'value_1',
          '',
        ],
      },
    });

    expect(screen.queryByText('Test label')).toBeInTheDocument();
    const input1Button = screen.getAllByRole('textbox').find(eachEle => eachEle.getAttribute('value') === 'value_1');

    expect(input1Button).toBeInTheDocument();
    await userEvent.type(input1Button, 'update');

    expect(onChange).toHaveBeenCalledTimes(6); // 6 letters so 6 times
    expect(onChange).toHaveBeenCalledWith(['value_1update']); // we can have 6 ways checking the last one

    const deleteButton = screen.getAllByRole('button').find(eachEle => eachEle.getAttribute('data-test') === 'delete-0'); // 0 is the index in the value array

    expect(deleteButton).toBeInTheDocument();

    await userEvent.click(deleteButton);
    expect(onChange).toHaveBeenCalledTimes(7);
    expect(onChange).toHaveBeenCalledWith([]);
  });
});

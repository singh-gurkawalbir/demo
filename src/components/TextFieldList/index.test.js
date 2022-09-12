/* global describe, test, expect, jest */
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

describe('TextFieldList test cases', () => {
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
    userEvent.type(input1Button, 'update');

    expect(onChange).toBeCalledTimes(6); // 6 letters so 6 times
    expect(onChange).toBeCalledWith(['value_1update']); // we can have 6 ways checking the last one

    const deleteButton = screen.getAllByRole('button').find(eachEle => eachEle.getAttribute('data-test') === 'delete-0'); // 0 is the index in the value array

    expect(deleteButton).toBeInTheDocument();

    userEvent.click(deleteButton);
    expect(onChange).toBeCalledTimes(7);
    expect(onChange).toBeCalledWith([]);
  });
});

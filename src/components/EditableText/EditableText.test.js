/* global describe, test, expect ,jest */
import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditableText from '.';

describe('EditableText testing', () => {
  test('should enter some value in input', () => {
    const onchange = jest.fn();

    render(<EditableText text="button" disable={false} onChange={onchange} />);

    const button = screen.getByText('button');

    userEvent.click(button);

    const input = screen.getByRole('textbox');

    userEvent.type(input, 'Hello, World!');
    input.blur();
    const button2 = screen.getByText('button');

    userEvent.click(button2);
    expect(screen.getByRole('textbox')).toHaveAttribute('value', 'buttonHello, World!');
  });
  test('should test with some default text', () => {
    const onchange = jest.fn();

    render(<EditableText defaultText="button" disable={false} onChange={onchange} />);

    const button = screen.getByText('button');

    userEvent.click(button);

    const input = screen.getByRole('textbox');

    userEvent.type(input, 'Hello, World!');
    input.blur();
    const button2 = screen.getByText('button');

    userEvent.click(button2);
    expect(screen.getByRole('textbox')).toHaveAttribute('value', 'Hello, World!');
  });
  test('should test when the disable is set to true', () => {
    const onchange = jest.fn();

    render(<EditableText text="button" disabled onChange={onchange} />);

    const button = screen.getByText('button');

    userEvent.click(button);

    const input = screen.queryByRole('textbox');

    expect(input).not.toBeInTheDocument();
  });
  test('should test key down escape', () => {
    const onchange = jest.fn();

    render(<EditableText text="button" disable={false} onChange={onchange} />);

    const button = screen.getByText('button');

    userEvent.click(button);

    const input = screen.getByRole('textbox');

    userEvent.clear(input);
    userEvent.type(input, 'Hello, World!');
    input.blur();
    const button2 = screen.getByText('button');

    userEvent.click(button2);
    const input2 = screen.getByRole('textbox');

    fireEvent.keyDown(input2, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
    input2.blur();
    const button3 = screen.getByText('button');

    userEvent.click(button3);

    const input3 = screen.getByRole('textbox');

    expect(input3).toHaveAttribute('value', 'button');
  });

  test('should test key down enter', () => {
    const onchange = jest.fn();

    render(<EditableText text="button" disable={false} onChange={onchange} />);

    const button = screen.getByText('button');

    userEvent.click(button);

    const input = screen.getByRole('textbox');

    userEvent.clear(input);
    userEvent.type(input, 'Hello, World!');
    input.blur();
    const button2 = screen.getByText('button');

    userEvent.click(button2);
    const input2 = screen.getByRole('textbox');

    fireEvent.keyDown(input2, {key: 'Enter', code: 'Enter', charCode: 13});
    input2.blur();
    expect(onchange).toHaveBeenCalledTimes(2);
  });
});

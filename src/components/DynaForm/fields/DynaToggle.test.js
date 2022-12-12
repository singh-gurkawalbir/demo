/* global describe, jest, expect, test */
import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaToggle from './DynaToggle';

describe('test suite for DynaToggle field', () => {
  test('should respond to change in toogle options', () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'toggle',
      name: 'toggle',
      type: 'toggle',
      label: 'Toggle button',
      options: [
        {
          label: 'India',
          value: 'in',
        },
        {
          label: 'United States',
          value: 'us',
        },
        {
          label: 'Canada',
          value: 'cdn',
        },
      ],
      onFieldChange,
    };

    render(<DynaToggle {...props} />);

    expect(screen.getByText(props.label)).toBeInTheDocument();

    const toggleIndia = screen.getByRole('button', {name: 'India'});
    const toggleUS = screen.getByRole('button', {name: 'United States'});
    const toggleCanada = screen.getByRole('button', {name: 'Canada'});

    userEvent.click(toggleIndia);
    expect(onFieldChange).toBeCalledWith(props.id, 'in');

    userEvent.click(toggleUS);
    expect(onFieldChange).toBeCalledWith(props.id, 'us');

    userEvent.click(toggleCanada);
    expect(onFieldChange).toBeCalledWith(props.id, 'cdn');
  });
});

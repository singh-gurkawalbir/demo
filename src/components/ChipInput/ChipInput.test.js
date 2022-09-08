/* global describe, test, expect ,jest */
import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import ChipInput from '.';

describe('ChipInput testing', () => {
  test('should test to store some value', () => {
    const onchange = jest.fn();

    renderWithProviders(<ChipInput onChange={onchange} />);
    const tag = screen.getByText('tag');

    userEvent.click(tag);

    const textbox = screen.getByRole('textbox');

    userEvent.type(screen.getByRole('textbox'), 'Hello, World!');
    textbox.blur();
    expect(onchange).toHaveBeenCalled();
  });
  test('should test while disable', () => {
    const onchange = jest.fn();

    renderWithProviders(<ChipInput onChange={onchange} disabled />);
    const tag = screen.getByText('tag');

    expect(tag).toBeInTheDocument();

    const textbox = screen.queryByRole('textbox');

    expect(textbox).not.toBeInTheDocument();
  });
  test('should test again with same value', () => {
    const onchange = jest.fn();

    renderWithProviders(<ChipInput onChange={onchange} />);
    const tag = screen.getByText('tag');

    userEvent.click(tag);

    const textbox = screen.getByRole('textbox');

    userEvent.type(screen.getByRole('textbox'), 'Hello, World!');
    textbox.blur();
    expect(onchange).toHaveBeenCalledTimes(1);
    const button = screen.getByText('Hello, World!');

    userEvent.click(button);
    const textbox2 = screen.getByRole('textbox');

    userEvent.clear(textbox2);
    userEvent.type(textbox2, 'Hello, World!');

    textbox2.blur();
    expect(onchange).not.toHaveBeenCalledTimes(2);
    expect(onchange).toHaveBeenCalledTimes(1);
  });
  test('should test while sending null', () => {
    const onchange = jest.fn();

    renderWithProviders(<ChipInput onChange={onchange} value={null} />);
    const tag = screen.getByText('tag');

    expect(tag).toBeInTheDocument();
    userEvent.click(tag);

    const textbox = screen.getByRole('textbox');

    userEvent.type(screen.getByRole('textbox'), null);
    textbox.blur();
    expect(onchange).not.toHaveBeenCalled();
  });
});

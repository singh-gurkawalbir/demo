
import React from 'react';
import { fireEvent, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import ChipInput from '.';

describe('chipInput testing', () => {
  test('should test to store some value', async () => {
    const onchange = jest.fn();

    await renderWithProviders(<ChipInput onChange={onchange} />);
    const tag = screen.getByText('tag');

    await userEvent.click(tag);

    const textbox = screen.getByRole('textbox');

    await userEvent.type(screen.getByRole('textbox'), 'Hello, World!');
    await textbox.blur();
    expect(onchange).toHaveBeenCalled();
  });
  test('should test while disable', async () => {
    const onchange = jest.fn();

    await renderWithProviders(<ChipInput onChange={onchange} disabled />);
    const tag = screen.getByText('tag');

    expect(tag).toBeInTheDocument();

    const textbox = screen.queryByRole('textbox');

    expect(textbox).not.toBeInTheDocument();
  });
  test('should test again with same value', async () => {
    const onchange = jest.fn();

    await renderWithProviders(<ChipInput onChange={onchange} />);
    const tag = screen.getByText('tag');

    await userEvent.click(tag);

    const textbox = screen.getByRole('textbox');

    await userEvent.type(screen.getByRole('textbox'), 'Hello, World!');
    await textbox.blur();
    expect(onchange).toHaveBeenCalledTimes(1);
    const button = screen.getByText('Hello, World!');

    await userEvent.click(button);
    const textbox2 = screen.getByRole('textbox');

    await userEvent.clear(textbox2);
    await userEvent.type(textbox2, 'Hello, World!');

    await textbox2.blur();
    expect(onchange).not.toHaveBeenCalledTimes(2);
    expect(onchange).toHaveBeenCalledTimes(1);
  });
  test('should test while sending null', async () => {
    const onchange = jest.fn();

    await renderWithProviders(<ChipInput onChange={onchange} value={null} />);
    const tag = screen.getByText('tag');

    expect(tag).toBeInTheDocument();
    await userEvent.click(tag);

    const textbox = screen.getByRole('textbox');

    await fireEvent.change(screen.getByRole('textbox'), null);
    await textbox.blur();
    expect(onchange).not.toHaveBeenCalled();
  });
});

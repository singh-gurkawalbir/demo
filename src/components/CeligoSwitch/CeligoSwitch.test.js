import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import CeligoSwitch from '.';

describe('celigoSwitch test', () => {
  test('should do click on checkbox', async () => {
    const onChange = jest.fn();

    renderWithProviders(<CeligoSwitch onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');

    await userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('should do the test for disable button', () => {
    const onChange = jest.fn();

    renderWithProviders(<CeligoSwitch checked onChange={onChange} disabled />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeDisabled();
  });
  test('should do test when button is initially checked', async () => {
    const onChange = jest.fn();

    renderWithProviders(<CeligoSwitch checked onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');

    await userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});


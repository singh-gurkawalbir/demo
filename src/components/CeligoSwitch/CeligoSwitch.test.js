/* global describe, test, expect , jest */
import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import CeligoSwitch from '.';

describe('CeligoSwitch test', () => {
  test('should do click on checkbox', () => {
    const onChange = jest.fn();

    renderWithProviders(<CeligoSwitch onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');

    userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalled();
  });

  test('should do the test for disable button', () => {
    const onChange = jest.fn();

    renderWithProviders(<CeligoSwitch checked onChange={onChange} disabled />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeDisabled();
  });
  test('should do test when button is initially checked', () => {
    const onChange = jest.fn();

    renderWithProviders(<CeligoSwitch checked onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');

    userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalled();
  });
});


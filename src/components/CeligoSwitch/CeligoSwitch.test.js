/* global describe, test, expect , jest */
import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import CeligoSwitch from '.';

describe('CeligoSwitch test', () => {
  test('single clicking', () => {
    const onChange = jest.fn();

    renderWithProviders(<CeligoSwitch onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');

    userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalled();
  });

  test('dbouble clicking', () => {
    const onChange = jest.fn();

    renderWithProviders(<CeligoSwitch onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');

    userEvent.click(checkbox);
    userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  test('passing with disable', () => {
    const onChange = jest.fn();

    renderWithProviders(<CeligoSwitch checked onChange={onChange} disabled />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeDisabled();
  });
  test('single clicking intial checked', () => {
    const onChange = jest.fn();

    renderWithProviders(<CeligoSwitch checked onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');

    userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalled();
  });
  test('single clicking intial checked', () => {
    const onChange = jest.fn();

    renderWithProviders(<CeligoSwitch onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');

    userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalled();
  });
});


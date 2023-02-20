
import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaCheckbox from './DynaCheckbox';
import {renderWithProviders} from '../../../../test/test-utils';

describe('dynaCheckbox UI tests', () => {
  test('should pass the initial render', () => {
    renderWithProviders(<DynaCheckbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
  test('should render a checked checkbox when value is passed as true in props', () => {
    const props = {value: true};

    renderWithProviders(<DynaCheckbox {...props} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    const checkBox = screen.getByRole('checkbox');

    expect(checkBox).toBeChecked();
  });
  test('should render a disabled checkbox when disabled is passed as true in props', () => {
    const props = {disabled: true};

    renderWithProviders(<DynaCheckbox {...props} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    const checkBox = screen.getByRole('checkbox');

    expect(checkBox).toBeDisabled();
  });
  test('should call the onChange function passed in props when checkbox is checked', async () => {
    const mockOnChange = jest.fn();
    const props = {onFieldChange: mockOnChange};

    renderWithProviders(<DynaCheckbox {...props} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    const checkBox = screen.getByRole('checkbox');

    await userEvent.click(checkBox);
    expect(mockOnChange).toHaveBeenCalled();
  });
});

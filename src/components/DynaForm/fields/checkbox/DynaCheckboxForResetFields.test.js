/* global describe, test, expect, jest */
import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaCheckboxForResetFields from './DynaCheckboxForResetFields';
import {renderWithProviders} from '../../../../test/test-utils';

describe('DynaCheckbox UI tests', () => {
  test('should pass the initial render', () => {
    renderWithProviders(<DynaCheckboxForResetFields />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
  test('should render empty DOM when "showDeprecatedMessage" is passed as true and "value","ignoreSortAndGroup" are false', () => {
    const {utils} = renderWithProviders(<DynaCheckboxForResetFields showDeprecatedMessage />);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should display a warning message when showDeprecatedMessage is true', () => {
    const props = {
      showDeprecatedMessage: true,
      value: 'demo value',
    };

    renderWithProviders(<DynaCheckboxForResetFields {...props} />);
    expect(screen.getByText('Deprecated option.')).toBeInTheDocument();
  });
  test('should execute the "onFieldChange" function passed in props when checkbox is checked', () => {
    const mockOnFieldChange = jest.fn();
    const props = {
      onFieldChange: mockOnFieldChange,
      fieldsToReset: [{value: 'field1'}, {value: 'field2'}, {value: 'field3'}],
      value: 'demo value',
    };

    renderWithProviders(<DynaCheckboxForResetFields {...props} />);
    const checkBox = screen.getByRole('checkbox');

    expect(checkBox).toBeInTheDocument();
    userEvent.click(checkBox);
    expect(mockOnFieldChange).tpBeCalled();
  });
});

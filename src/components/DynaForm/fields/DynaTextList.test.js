
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaTextList from './DynaTextList';

describe('test suite for DynaTextList', () => {
  test('should not be able to enter value if disabled', () => {
    const props = {
      id: 'excludeNodes',
      label: 'Exclude any of these nodes',
      helpKey: 'parser.xml.excludeNodes',
      disabled: true,
      isValid: true,
      description: 'The field is disabled',
    };

    renderWithProviders(<DynaTextList {...props} />);

    const label = document.querySelector('label');
    const inputField = screen.getByRole('textbox');

    expect(label).toHaveTextContent(props.label);
    expect(inputField).toBeDisabled();
    expect(screen.getByText(props.description)).toBeInTheDocument();
  });

  test('should respond to change in value', async () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'excludeNodes',
      label: 'Exclude any of these nodes',
      helpKey: 'parser.xml.excludeNodes',
      onFieldChange,
    };

    renderWithProviders(<DynaTextList {...props} />);
    const inputField = screen.getByRole('textbox');

    await userEvent.type(inputField, 'record');
    let currVal = '';

    'record'.split('').forEach(char => {
      currVal += char;
      expect(onFieldChange).toHaveBeenCalledWith(props.id, [currVal]);
    });
  });

  test('should show error message or description (if available)', () => {
    const props = {
      id: 'excludeNodes',
      label: 'Exclude any of these nodes',
      helpKey: 'parser.xml.excludeNodes',
      value: ['record', 'abc@xyz'],
      errorMessages: 'Use of wild character not allowed',
    };

    renderWithProviders(<DynaTextList {...props} />);

    expect(screen.getByText(props.errorMessages)).toBeInTheDocument();

    //  should populate the values
    const inputFields = screen.getAllByRole('textbox');

    expect(inputFields).toHaveLength(3);

    const inputFieldsValues = inputFields.map(inputField => inputField.value);

    expect(inputFieldsValues).toEqual([...props.value, '']);
  });
});

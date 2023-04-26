
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaAutocomplete from './DynaAutocomplete';

const onFieldChange = jest.fn();

describe('dynaAutocomplete tests', () => {
  test('should able to test DynaAutocomplete with empty value', async () => {
    const props = {
      options: [{value: 'val1', label: 'label1'}, {value: 'val2', label: 'label2'}, {value: '', label: 'Empty label'}],
      label: 'formLabel',
      description: 'Some Description',
      isValid: true,
      value: '',
      name: 'Text',
      id: 'text-1234',
      onFieldChange,
    };

    await renderWithProviders(<DynaAutocomplete {...props} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Empty label')).toBeInTheDocument();
    expect(screen.getByText('formLabel')).toBeInTheDocument();
    expect(screen.getByText('Some Description')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Empty label'));
    expect(screen.getByRole('presentation')).toBeInTheDocument(); // generally for pop-over list
    expect(screen.getByRole('option', {name: 'label1'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: 'label2'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: 'Empty label'})).toBeInTheDocument();
    await userEvent.click(screen.getByText('label1'));
    expect(onFieldChange).toHaveBeenNthCalledWith(1, 'text-1234', 'val1');
    expect(onFieldChange).toHaveBeenNthCalledWith(2, 'text-1234', 'val1');
  });
  test('should able to test DynaAutocomplete with non-empty value', async () => {
    const props = {
      options: [{value: 'val1', label: 'label1'}, {value: 'val2'}, {value: 'val3'}, {value: 'val4'}, {value: 'val5'}, {value: 'val6'}, {value: 'val7'}],
      label: 'formLabel',
      value: 'val4',
      name: 'Text',
      id: 'text-1234',
      onFieldChange,
    };

    await onFieldChange.mockClear();
    await renderWithProviders(<DynaAutocomplete {...props} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('val4')).toBeInTheDocument();
    await userEvent.click(screen.getByText('val4'));
    expect(screen.getByRole('option', {name: 'label1'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: 'val2'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: 'val7'})).toBeInTheDocument();
    await userEvent.click(screen.getByRole('option', {name: 'val6'}));
    expect(onFieldChange).toHaveBeenNthCalledWith(1, 'text-1234', 'val6');
    expect(onFieldChange).toHaveBeenNthCalledWith(2, 'text-1234', 'val6');
  });
});


import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaAutoSuggest from './DynaAutoSuggest';

const onFieldChange = jest.fn();

describe('dynaAutoSuggest tests', () => {
  test('should able to test DynaAutoSuggest with no suggestions', async () => {
    const props = {
      onFieldChange,
      isValid: true,
      description: 'Field message description',
    };

    await renderWithProviders(<DynaAutoSuggest {...props} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Field message description')).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: ''})).toBeInTheDocument();
    await userEvent.click(screen.getByRole('textbox'));
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });
  test('should able to test DynaAutoSuggest with some suggestions with labelName, valueName', async () => {
    const props = {
      options: {suggestions: [{customLabel: 'label1', customValue: 'val1'}, {customLabel: 'label2', customValue: 'val2'}]},
      value: 'val1',
      id: 'text-1234',
      label: 'Field label',
      labelName: 'customLabel',
      valueName: 'customValue',
      isEndSearchIcon: true,
      showInlineClose: true,
      showAllSuggestions: true,
    };

    await onFieldChange.mockClear();
    await renderWithProviders(<DynaAutoSuggest {...props} />);
    expect(screen.getByText('Field label')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('textbox'));
    expect(screen.getByRole('option', {name: 'label1'})).toBeInTheDocument();
    await userEvent.click(screen.getByRole('option', {name: 'label2'}));
    expect(onFieldChange).not.toHaveBeenCalledWith('text-1234', 'val2');
  });
  test('should able to test DynaAutoSuggest with some suggestions without labelName, valueName', async () => {
    const props = {
      onFieldChange,
      options: {suggestions: ['val1', 'val2a']},
      value: 'val2',
      id: 'text-1234',
    };

    await onFieldChange.mockClear();
    await renderWithProviders(<DynaAutoSuggest {...props} />);
    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.click(screen.getByRole('option', {name: 'val2 a'}));
    expect(onFieldChange).toHaveBeenCalledWith('text-1234', 'val2a');
  });
});

import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaXMLMapper from './DynaXMLMapper';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';

describe('dynaXMLMapper UI tests', () => {
  const initialStore = reduxStore;
  const mockonFieldChange = jest.fn();
  const props = {
    onFieldChange: mockonFieldChange,
    value: 'test value',
    id: 'testId',
    isLoggable: true,
  };

  mutateStore(initialStore, draft => {
    draft.session.form[props.formKey] = {
      showValidationBeforeTouched: true,
    };
  });

  test('should pass the initial render', () => {
    renderWithProviders(<DynaXMLMapper {...props} />, {initialStore});
    expect(screen.getByText('Path:')).toBeInTheDocument();
    expect(screen.getByText('Field Description')).toBeInTheDocument();
    expect(screen.getByText('Path')).toBeInTheDocument();
    expect(screen.getByText('Regex')).toBeInTheDocument();

    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Path');
    expect(screen.getAllByRole('combobox')).toHaveLength(3);
  });
  test('should call the onFieldChange function passed in props on initial render', async () => {
    renderWithProviders(<DynaXMLMapper {...props} />, {initialStore});
    await waitFor(() => expect(mockonFieldChange).toHaveBeenCalled());
  });
  test('should not throw any error while attempting to edit the fields', () => {
    renderWithProviders(<DynaXMLMapper {...props} />, {initialStore});
    let found = false;
    const textFields = screen.getAllByRole('combobox');

    try {
      userEvent.type(textFields[0], 'a');
      userEvent.type(textFields[1], 'a');
    } catch (e) {
      found = true;
    }
    expect(found).toBeFalsy();
  });
});


import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaXMLMapper from './DynaXMLMapper';
import { renderWithProviders } from '../../../../test/test-utils';

describe('dynaXMLMapper UI tests', () => {
  const mockonFieldChange = jest.fn();
  const props = {
    onFieldChange: mockonFieldChange,
    value: 'test value',
    id: 'testId',
    isLoggable: true,
  };

  test('should pass the initial render', () => {
    renderWithProviders(<DynaXMLMapper {...props} />);
    expect(screen.getByText('Path:')).toBeInTheDocument();
    expect(screen.getByText('Field Description')).toBeInTheDocument();
    expect(screen.getByText('Path')).toBeInTheDocument();
    expect(screen.getByText('Regex')).toBeInTheDocument();
    const textFields = screen.getAllByRole('textbox');

    expect(textFields).toHaveLength(4);
    screen.debug();
  });
  test('should call the onFieldChange function passed in props on initial render', async () => {
    renderWithProviders(<DynaXMLMapper {...props} />);
    await waitFor(() => expect(mockonFieldChange).toHaveBeenCalled());
  });
  test('should not throw any error while attempting to edit the fields', () => {
    renderWithProviders(<DynaXMLMapper {...props} />);
    let found = false;
    const textFields = screen.getAllByRole('textbox');

    try {
      userEvent.type(textFields[0], 'a');
      userEvent.type(textFields[1], 'a');
    } catch (e) {
      found = true;
    }
    expect(found).toBeFalsy();
  });
});

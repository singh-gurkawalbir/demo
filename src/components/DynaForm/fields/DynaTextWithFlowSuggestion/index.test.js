
import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaTextWithFlowSuggestion from './index';
import { renderWithProviders } from '../../../../test/test-utils';

jest.mock('./Suggestions', () => ({
  __esModule: true,
  ...jest.requireActual('./Suggestions'),
  default: () => <div>Suggestions Component</div>,
}));

describe('dynaTextWithFlowSuggestion UI tests', () => {
  test('should pass the initial render', () => {
    renderWithProviders(<DynaTextWithFlowSuggestion />);
    expect(screen.getByText('Suggestions Component')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
  test('should call the onFieldChange function passed in props when field is edited', async () => {
    const mockOnFieldChange = jest.fn();

    renderWithProviders(<DynaTextWithFlowSuggestion onFieldChange={mockOnFieldChange} />);
    const textfield = screen.getByRole('textbox');

    await userEvent.type(textfield, 'a');
    await waitFor(() => expect(mockOnFieldChange).toHaveBeenCalled());
  });
  test('should not render the suggestions component when both showExtract and showLookup props are false', () => {
    renderWithProviders(<DynaTextWithFlowSuggestion showLookup={false} showExtract={false} />);
    expect(screen.queryByText('Suggestions Component')).toBeNull();
  });
  test('should call the onFieldChange function passed in props when field is a handlebar expression', async () => {
    const mockOnFieldChange = jest.fn();

    renderWithProviders(<DynaTextWithFlowSuggestion onFieldChange={mockOnFieldChange} />);
    screen.getByRole('textbox').focus();

    await userEvent.paste('{{"data"}}');
    expect(mockOnFieldChange).toHaveBeenCalledWith(undefined, "{{'data'}}");
  });
});

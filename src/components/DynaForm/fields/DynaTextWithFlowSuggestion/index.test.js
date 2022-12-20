/* global describe, test, expect, jest */
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

describe('DynaTextWithFlowSuggestion UI tests', () => {
  test('should pass the initial render', () => {
    renderWithProviders(<DynaTextWithFlowSuggestion />);
    expect(screen.getByText('Suggestions Component')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    screen.debug(undefined, Infinity);
  });
  test('should call the onFieldChange function passed in props when field is edited', async () => {
    const mockOnFieldChange = jest.fn();

    renderWithProviders(<DynaTextWithFlowSuggestion onFieldChange={mockOnFieldChange} />);
    const textfield = screen.getByRole('textbox');

    userEvent.type(textfield, 'a');
    await waitFor(() => expect(mockOnFieldChange).toBeCalled());
  });
  test('should not render the suggestions component when both showExtract and showLookup props are false', () => {
    renderWithProviders(<DynaTextWithFlowSuggestion showLookup={false} showExtract={false} />);
    expect(screen.queryByText('Suggestions Component')).toBeNull();
  });
});

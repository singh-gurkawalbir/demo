import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TestConnectionSnackbar from '.';
import { renderWithProviders } from '../../../test/test-utils';

describe('testConnectionSnackBar UI tests', () => {
  const mockOnCancel = jest.fn();

  test('should pass the initial render and call the callback function when clicked on cancel', async () => {
    renderWithProviders(<TestConnectionSnackbar onCancel={mockOnCancel} />);
    expect(screen.getByText(/Testing your connection/i, {exact: false})).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i, {exact: false})).toBeInTheDocument();
    await userEvent.click(screen.getByText(/Cancel/i, {exact: false}));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});


/* global describe, test, expect ,jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TestConnectionSnackbar from '.';

describe('TestConnectionSnackBar UI tests', () => {
  const mockOnCancel = jest.fn();

  test('should pass the initial render and call the callback function when clicked on cancel', () => {
    render(<TestConnectionSnackbar onCancel={mockOnCancel} />);
    expect(screen.getByText(/Testing your connection/i, {exact: false})).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i, {exact: false})).toBeInTheDocument();
    userEvent.click(screen.getByText(/Cancel/i, {exact: false}));
    expect(mockOnCancel).toBeCalled();
  });
});


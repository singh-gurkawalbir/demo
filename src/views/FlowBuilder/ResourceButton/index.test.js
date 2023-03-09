
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../../test/test-utils';
import ResourceButton from '.';

describe('ResourceButton UI tests', () => {
  test('should pass the initial render with the label passed as props', () => {
    const props = { variant: 'import'};

    renderWithProviders(<ResourceButton {...props} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText(/import/i)).toBeInTheDocument();
  });
  test('should render disabled button when disabled is passed as true', () => {
    const props = { variant: 'import', disabled: true};

    renderWithProviders(<ResourceButton {...props} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
  test('should pass the onClick function passed in props when clicked on the button', async () => {
    const mockOnClick = jest.fn();
    const props = { variant: 'import', onClick: mockOnClick};

    renderWithProviders(<ResourceButton {...props} />);
    await userEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toBeCalled();
  });
});

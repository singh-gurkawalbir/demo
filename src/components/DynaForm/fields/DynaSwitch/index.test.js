import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaSwitch from '.';
import { renderWithProviders } from '../../../../test/test-utils';

describe('DynaSwitch test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockOnFieldChange = jest.fn();

  test('should test the checkbox which is initially checked', async () => {
    const props = {
      id: 'someId', onFieldChange: mockOnFieldChange, value: true, label: 'somelabel',
    };

    renderWithProviders(<DynaSwitch {...props} />);
    expect(screen.getByText('somelabel')).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');

    await userEvent.click(checkbox);
    expect(mockOnFieldChange).toHaveBeenCalledWith('someId', false);
  });
  test('should test the checkbox which is initially not checked', async () => {
    const props = {
      id: 'someId', onFieldChange: mockOnFieldChange, value: false, label: 'somelabel',
    };

    renderWithProviders(<DynaSwitch {...props} />);
    expect(screen.getByText('somelabel')).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');

    await userEvent.click(checkbox);
    expect(mockOnFieldChange).toHaveBeenCalledWith('someId', true);
  });
  test('should test the checkbox which is disabled', () => {
    const props = {
      id: 'someId', onFieldChange: mockOnFieldChange, value: true, label: 'somelabel', disabled: true, tooltip: 'sometooltip',
    };

    renderWithProviders(<DynaSwitch {...props} />);
    const tooltipcalled = screen.getByLabelText('sometooltip');

    expect(tooltipcalled).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeDisabled();
  });
});

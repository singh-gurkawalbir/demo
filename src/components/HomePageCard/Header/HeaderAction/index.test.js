
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeaderAction from '.';
import { renderWithProviders } from '../../../../test/test-utils';

const options = ['view errors', 'settings', 'dashboard', 'generate zip', 'add flow', 'clone', 'delete'];

describe('Header action test', () => {
  test('should render the same text passed into props', async () => {
    renderWithProviders(<HeaderAction variants={options} />);
    const x = screen.getByLabelText('more');

    await userEvent.click(x);
    const y = screen.getByText('view errors');

    expect(y).toBeVisible();
    await userEvent.click(y);
    expect(y).not.toBeVisible();
  });
});


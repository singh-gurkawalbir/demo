import React from 'react';
import { screen } from '@testing-library/react';
import CeligoDivider from '.';
import { renderWithProviders } from '../../test/test-utils';

describe('celigoDivider UI test', () => {
  test('should render at left position', () => {
    renderWithProviders(<CeligoDivider position="left" />);

    expect(screen.getByRole('separator')).toHaveAttribute('class', expect.stringContaining('makeStyles-left-'));
    expect(screen.getByRole('separator')).not.toHaveAttribute('class', expect.stringContaining('makeStyles-right-'));
  });

  test('should render at right position', () => {
    renderWithProviders(<CeligoDivider position="right" />);

    expect(screen.getByRole('separator')).toHaveAttribute('class', expect.stringContaining('makeStyles-right-'));
    expect(screen.getByRole('separator')).not.toHaveAttribute('class', expect.stringContaining('makeStyles-left-'));
  });
});

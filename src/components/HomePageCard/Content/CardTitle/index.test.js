
import React from 'react';
import { screen } from '@testing-library/react';
import CardTitle from '.';
import { renderWithProviders } from '../../../../test/test-utils';

const values = 'test';

describe('card title test', () => {
  test('should render the same text passed into children prop', async () => {
    renderWithProviders(<CardTitle>{values}</CardTitle>);
    const value = screen.getByText(values);

    expect(value).toBeInTheDocument();
  });
});


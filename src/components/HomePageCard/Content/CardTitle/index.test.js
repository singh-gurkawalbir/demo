
import React from 'react';
import { render, screen } from '@testing-library/react';
import CardTitle from '.';

const values = 'test';

describe('card title test', () => {
  test('should render the same text passed into children prop', async () => {
    render(<CardTitle>{values}</CardTitle>);
    const value = screen.getByText(values);

    expect(value).toBeInTheDocument();
  });
});


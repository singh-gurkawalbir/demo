/* global test, expect */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Content from '.';

const values = 'test';

test('should render the same text passed into children prop', async () => {
  render(<Content>{values}</Content>);
  const value = screen.getByText(values);

  expect(value).toBeInTheDocument();
});


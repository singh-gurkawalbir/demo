/* global test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import Header from '.';
import { renderWithProviders } from '../../../test/test-utils';

const values = 'test';

test('should render the same text passed into children prop', async () => {
  renderWithProviders(<Header> {values} </Header>);
  const value = screen.getByText(values);

  expect(value).toBeInTheDocument();
});

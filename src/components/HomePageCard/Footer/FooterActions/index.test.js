/* global test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import FooterActions from '.';
import {renderWithProviders} from '../../../../test/test-utils';

const values = 'test';

test('should render the same text passed into children prop', async () => {
  renderWithProviders(<FooterActions>{values}</FooterActions>);
  const value = screen.getByText(values);

  expect(value).toBeInTheDocument();
});


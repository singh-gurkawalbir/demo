/* global test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import Info from '.';
import {renderWithProviders} from '../../../../test/test-utils';

const values = 'test';
const values1 = '3 Flows';

test('should render the same text passed into props', async () => {
  renderWithProviders(<Info label={values} variant={values1} />);
  const value = screen.getByText(values);

  screen.debug();
  expect(value).toBeInTheDocument();
});


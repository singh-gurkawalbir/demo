/* global test, expect */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
import ApplicationImages from '.';
import {renderWithProviders} from '../../../../test/test-utils';

const values = 'test';
const numberOfApps = 'test1';

test('should render the same text passed into children prop', async () => {
  renderWithProviders(<ApplicationImages noOfApps={numberOfApps}>{values}</ApplicationImages>);
  const value = screen.getByText(values);

  expect(value).toBeInTheDocument();
});


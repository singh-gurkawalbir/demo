/* global test, expect, describe */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test/test-utils';
import RemoveMargin from './index';

describe('RemoveMargin UI tests', () => {
  test('should show the render the children', () => {
    renderWithProviders(<RemoveMargin ><div>Children Text</div></RemoveMargin>);
    expect(screen.getByText('Children Text')).toBeInTheDocument();
  });
  // negative test cases
  test('should show the string when passed as children', () => {
    const text = 'someString';

    renderWithProviders(<RemoveMargin >{text}</RemoveMargin>);
    expect(screen.getByText('someString')).toBeInTheDocument();
  });
  test('should show the number when passed as children', () => {
    const text = 1234;

    renderWithProviders(<RemoveMargin >{text}</RemoveMargin>);
    expect(screen.getByText('1234')).toBeInTheDocument();
  });
});

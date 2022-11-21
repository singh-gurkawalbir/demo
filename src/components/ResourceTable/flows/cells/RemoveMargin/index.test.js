/* global describe, test,expect */
import React from 'react';
import { screen, render } from '@testing-library/react';
import RemoveMargin from '.';

describe('Remove Margin UI test cases', () => {
  test('should show child component', () => {
    render(<RemoveMargin ><div>children component</div></RemoveMargin>);
    expect(screen.getByText('children component')).toBeInTheDocument();
  });
  // negative test cases
  test('should show string text when passes as child', () => {
    const str = 'stringText';

    render(<RemoveMargin >{str}</RemoveMargin>);
    expect(screen.getByText(str)).toBeInTheDocument();
  });
  test('should show number text when passes as child', () => {
    const num = 123;

    render(<RemoveMargin >{num}</RemoveMargin>);
    expect(screen.getByText('123')).toBeInTheDocument();
  });
});

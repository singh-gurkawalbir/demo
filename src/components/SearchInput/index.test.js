/* global describe, test, expect */
import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchInput from '.';

describe('SearchInput testing', () => {
  test('should do check for place holder', () => {
    render(<SearchInput />);
    const input = screen.getByDisplayValue('');

    expect(input).toHaveAttribute('placeholder', 'Search…');
  });
});

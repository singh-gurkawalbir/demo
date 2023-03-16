
import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchInput from '.';

describe('searchInput testing', () => {
  test('should check the presence of placeholder text', () => {
    render(<SearchInput />);
    const input = screen.getByDisplayValue('');

    expect(input).toHaveAttribute('placeholder', 'Search…');
  });
});

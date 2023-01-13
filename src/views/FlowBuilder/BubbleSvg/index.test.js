import { render } from '@testing-library/react';
import React from 'react';
import BubbleSvg from '.';

describe('Testsuite for BubbleSvg', () => {
  test('should test the values of height and width that passed to attributes', () => {
    render(
      <BubbleSvg height="100" width="100" classes="Test Classes" />
    );
    expect(document.querySelector('svg').getAttribute('height')).toBe('100');
    expect(document.querySelector('svg').getAttribute('width')).toBe('100');
  });
});

import { render } from '@testing-library/react';
import React from 'react';
import Background from './Background';

describe('Testsuite for Background', () => {
  test('should test the background render', () => {
    render(
      <Background />
    );
    expect(document.querySelector('svg[viewBox="0 0 152 95"]')).toBeInTheDocument();
  });
});

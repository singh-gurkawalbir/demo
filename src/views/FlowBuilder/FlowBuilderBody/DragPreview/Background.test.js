import { render } from '@testing-library/react';
import React from 'react';
import { FlowProvider } from '../Context';
import Background from './Background';

describe('Testsuite for Background', () => {
  test('should test the background render', () => {
    render(
      <FlowProvider>
        <Background />
      </FlowProvider>
    );
    expect(document.querySelector('svg[viewBox="0 0 152 95"]')).toBeInTheDocument();
  });
});

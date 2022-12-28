
import { render, screen } from '@testing-library/react';
import React from 'react';
import Stepper from '.';

describe('testsuite for stepper', () => {
  test('should verify the index count for stepper', () => {
    render(
      <Stepper index="5" isLast="true" >
        test
      </Stepper>
    );
    expect(screen.getByText(/5/i)).toBeInTheDocument();
    expect(screen.getByText(/test/i)).toBeInTheDocument();
  });
});

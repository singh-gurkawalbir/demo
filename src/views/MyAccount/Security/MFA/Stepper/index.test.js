/* global describe, test, expect */
import { render, screen } from '@testing-library/react';
import React from 'react';
import Stepper from '.';

describe('Testsuite for stepper', () => {
  test('should verify the index count for stepper', () => {
    const children = 'test';

    render(
      <Stepper index="5" isLast="true" >
        {children}
      </Stepper>
    );
    expect(screen.getByText(/5/i)).toBeInTheDocument();
    expect(screen.getByText(/test/i)).toBeInTheDocument();
  });
});

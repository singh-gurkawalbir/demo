/* global describe, test, expect */
import { render, screen } from '@testing-library/react';
import React from 'react';
import CeligoLogo from '.';

describe('Testsuite for Celigo Logo', () => {
  test('should test the celigo logo', () => {
    render(
      <CeligoLogo />
    );
    expect(screen.getByText(/Celigo Inc/i)).toBeInTheDocument();
    expect(document.querySelector('svg[data-test="celigo-logo"]')).toBeInTheDocument();
  });
});

/* global describe, test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../test/test-utils';
import DynaMFAMobileCode from '.';

describe('DynaMFAMobileCode UI tests', () => {
  test('should pass the initial render', () => {
    const props = {label: 'demo label'};

    renderWithProviders(<DynaMFAMobileCode {...props} />);
    expect(screen.getByText('demo label')).toBeInTheDocument();
    expect(screen.getByText('Enter the 6-digit code from your app and click the', {exact: false})).toBeInTheDocument();
    expect(screen.getByText('Verify')).toBeInTheDocument();
    screen.debug();
  });
});

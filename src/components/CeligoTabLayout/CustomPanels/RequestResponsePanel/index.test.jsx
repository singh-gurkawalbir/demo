/* eslint-disable quotes */

/* global describe, test, expect */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, screen } from '@testing-library/react';
import RequestResponsePanel from '.';
import { renderWithProviders } from '../../../../test/test-utils';

const props = {variant: ''};

describe('Testing Request Response panel', async () => {
  test('Testing the Request Response Panel', async () => {
    renderWithProviders(
      <RequestResponsePanel {...props} />
    );
    const value1 = screen.getByText('Body');

    expect(value1).toBeInTheDocument();
    fireEvent.click(value1);
    const value2 = screen.getByText('Headers');

    expect(value2).toBeInTheDocument();
    fireEvent.click(value1);
    const value3 = screen.getByText('Other');

    expect(value3).toBeInTheDocument();
    fireEvent.click(value1);
  });
});

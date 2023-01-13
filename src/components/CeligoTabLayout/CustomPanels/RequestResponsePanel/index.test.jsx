import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import RequestResponsePanel from '.';
import { renderWithProviders } from '../../../../test/test-utils';

const props = {variant: ''};

describe('testing Request Response panel', () => {
  test('testing the Request Response Panel', async () => {
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

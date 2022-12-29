
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import DynaExpiryTime from './DynaExpiryTime';

describe('dynaExpiryTime tests', () => {
  test('should able to test DynaExpiryTime with date in ISO_8601 format', async () => {
    const props = {
      value: '2022-05-18',
    };

    await renderWithProviders(<DynaExpiryTime {...props} />);
    expect(screen.getByText('Expires in')).toBeInTheDocument();
    expect(screen.getByText('05/18/2022', {exact: false})).toBeInTheDocument();
  });
  test('should able to test DynaExpiryTime with current date', async () => {
    const props = {
      value: '18',
    };

    await renderWithProviders(<DynaExpiryTime {...props} />);
    expect(screen.queryByText('05/18/2022 5:30:00 am')).not.toBeInTheDocument();
  });
  test('should able to test DynaExpiryTime without proper date', async () => {
    const props = {
      value: '1a-12-202l',
    };

    await renderWithProviders(<DynaExpiryTime {...props} />);
    expect(screen.queryByText('Expires in')).not.toBeInTheDocument();
  });
});

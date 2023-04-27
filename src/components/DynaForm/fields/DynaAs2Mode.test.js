
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import AS2url from './DynaAs2Mode';

describe('aS2url tests', () => {
  test('should able to test AS2url', async () => {
    await renderWithProviders(<AS2url />);
    expect(screen.getByLabelText('AS2 mode')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByText('Choose AS2 via HTTP or HTTPS for this connection.')).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'AS2 via HTTPS'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'AS2 via HTTP'})).toBeInTheDocument();
    expect(screen.getByText('AS2 URL')).toBeInTheDocument();
    expect(screen.getByText('https://api.localhost/v1/as2')).toBeInTheDocument();
    // HTTPS is set default
    await userEvent.click(screen.getByRole('radio', {name: 'AS2 via HTTP'}));
    expect(screen.getByText('http://api.localhost/v1/as2')).toBeInTheDocument();
  });
});


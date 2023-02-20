
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';

describe('uI test cases for metadata', () => {
  test('should render the table accordingly', async () => {
    renderWithProviders(
      <CeligoTable
        {...metadata}
        data={[{_id: '6287678bdh893338hdn3', browser: 'Chrome', os: 'windows'}]} />
    );
    expect(screen.getByText('Chrome windows')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    const deleteDeviceButton = screen.getByText('Delete device');

    expect(deleteDeviceButton).toBeInTheDocument();
  });
});

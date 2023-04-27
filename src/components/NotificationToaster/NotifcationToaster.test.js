import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationToaster from '.';
import { renderWithProviders } from '../../test/test-utils';

describe('notifcationToaster UI tests', () => {
  test('should click on the close button', async () => {
    const onClose = jest.fn();

    renderWithProviders(
      <NotificationToaster variant="info" onClose={onClose} size="large"><div>message</div>
      </NotificationToaster>);

    expect(screen.getByText('message')).toBeInTheDocument();
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
  test('should not show the close button as the onClose function is not passed as prop', () => {
    renderWithProviders(
      <NotificationToaster variant="info" transparent><div>message</div>
      </NotificationToaster>);

    expect(screen.getByText('message')).toBeInTheDocument();
    const button = screen.queryByRole('button');

    expect(button).not.toBeInTheDocument();
  });
});

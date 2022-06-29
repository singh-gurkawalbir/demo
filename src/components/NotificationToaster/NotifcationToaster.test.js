/* global describe, test, expect ,jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationToaster from '.';

describe('NotifcationToaster testing', () => {
  test('testing when onclose button is visble', () => {
    const onClose = jest.fn();

    render(
      <NotificationToaster variant="info" onClose={onClose} size="large"><div>message</div>
      </NotificationToaster>);

    expect(screen.getByText('message')).toBeInTheDocument();
    const button = screen.getByRole('button');

    userEvent.click(button);
    expect(onClose).toHaveBeenCalled();
  });
  test('testing when onclose button is in visble', () => {
    render(
      <NotificationToaster variant="info" transparent><div>message</div>
      </NotificationToaster>);

    expect(screen.getByText('message')).toBeInTheDocument();
    const button = screen.queryByRole('button');

    expect(button).not.toBeInTheDocument();
  });
});

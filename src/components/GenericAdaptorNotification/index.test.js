
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import GenericAdaptorNotification from '.';

describe('genericAdaptorNotification ui tests', () => {
  test('should display the predefined notification content', () => {
    const mockFunc = jest.fn();

    renderWithProviders(
      <GenericAdaptorNotification onClose={mockFunc} />
    );
    const message = screen.getByText(
      'We haven’t created a simplified form for this application yet. ',
      { exact: false }
    );
    const secondMessage = screen.getByText('Let us know to prioritize this', {
      exact: false,
    });

    expect(message).toBeInTheDocument();
    expect(secondMessage).toBeInTheDocument();
  });

  test('should invoke the onClose function on closing the notification', async () => {
    const mockFunc = jest.fn();

    renderWithProviders(
      <GenericAdaptorNotification onClose={mockFunc} />
    );
    const button = screen.getByRole('button');

    await userEvent.click(button);
    waitFor(() => expect(mockFunc).toHaveBeenCalledTimes(1));
  });
  test('should not render the close icon when onClose function is not passed', () => {
    renderWithProviders(
      <GenericAdaptorNotification />
    );
    expect(screen.queryByRole('button')).toBeNull();
  });
});


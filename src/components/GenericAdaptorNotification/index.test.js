/* global describe, test, expect, jest */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import GenericAdaptorNotification from '.';

describe('GenericAdaptorNotification ui tests', () => {
  test('notification render testing', () => {
    const mockFunc = jest.fn();

    renderWithProviders(
      <MemoryRouter>
        <GenericAdaptorNotification onClose={mockFunc} />
      </MemoryRouter>
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
    screen.debug();
  });

  test('checking the invoke of onClose Function', () => {
    const mockFunc = jest.fn();

    renderWithProviders(
      <MemoryRouter>
        <GenericAdaptorNotification onClose={mockFunc} />
      </MemoryRouter>
    );
    const button = screen.getByRole('button');

    userEvent.click(button);
    waitFor(() => expect(mockFunc).toHaveBeenCalledTimes(1));
  });
  test('checking the invoke of onClose Function', () => {
    renderWithProviders(
      <MemoryRouter>
        <GenericAdaptorNotification />
      </MemoryRouter>
    );
    expect(screen.queryByRole('button')).toBeNull();
  });
});

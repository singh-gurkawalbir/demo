
import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import Clipboard from '.';

describe('clipborad UI test', () => {
  test('should test the condition when token value is not sent as props', async () => {
    const onShowToken = jest.fn();

    renderWithProviders(<Clipboard onShowToken={onShowToken} />);

    const button = screen.getByText('Show token');

    await userEvent.click(button);

    expect(onShowToken).toHaveBeenCalled();
  });

  test('should test the condition when token value is not sent as props.', async () => {
    const onShowToken = jest.fn();

    renderWithProviders(<Clipboard token="******" onShowToken={onShowToken} />);

    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(screen.getByText('Token copied to clipboard.')).toBeInTheDocument();
  });
});

/* global describe, test, expect, jest */
import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import Clipboard from '.';

describe('clipborad test', () => {
  test('rendering', () => {
    const onShowToken = jest.fn();

    renderWithProviders(<Clipboard onShowToken={onShowToken} />);

    const button = screen.getByText('Show token');

    userEvent.click(button);

    expect(onShowToken).toHaveBeenCalled();
  });

  test('rendering', () => {
    const onShowToken = jest.fn();

    renderWithProviders(<Clipboard token="******" onShowToken={onShowToken} />);

    const button = screen.getByRole('button');

    userEvent.click(button);

    expect(screen.getByText('Token copied to clipboard.')).toBeInTheDocument();
  });
});

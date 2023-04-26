
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaApiIdentifier from './DynaApiIdentifier';

describe('dynaApiIdentifier tests', () => {
  jest.spyOn(window, 'prompt').mockImplementation();
  test('should able to test DynaApiIdentifier', async () => {
    const props = {value: 'api/endpoint'};

    await renderWithProviders(<DynaApiIdentifier {...props} />);
    expect(screen.getByRole('textbox').getAttribute('value')).toBe('https://api.localhost/api/endpoint');
    const copyBtn = screen.getAllByRole('button').find(b => b.getAttribute('data-test') === 'copyToClipboard');

    expect(copyBtn).toBeInTheDocument();
    await userEvent.click(copyBtn);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('URL copied to clipboard.')).toBeInTheDocument();
  });
});


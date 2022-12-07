/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaApiIdentifier from './DynaApiIdentifier';

describe('DynaApiIdentifier tests', () => {
  window.prompt = jest.fn();
  test('Should able to test DynaApiIdentifier ', async () => {
    const props = {value: 'api/endpoint'};

    await renderWithProviders(<DynaApiIdentifier {...props} />);
    expect(screen.getByRole('textbox').getAttribute('value')).toEqual('https://api.localhost/api/endpoint');
    const copyBtn = screen.getAllByRole('button').find(b => b.getAttribute('data-test') === 'copyToClipboard');

    expect(copyBtn).toBeInTheDocument();
    userEvent.click(copyBtn);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('URL copied to clipboard.')).toBeInTheDocument();
  });
});


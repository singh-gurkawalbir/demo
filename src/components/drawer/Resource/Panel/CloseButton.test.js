
import React from 'react';
import { screen } from '@testing-library/react';
import {renderWithProviders } from '../../../../test/test-utils';
import CloseButton from './CloseButton';
import { FormOnCancelProvider } from '../../../FormOnCancelContext';

describe('CloseButton tests', () => {
  test('Should able to test the Close drawer button', async () => {
    await renderWithProviders(<FormOnCancelProvider><CloseButton {...{formKey: '_formKey'}} /></FormOnCancelProvider>);
    expect(screen.getByRole('button')).toBeEnabled();
  });
});

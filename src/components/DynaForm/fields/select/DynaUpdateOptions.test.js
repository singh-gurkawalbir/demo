
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../test/test-utils';
import DynaUpdateOptions from './DynaUpdateOptions';

const mockChange = jest.fn();

describe('dynaUpdateOptions tests', () => {
  test('should able to test DynaUpdateOptions', async () => {
    const props = {onFieldChange: mockChange, options: [{items: [{value: 'dynaSelectValue', label: 'DynaSelect label'}]}]};

    await renderWithProviders(<DynaUpdateOptions {...props} />);
    expect(screen.getByRole('button', {name: 'Please select'})).toBeInTheDocument();
  });
});


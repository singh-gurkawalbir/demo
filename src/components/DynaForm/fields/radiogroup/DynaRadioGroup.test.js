/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test/test-utils';
import DynaRadio from './DynaRadioGroup';

const onFieldChange = jest.fn();

describe('DynaRadio tests', () => {
  test('Should able to test DynaRadio without Form label', async () => {
    const props = {
      options: [{items: ['item1', {value: 'item2'}]}], onFieldChange,

    };

    await renderWithProviders(<DynaRadio {...props} />);
    expect(screen.getByText('item1')).toBeInTheDocument();
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'item2'})).toBeInTheDocument();
    userEvent.click(screen.getByText('item1'));
    expect(onFieldChange).toHaveBeenCalledWith(undefined, 'item1');
  });
  test('Should able to test DynaRadio without options', async () => {
    const props = {
      label: 'field label',
    };

    await renderWithProviders(<DynaRadio {...props} />);
    expect(screen.getByText('field label')).toBeInTheDocument();
  });
});

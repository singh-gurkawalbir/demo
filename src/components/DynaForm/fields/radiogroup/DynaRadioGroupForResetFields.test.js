
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test/test-utils';
import DynaRadioGroupForResetFields from './DynaRadioGroupForResetFields';

const onFieldChange = jest.fn();

describe('dynaRadioGroupForResetFields tests', () => {
  test('should able to test DynaRadioGroupForResetFields without fieldsToReset', async () => {
    const props = {
      options: [{items: ['item1', {value: 'item2'}]}],
      onFieldChange,
      id: 'id1',
    };

    await renderWithProviders(<DynaRadioGroupForResetFields {...props} />);
    await userEvent.click(screen.getByText('item2'));
    expect(onFieldChange).toHaveBeenCalledWith('id1', 'item2');
  });
  test('should able to test DynaRadioGroupForResetFields with fieldsToReset', async () => {
    const props = {
      options: [{items: ['item1', {value: 'item2'}]}],
      fieldsToReset: [{type: 'checkbox', id: '_id1'}, {type: 'button', id: '_id2'}],
      onFieldChange,
      id: 'id1',
    };

    await onFieldChange.mockClear();
    await renderWithProviders(<DynaRadioGroupForResetFields {...props} />);
    await userEvent.click(screen.getByText('item1'));
    expect(onFieldChange).toHaveBeenCalledWith('id1', 'item1');
  });
});

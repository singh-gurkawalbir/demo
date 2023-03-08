
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaCsvHasHeaderRow from './DynaCsvHasHeaderRow';

const onFieldChange = jest.fn();

describe('dynaCsvHasHeaderRow tests', () => {
  test('should able to test DynaCsvHasHeaderRow with fieldToReset', async () => {
    const props = {
      onFieldChange,
      fieldResetValue: 'value1',
      fieldToReset: 'field1',
      id: '_id',
    };

    await renderWithProviders(<DynaCsvHasHeaderRow {...props} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onFieldChange).toHaveBeenCalledWith('_id', true);
    await waitFor(() => expect(onFieldChange).toHaveBeenCalledWith('field1', 'value1'));
  });
  test('should able to test DynaCsvHasHeaderRow without fieldToReset', async () => {
    const props = {
      onFieldChange,
    };

    await onFieldChange.mockClear();
    await renderWithProviders(<DynaCsvHasHeaderRow {...props} />);
    await userEvent.click(screen.getByRole('checkbox'));
    await waitFor(() => expect(onFieldChange).not.toHaveBeenCalledWith('field1', 'value1'));
  });
});

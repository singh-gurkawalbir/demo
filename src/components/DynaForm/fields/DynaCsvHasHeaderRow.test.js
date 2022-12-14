/* global describe, test, expect, jest */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaCsvHasHeaderRow from './DynaCsvHasHeaderRow';

const onFieldChange = jest.fn();

describe('DynaCsvHasHeaderRow tests', () => {
  test('Should able to test DynaCsvHasHeaderRow with fieldToReset', async () => {
    const props = {
      onFieldChange,
      fieldResetValue: 'value1',
      fieldToReset: 'field1',
      id: '_id',
    };

    await renderWithProviders(<DynaCsvHasHeaderRow {...props} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    userEvent.click(screen.getByRole('checkbox'));
    expect(onFieldChange).toBeCalledWith('_id', true);
    await waitFor(() => expect(onFieldChange).toBeCalledWith('field1', 'value1'), 1000);
  });
  test('Should able to test DynaCsvHasHeaderRow without fieldToReset', async () => {
    const props = {
      onFieldChange,
    };

    await onFieldChange.mockClear();
    await renderWithProviders(<DynaCsvHasHeaderRow {...props} />);
    userEvent.click(screen.getByRole('checkbox'));
    await waitFor(() => expect(onFieldChange).not.toBeCalledWith('field1', 'value1'), 1000);
  });
});


import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test/test-utils';
import DynaTextSetFieldValues from './DynaTextForSetFields';

const mockChange = jest.fn();

describe('dynaTextSetFieldValues tests', () => {
  test('should able to test DynaTextSetFieldValues', async () => {
    const props = {setFieldIds: ['first'], onFieldChange: mockChange};

    await renderWithProviders(<DynaTextSetFieldValues {...props} />);
    await userEvent.type(screen.getByRole('textbox'), 't');
    expect(mockChange).toHaveBeenNthCalledWith(1, undefined, 't');
    expect(mockChange).toHaveBeenNthCalledWith(2, 'first', '', true);
  });
  test('should able to test DynaTextSetFieldValues without setFieldIds', async () => {
    mockChange.mockClear();
    const props = {onFieldChange: mockChange};

    await renderWithProviders(<DynaTextSetFieldValues {...props} />);
    await userEvent.type(screen.getByRole('textbox'), 't');
    expect(mockChange).toHaveBeenNthCalledWith(1, undefined, 't');
    expect(mockChange).not.toHaveBeenNthCalledWith(2, 'first', '', true);
  });
});


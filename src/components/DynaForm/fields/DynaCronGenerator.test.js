
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaCronGenerator from './DynaCronGenerator';

const onFieldChange = jest.fn();
const props = {
  scheduleStartMinuteOffset: '',
  id: '',
  value: '? */5 * * * *',
  onFieldChange,
};

describe('dynaCronGenerator tests', () => {
  test('should able to test DynaCronGenerator', async () => {
    await renderWithProviders(<DynaCronGenerator {...props} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Reset'}));
    expect(onFieldChange).toHaveBeenCalledWith('', '', undefined);
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByRole('tab', {name: 'Minute'})).toBeInTheDocument();
    expect(screen.getByRole('tab', {name: 'Each selected minute'})).toBeInTheDocument();
  });
});

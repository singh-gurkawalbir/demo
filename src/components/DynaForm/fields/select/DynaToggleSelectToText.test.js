
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test/test-utils';
import DynaToggleSelectToText from './DynaToggleSelectToText';

describe('dynaToggleSelectToText tests', () => {
  test('should able to test DynaToggleSelectToText', async () => {
    const props = {isTextComponent: true, textHrefLabel: 'TextLabel', selectHrefLabel: 'SelectLabel'};

    await renderWithProviders(<DynaToggleSelectToText {...props} />);
    expect(screen.getByRole('button', {name: 'TextLabel'})).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'TextLabel'}));
    expect(screen.getByRole('button', {name: 'Please select'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'SelectLabel'})).toBeInTheDocument();
  });
});


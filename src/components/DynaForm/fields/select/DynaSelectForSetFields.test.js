
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test/test-utils';
import DynaSelectSetFieldValues from './DynaSelectForSetFields';

const mockChange = jest.fn();

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

describe('dynaSelectSetFieldValues tests', () => {
  test('should able to test DynaSelectSetFieldValues', async () => {
    const props = {setFieldIds: ['first'], onFieldChange: mockChange, options: [{items: [{value: 'dynaSelectValue', label: 'DynaSelect label'}]}]};

    await renderWithProviders(<DynaSelectSetFieldValues {...props} />);
    expect(screen.getByRole('button', {name: 'Please select'})).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    expect(screen.getByRole('presentation')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('menuitem', {name: 'DynaSelect label'}));
    expect(mockChange).toHaveBeenNthCalledWith(1, undefined, 'dynaSelectValue');
    expect(mockChange).toHaveBeenNthCalledWith(2, 'first', '', true);
  });
  test('should able to test DynaSelectSetFieldValues without setFieldIds', async () => {
    mockChange.mockClear();
    const props = {onFieldChange: mockChange, options: [{items: [{value: 'dynaSelectValue', label: 'DynaSelect label'}]}]};

    await renderWithProviders(<DynaSelectSetFieldValues {...props} />);
    await userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    await userEvent.click(screen.getByRole('menuitem', {name: 'DynaSelect label'}));
    expect(mockChange).toHaveBeenNthCalledWith(1, undefined, 'dynaSelectValue');
    expect(mockChange).not.toHaveBeenNthCalledWith(2, 'first', '', true);
  });
});


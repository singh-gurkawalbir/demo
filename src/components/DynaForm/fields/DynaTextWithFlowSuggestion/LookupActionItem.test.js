/* global describe, test, expect, jest */
import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LookupActionItem from './LookupActionItem';
import { renderWithProviders } from '../../../../test/test-utils';

jest.mock('../../../../hooks/useEnableButtonOnTouchedForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../hooks/useEnableButtonOnTouchedForm'),
  default: props => ({formTouched: true, onClickWhenValid: props.onClick}),
}));

describe('LookupActionItem UI tests', () => {
  test('should pass the initial render', () => {
    renderWithProviders(<LookupActionItem />);
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    screen.debug();
  });
  test('should render the manageLookup dialog when clicked on the button', () => {
    renderWithProviders(<LookupActionItem />);
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    userEvent.click(button);
    expect(screen.getByText('Add lookup')).toBeInTheDocument();
    expect(screen.getByText('Some unknown error')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    screen.debug();
  });
  test('should display the edit option when isEdit prop is true', () => {
    const props = {
      value: {
        name: 'test name',
      },
      isEdit: true,
    };

    renderWithProviders(<LookupActionItem {...props} />);
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(screen.getByText('test name')).toBeInTheDocument();
    screen.debug();
  });
  test('should call the onSave function passed in props and close the dialog when clicked on "Save"', async () => {
    const mockOnSave = jest.fn();
    const props = {
      value: {
        name: 'test name',
      },
      isEdit: true,
      onSave: mockOnSave,
    };

    renderWithProviders(<LookupActionItem {...props} />);
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    userEvent.click(button);
    screen.debug(undefined, Infinity);
    userEvent.click(screen.getByText('Save'));
    await waitFor(() => expect(mockOnSave).toBeCalled());
  });
});

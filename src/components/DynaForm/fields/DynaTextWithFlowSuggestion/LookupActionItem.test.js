
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

describe('lookupActionItem UI tests', () => {
  test('should pass the initial render', () => {
    renderWithProviders(<LookupActionItem />);
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
  });
  test('should render the manageLookup dialog when clicked on the button', async () => {
    renderWithProviders(<LookupActionItem />);
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(screen.getByText('Add lookup')).toBeInTheDocument();
    expect(screen.getByText('Some unknown error')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
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
    await userEvent.click(button);
    await userEvent.click(screen.getByText('Save'));
    await waitFor(() => expect(mockOnSave).toHaveBeenCalled());
  });
});


import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaUserEmail from './DynaUserEmail';
import { renderWithProviders} from '../../../test/test-utils';
import actions from '../../../actions';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

function initDynaUserEmail(props = {}) {
  const ui = (
    <DynaUserEmail
      {...props}
      />
  );

  return renderWithProviders(ui);
}

describe('dynaUserEmail UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show the modal dialog when clicked on action button', async () => {
    initDynaUserEmail({label: 'PropsLabel', value: 'PropsValue', readOnly: false});
    expect(screen.getByText('PropsLabel')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeDisabled();
    await userEvent.click(screen.getByRole('button'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.api.clearComms()
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('closeModalDialog'));
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
  });
  test('should not have action button when read only mode is avaiable', () => {
    initDynaUserEmail({label: 'PropsLabel', value: 'PropsValue', readOnly: true});

    expect(screen.getByText('PropsLabel')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  test('should show help text', async () => {
    initDynaUserEmail({label: 'PropsLabel', value: 'PropsValue', readOnly: true, helpText: 'Provided help text'});

    expect(screen.getByText('PropsLabel')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeDisabled();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Provided help text')).toBeInTheDocument();
  });
});

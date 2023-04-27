
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaUserPassword from './DynaUserPassword';
import { renderWithProviders} from '../../../test/test-utils';
import actions from '../../../actions';

jest.mock('../../icons/EditIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../icons/EditIcon'),
  default: () => (
    <div>EditIcon</div>
  ),
}));

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('dynaUserEmail UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show the modal dialog when clicked on action button', async () => {
    renderWithProviders(
      <DynaUserPassword
        label="PropsLabel"
        value="PropsValue"
        />);
    expect(screen.getByText('PropsLabel')).toBeInTheDocument();
    await userEvent.click(screen.getByText('EditIcon'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.api.clearComms()
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('closeModalDialog'));
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
  });
});

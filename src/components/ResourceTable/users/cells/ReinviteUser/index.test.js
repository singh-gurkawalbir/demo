
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../../test/test-utils';
import ReinviteUser from '.';
import actions from '../../../../../actions';
import { getCreatedStore } from '../../../../../store';

let initialStore;
const mockDispatchFn = jest.fn(action => initialStore.dispatch(action));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

jest.mock('../../../../Spinner', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../Spinner'),
  default: () => (<span data-testid="spinner">Spinner</span>),
}));

describe('test for Reinviting User', () => {
  test('should be able to reinvite a user', () => {
    initialStore = getCreatedStore();
    initialStore.getState().user.org.users = [{
      _id: 'user123',
    }];
    renderWithProviders(<ReinviteUser user={{_id: 'user123'}} />, {initialStore});
    const reinviteButton = screen.getByRole('button', {name: 'Reinvite'});

    userEvent.click(reinviteButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.user.org.users.reinvite('user123'));
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});

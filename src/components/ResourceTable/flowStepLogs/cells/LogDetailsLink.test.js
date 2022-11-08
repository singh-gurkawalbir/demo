/* global test, expect, describe, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';
import actions from '../../../../actions';
import LogDetailsLink from './LogDetailsLink';

const mockDispatch = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

initialStore.getState().session.logs.flowStep = {someresourceId: {activeLogKey: 'somelogKey'}};

describe('LogDetailsLink UI tests', () => {
  test('should make dispatch call to set active log when clicked on time', () => {
    const {store} = renderWithProviders(<LogDetailsLink resourceId="someresourceId" logKey="somelogKey" time="2022-05-18T18:16:31.989Z" />);
    const profile = {timezone: 'Asia/Kolkata'};

    store.dispatch(actions.user.profile.update(profile));

    userEvent.click(screen.getByText('05/18/2022 11:46:31 pm'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.logs.flowStep.setActiveLog('someresourceId', 'somelogKey')
    );
  });
  test('should check if the option is already clicked', () => {
    const {store} = renderWithProviders(<LogDetailsLink resourceId="someresourceId" logKey="somelogKey" time="2022-05-18T18:16:31.989Z" />, {initialStore});
    const profile = {timezone: 'Asia/Kolkata'};

    store.dispatch(actions.user.profile.update(profile));

    const button = screen.getByRole('button');

    const classOfButton = button.getAttribute('class');

    expect(classOfButton.indexOf('rowClicked')).toBeGreaterThan(-1);
  });
});

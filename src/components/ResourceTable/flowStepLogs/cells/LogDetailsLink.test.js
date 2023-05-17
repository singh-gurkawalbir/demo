
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
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

mutateStore(initialStore, draft => {
  draft.session.logs.flowStep = {someresourceId: {activeLogKey: 'somelogKey'}};
});

describe('logDetailsLink UI tests', () => {
  test('should make dispatch call to set active log when clicked on time', async () => {
    const {store} = renderWithProviders(<LogDetailsLink resourceId="someresourceId" logKey="somelogKey" time="2022-05-18T18:16:31.989Z" />);
    const profile = {timezone: 'Asia/Kolkata'};

    act(() => store.dispatch(actions.user.profile.update(profile)));

    await userEvent.click(screen.getByText('05/18/2022 6:16:31 pm'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.logs.flowStep.setActiveLog('someresourceId', 'somelogKey')
    );
  });
});

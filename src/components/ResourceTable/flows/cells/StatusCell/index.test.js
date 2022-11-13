/* global describe, test,expect, jest */
import React from 'react';
import { screen, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { reduxStore, renderWithProviders} from '../../../../../test/test-utils';
import StatusCell from '.';

const mockDispatch = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
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

initialStore.getState().user.profile = {
  timezone: 'Asia/Calcutta',
};

describe('Status Cell of Flow Table UI test cases', () => {
  test('should show undefined as name when no props are provided', () => {
    const utils = render(<MemoryRouter><StatusCell /></MemoryRouter>);

    expect(utils.container.textContent).toBe('');
  });
  test('should show status provided', () => {
    render(<StatusCell lastExecutedAtSortJobStatus="someStatus" />);
    expect(screen.getByText('someStatus')).toBeInTheDocument();
  });
  test('should show status when job in queue satus', () => {
    render(
      <MemoryRouter>
        <StatusCell
          lastExecutedAtSortJobStatus="someStatus"
          isJobInQueuedStatus />
      </MemoryRouter>);
    expect(screen.getByText('someStatus')).toBeInTheDocument();
  });
  test('should show name and link to flowBuilder when no connection is offline', () => {
    renderWithProviders(
      <StatusCell
        lastExecutedAtSortType="date"
        lastExecutedAtSort="2022-05-18T18:16:31.989Z"
        />, {initialStore});
    expect(screen.getByText('05/18/2022 11:46:31 pm')).toBeInTheDocument();
  });
});

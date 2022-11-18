/* global describe, test,expect */
import React from 'react';
import { screen, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { reduxStore, renderWithProviders} from '../../../../../test/test-utils';
import StatusCell from '.';

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
    render(<MemoryRouter><StatusCell lastExecutedAtSortJobStatus="someStatus" /></MemoryRouter>);
    expect(screen.getByText('someStatus')).toBeInTheDocument();
  });
  test('should show status when job in queue status', () => {
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
      <MemoryRouter>
        <StatusCell
          lastExecutedAtSortType="date"
          lastExecutedAtSort="2022-05-18T18:16:31.989Z"
        />
      </MemoryRouter>, {initialStore}
    );
    expect(screen.getByText('05/18/2022 11:46:31 pm')).toBeInTheDocument();
  });
});

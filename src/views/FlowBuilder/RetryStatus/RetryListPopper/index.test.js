/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RetryListPopper from './index';
import { renderWithProviders } from '../../../../test/test-utils';

const resources = [{_id: 's1', name: 'name1'}, {_id: 's2', name: 'name2'}, {_id: 's3', name: 'name3'}];

function initRetryListPopper(props) {
  return renderWithProviders(<MemoryRouter><RetryListPopper {...props} /></MemoryRouter>, {});
}
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('SelectResource UI Tests', () => {
  test('should open a dropdown when clicked on view results', () => {
    initRetryListPopper({resources});
    userEvent.click(screen.getByText('View results'));
    expect(screen.getByText(/name1/i)).toBeInTheDocument();
  });

  test('should open the retries tab of the specific resource when clicked on the resource', () => {
    initRetryListPopper({resources});
    userEvent.click(screen.getByText('View results'));
    userEvent.click(screen.getByText('name1'));
    expect(mockHistoryPush).toBeCalled();
  });
  test('should close the arrowPopper when clicked outside the component', () => {
    renderWithProviders(
      <MemoryRouter>
        <div>exterior<RetryListPopper resources={resources} /></div>
      </MemoryRouter>
    );
    userEvent.click(screen.getByText('View results'));
    expect(screen.getByText(/name1/i)).toBeInTheDocument();
    userEvent.click(screen.getByText('exterior'));
    expect(screen.queryByText(/name1/i)).toBeNull();
  });
});

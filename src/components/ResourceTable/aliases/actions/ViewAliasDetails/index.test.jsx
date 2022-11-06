/* global test, expect, describe, beforeEach, jest */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProviders } from '../../../../../test/test-utils';
import metadata from '../../metadata';
import CeligoTable from '../../../../CeligoTable';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

function renderFuntion(data) {
  renderWithProviders(
    <MemoryRouter initialEntries={['/parent']}>
      <Route path="/parent">
        <CeligoTable {...metadata} data={[data]} />
      </Route>
    </MemoryRouter>
  );
  userEvent.click(screen.getByRole('button', { name: /more/i }));
}

describe('UI test cases for view alias details', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should call onclick when parentId is not provided', () => {
    renderFuntion({ _id: 'someid', alias: 'somereqAndResKey', status: 'canceled' });
    const request = screen.getByText('View details');

    userEvent.click(request);
    expect(mockHistoryPush).toHaveBeenCalledWith(
      '/parent/viewdetails/somereqAndResKey'
    );
  });
  test('should call onclick when parentId is provided', () => {
    renderFuntion({ _id: 'someid', alias: 'somereqAndResKey', _parentId: 'someparentId', status: 'canceled' });
    const request = screen.getByText('View details');

    userEvent.click(request);
    expect(mockHistoryPush).toHaveBeenCalledWith(
      '/parent/viewdetails/somereqAndResKey/inherited/someparentId'
    );
  });
});

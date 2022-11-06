/* global test, expect, describe, beforeEach, afterEach, jest */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProviders } from '../../../../../test/test-utils';
import { runServer } from '../../../../../test/api/server';
import metadata from '../../metadata';
import * as mockEnqueSnackbar from '../../../../../hooks/enqueueSnackbar';
import CeligoTable from '../../../../CeligoTable';

const mockHistoryPush = jest.fn();
const enqueueSnackbar = jest.fn();

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

describe('UI test cases for copy alias ', () => {
  runServer();
  beforeEach(() => {
    jest.spyOn(mockEnqueSnackbar, 'default').mockReturnValue([enqueueSnackbar]);
  });
  afterEach(() => {
    enqueueSnackbar.mockClear();
  });
  test('should call onclick', () => {
    renderFuntion({_id: 1, alias: 'somereqAndResKey'});
    const request = screen.getByText('Copy alias');

    userEvent.click(request);
    expect(enqueueSnackbar).toHaveBeenCalledWith({message: 'Alias copied to clipboard.'});
  });
});

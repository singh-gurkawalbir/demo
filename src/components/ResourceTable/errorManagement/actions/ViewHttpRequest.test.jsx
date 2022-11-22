/* global test, expect, describe, beforeEach, jest */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';
import metadata from '../resolvedErrors/metadata';
import CeligoTable from '../../../CeligoTable';
import actions from '../../../../actions';

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

initialStore.getState().data.resources.exports = [{
  _id: '5ea16c600e2fab71928a6152',
  adaptorType: 'NetSuiteExport',
}];

function renderFuntion(actionProps, data, errorType) {
  renderWithProviders(
    <MemoryRouter initialEntries={[`/${errorType}`]}>
      <Route path="/:errorType">
        <CeligoTable
          actionProps={actionProps}
          {...metadata}
          data={[data]}
        />
      </Route>
    </MemoryRouter>,
    {initialStore}
  );
  userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('Error Management HTTP request UI tests ', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const resourceId = '62f7b0d8d07aa55c7643a19f';
  const reqAndResKey = '5590954468519-f6627557287841d8b99ac35ab9461f80-404-GET';
  const errorId = '7587697723';

  test('should redirect to http request page', () => {
    renderFuntion({resourceId}, {reqAndResKey, errorId}, 'resolved');
    const request = screen.getByText('View HTTP request');

    userEvent.click(request);
    expect(mockHistoryPush).toHaveBeenCalledWith('/resolved/details/7587697723/request');
  });
  test('should make dispatch call and redirect to request page', () => {
    renderFuntion({resourceId}, {reqAndResKey, errorId}, 'open');

    const request = screen.getByText('View HTTP request');

    userEvent.click(request);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.patchFilter('openErrors', {
        activeErrorId: '7587697723',
      }
      ));
  });
});

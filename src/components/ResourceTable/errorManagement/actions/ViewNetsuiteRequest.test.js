/* global test, expect, describe, jest */
import React from 'react';
import { screen } from '@testing-library/react';
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
  _id: 'resourceId',
  adaptorType: 'NetSuiteExport',
}];

function renderFuntion(actionProps, data, errorType) {
  renderWithProviders(
    <MemoryRouter initialEntries={[`/${errorType}`]}>
      <Route path="/:errorType">
        <CeligoTable
          actionProps={actionProps}
          {...metadata}
          data={
                       [
                         data,
                       ]
                      }
              />
      </Route>
    </MemoryRouter>,
    {initialStore}
  );
  userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('Error Management Retry UI tests ', () => {
  test('should redirect to request page', () => {
    renderFuntion({resourceId: 'resourceId'}, {reqAndResKey: 'somereqAndResKey', errorId: 'someerrorId'}, 'close');
    const request = screen.getByText('View request');

    userEvent.click(request);
    expect(mockHistoryPush).toHaveBeenCalledWith('/close/details/someerrorId/request');
  });
  test('should make dispatch call and redirect to request page', () => {
    renderFuntion({resourceId: 'resourceId'}, {reqAndResKey: 'somereqAndResKey', errorId: 'someerrorId'}, 'open');
    const request = screen.getByText('View request');

    userEvent.click(request);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.patchFilter('openErrors', {
        activeErrorId: 'someerrorId',
      }
      ));
  });
});

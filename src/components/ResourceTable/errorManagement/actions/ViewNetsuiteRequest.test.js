
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
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

mutateStore(initialStore, draft => {
  draft.data.resources.exports = [{
    _id: 'resourceId',
    adaptorType: 'NetSuiteExport',
  }];
});

async function renderFuntion(actionProps, data, errorType) {
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
  await userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('error management View netsuite request action tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should click on View Request when error type is resolved', async () => {
    await renderFuntion({resourceId: 'resourceId'}, {reqAndResKey: 'somereqAndResKey', errorId: 'someerrorId'}, 'resolved');
    const request = screen.getByText('View request');

    await userEvent.click(request);
    expect(mockHistoryPush).toHaveBeenCalledWith('/resolved/details/someerrorId/request');
  });
  test('should click on View Request when error type is open', async () => {
    await renderFuntion({resourceId: 'resourceId'}, {reqAndResKey: 'somereqAndResKey', errorId: 'someerrorId'}, 'open');
    const request = screen.getByText('View request');

    await userEvent.click(request);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.patchFilter('openErrors', {
        activeErrorId: 'someerrorId',
      }
      ));
  });
});

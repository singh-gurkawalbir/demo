
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import metadata from '../resolvedErrors/metadata';
import CeligoTable from '../../../CeligoTable';

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
  await renderWithProviders(
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

describe('error management edit retry data action tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should redirect to edit Retry page when errot type is close', async () => {
    await renderFuntion({resourceId: 'resourceId'}, {retryDataKey: 'somereqAndResKey', errorId: 'someerrorId'}, 'resolved');
    const editRetry = screen.getByText('Edit retry data');

    expect(editRetry).toBeInTheDocument();
    await userEvent.click(editRetry);
    expect(mockHistoryPush).toHaveBeenCalledWith('/resolved/details/someerrorId/editRetry');
  });
  test('should redirect to edit Retry page and make dispatch call when error type is open', async () => {
    await renderFuntion({resourceId: 'resourceId'}, {retryDataKey: 'somereqAndResKey', errorId: 'someerrorId'}, 'open');
    const editRetry = screen.getByText('Edit retry data');

    expect(editRetry).toBeInTheDocument();
    await userEvent.click(editRetry);
    expect(mockHistoryPush).toHaveBeenCalledWith('/open/details/someerrorId/editRetry');
    expect(mockDispatch).toHaveBeenCalledWith(
      {filter: {activeErrorId: 'someerrorId'}, name: 'openErrors', type: 'PATCH_FILTER'}
    );
  });
  test('should have enable title when flow is disabled', async () => {
    await renderFuntion({resourceId: 'resourceId', isFlowDisabled: true}, {retryDataKey: 'somereqAndResKey', errorId: 'someerrorId'}, 'open');
    const editRetry = screen.getByLabelText('Enable the flow to edit retry data');

    expect(editRetry).toBeInTheDocument();
    expect(editRetry.textContent).toBe('Edit retry data');
  });
});

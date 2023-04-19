
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
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
    _id: '5ea16c600e2fab71928a6152',
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

describe('error Management view error details UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const resourceId = '62f7b0d8d07aa55c7643a19f';
  const errorId = '7587697723';

  test('should display error details page after clicking on View error details', async () => {
    await renderFuntion({resourceId}, {errorId}, 'resolved');
    const errordetails = screen.getByText('View error details');

    await userEvent.click(errordetails);
    expect(mockHistoryPush).toHaveBeenCalledWith('/resolved/details/7587697723/view');
  });

  test('should make dispatch call after clicking on View error details', async () => {
    await renderFuntion({resourceId}, {errorId}, 'open');
    const errordetails = screen.getByText('View error details');

    await userEvent.click(errordetails);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.patchFilter('openErrors', {
        activeErrorId: '7587697723',
      }
      ));
  });
});

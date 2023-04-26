
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import SelectAllErrors from './SelectAllErrors';
import { mutateStore, reduxStore, renderWithProviders } from '../../../../test/test-utils';
import actions from '../../../../actions';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.errorManagement.errorDetails = {
    '5ea16c600e2fab71928a6152': { '621ce7db7988314f51662c09': { resolved: {errors: [{name: 'exports', errorId: '68399487hnfi093i839209', selected: true}]},

    }} };
  draft.session.filters = [];
  draft.session.filters.resolvedErrors = {keyword: 'exports', searchBy: ['name']};
});

const mockDispatch = jest.fn(actions => {
  switch (actions.type) {
    default: initialStore.dispatch(actions);
  }
});

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('uI test cases for selectallerrors', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const flowId = '5ea16c600e2fab71928a6152';
  const resourceId = '621ce7db7988314f51662c09';
  const isResolved = true;
  const actionInProgress = false;

  test('should test allerrors checkbox is working fine', async () => {
    renderWithProviders(<SelectAllErrors flowId={flowId} resourceId={resourceId} isResolved={isResolved} actionInProgress={actionInProgress} />);
    const allerrors = screen.getByRole('checkbox');

    await userEvent.click(allerrors);
    expect(mockDispatch).toHaveBeenCalledWith(actions.errorManager.flowErrorDetails.selectAllInCurrPage({
      flowId: '5ea16c600e2fab71928a6152',
      resourceId: '621ce7db7988314f51662c09',
      checked: true,
      isResolved: true,
    }));
  });
  test('should test allerrors checkbox is unchecked with initial store', async () => {
    renderWithProviders(<SelectAllErrors flowId={flowId} resourceId={resourceId} isResolved={isResolved} actionInProgress={actionInProgress} />, {initialStore});
    const allerrors = screen.getByRole('checkbox');

    await userEvent.click(allerrors);
    expect(mockDispatch).toHaveBeenCalledWith(actions.errorManager.flowErrorDetails.selectAllInCurrPage({
      flowId: '5ea16c600e2fab71928a6152',
      resourceId: '621ce7db7988314f51662c09',
      checked: false,
      isResolved: true,
    }));
  });
});

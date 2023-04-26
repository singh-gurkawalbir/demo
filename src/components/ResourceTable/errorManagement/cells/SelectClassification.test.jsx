
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import SelectClassification from './SelectClassification';
import actions from '../../../../actions';
import { mutateStore, reduxStore, renderWithProviders } from '../../../../test/test-utils';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.errorManagement.metadata.data = {classification: ['Connection', 'Duplicate', 'Governance', 'Intermittent', 'Missing', 'Parse', 'Value']};
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

describe('uI test cases for select classification', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const flowId = '5ea16c600e2fab71928a6152';
  const resourceId = '621ce7db7988314f51662c09';
  const isResolved = 'true';

  test('should display classification dropdown and connection option should be checked when filter key is set to resolved and apply button should work fine', async () => {
    renderWithProviders(<SelectClassification
      flowId={flowId} resourceId={resourceId} isResolved={isResolved} />, {initialStore});
    const checkbox = screen.getAllByRole('button');

    await userEvent.click(checkbox[0]);
    const connection = screen.getAllByRole('checkbox');

    await userEvent.click(connection[1]);

    const apply = screen.getByText('Apply');

    await userEvent.click(apply);
    expect(mockDispatch).toHaveBeenCalledWith(actions.errorManager.flowErrorDetails.request({flowId: '5ea16c600e2fab71928a6152', isResolved: 'true', resourceId: '621ce7db7988314f51662c09'}));
  });
  test('should display classification dropdown and connection option should be checked and cancel button should work fine', async () => {
    renderWithProviders(<SelectClassification
      flowId={flowId} resourceId={resourceId} isResolved={isResolved} />, {initialStore});
    const button = screen.getAllByRole('button');

    await userEvent.click(button[0]);
    const connection = screen.getAllByRole('checkbox');

    await userEvent.click(connection[1]);

    const cancel = screen.getByText('Cancel');

    await userEvent.click(cancel);
    expect(cancel).not.toBeInTheDocument();
  });
  test('should display classification dropdown and connection option should be checked when filter key is set to open and apply button should work fine', async () => {
    renderWithProviders(<SelectClassification
      flowId={flowId} resourceId={resourceId} isResolved={false} />, {initialStore});
    const button = screen.getAllByRole('button');

    await userEvent.click(button[0]);
    const connection = screen.getAllByRole('checkbox');

    await userEvent.click(connection[1]);

    const apply = screen.getByText('Apply');

    await userEvent.click(apply);
    expect(mockDispatch).toHaveBeenCalledWith(actions.errorManager.flowErrorDetails.request({
      flowId: '5ea16c600e2fab71928a6152',
      resourceId: '621ce7db7988314f51662c09',
      isResolved: false,
    }));
  });
  test('should display classification dropdown and connection option should be checked when filter key is set to open  and cancel button should work fine', async () => {
    renderWithProviders(<SelectClassification
      flowId={flowId} resourceId={resourceId} isResolved={false} />, {initialStore});
    const button = screen.getAllByRole('button');

    await userEvent.click(button[0]);
    const connection = screen.getAllByRole('checkbox');

    await userEvent.click(connection[1]);

    const cancel = screen.getByText('Cancel');

    await userEvent.click(cancel);
    expect(cancel).not.toBeInTheDocument();
  });
});

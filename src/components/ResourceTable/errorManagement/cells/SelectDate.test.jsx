
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectSource from './SelectDate';
import actions from '../../../../actions';
import { reduxStore, renderWithProviders } from '../../../../test/test-utils';

const initialStore = reduxStore;
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

describe('uI test cases for select date', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const flowId = '5ea16c600e2fab71928a6152';
  const resourceId = '621ce7db7988314f51662c09';
  const isResolved = 'true';
  const title = 'titletest';
  const filterBy = 'Today';

  test('should test apply button is working fine when date filter is applied and filter key is set to resolved', async () => {
    renderWithProviders(<SelectSource
      flowId={flowId} resourceId={resourceId} isResolved={isResolved} title={title}
      filterBy={filterBy} />);
    const button = screen.getByRole('button');

    await userEvent.click(button);
    const today = screen.getAllByRole('button');

    await userEvent.click(today[1]);
    const apply = screen.getByText('Apply');

    await userEvent.click(apply);
    expect(mockDispatch).toHaveBeenCalledWith(actions.errorManager.flowErrorDetails.request({
      flowId: '5ea16c600e2fab71928a6152',
      resourceId: '621ce7db7988314f51662c09',
      isResolved: 'true',
    }));
  });
  test('should test cancel button is working fine when date filter is applied and filter key is set to resolved', async () => {
    renderWithProviders(<SelectSource
      flowId={flowId} resourceId={resourceId} isResolved={isResolved} title={title}
      filterBy={filterBy} />);
    const button = screen.getByRole('button');

    await userEvent.click(button);
    const today = screen.getAllByRole('button');

    await userEvent.click(today[1]);
    const cancel = screen.getByText('Cancel');

    await userEvent.click(cancel);
    expect(cancel).not.toBeInTheDocument();
  });
  test('should test apply button is working fine when date filter is applied and filter key is set to open', async () => {
    renderWithProviders(<SelectSource
      flowId={flowId} resourceId={resourceId} isResolved={false} title={title}
      filterBy={filterBy} />);
    const button = screen.getByRole('button');

    await userEvent.click(button);
    const today = screen.getAllByRole('button');

    await userEvent.click(today[1]);
    const apply = screen.getByText('Apply');

    await userEvent.click(apply);
    expect(mockDispatch).toHaveBeenCalledWith(actions.errorManager.flowErrorDetails.request({
      flowId: '5ea16c600e2fab71928a6152',
      resourceId: '621ce7db7988314f51662c09',
      isResolved: false,
    }));
  });
  test('should test cancel button is working fine when date filter is applied and filter key is set to resolved.', async () => {
    renderWithProviders(<SelectSource
      flowId={flowId} resourceId={resourceId} isResolved={false} title={title}
      filterBy={filterBy} />);
    const resbutton = screen.getByRole('button');

    await userEvent.click(resbutton);
    const today = screen.getAllByRole('button');

    await userEvent.click(today[1]);
    const cancel = screen.getByText('Cancel');

    await userEvent.click(cancel);
    expect(cancel).not.toBeInTheDocument();
  });
});

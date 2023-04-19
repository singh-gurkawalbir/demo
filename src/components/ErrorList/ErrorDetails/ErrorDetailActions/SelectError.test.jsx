
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import SelectError from './SelectError';
import actions from '../../../../actions';
import { reduxStore, renderWithProviders } from '../../../../test/test-utils';

const initialStore = reduxStore;

const mockDispatch = jest.fn(actions => {
  switch (actions.type) {
    default: initialStore.dispatch(actions);
  }
});

jest.mock('../../../icons/CheckboxUnselectedIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/CheckboxUnselectedIcon'),
  default: () => (
    <div>CheckboxUnselectedIcon</div>
  ),
}));

jest.mock('../../../icons/CheckboxSelectedIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/CheckboxSelectedIcon'),
  default: () => (
    <div>CheckboxSelectedIcon</div>
  ),
}));
jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('uI test cases for select error', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const flowId = '5ea16c600e2fab71928a6152';
  const resourceId = '621ce7db7988314f51662c09';
  const errorId = ['5ea16c789ab71928a617489'];

  test('should test error checkbox is checked', async () => {
    const error = {errorId, selected: false};

    renderWithProviders(<SelectError
      flowId={flowId} resourceId={resourceId} error={error} isResolved
      actionInProgress={false} label="Apply" tooltip="TooltipText" />);
    const allerrors = screen.getByRole('checkbox');

    await userEvent.click(allerrors);
    expect(mockDispatch).toHaveBeenCalledWith(actions.errorManager.flowErrorDetails.selectErrors({
      flowId: '5ea16c600e2fab71928a6152',
      resourceId: '621ce7db7988314f51662c09',
      isResolved: true,
      errorIds: [['5ea16c789ab71928a617489']],
      checked: true,
    }));
  });
  test('should test error checkbox is unselected', async () => {
    const error = {errorId, selected: true};

    renderWithProviders(<SelectError
      flowId={flowId} resourceId={resourceId} error={error} isResolved
      actionInProgress={false} label="Cancel" tooltip="TooltipText" />);
    const allerrors = screen.getByRole('checkbox');

    await userEvent.click(allerrors);
    expect(mockDispatch).toHaveBeenCalledWith(actions.errorManager.flowErrorDetails.selectErrors({
      flowId: '5ea16c600e2fab71928a6152',
      resourceId: '621ce7db7988314f51662c09',
      isResolved: true,
      errorIds: [['5ea16c789ab71928a617489']],
      checked: false,
    }));
  });
  test('should test tooltip text', async () => {
    const error = {errorId, selected: false};

    renderWithProviders(<SelectError
      flowId={flowId} resourceId={resourceId} error={error} isResolved
      actionInProgress={false} label="Cancel" tooltip="TooltipText" />);
    const buttonRef = screen.getByText('CheckboxUnselectedIcon');

    userEvent.hover(buttonRef);

    await waitFor(() => {
      const tooltipRef = screen.getByRole('tooltip');

      expect(tooltipRef).toBeInTheDocument();
    });
    expect(screen.getByText('TooltipText')).toBeInTheDocument();
  });
  test('should test tooltip when no tooltip text is provided', async () => {
    const error = {errorId, selected: false};

    renderWithProviders(<SelectError
      flowId={flowId} resourceId={flowId} error={error} isResolved
      actionInProgress={false} label="Cancel" />);
    const buttonRef = screen.getByText('CheckboxUnselectedIcon');

    userEvent.hover(buttonRef);

    await waitFor(() => {
      const tooltipRef = screen.getByRole('tooltip');

      expect(tooltipRef).toBeInTheDocument();
    });
    expect(screen.getByText('Selected errors are added to a batch, on which you can perform bulk retry and resolve actions.')).toBeInTheDocument();
  });
});

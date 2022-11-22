/* global test, expect, describe, jest, afterEach */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../../test/test-utils';
import metadata from '../resolvedErrors/metadata';
import CeligoTable from '../../../CeligoTable';
import actions from '../../../../actions';
import { ConfirmDialogProvider } from '../../../ConfirmDialog';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

function renderFuntion(actionProps, data) {
  renderWithProviders(
    <ConfirmDialogProvider>
      <MemoryRouter>
        <CeligoTable
          actionProps={actionProps}
          {...metadata}
          data={[data]}
        />
      </MemoryRouter>
    </ConfirmDialogProvider>
  );
  userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('Error management retry action tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show "Enable the flow to retry" message when flow is disabled', () => {
    renderFuntion({isFlowDisabled: true}, {retryDataKey: 'someKey', errorId: 'errorId'});
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    const retry = screen.getByTitle('Enable the flow to retry');

    expect(retry).toBeInTheDocument();
    expect(retry.textContent).toBe('Retry');
  });
  test('should make dispatch call for retry on clicking retry button', () => {
    renderFuntion({
      isFlowDisabled: false,
      isResolved: false,
      flowId: 'someflowId',
      resourceId: 'someresourceId',
    }, {retryDataKey: 'someKey', errorId: 'errorId'});
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    const retry = screen.getByText('Retry');

    expect(retry).toBeInTheDocument();
    userEvent.click(retry);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.errorManager.flowErrorDetails.retry(
        {
          flowId: 'someflowId',
          resourceId: 'someresourceId',
          retryIds: ['someKey'],
          isResolved: false,
        }
      )
    );
  });
  test('should show "Enable the flow to retry" message when flow is disabled', () => {
    renderFuntion({
      isFlowDisabled: false,
      isResolved: true,
      flowId: 'someflowId',
      resourceId: 'someresourceId',
    }, {retryDataKey: 'someKey', errorId: 'errorId'});
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    const retry = screen.getByText('Retry');

    expect(retry).toBeInTheDocument();
    userEvent.click(retry);
    expect(screen.getByText('Confirm retry')).toBeInTheDocument();
    userEvent.click(screen.getByText('Retry'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.errorManager.flowErrorDetails.retry(
        {
          flowId: 'someflowId',
          resourceId: 'someresourceId',
          retryIds: ['someKey'],
          isResolved: true,
        }
      )
    );
  });
});

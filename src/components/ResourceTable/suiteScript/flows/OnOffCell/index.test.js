/* global test, expect, jest,describe */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore } from '../../../../../test/test-utils';
import { ConfirmDialogProvider } from '../../../../ConfirmDialog';
import actions from '../../../../../actions';
import OnOffCell from './index';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

initialStore.getState().user.preferences = {
  defaultAShareId: 'own',
};

describe('On/Off cell UI tests', () => {
  test('should disble the flow via click', () => {
    renderWithProviders(
      <ConfirmDialogProvider>
        <OnOffCell ssLinkedConnectionId="ssLinkedConnectionId" flow={{_id: 'FlowId', _integrationId: 'integrationId'}} />
      </ConfirmDialogProvider>, {initialStore});
    const checkbox = screen.getByRole('checkbox');

    userEvent.click(checkbox);
    const yesButton = screen.getByText('Yes');

    expect(yesButton).toBeInTheDocument();
    userEvent.click(yesButton);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.suiteScript.flow.isOnOffActionInprogress({onOffInProgress: true, ssLinkedConnectionId: 'ssLinkedConnectionId', _id: 'FlowId'})
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.suiteScript.flow.disable({integrationId: 'integrationId', ssLinkedConnectionId: 'ssLinkedConnectionId', _id: 'FlowId'})
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should enable the flow via click', () => {
    renderWithProviders(
      <ConfirmDialogProvider>
        <OnOffCell ssLinkedConnectionId="ssLinkedConnectionId" flow={{_id: 'FlowId', _integrationId: 'integrationId', disabled: true}} />
      </ConfirmDialogProvider>, {initialStore});
    const checkbox = screen.getByRole('checkbox');

    userEvent.click(checkbox);
    const yesButton = screen.getByText('Yes');

    expect(yesButton).toBeInTheDocument();
    userEvent.click(yesButton);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.suiteScript.flow.isOnOffActionInprogress({onOffInProgress: true, ssLinkedConnectionId: 'ssLinkedConnectionId', _id: 'FlowId'})
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.suiteScript.flow.enable({integrationId: 'integrationId', ssLinkedConnectionId: 'ssLinkedConnectionId', _id: 'FlowId'})
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

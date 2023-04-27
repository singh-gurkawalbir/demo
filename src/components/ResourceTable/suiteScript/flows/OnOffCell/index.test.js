
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import { ConfirmDialogProvider } from '../../../../ConfirmDialog';
import actions from '../../../../../actions';
import OnOffCell from './index';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.user.preferences = {
    defaultAShareId: 'own',
  };
});

describe('on/Off cell UI tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should disable the flow via click', async () => {
    renderWithProviders(
      <ConfirmDialogProvider>
        <OnOffCell ssLinkedConnectionId="ssLinkedConnectionId" flow={{_id: 'FlowId', _integrationId: 'integrationId'}} />
      </ConfirmDialogProvider>, {initialStore});
    const checkbox = screen.getByRole('checkbox');

    await userEvent.click(checkbox);
    const yesButton = screen.getByText('Yes');

    expect(yesButton).toBeInTheDocument();
    await userEvent.click(yesButton);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.suiteScript.flow.isOnOffActionInprogress({onOffInProgress: true, ssLinkedConnectionId: 'ssLinkedConnectionId', _id: 'FlowId'})
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.suiteScript.flow.disable({integrationId: 'integrationId', ssLinkedConnectionId: 'ssLinkedConnectionId', _id: 'FlowId'})
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should enable the flow via click', async () => {
    renderWithProviders(
      <ConfirmDialogProvider>
        <OnOffCell ssLinkedConnectionId="ssLinkedConnectionId" flow={{_id: 'FlowId', _integrationId: 'integrationId', disabled: true}} />
      </ConfirmDialogProvider>, {initialStore});
    const checkbox = screen.getByRole('checkbox');

    await userEvent.click(checkbox);
    const yesButton = screen.getByText('Yes');

    expect(yesButton).toBeInTheDocument();
    await userEvent.click(yesButton);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.suiteScript.flow.isOnOffActionInprogress({onOffInProgress: true, ssLinkedConnectionId: 'ssLinkedConnectionId', _id: 'FlowId'})
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.suiteScript.flow.enable({integrationId: 'integrationId', ssLinkedConnectionId: 'ssLinkedConnectionId', _id: 'FlowId'})
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

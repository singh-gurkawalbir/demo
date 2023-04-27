
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import { ConfirmDialogProvider } from '../../../../ConfirmDialog';
import actions from '../../../../../actions';
import DeleteCell from './index';

const mockDispatch = jest.fn();
const mockHistoryReplace = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));
const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.user.preferences = {
    defaultAShareId: 'own',
  };
});

function renderFunction(isFlowBuilderView = false, initialStore = null) {
  renderWithProviders(
    <ConfirmDialogProvider>
      <MemoryRouter>
        <DeleteCell ssLinkedConnectionId="ssLinkedConnectionId" flow={{_id: 'flowId', _integrationId: '_integrationId'}} isFlowBuilderView={isFlowBuilderView} />
      </MemoryRouter>
    </ConfirmDialogProvider>, {initialStore});
}

describe('suite script DeleteCell ui test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should check that the button is disabled when ManageLevelUser', () => {
    renderFunction();
    const deleteButton = screen.getByRole('button');
    const classText = deleteButton.getAttribute('class');

    expect(classText.indexOf('disable')).toBeGreaterThan(-1);
  });
  test('should make the dispatch call for deleting the flow', async () => {
    renderFunction(false, initialStore);
    const deleteButton = screen.getByRole('button');

    await userEvent.click(deleteButton);
    expect(screen.getByText('Confirm delete')).toBeInTheDocument();
    const del = screen.getByRole('button', { name: 'Delete' });

    expect(del).toBeInTheDocument();

    await userEvent.click(del);
    expect(mockDispatch).toHaveBeenCalledWith(actions.suiteScript.flow.delete({
      ssLinkedConnectionId: 'ssLinkedConnectionId',
      integrationId: '_integrationId',
      _id: 'flowId',
    }
    ));
  });
  test('should redirect to integration page after deleting flow', async () => {
    renderFunction(true, initialStore);
    const deleteButton = screen.getByRole('button');

    await userEvent.click(deleteButton);
    expect(screen.getByText('Confirm delete')).toBeInTheDocument();
    const del = screen.getByRole('button', { name: 'Delete' });

    expect(del).toBeInTheDocument();

    await userEvent.click(del);
    expect(mockDispatch).toHaveBeenCalledWith(actions.suiteScript.flow.delete({
      ssLinkedConnectionId: 'ssLinkedConnectionId',
      integrationId: '_integrationId',
      _id: 'flowId',
    }
    ));
    expect(mockHistoryReplace).toHaveBeenCalledWith('/suitescript/ssLinkedConnectionId/integrations/_integrationId');
  });
});


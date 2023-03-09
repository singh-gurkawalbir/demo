
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import actions from '../../../../../actions';
import StatusCell from './index';
import { getCreatedStore } from '../../../../../store';

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
  draft.user.preferences = {defaultAShareId: 'own'};
});

function initStatusCell(tileData = null, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <StatusCell tile={tileData} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe("home Tile's Status cell ui tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should show Success when no connection is offline', async () => {
    initStatusCell({_connectorId: 'some_connectorId', _integrationId: '2_integrationId'});
    expect(screen.getByText('Success')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Success'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.patchFilter('jobs', {
        status: 'all',
      })
    );
  });
  test('should show ConnectionDown because of offline connection', async () => {
    initStatusCell({name: 'someName', _connectorId: 'some_connectorId', _integrationId: '2_integrationId', offlineConnections: [1], _templateId: '6013fcd90f0ac62d08bb6dae'});

    expect(screen.getByText('Success')).toBeInTheDocument();
    const connectionDowmMsg = screen.getByText('1 connection down');

    expect(connectionDowmMsg).toBeInTheDocument();
    await userEvent.click(connectionDowmMsg);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/someName/2_integrationId/connections');
  });
  test('should click on error status', async () => {
    initStatusCell({status: 'has_errors', numError: 2, name: 'someName', _connectorId: 'some_connectorId', _integrationId: '2_integrationId', offlineConnections: [1], _templateId: '6013fcd90f0ac62d08bb6dae'});

    expect(screen.getByText('2 errors')).toBeInTheDocument();
    const connectionDowmMsg = screen.getByText('1 connection down');

    expect(connectionDowmMsg).toBeInTheDocument();
    await userEvent.click(screen.getByText('2 errors'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/someName/2_integrationId/dashboard');
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.patchFilter('jobs', {
        status: 'error',
      })
    );
  });
  test('should click status pending setup', async () => {
    initStatusCell({status: 'is_pending_setup', name: 'someName', _connectorId: 'some_connectorId', _integrationId: '2_integrationId', offlineConnections: [1], _templateId: '6013fcd90f0ac62d08bb6dae'});
    const setUpbutton = screen.getByText('Continue setup', {exact: false});

    expect(setUpbutton).toBeInTheDocument();
    await userEvent.click(setUpbutton);

    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/someName/2_integrationId/dashboard');
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  test('should redirect to setUp page on cliking connection down for 2.0 user', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.user.profile = {
        useErrMgtTwoDotZero: true,
      };
    });

    initStatusCell({status: 'is_pending_setup', name: 'someName', _connectorId: 'some_connectorId', _integrationId: '2_integrationId', offlineConnections: [1], _templateId: '6013fcd90f0ac62d08bb6dae'}, initialStore);
    const setUpbutton = screen.getByText('Continue setup', {exact: false});

    expect(setUpbutton).toBeInTheDocument();
    await userEvent.click(setUpbutton);

    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/someName/2_integrationId/setup');
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});

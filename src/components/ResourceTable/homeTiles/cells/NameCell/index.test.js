
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import NameCell from './index';
import actions from '../../../../../actions';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

const end = new Date();

end.setMonth(end.getMonth() - 2);

mutateStore(initialStore, draft => {
  draft.user.preferences = {defaultAShareId: 'own'};

  draft.user.org.accounts = [
    {_id: 'own',
      ownerUser: {licenses: [
        {_integrationId: '2_integrationId', _connectorId: 'some_connectorId', resumable: false, trialEndDate: end},
      ]}}];

  draft.data.resources.connections = [{
    _id: 'ssLinkedConnectionId2',
    netsuite: {account: 'accountName'},
  }];
});

function initNameCell(tileData = null, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <NameCell tile={tileData} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe("homeTile's NameCell UI tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show Success when no props are provided', async () => {
    initNameCell({name: 'tileName', _connectorId: 'some_connectorId', _integrationId: '2_integrationId'});
    const name = screen.getByText('tileName');

    expect(name).toBeInTheDocument();
    expect(name).toHaveAttribute('href', '/integrationapps/tileName/2_integrationId');
    await userEvent.click(name);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
  test('should show monitor only as access level', () => {
    initNameCell({name: 'tileName', _integrationId: '2_integrationId', integration: {permissions: {accessLevel: 'monitor'}}});
    const name = screen.getByText('tileName');

    expect(name).toBeInTheDocument();
    expect(name).toHaveAttribute('href', '/integrations/2_integrationId');

    expect(screen.getByText('Monitor only')).toBeInTheDocument();
  });
  test('should show link for the suite script integration name', async () => {
    initNameCell({name: 'tileName', ssLinkedConnectionId: 'ssLinkedConnectionId', _integrationId: '2_integrationId'}, initialStore);

    const name = screen.getByText('tileName');

    expect(name).toBeInTheDocument();
    expect(name).toHaveAttribute('href', '/suitescript/ssLinkedConnectionId/integrations/2_integrationId');
    await userEvent.click(name);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
  test('should show the integration tag', async () => {
    initNameCell({name: 'tileName', ssLinkedConnectionId: 'ssLinkedConnectionId2', _integrationId: '2_integrationId'}, initialStore);
    const name = screen.getByText('tileName');

    expect(name).toBeInTheDocument();
    expect(name).toHaveAttribute('href', '/suitescript/ssLinkedConnectionId2/integrations/2_integrationId');
    await userEvent.click(name);
    expect(screen.getByText('NS Account #accountName')).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
  });
  test('should show monitor Level tag and integration tag from tile data', () => {
    initNameCell({tag: 'someTag', name: 'tileName', _integrationId: '2_integrationId', integration: {permissions: {accessLevel: 'monitor'}}}, initialStore);
    const name = screen.getByText('tileName');

    expect(name).toBeInTheDocument();
    expect(name).toHaveAttribute('href', '/integrations/2_integrationId');

    expect(screen.getByText('Monitor only')).toBeInTheDocument();
    expect(screen.getByText('someTag')).toBeInTheDocument();
  });
  test('should show monitor Level tag and integration tag from tile datafe', async () => {
    initNameCell({tag: 'someTag', name: 'tileName', _integrationId: '2_integrationId', _connectorId: 'some_connectorId', supportsChild: true}, initialStore);
    const name = screen.getByText('tileName');

    expect(name).toBeInTheDocument();
    expect(name).toHaveAttribute('href', '/integrationapps/tileName/2_integrationId');
    await userEvent.click(name);
    expect(mockDispatch).toHaveBeenCalledWith(actions.resource.integrations.isTileClick('2_integrationId', true));
  });
});

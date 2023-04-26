
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../../test/test-utils';
import actions from '../../../../../../actions';
import metadata from '../../../metadata';
import CeligoTable from '../../../../../CeligoTable';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

const end = new Date();
const notExpired = new Date();

end.setMonth(end.getMonth() - 2);
notExpired.setMonth(notExpired.getMonth() + 2);

mutateStore(initialStore, draft => {
  draft.user.preferences = {defaultAShareId: 'own'};

  draft.user.org.accounts = [
    {_id: 'own',
      ownerUser: {licenses: [
        {_integrationId: '1_integrationId', _connectorId: 'some_connectorId', resumable: true, trialEndDate: end},
        {_integrationId: '4_integrationId', _connectorId: 'some_connectorId', resumable: false, trialEndDate: notExpired},
        {_integrationId: '3_integrationId', _connectorId: 'some_connectorId', resumable: true, expires: end},
        {_integrationId: '5_integrationId', _connectorId: 'some_connectorId', resumable: true, trialEndDate: end},
        {_integrationId: '2_integrationId', _connectorId: 'some_connectorId', resumable: false, expires: end, _id: 'someLicenseId'},
      ],
      },
    }];

  draft.data.resources.integrations = [{
    _id: '5_integrationId',
    installSteps: [1],
  }];
});

function initHomeTiles(data = {}, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={[data]} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe("homeTile's Renew actions UI test", () => {
  test('should verify the Row action setup is pending no connector Id', async () => {
    const data = {name: 'tileName', _connectorId: 'some_connectorId', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', supportsMultiStore: true, _id: 'modeText'};

    initHomeTiles(data, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));

    expect(screen.getByText('Renew subscription')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Renew subscription'));

    expect(mockDispatch).toHaveBeenCalledWith(actions.license.requestUpdate('connectorRenewal', {connectorId: 'some_connectorId', licenseId: 'someLicenseId'}));
  });
  test('should not show renew option because trial not expired', async () => {
    const data = {name: 'tileName', _connectorId: 'some_connectorId', pinned: true, status: 'is_pending_setup', _integrationId: '4_integrationId', supportsMultiStore: true, _id: 'modeText'};

    initHomeTiles(data, initialStore);

    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.queryByText('Renew subscription')).not.toBeInTheDocument();
  });
  test('should verify the Row actieron setupjb is pending no connector Id', async () => {
    const data = {name: 'tileName', _connectorId: 'some_connectorId', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', supportsMultiStore: true, _id: 'modeText'};

    initHomeTiles(data);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.queryByText('Renew subscription')).not.toBeInTheDocument();
  });
  test('should not show access when tile is single and resumable', async () => {
    const data = {name: 'tileName', _connectorId: 'some_connectorId', pinned: true, status: 'is_pending_setup', _integrationId: '3_integrationId', supportsMultiStore: true, _id: 'modeText'};

    initHomeTiles(data, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.queryByText('Renew subscription')).not.toBeInTheDocument();
  });
  test('should not show access when trial is over', async () => {
    const data = {name: 'tileName', _connectorId: 'some_connectorId', pinned: true, status: 'is_pending_setup', _integrationId: '1_integrationId', supportsMultiStore: true, _id: 'modeText'};

    initHomeTiles(data, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.queryByText('Renew subscription')).not.toBeInTheDocument();
  });

  test('should not show access when unetgrations is v2 and resumable', async () => {
    const data = {name: 'tileName', _connectorId: 'some_connectorId', pinned: true, _integrationId: '5_integrationId', supportsMultiStore: true, _id: 'modeText'};

    initHomeTiles(data, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.queryByText('Renew subscription')).not.toBeInTheDocument();
  });
  test('should not show access when unetgrations is v1 and resumable and not expired', async () => {
    const data = {name: 'tileName', _connectorId: 'some_connectorId', pinned: true, _integrationId: '3_integrationId', supportsMultiStore: true, _id: 'modeText'};

    initHomeTiles(data, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.queryByText('Renew subscription')).not.toBeInTheDocument();
  });
});

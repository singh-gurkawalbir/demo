
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore} from '../../../../../test/test-utils';
import CeligoTable from '../../../../CeligoTable';
import metadata from '../../metadata';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    location: {pathname: '/integrations/603ce75ac4fec33283691f43/flows'},
  }),
}));

const resource = {
  _id: '5d95f7d1795b356dfcb5d6c4',
  _integrationId: '5d95f77174836b1acdcd2788',
  _connectorId: '58777a2b1008fb325e6c0953',
};

const actionProps = {
  resourceType: 'flows',
  childId: 'someChildID',
  flowAttributes: {'5d95f7d1795b356dfcb5d6c4': {
    isDataLoader: false,
    disableRunFlow: true,
    allowSchedule: true,
    type: 'Scheduled',
    supportsSettings: true,
  }},
};

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.resources.integrations = [{
    _id: 'someIntegrationID',
    name: 'Production',
    _connectorId: 'some_connectorId',
  }];
  draft.data.resources.flows = [{
    _id: '5d95f7d1795b356dfcb5d6c4',
    _integrationId: '5e9bf6c9edd8fa3230149fbd',
    _exportId: '5ea16cd30e2fab71928a6166',
  }];

  draft.data.resources.exports = [{
    _id: '5ea16cd30e2fab71928a6166',
    type: 'simple',
  }];
});

async function initflowTable(actionProps = {}, res = resource, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <CeligoTable
        actionProps={actionProps}
        {...metadata}
        data={[res]} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
  await userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('edit action for flow Ui test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should redirect to flow builder page for normal flow', async () => {
    await initflowTable(actionProps, {...resource, _connectorId: null, _integrationId: null});
    await userEvent.click(screen.getByText('Edit flow'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/none/flowBuilder/5d95f7d1795b356dfcb5d6c4');
  });
  test('should redirect to flow builder page for inetgration app flow', async () => {
    await initflowTable(actionProps, {...resource, _id: '5d95f7d1795b356dfcb5d6c5', _connectorId: 'someConnetorID', _integrationId: 'someIntegrationID'}, initialStore);
    await userEvent.click(screen.getByText('Edit flow'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/Production/someIntegrationID/child/someChildID/flowBuilder/5d95f7d1795b356dfcb5d6c5');
  });
  test('should redirect to data loader page of data loader flow', async () => {
    await initflowTable(actionProps, {...resource, _connectorId: 'someConnetorID', _integrationId: 'someIntegrationID'}, initialStore);
    await userEvent.click(screen.getByText('Edit flow'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/Production/someIntegrationID/child/someChildID/dataLoader/5d95f7d1795b356dfcb5d6c4');
  });
});

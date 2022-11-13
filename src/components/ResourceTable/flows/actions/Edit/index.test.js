/* global describe, test,expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore} from '../../../../../test/test-utils';
import CeligoTable from '../../../../CeligoTable';
import metadata from '../../metadata';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    location: {pathname: '/parentUrl'},
  }),
}));

const resourcE = {
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

initialStore.getState().data.resources.integrations = [{
  _id: 'someIntegrationID',
  name: 'Production',
  _connectorId: 'some_connectorId',
}];
initialStore.getState().data.resources.flows = [{
  _id: '5d95f7d1795b356dfcb5d6c4',
  _integrationId: '5e9bf6c9edd8fa3230149fbd',
  _exportId: '5ea16cd30e2fab71928a6166',
}];

initialStore.getState().data.resources.exports = [{
  _id: '5ea16cd30e2fab71928a6166',
  type: 'simple',
}];

async function initflowTable(actionProps = {}, resource = resourcE, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <CeligoTable
        actionProps={actionProps}
        {...metadata}
        data={[resource]} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Edit action for flow Ui test cases', () => {
  test('should redirect to flow builder page for normal flow', () => {
    initflowTable(actionProps, {...resourcE, _connectorId: null, _integrationId: null});
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    userEvent.click(screen.getByText('Edit flow'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/none/flowBuilder/5d95f7d1795b356dfcb5d6c4');
  });
  test('should redirect to flow builder page for inetgration app flow', () => {
    initflowTable(actionProps, {...resourcE, _id: '5d95f7d1795b356dfcb5d6c5', _connectorId: 'someConnetorID', _integrationId: 'someIntegrationID'}, initialStore);
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    userEvent.click(screen.getByText('Edit flow'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/Production/someIntegrationID/child/someChildID/flowBuilder/5d95f7d1795b356dfcb5d6c5');
  });
  test('should redirect to data loader page of data loader flow', () => {
    initflowTable(actionProps, {...resourcE, _connectorId: 'someConnetorID', _integrationId: 'someIntegrationID'}, initialStore);
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    userEvent.click(screen.getByText('Edit flow'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/Production/someIntegrationID/child/someChildID/dataLoader/5d95f7d1795b356dfcb5d6c4');
  });
});

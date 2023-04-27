
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore} from '../../../../../test/test-utils';
import CeligoTable from '../../../../CeligoTable';
import actions from '../../../../../actions';
import metadata from '../../metadata';
import { ConfirmDialogProvider } from '../../../../ConfirmDialog';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const resource = {
  _id: '5d95f7d1795b356dfcb5d6c4',
  lastModified: '2022-05-03T00:54:08.540Z',
  name: 'Name of the flow',
  _integrationId: '5d95f77174836b1acdcd2788',
  _connectorId: '58777a2b1008fb325e6c0953',
};

const actionProps = {
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
  draft.user.preferences = {
    defaultAShareId: 'own',
  };
});

async function initflowTable(actionProps = {}, res = resource, initialStore = null) {
  const ui = (
    <ConfirmDialogProvider>
      <MemoryRouter>
        <CeligoTable
          actionProps={actionProps}
          {...metadata}
          data={[res]} />
      </MemoryRouter>
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('detach flow action UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should not show detach flow option because of permissions', async () => {
    initflowTable({...actionProps, resourceType: 'flows'}, {...resource, _connectorId: null});
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    expect(screen.queryByText('Detach flow')).not.toBeInTheDocument();
  });
  test('should click on detach button and dispatch call should be made for detaching', async () => {
    initflowTable({...actionProps, resourceType: 'flows'}, {...resource, _connectorId: null}, initialStore);
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    await userEvent.click(screen.getByText('Detach flow'));
    await userEvent.click(screen.getByText('Detach'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.resource.patchAndCommitStaged('flows', '5d95f7d1795b356dfcb5d6c4',
        [{op: 'replace',
          path: '/_integrationId',
          value: undefined,
        }])
    );
  });
  test('should click on detach button when flow was part of a flow group', async () => {
    initflowTable({...actionProps, resourceType: 'flows'}, {...resource, _connectorId: null, _flowGroupingId: 'someflowGroupId'}, initialStore);
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    await userEvent.click(screen.getByText('Detach flow'));
    await userEvent.click(screen.getByText('Detach'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.resource.patchAndCommitStaged('flows', '5d95f7d1795b356dfcb5d6c4',
        [
          {op: 'replace',
            path: '/_integrationId',
            value: undefined,
          },
          {
            op: 'replace',
            path: '/_flowGroupingId',
            value: undefined,
          },
        ])
    );
  });
});

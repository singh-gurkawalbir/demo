import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import metadata from '../metadata';
import ErrorContent from '../../../ErrorContent';
import * as mockEnqueSnackbar from '../../../../hooks/enqueueSnackbar';
import CeligoTable from '../../../CeligoTable';

const enqueueSnackbar = jest.fn();

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.user = {
    preferences: {
      defaultAShareId: 'own',
    },
    profile: {
      _id: '5cadc8b42b10347a2708bf29',
      name: 'Nametest',
      email: 'test@celigo.com',
    },
    org: {
      users: [
        {
          _id: '5f7011605b2e3244837309f9',
          accepted: true,
          accessLevel: 'monitor',
          integrationAccessLevel: [
            {
              _integrationId: '5e44efa28015c9464272256f',
              accessLevel: 'manage',
            },
          ],
          sharedWithUser: {
            _id: '5f7011605b2e3244837309f9',
            email: 'test+3@celigo.com',
            name: 'Nametest2',
          },
        },
      ],
      accounts: [
        {
          _id: 'own',
          accessLevel: 'owner',
        },
      ],
    },
  };
});

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../../../utils/string', () => ({
  ...jest.requireActual('../../../../utils/string'),
  generateId: () => (
    'randomvalue'
  ),
}));
async function renderFuntion(data) {
  renderWithProviders(
    <MemoryRouter initialEntries={[{pathname: `/integrations/${data.integrationId}`}]}>
      <Route path="/integrations/:integrationId">
        <CeligoTable
          {...metadata}
          data={[data]}
        />
      </Route>
    </MemoryRouter>, {initialStore}
  );
  await userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('uI test cases for revert to revision', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(mockEnqueSnackbar, 'default').mockReturnValue([enqueueSnackbar]);
  });
  afterEach(() => {
    enqueueSnackbar.mockClear();
  });
  test('redirect to revert revision URL when clicked on revert to this revision button', async () => {
    await renderFuntion({_id: '5cadc8b42b1034709483790', _createdByUserId: '5f7011605b2e3244837309f9', status: 'completed', integrationId: '5e44efa28015c9464272256f', type: 'snapshot'});
    const revertrevisionButton = screen.getByText('Revert to this revision');

    await userEvent.click(revertrevisionButton);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/5e44efa28015c9464272256f/revert/randomvalue/open/toBefore/revision/5cadc8b42b1034709483790');
  });

  test('should display a prompt when the status is in progress', async () => {
    mutateStore(initialStore, draft => {
      draft.data.revisions = {
        '5e44ee816fb284424f693b43': {
          data: [{
            _id: '5cadc8b42b1034709483790',
            type: 'pull',
            status: 'inprogress',
          }],
        }};
    });
    await renderFuntion({_id: '5cadc8b42b1034709483790', _createdByUserId: '5f7011605b2e3244837309f9', status: 'completed', integrationId: '5e44ee816fb284424f693b43', type: 'snapshot'});
    const revertrevisionButton = screen.getByText('Revert to this revision');

    await userEvent.click(revertrevisionButton);
    expect(enqueueSnackbar).toHaveBeenCalledWith({message: <ErrorContent error="You have a pull, snapshot, or revert in progress." />, variant: 'error'});
  });
});

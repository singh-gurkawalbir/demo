/* global test, expect, describe, beforeEach, afterEach, jest */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';
import metadata from '../metadata';
import ErrorContent from '../../../ErrorContent';
import * as mockEnqueSnackbar from '../../../../hooks/enqueueSnackbar';
import CeligoTable from '../../../CeligoTable';

const enqueueSnackbar = jest.fn();

const initialStore = reduxStore;

initialStore.getState().user = {
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

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('nanoid', () => ({
  ...jest.requireActual('nanoid'),
  nanoid: () => (
    'randomvalue'
  ),
}));
function renderFuntion(data) {
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
  userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('UI tests for revert to before revision', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(mockEnqueSnackbar, 'default').mockReturnValue([enqueueSnackbar]);
  });
  afterEach(() => {
    enqueueSnackbar.mockClear();
  });
  test('should push revertbefore URL when status is set to completed', () => {
    renderFuntion({_id: 'somereqAndResKey', _createdByUserId: '5f7011605b2e3244837309f9', status: 'completed', integrationId: '5e44ee816fb284424f693b43', type: 'pull'});
    const revertBeforeButton = screen.getByText('Revert to before this revision');

    userEvent.click(revertBeforeButton);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/5e44ee816fb284424f693b43/revert/randomvalue/open/toBefore/revision/somereqAndResKey');
  });

  test('should display a prompt when the status is in progress', () => {
    initialStore.getState().data.revisions = {
      '5e44ee816fb284424f693b43': {
        data: [{
          _id: '5cadc8b42b1034709483790',
          type: 'pull',
          status: 'inprogress',
        }],
      }};
    renderFuntion({_id: '5cadc8b42b1034709483790', _createdByUserId: '5f7011605b2e3244837309f9', status: 'completed', integrationId: '5e44ee816fb284424f693b43', type: 'pull'});
    const revertBeforeButton = screen.getByText('Revert to before this revision');

    userEvent.click(revertBeforeButton);
    expect(enqueueSnackbar).toHaveBeenCalledWith({message: <ErrorContent error="You have a pull, snapshot, or revert in progress." />, variant: 'error'});
  });
});

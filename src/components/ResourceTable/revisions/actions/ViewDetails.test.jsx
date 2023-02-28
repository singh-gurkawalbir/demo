
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import metadata from '../metadata';
import CeligoTable from '../../../CeligoTable';

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

describe('uI test cases for view details', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should push viewDetails URL when status is set to canceled', async () => {
    await renderFuntion({_id: '6368de0bec4c35664453023b', _createdByUserId: '5f7011605b2e3244837309f9', status: 'canceled', integrationId: '5e44efa28015c9464272256f'});
    const viewdetailsButton = screen.getByText('View details');

    await userEvent.click(viewdetailsButton);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/5e44efa28015c9464272256f/view/6368de0bec4c35664453023b/mode/details');
  });
});

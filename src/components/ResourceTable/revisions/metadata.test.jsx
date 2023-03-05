
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mutateStore, reduxStore, renderWithProviders } from '../../../test/test-utils';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';

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

jest.mock('../../CeligoTimeAgo', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTimeAgo'),
  default: ({ date }) => <span>{date}</span>,
}));

function initImports(data) {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: `/integrations/${data._integrationId}`}]}>
      <Route path="/integrations/:integrationId">
        <CeligoTable
          {...metadata} data={[data]} />
      </Route>
    </MemoryRouter>
  );

  renderWithProviders(ui, { initialStore });
}
describe('test suite for revisions metadata', () => {
  const date = new Date().toUTCString();

  test('should render the table accordingly for rowactions when status is inprogress and type is revert', async () => {
    initImports({
      _id: 'someid',
      _createdByUserId: '5f7011605b2e3244837309f9',
      status: 'inprogress',
      integrationId: '5e44ee816fb284424f693b43',
      type: 'revert',
      description: 'metadatatest',
      createdAt: date,
    });

    waitFor(() => {
      const columnNames = screen
        .getAllByRole('columnheader')
        .map(ele => ele.textContent);

      expect(columnNames).toEqual([
        'Description',
        'Date created',
        'Type',
        'Status',
        'User',
        'Actions',
      ]);

      //  first for table headings and the second as data row
      expect(screen.getAllByRole('row')).toHaveLength(2);

      const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

      expect(cells).toEqual([
        'metadatatest',
        date,
        'Revert',
        'In progress',
        'Nametest2',
        '',
      ]);
    });
    waitFor(async () => {
      const actionButton = screen.getByRole('button', { name: /more/i });

      await userEvent.click(actionButton);
      const actionItems = screen
        .getAllByRole('menuitem')
        .map(ele => ele.textContent);

      expect(actionItems).toEqual([
        'Resume operation',
        'Cancel revision',
        'View details',
      ]);
    });
  });
  test('should render the table accordingly for rowactions when status is failed and type is revert', async () => {
    initImports({
      _id: 'someid',
      _createdByUserId: '5f7011605b2e3244837309f9',
      status: 'failed',
      integrationId: '5e44ee816fb284424f693b43',
      type: 'revert',
      description: 'metadatatest',
      createdAt: date,
    });

    waitFor(async () => {
      const actionButton = screen.getByRole('button', { name: /more/i });

      await userEvent.click(actionButton);
      const actionItems = screen
        .getAllByRole('menuitem')
        .map(ele => ele.textContent);

      expect(actionItems).toEqual([
        'Create pull',
        'View details',
      ]);
    });
  });

  test('should render the table accordingly for rowactions when status is cancelled', async () => {
    initImports({
      _id: 'someid',
      _createdByUserId: '5f7011605b2e3244837309f9',
      status: 'canceled',
      integrationId: '5e44ee816fb284424f693b43',
      description: 'metadatatest',
      createdAt: date,
    });

    waitFor(async () => {
      const actionButton = screen.getByRole('button', { name: /more/i });

      await userEvent.click(actionButton);
      const actionItems = screen
        .getAllByRole('menuitem')
        .map(ele => ele.textContent);

      expect(actionItems).toEqual([
        'View details',
      ]);
    });
  });

  test('should render the table accordingly for rowactions when status is completed and type is snapshot', async () => {
    initImports({
      _id: 'someid',
      _createdByUserId: '5f7011605b2e3244837309f9',
      status: 'completed',
      integrationId: '5e44ee816fb284424f693b43',
      description: 'metadatatest',
      type: 'snapshot',
      createdAt: date,
    });

    waitFor(async () => {
      const actionButton = screen.getByRole('button', { name: /more/i });

      await userEvent.click(actionButton);
      const actionItems = screen
        .getAllByRole('menuitem')
        .map(ele => ele.textContent);

      expect(actionItems).toEqual([
        'Revert to this revision',
        'View details',
      ]);
    });
  });
  test('should render the table accordingly for rowactions when status is completed', async () => {
    initImports({
      _id: 'someid',
      _createdByUserId: '5f7011605b2e3244837309f9',
      status: 'completed',
      integrationId: '5e44ee816fb284424f693b43',
      description: 'metadatatest',
      createdAt: date,
    });

    waitFor(async () => {
      const actionButton = screen.getByRole('button', { name: /more/i });

      await userEvent.click(actionButton);
      const actionItems = screen
        .getAllByRole('menuitem')
        .map(ele => ele.textContent);

      expect(actionItems).toEqual([
        'Revert to after this revision',
        'Revert to before this revision',
        'View resources changed',
        'View details',
      ]);
    });
  });

  test('should render the table accordingly for rowactions when status is completed and type is not snapshot', async () => {
    mutateStore(initialStore, draft => {
      draft.user = {
        preferences: {
          defaultAShareId: '5f7011605b2e3244837309f9',
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
              _id: '5f7011605b2e3244837309f9',
              accessLevel: 'monitor',
            },
          ],
        },
      };
    });

    initImports({
      _id: 'someid',
      _createdByUserId: '5f7011605b2e3244837309f9',
      status: 'completed',
      integrationId: '5e44ee816fb284424f693b43',
      description: 'metadatatest',
      type: 'snapshot',
      createdAt: date,
    });

    waitFor(async () => {
      const actionButton = screen.getByRole('button', { name: /more/i });

      await userEvent.click(actionButton);
      const actionItems = screen
        .getAllByRole('menuitem')
        .map(ele => ele.textContent);

      expect(actionItems).toEqual([
        'View details',
      ]);
    });
  });
  test('should render the table accordingly for rowactions when status is completed and type is snapshot duplicate', async () => {
    mutateStore(initialStore, draft => {
      draft.user = {
        preferences: {
          defaultAShareId: '5f7011605b2e3244837309f9',
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
              _id: '5f7011605b2e3244837309f9',
              accessLevel: 'monitor',
            },
          ],
        },
      };
    });

    initImports({
      _id: 'someid',
      _createdByUserId: '5f7011605b2e3244837309f9',
      status: 'completed',
      integrationId: '5e44ee816fb284424f693b43',
      description: 'metadatatest',
      type: 'revert',
      createdAt: date,
    });

    waitFor(async () => {
      const actionButton = screen.getByRole('button', { name: /more/i });

      await userEvent.click(actionButton);
      const actionItems = screen
        .getAllByRole('menuitem')
        .map(ele => ele.textContent);

      expect(actionItems).toEqual([
        'View resources changed',
        'View details',
      ]);
    });
  });
});

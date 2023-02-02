
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {mockGetRequestOnce, mutateStore, reduxStore, renderWithProviders} from '../../../test/test-utils';
import RetryList from '.';
import { runServer } from '../../../test/api/server';
import { JOB_STATUS, JOB_TYPES } from '../../../constants';
import messageStore, { message } from '../../../utils/messageStore';

const initialStore = reduxStore;

function initRetryList({
  props = {},
  filter = {},
  resourceId = 'f1',
} = {}) {
  const flows = [
    {
      _id: 'f1',
      _exportId: 'e1',
      _importId: 'i1',
      p1: 1,
      p2: 2,
      _integrationId: 'i1',
    },
    {
      _id: 'f2',
      pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
      _integrationId: 'i1',
    },
    {
      _id: 'f3',
      pageProcessors: [
        { _exportId: 'e1', type: 'export' },
        { _importId: 'i1', type: 'import' },
        { _exportId: 'e3', type: 'export' },
      ],
      _integrationId: 'i2',
    },
  ];
  const exports = [{
    _id: 'e1',
    name: 'e1',
    _connectionId: 'c1',
  },
  {
    _id: 'e2',
    name: 'e2',
    _connectionId: 'c2',
  }, {
    _id: 'e3',
    name: 'e3',
    _connectionId: 'c3',
  }];

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      flows,
      exports,
    };
    draft.user.preferences = {
      environment: 'production',
      defaultAShareId: 'own',
    };
    draft.user.profile = {
      allowedToPublish: true,
      developer: true,
    };
    draft.user.org = {
      accounts: [
        {
          accessLevel: 'owner',
          _id: 'own',
          ownerUser: {
            licenses: [{
              type: 'endpoint',
              _id: 'license_id_1',
              tier: 'premium',
              endpoint: {
                apiManagement: true,
                production: {
                  numAddOnAgents: 2,
                  numAgents: 2,
                },
              },
            }],
          },
        },
      ],
    };
    draft.data.integrationAShares = {
      i1: [
        {
          _id: 'as1',
          accepted: true,
          accessLevel: 'manage',
          sharedWithUser: {
            _id: 'u1',
            email: 'user1@celigo.com',
            name: 'User1',
          },
        },
        {
          _id: 'as2',
          accepted: true,
          accessLevel: 'manage',
          sharedWithUser: {
            _id: 'u2',
            email: 'user2@celigo.com',
            name: 'User2',
          },
        },
      ],
    };
    draft.session.filters = filter;
  });

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/${resourceId}`}]}
    >
      <Route path="/:resourceId">
        <RetryList {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('retryList UI tests', () => {
  runServer();

  beforeEach(() => {
    mockGetRequestOnce('api/jobs?_integrationId=i1&_flowId=f1&type=retry&_exportId=e1', []);
  });

  test('should pass the initial render with default value', async () => {
    await initRetryList();
    await waitFor(() => expect(screen.getByText('Retry status')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Duration')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Retry started')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Retry completed')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Success')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Ignored')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Errors')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Retry started by')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Actions')).toBeInTheDocument());
  });

  test('should pass the initial render when there are no retries', async () => {
    mockGetRequestOnce('api/jobs?_integrationId=i1&_flowId=f2&type=retry&_exportId=e2', []);
    await initRetryList({
      props: {flowId: 'f2'},
      resourceId: 'e2',
    });
    await waitFor(() => expect(screen.queryByText(messageStore('NO_RESULT', {message: 'retries'}))).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(message.RETRY.ERRORS_RETRIEVE)).toBeInTheDocument());
    // await waitFor(() => expect(screen.getByText(messageDisplay('RETRY.ERRORS_RETRIEVE'))).toBeInTheDocument());
  });

  test('should show a spinner if retries are requested', async () => {
    await initRetryList({
      props: {flowId: 'f1'},
      resourceId: 'e1',
    });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('should pass the initial render when there are retries', async () => {
    mockGetRequestOnce('api/jobs?_integrationId=i2&_flowId=f3&type=retry&_exportId=e3', [
      {
        _id: 'j1',
        type: JOB_TYPES.RETRY,
        status: JOB_STATUS.CANCELED,
        startedAt: '2019-08-11T10:50:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 0,
        numSuccess: 20,
        triggeredBy: 'u1',
      },
      {
        _id: 'j2',
        type: JOB_TYPES.RETRY,
        status: JOB_STATUS.RUNNING,
        startedAt: '2019-08-11T10:50:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 0,
        numSuccess: 20,
        triggeredBy: 'u2',
      },
    ]);
    await initRetryList({
      props: {flowId: 'f3'},
      resourceId: 'e3',
    });

    await waitFor(() => expect(screen.getByText(/Canceled/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/Retrying errors.../i)).toBeInTheDocument());
  });
  test('should pass the initial render when there are retries and filter', async () => {
    mockGetRequestOnce('api/jobs?_integrationId=i2&_flowId=f3&type=retry&_exportId=e3', [
      {
        _id: 'j1',
        type: JOB_TYPES.RETRY,
        status: JOB_STATUS.CANCELED,
        startedAt: '2019-08-11T10:50:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 0,
        numSuccess: 20,
        triggeredBy: 'u1',
      },
      {
        _id: 'j2',
        type: JOB_TYPES.RETRY,
        status: JOB_STATUS.RUNNING,
        startedAt: '2019-08-11T10:50:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 0,
        numSuccess: 20,
        triggeredBy: 'u2',
      },
    ]);
    await initRetryList({
      props: {flowId: 'f3'},
      resourceId: 'e3',
      filter: {
        retries: {
          isAllSelected: false,
          selectedUsers: ['u1'],
          sort: { order: 'desc', orderBy: 'lastModified' },
          selected: {},
          take: 100,
        },
      },
    });

    await waitFor(() => expect(screen.queryByText(/Canceled/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/Retrying errors.../i)).not.toBeInTheDocument());
  });
});

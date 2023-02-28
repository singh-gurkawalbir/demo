
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import RevisionDetails from '.';

const props = {integrationId: '_integrationId', revisionId: '_revisionId'};

async function initRevisionDetails(props = {}, status = 'completed', fromIntegrationIsSandbox) {
  const initialStore = getCreatedStore();

  mutateStore(initialStore, draft => {
    draft.session.lifeCycleManagement.revision._integrationId = {
      _revisionId: { errors: {status}},
    };
    draft.user = {
      profile: {
        _id: '_userId',
        name: '_userName',
        email: '_userEmail',
      },
      preferences: {
        defaultAShareId: 'aSharedId',
        accounts: {aSharedId: {}}},
      org: {
        accounts: [
          {
            _id: 'aSharedId',
            accepted: true,
            accessLevel: 'manage',
          },
        ],
      },
    };
    draft.data.integrationAShares = {
      _integrationId: [{
        _id: 'aSharedId',
        accepted: true,
        accessLevel: 'manage',
        sharedWithUser: {
          _id: '_userId',
          email: status === 'failed' ? undefined : '_userEmail',
        },
      }],
    };
    draft.data.revisions = {
      _integrationId: {
        data: [
          {
            _id: '_revisionId',
            description: 'Snapshot for testing',
            type: 'snapshot',
            _createdByUserId: '_userId',
            _integrationId: '_integrationId',
            status,
          },
          {
            _id: '_revertRevId',
            description: 'Reverting to previous Snapshot',
            type: 'revert',
            _createdByUserId: '_userId',
            _integrationId: '_integrationId',
            _revertToRevisionId: '_revisionId',
            status,
          },
          {
            _id: '_pullRevId',
            description: 'Reverting to Pulled',
            type: 'pull',
            _createdByUserId: '_userId2',
            _integrationId: '_integrationId',
            fromIntegrationName: 'LenderIntegration',
            fromIntegrationIsSandbox,
            status,
          },
        ],
      },
    };
  });

  const ui = (
    <MemoryRouter>
      <RevisionDetails {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
describe('RevisionDetails tests', () => {
  test('Should able to test the initial render with Valid SNAPSHOT Revision details', async () => {
    await initRevisionDetails(props);
    expect(screen.getByText('Date created:')).toBeInTheDocument();
    expect(screen.getByText('Created by:')).toBeInTheDocument();
    expect(screen.getByText('_userEmail')).toBeInTheDocument();
    expect(screen.getByText('Type:')).toBeInTheDocument();
    expect(screen.getByText('Snapshot')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Revision ID:')).toBeInTheDocument();
    expect(screen.getByText('_revisionId')).toBeInTheDocument();
    const collapseContainer = screen.getByRole('button', {name: 'General'});
    const expandicon = document.querySelector('svg');

    expect(collapseContainer.getAttribute('aria-expanded')).toBe('true');
    await userEvent.click(expandicon);
  });

  test('Should able to test the initial render with Failed Revision', async () => {
    await initRevisionDetails(props, 'failed');
    expect(screen.queryByText('General')).toBeInTheDocument();
    expect(screen.getByText('Created by:')).toBeInTheDocument();
    expect(screen.queryByText('_userEmail')).not.toBeInTheDocument();
    expect(screen.queryByText('Errors')).toBeInTheDocument();
  });

  test('Should able to test the initial render with InValid Revision', async () => {
    await initRevisionDetails({...props, revisionId: '_invalidRevId'});
    expect(screen.queryByText('General')).not.toBeInTheDocument();
  });
  test('Should able to test the initial render with REVERT revision type', async () => {
    await initRevisionDetails({...props, revisionId: '_revertRevId'});
    expect(screen.getByText('Reverted from revision description:')).toBeInTheDocument();
    expect(screen.getByText('Snapshot for testing')).toBeInTheDocument();
    expect(screen.getByText('Date created:')).toBeInTheDocument();
    expect(screen.getByText('Created by:')).toBeInTheDocument();
    expect(screen.getByText('Reverted from created date:')).toBeInTheDocument();
    expect(screen.getByText('Type:')).toBeInTheDocument();
    expect(screen.getByText('Revert')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Revision ID:')).toBeInTheDocument();
    expect(screen.getByText('_revertRevId')).toBeInTheDocument();
  });

  test('Should able to test the initial render with PULL revision type in Production', async () => {
    await initRevisionDetails({...props, revisionId: '_pullRevId'});
    expect(screen.getByText('Date created:')).toBeInTheDocument();
    expect(screen.getByText('Type:')).toBeInTheDocument();
    expect(screen.getByText('Pull')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Created by:')).toBeInTheDocument();
    expect(screen.getByText('From integration name:')).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'LenderIntegration'})).toBeInTheDocument();
    expect(screen.getByText('From integration ID:')).toBeInTheDocument();
    expect(screen.getByText('From environment:')).toBeInTheDocument();
    expect(screen.getByText('Revision ID:')).toBeInTheDocument();
    expect(screen.getByText('_pullRevId')).toBeInTheDocument();
  });
  test('Should able to test the initial render with PULL revision type in Sandbox', async () => {
    await initRevisionDetails({...props, revisionId: '_pullRevId'}, 'completed', true);
    expect(screen.getByText('From environment:')).toBeInTheDocument();
    expect(screen.getByText('Sandbox')).toBeInTheDocument();
    expect(screen.getByText('_pullRevId')).toBeInTheDocument();
  });
});

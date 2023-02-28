
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { mutateStore, reduxStore, renderWithProviders } from '../../../../test/test-utils';
import { ConfirmDialogProvider } from '../../../ConfirmDialog';
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

  draft.data.revisions = {
    '5e44ee816fb284424f693b43': {
      data: [{
        _id: '5cadc8b42b1034709483790',
        type: 'pull',
      }],
    }};
});

const mockDispatchFn = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

async function renderFuntion(data) {
  renderWithProviders(
    <ConfirmDialogProvider>
      <MemoryRouter>
        <CeligoTable
          {...metadata}
          data={[data]}
        />
      </MemoryRouter>
    </ConfirmDialogProvider>, {initialStore}
  );
  await userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('uI tests for cancel revision', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should make a dispatch call when cancel revision is clicked', async () => {
    await renderFuntion({_id: '5cadc8b42b1034709483790',
      _createdByUserId: '5f7011605b2e3244837309f9',
      status: 'inprogress',
      _integrationId: '5e44ee816fb284424f693b43',
      onClose: () => {},
      type: 'pull'});
    const cancelrevision = screen.getByText('Cancel revision');

    await userEvent.click(cancelrevision);
    const cancelmerge = screen.getByText('Cancel merge');

    await userEvent.click(cancelmerge);
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
  });

  test('should test continue merge button', async () => {
    await renderFuntion({_id: '5cadc8b42b1034709483790',
      _createdByUserId: '5f7011605b2e3244837309f9',
      status: 'inprogress',
      _integrationId: '5e44ee816fb284424f693b43',
      onClose: () => {},
      type: 'pull'});
    const cancelrevision = screen.getByText('Cancel revision');

    await userEvent.click(cancelrevision);
    const continueMerge = screen.getByText('Continue merge');

    await userEvent.click(continueMerge);
    expect(continueMerge).not.toBeInTheDocument();
  });

  test('should not display cancel revision button when type is set to snapshot and status is set to completed', async () => {
    await renderFuntion({_id: '5cadc8b42b1034709483790',
      _createdByUserId: '5f7011605b2e3244837309f9',
      status: 'completed',
      _integrationId: '5e44ee816fb284424f693b43',
      onClose: () => {},
      type: 'snapshot'});
    expect(screen.queryByText('Cancel revision')).not.toBeInTheDocument();
  });
});

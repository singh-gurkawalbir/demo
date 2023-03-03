
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { cleanup, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter, Route} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import SharedUserList from '.';
import { mockGetRequestOnce, mockPutRequestOnce, mutateStore, renderWithProviders } from '../../../test/test-utils';
import reduxStore from '../../../store';
import { ConfirmDialogProvider } from '../../ConfirmDialog';
import { runServer } from '../../../test/api/server';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.resources.sshares = [
    {
      _id: '62d4100770b1915aa17b6614',
      _stackId: '62d2ef8aa7777017e5a8081a',
      accepted: true,
      sharedWithUser: {
        _id: '6040b91267059b24eb522db6',
        email: 'testuser+1@celigo.com',
        authTypeSSO: null,
      },
      disabled: true,
    },
  ];

  draft.data.resources.stacks = [{
    _id: '62d2ef8aa7777017e5a8081a',
    name: 'test',
    type: 'server',
    lastModified: '2022-07-16T17:04:10.875Z',
    createdAt: '2022-07-16T17:04:10.835Z',
    server: {
      systemToken: '******',
      hostURI: 'https://integrator.io',
      ipRanges: [],
    },
  }];
});

async function initSharedUserList() {
  const ui = (
    <ConfirmDialogProvider>
      <MemoryRouter
        initialEntries={[{pathname: '/stacks/share/stacks/62d2ef8aa7777017e5a8081a'}]}
    >
        <Route
          path="/stacks/share/stacks/:stackId"
          params={{stackId: '62d2ef8aa7777017e5a8081a'}}
        >
          <SharedUserList />
        </Route>
      </MemoryRouter>
    </ConfirmDialogProvider>

  );

  return renderWithProviders(ui, {initialStore});
}

describe('Shared User List', () => {
  runServer();
  afterEach(cleanup);
  test('Should able to list the Shared User List and enable the user and then delete the user', async () => {
    mockPutRequestOnce('/api/sshares/62d4100770b1915aa17b6614/disable', (req, res, ctx) => res(ctx.json([])));
    mockGetRequestOnce('/api/sshares/62d4100770b1915aa17b6614/dependencies', {});
    await initSharedUserList();

    const emailText = screen.getByText('Email');

    expect(emailText).toBeInTheDocument();
    const nameText = screen.getByText('Name');

    expect(nameText).toBeInTheDocument();
    const statusText = screen.getByText('Status');

    expect(statusText).toBeInTheDocument();
    const offOnText = screen.getByText('Off/On');

    expect(offOnText).toBeInTheDocument();
    const actionText = screen.getByText('Action');

    expect(actionText).toBeInTheDocument();
    const emailIdText = screen.getByText('testuser+1@celigo.com');

    expect(emailIdText).toBeInTheDocument();
    const acceptedText = screen.getByText('Accepted');

    expect(acceptedText).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    await userEvent.click(checkbox);
    const confirmEnableText = screen.getByText('Confirm enable');

    expect(confirmEnableText).toBeInTheDocument();
    const enableText = screen.getByText('Enable');

    expect(enableText).toBeInTheDocument();
    await userEvent.click(enableText);
    let deleteText;

    waitFor(() => {
      deleteText = screen.getByRole('button');

      expect(deleteText).toBeInTheDocument();
    });
    await userEvent.click(deleteText);
    waitFor(() => {
      const deleteMessageText = screen.getByText('Are you sure you want to remove?');

      expect(deleteMessageText).toBeInTheDocument();
    });
    waitFor(() => {
      const cancelText = screen.getByText('Cancel');

      expect(cancelText).toBeInTheDocument();
    });
    await userEvent.click(deleteText);
    waitFor(() => {
      const confirmRemoveText = screen.getByText('Confirm remove');

      expect(confirmRemoveText).toBeInTheDocument();
    });
    let removeText;

    waitFor(async () => {
      removeText = screen.getByText('Remove');

      expect(removeText).toBeInTheDocument();
      await fireEvent.click(removeText);
    });
    waitFor(async () => {
      await waitForElementToBeRemoved(() =>
        screen.queryByText('testuser+1@celigo.com')
      );
    });
  });
});


import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import SharedUserRow from './SharedUserRow';
import { renderWithProviders, mockPutRequestOnce } from '../../../test/test-utils';
import { ConfirmDialogProvider } from '../../ConfirmDialog';
import { runServer } from '../../../test/api/server';

const props = {
  user: {
    _id: '62d4100770b1915aa17b6614',
    _stackId: '62d2ef8aa7777017e5a8081a',
    sharedWithUser: {
      _id: '6040b91267059b24eb522db6',
      email: 'testuser+1@celigo.com',
      authTypeSSO: null,
    },
  },
};

const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

describe('Shared User Row', () => {
  runServer();
  afterEach(cleanup);
  test('Should able to list the accepted disabled Shared User List and enable the user', async () => {
    renderWithProviders(
      <ConfirmDialogProvider>
        <MemoryRouter>
          <Route>
            <SharedUserRow {...{...props, user: {...props.user, accepted: true, disabled: true}}} />
          </Route>
        </MemoryRouter>
      </ConfirmDialogProvider>
    );
    const emailText = screen.getByText('testuser+1@celigo.com');

    expect(emailText).toBeInTheDocument();
    const acceptedText = screen.getByText('Accepted');

    expect(acceptedText).toBeInTheDocument();
    const checkBox = screen.getByRole('checkbox');

    expect(checkBox).toBeInTheDocument();
    fireEvent.click(checkBox);
    const confirmEnable = screen.getByText('Confirm enable');

    expect(confirmEnable).toBeInTheDocument();
    const confirmMessage = screen.getByText('Are you sure you want to enable sharing with this user?');

    expect(confirmMessage).toBeInTheDocument();
    const enableButton = screen.getByText('Enable');

    expect(enableButton).toBeInTheDocument();
    await userEvent.click(enableButton);
    expect(confirmEnable).not.toBeInTheDocument();
  });
  test('Should able to list the pending shared user and delete the user', async () => {
    await renderWithProviders(
      <ConfirmDialogProvider>
        <MemoryRouter>
          <Route>
            <SharedUserRow {...{...props, user: {...props.user, accepted: false}}} />
          </Route>
        </MemoryRouter>
      </ConfirmDialogProvider>
    );
    const emailText = screen.getByText('testuser+1@celigo.com');

    expect(emailText).toBeInTheDocument();
    const pendingText = screen.getByText('Pending');

    expect(pendingText).toBeInTheDocument();
    waitFor(async () => {
      const deleteMessage = screen.getByRole('button');

      expect(deleteMessage).toBeInTheDocument();
      await userEvent.click(deleteMessage);
    });
    let confirmRemoveText;

    waitFor(() => {
      confirmRemoveText = screen.getByText('Confirm remove');

      expect(confirmRemoveText).toBeInTheDocument();
    });
    waitFor(() => {
      const deleteMessageText = screen.getByText('Are you sure you want to remove?');

      expect(deleteMessageText).toBeInTheDocument();
    });
    waitFor(async () => {
      const removeText = screen.getByText('Remove');

      expect(removeText).toBeInTheDocument();
      await userEvent.click(removeText);
      expect(confirmRemoveText).not.toBeInTheDocument();
    });
  });
  test('Should able to list the enabled accepted shared users', async () => {
    renderWithProviders(
      <ConfirmDialogProvider>
        <MemoryRouter>
          <Route>
            <SharedUserRow {...{...props, user: {...props.user, accepted: true, disabled: false}}} />
          </Route>
        </MemoryRouter>
      </ConfirmDialogProvider>
    );
    const emailText = screen.getByText('testuser+1@celigo.com');

    expect(emailText).toBeInTheDocument();
    const acceptedText = screen.getByText('Accepted');

    expect(acceptedText).toBeInTheDocument();
    const checkBox = screen.getByRole('checkbox');

    expect(checkBox).toBeInTheDocument();
    fireEvent.click(checkBox);
    const confirmDisable = screen.getByText('Confirm disable');

    expect(confirmDisable).toBeInTheDocument();
    const confirmMessage = screen.getByText('Are you sure you want to disable sharing with this user?');

    expect(confirmMessage).toBeInTheDocument();
    const disableButton = screen.getByText('Disable');

    expect(disableButton).toBeInTheDocument();
    await userEvent.click(disableButton);
    expect(confirmDisable).not.toBeInTheDocument();
  });
  test('Should able to list the dismissed shared users list and reinvite the user', async () => {
    const mockPutResolverFunction = jest.fn();

    mockPutRequestOnce('/api/sshares/62d4100770b1915aa17b6614', (req, res, ctx) => {
      mockPutResolverFunction();

      return res(ctx.json([]));
    });
    renderWithProviders(
      <ConfirmDialogProvider>
        <MemoryRouter>
          <Route>
            <SharedUserRow {...{...props, user: {...props.user, dismissed: true}}} />
          </Route>
        </MemoryRouter>
      </ConfirmDialogProvider>
    );
    waitFor(() => {
      const emailText = screen.getByText('testuser+1@celigo.com');

      expect(emailText).toBeInTheDocument();
    });
    waitFor(() => {
      const dismissedText = screen.getByText('Dismissed');

      expect(dismissedText).toBeInTheDocument();
    });
    waitFor(async () => {
      const button = screen.queryAllByRole('button');

      expect(button[0]).toBeInTheDocument();
      await userEvent.click(button[0]);
      await waitFor(() => expect(mockPutResolverFunction).toHaveBeenCalledTimes(1));
    });
  });
});


import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mockPostRequestOnce } from '../../test/test-utils';
import InviteUser from './InviteUser';
import { runServer } from '../../test/api/server';

async function initStackInviteUser() {
  const initialStore = reduxStore;

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/stacks/share/stacks/62d2ef8aa7777017e5a8081a'}]}
    >
      <Route
        path="/stacks/share/stacks/:stackId"
        params={{stackId: '62d2ef8aa7777017e5a8081a'}}
        >
        <InviteUser />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('Invite User', () => {
  runServer();
  afterEach(cleanup);
  test('Should able to Invite a user for stacks with a valid email id', async () => {
    await initStackInviteUser();

    const mockResolverFunction = jest.fn();

    mockPostRequestOnce('/api/stacks/62d2ef8aa7777017e5a8081a/invite', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });

    const emailText = screen.getByText('Email');

    expect(emailText).toBeInTheDocument();
    const textBox = screen.getByRole('textbox');

    fireEvent.change(textBox, { target: { value: 'testuser' } });
    fireEvent.change(textBox, { target: { value: '' } });
    const warningText = screen.getByText('A value must be provided');

    expect(warningText).toBeInTheDocument();
    fireEvent.change(textBox, { target: { value: 'testuser@celigo.com' } });
    const saveAndCloseButton = screen.getByText('Invite user & close');

    expect(saveAndCloseButton).toBeInTheDocument();
    const button = screen.queryAllByRole('button');

    expect(button[0]).toBeInTheDocument();

    await userEvent.click(button[0]);
    await waitFor(() => expect(mockResolverFunction).toHaveBeenCalledTimes(1));
  });
  test('Should able to click on Invite a user for stacks with an empty email id', async () => {
    await initStackInviteUser();

    const mockResolverFunction = jest.fn();

    mockPostRequestOnce('/api/stacks/62d2ef8aa7777017e5a8081a/invite', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });

    const emailText = screen.getByText('Email');

    expect(emailText).toBeInTheDocument();
    const textBox = screen.getByRole('textbox');

    fireEvent.change(textBox, { target: { value: 'test' } });
    fireEvent.change(textBox, { target: { value: ' ' } });
    const saveAndCloseButton = screen.getByText('Invite user & close');

    expect(saveAndCloseButton).toBeInTheDocument();
    const button = screen.queryAllByRole('button');

    expect(button[0]).toBeInTheDocument();

    await userEvent.click(button[0]);
    await waitFor(() => expect(mockResolverFunction).not.toHaveBeenCalledTimes(1));
  });
});

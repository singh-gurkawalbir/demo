
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockPostRequestOnce, mockGetRequestOnce, mutateStore } from '../../test/test-utils';
import StackShareDrawer from './Drawer';
import reduxStore from '../../store';
import { runServer } from '../../test/api/server';

async function initDrawer() {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
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

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/stacks/share/stacks/62d2ef8aa7777017e5a8081a'}]}
    >
      <Route
        path="/stacks"
        params={{}}
        >
        <StackShareDrawer />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Invite Users UI tests', () => {
  runServer();
  test('Should be able to verify the invite user form', async () => {
    const mockResolverFunction = jest.fn();
    const mockPostResolverFunction = jest.fn();

    mockGetRequestOnce('/api/sshares', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });
    mockPostRequestOnce('/api/stacks/62d2ef8aa7777017e5a8081a/invite', (req, res, ctx) => {
      mockPostResolverFunction();

      return res(ctx.json([]));
    });
    await initDrawer();
    const headerText = screen.getByText('Stack sharing');

    expect(headerText).toBeInTheDocument();
    const refreshText = screen.getByText('Refresh');

    expect(refreshText).toBeInTheDocument();
    await waitFor(() => expect(mockResolverFunction).toHaveBeenCalledTimes(1));
    await userEvent.click(refreshText);
    await waitFor(() => expect(mockResolverFunction).toHaveBeenCalledTimes(2));
    const inviteStackUserText = screen.getByText('Invite user');

    expect(inviteStackUserText).toBeInTheDocument();
    await userEvent.click(inviteStackUserText);
    const emailText = screen.getByText('Email');

    expect(emailText).toBeInTheDocument();
    const textBox = screen.getByRole('textbox');

    await fireEvent.change(textBox, { target: { value: 'testuser' } });
    await fireEvent.change(textBox, { target: { value: '' } });
    const warningText = screen.getByText('A value must be provided');

    expect(warningText).toBeInTheDocument();
    await fireEvent.change(textBox, { target: { value: 'testuser@celigo.com' } });
    const saveAndCloseButton = screen.getByText('Invite user & close');

    expect(saveAndCloseButton).toBeInTheDocument();
    await userEvent.click(saveAndCloseButton);
    await waitFor(() => expect(mockPostResolverFunction).toHaveBeenCalledTimes(1));
  });
});

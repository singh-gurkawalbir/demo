
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { cleanup, waitFor, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { reduxStore, renderWithProviders, mockPutRequestOnce, mutateStore } from '../../../../test/test-utils';
import ManagePermissionsDrawer from '.';
import { runServer } from '../../../../test/api/server';

function initManagePermission(props = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.integrationAShares = {
      '5fc5e0e66cfe5b44bb95de70': [
        {
          _id: '62c946f8bb1658456e9cbd4d',
          accepted: true,
          accountSSORequired: false,
          sharedWithUser: {
            _id: '6040b91267059b24eb522db6',
            email: 'testuser+1@celigo.com',
            name: 'Test user',
            accountSSOLinked: 'not_linked',
          },
          accessLevel: 'manage',
        },
      ],
    };
    draft.user.org.users = [
      {
        _id: '62c946f8bb1658456e9cbd4d',
        accepted: true,
        integrationAccessLevel: [
          {
            _integrationId: '5fc5e0e66cfe5b44bb95de70',
            accessLevel: 'manage',
          },
        ],
        accountSSORequired: false,
        sharedWithUser: {
          _id: '6040b91267059b24eb522db6',
          email: 'testuser+1@celigo.com',
          name: 'Test user',
          accountSSOLinked: 'not_linked',
        },
        email: 'testuser+1@celigo.com',
      },
    ];
    draft.session.loadResources = [
      {
        integrations: 'received',
        'transfers/invited': 'failed',
        ashares: 'received',
        'shared/ashares': 'received',
        'ui/assistants': 'received',
        httpconnectors: 'failed',
        licenses: 'received',
        transfers: 'received',
        ssoclients: 'received',
        'shared/sshares': 'received',
        tiles: 'received',
        published: 'received',
        connections: 'received',
        marketplacetemplates: 'received',
        '5fc5e0e66cfe5b44bb95de70': {
          flows: 'received',
          exports: 'received',
          imports: 'received',
        },
        notifications: 'received',
        'integrations/5fc5e0e66cfe5b44bb95de70/ashares': 'received',
      },
    ];
    draft.comms.networkComms = {
      'PUT:/ashares/62c946f8bb1658456e9cbd4d': {
        status: 'success',
        hidden: false,
        refresh: false,
        method: 'PUT',
      },
    };
  });
  const ui = (
    <MemoryRouter
      initialEntries={[{ pathname: '/integrations/5fc5e0e66cfe5b44bb95de70/users/ui-drawer/edit/62c946f8bb1658456e9cbd4d' }]}
    >
      <Route
        path="/integrations/:integrationId/users/ui-drawer/edit/62c946f8bb1658456e9cbd4d"
        params={{ integrationId: '5fc5e0e66cfe5b44bb95de70' }}
      >
        <ManagePermissionsDrawer {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('../../../drawer/Right', () => ({
  __esModule: true,
  ...jest.requireActual('../../../drawer/Right'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));
jest.mock('../../../drawer/Right/DrawerHeader', () => ({
  __esModule: true,
  ...jest.requireActual('../../../drawer/Right/DrawerHeader'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));

jest.mock('../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadResources'),
  default: newprops => (
    <div>{newprops.children}</div>
  ),
}
));

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

describe('Manage Permissions', () => {
  runServer();
  afterEach(() => { cleanup; });
  test('Should be able to access the Manage Permission drawer', async () => {
    const mockResolverFunction = jest.fn();

    mockPutRequestOnce('/api/ashares/62c946f8bb1658456e9cbd4d', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });

    await initManagePermission({
      integrationId: '5fc5e0e66cfe5b44bb95de70',
    });

    expect(screen.getByText('Email')).toBeInTheDocument();
    const inputEmail = document.querySelector("[name='email']");

    fireEvent.change(inputEmail, {target: {value: 'testuser.com'}});
    const emailWarningText = screen.getByText('Please enter a valid email address');

    expect(emailWarningText).toBeInTheDocument();
    fireEvent.change(inputEmail, {target: {value: 'testuser+1@celigo.com'}});
    expect(emailWarningText).not.toBeInTheDocument();

    expect(screen.getByText('Access level')).toBeInTheDocument();
    const pleaseSelectText = await screen.getByRole('button', { name: 'Please select' });

    expect(pleaseSelectText).toBeInTheDocument();
    await userEvent.click(pleaseSelectText);
    const administratorMessage = screen.getByRole('menuitem', {name: 'Administer account'});

    expect(administratorMessage).toBeInTheDocument();
    fireEvent.click(administratorMessage);
    const saveMessage = await waitFor(() => screen.getByText('Save'));

    expect(saveMessage).toBeInTheDocument();
  });
});

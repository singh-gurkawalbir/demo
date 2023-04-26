
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockPostRequestOnce, mutateStore } from '../../../../test/test-utils';
import InviteUserDrawer from '.';
import reduxStore from '../../../../store';
import { runServer } from '../../../../test/api/server';

function initInviteUserForm() {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [{
      _id: '62bedcdca0f5f21448171ea2',
      lastModified: '2022-06-30T07:03:15.558Z',
      name: 'Clone - demoint',
      description: 'demo integration',
      install: [],
      mode: 'install',
      sandbox: false,
      _connectionid: '62bd43c87b94d20de64e9ab3',
      _registeredConnectionIds: [],
      installSteps: [
        {
          name: 'demo',
          completed: false,
          isCurrentStep: true,
          isTriggered: true,
          type: 'connection',
          sourceConnection: {
            _id: '62bd43c87b94d20de64e9ab3',
            type: 'http',
            name: 'demo',
            http: {
              formType: 'rest',
            },
          },
        },
        {
          name: 'demo sales',
          completed: false,
          type: 'connection',
          sourceConnection: {
            _id: '62bd452420ecb90e02f2a6f0',
            type: 'salesforce',
            name: 'demo sales',
          },
        },
        {
          name: 'Copy resources now from template zip',
          completed: false,
          type: 'template_zip',
          templateZip: true,
          isClone: true,
        },
      ],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2022-06-30T07:03:15.558Z',
      _sourceId: '6253af74cddb8a1ba550a010',
    }];
  });

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/integrations/62bedcdca0f5f21448171ea2/users/ui-drawer/invite'}]}
    >
      <Route
        path="/integrations/62bedcdca0f5f21448171ea2/users"
        params={{}}
        >
        <InviteUserDrawer />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadResources'),
  default: newprops => (
    <div>{newprops.children}</div>
  ),
}
));
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
  default: () => (
    <>
      Invite user
    </>
  ),
}));

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

describe('Invite Users UI tests', () => {
  runServer();
  test('Should be able to verify the invite user form', async () => {
    await initInviteUserForm();
    const mockResolverFunction = jest.fn();

    mockPostRequestOnce('/api/invite', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });
    expect(screen.queryByText(/Invite user/i)).toBeInTheDocument();
    expect(screen.queryByText(/Email/i)).toBeInTheDocument();
    const input = screen.queryAllByRole('textbox').find(eachOption => eachOption.getAttribute('name') === 'email');

    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();

    const accessLevelText = screen.getByText('Access level');

    expect(accessLevelText).toBeInTheDocument();

    const pleaseSelectText = await screen.getByRole('button', { name: 'Please select' });

    expect(pleaseSelectText).toBeInTheDocument();
    await userEvent.click(pleaseSelectText);
    const administratorMessage = screen.getByRole('menuitem', {name: 'Administer account'});

    expect(administratorMessage).toBeInTheDocument();
    fireEvent.click(administratorMessage);
    const saveMessage = await waitFor(() => screen.getByText('Save'));

    expect(saveMessage).toBeInTheDocument();
    fireEvent.click(saveMessage);
    await waitFor(() => {
      expect(mockResolverFunction).toHaveBeenCalledTimes(1);
    });
  });
});

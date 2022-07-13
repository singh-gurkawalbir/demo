/* global describe, test, expect, jest, afterEach, afterAll, server */
import React from 'react';
import {Router} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line import/no-extraneous-dependencies
import {createMemoryHistory} from 'history';
import UserFormWrapper from '.';
import { mockGetRequestOnce, mockPostRequestOnce, mockPutRequestOnce, renderWithProviders } from '../../../test/test-utils';
import { runServer } from '../../../test/api/server';
import reduxStore from '../../../store';

const history = createMemoryHistory();

function initUserFormWrapper(userprops) {
  const initialStore = reduxStore;

  initialStore.getState().user.org.users = [
    {
      _id: '60fea86dbac8e87b7660f984',
      integrationAccessLevel: [
        {
          _integrationId: '60e493c0ebe4d0631aefb8f2',
          accessLevel: 'administrator',
        },
      ],
      lastModified: '2021-07-26T12:19:57.858Z',
      sharedWithUser: {
        _id: '60d976e1cf735963dc15335f',
        email: 'Celigo@celigo.com',
        allowedToResetMFA: false,
        accountSSOLinked: 'not_linked',
      },
      accessLevel: 'administrator',
    },
    {
      _id: '60fea86dbac8e87b7660f983',
      integrationAccessLevel: [
        {
          _integrationId: '60e493c0ebe4d0631aefb8f3',
          accessLevel: 'manage',
        },
      ],
      lastModified: '2021-07-26T12:19:57.858Z',
      sharedWithUser: {
        _id: '60d976e1cf735963dc153353',
        email: 'Celigo@celigo.com',
        allowedToResetMFA: false,
        accountSSOLinked: 'not_linked',
      },
      accessLevel: 'manage',
    },
    {
      _id: '60fea86dbac8e87b7660f985',
      integrationAccessLevel: [
        {
          _integrationId: '5fc5e0e66cfe5b44bb95de70',
          accessLevel: 'monitor',
        },
      ],
      lastModified: '2021-07-26T12:19:57.858Z',
      sharedWithUser: {
        _id: '60d976e1cf735963dc153353',
        email: 'Celigo@celigo.com',
        allowedToResetMFA: false,
        accountSSOLinked: 'not_linked',
      },
      accessLevel: 'monitor',
    },
    {
      _id: '60fea86dbac8e87b7660f986',
      integrationAccessLevel: [
        {
          _integrationId: '5fc5e0e66cfe5b44bb95de70',
          accessLevel: 'manage',
        },
      ],
      lastModified: '2021-07-26T12:19:57.858Z',
      sharedWithUser: {
        _id: '60d976e1cf735963dc153353',
        email: 'Celigo@celigo.com',
        allowedToResetMFA: false,
        accountSSOLinked: 'not_linked',
      },
      accessLevel: 'tile',
    },
  ];
  initialStore.getState().data.resources.integrations = [
    {
      _id: '5fc5e0e66cfe5b44bb95de70',
      lastModified: '2021-09-29T16:17:12.522Z',
      name: '3PL Central',
      readme: 'https://staging.integrator.io/integrations/5fc5e0e66cfe5b44bb95de70/admin/readme/edit/readme ',
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '5d529bfbdb0c7b14a6011a57',
        '5fc5e4a46cfe5b44bb95df44',
        '60222c93cbcaf605db26d936',
      ],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2020-12-01T06:21:26.538Z',
    },
  ];
  initialStore.getState().data.resources.ssoclients = [

  ];
  initialStore.getState().session.loadResources = [{
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
    '60e493c0ebe4d0631aefb8f2': {
      flows: 'received',
      exports: 'received',
      imports: 'received',
    },
    notifications: 'received',
    'integrations/60e493c0ebe4d0631aefb8f2/ashares': 'received',
  },
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
    '60e493c0ebe4d0631aefb8f3': {
      flows: 'received',
      exports: 'received',
      imports: 'received',
    },
    notifications: 'received',
    'integrations/60e493c0ebe4d0631aefb8f3/ashares': 'received',
  },
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
    '60e493c0ebe4d0631aefb8f3': {
      flows: 'received',
      exports: 'received',
      imports: 'received',
    },
    notifications: 'received',
    'integrations/60e493c0ebe4d0631aefb8f3/ashares': 'received',
  },

  ];
  history.push = jest.fn();
  history.goBack = jest.fn();
  const ui = (
    <Router history={history}>
      <UserFormWrapper userId={userprops} />
    </Router>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../LoadResources'),
  default: newprops => (
    <div>{newprops.children}</div>
  ),
}
));

jest.mock('');
const props = {
  userId: '60fea86dbac8e87b7660f984',
};

describe('User Form Wrapper', () => {
  runServer();
  afterEach(cleanup);
  afterAll(done => {
    server.close();
    done();
  });

  test('Should able to access the User Form Wrapper and need to verify the administrator access level by saving the form', async () => {
    initUserFormWrapper(props.userId);
    const mockResolverFunction = jest.fn();

    mockPutRequestOnce('/api/ashares/60fea86dbac8e87b7660f984', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });

    expect(screen.queryByText(/Email/i)).toBeInTheDocument();
    const svgEl = document.querySelector("[viewBox='0 0 24 24']");

    expect(svgEl).toBeInTheDocument();
    userEvent.click(svgEl);
    expect(screen.getByText('Enter the email of the user you would like to invite to manage and/or monitor selected integrations.')).toBeInTheDocument();
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    userEvent.click(screen.getByText('Yes'));
    userEvent.click(svgEl);
    userEvent.click(screen.getByText('No'));
    fireEvent.change(screen.queryByPlaceholderText(/Please let us know how we can improve the text area./i), {
      target: {value: 'Hey! cool'},
    });
    const submitText = screen.getByText('Submit');

    expect(submitText).toBeInTheDocument();
    userEvent.click(submitText);
    expect(submitText).not.toBeInTheDocument();
    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();

    const accessLevelText = screen.getByText('Access level');

    expect(accessLevelText).toBeInTheDocument();
    userEvent.click(accessLevelText);
    expect(screen.getByText('Administer account')).toBeInTheDocument();
    const saveMessage = await screen.getByText('Save');

    expect(saveMessage).toBeInTheDocument();
    fireEvent.click(saveMessage);
    await waitFor(() => {
      expect(mockResolverFunction).toHaveBeenCalledTimes(1);
    });
  });
  test('Should able to access the User Form Wrapper and need to verify the administrator access level by cancelling the form', async () => {
    initUserFormWrapper(props.userId);

    expect(screen.queryByText(/Email/i)).toBeInTheDocument();
    const svgEl = document.querySelector("[viewBox='0 0 24 24']");

    expect(svgEl).toBeInTheDocument();
    userEvent.click(svgEl);
    expect(screen.getByText('Enter the email of the user you would like to invite to manage and/or monitor selected integrations.')).toBeInTheDocument();
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    userEvent.click(screen.getByText('Yes'));
    userEvent.click(svgEl);
    userEvent.click(screen.getByText('No'));
    fireEvent.change(screen.queryByPlaceholderText(/Please let us know how we can improve the text area./i), {
      target: {value: 'Hey! cool'},
    });
    const submitText = screen.getByText('Submit');

    expect(submitText).toBeInTheDocument();
    userEvent.click(submitText);
    expect(submitText).not.toBeInTheDocument();
    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();

    const accessLevelText = screen.getByText('Access level');

    expect(accessLevelText).toBeInTheDocument();
    userEvent.click(accessLevelText);
    expect(screen.getByText('Administer account')).toBeInTheDocument();
    const cancelMessage = screen.getByText('Cancel');

    expect(cancelMessage).toBeInTheDocument();
    fireEvent.click(cancelMessage);
  });
  test('Should be able to invite a user with administrator access', async () => {
    await initUserFormWrapper('');
    const mockResolverFunction = jest.fn();

    mockPostRequestOnce('/api/invite', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });
    mockGetRequestOnce('/api/shared/ashares', [
      {
        _id: '6195e21a9bfbdd12c575c649',
        accepted: true,
        accessLevel: 'monitor',
        integrationAccessLevel: [],
        ownerUser: {
          _id: '5ca5c855ec5c172792285f53',
          email: 'aasa@gmail.com',
          name: 'sai kaivalya',
          company: 'Amazon Central',
          timezone: 'Asia/Calcutta',
          useErrMgtTwoDotZero: false,
          allowedToPublish: true,
          licenses: [
            {
              _id: '5ca5c856ec5c172792285f54',
              created: '2019-04-04T09:03:18.211Z',
              lastModified: '2019-04-04T09:06:54.579Z',
              expires: '2022-05-04T09:06:54.578Z',
              type: 'integrator',
              tier: 'premium',
              numAddOnFlows: 1400,
              trialEndDate: '2019-05-04T09:06:54.578Z',
              supportTier: 'essential',
              numSandboxAddOnFlows: 500,
              resumable: false,
            },
            {
              _id: '61baae033f236054eee504bd',
              created: '2021-12-16T03:09:55.371Z',
              lastModified: '2022-01-15T03:57:21.820Z',
              type: 'connector',
              _connectorId: '5d1ef1765f96fa1577cf251f',
              opts: {
                addonLicenses: [
                  {
                    licenses: [
                      {
                        addOnEdition: 'premium',
                      },
                      {
                        addOnEdition: 'premium',
                      },
                      {
                        addOnEdition: 'premium',
                      },
                    ],
                    type: 'store',
                  },
                  {
                    type: 'addon',
                    licenses: [
                      {
                        addOnId: 'transferOrder',
                      },
                      {
                        addOnId: 'transferOrder',
                      },
                      {
                        addOnId: 'fbaInventoryAdjustment',
                      },
                    ],
                  },
                ],
                connectorEdition: 'premium',
              },
              _integrationId: '61baae033f236054eee504c3',
              sandbox: false,
              resumable: false,
              trialEndDate: '2022-01-15T03:09:55.368Z',
            },
          ],
        },
      },
    ]);
    expect(screen.queryByText(/Email/i)).toBeInTheDocument();
    const svgEl = document.querySelector("[viewBox='0 0 24 24']");

    expect(svgEl).toBeInTheDocument();
    userEvent.click(svgEl);
    expect(screen.getByText('Enter the email of the user you would like to invite to manage and/or monitor selected integrations.')).toBeInTheDocument();
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    userEvent.click(screen.getByText('Yes'));
    userEvent.click(svgEl);
    userEvent.click(screen.getByText('No'));
    fireEvent.change(screen.queryByPlaceholderText(/Please let us know how we can improve the text area./i), {
      target: {value: 'Hey! cool'},
    });
    const submitText = screen.getByText('Submit');

    expect(submitText).toBeInTheDocument();
    userEvent.click(submitText);
    expect(submitText).not.toBeInTheDocument();
    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo+1@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();
    const accessLevelMessage = screen.getByText('Access level');

    expect(accessLevelMessage).toBeInTheDocument();

    const accessLevelText = await screen.findByRole('button', { name: 'Please select', hidden: true });

    expect(accessLevelText).toBeInTheDocument();
    userEvent.click(accessLevelText);
    const administratorMessage = screen.getAllByRole('menuitem');

    expect(administratorMessage[0]).toBeInTheDocument();
    fireEvent.click(administratorMessage[1]);
    const saveMessage = await screen.findByText('Save');

    expect(saveMessage).toBeInTheDocument();
    fireEvent.click(saveMessage);
    await waitFor(() => {
      expect(mockResolverFunction).toHaveBeenCalledTimes(1);
    });
    const cancelMessage = screen.getByText('Cancel');

    expect(cancelMessage).toBeInTheDocument();
    fireEvent.click(cancelMessage);
    expect(history.goBack).toBeCalled();
  });

  test('Should be able to invite a user with manage access', async () => {
    await initUserFormWrapper('');
    mockGetRequestOnce('/api/shared/ashares', [
      {
        _id: '6195e21a9bfbdd12c575c649',
        accepted: true,
        accessLevel: 'monitor',
        integrationAccessLevel: [],
        ownerUser: {
          _id: '5ca5c855ec5c172792285f53',
          email: 'aasa@gmail.com',
          name: 'sai kaivalya',
          company: 'Amazon Central',
          timezone: 'Asia/Calcutta',
          useErrMgtTwoDotZero: false,
          allowedToPublish: true,
          licenses: [
            {
              _id: '5ca5c856ec5c172792285f54',
              created: '2019-04-04T09:03:18.211Z',
              lastModified: '2019-04-04T09:06:54.579Z',
              expires: '2022-05-04T09:06:54.578Z',
              type: 'integrator',
              tier: 'premium',
              numAddOnFlows: 1400,
              trialEndDate: '2019-05-04T09:06:54.578Z',
              supportTier: 'essential',
              numSandboxAddOnFlows: 500,
              resumable: false,
            },
            {
              _id: '61baae033f236054eee504bd',
              created: '2021-12-16T03:09:55.371Z',
              lastModified: '2022-01-15T03:57:21.820Z',
              type: 'connector',
              _connectorId: '5d1ef1765f96fa1577cf251f',
              opts: {
                addonLicenses: [
                  {
                    licenses: [
                      {
                        addOnEdition: 'premium',
                      },
                      {
                        addOnEdition: 'premium',
                      },
                      {
                        addOnEdition: 'premium',
                      },
                    ],
                    type: 'store',
                  },
                  {
                    type: 'addon',
                    licenses: [
                      {
                        addOnId: 'transferOrder',
                      },
                      {
                        addOnId: 'transferOrder',
                      },
                      {
                        addOnId: 'fbaInventoryAdjustment',
                      },
                    ],
                  },
                ],
                connectorEdition: 'premium',
              },
              _integrationId: '61baae033f236054eee504c3',
              sandbox: false,
              resumable: false,
              trialEndDate: '2022-01-15T03:09:55.368Z',
            },
          ],
        },
      },
    ]);
    expect(screen.queryByText(/Email/i)).toBeInTheDocument();
    const svgEl = document.querySelector("[viewBox='0 0 24 24']");

    expect(svgEl).toBeInTheDocument();
    userEvent.click(svgEl);
    expect(screen.getByText('Enter the email of the user you would like to invite to manage and/or monitor selected integrations.')).toBeInTheDocument();
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    userEvent.click(screen.getByText('Yes'));
    userEvent.click(svgEl);
    userEvent.click(screen.getByText('No'));
    fireEvent.change(screen.queryByPlaceholderText(/Please let us know how we can improve the text area./i), {
      target: {value: 'Hey! cool'},
    });
    const submitText = screen.getByText('Submit');

    expect(submitText).toBeInTheDocument();
    userEvent.click(submitText);
    expect(submitText).not.toBeInTheDocument();
    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo+1@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();
    const accessLevelMessage = screen.getByText('Access level');

    expect(accessLevelMessage).toBeInTheDocument();

    const accessLevelText = await screen.findByRole('button', { name: 'Please select', hidden: true });

    expect(accessLevelText).toBeInTheDocument();
    userEvent.click(accessLevelText);
    const administratorMessage = screen.getAllByRole('menuitem');

    expect(administratorMessage[0]).toBeInTheDocument();
    fireEvent.click(administratorMessage[2]);
    const saveMessage = await screen.getByText('Save');

    expect(saveMessage).toBeInTheDocument();
    fireEvent.click(saveMessage);
    const cancelMessage = screen.getByText('Cancel');

    expect(cancelMessage).toBeInTheDocument();
    fireEvent.click(cancelMessage);
    expect(history.goBack).toBeCalledTimes(1);
  });
  test('Should be able to invite a user with monitor access', async () => {
    await initUserFormWrapper('');
    mockGetRequestOnce('/api/shared/ashares', [
      {
        _id: '6195e21a9bfbdd12c575c649',
        accepted: true,
        accessLevel: 'monitor',
        integrationAccessLevel: [],
        ownerUser: {
          _id: '5ca5c855ec5c172792285f53',
          email: 'aasa@gmail.com',
          name: 'sai kaivalya',
          company: 'Amazon Central',
          timezone: 'Asia/Calcutta',
          useErrMgtTwoDotZero: false,
          allowedToPublish: true,
          licenses: [
            {
              _id: '5ca5c856ec5c172792285f54',
              created: '2019-04-04T09:03:18.211Z',
              lastModified: '2019-04-04T09:06:54.579Z',
              expires: '2022-05-04T09:06:54.578Z',
              type: 'integrator',
              tier: 'premium',
              numAddOnFlows: 1400,
              trialEndDate: '2019-05-04T09:06:54.578Z',
              supportTier: 'essential',
              numSandboxAddOnFlows: 500,
              resumable: false,
            },
            {
              _id: '61baae033f236054eee504bd',
              created: '2021-12-16T03:09:55.371Z',
              lastModified: '2022-01-15T03:57:21.820Z',
              type: 'connector',
              _connectorId: '5d1ef1765f96fa1577cf251f',
              opts: {
                addonLicenses: [
                  {
                    licenses: [
                      {
                        addOnEdition: 'premium',
                      },
                      {
                        addOnEdition: 'premium',
                      },
                      {
                        addOnEdition: 'premium',
                      },
                    ],
                    type: 'store',
                  },
                  {
                    type: 'addon',
                    licenses: [
                      {
                        addOnId: 'transferOrder',
                      },
                      {
                        addOnId: 'transferOrder',
                      },
                      {
                        addOnId: 'fbaInventoryAdjustment',
                      },
                    ],
                  },
                ],
                connectorEdition: 'premium',
              },
              _integrationId: '61baae033f236054eee504c3',
              sandbox: false,
              resumable: false,
              trialEndDate: '2022-01-15T03:09:55.368Z',
            },
          ],
        },
      },
    ]);
    expect(screen.queryByText(/Email/i)).toBeInTheDocument();
    const svgEl = document.querySelector("[viewBox='0 0 24 24']");

    expect(svgEl).toBeInTheDocument();
    userEvent.click(svgEl);
    expect(screen.getByText('Enter the email of the user you would like to invite to manage and/or monitor selected integrations.')).toBeInTheDocument();
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    userEvent.click(screen.getByText('Yes'));
    userEvent.click(svgEl);
    userEvent.click(screen.getByText('No'));
    fireEvent.change(screen.queryByPlaceholderText(/Please let us know how we can improve the text area./i), {
      target: {value: 'Hey! cool'},
    });
    const submitText = screen.getByText('Submit');

    expect(submitText).toBeInTheDocument();
    userEvent.click(submitText);
    expect(submitText).not.toBeInTheDocument();
    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo+1@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();
    const accessLevelMessage = screen.getByText('Access level');

    expect(accessLevelMessage).toBeInTheDocument();

    const accessLevelText = await screen.findByRole('button', { name: 'Please select', hidden: true });

    expect(accessLevelText).toBeInTheDocument();
    userEvent.click(accessLevelText);
    const administratorMessage = screen.getAllByRole('menuitem');

    expect(administratorMessage[0]).toBeInTheDocument();
    fireEvent.click(administratorMessage[3]);
    const pleaseSelectMessage = screen.getAllByText('Please select');

    expect(pleaseSelectMessage[0]).toBeInTheDocument();
    userEvent.click(pleaseSelectMessage[0]);
    const integration = screen.getAllByRole('option');

    expect(integration[0]).toBeInTheDocument();
    userEvent.click(integration[0]);
    const saveMessage = await screen.getByText('Save');

    expect(saveMessage).toBeInTheDocument();
    fireEvent.click(saveMessage);
  });
  test('Should be able to invite a user with manage integration access to a tile', async () => {
    await initUserFormWrapper('');
    mockGetRequestOnce('/api/shared/ashares', [
      {
        _id: '6195e21a9bfbdd12c575c649',
        accepted: true,
        accessLevel: 'monitor',
        integrationAccessLevel: [],
        ownerUser: {
          _id: '5ca5c855ec5c172792285f53',
          email: 'aasa@gmail.com',
          name: 'sai kaivalya',
          company: 'Amazon Central',
          timezone: 'Asia/Calcutta',
          useErrMgtTwoDotZero: false,
          allowedToPublish: true,
          licenses: [
            {
              _id: '5ca5c856ec5c172792285f54',
              created: '2019-04-04T09:03:18.211Z',
              lastModified: '2019-04-04T09:06:54.579Z',
              expires: '2022-05-04T09:06:54.578Z',
              type: 'integrator',
              tier: 'premium',
              numAddOnFlows: 1400,
              trialEndDate: '2019-05-04T09:06:54.578Z',
              supportTier: 'essential',
              numSandboxAddOnFlows: 500,
              resumable: false,
            },
            {
              _id: '61baae033f236054eee504bd',
              created: '2021-12-16T03:09:55.371Z',
              lastModified: '2022-01-15T03:57:21.820Z',
              type: 'connector',
              _connectorId: '5d1ef1765f96fa1577cf251f',
              opts: {
                addonLicenses: [
                  {
                    licenses: [
                      {
                        addOnEdition: 'premium',
                      },
                      {
                        addOnEdition: 'premium',
                      },
                      {
                        addOnEdition: 'premium',
                      },
                    ],
                    type: 'store',
                  },
                  {
                    type: 'addon',
                    licenses: [
                      {
                        addOnId: 'transferOrder',
                      },
                      {
                        addOnId: 'transferOrder',
                      },
                      {
                        addOnId: 'fbaInventoryAdjustment',
                      },
                    ],
                  },
                ],
                connectorEdition: 'premium',
              },
              _integrationId: '61baae033f236054eee504c3',
              sandbox: false,
              resumable: false,
              trialEndDate: '2022-01-15T03:09:55.368Z',
            },
          ],
        },
      },
    ]);
    expect(screen.queryByText(/Email/i)).toBeInTheDocument();
    const svgEl = document.querySelector("[viewBox='0 0 24 24']");

    expect(svgEl).toBeInTheDocument();
    userEvent.click(svgEl);
    expect(screen.getByText('Enter the email of the user you would like to invite to manage and/or monitor selected integrations.')).toBeInTheDocument();
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    userEvent.click(screen.getByText('Yes'));
    userEvent.click(svgEl);
    userEvent.click(screen.getByText('No'));
    fireEvent.change(screen.queryByPlaceholderText(/Please let us know how we can improve the text area./i), {
      target: {value: 'Hey! cool'},
    });
    const submitText = screen.getByText('Submit');

    expect(submitText).toBeInTheDocument();
    userEvent.click(submitText);
    expect(submitText).not.toBeInTheDocument();
    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo+1@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();
    const accessLevelMessage = screen.getByText('Access level');

    expect(accessLevelMessage).toBeInTheDocument();

    const accessLevelText = await screen.findByRole('button', { name: 'Please select', hidden: true });

    expect(accessLevelText).toBeInTheDocument();
    userEvent.click(accessLevelText);
    const administratorMessage = screen.getAllByRole('menuitem');

    expect(administratorMessage[0]).toBeInTheDocument();
    fireEvent.click(administratorMessage[4]);
    const pleaseSelectMessage = screen.getAllByText('Please select');

    expect(pleaseSelectMessage[0]).toBeInTheDocument();
    userEvent.click(pleaseSelectMessage[0]);
    const integration = screen.getAllByRole('option');

    expect(integration[0]).toBeInTheDocument();
    userEvent.click(integration[0]);
    const doneMessage = screen.getByText('Done');

    userEvent.click(doneMessage);

    expect(doneMessage).toBeInTheDocument();
    const saveMessage = await screen.getByText('Save');

    expect(saveMessage).toBeInTheDocument();
    fireEvent.click(saveMessage);
  });
  test('Should be able to invite a user with monitor integration access to a tile', async () => {
    await initUserFormWrapper('');
    mockGetRequestOnce('/api/shared/ashares', [
      {
        _id: '6195e21a9bfbdd12c575c649',
        accepted: true,
        accessLevel: 'monitor',
        integrationAccessLevel: [],
        ownerUser: {
          _id: '5ca5c855ec5c172792285f53',
          email: 'aasa@gmail.com',
          name: 'sai kaivalya',
          company: 'Amazon Central',
          timezone: 'Asia/Calcutta',
          useErrMgtTwoDotZero: false,
          allowedToPublish: true,
          licenses: [
            {
              _id: '5ca5c856ec5c172792285f54',
              created: '2019-04-04T09:03:18.211Z',
              lastModified: '2019-04-04T09:06:54.579Z',
              expires: '2022-05-04T09:06:54.578Z',
              type: 'integrator',
              tier: 'premium',
              numAddOnFlows: 1400,
              trialEndDate: '2019-05-04T09:06:54.578Z',
              supportTier: 'essential',
              numSandboxAddOnFlows: 500,
              resumable: false,
            },
            {
              _id: '61baae033f236054eee504bd',
              created: '2021-12-16T03:09:55.371Z',
              lastModified: '2022-01-15T03:57:21.820Z',
              type: 'connector',
              _connectorId: '5d1ef1765f96fa1577cf251f',
              opts: {
                addonLicenses: [
                  {
                    licenses: [
                      {
                        addOnEdition: 'premium',
                      },
                      {
                        addOnEdition: 'premium',
                      },
                      {
                        addOnEdition: 'premium',
                      },
                    ],
                    type: 'store',
                  },
                  {
                    type: 'addon',
                    licenses: [
                      {
                        addOnId: 'transferOrder',
                      },
                      {
                        addOnId: 'transferOrder',
                      },
                      {
                        addOnId: 'fbaInventoryAdjustment',
                      },
                    ],
                  },
                ],
                connectorEdition: 'premium',
              },
              _integrationId: '61baae033f236054eee504c3',
              sandbox: false,
              resumable: false,
              trialEndDate: '2022-01-15T03:09:55.368Z',
            },
          ],
        },
      },
    ]);
    expect(screen.queryByText(/Email/i)).toBeInTheDocument();
    const svgEl = document.querySelector("[viewBox='0 0 24 24']");

    expect(svgEl).toBeInTheDocument();
    userEvent.click(svgEl);
    expect(screen.getByText('Enter the email of the user you would like to invite to manage and/or monitor selected integrations.')).toBeInTheDocument();
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    userEvent.click(screen.getByText('Yes'));
    userEvent.click(svgEl);
    userEvent.click(screen.getByText('No'));
    fireEvent.change(screen.queryByPlaceholderText(/Please let us know how we can improve the text area./i), {
      target: {value: 'Hey! cool'},
    });
    const submitText = screen.getByText('Submit');

    expect(submitText).toBeInTheDocument();
    userEvent.click(submitText);
    expect(submitText).not.toBeInTheDocument();
    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo+1@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();
    const accessLevelMessage = screen.getByText('Access level');

    expect(accessLevelMessage).toBeInTheDocument();

    const accessLevelText = await screen.findByRole('button', { name: 'Please select', hidden: true });

    expect(accessLevelText).toBeInTheDocument();
    userEvent.click(accessLevelText);
    const administratorMessage = screen.getAllByRole('menuitem');

    expect(administratorMessage[0]).toBeInTheDocument();
    fireEvent.click(administratorMessage[4]);
    const pleaseSelectMessage = screen.getAllByText('Please select');

    expect(pleaseSelectMessage[0]).toBeInTheDocument();
    userEvent.click(pleaseSelectMessage[1]);
    const integration = screen.getAllByRole('option');

    expect(integration[0]).toBeInTheDocument();
    userEvent.click(integration[0]);
    const doneMessage = screen.getByText('Done');

    userEvent.click(doneMessage);

    expect(doneMessage).toBeInTheDocument();
    const saveMessage = await screen.getByText('Save');

    expect(saveMessage).toBeInTheDocument();
    fireEvent.click(saveMessage);
  });
  test('Should be able to verify the monitor integration access to a tile', async () => {
    await initUserFormWrapper('60fea86dbac8e87b7660f985');
    expect(screen.queryByText(/Email/i)).toBeInTheDocument();
    const svgEl = document.querySelector("[viewBox='0 0 24 24']");

    expect(svgEl).toBeInTheDocument();
    userEvent.click(svgEl);
    expect(screen.getByText('Enter the email of the user you would like to invite to manage and/or monitor selected integrations.')).toBeInTheDocument();
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    userEvent.click(screen.getByText('Yes'));
    userEvent.click(svgEl);
    userEvent.click(screen.getByText('No'));
    fireEvent.change(screen.queryByPlaceholderText(/Please let us know how we can improve the text area./i), {
      target: {value: 'Hey! cool'},
    });
    const submitText = screen.getByText('Submit');

    expect(submitText).toBeInTheDocument();
    userEvent.click(submitText);
    expect(submitText).not.toBeInTheDocument();
    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo+1@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();
    const accessLevelMessage = screen.getByText('Access level');

    expect(accessLevelMessage).toBeInTheDocument();

    const accessLevelText = await screen.findByRole('button', { name: 'Please select', hidden: true });

    expect(accessLevelText).toBeInTheDocument();
    userEvent.click(accessLevelText);
    const integration = screen.getAllByRole('option');

    expect(integration[0]).toBeInTheDocument();
    userEvent.click(integration[0]);
    const doneMessage = screen.getByText('Done');

    userEvent.click(doneMessage);

    expect(doneMessage).toBeInTheDocument();
    const saveMessage = await screen.getByText('Save');

    expect(saveMessage).toBeInTheDocument();
    fireEvent.click(saveMessage);
  });
  test('Should be able to verify the manage integration access to a tile', async () => {
    await initUserFormWrapper('60fea86dbac8e87b7660f986');
    expect(screen.queryByText(/Email/i)).toBeInTheDocument();
    const svgEl = document.querySelector("[viewBox='0 0 24 24']");

    expect(svgEl).toBeInTheDocument();
    userEvent.click(svgEl);
    expect(screen.getByText('Enter the email of the user you would like to invite to manage and/or monitor selected integrations.')).toBeInTheDocument();
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    userEvent.click(screen.getByText('Yes'));
    userEvent.click(svgEl);
    userEvent.click(screen.getByText('No'));
    fireEvent.change(screen.queryByPlaceholderText(/Please let us know how we can improve the text area./i), {
      target: {value: 'Hey! cool'},
    });
    const submitText = screen.getByText('Submit');

    expect(submitText).toBeInTheDocument();
    userEvent.click(submitText);
    expect(submitText).not.toBeInTheDocument();
    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo+1@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();
    const accessLevelMessage = screen.getByText('Access level');

    expect(accessLevelMessage).toBeInTheDocument();

    const accessLevelText = await screen.findByRole('button', { name: 'Please select', hidden: true });

    expect(accessLevelText).toBeInTheDocument();
    userEvent.click(accessLevelText);
    const integration = screen.getAllByRole('option');

    expect(integration[0]).toBeInTheDocument();
    userEvent.click(integration[0]);
    const doneMessage = screen.getByText('Done');

    userEvent.click(doneMessage);

    expect(doneMessage).toBeInTheDocument();
    const saveMessage = await screen.getByText('Save');

    expect(saveMessage).toBeInTheDocument();
    fireEvent.click(saveMessage);
  });
});

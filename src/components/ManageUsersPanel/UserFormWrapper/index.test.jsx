import React from 'react';
import {Router} from 'react-router-dom';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createMemoryHistory} from 'history';
import * as reactRedux from 'react-redux';
import UserFormWrapper from '.';
import { mockGetRequestOnce, mockPostRequestOnce, mockPutRequestOnce, renderWithProviders, mockPostRequest, mutateStore } from '../../../test/test-utils';
import { runServer } from '../../../test/api/server';
import { getCreatedStore } from '../../../store';

const history = createMemoryHistory();
let initialStore;

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

function initUserFormWrapper(userprops) {
  mutateStore(initialStore, draft => {
    draft.user.org.users = [
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
    draft.data.resources.integrations = [
      {
        _id: '5fc5e0e66cfe5b44bb95de70',
        name: '3PL Central',
        readme: 'https://staging.integrator.io/integrations/5fc5e0e66cfe5b44bb95de70/admin/readme/edit/readme ',
        _registeredConnectionIds: [
          '5d529bfbdb0c7b14a6011a57',
          '5fc5e4a46cfe5b44bb95df44',
          '60222c93cbcaf605db26d936',
        ],
      },
    ];
    draft.data.resources.ssoclients = [
    ];
  });
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
const props = {
  userId: '60fea86dbac8e87b7660f984',
};

describe('user Form Wrapper', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;
  let historyPush;
  let historygoBack;

  beforeEach(done => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    historyPush = jest.spyOn(history, 'push').mockImplementation();
    historygoBack = jest.spyOn(history, 'goBack').mockImplementation();
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    mockPostRequest('/api/invite', (req, res, ctx) => res(ctx.json([])));
    done();
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    historyPush.mockClear();
    historygoBack.mockClear();
  });

  test('should able to access the User Form Wrapper and need to verify the administrator access level by saving the form', async () => {
    initUserFormWrapper(props.userId);
    const mockResolverFunction = jest.fn();

    mockPutRequestOnce('/api/ashares/60fea86dbac8e87b7660f984', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });

    expect(screen.queryByText(/Email/i)).toBeInTheDocument();

    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();

    const accessLevelText = screen.getByText('Access level');

    expect(accessLevelText).toBeInTheDocument();
    await userEvent.click(accessLevelText);
    expect(screen.getByText('Administer account')).toBeInTheDocument();
    const saveMessage = await screen.findByText('Save');

    expect(saveMessage).toBeInTheDocument();
    fireEvent.click(saveMessage);
    await waitFor(() => {
      expect(mockResolverFunction).toHaveBeenCalledTimes(1);
    });
  });
  test('should able to access the User Form Wrapper and need to verify the administrator access level by cancelling the form', async () => {
    initUserFormWrapper(props.userId);

    expect(screen.queryByText(/Email/i)).toBeInTheDocument();
    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();

    const accessLevelText = screen.getByText('Access level');

    expect(accessLevelText).toBeInTheDocument();
    await userEvent.click(accessLevelText);
    expect(screen.getByText('Administer account')).toBeInTheDocument();
    const cancelMessage = screen.getByText('Cancel');

    expect(cancelMessage).toBeInTheDocument();
  });
  test('should be able to invite a user with administrator access', async () => {
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
      },
    ]);
    expect(screen.queryByText(/Email/i)).toBeInTheDocument();

    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo+1@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();
    const accessLevelMessage = screen.getByText('Access level');

    expect(accessLevelMessage).toBeInTheDocument();

    const accessLevelText = await waitFor(() => screen.queryAllByRole('button', { name: 'Please select' }).find(eachOption => eachOption.getAttribute('id') === 'mui-component-select-accessLevel'));

    expect(accessLevelText).toBeInTheDocument();
    await userEvent.click(accessLevelText);
    const administratorMessage = screen.queryAllByRole('menuitem').find(eachOption => eachOption.getAttribute('data-value') === 'administrator');

    expect(administratorMessage).toBeInTheDocument();
    fireEvent.click(administratorMessage);
    const saveMessage = await screen.findByText('Save');

    expect(saveMessage).toBeInTheDocument();
    fireEvent.click(saveMessage);
    await waitFor(() => {
      expect(mockResolverFunction).toHaveBeenCalledTimes(1);
    });
    const cancelMessage = screen.getByText('Cancel');

    expect(cancelMessage).toBeInTheDocument();
    fireEvent.click(cancelMessage);
    expect(history.goBack).toHaveBeenCalledWith();
  });
  test('should be able to invite a user with manage access', async () => {
    await initUserFormWrapper('');
    mockGetRequestOnce('/api/shared/ashares', [
      {
        _id: '6195e21a9bfbdd12c575c649',
        accepted: true,
        accessLevel: 'monitor',
      },
    ]);
    expect(screen.queryByText(/Email/i)).toBeInTheDocument();

    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo+1@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();
    const accessLevelMessage = screen.getByText('Access level');

    expect(accessLevelMessage).toBeInTheDocument();

    const accessLevelText = await waitFor(() => screen.queryAllByRole('button', { name: 'Please select' }).find(eachOption => eachOption.getAttribute('id') === 'mui-component-select-accessLevel'));

    expect(accessLevelText).toBeInTheDocument();
    await userEvent.click(accessLevelText);
    const administratorMessage = screen.queryAllByRole('menuitem').find(eachOption => eachOption.getAttribute('data-value') === 'manage');

    expect(administratorMessage).toBeInTheDocument();
    fireEvent.click(administratorMessage);
    const saveMessage = await screen.findByText('Save');

    expect(saveMessage).toBeInTheDocument();
    fireEvent.click(saveMessage);
    const cancelMessage = screen.getByText('Cancel');

    expect(cancelMessage).toBeInTheDocument();
    fireEvent.click(cancelMessage);
    expect(history.goBack).toHaveBeenCalledTimes(1);
  });
  test('should be able to invite a user with monitor access', async () => {
    await initUserFormWrapper('');
    mockGetRequestOnce('/api/shared/ashares', [
      {
        _id: '6195e21a9bfbdd12c575c649',
        accepted: true,
        accessLevel: 'monitor',
      },
    ]);
    expect(screen.queryByText(/Email/i)).toBeInTheDocument();
    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo+1@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();
    const accessLevelMessage = screen.getByText('Access level');

    expect(accessLevelMessage).toBeInTheDocument();

    const accessLevelText = await waitFor(() => screen.queryAllByRole('button', { name: 'Please select' }).find(eachOption => eachOption.getAttribute('id') === 'mui-component-select-accessLevel'));

    expect(accessLevelText).toBeInTheDocument();
    await userEvent.click(accessLevelText);
    const administratorMessage = screen.queryAllByRole('menuitem').find(eachOption => eachOption.getAttribute('data-value') === 'monitor');

    expect(administratorMessage).toBeInTheDocument();
    fireEvent.click(administratorMessage);
    const pleaseSelectMessage = screen.getByRole('button', {name: 'Please select'});

    expect(pleaseSelectMessage).toBeInTheDocument();
    await userEvent.click(pleaseSelectMessage);
    const integration = screen.getByRole('option', {name: '3PL Central'});

    expect(integration).toBeInTheDocument();
    await userEvent.click(integration);
    const saveMessage = await screen.findByText('Save');

    expect(saveMessage).toBeInTheDocument();

    await userEvent.click(saveMessage);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'USER_CREATE',
      user: {
        _id: '',
        email: 'Celigo+1@celigo.com',
        accessLevel: 'monitor',
        integrationAccessLevel: [
          {
            _integrationId: '5fc5e0e66cfe5b44bb95de70',
            accessLevel: 'manage',
          },
        ],
        accountSSORequired: undefined,
        accountMFARequired: false,
      },
      asyncKey: 'inviteUserDrawerFormKey',
    }));
  }, 10000);
  test('should be able to invite a user with manage integration access to a tile', async () => {
    await initUserFormWrapper('');
    mockGetRequestOnce('/api/shared/ashares', [
      {
        _id: '6195e21a9bfbdd12c575c649',
        accepted: true,
        accessLevel: 'monitor',
      },
    ]);
    await expect(screen.findByText(/Email/i)).resolves.toBeInTheDocument();
    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo+1@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();
    const accessLevelMessage = screen.getByText('Access level');

    expect(accessLevelMessage).toBeInTheDocument();

    const accessLevelText = await waitFor(() => screen.getByRole('button', { name: 'Please select', hidden: true }));

    expect(accessLevelText).toBeInTheDocument();
    await userEvent.click(accessLevelText);
    const administratorMessage = await waitFor(() => screen.getByRole('menuitem', {name: 'Manage/monitor select integrations'}));

    expect(administratorMessage).toBeInTheDocument();
    fireEvent.click(administratorMessage);
    const pleaseSelectMessage = screen.queryAllByRole('button', {name: 'Please select'}).find(eachOption => eachOption.getAttribute('id') === 'mui-component-select-integrationsToManage');

    expect(pleaseSelectMessage).toBeInTheDocument();
    await userEvent.click(pleaseSelectMessage);
    const integration = screen.getByRole('option', {name: '3PL Central'});

    expect(integration).toBeInTheDocument();
    await userEvent.click(integration);
    const doneMessage = await screen.findByText('Done');

    await fireEvent.click(doneMessage);

    expect(doneMessage).toBeInTheDocument();
    const saveMessage = await screen.findByText('Save');

    expect(saveMessage).toBeInTheDocument();
    await userEvent.click(saveMessage);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'USER_CREATE',
      user: {
        _id: '',
        email: 'Celigo+1@celigo.com',
        accessLevel: undefined,
        integrationAccessLevel: [
          {
            _integrationId: '5fc5e0e66cfe5b44bb95de70',
            accessLevel: 'manage',
          },
        ],
        accountSSORequired: undefined,
        accountMFARequired: false,
      },
      asyncKey: 'inviteUserDrawerFormKey',
    }));
  });
  test('should be able to invite a user with monitor integration access to a tile', async () => {
    await initUserFormWrapper('');
    mockGetRequestOnce('/api/shared/ashares', [
      {
        _id: '6195e21a9bfbdd12c575c649',
        accepted: true,
        accessLevel: 'monitor',
      },
    ]);
    await expect(screen.findByText(/Email/i)).resolves.toBeInTheDocument();
    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo+1@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();
    const accessLevelMessage = screen.getByText('Access level');

    expect(accessLevelMessage).toBeInTheDocument();

    const accessLevelText = await waitFor(() => screen.getByRole('button', { name: 'Please select', hidden: true }));

    expect(accessLevelText).toBeInTheDocument();
    await userEvent.click(accessLevelText);
    const administratorMessage = screen.getByRole('menuitem', {name: 'Manage/monitor select integrations'});

    expect(administratorMessage).toBeInTheDocument();
    fireEvent.click(administratorMessage);
    const pleaseSelectMessage = screen.queryAllByRole('button', {name: 'Please select'}).find(eachOption => eachOption.getAttribute('id') === 'mui-component-select-integrationsToMonitor');

    expect(pleaseSelectMessage).toBeInTheDocument();
    await userEvent.click(pleaseSelectMessage);
    const integration = screen.getByRole('option', {name: '3PL Central'});

    expect(integration).toBeInTheDocument();
    await userEvent.click(integration);
    const doneMessage = await screen.findByText('Done');

    await fireEvent.click(doneMessage);

    expect(doneMessage).toBeInTheDocument();
    const saveMessage = await screen.findByText('Save');

    expect(saveMessage).toBeInTheDocument();
    await userEvent.click(saveMessage);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'USER_CREATE',
      user: {
        _id: '',
        email: 'Celigo+1@celigo.com',
        accessLevel: undefined,
        integrationAccessLevel: [
          {
            _integrationId: '5fc5e0e66cfe5b44bb95de70',
            accessLevel: 'monitor',
          },
        ],
        accountSSORequired: undefined,
        accountMFARequired: false,
      },
      asyncKey: 'inviteUserDrawerFormKey',
    }));
  });
  test('should be able to verify the monitor integration access to a tile', async () => {
    await initUserFormWrapper('60fea86dbac8e87b7660f985');
    await expect(screen.findByText(/Email/i)).resolves.toBeInTheDocument();
    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo+1@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();
    const accessLevelMessage = screen.getByText('Access level');

    expect(accessLevelMessage).toBeInTheDocument();

    const accessLevelText = await waitFor(() => screen.getByRole('button', { name: 'Please select' }));

    expect(accessLevelText).toBeInTheDocument();
    await userEvent.click(accessLevelText);
    const integration = screen.getByRole('option', {name: '3PL Central'});

    expect(integration).toBeInTheDocument();
    await userEvent.click(integration);
    const doneMessage = await screen.findByText('Done');

    await fireEvent.click(doneMessage);

    expect(doneMessage).toBeInTheDocument();
    const saveMessage = await screen.findByText('Save');

    expect(saveMessage).toBeInTheDocument();
  });
  test('should be able to verify the manage integration access to a tile', async () => {
    await initUserFormWrapper('60fea86dbac8e87b7660f986');
    await expect(screen.findByText(/Email/i)).resolves.toBeInTheDocument();
    const input = screen.queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }});
    expect(input.value).toBeTruthy();
    const errorMessage = screen.getByText('Please enter a valid email address');

    expect(errorMessage).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Celigo+1@celigo.com' }});
    expect(errorMessage).not.toBeInTheDocument();
    const accessLevelMessage = screen.getByText('Access level');

    expect(accessLevelMessage).toBeInTheDocument();

    const accessLevelText = await waitFor(() => screen.getByRole('button', { name: 'Please select' }));

    expect(accessLevelText).toBeInTheDocument();
    await userEvent.click(accessLevelText);
    const integration = screen.getByRole('option', {name: '3PL Central'});

    expect(integration).toBeInTheDocument();
    await userEvent.click(integration);
    const doneMessage = await screen.findByText('Done');

    await fireEvent.click(doneMessage);

    expect(doneMessage).toBeInTheDocument();
    const saveMessage = await screen.findByText('Save');

    expect(saveMessage).toBeInTheDocument();
  });
});

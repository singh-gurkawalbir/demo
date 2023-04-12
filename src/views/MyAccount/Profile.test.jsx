
import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
import { screen, waitFor, cleanup, waitForElementToBeRemoved, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockPostRequestOnce, mockPutRequestOnce, mutateStore } from '../../test/test-utils';
import ProfilePanel from './Profile';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';

let initialStore;

function store() {
  mutateStore(initialStore, draft => {
    draft.user.profile = {
      _id: '5d4010e14cd24a7c773122ef',
      name: 'test user',
      email: 'testuser@testo.com',
      role: '',
      company: 'test',
      phone: '1234567890',
      auth_type_google: {},
      timezone: 'Asia/Calcutta',
      developer: true,
      agreeTOSAndPP: true,
      createdAt: '2019-07-30T09:41:54.435Z',
      useErrMgtTwoDotZero: false,
      authTypeSSO: null,
      emailHash: '8a859a6cc8996b65d364a1ce1e7a3890',
    };
  });
}

async function initProfile() {
  const ui = (
    <MemoryRouter>
      <Route>
        <ProfilePanel />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

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

jest.mock('../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/LoadResources'),
  default: newprops => (
    <div>{newprops.children}</div>
  ),
}));

describe('Profile', () => {
  runServer();

  beforeEach(() => {
    initialStore = getCreatedStore();
    store();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });
  test('Should able to load the profile pane and able to update the password', async () => {
    const mockResolverFunction = jest.fn();

    mockPutRequestOnce('/api/change-password', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });
    await initProfile();

    expect(screen.getByText('Password')).toBeInTheDocument();
    const passwordEditButton = screen.queryAllByRole('button').find(eachOption => eachOption.getAttribute('data-test') === 'editPassword');

    expect(passwordEditButton).toBeInTheDocument();
    await userEvent.click(passwordEditButton);
    const passwordModalText = screen.getAllByText('Change password');

    expect(passwordModalText[0]).toBeInTheDocument();

    expect(screen.getByText('Please note that clicking \'Change Password\' will sign you out of the application, and you will need to sign back in with your new password.')).toBeInTheDocument();

    const changeCurrentPasswordNode = document.querySelectorAll('input[name="currentPassword"]');

    expect(changeCurrentPasswordNode).toHaveLength(1);
    await userEvent.type(changeCurrentPasswordNode[0], 'test@123');
    expect(changeCurrentPasswordNode[0]).toHaveValue('test@123');
    const changeNewPasswordNode = document.querySelectorAll('input[name="newPassword"]');

    expect(changeNewPasswordNode).toHaveLength(1);
    await userEvent.type(changeNewPasswordNode[0], 'test@12345');
    expect(changeNewPasswordNode[0]).toHaveValue('test@12345');

    const changePasswordButtonNode = screen.getByRole('button', {name: 'Change password'});

    expect(changePasswordButtonNode).toBeInTheDocument();
    await userEvent.click(changePasswordButtonNode);
    await waitForElementToBeRemoved(passwordModalText);
    await waitFor(() => expect(mockResolverFunction).toHaveBeenCalledTimes(1));
    const passwordChangedText = screen.getByText('Password changed.');

    expect(passwordChangedText).toBeInTheDocument();
    const passwordCloseButton = screen.getByRole('button', {name: 'Close'});

    expect(passwordCloseButton).toBeInTheDocument();
    await fireEvent.click(passwordCloseButton);
    await waitForElementToBeRemoved(passwordCloseButton);
  });
  test('Should able to load the profile pane and able to enter the value for name, company, role, phone and click on save button', async () => {
    const mockResolverFunction2 = jest.fn();

    mockPutRequestOnce('/api/preferences', (req, res, ctx) => {
      mockResolverFunction2();

      return res(ctx.json([]));
    });
    mockPutRequestOnce('/api/profile', (req, res, ctx) => {
      mockResolverFunction2();

      return res(ctx.json([]));
    });
    await initProfile();
    waitFor(() => {
      const profileText = screen.getByText('Profile');

      expect(profileText).toBeInTheDocument();

      expect(screen.getByText('Name')).toBeInTheDocument();
    });
    waitFor(async () => {
      const textBox = screen.getAllByRole('textbox');

      expect(textBox[0]).toHaveValue('test user');

      await userEvent.type(textBox[0], 'test user1');

      expect(screen.getByText('Company')).toBeInTheDocument();
    });
    waitFor(async () => {
      const companyTextBoxNode = screen.getAllByRole('textbox');

      expect(companyTextBoxNode[2]).toHaveValue('test');
      await userEvent.clear(companyTextBoxNode[2]);
      await userEvent.type(companyTextBoxNode[2], 'test company');
      expect(companyTextBoxNode[2]).toHaveValue('test company');

      expect(screen.getByText('Role')).toBeInTheDocument();
    });
    waitFor(async () => {
      const roleLabelTextBoxNode = screen.getAllByRole('textbox');

      expect(roleLabelTextBoxNode[3]).toHaveValue('');
      await userEvent.type(roleLabelTextBoxNode[3], 'test role');
      expect(roleLabelTextBoxNode[3]).toHaveValue('test role');

      expect(screen.getByText('Phone')).toBeInTheDocument();
    });
    waitFor(async () => {
      const phoneLabelTextNode = screen.getAllByRole('textbox');

      expect(phoneLabelTextNode[4]).toHaveValue('1234567890');
      await userEvent.clear(phoneLabelTextNode[4]);
      await userEvent.type(phoneLabelTextNode[4], '9999999999');
      expect(phoneLabelTextNode[4]).toHaveValue('9999999999');
    });
    waitFor(() => {
      const timeZoneLabelNode = screen.getByText('Time zone', { selector: 'label' });

      expect(timeZoneLabelNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const timeZoneButtonNode = screen.getByRole('button', {name: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi'});

      expect(timeZoneButtonNode).toBeInTheDocument();
      await userEvent.click(timeZoneButtonNode);
    });
    waitFor(async () => {
      const timeZoneMenuItems = screen.getByRole('menuitem', {name: '(GMT+05:45) Kathmandu'});

      expect(timeZoneMenuItems).toBeInTheDocument();
      await fireEvent.click(timeZoneMenuItems);
      await waitForElementToBeRemoved(timeZoneMenuItems);
    });

    waitFor(() => {
      const dateFormatLabelNode = screen.getByText('Date format', { selector: 'label' });

      expect(dateFormatLabelNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const dateFormatButtonNode = screen.queryAllByRole('button', {name: 'Please select'}).find(eachOption => eachOption.getAttribute('id') === 'mui-component-select-dateFormat');

      expect(dateFormatButtonNode).toBeInTheDocument();
      await userEvent.click(dateFormatButtonNode);
    });
    waitFor(async () => {
      const dateFormatMenuItemNode = screen.getByRole('menuitem', {name: '12/31/1900'});

      expect(dateFormatMenuItemNode).toBeInTheDocument();
      await fireEvent.click(dateFormatMenuItemNode);
      await waitForElementToBeRemoved(dateFormatMenuItemNode);
    });

    waitFor(() => {
      const timeFormatLabelNode = screen.getByText('Time format');

      expect(timeFormatLabelNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const timeFormatButtonNode = screen.queryAllByRole('button', {name: 'Please select'}).find(eachOption => eachOption.getAttribute('id') === 'mui-component-select-timeFormat');

      expect(timeFormatButtonNode).toBeInTheDocument();
      await userEvent.click(timeFormatButtonNode);
    });
    waitFor(async () => {
      const timeMenuItemNode = screen.getByRole('menuitem', {name: '2:34:25 pm'});

      expect(timeMenuItemNode).toBeInTheDocument();
      await fireEvent.click(timeMenuItemNode);
      await waitForElementToBeRemoved(timeMenuItemNode);
    });
    waitFor(async () => {
      const showTimestampsAsRelativeCheckboxNode = screen.getByRole('checkbox', {name: 'Show timestamps as relative'});

      expect(showTimestampsAsRelativeCheckboxNode).not.toBeChecked();
      await userEvent.click(showTimestampsAsRelativeCheckboxNode);
      expect(showTimestampsAsRelativeCheckboxNode).toBeChecked();
    });

    waitFor(async () => {
      const developerCheckboxNode = screen.getByRole('checkbox', {name: 'Developer mode'});

      expect(developerCheckboxNode).toBeChecked();
      await userEvent.click(developerCheckboxNode);
      expect(developerCheckboxNode).not.toBeChecked();
    });
    waitFor(async () => {
      const saveButtonNode = screen.getByRole('button', {name: 'Save'});

      expect(saveButtonNode).toBeEnabled();
      await fireEvent.click(saveButtonNode);
    });
    waitFor(() => expect(mockResolverFunction2).toHaveBeenCalledTimes(2));
    waitFor(() => {
      const savingNode = screen.findByText('Saving');

      expect(savingNode).toBeInTheDocument();
    });
  });
  test('Should able to load the profile pane and able to read the value email and update the email', async () => {
    const mockResolverFunction = jest.fn();

    mockPostRequestOnce('/api/change-email', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });
    await initProfile();
    waitFor(async () => {
      const emailText = screen.queryAllByRole('button', {name: 'tooltip'}).find(eachOption => eachOption.getAttribute('data-test') === 'editEmail');

      expect(emailText).toBeInTheDocument();
      await userEvent.click(emailText);
    });
    let changeEmailText;

    waitFor(() => {
      changeEmailText = screen.getAllByText('Change email');

      expect(changeEmailText[0]).toBeInTheDocument();
    });
    waitFor(() => {
      const newEmailText = screen.getByText('New email');

      expect(newEmailText).toBeInTheDocument();
    });
    waitFor(async () => {
      const changeEmailRole = screen.getByRole('textbox');

      await userEvent.type(changeEmailRole, 'testuser+1@test.com');
    });
    waitFor(async () => {
      const emailPasswordText = document.querySelectorAll('input[name="password"]');

      expect(emailPasswordText[0]).toBeInTheDocument();
      await userEvent.type(emailPasswordText[0], 'test@123');

      expect(screen.getByText('Note: we require your current password again to help safeguard your integrator.io account.')).toBeInTheDocument();
    });
    waitFor(async () => {
      const changeEmailButton = screen.queryAllByRole('button');

      expect(changeEmailButton[1]).toBeInTheDocument();
      await userEvent.click(changeEmailButton[1]);
      await waitFor(() => expect(mockResolverFunction).toHaveBeenCalledTimes(1));
      await waitForElementToBeRemoved(changeEmailText[0]);

      expect(screen.getByText('Verification link sent to new email address.')).toBeInTheDocument();
    });
    waitFor(async () => {
      const closeSnackbar = screen.queryByRole('button', {name: 'Close'});

      expect(closeSnackbar).toBeInTheDocument();
      await userEvent.click(closeSnackbar);
      await waitForElementToBeRemoved(closeSnackbar);
    });
  });
});

import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mutateStore, reduxStore, renderWithProviders } from '../../../../test/test-utils';
import UserForm from '.';
import {
  ACCOUNT_IDS,
} from '../../../../constants';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.user = {
    preferences: {
      environment: 'production',
      dateFormat: 'MM/DD/YYYY',
      defaultAShareId: ACCOUNT_IDS.OWN,
    },
    profile: {
      _id: '5cadc8b42b10347a2708bf29',
      name: 'Raghuvamsi Owner',
      email: 'raghuvamsi.chandrabhatla@celigo.com',
      useErrMgtTwoDotZero: true,
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
            _id: '5f6882679daecd32740e2c38',
            email: 'raghuvamsi.chandrabhatla+3@celigo.com',
            name: 'Raghuvamsi4 Chandrabhatla',
          },
        },
      ],
      accounts: [
        {
          _id: 'own',
          accessLevel: 'owner',
          ownerUser: {
            licenses: [],
          },
        },
      ],
    },
    debug: false,
  };
  draft.data.resources.integrations = [{
    _id: '62bd4ab37b94d20de64e9eaa',
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

  draft.data.resources.ssoclients = [{
    type: 'oidc',
  }];
});

jest.mock('../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadResources'),
  default: newprops => (
    <div>{newprops.children}</div>
  ),
}
));

describe('userform UI test cases', () => {
  test('should display userform with cancel button when disabled is set to true', async () => {
    const onsaveclick = jest.fn();
    const onCancelClick = jest.fn();

    renderWithProviders(<MemoryRouter><UserForm id="5f7011605b2e3244837309f9" onSaveClick={onsaveclick} onCancelClick={onCancelClick} disableSave /></MemoryRouter>, {initialStore});
    const cancelButton = screen.getByRole('button', {name: 'Cancel'});

    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);
  });

  test('should display userform with cancel button when disabled is set to false', async () => {
    const onSaveClick = jest.fn();
    const onCancelClick = jest.fn();

    renderWithProviders(<MemoryRouter><UserForm id="5f7011605b2e3244837309f9" onSaveClick={onSaveClick} onCancelClick={onCancelClick} disableSave={false} /></MemoryRouter>, {initialStore});
    const cancelButton = screen.getByRole('button', {name: 'Cancel'});

    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);
  });

  test('should display userform with save button when disabled is set to false', () => {
    const onSaveClick = jest.fn();
    const onCancelClick = jest.fn();

    renderWithProviders(<MemoryRouter><UserForm id="5f7011605b2e3244837309f9" onSaveClick={onSaveClick} onCancelClick={onCancelClick} disableSave={false} /></MemoryRouter>, {initialStore});
    const saveButton = screen.getByRole('button', {name: 'Save'});

    expect(saveButton).toBeInTheDocument();
  });

  test('should display userform with saving... button when disabled is set to true', () => {
    const onSaveClick = jest.fn();
    const onCancelClick = jest.fn();

    renderWithProviders(<MemoryRouter><UserForm id="5f7011605b2e3244837309f9" onSaveClick={onSaveClick} onCancelClick={onCancelClick} disableSave /></MemoryRouter>, {initialStore});
    const savingButton = screen.getByRole('button', {name: 'Saving...'});

    expect(savingButton).toBeInTheDocument();
  });
});

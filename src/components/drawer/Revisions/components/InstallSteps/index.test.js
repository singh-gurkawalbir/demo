
import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import InstallSteps from '.';
import actions from '../../../../../actions';

const mockClose = jest.fn();
const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();
const props = {integrationId: '_integrationId', revisionId: '_revId', onClose: mockClose};

jest.mock('../../../../ResourceSetup/Drawer', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../ResourceSetup/Drawer'),
  default: ({revisionId, onSubmitComplete}) => <button type="button" onClick={() => onSubmitComplete(revisionId)}> DrawerSetup</button>,
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: mockHistoryReplace,
  }),
}));
const initialStore = reduxStore;

async function initInstallSteps(props = {}, type = 'revert') {
  mutateStore(initialStore, draft => {
    draft.session.lifeCycleManagement = {
      installStep: {
        _revId: {
          openOauthConnection: true,
          oAuthConnectionId: 'oAuthConnectionId',
        },
      },
    };
    draft.data.resources = {
      connections: [
        {
          _id: 'oAuthConnectionId',
        },
        {
          _id: 'connectionId',
        },
        {
          _id: '_revId8',
          type,
          status: 'failed',
          installSteps: [
            {
              type: 'connection',
              name: 'demo connection',
              completed: true,
              isTriggered: true,
            },
          ],
        },
        {
          _id: '_revId9',
          type,
          status: 'failed',
          installSteps: [
            {
              type: 'connection',
              name: 'demo connection',
              completed: true,
              isTriggered: true,
            },
          ],
        },
      ],
    };
    draft.data.revisions = {
      _integrationId: {
        data: [
          {
            _id: '_revId',
            type,
            installSteps: [{
              type,
              description: 'Installing',
              name: 'Install your changes',
              completed: true,
            }],
          },
        ],
      },
      _integrationId2: {
        data: [
          {
            _id: '_revId2',
            type,
            installSteps: [
              {
                type: 'connection',
                name: 'Install your connection',
                completed: false,
              },
            ],
          },
          {
            _id: '_revId3',
            type,
            installSteps: [
              {
                type: 'url',
                name: 'Install your url',
                completed: false,
              },
            ],
          },
          {
            _id: '_revId4',
            type,
            installSteps: [
              {
                type,
                name: 'Install your step',
                completed: false,
              },
            ],
          },
          {
            _id: '_revId5',
            installSteps: [
              {
                type: 'url',
                name: 'demo triggered',
                completed: false,
                isTriggered: true,
                connectionId: 'connectionId',
              },
            ],
          },
          {
            _id: '_revId6',
            installSteps: [
              {
                type: 'url',
                name: 'demo verifying',
                completed: false,
                isTriggered: true,
                verifying: true,
              },
            ],
          },
          {
            _id: '_revId7',
            installSteps: [
              {
                type: 'connection',
                name: 'demo connection',
                completed: false,
                isTriggered: true,
              },
            ],
          },
          {
            _id: '_revId8',
            type,
            status: 'failed',
            installSteps: [
              {
                type: 'connection',
                name: 'demo connection',
                completed: true,
                isTriggered: true,
              },
            ],
          },
          {
            _id: '_revId9',
            type,
            status: 'failed',
            installSteps: [
              {
                type: 'connection',
                name: 'demo connection',
                completed: true,
                isTriggered: true,
              },
            ],
          },
        ],
      },
    };
  });
  const ui = (<MemoryRouter><InstallSteps {...props} /> </MemoryRouter>);

  return renderWithProviders(ui, {initialStore});
}
describe('InstallSteps tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    mockClose.mockClear();
    mockHistoryPush.mockClear();
  });

  test('Should able to test InstallSteps with revision type: revert and installation completed', async () => {
    await initInstallSteps(props, 'revert');
    expect(screen.getByText('Complete the steps below to revert your changes.')).toBeInTheDocument();
    expect(screen.getByText('Revert')).toBeInTheDocument();
    expect(screen.getByText('You\'ve successfully reverted your changes.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'DrawerSetup'}));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.integrationLCM.installSteps.setOauthConnectionMode({
      connectionId: 'oAuthConnectionId',
      revisionId: '_revId',
      openOauthConnection: false,
    }));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.integrationLCM.installSteps.updateStep('_revId', 'inProgress'));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(3, actions.integrationLCM.installSteps.installStep('_integrationId', '_revId', {_connectionId: '_revId'}));
    expect(mockHistoryPush).toHaveBeenCalledWith('//configure/connections/oAuthConnectionId');
  });

  test('Should able to test InstallSteps with installation pending and step type revert', async () => {
    await initInstallSteps({...props, revisionId: '_revId4', integrationId: '_integrationId2'});
    await userEvent.click(screen.getByRole('button', {name: 'Revert'}));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.integrationLCM.installSteps.updateStep('_revId4', 'inProgress'));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.integrationLCM.installSteps.installStep('_integrationId2', '_revId4'));
  });
  test('Should able to test InstallSteps with installation pending and step type connection', async () => {
    await initInstallSteps({...props, revisionId: '_revId2', integrationId: '_integrationId2'});
    expect(screen.getByRole('heading', {name: '1'})).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Configure'}));
    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockDispatchFn).toHaveBeenCalled();
  });
  test('Should able to test InstallSteps with installation step type connection already triggered', async () => {
    await initInstallSteps({...props, revisionId: '_revId7', integrationId: '_integrationId2'});
    await userEvent.click(screen.getByRole('button', {name: 'Configuring'}));
    expect(mockHistoryPush).not.toHaveBeenCalled();
  });
  test('Should able to test InstallSteps with installation pending and step type url', async () => {
    await initInstallSteps({...props, revisionId: '_revId3', integrationId: '_integrationId2'});
    expect(screen.getByRole('heading', {name: '1'})).toBeInTheDocument();
    expect(screen.getByText('Install your url')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Install'}));
    expect(mockHistoryPush).not.toHaveBeenCalled();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.installSteps.updateStep('_revId3', 'inProgress'));
  });
  test('Should able to test InstallSteps with installation pending and step type url already triggered', async () => {
    await initInstallSteps({...props, revisionId: '_revId5', integrationId: '_integrationId2'});
    expect(screen.getByText('demo triggered')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Installing'}));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.installSteps.updateStep('_revId5', 'verify'));
  });
  test('Should able to test InstallSteps with installation step type url status verifying', async () => {
    await initInstallSteps({...props, revisionId: '_revId6', integrationId: '_integrationId2'});
    expect(screen.getByText('demo verifying')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Installing'}));
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(mockDispatchFn).not.toHaveBeenCalledWith(actions.integrationLCM.installSteps.updateStep('_revId6', 'inProgress'));
  });

  test('Should able to test InstallSteps with revision type: pull  and installation completed', async () => {
    await initInstallSteps(props, 'pull');
    expect(screen.getByText('Complete the steps below to merge your changes.')).toBeInTheDocument();
    expect(screen.getByText('Install your changes')).toBeInTheDocument();
    const infoButton = screen.getAllByRole('button').find(b => b.getAttribute('data-test') === 'openPageInfo');

    await userEvent.click(infoButton);
    expect(screen.getByText('Installing')).toBeInTheDocument();
    expect(screen.getByText('Configured')).toBeInTheDocument();
    expect(screen.getByText('You\'ve successfully merged your pull.')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Configured'));
    expect(mockClose).toHaveBeenCalled();
  });
  test('Should able to test the error message when the installation steps is completed but when the revision status is failed and type is pull', async () => {
    await initInstallSteps({...props, revisionId: '_revId8', integrationId: '_integrationId2'}, 'pull');
    expect(screen.getByText('Complete the steps below to merge your changes.')).toBeInTheDocument();
    expect(screen.getByText('The merge of your pull was unsuccessful. Try your pull again.')).toBeInTheDocument();
    userEvent.click(screen.getByText('Configured'));
    expect(mockClose).toHaveBeenCalled();
  });
  test('Should able to test the error message when the installation steps is completed but when the revision status is failed and type is revert', async () => {
    await initInstallSteps({...props, revisionId: '_revId9', integrationId: '_integrationId2'});
    expect(screen.getByText('Complete the steps below to revert your changes.')).toBeInTheDocument();
    expect(screen.getByText('Your revert was unsuccessful. Try reverting again.')).toBeInTheDocument();
    userEvent.click(screen.getByText('Configured'));
    expect(mockClose).toHaveBeenCalled();
  });
  test('Should able to test InstallSteps with invalid revisionId', async () => {
    await initInstallSteps({...props, revisionId: undefined});
    await userEvent.click(screen.getByRole('button', {name: 'DrawerSetup'}));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.integrationLCM.installSteps.installStep('_integrationId', undefined, {_connectionId: undefined}));
  });
});

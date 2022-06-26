/* global test, expect, jest,describe,beforeEach,afterEach */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore } from '../../test/test-utils';
import FlowEllipsisMenu from '.';
import { ConfirmDialogProvider } from '../ConfirmDialog';
import actions from '../../actions';

const history = createMemoryHistory();

// eslint-disable-next-line no-unused-vars
async function FlowMenu(customState = {}, props = {}) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources.flows = [
    {
      _id: '62677c19737f015ed4aff4fd',
      lastModified: '2022-05-28T05:45:51.473Z',
      name: 'New flow',
      disabled: true,
      _integrationId: '62662cc4e06ff462c3db470e',
      skipRetries: false,
      pageProcessors: [
        {
          responseMapping: {
            fields: [],
            lists: [],
          },
          _importId: '62677c50563089236fed72a1',
          type: 'import',
        },
      ],
      pageGenerators: [
        {
          _exportId: '62677c18563089236fed7295',
          skipRetries: false,
        },
      ],
      createdAt: '2022-04-26T04:59:05.445Z',
      lastExecutedAt: '2022-04-26T05:03:02.115Z',
      autoResolveMatchingTraceKeys: true,
    },
  ];
  initialStore.getState().data.resources.integrations = [{
    _id: '62662cc4e06ff462c3db470e',
    lastModified: '2022-04-29T12:23:16.887Z',
    name: 'Production',
    _templateId: '5d9eb2c7224c6042d7a2fc98',
    description: 'demo integration',
    // _connectorId: customState.connectorId,
    install: [],
    sandbox: false,
    _registeredConnectionIds: [
      '62677b90737f015ed4aff4e8',
      '626a251fb940193d088f3e72',
    ],
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2022-04-25T05:08:20.172Z',
  }];
  initialStore.getState().user = {
    preferences: {
      environment: 'production',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'h:mm:ss a',
      expand: 'Resources',
      scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
      showReactSneakPeekFromDate: '2019-11-05',
      showReactBetaFromDate: '2019-12-26',
      defaultAShareId: 'own',
      dashboard: {
        view: 'tile',
        pinnedIntegrations: [],
      },
      drawerOpened: false,
    },
    profile: {
      _id: '625e84b4a2bca9036eb61252',
      name: 'Prashanth Nesa',
      email: 'prashanthkumar.nesa@celigo.com',
      role: 'Engineering intern',
      company: 'celigo',
      phone: '7995045186',
      auth_type_google: {},
      timezone: 'Asia/Calcutta',
      developer: true,
      allowedToPublish: true,
      agreeTOSAndPP: true,
      createdAt: '2022-04-19T09:45:25.111Z',
      useErrMgtTwoDotZero: true,
      authTypeSSO: null,
      emailHash: '087e41a1843139c27bce730b99664a84',
    },
    notifications: {
      accounts: [],
      stacks: [],
      transfers: [],
    },
    org: {
      users: [],
      accounts: [
        {
          _id: 'own',
          accessLevel: 'owner',
          ownerUser: {
            licenses: [
              {
                _id: '625e84b5a2bca9036eb61253',
                created: '2022-04-19T09:45:25.125Z',
                lastModified: '2022-04-28T05:05:45.751Z',
                type: 'endpoint',
                tier: 'free',
                trialEndDate: '2022-05-28T05:05:45.740Z',
                supportTier: 'essential',
                sandbox: false,
                endpoint: {
                  production: {
                    numEndpoints: 2,
                    numAddOnEndpoints: 0,
                    numFlows: 1,
                    numAddOnFlows: 0,
                    numTradingPartners: 0,
                    numAddOnTradingPartners: 0,
                    numAgents: 0,
                    numAddOnAgents: 0,
                  },
                  sandbox: {
                    numEndpoints: 0,
                    numAddOnEndpoints: 0,
                    numFlows: 0,
                    numAddOnFlows: 0,
                    numTradingPartners: 0,
                    numAddOnTradingPartners: 0,
                    numAgents: 0,
                    numAddOnAgents: 0,
                  },
                  apiManagement: false,
                },
                resumable: false,
              },
            ],
          },
        },
      ],
    },
    debug: false,
  };
  initialStore.getState().data.resources.marketplacetemplates = [{
    _id: '5d9eb2c7224c6042d7a2fc98',
    name: '135',
    user: {
      name: 'swarna suvarchala 123',
      company: 'celigo',
    },
    lastModified: '2019-10-18T06:59:48.542Z',
  }];
  // eslint-disable-next-line no-param-reassign
  props.flowId = initialStore.getState().data.resources.flows[0]._id;
  const ui = (
    <Router history={history}>
      <ConfirmDialogProvider>
        <FlowEllipsisMenu {...props} />
      </ConfirmDialogProvider>
    </Router>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('Flow ellipsis menu ui tests', () => {
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
  });
  test('presence of ellipsis menu icon', async () => {
    await FlowMenu({ exclude: [] });
    const icon = screen.getByRole('button');

    expect(icon).toBeInTheDocument();
    screen.debug();
  });
  test('checking whether the menu is appearing on clicking the icon', async () => {
    await FlowMenu({}, { exclude: [] });
    const icon = screen.getByRole('button');

    userEvent.click(icon);
    const menuItems = screen.getAllByRole('menuitem');

    expect(menuItems).toHaveLength(8);
  });
  test('checking the presence and functioning of clone flow button', async () => {
    history.push = jest.fn();
    await FlowMenu(
      {},
      { flowId: null, exclude: ['mapping', 'detach', 'audit', 'schedule'] }
    );
    const icon = screen.getByRole('button');

    userEvent.click(icon);
    const cloneFlowButton = screen.getByText('Clone flow');

    userEvent.click(cloneFlowButton);
    await waitFor(() => expect(history.push).toHaveBeenCalledTimes(1));
  });
  test('checking the presence and functioning of delete flow button', async () => {
    history.replace = jest.fn();
    await FlowMenu({}, { flowId: null, exclude: ['mapping', 'detach', 'audit', 'schedule'] });
    const icon = screen.getByRole('button');

    userEvent.click(icon);
    const deleteFlowButton = screen.getByText('Delete flow');

    userEvent.click(deleteFlowButton);
    const confirmDelete = screen.getByRole('button', {name: 'Delete'});

    userEvent.click(confirmDelete);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.resource.delete('flows', '62677c19737f015ed4aff4fd')));
    await waitFor(() => expect(history.replace).toHaveBeenCalledTimes(1));
  });
  test('checking the presence and functioning of download flow button', async () => {
    history.replace = jest.fn();
    await FlowMenu({}, { flowId: null, exclude: [] });
    const icon = screen.getByRole('button');

    userEvent.click(icon);
    const downloadFlowButton = screen.getByText('Download flow');

    userEvent.click(downloadFlowButton);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.resource.downloadFile('62677c19737f015ed4aff4fd', 'flows')));
  });
  test('checking the presence and functioning of detach flow button', async () => {
    history.replace = jest.fn();
    const patchSet = [{ op: 'replace', path: '/_integrationId', value: undefined }];

    await FlowMenu({}, { flowId: null, exclude: [] });
    const icon = screen.getByRole('button');

    userEvent.click(icon);
    const detachFlowButton = screen.getByText('Detach flow');

    userEvent.click(detachFlowButton);
    const confirmButton = screen.getByText('Detach');

    userEvent.click(confirmButton);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.resource.patchAndCommitStaged('flows', '62677c19737f015ed4aff4fd', patchSet)));
  });
  test('checking the presence and functioning of edit mapping button', async () => {
    history.push = jest.fn();
    await FlowMenu({}, { flowId: null, exclude: [] });
    const icon = screen.getByRole('button');

    userEvent.click(icon);
    const mappingButton = screen.getByText('Edit mapping');

    userEvent.click(mappingButton);
    expect(history.push).toHaveBeenCalledTimes(1);
  });
  test('testing the functionality of Schedule button', async () => {
    history.push = jest.fn();
    await FlowMenu({}, { flowId: null, exclude: [] });
    const icon = screen.getByRole('button');

    userEvent.click(icon);
    const scheduleButton = screen.getByText('Schedule');

    userEvent.click(scheduleButton);
    expect(history.push).toHaveBeenCalledTimes(1);
  });
  test('testing the functionality of Audit log button', async () => {
    history.push = jest.fn();
    await FlowMenu({}, { flowId: null, exclude: [] });
    const icon = screen.getByRole('button');

    userEvent.click(icon);
    const auditlogButton = screen.getByText('Schedule');

    userEvent.click(auditlogButton);
    waitFor(() => expect(screen.getByText('/Audit Log/i').toBeInTheDocument()));
  });
  test('testing the functionality of Used by(references) button', async () => {
    history.push = jest.fn();
    await FlowMenu({}, { flowId: null, exclude: [] });
    const icon = screen.getByRole('button');

    userEvent.click(icon);
    const referencesButton = screen.getByText('Used by');

    userEvent.click(referencesButton);
    waitFor(() => expect(screen.getByText('/This resource is not being used anywhere/i').toBeInTheDocument()));
  });
  test('covering of various scenarios', async () => {
    const props = {flowId: null, exclude: []};

    renderWithProviders(<MemoryRouter><FlowEllipsisMenu {...props} /></MemoryRouter>);
  });
});


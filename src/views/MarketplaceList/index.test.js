
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Marketplace from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import { ConfirmDialogProvider } from '../../components/ConfirmDialog';
import actions from '../../actions';

async function initMarketplace({
  application = 'netsuite',
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.user.preferences = {
      environment: 'production',
      defaultAShareId: 'own',
    };
    draft.user.org = {
      accounts: [
        {
          accessLevel: 'owner',
          _id: 'own',
          ownerUser: {
            licenses: [{
              type: 'endpoint',
            }, {
              _id: 'license_id_1',
              _connectorId: 'connector_id_1',
              type: 'integrationApp',
              expires: Date.now() + 36000000,
            }, {
              _id: 'license_id_2',
              _connectorId: 'connector_id_5',
              type: 'connector',
              expires: Date.now() + 36000000,
            }, {
              _id: 'license_id_3',
              _connectorId: 'connector_id_7',
              type: 'integrationApp',
              trialEndDate: Date.now(),
            }],
          },
        },
      ],
    };
    draft.data.resources = {
      integrations: [
        {
          _id: 'id_1',
          name: 'name 1',
        },
      ],
    };
    draft.data.marketplace = {
      templates: [
        {
          _id: 'template_id_1',
          name: 'name 1',
          applications: ['netsuite'],
        },
      ],
      connectors: [
        {
          _id: 'suitescript-salesforce-netsuite',
          ssName: 'Salesforce Connector',
          name: 'Salesforce - NetSuite Connector (V2)',
          canInstall: true,
          urlName: 'sfns',
          applications: ['salesforce'],
        },
        {
          _id: 'connector_id_1',
          name: 'name 1',
          applications: ['netsuite'],
          framework: 'twoDotZero',
          trialEnabled: true,
        },
        {
          _id: 'connector_id_5',
          name: 'name 5',
          applications: ['netsuite'],
          trialEnabled: true,
        },
        {
          _id: 'connector_id_6',
          name: 'name 6',
          applications: ['netsuite'],
          framework: 'twoDotZero',
          trialEnabled: true,
        },
        {
          _id: 'connector_id_7',
          name: 'name 7',
          applications: ['netsuite'],
          framework: 'twoDotZero',
          trialEnabled: true,
        },
        {
          _id: 'id_2',
          name: 'mame 2',
          applications: ['netsuite'],
        },
        {
          _id: 'id_4',
          name: 'mame 4',
          applications: ['dummyname'],
          framework: 'twoDotZero',
        },
      ],
    };
    draft.data.resources = {
      integrations: [
        {
          _id: 'integration_id_1',
          _connectorId: 'connector_id_5',
          name: 'name 5',
        },
      ],
    };
    draft.session.loadResources.integrations = 'received';
  });

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/marketplace/${application}`}]}
    >
      <Route path="/marketplace/:application">
        <ConfirmDialogProvider>
          <Marketplace />
        </ConfirmDialogProvider>
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('Marketplace test cases', () => {
  runServer();
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
    mockHistoryPush.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should pass the initial render with default value/netsuite value', async () => {
    await initMarketplace();

    const installButtons = screen.getAllByRole('button', { name: /Install/i});
    const freeTrialButtons = screen.getAllByRole('button', { name: /Start free trial/i});
    const reqDemoButton = screen.getByRole('button', { name: /Request demo/i});

    expect(installButtons).toHaveLength(2);
    expect(freeTrialButtons).toHaveLength(2);
    expect(reqDemoButton).toBeInTheDocument();
    expect(screen.queryByText(/NetSuite Integrations/i)).toBeInTheDocument();

    await userEvent.click(installButtons[0]); // install the IA for 1st time
    expect(mockDispatchFn).toBeCalledWith(actions.marketplace.installConnector('connector_id_1', false));
    expect(mockHistoryPush).toBeCalledWith('/home');

    mockHistoryPush.mockClear();
    await userEvent.click(installButtons[1]); // install the IA 2nd time
    const tagInput = screen.getByRole('textbox');
    const installButton = screen.getByRole('button', { name: /Install/i});

    expect(screen.queryByText(/Confirm multiple installs/i)).toBeInTheDocument();
    expect(tagInput).toBeInTheDocument();
    expect(installButton).toBeInTheDocument();
    await userEvent.type(tagInput, 'test');
    await userEvent.click(installButton);
    expect(mockDispatchFn).toBeCalledWith(actions.marketplace.installConnector('connector_id_5', false, 'test'));
    expect(mockHistoryPush).toBeCalledWith('/home');

    await userEvent.click(freeTrialButtons[0]); // free trial
    const freeTrialDialogButton = screen.getByRole('button', { name: /Start free trial/i});

    expect(freeTrialDialogButton).toBeInTheDocument();
    expect(screen.queryByText(/to start your free trial of name 6 Integration App./i)).toBeInTheDocument();

    mockHistoryPush.mockClear();
    await userEvent.click(freeTrialDialogButton);
    expect(mockDispatchFn).toBeCalledWith(actions.marketplace.installConnector('connector_id_6', false));
    expect(mockHistoryPush).toBeCalledWith('/home');

    await userEvent.click(freeTrialButtons[1]); // free trial already used
    const demoButton = screen.getByRole('button', { name: /Request demo/i});

    expect(demoButton).toBeInTheDocument();
    expect(screen.queryByText(/You have already used up your trial license/i)).toBeInTheDocument();

    await userEvent.click(demoButton);
    const closeButton = screen.getByRole('button', { name: /Close/i});

    expect(screen.queryByText(/Thanks for your request!/i)).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(screen.queryByText(/Thanks for your request!/i)).not.toBeInTheDocument();

    await userEvent.click(reqDemoButton); // request demo
    const closeButtonRef = screen.getByRole('button', { name: /Close/i});

    expect(screen.queryByText(/Thanks for your request!/i)).toBeInTheDocument();
    expect(closeButtonRef).toBeInTheDocument();
    await userEvent.click(closeButtonRef);
    expect(screen.queryByText(/Thanks for your request!/i)).not.toBeInTheDocument();
  });

  test('should pass the initial render with http application', async () => {
    await initMarketplace({
      application: 'http',
    });

    expect(screen.queryByText(/HTTP Integrations/i)).toBeInTheDocument();
  });

  test('should pass the initial render with salesforce application', async () => {
    await initMarketplace({
      application: 'salesforce',
    });
    const installButton = screen.getByRole('button', { name: /Install/i});

    expect(installButton).toBeInTheDocument();
    expect(screen.queryByText(/Salesforce Integrations/i)).toBeInTheDocument();

    await userEvent.click(installButton); // V2 IA
    expect(mockHistoryPush).toBeCalledWith('/suitescript/integrationapps/suitescript-salesforce-netsuite/setup');
  });
});

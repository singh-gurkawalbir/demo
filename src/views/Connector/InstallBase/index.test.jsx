import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
import { screen, cleanup, waitForElementToBeRemoved, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import InstallBase from '.';
import { runServer } from '../../../test/api/server';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';

let initialStore;

function store(connectors, connectorInstallBase, connectorLicenses) {
  mutateStore(initialStore, draft => {
    draft.data.resources.connectors = [
      {
        _id: '12345',
        name: connectors.name,
        contactEmail: 'testuser@celigo.com',
        _integrationId: connectors._integrationId,
      },
    ];
    draft.user.preferences = {
      environment: 'production',
      dateFormat: 'MM/DD/YYYY',
    };
    draft.data.resources.connectorInstallBase = connectorInstallBase;
    draft.data.resources.connectorLicenses = connectorLicenses;
  });
}

async function initInstallBase(props) {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/connectors/12345/installBase'}]}>
      <Route>
        <InstallBase {...props} />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}
describe('install Base', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    jest.clearAllMocks();
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    cleanup();
  });
  test('should able to test the Install Base heading which has connector name attached', async () => {
    const props = {
      match: {
        params: {connectorId: '12345'},
      },
    };
    const connectors = {
      name: 'Test',
      _integrationId: '123454321',
    };

    store(connectors);
    await initInstallBase(props);
    waitFor(async () => {
      const installBaseHeadingNode = screen.getByRole('heading', {name: 'View / Update Install Base: Test'});

      expect(installBaseHeadingNode).toBeInTheDocument();
    });
  });
  test('should able to test the Install Base heading which doesn/t have any connector name', async () => {
    const props = {
      match: {
        params: {connectorId: '12345'},
      },
    };
    const connectors = {
      name: '',
      _integrationId: '123454321',
    };

    store(connectors);
    await initInstallBase(props);
    waitFor(async () => {
      const installBaseHeadingNode = screen.getByRole('heading', {name: 'View / Update Install Base:'});

      expect(installBaseHeadingNode).toBeInTheDocument();
    });
  });
  test('should able to test the Install Base update button', async () => {
    const props = {
      match: {
        params: {connectorId: '12345'},
      },
    };
    const connectors = {
      name: 'Test',
      _integrationId: '123454321',
    };

    store(connectors);
    await initInstallBase(props);
    waitFor(async () => {
      const installBaseUpdateNode = screen.getByRole('button', {name: 'Update'});

      expect(installBaseUpdateNode).toBeInTheDocument();
      await userEvent.click(installBaseUpdateNode);
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.connectors.installBase.update({
        _integrationIds: [],
        connectorId: '12345',
      }));
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('connectors/12345/installBase'));
    });
  });
  test('should able to test the Install Base with no connectors', async () => {
    const props = {
      match: {
        params: {connectorId: ''},
      },
    };
    const connectors = {
      name: '',
      _integrationId: '123454321',
    };

    store(connectors);
    await initInstallBase(props);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should able to test the Install Base search option', async () => {
    const props = {
      match: {
        params: {connectorId: '12345'},
      },
    };
    const connectors = {
      name: 'Test',
      _integrationId: '123454321',
    };
    const connectorInstallBase = [
      {
        _id: '11111',
        name: 'Testing Install Base Table',
        email: 'testuser@test.com',
        sandbox: false,
        updateInProgress: false,
        version: 1,
        _integrationId: '123454321',
      },
    ];
    const connectorLicenses = [
      {
        _id: '22222',
        _integrationId: '123454321',
        expires: '2022-08-26',
      },
    ];

    store(connectors, connectorInstallBase, connectorLicenses);
    await initInstallBase(props);
    waitFor(async () => {
      const searchTextBoxNode = screen.getByRole('textbox', {name: 'search'});

      expect(searchTextBoxNode).toBeInTheDocument();
      await userEvent.type(searchTextBoxNode, 'jhjdsh');
      await waitForElementToBeRemoved(() => screen.queryByText(/Testing Install Base Table/i));
      const noMatchingResultNode = await waitFor(() => screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria./i));

      expect(noMatchingResultNode).toBeInTheDocument();
      await userEvent.clear(searchTextBoxNode);
      await waitFor(() => expect(noMatchingResultNode).not.toBeInTheDocument());
      expect(screen.queryByText(/Testing Install Base Table/i)).toBeInTheDocument();
    });
  });
  test('should able to test the Install Base with the sandbox account and when the version is in progress', async () => {
    const props = {
      match: {
        params: {connectorId: '12345'},
      },
    };
    const connectors = {
      name: 'Test',
      _integrationId: '123454321',
    };
    const connectorInstallBase = [
      {
        _id: '11111',
        name: 'Testing Install Base Table',
        email: 'testuser@test.com',
        sandbox: true,
        updateInProgress: true,
        version: 1,
        _integrationId: '123454321',
      },
    ];
    const connectorLicenses = [
      {
        _id: '22222',
        _integrationId: '123454321',
        expires: '2022-08-26',
      },
    ];

    store(connectors, connectorInstallBase, connectorLicenses);
    await initInstallBase(props);
    waitFor(() => {
      const sandboxTextNode = screen.getByRole('cell', {name: 'Sandbox'});

      expect(sandboxTextNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const inProgressTextNode = screen.getByRole('cell', {name: 'In progress...'});

      expect(inProgressTextNode).toBeInTheDocument();
    });
  });
  test('should able to test the Install Base handle select change and click on update 1 user button node', async () => {
    const props = {
      match: {
        params: {connectorId: '12345'},
      },
    };
    const connectors = {
      name: 'Test',
      _integrationId: '123454321',
    };

    const connectorInstallBase = [
      {
        _id: '11111',
        name: 'Testing Install Base Table',
        email: 'testuser@test.com',
        sandbox: true,
        updateInProgress: true,
        version: 1,
        _integrationId: '123454321',
      },
    ];
    const connectorLicenses = [
      {
        _id: '22222',
        _integrationId: '123454321',
        expires: '2022-08-26',
      },
    ];

    store(connectors, connectorInstallBase, connectorLicenses);
    await initInstallBase(props);
    waitFor(async () => {
      const checkBoxNode = screen.getAllByRole('checkbox');

      await userEvent.click(checkBoxNode[0]);
      expect(checkBoxNode).toBeTruthy();
    });
    waitFor(async () => {
      const update1userButtonNode = screen.getByRole('button', {name: 'Update 1 user(s)'});

      expect(update1userButtonNode).toBeInTheDocument();
      await userEvent.click(update1userButtonNode);
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.connectors.installBase.update({
        _integrationIds: ['123454321'],
        connectorId: '12345',
      }));
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('connectors/12345/installBase'));
    });
  });
});

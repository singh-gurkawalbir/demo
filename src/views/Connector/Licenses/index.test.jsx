/* global describe, test, expect, jest, beforeEach, afterEach */
import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, cleanup, waitFor } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders } from '../../../test/test-utils';
import Licenses from '.';
import { runServer } from '../../../test/api/server';
import { getCreatedStore } from '../../../store';
import * as utils from '../../../utils/resource';
import actions from '../../../actions';

let initialStore;
const mockHistoryPush = jest.fn();
const mockReplace = jest.fn();

function store(connectors, connectorLicenses) {
  initialStore.getState().data.resources.connectors = [
    {
      _id: '12345',
      name: connectors.name,
      contactEmail: 'testuser@celigo.com',
      _integrationId: connectors._integrationId,
      framework: 'twoDotZero',
      twoDotZero: {
        _integrationId: 'connectors._integrationId',
        editions: [],
        isParentChild: false,
      },
    },
  ];
  initialStore.getState().data.resources.integrations = [{
    _id: connectors._integrationId,
    name: 'Test Integration',
  }];
  initialStore.getState().user.preferences = {
    environment: 'production',
    dateFormat: 'MM/DD/YYYY',
  };
  initialStore.getState().data.resources.connectorLicenses = connectorLicenses;
}

async function initLicenses(props) {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/connectors/12345/connectorLicenses'}]}>
      <Route>
        <Licenses {...props} />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}
jest.mock('../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/LoadResources'),
  default: newprops => (
    <div>{newprops.children}</div>
  ),
}
));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: mockReplace,
  }),
}));
describe('Licenses', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    jest.useFakeTimers();
    jest.setTimeout(100000);
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllTimers();
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    cleanup();
  });
  test('Should able to test the licenses page with no license', async () => {
    const props = {
      match: {
        path: '/connectors/:connectorId/connectorLicenses',
        url: '/connectors/12345/connectorLicenses',
        isExact: true,
        params: {
          connectorId: '12345',
        },
      },
      history: {
        length: 50,
        action: 'POP',
        push: mockHistoryPush,
        location: {
          pathname: '/connectors/12345/connectorLicenses',
          search: '',
          hash: '',
          key: 'jndug8',
        },
      },
      location: {
        pathname: '/connectors/12345/connectorLicenses',
        search: '',
        hash: '',
        key: 'jndug8',
      },
    };
    const connectors = {
      name: 'Test',
      _integrationId: '123454321',
    };
    const connectorLicenses = [
    ];

    store(connectors, connectorLicenses);
    await initLicenses(props);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('connectors/12345/licenses'));
    const headingNode = screen.getByRole('heading', {name: 'Licenses: Test'});

    expect(headingNode).toBeInTheDocument();
    const newLicenseButtonNode = screen.getByRole('button', {name: 'New license'});

    expect(newLicenseButtonNode).toBeInTheDocument();
    const noLicenceNode = screen.getByText(/You don't have any licenses/i);

    expect(noLicenceNode).toBeInTheDocument();
    userEvent.click(newLicenseButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchStaged('somegeneratedID', [
      {
        op: 'add',
        path: '/_connectorId',
        value: '12345',
      },
      {
        op: 'add',
        path: '/type',
        value: 'integrationApp',
      },
    ], 'value'));
    expect(mockHistoryPush).toHaveBeenCalledTimes(1);
  });
  test('Should able to test the back button on license page', async () => {
    const props = {
      match: {
        path: '/connectors/:connectorId/connectorLicenses',
        url: '/connectors/12345/connectorLicenses',
        isExact: true,
        params: {
          connectorId: '12345',
        },
      },
      history: {
        length: 50,
        action: 'POP',
        push: mockHistoryPush,
        location: {
          pathname: '/connectors/12345/connectorLicenses',
          search: '',
          hash: '',
          key: 'jndug8',
        },
      },
      location: {
        pathname: '/connectors/12345/connectorLicenses',
        search: '',
        hash: '',
        key: 'jndug8',
      },
    };
    const connectors = {
      name: 'Test',
      _integrationId: '123454321',
    };
    const connectorLicenses = [
    ];

    store(connectors, connectorLicenses);
    await initLicenses(props);
    const backButtonNode = screen.getAllByRole('button');

    expect(backButtonNode[0]).toBeInTheDocument();
    userEvent.click(backButtonNode[0]);
    expect(mockReplace).toHaveBeenCalledTimes(1);
  });
  test('Should able to test the search button on license page', async () => {
    const props = {
      match: {
        path: '/connectors/:connectorId/connectorLicenses',
        url: '/connectors/12345/connectorLicenses',
        isExact: true,
        params: {
          connectorId: '12345',
        },
      },
      history: {
        length: 50,
        action: 'POP',
        push: mockHistoryPush,
        location: {
          pathname: '/connectors/12345/connectorLicenses',
          search: '',
          hash: '',
          key: 'jndug8',
        },
      },
      location: {
        pathname: '/connectors/12345/connectorLicenses',
        search: '',
        hash: '',
        key: 'jndug8',
      },
    };
    const connectors = {
      name: 'Test',
      _integrationId: '123454321',
    };
    const connectorLicenses = [
      {
        _id: '654321',
        expires: '2022-01-10T18:29:59.999Z',
        created: '2022-08-28T19:09:16.164Z',
        sandbox: true,
        user: {
          email: 'testuser@test.com',
        },
        _connectorId: '12345',
      },
    ];

    store(connectors, connectorLicenses);
    await initLicenses(props);
    const searchButtonNode = screen.getByRole('textbox', {name: 'search'});

    expect(searchButtonNode).toBeInTheDocument();
    userEvent.type(searchButtonNode, 'Hey there!');
    await waitFor(() => expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria./i)).toBeInTheDocument());
    userEvent.clear(searchButtonNode);
    await waitFor(() => expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria./i)).not.toBeInTheDocument());
  });
  test('Should able to test the license page with no connectors', async () => {
    const props = {
      match: {
        path: '/connectors/:connectorId/connectorLicenses',
        url: '/connectors//connectorLicenses',
        isExact: true,
        params: {
          connectorId: '',
        },
      },
      history: {
        length: 50,
        action: 'POP',
        push: mockHistoryPush,
        location: {
          pathname: '/connectors//connectorLicenses',
          search: '',
          hash: '',
          key: 'jndug8',
        },
      },
      location: {
        pathname: '/connectors//connectorLicenses',
        search: '',
        hash: '',
        key: 'jndug8',
      },
    };
    const connectors = {
      name: 'Test',
      _integrationId: '123454321',
    };
    const connectorLicenses = [
      {
        _id: '654321',
        expires: '2022-01-10T18:29:59.999Z',
        created: '2022-08-28T19:09:16.164Z',
        sandbox: true,
        user: {
          email: 'testuser@test.com',
        },
      },
    ];

    store(connectors, connectorLicenses);
    const { utils } = await initLicenses(props);

    expect(utils.container.firstChild).toBeEmptyDOMElement();
  });
  test('Should able to test the license page with status as installed and environment as production', async () => {
    const props = {
      match: {
        path: '/connectors/:connectorId/connectorLicenses',
        url: '/connectors/12345/connectorLicenses',
        isExact: true,
        params: {
          connectorId: '12345',
        },
      },
      history: {
        length: 50,
        action: 'POP',
        push: mockHistoryPush,
        location: {
          pathname: '/connectors/12345/connectorLicenses',
          search: '',
          hash: '',
          key: 'jndug8',
        },
      },
      location: {
        pathname: '/connectors/12345/connectorLicenses',
        search: '',
        hash: '',
        key: 'jndug8',
      },
    };
    const connectors = {
      name: 'Test',
      _integrationId: '123454321',
    };
    const connectorLicenses = [
      {
        _id: '654321',
        expires: '2022-01-10T18:29:59.999Z',
        created: '2022-08-28T19:09:16.164Z',
        sandbox: false,
        user: {
          email: 'testuser@test.com',
        },
        _connectorId: '12345',
        _integrationId: '123454321',
      },
    ];

    store(connectors, connectorLicenses);
    await initLicenses(props);
    const emailColumnNode = screen.getByRole('columnheader', {name: 'Email'});

    expect(emailColumnNode).toBeInTheDocument();
    const statusColumnNode = screen.getByRole('columnheader', {name: 'Status'});

    expect(statusColumnNode).toBeInTheDocument();
    const createdColumnNode = screen.getByRole('columnheader', {name: 'Created'});

    expect(createdColumnNode).toBeInTheDocument();
    const integrationIdColumnNode = screen.getByRole('columnheader', {name: 'Integration ID'});

    expect(integrationIdColumnNode).toBeInTheDocument();
    const expiresColumnNode = screen.getByRole('columnheader', {name: 'Expires sorted descending'});

    expect(expiresColumnNode).toBeInTheDocument();
    const trialColumnNode = screen.getByRole('columnheader', {name: 'Trial expires sorted descending'});

    expect(trialColumnNode).toBeInTheDocument();
    const environmentNode = screen.getByRole('columnheader', {name: 'Environment'});

    expect(environmentNode).toBeInTheDocument();
    const actionsNode = screen.getByRole('columnheader', {name: 'Actions'});

    expect(actionsNode).toBeInTheDocument();
    const columnHeaderCountNode = screen.getAllByRole('columnheader');

    expect(columnHeaderCountNode).toHaveLength(8);
    const cellCountNode = screen.getAllByRole('cell');

    expect(cellCountNode).toHaveLength(8);
    const productionCellNode = screen.getByRole('cell', {name: 'Production'});

    expect(productionCellNode).toBeInTheDocument();
    const statusCellNode = screen.getByRole('cell', {name: 'Installed'});

    expect(statusCellNode).toBeInTheDocument();
    const moreButtonNode = screen.getByRole('button', {name: 'more'});

    expect(moreButtonNode).toBeInTheDocument();
    userEvent.click(moreButtonNode);
    const editLicenseButtonNode = await waitFor(() => screen.getByRole('menuitem', {name: 'Edit license'}));

    expect(editLicenseButtonNode).toBeInTheDocument();
    userEvent.click(editLicenseButtonNode);
    expect(editLicenseButtonNode).not.toBeInTheDocument();
    const linkNode = document.querySelector('[href="//edit/connectorLicenses/654321"]');

    expect(linkNode).toBeInTheDocument();
    userEvent.click(moreButtonNode);
    const deleteLicenseButtonNode = await waitFor(() => screen.getByRole('menuitem', {name: 'Delete license'}));

    expect(deleteLicenseButtonNode).toBeInTheDocument();
    userEvent.click(deleteLicenseButtonNode);
    expect(deleteLicenseButtonNode).not.toBeInTheDocument();
  });
  test('Should able to test the license page with the license type as integrationAppChild', async () => {
    const props = {
      match: {
        path: '/connectors/:connectorId/connectorLicenses',
        url: '/connectors/12345/connectorLicenses',
        isExact: true,
        params: {
          connectorId: '12345',
        },
      },
      history: {
        length: 50,
        action: 'POP',
        push: mockHistoryPush,
        location: {
          pathname: '/connectors/12345/connectorLicenses',
          search: '',
          hash: '',
          key: 'jndug8',
        },
      },
      location: {
        pathname: '/connectors/12345/connectorLicenses',
        search: '',
        hash: '',
        key: 'jndug8',
      },
    };
    const connectors = {
      name: 'Test',
      _integrationId: '123454321',
    };
    const connectorLicenses = [
      {
        _id: '654321',
        expires: '2022-01-10T18:29:59.999Z',
        created: '2022-08-28T19:09:16.164Z',
        sandbox: true,
        type: 'integrationAppChild',
        user: {
          email: 'testuser@test.com',
        },
        _connectorId: '12345',
      },
    ];

    store(connectors, connectorLicenses);
    await initLicenses(props);
    expect(screen.queryByText(/Sandbox/i)).not.toBeInTheDocument();
  });
});

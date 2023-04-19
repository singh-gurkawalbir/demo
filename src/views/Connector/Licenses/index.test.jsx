/* eslint-disable jest/max-expects */
import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
import { screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import Licenses from '.';
import { runServer } from '../../../test/api/server';
import { getCreatedStore } from '../../../store';
import * as utils from '../../../utils/resource';
import actions from '../../../actions';

let initialStore;
const mockHistoryPush = jest.fn();
const mockReplace = jest.fn();

function store(connectors, connectorLicenses) {
  mutateStore(initialStore, draft => {
    draft.data.resources.connectors = [
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
    draft.data.resources.integrations = [{
      _id: connectors._integrationId,
      name: 'Test Integration',
    }];
    draft.user.preferences = {
      environment: 'production',
      dateFormat: 'MM/DD/YYYY',
    };
    draft.data.resources.connectorLicenses = connectorLicenses;
  });
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
describe('licenses', () => {
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
    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    jest.clearAllMocks();
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    cleanup();
  });

  test('should able to test the license page with status as installed and environment as production', async () => {
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

    const columnHeaders = screen.getAllByRole('columnheader').map(e => e.textContent);

    expect(columnHeaders).toEqual([
      'Email',
      'Status',
      'Created',
      'Integration ID',
      'Expiressorted descending',
      'Trial expiressorted descending',
      'Environment',
      'Actions',
    ]);
    expect(screen.getByRole('rowheader', {name: connectorLicenses[0].user.email})).toBeInTheDocument();
    const rowValues = screen.getAllByRole('cell').map(e => e.textContent);

    expect(rowValues).toEqual([
      'Installed',
      '08/28/2022 7:09:16 pm',
      '123454321',
      '01/10/2022 (01/10/2022 6:29:59 pm)',
      '',
      'Production',
      '',
    ]);

    const actionsButton = screen.getByRole('button', {name: 'more'});

    expect(actionsButton).toBeInTheDocument();
    await userEvent.click(actionsButton);
    const editLicenseButtonNode = screen.getByRole('menuitem', {name: 'Edit license'});

    expect(editLicenseButtonNode).toBeInTheDocument();
    await userEvent.click(editLicenseButtonNode);
    expect(editLicenseButtonNode).not.toBeInTheDocument();
    const linkNode = screen.getByRole('link', {name: connectorLicenses[0].user.email});

    expect(linkNode).toHaveAttribute('href', '//edit/connectorLicenses/654321');
    await userEvent.click(actionsButton);
    const deleteLicenseButtonNode = screen.getByRole('menuitem', {name: 'Delete license'});

    expect(deleteLicenseButtonNode).toBeInTheDocument();
    await userEvent.click(deleteLicenseButtonNode);
    expect(deleteLicenseButtonNode).not.toBeInTheDocument();
  });
  test('should able to test the licenses page with no license', async () => {
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
    await userEvent.click(newLicenseButtonNode);
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
    ]));
    expect(mockHistoryPush).toHaveBeenCalledTimes(1);
  });
  test('should able to test the back button on license page', async () => {
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
    await userEvent.click(backButtonNode[0]);
    expect(mockReplace).toHaveBeenCalledTimes(1);
  });
  test('should able to test the search button on license page', async () => {
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
    const searchButtonNode = screen.getByRole('textbox', {name: /search/i});

    expect(searchButtonNode).toBeInTheDocument();
    userEvent.type(searchButtonNode, 'Hey there!');
    await waitFor(() => expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria./i)).toBeInTheDocument());
    userEvent.clear(searchButtonNode);
    await waitFor(() => expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria./i)).not.toBeInTheDocument());
  });
  test('should able to test the license page with no connectors', async () => {
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
  test('should able to test the license page with the license type as integrationAppChild', async () => {
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

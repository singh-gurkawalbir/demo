import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import {renderWithProviders, reduxStore, mutateStore} from '../../../test/test-utils';
import OfflineConnectionDrawer from '.';

const mockHistoryReplace = jest.fn();
const mockHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
    goBack: mockHistoryGoBack,
  }),
}));

jest.mock('../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/LoadResources'),
  default: props => (
    <div>{props.children}</div>
  ),
}));

jest.mock('../../../components/ResourceFormFactory', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/ResourceFormFactory'),
  default: props => (
    <button type="button" onClick={props.onSubmitComplete}>Submit</button>
  ),
}));

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.resources.tiles = [
    {
      _integrationId: '5d2c5f22c6f53438803dd3b7',
      offlineConnections: [
        '5d53a5cdfb8d224f46042989',
        '5d53a5cdfb8d224f46042990',
      ],
    },
    {
      _integrationId: '5d2c5f22c6f53438803dd3b8',
      offlineConnections: [],
    },
    {
      _integrationId: '5d2c5f22c6f53438803dd3b9',
      offlineConnections: ['5d53a5cdfb8d224f46042991'],
    },
  ];

  draft.data.resources.connections = [
    {
      _id: '5d53a5cdfb8d224f46042989',
      name: 'First Connection',
    },
    {
      _id: '5d53a5cdfb8d224f46042990',
      name: 'Second Connection',
    },
    {
      _id: '5d53a5cdfb8d224f46042991',
    },
  ];

  draft.data.resources.integrations = [
    {
      _id: '5d2c5f22c6f53438803dd3b7',
      _registeredConnectionIds: [
        '5d53a5cdfb8d224f46042989',
        '5d53a5cdfb8d224f46042990',
      ],
    },
    {
      _id: '5d2c5f22c6f53438803dd3b9',
      _registeredConnectionIds: [
        '5d53a5cdfb8d224f46042991',
      ],
    },
  ];
});

function initOfflineConnectionDrawer(connectionId, integrationId = '5d2c5f22c6f53438803dd3b7') {
  const ui = (
    <MemoryRouter initialEntries={[`/parentId/${integrationId}/offlineconnections/${connectionId}`]}>
      <Route path="/parentId">
        <OfflineConnectionDrawer />
      </Route>
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe('OfflineConnectionDrawer UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should call history replace when the current connection is the last connection', async () => {
    initOfflineConnectionDrawer('5d53a5cdfb8d224f46042990');

    const links = screen.getAllByRole('link');

    expect(links[0].textContent).toBe('First Connection');
    expect(links[1].textContent).toBe('Second Connection');

    await userEvent.click(screen.getByText('Submit'));
    expect(mockHistoryGoBack).toHaveBeenCalled();
  });
  test('should call history replace when the current connection is not the last connection', async () => {
    initOfflineConnectionDrawer('5d53a5cdfb8d224f46042989');
    await userEvent.click(screen.getByText('Submit'));
    expect(mockHistoryReplace).toHaveBeenCalledWith('5d53a5cdfb8d224f46042990');
  });
  test('should not show any offline connection when no offline connection are present in tile', () => {
    initOfflineConnectionDrawer('5d53a5cdfb8d224f46042989', '5d2c5f22c6f53438803dd3b8');

    const list = screen.queryByRole('list');

    expect(list).toBeNull();
  });
  test('should show connection Id as name when connection has no name', () => {
    initOfflineConnectionDrawer('5d53a5cdfb8d224f46042991', '5d2c5f22c6f53438803dd3b9');

    expect(screen.getByText('5d53a5cdfb8d224f46042991')).toBeInTheDocument();
  });
  test('should show empty dom element when invalid props provided', () => {
    const {utils} = renderWithProviders(
      <MemoryRouter initialEntries={['/parentId/randomtext']}>
        <Route path="/parentId">
          <OfflineConnectionDrawer />
        </Route>
      </MemoryRouter>
    );

    expect(utils.container).toBeEmptyDOMElement();
  });
});

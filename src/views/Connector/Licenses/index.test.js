/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Licenses from '.';
import { runServer } from '../../../test/api/server';
import actions from '../../../actions';
import { SCOPES } from '../../../sagas/resourceForm';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';

async function initMarketplace({
  props = {
    match: {
      params: {
        connectorId: 'connector_id',
      },
    },
  },
  connectorLicenses = [],
  keyword = '',
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().session.loadResources = {
    connectorLicenses: 'received',
    integrations: 'received',
  };
  initialStore.getState().data.resources = {
    connectorLicenses,
    connectors: [
      {
        name: 'Mock Connector 1',
        _id: 'connector_id_1',
        framework: 'twoDotZero',
      },
      {
        name: 'Mock Connector 2',
        _id: 'connector_id_2',
      },
    ],
  };

  initialStore.getState().session.filters = {
    connectorLicenses: {
      keyword,
      take: 100,
    },
  };
  initialStore.getState().comms.networkComms[`GET:/connectors/${props.match.params.connectorId}/licenses`] = {
    method: 'GET',
    status: 'success',
  };
  const ui = (
    <MemoryRouter>
      <Licenses {...props} />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

jest.mock('../../../utils/resource', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/resource'),
  generateNewId: () => 'mock_new_id',
}));

describe('Licenses test cases', () => {
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
    mockDispatchFn.mockClear();
  });

  test('should pass the initial render with default value/pass the wrong id', async () => {
    const { utils } = await initMarketplace();

    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render by creating new license with twoDotZero', async () => {
    const history = [];

    await initMarketplace({
      props: {
        match: {
          params: {
            connectorId: 'connector_id_1',
          },
        },
        location: {
          pathname: '/',
        },
        history,
      },
    });
    const newLicense = screen.getByRole('button', { name: /New license/i});

    expect(newLicense).toBeInTheDocument();
    expect(screen.queryByText(/You don't have any licenses/)).toBeInTheDocument();
    await userEvent.click(newLicense);

    expect(mockDispatchFn).toBeCalledWith(actions.resource.patchStaged('mock_new_id', [
      { op: 'add', path: '/_connectorId', value: 'connector_id_1' },
      { op: 'add', path: '/type', value: 'integrationApp' },
    ], SCOPES.VALUE));
    expect(history).toEqual([
      buildDrawerUrl({
        path: drawerPaths.RESOURCE.ADD,
        baseUrl: '/',
        params: { resourceType: 'connectorLicenses', id: 'mock_new_id' },
      }),
    ]);
  });

  test('should pass the initial render by creating new license without twoDotZero', async () => {
    const history = [];

    await initMarketplace({
      props: {
        match: {
          params: {
            connectorId: 'connector_id_2',
          },
        },
        location: {
          pathname: '/',
        },
        history,
      },
    });
    const newLicense = screen.getByRole('button', { name: /New license/i});

    expect(newLicense).toBeInTheDocument();
    expect(screen.queryByText(/You don't have any licenses/)).toBeInTheDocument();
    await userEvent.click(newLicense);

    expect(mockDispatchFn).toBeCalledWith(actions.resource.patchStaged('mock_new_id', [
      { op: 'add', path: '/_connectorId', value: 'connector_id_2' },
    ], SCOPES.VALUE));
    expect(history).toEqual([
      buildDrawerUrl({
        path: drawerPaths.RESOURCE.ADD,
        baseUrl: '/',
        params: { resourceType: 'connectorLicenses', id: 'mock_new_id' },
      }),
    ]);
  });

  test('should pass the initial render by having license data', async () => {
    await initMarketplace({
      props: {
        match: {
          params: {
            connectorId: 'connector_id_1',
          },
        },
      },
      connectorLicenses: [
        {
          _id: 'license_id_1',
          type: 'integrationApp',
          _connectorId: 'connector_id_1',
          user: {
            email: 'license1@celigo.com',
          },
        },
      ],
    });
    const newLicense = screen.getByRole('button', { name: /New license/});

    expect(newLicense).toBeInTheDocument();
    expect(screen.queryByText(/license1@celigo.com/)).toBeInTheDocument();
  });

  test('should pass the initial render by search keyword', async () => {
    await initMarketplace({
      props: {
        match: {
          params: {
            connectorId: 'connector_id_1',
          },
        },
      },
      connectorLicenses: [
        {
          _id: 'license_id_1',
          type: 'integrationApp',
          _connectorId: 'connector_id_1',
          user: {
            email: 'license1@celigo.com',
          },
        },
      ],
      keyword: 'doesntmatchkeyword',
    });
    const newLicense = screen.getByRole('button', { name: /New license/});

    expect(newLicense).toBeInTheDocument();
    expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria./)).toBeInTheDocument();
  });
});

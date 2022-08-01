/* global describe, test, expect */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import LicenseTable from './licenseTable';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';

async function initLicenseTable({
  type = 'endpoints',
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources = {
    connections: [{
      _id: 'connection_id_1',
      name: 'Connection name 1',
    }],
    flows: [{
      _id: 'flow_id_1',
      name: 'flow name 1',
      _integrationId: 'integration_id_1',
    }, {
      _id: 'flow_id_2',
      name: 'flow name 2',
    }],
    agents: [{
      _id: 'agent_id_1',
      name: 'agent name 1',
    }],
    integrations: [{
      _id: 'integration_id_1',
      name: 'integration name 1',
    }],
  };
  initialStore.getState().session.resource = {
    licenseEntitlementUsage: {
      production: {
        endpointUsage: {
          endpoints: [{
            type: 'netsuite',
            connections: [{
              _id: 'connection_id_1',
            }],
          }],
        },
        flowUsage: {
          flows: [{
            _id: 'flow_id_1',
          }, {
            _id: 'flow_id_2',
          }],
        },
        tradingPartnerUsage: {
          tradingPartners: [{
            _id: 'connection_id_1',
          }],
        },
        agentUsage: {
          agents: [
            {
              _id: 'agent_id_1',
            },
          ],
        },
      },
    },
  };
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/myAccount/subscription/production/${type}`}]}
    >
      <Route
        path="/myAccount/subscription/:env/:type"
      >
        <LicenseTable />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('LicenseTable test cases', () => {
  runServer();

  test('should pass the initial render with default value/endpoints', async () => {
    await initLicenseTable();

    expect(screen.queryByText(/using/i)).toBeInTheDocument();
    expect(screen.queryByText(/of/i)).toBeInTheDocument();
    expect(screen.queryByText(/Connection name 1/i)).toBeInTheDocument();
  });

  test('should pass the initial render with flows', async () => {
    await initLicenseTable({
      type: 'flows',
      env: 'production',
    });

    expect(screen.queryByText(/using/i)).toBeInTheDocument();
    expect(screen.queryByText(/of/i)).toBeInTheDocument();
    expect(screen.queryByText(/flow name 1/i)).toBeInTheDocument();
  });

  test('should pass the initial render with tradingpartners', async () => {
    await initLicenseTable({
      type: 'tradingpartners',
      env: 'production',
    });

    expect(screen.queryByText(/using/i)).toBeInTheDocument();
    expect(screen.queryByText(/of/i)).toBeInTheDocument();
    expect(screen.queryByText(/Connection name 1/i)).toBeInTheDocument();
  });

  test('should pass the initial render with agents', async () => {
    await initLicenseTable({
      type: 'agents',
      env: 'production',
    });

    expect(screen.queryByText(/using/i)).toBeInTheDocument();
    expect(screen.queryByText(/of/i)).toBeInTheDocument();
    expect(screen.queryByText(/agent name 1/i)).toBeInTheDocument();
  });
});

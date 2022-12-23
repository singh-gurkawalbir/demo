/* global describe, expect, jest, test */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import DynaIAExpression from './DynaIAExpression';

jest.mock('./DynaNetSuiteLookup_afe', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaNetSuiteLookup_afe'),
  default: ({options, resourceType}) => (
    <div data-testid="dynaNSlookup">
      <div data-testid="options">{JSON.stringify(options)}</div>
      <div data-testid="resourceType">{resourceType}</div>
    </div>
  ),
}));

jest.mock('./DynaNetSuiteQualifier_afe', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaNetSuiteQualifier_afe'),
  default: ({options, resourceType}) => (
    <div data-testid="dynaNSqualifier">
      <div data-testid="options">{JSON.stringify(options)}</div>
      <div data-testid="resourceType">{resourceType}</div>
    </div>
  ),
}));

jest.mock('./DynaSalesforceLookup_afe', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaSalesforceLookup_afe'),
  default: ({options, resourceType}) => (
    <div data-testid="dynaSFlookup">
      <div data-testid="options">{JSON.stringify(options)}</div>
      <div data-testid="resourceType">{resourceType}</div>
    </div>
  ),
}));

jest.mock('./DynaSalesforceQualifier_afe', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaSalesforceQualifier_afe'),
  default: ({options, resourceType}) => (
    <div data-testid="dynaSFqualifier">
      <div data-testid="options">{JSON.stringify(options)}</div>
      <div data-testid="resourceType">{resourceType}</div>
    </div>
  ),
}));

describe('test suite for DynaIAExpression field', () => {
  test('should not render the field if connection details not available', () => {
    renderWithProviders(<DynaIAExpression />);
    expect(document.querySelector('body > div')).toBeEmptyDOMElement();
  });

  test('should render correct expression builder field for netsuite import', () => {
    const connectionId = 'connection-123';
    const props = {
      flowId: 'flow-123',
      properties: { _importId: 'import-123' },
      expressionType: 'import',
      _integrationId: 'integration-123',
    };
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.imports = [{
      _id: props.properties._importId,
      name: 'NS Import',
      _connectionId: connectionId,
      netsuite_da: { recordType: 'customer' },
    }];
    initialStore.getState().data.resources.connections = [{
      _id: connectionId,
      type: 'netsuite',
    }];

    renderWithProviders(<DynaIAExpression {...props} />, {initialStore});
    expect(screen.getByTestId('dynaNSlookup')).toBeInTheDocument();
    expect(screen.getByTestId('resourceType')).toHaveTextContent('imports');
    expect(screen.getByTestId('options')).toHaveTextContent(JSON.stringify({
      commMetaPath: 'netsuite/metadata/suitescript/connections/connection-123/recordTypes/customer/searchFilters?includeJoinFilters=true',
      disableFetch: false,
      hasSObjectType: false,
    }));
  });

  test('should render correct expression builder field for salesforce import', () => {
    const connectionId = 'connection-123';
    const importId = 'import-123';
    const props = {
      flowId: 'flow-123',
      expressionType: 'import',
      _integrationId: 'integration-123',
    };
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.flows = [{
      _id: props.flowId,
      pageProcessors: [{
        _importId: importId,
      }],
    }];
    initialStore.getState().data.resources.imports = [{
      _id: importId,
      name: 'SF Import',
      _connectionId: connectionId,
      salesforce: { sObjectType: 'Opportunity' },
    }];
    initialStore.getState().data.resources.connections = [{
      _id: connectionId,
      type: 'salesforce',
    }];

    renderWithProviders(<DynaIAExpression {...props} />, {initialStore});
    expect(screen.getByTestId('dynaSFlookup')).toBeInTheDocument();
    expect(screen.getByTestId('resourceType')).toHaveTextContent('imports');
    expect(screen.getByTestId('options')).toHaveTextContent(JSON.stringify({
      commMetaPath: 'salesforce/metadata/connections/connection-123/sObjectTypes/Opportunity',
      disableFetch: false,
      sObjectType: 'Opportunity',
      hasSObjectType: true,
    }));
  });

  test('should render correct expression builder field for salesforce export', () => {
    const connectionId = 'connection-123';
    const exportId = 'export-123';
    const props = {
      flowId: 'flow-123',
      expressionType: 'export',
      _integrationId: 'integration-123',
    };
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.flows = [{
      _id: props.flowId,
      pageGenerators: [{
        _exportId: exportId,
      }],
    }];
    initialStore.getState().data.resources.exports = [{
      _id: exportId,
      name: 'SF Export',
      _connectionId: connectionId,
      salesforce: { sObjectType: 'Opportunity' },
    }];
    initialStore.getState().data.resources.connections = [{
      _id: connectionId,
      type: 'salesforce',
    }];

    renderWithProviders(<DynaIAExpression {...props} />, {initialStore});
    expect(screen.getByTestId('dynaSFqualifier')).toBeInTheDocument();
    expect(screen.getByTestId('resourceType')).toHaveTextContent('exports');
    expect(screen.getByTestId('options')).toHaveTextContent(JSON.stringify({
      commMetaPath: 'salesforce/metadata/connections/connection-123/sObjectTypes/Opportunity',
      disableFetch: false,
      sObjectType: 'Opportunity',
      hasSObjectType: true,
    }));
  });

  test('should render correct expression builder field for other exports', () => {
    const connectionId = 'connection-123';
    const props = {
      flowId: 'flow-123',
      properties: { _exportId: 'export-123' },
      expressionType: 'export',
      _integrationId: 'integration-123',
    };
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.exports = [{
      _id: props.properties._exportId,
      name: 'NS Export',
      _connectionId: connectionId,
      netsuite: {
        distributed: { recordType: 'customer' },
      },
    }];
    initialStore.getState().data.resources.connections = [{
      _id: connectionId,
      type: 'netsuite',
    }];

    renderWithProviders(<DynaIAExpression {...props} />, {initialStore});
    expect(screen.getByTestId('dynaNSqualifier')).toBeInTheDocument();
    expect(screen.getByTestId('resourceType')).toHaveTextContent('exports');
    expect(screen.getByTestId('options')).toHaveTextContent(JSON.stringify({
      commMetaPath: 'netsuite/metadata/suitescript/connections/connection-123/recordTypes/customer?includeSelectOptions=true',
      disableFetch: false,
      hasSObjectType: false,
    }));
  });

  test('should render correct expression builder field for given recordType', () => {
    const connectionId = 'connection-123';
    const integrationId = 'integration-123';
    const props = {
      flowId: 'flow-123',
      _integrationId: integrationId,
      recordType: 'customer',
    };
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.connections = [{
      _id: connectionId,
      type: 'netsuite',
      _integrationId: integrationId,
    }];

    renderWithProviders(<DynaIAExpression {...props} />, {initialStore});
    expect(screen.getByTestId('dynaNSlookup')).toBeInTheDocument();
    expect(screen.getByTestId('resourceType')).toHaveTextContent('imports');
    expect(screen.getByTestId('options')).toHaveTextContent(JSON.stringify({
      commMetaPath: 'netsuite/metadata/suitescript/connections/connection-123/recordTypes/customer/searchFilters?includeJoinFilters=true',
      disableFetch: false,
      hasSObjectType: false,
    }));
  });
});

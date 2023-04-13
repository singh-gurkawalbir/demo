
import { screen } from '@testing-library/react';
import React from 'react';
import ConnectorName from '.';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import * as Resource from '../../../../utils/resource';
import * as HTTPConnector from '../../../../constants/applications';

let initialStore;

function initConnectorName({resource}) {
  mutateStore(initialStore, draft => {
    draft.data.resources.connections = [{
      _id: 23456,
      http: {
        _httpConnectorId: 9876,
      },
    },
    {
      _id: 56789,
      name: 'Testing RDBMS Connection',
      rdbms: {
        type: 'bigquery',
      },
    },
    {
      _id: 1234,
      name: 'NS jdbc connection',
      jdbc: {
        type: 'netsuitejdbc',
      },
    },
    ];
  });
  const ui = (
    <ConnectorName resource={resource} />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('testsuite for ConnectorName', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  test('should test the data loader text when the type of connection is simple', () => {
    jest.spyOn(Resource, 'getResourceSubType').mockReturnValueOnce({
      type: 'simple',
    });
    const resource = {
      _id: '23456',
      type: 'simple',
    };

    initConnectorName({resource});
    expect(screen.getByText(/data loader/i)).toBeInTheDocument();
  });
  test('should test the http connector name when the http connector id is passed in props', () => {
    jest.spyOn(HTTPConnector, 'getHttpConnector').mockReturnValueOnce({
      _id: 9876,
      name: 'Testing HTTP Connector Name',
    });
    const resource = {
      _id: 23456,
      type: 'connections',
    };

    initConnectorName({resource});
    expect(screen.getByText(/Testing HTTP Connector Name/i)).toBeInTheDocument();
  });
  test('should test the RDBMS connection name when the type is rdbms', () => {
    jest.spyOn(HTTPConnector, 'getApp').mockReturnValueOnce({
      _id: 56789,
      name: 'Testing RDBMS Connection Name',
    });
    const resource = {
      _connectionId: 56789,
      type: 'rdbms',
      rdbms: {
        type: 'bigquery',
      },
    };

    initConnectorName({resource});
    expect(screen.getByText(/Testing RDBMS Connection Name/i)).toBeInTheDocument();
  });
  test('should test the connection name when the type is REST', () => {
    jest.spyOn(HTTPConnector, 'getApp').mockReturnValueOnce({
      _id: 56789,
      name: 'Testing REST Connection Name',
    });
    const resource = {
      _id: 56789,
      type: 'rest',
      http: {
        formType: 'rest',
      },
    };

    initConnectorName({resource});
    expect(screen.getByText(/Testing REST Connection Name/)).toBeInTheDocument();
  });
  test('should test the connection name when the type is REST and the connection name is HTTP', () => {
    jest.spyOn(HTTPConnector, 'getApp').mockReturnValueOnce({
      _id: 56789,
      name: 'HTTP',
    });
    const resource = {
      _id: 56789,
      type: 'rest',
      http: {
        formType: 'rest',
      },
    };

    initConnectorName({resource});
    expect(screen.getByText(/REST API/i)).toBeInTheDocument();
  });
  test('should test the name of RDBMS export when the type is RDBMS and adaptor type is RDBMS export', () => {
    jest.spyOn(HTTPConnector, 'getApp').mockReturnValueOnce({
      _id: 56789,
      name: 'Test RDBMS Export',
    });
    const resource = {
      _connectionId: 56789,
      type: 'rdbms',
      adaptorType: 'RDBMSExport',
      http: {
        formType: 'rest',
      },
    };

    initConnectorName({resource});
    expect(screen.getByText(/Test RDBMS Export/i)).toBeInTheDocument();
  });
  test('should test the name of RDBMS import when the type is RDBMS and adaptor type is RDBMS import', () => {
    jest.spyOn(HTTPConnector, 'getApp').mockReturnValueOnce({
      _id: 56789,
      name: 'Test RDBMS Import',
    });
    const resource = {
      _connectionId: 56789,
      type: 'rdbms',
      adaptorType: 'RDBMSImport',
      http: {
        formType: 'rest',
      },
    };

    initConnectorName({resource});
    expect(screen.getByText(/Test RDBMS Import/i)).toBeInTheDocument();
  });
  test('should test the RDMS name when the resource type is RDBMS', () => {
    const resource = {
      _connectionId: 56789,
      type: 'rdbms',
    };

    initConnectorName({resource});
    expect(screen.getByText(/rdbms/i)).toBeInTheDocument();
  });
  test('should test the NesuiteJdbc name when the resource type is jdbc', () => {
    const resource = {
      _connectionId: 1234,
      type: 'jdbc',
      adaptorType: 'JDBCExport',
    };

    initConnectorName({resource});
    expect(screen.getByText('NetSuite JDBC')).toBeInTheDocument();
  });
});

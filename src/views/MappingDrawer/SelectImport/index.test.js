
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import SelectImport from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';

async function initSelectImport({
  importId = 'import_id',
  flowId = 'flow_id',
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources = {
    imports: [
      {
        _id: 'import_id',
        name: 'import name',
        adaptorType: 'RDBMSImport',
        rdbms: {
          queryType: [
            'UPDATE',
            'INSERT',
          ],
        },
      },
      {
        _id: 'import_id_1',
        adaptorType: 'DynamodbImport',
        dynamodb: {
          method: 'putItem',
        },
      },
      {
        _id: 'import_id_5',
        adaptorType: 'NetSuiteImport',
        netsuite_da: {
          mapping: {
            fields: [{
              generate: 'item[*].id',
              subRecordMapping: {
                recordType: 'recordType',
                jsonPath: 'jsonPath',
              },
            }, {
              generate: 'generate_1[*].id',
              subRecordMapping: {
                recordType: 'recordType 1',
                jsonPath: 'jsonPath 1',
              },
            }],
          },
        },
      },
      {
        _id: 'import_id_6',
        adaptorType: 'NetSuiteImport',
        netsuite_da: {
          mapping: {
            fields: [{
              generate: 'generate',
              subRecordMapping: {
                recordType: 'recordType',
                jsonPath: 'jsonPath',
              },
            }],
          },
        },
      },
    ],
    flows: [{
      _id: 'flow_id_1',
      pageProcessors: [
        {
          type: 'import',
          _importId: 'import_id',
        },
        {
          type: 'import',
          _importId: 'import_id_1',
        },
        {
          type: 'import',
          _importId: 'import_id_5',
        },
        {
          type: 'import',
          _importId: 'import_id_6',
        },
      ],
    }, {
      _id: 'flow_id_2',
      name: 'flow name 2',
      pageProcessors: [],
    }],
  };

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/flows/queryBuilder/${flowId}${importId ? `/${importId}` : ''}`}]}
    >
      <Route path={`/flows/queryBuilder/:flowId${importId ? '/:importId' : ''}`}>
        <SelectImport />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

const mockRedirect = jest.fn(() => (<></>));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Redirect: props => mockRedirect(props.to),
}));

describe('SelectImport_afe test cases', () => {
  runServer();

  afterEach(() => {
    mockRedirect.mockClear();
  });

  test('should pass the initial render with default value/ invalid flow id', async () => {
    await initSelectImport();

    expect(screen.queryByText(/No flow exists with id: flow_id/i)).toBeInTheDocument();
  });

  test('should pass the initial render with selected import id', async () => {
    await initSelectImport({
      flowId: 'flow_id_1',
    });

    expect(mockRedirect).toBeCalledWith('/flows/queryBuilder/flow_id_1/import_id');
  });

  test('should pass the initial render with no imports', async () => {
    await initSelectImport({
      flowId: 'flow_id_2',
      importId: 'import_id__1',
    });

    expect(screen.queryByText(/The flow "flow name 2", contains no imports./i)).toBeInTheDocument();
  });

  test('should pass the initial render with multiple imports with subRecords', async () => {
    await initSelectImport({
      flowId: 'flow_id_1',
      importId: null,
    });

    expect(screen.queryByText(/Select the mapping you would like to edit./i)).toBeInTheDocument();
    expect(screen.queryByText(/Step name/i)).toBeInTheDocument();
    expect(screen.queryByText(/import name/i)).toBeInTheDocument();
    expect(screen.queryByText(/import_id_1/i)).toBeInTheDocument(); // name is not present Id should display
    expect(screen.queryByText('import_id_5')).toBeInTheDocument();
    expect(screen.queryByText('import_id_5 - Items : item[*].id (Subrecord)')).toBeInTheDocument();
    expect(screen.queryByText('import_id_5 - generate_1 : generate_1[*].id (Subrecord)')).toBeInTheDocument();
    expect(screen.queryByText('import_id_6')).toBeInTheDocument();
    expect(screen.queryByText('import_id_6 - generate (Subrecord)')).toBeInTheDocument();
  });

  test('should pass the initial render with multiple imports with sub record selected', async () => {
    await initSelectImport({
      flowId: 'flow_id_1',
      importId: 'import_id_6',
    });

    expect(screen.queryByText(/Select the mapping you would like to edit./i)).toBeInTheDocument();
    expect(screen.queryByText(/Step name/i)).toBeInTheDocument();
    expect(screen.queryByText('import_id_6')).toBeInTheDocument();
    expect(screen.queryByText('import_id_6 - generate (Subrecord)')).toBeInTheDocument();
  });
});

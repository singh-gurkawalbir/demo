import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TopPanel from './TopPanel';
import actions from '../../actions';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import customCloneDeep from '../../utils/customCloneDeep';

async function initTopPanel({ props = {}, adaptorType = 'HTTPImport' } = {}) {
  const initialStore = customCloneDeep(reduxStore);

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      imports: [{
        _id: 'import_id',
        _connectionId: 'connection_id_1',
        adaptorType,
        sampleData: {
          name: 'name',
        },
        mapping: {
          fields: [{
            generate: props.subRecordMappingId,
            subRecordMapping: {
              recordType: 'inventorydetail',
              jsonPath: 'mediaitem',
            },
          }, {
            generate: 'generate_2',
            lookupName: 'lookup_name',
          }],
        },
      }, {
        _id: 'import_id_2',
        _connectorId: 'connector_id',
        _connectionId: 'connection_id_1',
        adaptorType,
        sampleData: {
          name: 'name',
        },
        mapping: {
          fields: [{
            generate: 'generate_2',
            lookupName: 'lookup_name',
          }],
        },
      }],
      flows: [{
        _id: props.flowId,
      }],
      exports: [{
        _id: 'export_id',
      }],
    };
    draft.session.flowData = {
      flow_id: {
        pageGenerators: [{
          type: 'export',
          _exportId: 'export_id',
        }],
        pageProcessors: [{
          type: 'import',
          _importId: props.importId,
          sampleDataStage: {
            status: 'requested',
          },
        }],
        pageGeneratorsMap: [],
        pageProcessorsMap: [],
      },
    };
    draft.session.importSampleData = {
      import_id_2: {
        status: 'requested',
        data: {
          No: '10000',
          Name: 'Adatum Corporation',
        },
      },
    };
  });
  const ui = (
    <MemoryRouter>
      <TopPanel {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('topPanel component Test cases', () => {
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
  });
  test('should pass the initial render with default values', async () => {
    await initTopPanel();
    expect(screen.queryByText(/Source record field/i)).toBeInTheDocument();
    expect(screen.queryByText(/Destination record field ()/i)).toBeInTheDocument();
  });

  test('should pass the initial render with custom props', async () => {
    await initTopPanel({
      props: {
        flowId: 'flow_id',
        importId: 'import_id',
        disabled: false,
        subRecordMappingId: 'subRecord_mapping_id_1',
      },
      adaptorType: 'NetSuiteImport',
    });

    expect(screen.queryByText(/Source record field/i)).toBeInTheDocument();
    expect(screen.queryByText(/Destination record field ()/i)).toBeInTheDocument();
    const refreshExtracts = screen.getAllByRole('button').find(eachButton => eachButton.getAttribute('data-test') === 'refreshExtracts');
    const refreshGenerates = screen.getAllByRole('button').find(eachButton => eachButton.getAttribute('data-test') === 'refreshGenerates');

    expect(refreshExtracts).toBeInTheDocument();
    expect(refreshGenerates).toBeInTheDocument();
    await userEvent.click(refreshExtracts);
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.flowData.requestSampleData(
      'flow_id',
      'import_id',
      'imports',
      'importMappingExtract',
      true
    ));

    await userEvent.click(refreshGenerates);
    expect(mockDispatchFn).toHaveBeenCalledTimes(2);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.refreshGenerates());
  });

  test('should render the Source record and destination record fields', async () => {
    await initTopPanel({
      props: {
        flowId: 'flow_id',
        importId: 'import_id_2',
        disabled: false,
      },
    });

    expect(screen.queryByText(/Source record field/i)).toBeInTheDocument();
    expect(screen.queryByText(/Destination record field ()/i)).toBeInTheDocument();
  });
});

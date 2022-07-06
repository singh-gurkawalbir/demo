/* global describe, test, expect, jest, beforeEach, afterEach */
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MappingWrapper from './MappingWrapper';
import actions from '../../actions';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore } from '../../test/test-utils';

async function initMappingWrapper({
  props = {
    importId: 'import_id',
    flowId: 'flow_id',
  },
  exportId = 'export_id',
  adaptorType = 'NetSuiteImport',
  validationErrMsg = null,
  status = 'received',
} = {}) {
  const initialStore = cloneDeep(reduxStore);

  initialStore.getState().session.mapping = {
    mapping: {
      flowId: 'flow_id',
      status,
      mappings: [{
        generate: 'generate_1',
        key: 'key_1',
      }, {
        generate: 'generate_2',
        key: 'key_2',
      }, {
        generate: 'generate_3',
        key: 'key_3',
      }],
      validationErrMsg,
      saveStatus: '',
      mappingsCopy: [],
      subRecordMappingId: props.subRecordMappingId,
    },
  };
  initialStore.getState().data.resources = {
    imports: [{
      _id: props.importId,
      adaptorType,
      http: {
        requestMediaType: 'xml',
      },
      sampleData: {
        name: 'name',
      },
    }],
    flows: [{
      _id: 'flow_id',
      pageGenerators: [{
        _exportId: exportId,
      }],
    }],
    exports: [{
      _id: 'export_id',
      adaptorType: 'HTTPExport',
      sampleData: {
        name: 'name',
      },
    }],
  };
  initialStore.getState().session.flowData = {
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
          data: [
            {id: 'a', type: 'string'},
            {id: 'b[*].c', type: 'string'},
            {id: 'e[*].f', type: 'string'},
          ],
        },
      }],
      pageGeneratorsMap: [],
      pageProcessorsMap: [],
    },
  };

  const ui = (
    <MemoryRouter>
      <MappingWrapper {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

const mockOnSortEnd = jest.fn().mockReturnValue({
  oldIndex: 1,
  newIndex: 2,
});

jest.mock('./MappingRow', () => ({
  __esModule: true,
  ...jest.requireActual('./MappingRow'),
  default: () => (
    <>
      <button type="button">
        Mock MappingRow
      </button>
    </>
  ),
}));

jest.mock('../DragContainer', () => ({
  __esModule: true,
  ...jest.requireActual('../DragContainer'),
  default: props => {
    const handleClick = () => {
      const { oldIndex, newIndex } = mockOnSortEnd();

      props.onSortEnd({ oldIndex, newIndex });
    };

    return (
      <>
        <button type="button" onClick={handleClick}>
          Mock onSortEnd
        </button>
        <props.SortableItemComponent />
        <props.LastRowSortableItemComponent />
      </>
    );
  },
}));

describe('MappingWrapper component Test cases', () => {
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
  test('should pass the intial render with default values', async () => {
    await initMappingWrapper({
      adaptorType: 'HTTPImport',
    });
    const onSortEnd = screen.getByRole('button', {name: 'Mock onSortEnd'});

    userEvent.click(onSortEnd);

    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockDispatchFn).toBeCalledWith(actions.mapping.shiftOrder('key_2', 2));
  });

  test('should pass the intial render with default values', async () => {
    await initMappingWrapper({
      props: {
        importId: 'import_id',
        flowId: 'flow_id',
        disabled: true,
      },
    });
    const onSortEnd = screen.getByRole('button', {name: 'Mock onSortEnd'});

    expect(onSortEnd).toBeInTheDocument();
  });

  test('should pass the intial render with error status', async () => {
    await initMappingWrapper({
      status: 'error',
    });
    expect(screen.queryByText('Failed to load mapping.')).toBeInTheDocument();
  });

  test('should pass the intial render with request status', async () => {
    await initMappingWrapper({
      status: 'request',
    });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

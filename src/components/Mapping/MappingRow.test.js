import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MappingRow from './MappingRow';
import actions from '../../actions';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import customCloneDeep from '../../utils/customCloneDeep';

async function initMappingRow({
  props = {
    disabled: false,
    index: '1',
    importId: 'import_id',
    flowId: 'flow_id',
    rowData: {
      key: 'key_1',
    },
  },
  exportId = 'export_id',
  adaptorType = 'HTTPImport',
  validationErrMsg = null,
  startKey,
} = {}) {
  const initialStore = customCloneDeep(reduxStore);

  mutateStore(initialStore, draft => {
    draft.session.mapping = {
      mapping: {
        flowId: 'flow_id',
        status: 'mappingStatus',
        mappings: [{
          generate: 'generate_1',
          extract: 'extract_1',
          key: 'key_1',
        }, {
          generate: 'generate_2',
          key: 'key_2',
        }, {
          extract: 'extract_3',
          key: 'key_3',
        }, {
          generate: 'generate_4',
          hardCodedValue: 'hardCodedValue_4',
          key: 'key_4',
        }, {
          generate: 'generate_5',
          lookupName: 'lookupName',
          key: 'key_5',
        }, {
          generate: 'generate_6',
          extract: '{{extract_6}}',
          key: 'key_6',
        }, {
          generate: 'generate_7',
          extract: 'extract_7',
          key: 'key_7',
          isNotEditable: true,
          isRequired: true,
        }],
        validationErrMsg,
        mappingsCopy: [],
        subRecordMappingId: props.subRecordMappingId,
        autoMapper: {
          startKey,
        },
      },
    };
    draft.data.resources = {
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
  });

  const ui = (
    <MemoryRouter>
      <MappingRow {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}
const mockHandleBlur = jest.fn().mockReturnValue({
  _id: '_id',
  value: 'value',
});

const mockHandleFieldTouch = jest.fn().mockReturnValue({
  _id: '_id',
  value: 'value',
});

jest.mock('../DynaForm/fields/DynaTypeableSelect', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaForm/fields/DynaTypeableSelect'),
  default: props => {
    const handleBlur = () => {
      const {_id, value} = mockHandleBlur();

      props.onBlur(_id, value);
    };
    const handleFieldTouch = () => {
      const {_id, value} = mockHandleFieldTouch();

      props.onTouch(_id, value);
    };

    return (
      <>
        <span>{props.value}</span>
        <button type="button" onClick={handleBlur}>
          mock handleBlur {props.value}
        </button>
        <button type="button" onClick={handleFieldTouch}>
          mock handleFieldTouch {props.value}
        </button>
      </>
    );
  },
}));

describe('mappingRow component Test cases', () => {
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
    await initMappingRow();

    expect(screen.queryByText('generate_1')).toBeInTheDocument();
    expect(screen.queryByText('extract_1')).toBeInTheDocument();
    const extractBlurButton = screen.getByRole('button', {name: 'mock handleBlur extract_1'});

    expect(extractBlurButton).toBeInTheDocument();
    await userEvent.click(extractBlurButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.patchField('extract', 'key_1', 'value'));

    const generateBlurButton = screen.getByRole('button', {name: 'mock handleBlur generate_1'});

    expect(generateBlurButton).toBeInTheDocument();
    userEvent.hover(generateBlurButton);
    userEvent.unhover(generateBlurButton);
    await userEvent.click(generateBlurButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.patchField('extract', 'key_1', 'value'));

    const deleteButton = screen.getAllByRole('button').find(eachButton => eachButton.getAttribute('data-test') === 'fieldMappingRemove-1'); // 1 is default index props

    await userEvent.click(deleteButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.delete('key_1'));

    mockHandleBlur.mockReturnValue({
      _id: '_id',
      value: '',
    });
    await userEvent.click(extractBlurButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.patchField('extract', 'key_1', 'value'));
  });

  test('should pass the initial render with custom values', async () => {
    mockHandleBlur.mockReturnValue({
      _id: '_id',
      value: '',
    });
    await initMappingRow({
      props: {
        disabled: false,
        index: '2',
        importId: 'import_id',
        flowId: 'flow_id',
        rowData: {
          key: 'key_2',
        },
        isDragInProgress: true,
        isRowDragged: true,
      },
    });

    expect(screen.queryByText('generate_2')).toBeInTheDocument();
    const generateBlurButton = screen.getByRole('button', {name: 'mock handleBlur generate_2'});

    expect(generateBlurButton).toBeInTheDocument();
    await userEvent.click(generateBlurButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.delete('key_2'));
    userEvent.hover(generateBlurButton);

    const generateTouchButton = screen.getByRole('button', {name: 'mock handleFieldTouch generate_2'});

    expect(generateTouchButton).toBeInTheDocument();
    await userEvent.click(generateTouchButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.updateLastFieldTouched('key_2'));
  });

  test('should pass the initial render with hardcoded values', async () => {
    mockHandleBlur.mockReturnValue({
      _id: '_id',
      value: '',
    });
    await initMappingRow({
      props: {
        disabled: false,
        index: '3',
        importId: 'import_id',
        flowId: 'flow_id',
        rowData: {
          key: 'key_4',
        },
        isDragInProgress: true,
        isRowDragged: true,
      },
    });

    expect(screen.queryByText('generate_4')).toBeInTheDocument();
  });

  test('should pass the initial render with lookup values', async () => {
    mockHandleBlur.mockReturnValue({
      _id: '_id',
      value: '',
    });
    await initMappingRow({
      props: {
        disabled: false,
        index: '4',
        importId: 'import_id',
        flowId: 'flow_id',
        rowData: {
          key: 'key_5',
        },
      },
      startKey: 'key_5',
    });

    expect(screen.queryByText('generate_5')).toBeInTheDocument();
  });

  test('should pass the initial render with multifield values', async () => {
    mockHandleBlur.mockReturnValue({
      _id: '_id',
      value: '',
    });
    await initMappingRow({
      props: {
        disabled: false,
        index: '5',
        importId: 'import_id',
        flowId: 'flow_id',
        rowData: {
          key: 'key_6',
        },
      },
    });

    expect(screen.queryByText('generate_6')).toBeInTheDocument();
  });

  test('should pass the initial render with invalid key', async () => {
    mockHandleBlur.mockReturnValue({
      _id: '_id',
      value: '',
    });
    await initMappingRow({
      props: {
        disabled: false,
        index: '6',
        importId: 'import_id',
        flowId: 'flow_id',
        rowData: {
          key: 'key_90',
        },
      },
    });
    const bulrField = screen.queryAllByText('mock handleBlur');

    expect(bulrField[0]).toBeInTheDocument();
    await userEvent.click(bulrField[0]);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.delete('key_90'));
  });

  test('should pass the initial render with isNotEditable mapping', async () => {
    await initMappingRow({
      props: {
        disabled: false,
        index: '6',
        importId: 'import_id',
        flowId: 'flow_id',
        rowData: {
          key: 'key_7',
        },
      },
    });

    expect(screen.queryByText('generate_7')).toBeInTheDocument();
  });
});

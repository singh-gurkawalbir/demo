import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ButtonPanel from './ButtonPanel';
import actions from '../../actions';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import customCloneDeep from '../../utils/customCloneDeep';

async function initButtonPanel({
  props = {
    importId: 'import_id',
    disabled: false,
  },
  exportId = 'export_id',
  adaptorType = 'NetSuiteImport',
  validationErrMsg = null,
} = {}) {
  const initialStore = customCloneDeep(reduxStore);

  mutateStore(initialStore, draft => {
    draft.session.mapping = {
      mapping: {
        flowId: 'flow_id',
        status: 'mappingStatus',
        mappings: [{
          generate: 'generate_1',
        }],
        validationErrMsg,
        saveStatus: '',
        mappingsCopy: [],
        subRecordMappingId: props.subRecordMappingId,
        isNSAssistantFormLoaded: true,
      },
    };
    draft.data.resources = {
      imports: [{
        _id: props.importId,
        adaptorType,
        http: {
          requestMediaType: 'xml',
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
      }],
    };
  });

  const ui = (
    <MemoryRouter>
      <ButtonPanel {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('buttonPanel component Test cases', () => {
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
    await initButtonPanel();
    const saveButton = screen.getByRole('button', {name: 'Save'});
    const previewButton = screen.getByRole('button', {name: 'Preview'});

    expect(saveButton).toBeInTheDocument();
    expect(screen.queryByText('Close')).toBeInTheDocument();
    expect(screen.queryByText(/Save & close/i)).toBeInTheDocument();
    expect(previewButton).toBeInTheDocument();

    await userEvent.click(saveButton);
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.save({ match: {
      isExact: true,
      params: {},
      path: '/',
      url: '/',
    } }));

    await userEvent.click(previewButton);
    expect(mockDispatchFn).toHaveBeenCalledTimes(2);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.requestPreview());
  });

  test('should pass the initial render with error message', async () => {
    await initButtonPanel({
      validationErrMsg: 'just some random error',
    });
    const saveButton = screen.getByRole('button', {name: 'Save'});
    const previewButton = screen.getByRole('button', {name: 'Preview'});

    expect(saveButton).toBeInTheDocument();
    expect(screen.queryByText('Close')).toBeInTheDocument();
    expect(screen.queryByText(/Save & close/i)).toBeInTheDocument();
    expect(previewButton).toBeInTheDocument();

    await userEvent.click(saveButton);
    expect(mockDispatchFn).toHaveBeenCalledTimes(0);

    await expect(screen.findByText('just some random error')).resolves.toBeInTheDocument();
  });

  test('should pass the initial render with custom values', async () => {
    await initButtonPanel({
      adaptorType: 'HTTPImport',
    });
    const saveButton = screen.getByRole('button', {name: 'Save'});

    expect(saveButton).toBeInTheDocument();
    expect(screen.queryByText('Close')).toBeInTheDocument();
    expect(screen.queryByText(/Save & close/i)).toBeInTheDocument();
    expect(screen.queryByText(/preview/i)).not.toBeInTheDocument();
  });
});

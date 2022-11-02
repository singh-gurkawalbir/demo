/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import {renderWithProviders} from '../../../../../test/test-utils';
import actions from '../../../../../actions';
import CsvParseRules from '.';
import { getCreatedStore } from '../../../../../store';

const initialStore = getCreatedStore();

function initCsvParseRules(props = {}) {
  initialStore.getState().session.editors = {filecsv: {
    fieldId: 'file.csv',
    formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
    resourceId: '5b3c75dd5d3c125c88b5dd20',
    resourceType: 'imports',
    previewStatus: props.status,
    insertStubKey: 'preSavePage',
    rule: {
      code: 'custom code',
      entryFunction: 'preSavePage',
      scriptId: '5b3c75dd5d3c125c88b5cc00',
      trimSpaces: true,
      keyColumns: props.keyColumns,
      ignoreSortAndGroup: true,
      hasHeaderRow: true,
      rowDelimiter: '\n',
      columnDelimiter: '*',
    },
  },
  };
  initialStore.getState().session.form = {'imports-5b3c75dd5d3c125c88b5dd20': { value: 'demoValue',
    fields: {
      'file.csv': {
        disabled: props.disabled,
      },
    },
  }};

  return renderWithProviders(<CsvParseRules {...props} />, {initialStore});
}

describe('CsvParse Rules UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should pass the initial render', () => {
    initCsvParseRules({editorId: 'filecsv', keyColumns: ['demo']});
    expect(screen.getByText('Column delimiter')).toBeInTheDocument();
    expect(screen.getByText('Row delimiter')).toBeInTheDocument();
    expect(screen.getByText('Trim spaces')).toBeInTheDocument();
    expect(screen.getByText('Number of rows to skip')).toBeInTheDocument();
    expect(screen.getByText('File has header')).toBeInTheDocument();
    expect(screen.getByText('Multiple rows per record')).toBeInTheDocument();
    expect(screen.getByText('Key columns')).toBeInTheDocument();
  });
  test('should not display the key columns field when editor rule does not contain keyColumns propperty in state', () => {
    initCsvParseRules({editorId: 'filecsv'});
    expect(screen.queryByText('Key columns')).toBeNull();
  });
  test('should make a dispatch call on initial render', async () => {
    const formValue = {
      columnDelimiter: '*',
      rowDelimiter: '\n',
      trimSpaces: true,
      rowsToSkip: 0,
      hasHeaderRow: true,
      rowsPerRecord: true,
      keyColumns: ['demo'],
    };

    initCsvParseRules({editorId: 'filecsv', keyColumns: ['demo']});
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.editor.patchRule('filecsv', formValue)));
  });
});

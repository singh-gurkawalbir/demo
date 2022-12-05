/* global describe, test, expect, jest, beforeEach, afterEach */
import React from 'react';
import {
  waitFor,
} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import actions from '../../../../actions';
import FileDefinitionChange from './FileDefinitionChange';
import { renderWithProviders} from '../../../../test/test-utils';
import {getCreatedStore} from '../../../../store';

const initialStore = getCreatedStore();

async function initFileDefinitionChange(props = {}) {
  initialStore.getState().session.editors = {filecsv: {
    id: props.id,
    fieldId: 'fieldId',
    formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
    resourceId: '5b3c75dd5d3c125c88b5dd20',
    resourceType: 'imports',
    rule: {
      customHeaderRows: 'custom value',
      columnDelimiter: 'Comma (,)',
      rowDelimiter: 'LF (\\n)',
      includeHeader: false,
      truncateLastRowDelimiter: false,
      wrapWithQuotes: false,
      replaceTabWithSpace: false,
      replaceNewlineWithSpace: false,
    },
  },
  };

  initialStore.getState().data.fileDefinitions = {preBuiltFileDefinitions: {data: {format: [{value: 'definitionId',
    template: {
      generate: {sampleData: '{}'},
      parse: {sampleData: {

      }} }}]}}};

  initialStore.getState().session.form = {'imports-5b3c75dd5d3c125c88b5dd20': { fields: {
    fieldId: {
      options: {
        format: 'format',
        definitionId: 'definitionId',
      },
      value: 'value',
      userDefinitionId: 'definition',
      fileDefinitionResourcePath: 'respurcePath',
      disabled: props.disabled,
    },
  },
  }};

  return renderWithProviders(<FileDefinitionChange {...props} />, {initialStore});
}

describe('FileDefinitionChange UI tests', () => {
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

  const props = {
    editorId: 'filecsv',
    formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
    fieldId: 'fieldId',
    resourceType: 'imports',
    hasMappings: false,
  };

  test('should make 2 dispatch calls when editor is not active', async () => {
    initFileDefinitionChange(props);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.resourceFormSampleData.request('imports-5b3c75dd5d3c125c88b5dd20')));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.form.fieldChange('imports-5b3c75dd5d3c125c88b5dd20')('fieldId', '{}', true)));
  });
  test('should make 2 additional dispatch calls along with the above calls when editor is active', async () => {
    initFileDefinitionChange({...props, id: 'id'});
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.resourceFormSampleData.request('imports-5b3c75dd5d3c125c88b5dd20')));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.form.fieldChange('imports-5b3c75dd5d3c125c88b5dd20')('fieldId', '{}', true)));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.editor.patchData('filecsv', '{}')));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.editor.patchRule('filecsv', '{}')));
  });
});

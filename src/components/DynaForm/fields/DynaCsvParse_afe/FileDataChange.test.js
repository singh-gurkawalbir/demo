/* global describe, test, expect, jest, beforeEach, afterEach */
import React from 'react';
import { waitFor} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import {renderWithProviders} from '../../../../test/test-utils';
import FileDataChange from './FileDataChange';
import { getCreatedStore } from '../../../../store';
import actions from '../../../../actions';

const initialStore = getCreatedStore();

function initFileDataChange(props = {}) {
  initialStore.getState().data.resources.exports = [{
    _id: '63515cc28eab567612a83249',
    file: {type: 'csv' },
    sampleData: {id: 'sample', data: 'data'},
  }];
  initialStore.getState().session.editors = {
    filecsv: {
      resourceType: 'exports',
      resourceId: '63515cc28eab567612a83249',
    },
  };

  return renderWithProviders(<FileDataChange {...props} />, {initialStore});
}

describe('FileDataChange UI changes', () => {
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
  const props = {editorId: 'filecsv', fileType: 'csv' };

  test('should make a dispatch call on initial render', async () => {
    initFileDataChange(props);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.editor.patchData('filecsv', {id: 'sample', data: 'data'})));
  });
});

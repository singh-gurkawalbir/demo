/* global describe, test, expect,beforeEach,afterEach, jest */
import React from 'react';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';
import DynaFileKeyColumnAFE from './DynaFileKeyColumn_afe';
import actions from '../../../actions';

const onFieldChange = jest.fn();

async function initDynaFileDefinitionSelect(props, status) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources = {
    exports: [
      {
        _id: 'exp-123',
        file: {
          type: 'csv',
        },
        sampleData: '{}',
      },
      {
        _id: 'expId',
        adapterType: 'HTTPExport',
        file: {
          type: 'csv',
        },
      },
    ],
  };
  initialStore.getState().session =
  {
    editors: {
      filekeycolumns: {
        data: [],
        previewStatus: status,
        result: { data: [{ key1: 'k1' }] },
      },
    },
    form: {
      'exports-expId': {
        fields: {
          'http.successMediaType': { value: 'csv' },
        },
      },
    },
    resourceFormSampleData: {
      expId: {
        preview: {
          data: { preview: '[{a: 90}]' },
          status: 'received',
        },
      },
    },
  };

  return renderWithProviders(<DynaFileKeyColumnAFE {...props} />, { initialStore });
}

describe('DynaFileKeyColumn_afe tests', () => {
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
    onFieldChange.mockClear();
  });
  test('Should able to test DynaFileKeyColumn_afe with status as requested', async () => {
    const props = { resourceId: 'exp-123', resourceType: 'exports', onFieldChange, value: ['v1'] };

    await initDynaFileDefinitionSelect(props, 'requested');
    expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.editor.init('filekeycolumns', 'csvParser', {
      resourceId: 'exp-123',
      resourceType: 'exports',
      data: '{}',
      rule: {},
    }));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.editor.patchFileKeyColumn('filekeycolumns', 'data', '{}'));
  });
  test('Should able to test DynaFileKeyColumn_afe with HTTPExport', async () => {
    const props = { resourceId: 'expId', resourceType: 'exports', onFieldChange };

    await initDynaFileDefinitionSelect(props);
    expect(mockDispatchFn).not.toHaveBeenCalled();
  });
  test('Should able to test DynaFileKeyColumn_afe with invalid values', async () => {
    const props = { resourceId: 'expId', resourceType: 'exports', onFieldChange, value: {} };

    await initDynaFileDefinitionSelect(props);
    expect(mockDispatchFn).not.toHaveBeenCalled();
  });
});

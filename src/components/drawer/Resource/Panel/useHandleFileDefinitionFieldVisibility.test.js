
import React from 'react';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import useHandleFileDefinitionFieldVisibility, { FILE_DEFINITION_RULES_FIELD_ID} from './useHandleFileDefinitionFieldVisibility';
import actions from '../../../../actions';
import { fileDefinitionFormatFieldsMap } from '../../../../utils/file';

function initHook(resourceType = 'exports', resourceId, formValues = {}) {
  const DummyComponent = () => {
    useHandleFileDefinitionFieldVisibility('formKey');

    return null;
  };

  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.form = {
      formKey: {
        parentContext: { resourceType, resourceId },
        value: { ...formValues },
      },
    };
    draft.data.resources = {
      exports: [
        {
          _id: 'id1',
          adaptorType: 'S3Export',
          file: {
            type: 'fileDefinition',
            fileDefinition: {
              _fileDefinitionId: 'fd1',
            },
          },
        },
        {
          _id: 'id2',
          adaptorType: 'S3Export',
          file: {
            type: 'csv',
            csv: {},
          },
        },
        {
          _id: 'id3',
          adaptorType: 'RESTExport',
        },
        {
          _id: 'id4',
          adaptorType: 'FTPExport',
          file: {},
        },
      ],
    };
  });

  renderWithProviders(<DummyComponent />, {initialStore});
}
describe('useHandleFileDefinitionFieldVisibility tests', () => {
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
    mockDispatchFn.mockClear();
  });
  test('should do nothing incase of any resource other than export or import', () => {
    initHook('scripts', 's1');
    expect(mockDispatchFn).not.toHaveBeenCalled();
  });
  test('should do nothing incase of resource which do not have file definitions', () => {
    initHook('exports', 'id3');
    expect(mockDispatchFn).not.toHaveBeenCalled();
  });
  test('should dispatch forceFieldState action and hide all format fields and show parser field incase user has already configured file definition', () => {
    initHook('exports', 'id1', { '/file/type': 'filedefinition' });
    expect(mockDispatchFn).toHaveBeenCalledTimes(4);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(fileDefinitionFormatFieldsMap.fixed, { visible: false }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(fileDefinitionFormatFieldsMap.filedefinition, { visible: false }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(fileDefinitionFormatFieldsMap['delimited/edifact'], { visible: false }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(FILE_DEFINITION_RULES_FIELD_ID, { visible: true }));
  });
  test('should dispatch forceFieldState action and hide format fields and file definition parser field incase user has selected blob mode', () => {
    initHook('exports', 'id1', { '/outputMode': 'blob' });
    expect(mockDispatchFn).toHaveBeenCalledTimes(4);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(fileDefinitionFormatFieldsMap.fixed, { visible: false }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(fileDefinitionFormatFieldsMap.filedefinition, { visible: false }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(fileDefinitionFormatFieldsMap['delimited/edifact'], { visible: false }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(FILE_DEFINITION_RULES_FIELD_ID, { visible: false }));
  });
  test('should dispatch forceFieldState action and hide format fields and file definition parser field incase user has selected file type other than file definition', () => {
    initHook('exports', 'id2', { '/file/type': 'csv' });
    expect(mockDispatchFn).toHaveBeenCalledTimes(4);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(fileDefinitionFormatFieldsMap.fixed, { visible: false }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(fileDefinitionFormatFieldsMap.filedefinition, { visible: false }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(fileDefinitionFormatFieldsMap['delimited/edifact'], { visible: false }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(FILE_DEFINITION_RULES_FIELD_ID, { visible: false }));
  });
  test('should dispatch forceFieldState action and show format field related to selected file type and hide other format fields besides parser field', () => {
    initHook('exports', 'id4', { '/file/type': 'fixed' });
    expect(mockDispatchFn).toHaveBeenCalledTimes(4);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(fileDefinitionFormatFieldsMap.fixed, { visible: true }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(fileDefinitionFormatFieldsMap.filedefinition, { visible: false }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(fileDefinitionFormatFieldsMap['delimited/edifact'], { visible: false }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(FILE_DEFINITION_RULES_FIELD_ID, { visible: false }));
  });
  test('should dispatch forceFieldState action and show parser field incase user has selected file definition file type and also selected format field', () => {
    initHook('exports', 'id4', { '/file/type': 'delimited/edifact', '/edifact/format': 'RANDOM_FORMAT_VALUE' });
    expect(mockDispatchFn).toHaveBeenCalledTimes(4);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(fileDefinitionFormatFieldsMap.fixed, { visible: false }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(fileDefinitionFormatFieldsMap.filedefinition, { visible: false }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(fileDefinitionFormatFieldsMap['delimited/edifact'], { visible: true }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')(FILE_DEFINITION_RULES_FIELD_ID, { visible: true }));
  });
});

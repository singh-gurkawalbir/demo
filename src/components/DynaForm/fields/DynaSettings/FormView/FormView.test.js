
import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import FormView from '.';
import actions from '../../../../../actions';

describe('formView tests', () => {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session = {
      customSettings: {
        _impId1: {meta: { fieldMap: {_key1: 'k1', _key2: 'k2'} }},
        _impId3: {meta: { }, error: 'invalid meta'},
      },
      form: {
        'settingsForm-_impId1': {
          fieldMeta: {layout: {}, fieldMap: {}},
        },
      },
    };
    draft.data.resources = {
      imports: [{
        _id: '_impId1',
      }],
    };
  });

  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
  });

  test('should able to test FormView with valid settingsFormState', async () => {
    const props = {
      resourceId: '_impId1',
      resourceType: 'imports',
      sectionId: 'general',
    };

    await renderWithProviders(<FormView {...props} />, {initialStore});
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
  test('should able to test FormView without settingsFormState', async () => {
    const props = {
      resourceId: '_impId2',
      resourceType: 'imports',
      sectionId: 'general',
    };

    await renderWithProviders(<FormView {...props} />, {initialStore});
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.customSettings.formRequest('imports', '_impId2', 'general'));
  });
  test('should able to test FormView with settingsForm having error', async () => {
    const props = {
      resourceId: '_impId3',
      resourceType: 'imports',
      sectionId: 'general',
    };

    await renderWithProviders(<FormView {...props} />, {initialStore});
    expect(mockDispatchFn).not.toHaveBeenCalledWith(actions.customSettings.formRequest('imports', '_impId3', 'general'));
    expect(screen.getByText('invalid meta')).toBeInTheDocument();
  });
});

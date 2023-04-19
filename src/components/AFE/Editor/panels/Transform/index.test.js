
import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import TransformPanel from '.';
import actions from '../../../../../actions';
import customCloneDeep from '../../../../../utils/customCloneDeep';

jest.mock('../../../../DynaForm/fields/DynaKeyValue', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../DynaForm/fields/DynaKeyValue'),
  KeyValueComponent: props => <><button type="button" onClick={() => props.onUpdate(true)}>FieldUpdate</button><p>{JSON.stringify(props.suggestionConfig.keyConfig.suggestions)}</p></>,
}));

async function initTransformPanel(props = {editorId: '_editorId'}, error = '', data = '[{"id": "123"},{"id": "456"}]') {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session =
    {
      editors: {
        _editorId: {
          error,
          data,
          resourceId: 'exp-123',
          resourceType: 'exports',
          flowId: '_flowId',
          stage: 'transform',
          editorType: 'flowTransform',
        },
      },
    };
  });

  return renderWithProviders(<TransformPanel {...props} />, { initialStore });
}
describe('transformPanel tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;
  let initialStore;

  beforeEach(() => {
    initialStore = customCloneDeep(reduxStore);
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
    mockDispatchFn.mockClear();
  });
  test('should able to test editor panel with data as JSON string', async () => {
    await initTransformPanel();
    expect(screen.getByText('[{"id":"*.id"}]')).toBeInTheDocument();
  });
  test('should able to test editor panel with data as Object and Error', async () => {
    await initTransformPanel({editorId: '_editorId'}, 'Some editor error', {id: '123'});
    expect(screen.getByText('[{"id":"id"}]')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'FieldUpdate'}));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.patchRule('_editorId', true));
  });
  test('should able to test editor panel without data', async () => {
    await initTransformPanel({editorId: '_editorId'}, 'Some editor error', '');
    expect(screen.getByText('[]')).toBeInTheDocument();
  });
});


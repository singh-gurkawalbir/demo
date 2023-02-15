
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import actions from '../../../../actions';
import DynaAliasId from './DynaAliasId';
import {renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initDynaAliasId(props = {}) {
  initialStore.getState().session.asyncTask = {'integration-alias': props.status};
  initialStore.getState().data.resources = {
    integrations: [
      {
        _id: '63368c92bb74b66e32ab05ee',
        aliases: [
          {
            alias: 'test',
            _connectionId: '63368ce9bb74b66e32ab060c',
          },
        ],
      },
    ],
  };

  return renderWithProviders(<DynaAliasId {...props} />, {initialStore});
}
describe('dynaAliasId UI tests', () => {
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
    id: 'aliasId',
    required: true,
    aliasContextResourceId: '63368c92bb74b66e32ab05ee',
    aliasContextResourceType: 'integrations',
    aliasData: {
      alias: 'test',
      _connectionId: '63368ce9bb74b66e32ab060c',
    },
    formKey: 'integration-alias',
    value: 'test',
  };

  test('should pass the initial render', () => {
    initDynaAliasId(props);
    const aliasIdField = screen.getByRole('textbox');

    expect(aliasIdField).toBeInTheDocument();
  });
  test('should make the respective dispatch call based on the props passed on initial render', async () => {
    initDynaAliasId(props);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('integration-alias')('aliasId', {isValid: true})));
  });
  test('should make a different dispatch call when aliasData is empty', async () => {
    initDynaAliasId({...props, aliasData: {}});
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('integration-alias')('aliasId', {
      isValid: false,
      errorMessages: 'An alias with the same ID already exists. Provide a different ID.',
    })));
  });
});

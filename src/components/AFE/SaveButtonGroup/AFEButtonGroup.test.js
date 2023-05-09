import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import SaveButtonGroup from './AFEButtonGroup';
import actions from '../../../actions';

const mockClose = jest.fn();

async function initSaveButtonGroup(props = {editorId: 'mappings', onClose: mockClose}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.editors = {
      inputFilter: {
        editorType: 'inputFilter',
        activeProcessor: 'javascript',
        data: {javascript: '{}'},
        rule: {javascript: {_init_code: 'something', entryFunction: 'entryFunction', scriptId: 'scriptId'}},
        originalRule: {javascript: {}},
      },
    };
  });

  return renderWithProviders(<SaveButtonGroup {...props} />, { initialStore });
}
describe('saveButtonGroup tests', () => {
  const useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
  const mockDispatchFn = jest.fn();

  useDispatchSpy.mockReturnValue(mockDispatchFn);
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should able to test SaveButtonGroup when form is not dirty', async () => {
    await initSaveButtonGroup();
    const close = screen.getByRole('button', {name: 'Close'});

    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
    expect(close).toBeEnabled();
    await userEvent.click(close);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
  test('should able to test SaveButtonGroup when form is dirty', async () => {
    await initSaveButtonGroup({makeDirty: true, editorId: 'inputFilter'});
    expect(screen.getByRole('button', {name: 'Save & close'})).toBeEnabled();
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.saveRequest('inputFilter'));
  });
});


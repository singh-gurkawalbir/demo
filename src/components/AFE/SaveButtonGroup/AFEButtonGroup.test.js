/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';
import SaveButtonGroup from './AFEButtonGroup';
import actions from '../../../actions';

const mockClose = jest.fn();

async function initSaveButtonGroup(props = {editorId: 'mappings', onClose: mockClose}) {
  const initialStore = reduxStore;

  initialStore.getState().session.editors = {
    inputFilter: {
      editorType: 'inputFilter',
      activeProcessor: 'javascript',
      data: {javascript: '{}'},
      rule: {javascript: {_init_code: 'something'}},
      originalRule: {javascript: {}},
    },
  };

  return renderWithProviders(<SaveButtonGroup {...props} />, { initialStore });
}
describe('SaveButtonGroup tests', () => {
  const useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
  const mockDispatchFn = jest.fn();

  useDispatchSpy.mockReturnValue(mockDispatchFn);
  test('Should able to test SaveButtonGroup when form is not dirty', async () => {
    await initSaveButtonGroup();
    const close = screen.getByRole('button', {name: 'Close'});

    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
    expect(close).toBeEnabled();
    userEvent.click(close);
    expect(mockClose).toHaveBeenCalled();
  });
  test('Should able to test SaveButtonGroup when form is dirty', async () => {
    await initSaveButtonGroup({makeDirty: true, editorId: 'inputFilter'});
    expect(screen.getByRole('button', {name: 'Save & close'})).toBeEnabled();
    userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.saveRequest('inputFilter'));
  });
});


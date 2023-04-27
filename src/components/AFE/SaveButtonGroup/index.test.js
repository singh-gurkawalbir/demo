import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import SaveButtonGroup from '.';

const mockClose = jest.fn();

async function initSaveButtonGroup(props = {editorId: 'responseMappings', onClose: mockClose}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.editors = {
      inputFilter: {
        editorType: 'inputFilter',
        activeProcessor: 'javascript',
        data: {javascript: '{}'},
        rule: {javascript: {_init_code: 'something'}},
        originalRule: {javascript: {}},
      },
      responseMappings: {
        editorType: 'responseMappings',
      },
    };
  });

  return renderWithProviders(<MemoryRouter><SaveButtonGroup {...props} /></MemoryRouter>, { initialStore });
}
describe('saveButtonGroup tests', () => {
  const useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
  const mockDispatchFn = jest.fn();

  useDispatchSpy.mockReturnValue(mockDispatchFn);
  test('should able to test SaveButtonGroup when editorType is responseMappings', async () => {
    await initSaveButtonGroup();
    const close = screen.getByRole('button', {name: 'Close'});

    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
    expect(close).toBeEnabled();
    await userEvent.click(close);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
  test('should able to test SaveButtonGroup when editorType is inputFilter', async () => {
    await initSaveButtonGroup({editorId: 'inputFilter'});
    expect(screen.getByRole('button', {name: 'Save & close'})).toBeEnabled();
  });
});


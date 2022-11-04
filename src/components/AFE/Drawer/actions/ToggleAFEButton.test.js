/* eslint-disable no-undef */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import actions from '../../../../actions';
import { getCreatedStore } from '../../../../store';
import { renderWithProviders } from '../../../../test/test-utils';
import ToggleAFEButton from './ToggleAFEButton';

let initialStore;

async function initToggleAFEButton(editorId, saveStatus, editorSupportsV1V2data, dataVersion) {
  initialStore.getState().session.editors = {
    [editorId]: {
      saveStatus,
      editorSupportsV1V2data,
      dataVersion,
    },
  };
  const ui = (
    <MemoryRouter>
      <ToggleAFEButton editorId={editorId} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('test suite for ToggleAFEButton', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
          initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('Should render ToggleAFEButton', async () => {
    await initToggleAFEButton('1', 'requested', true, 1);
    expect(screen.getByRole('button', {
      name: /afe 1\.0/i,
    })).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: /afe 2\.0/i,
    })).toBeInTheDocument();
  });
  test('Toggling ToggleAFEButton and checking the functionality', async () => {
    await initToggleAFEButton('1', 'random', true, 1);
    const afeButton = screen.getByRole('button', {
      name: /afe 2\.0/i,
    });

    userEvent.click(afeButton);
    await expect(mockDispatchFn).toBeCalledWith(actions.editor.toggleVersion('1', 2));
  });
  test('Should render null when handleAFEToggle is false', async () => {
    const { utils } = await initToggleAFEButton('1', 'random', false, 1);

    expect(utils.container).toBeEmptyDOMElement();
  });
});

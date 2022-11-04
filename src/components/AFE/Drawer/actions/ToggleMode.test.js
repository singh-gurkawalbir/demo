/* eslint-disable no-undef */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import actions from '../../../../actions';
import { getCreatedStore } from '../../../../store';
import { renderWithProviders } from '../../../../test/test-utils';
import ToggleMode from './ToggleMode';

let initialStore;

async function initToggleMode({ editorId, variant, activeProcessor, saveStatus }) {
  initialStore.getState().session.editors = {
    '25bc3': {
      saveStatus,
      activeProcessor,
    },
  };
  const ui = (
    <MemoryRouter>
      <ToggleMode editorId={editorId} variant={variant} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('test suite for ToggleMode', () => {
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

  test('Should render ToggleMode for variant filter', async () => {
    await initToggleMode({
      editorId: '25bc3', variant: 'filter', activeProcessor: 'filter', saveStatus: 'done',
    });
    expect(screen.getByRole('button', {
      name: /rules/i,
    })).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: /javascript/i,
    })).toBeInTheDocument();
  });
  test('Should render ToggleMode for variant form', async () => {
    await initToggleMode({
      editorId: '25bc3', variant: 'form', activeProcessor: 'json', saveStatus: 'done',
    });
    expect(screen.getByRole('button', {
      name: /json/i,
    })).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: /script/i,
    })).toBeInTheDocument();
  });
  test('Should render ToggleMode for variant transform', async () => {
    await initToggleMode({
      editorId: '25bc3', variant: 'transform', activeProcessor: 'transform', saveStatus: 'done',
    });
    expect(screen.getByRole('button', {
      name: /rules/i,
    })).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: /javascript/i,
    })).toBeInTheDocument();
  });
  test('Toggling ToggleMode and checking the functionality', async () => {
    await initToggleMode({
      editorId: '25bc3', variant: 'filter', activeProcessor: 'filter', saveStatus: 'done',
    });
    const afeButton = screen.getByRole('button', {
      name: /javascript/i,
    });

    userEvent.click(afeButton);
    await expect(mockDispatchFn).toBeCalledWith(actions.editor.patchFeatures('25bc3', { activeProcessor: 'javascript' }));
  });
  // test('Should render null when showToggle is false', async () => {
  //   await initToggleMode({
  //     editorId: '25bc3', variant: 'filter', activeProcessor: 'filter', saveStatus: 'requested',
  //   });

  //   // expect(utils.container).toBeEmptyDOMElement();
  //   screen.debug(null, Infinity);
  // });
});

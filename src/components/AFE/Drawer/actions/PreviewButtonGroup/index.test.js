/* eslint-disable no-undef */
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import PreviewButtonGroup from '.';
import actions from '../../../../../actions';
import { getCreatedStore } from '../../../../../store';
import { renderWithProviders } from '../../../../../test/test-utils';

let initialStore;

async function initPreviewButtonGroup(editorId) {
  initialStore.getState().session.editors = {
    1: {
      autoEvaluate: false,
    },
  };
  const ui = (
    <MemoryRouter>
      <PreviewButtonGroup editorId={editorId} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('test suite for PreviewButtonGroup', () => {
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

  test('Should render PreviewButtonGroup and checkbox unchecked', async () => {
    await initPreviewButtonGroup('1');
    expect(screen.getByText(/auto preview/i)).toBeInTheDocument();
    const button = screen.getByRole('checkbox', {
      name: /auto preview/i,
    });

    expect(button).toBeInTheDocument();
    expect(button).not.toBeChecked();
  });
  test('Should show checkbox to be checked after clicking', async () => {
    await initPreviewButtonGroup('1');
    const button = screen.getByRole('checkbox', {
      name: /auto preview/i,
    });

    expect(button).toBeInTheDocument();
    userEvent.click(button);
    await waitFor(() => expect(button).toBeChecked());
  });
  test('Preview button should call action on clicking', async () => {
    await initPreviewButtonGroup('1');
    const button = screen.getByRole('button', {
      name: /preview/i,
    });

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    userEvent.click(button);
    await expect(mockDispatchFn).toBeCalledWith(actions.editor.previewRequest('1'));
  });
});

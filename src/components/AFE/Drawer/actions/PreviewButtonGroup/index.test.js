/* eslint-disable no-undef */
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import * as reactRedux from 'react-redux';
import PreviewButtonGroup from '.';
import actions from '../../../../../actions';
import { getCreatedStore } from '../../../../../store';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import messageStore from '../../../../../utils/messageStore';

let initialStore;

async function initPreviewButtonGroup(editorId) {
  const mustateState = draft => {
    draft.session.editors = {
      1: {
        autoEvaluate: false,
      },
      2: {
        disablePreview: true,
      },
      3: {
        saveStatus: 'requested',
      },
    };
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(
    <PreviewButtonGroup editorId={editorId} />,
    { initialStore });
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
    await userEvent.click(button);
    waitFor(() => expect(button).toBeChecked());
  });
  test('Preview button should call action on clicking', async () => {
    await initPreviewButtonGroup('1');
    const button = screen.getByRole('button', {
      name: /preview/i,
    });

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    await userEvent.click(button);
    await expect(mockDispatchFn).toBeCalledWith(actions.editor.previewRequest('1'));
  });
  test('Preview button should be disabled if disablePreview is true on editor', async () => {
    await initPreviewButtonGroup('2');
    const button = screen.getByRole('button', {
      name: /preview/i,
    });

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
  test('Preview button should be disabled if disablePreview is true on editor and hover text should be displayed on hover', async () => {
    await initPreviewButtonGroup('2');
    waitFor(async () => {
      const button = screen.getByRole('button', {
        name: /preview/i,
      });

      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
      fireEvent.mouseOver(button);
      await waitFor(() => screen.getByTitle(messageStore('EDITOR_PREVIEW_DISABLED')));
    });
  });
  test('Preview button should be disabled if save is in progress', async () => {
    await initPreviewButtonGroup('3');
    const button = screen.getByRole('button', {
      name: /preview/i,
    });

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});

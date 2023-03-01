/* eslint-disable no-undef */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import EditorDrawerCloseIconButton from '.';
import { FormOnCancelProvider } from '../../../FormOnCancelContext';

let initialStore;
const mockOnClose = jest.fn();
const mockSetCancelTriggered = jest.fn();

async function initEditorDrawerCloseIconButton(editorId, onClose, hideSave, saveStatus) {
  const mustateState = draft => {
    draft.session.editors = {
      '231c3': {
        saveStatus,
      },
    };
  };

  mutateStore(initialStore, mustateState);
  const ui = (
    <MemoryRouter>
      <FormOnCancelProvider>
        <EditorDrawerCloseIconButton editorId={editorId} onClose={onClose} hideSave={hideSave} />
      </FormOnCancelProvider>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('../../../FormOnCancelContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../../FormOnCancelContext'),
  default: () => ({
    setCancelTriggered: mockSetCancelTriggered,
  }),
}));

describe('test suite for RouterGuide', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });

  afterEach(() => {
    mockOnClose.mockClear();
    mockSetCancelTriggered.mockClear();
  });

  test('Should render EditorDrawerCloseIconButton button when hideSave is true', async () => {
    await initEditorDrawerCloseIconButton('231c3', mockOnClose, true, 'success');
    expect(screen.getByRole('button')).not.toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('data-test', 'closeRightDrawer');
    const closeButton = screen.getByRole('button');

    await userEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  test('Should render EditorDrawerCloseIconButton button when hideSave is false', async () => {
    await initEditorDrawerCloseIconButton('231c3', mockOnClose, false, 'success');
    expect(screen.getByRole('button')).not.toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('data-test', 'closeRightDrawer');
    const closeButton = screen.getByRole('button');

    await userEvent.click(closeButton);
    expect(mockSetCancelTriggered).toHaveBeenCalledTimes(1);
  });
  test('Should test EditorDrawerCloseIconButton button if it is diabled or not', async () => {
    await initEditorDrawerCloseIconButton('231c3', mockOnClose, false, 'requested');
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

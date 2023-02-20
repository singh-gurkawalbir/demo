
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../test/test-utils';
import SaveAndCloseMiniButtonGroup from './SaveAndCloseMiniButtonGroup';

const mockHandleCancel = jest.fn();

jest.mock('./hooks/useHandleCancelBasic', () => ({
  __esModule: true,
  ...jest.requireActual('./hooks/useHandleCancelBasic'),
  default: () => mockHandleCancel,
}));

async function initSaveAndCloseMiniButtonGroup(props = {}) {
  const ui = (
    <MemoryRouter>
      <SaveAndCloseMiniButtonGroup {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('test cases for SaveAndCloseMiniButtonGroup', () => {
  test('should pass initial rendering', async () => {
    await initSaveAndCloseMiniButtonGroup();

    expect(screen.getByRole('button', {name: 'Save & close'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Close'})).toBeEnabled();
  });

  test('should be able to execute handleSave and handleClose', async () => {
    const handleSave = jest.fn();
    const handleClose = jest.fn();

    await initSaveAndCloseMiniButtonGroup({isDirty: true, handleSave, handleClose, submitButtonLabel: 'SUBMIT'});
    const saveButton = screen.getByRole('button', {name: 'SUBMIT'});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    await userEvent.click(saveButton);
    expect(handleSave).toHaveBeenCalledTimes(1);
    await userEvent.click(closeButton);
    expect(mockHandleCancel).toHaveBeenCalledTimes(1);
  });

  test('should execute handleClose when disabled', async () => {
    const handleClose = jest.fn();

    await initSaveAndCloseMiniButtonGroup({isDirty: true, disabled: true, handleClose});
    expect(screen.getByRole('button', {name: 'Save & close'})).toBeDisabled();
    await userEvent.click(screen.getByRole('button', {name: 'Close'}));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});


import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../test/test-utils';
import SaveAndCloseButtonGroupAuto from './SaveAndCloseButtonGroupAuto';

const mockHandleCancel = jest.fn();

jest.mock('./hooks/useHandleCancelBasic', () => ({
  __esModule: true,
  ...jest.requireActual('./hooks/useHandleCancelBasic'),
  default: jest.fn(() => mockHandleCancel),
}));

async function initSaveAndCloseButtonGroupAuto(props = {}) {
  const ui = (
    <MemoryRouter>
      <SaveAndCloseButtonGroupAuto {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('saveAndCloseButtonGroupAuto test suite', () => {
  test('should pass initial rendering', async () => {
    await initSaveAndCloseButtonGroupAuto();
    const saveButton = screen.getByRole('button', { name: 'Save' });
    const closeButton = screen.getByRole('button', { name: 'Close' });
    const saveAndCloseButton = screen.queryByRole('button', { name: 'Save & close' });

    expect(saveButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(saveAndCloseButton).not.toBeInTheDocument();
  });

  test('should correctly execute on clicking save or close button', async () => {
    const onClose = jest.fn();
    const onSave = jest.fn();

    await initSaveAndCloseButtonGroupAuto({ onClose, onSave, isDirty: true });
    const saveButton = screen.getByRole('button', { name: 'Save' });
    const closeButton = screen.getByRole('button', { name: 'Close' });

    expect(onClose).not.toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();

    await userEvent.click(saveButton);
    expect(onSave).toHaveBeenCalledTimes(1);

    await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('should not be able to save if no changes made', async () => {
    await initSaveAndCloseButtonGroupAuto();
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(saveButton).toBeDisabled();
  });

  test('should be able to execute handleCancel function', async () => {
    const onSave = jest.fn();
    const onClose = jest.fn();

    await initSaveAndCloseButtonGroupAuto({ onSave, onClose, shouldHandleCancel: true, disabled: false, isDirty: true });
    const closeButton = screen.getByRole('button', { name: 'Close' });

    expect(onSave).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(mockHandleCancel).not.toHaveBeenCalled();

    await userEvent.click(closeButton);

    expect(mockHandleCancel).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });
});

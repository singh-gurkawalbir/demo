
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SaveAndCloseButtonGroup from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders} from '../../test/test-utils';

async function initSaveAndCloseButtonGroup({ disabled, isDirty, status, onClose = jest.fn(), handleSave = jest.fn(), handleSaveAndClose = jest.fn() } = {}) {
  const ui = (
    <MemoryRouter>
      <SaveAndCloseButtonGroup
        disabled={!!disabled}
        isDirty={!!isDirty}
        status={status}
        onClose={onClose}
        handleSave={handleSave}
        handleSaveAndClose={handleSaveAndClose}
     />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('saveAndCloseButtonGroup test cases', () => {
  runServer();

  describe('should pass the initial render', () => {
    test('with default arguments', async () => {
      await initSaveAndCloseButtonGroup();
      const saveButtonRef = screen.getByRole('button', { name: 'Save' });
      const saveAndCloseButtonRef = screen.queryByRole('button', { name: 'Save & close' });
      const closeButtonRef = screen.getByRole('button', { name: 'Close' });

      expect(saveButtonRef).toBeInTheDocument();
      expect(saveButtonRef).toBeDisabled();
      expect(saveAndCloseButtonRef).not.toBeInTheDocument();
      expect(closeButtonRef).toBeInTheDocument();
      expect(closeButtonRef).toBeEnabled();
    });

    test('when in progress', async () => {
      await initSaveAndCloseButtonGroup({ status: 'loading' });
      const saveButtonRef = screen.getByRole('button', { name: 'Saving...' });
      const saveAndCloseButtonRef = screen.queryByRole('button', { name: 'Save & close' });
      const closeButtonRef = screen.getByRole('button', { name: 'Close' });

      expect(saveButtonRef).toBeInTheDocument();
      expect(saveAndCloseButtonRef).not.toBeInTheDocument();
      expect(closeButtonRef).toBeInTheDocument();
    });

    test('when not in progress and enabled and dirty', async () => {
      await initSaveAndCloseButtonGroup({ isDirty: true });
      const saveButtonRef = screen.getByRole('button', { name: 'Save' });
      const saveAndCloseButtonRef = screen.getByRole('button', { name: 'Save & close' });
      const closeButtonRef = screen.getByRole('button', { name: 'Close' });

      expect(saveButtonRef).toBeInTheDocument();
      expect(saveAndCloseButtonRef).toBeInTheDocument();
      expect(closeButtonRef).toBeInTheDocument();
    });

    test('when not in progress and disabled', async () => {
      await initSaveAndCloseButtonGroup({ disabled: true });
      const saveButtonRef = screen.getByRole('button', { name: 'Save' });
      const saveAndCloseButtonRef = screen.queryByRole('button', { name: 'Save & close' });
      const closeButtonRef = screen.getByRole('button', { name: 'Close' });

      expect(saveButtonRef).toBeInTheDocument();
      expect(saveAndCloseButtonRef).not.toBeInTheDocument();
      expect(closeButtonRef).toBeInTheDocument();
    });
  });

  describe('should execute the passed functions properly', () => {
    test('execution of onClose', async () => {
      const onClose = jest.fn();
      const handleSave = jest.fn();
      const handleSaveAndClose = jest.fn();

      await initSaveAndCloseButtonGroup({ onClose, handleSave, handleSaveAndClose });

      const closeButtonRef = screen.getByRole('button', { name: 'Close' });

      await userEvent.click(closeButtonRef);

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(handleSave).not.toHaveBeenCalled();
      expect(handleSaveAndClose).not.toHaveBeenCalled();
    });

    test('execution of handleSave', async () => {
      const onClose = jest.fn();
      const handleSave = jest.fn();
      const handleSaveAndClose = jest.fn();

      await initSaveAndCloseButtonGroup({ isDirty: true, onClose, handleSave, handleSaveAndClose });

      const saveButtonRef = screen.getByRole('button', { name: 'Save' });

      await userEvent.click(saveButtonRef);

      expect(onClose).not.toHaveBeenCalled();
      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleSaveAndClose).not.toHaveBeenCalled();
    });

    test('execution of handleSaveAndClose', async () => {
      const onClose = jest.fn();
      const handleSave = jest.fn();
      const handleSaveAndClose = jest.fn();

      await initSaveAndCloseButtonGroup({ isDirty: true, onClose, handleSave, handleSaveAndClose });

      const saveAndCloseButtonRef = screen.getByRole('button', { name: 'Save & close' });

      await userEvent.click(saveAndCloseButtonRef);

      expect(onClose).not.toHaveBeenCalled();
      expect(handleSave).not.toHaveBeenCalled();
      expect(handleSaveAndClose).toHaveBeenCalledTimes(1);
    });
  });
});

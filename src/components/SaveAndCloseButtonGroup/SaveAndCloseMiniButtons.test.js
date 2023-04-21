
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SaveAndCloseMiniButtons from './SaveAndCloseMiniButtons';
import { renderWithProviders } from '../../test/test-utils';

jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  Spinner: ({children}) => (<div role="status" >{children}</div>),
}));

describe('test suite for SaveAndCloseMiniButtons', () => {
  test('should pass initial rendering', () => {
    renderWithProviders(<SaveAndCloseMiniButtons />);
    const saveButton = document.querySelector('[data-test="save"]');
    const closeButton = document.querySelector('[data-test="cancel"]');

    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toBeEnabled();
  });

  test('save and close button should be disabled when conditions satisfy', () => {
    renderWithProviders(<SaveAndCloseMiniButtons inProgress disabled submitButtonLabel="Submit" submitTransientLabel="Transient Submit" />);
    const saveButton = screen.getByRole('button', { name: /submit/i});
    const closeButton = screen.getByRole('button', { name: /close/i });

    expect(saveButton).toBeDisabled();
    expect(closeButton).toBeDisabled();

    const spinner = screen.queryByRole('status');
    const submitTransientText = screen.queryByText('Transient Submit');

    expect(spinner).not.toBeInTheDocument();
    expect(submitTransientText).not.toBeInTheDocument();
  });

  test('should display spinner if inProgess and enabled', () => {
    renderWithProviders(<SaveAndCloseMiniButtons inProgress submitTransientLabel="SUBMIT Transient" />);
    const spinner = screen.getByRole('status');

    expect(spinner).toBeInTheDocument();
    expect(spinner.textContent).toBe('SUBMIT Transient');
  });
  test('should not show Close button when shouldNotShowCancelButton is set', () => {
    renderWithProviders(<SaveAndCloseMiniButtons shouldNotShowCancelButton />);
    const closeButton = screen.queryByRole('button', { name: /close/i });

    expect(closeButton).not.toBeInTheDocument();
  });

  test('should be able to execute handleSave and handleCancel', async () => {
    const handleSave = jest.fn();
    const handleCancel = jest.fn();

    renderWithProviders(<SaveAndCloseMiniButtons submitButtonLabel="Save" isDirty handleSave={handleSave} handleCancel={handleCancel} />);
    const saveButton = screen.getByRole('button', { name: /save/i });
    const closeButton = screen.getByRole('button', { name: /close/i });

    expect(handleSave).not.toHaveBeenCalled();
    expect(handleCancel).not.toHaveBeenCalled();

    await userEvent.click(saveButton);
    expect(handleSave).toHaveBeenCalledTimes(1);

    await userEvent.click(closeButton);
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});

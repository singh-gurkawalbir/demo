
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import OAuthAndCancel from './OAuthAndCancel';
import { getCreatedStore } from '../../../../store';

const mockHandleSave = jest.fn();

jest.mock('./hooks/useHandleSaveAndAuth', () => ({
  __esModule: true,
  ...jest.requireActual('./hooks/useHandleSaveAndAuth'),
  default: () => mockHandleSave,
}));

async function initOAuthAndCancel(props = {}, initialStore) {
  const ui = (
    <MemoryRouter>
      <OAuthAndCancel {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test suite for OAuthAndCancel', () => {
  test('should pass initial rendering', async () => {
    await initOAuthAndCancel();
    const saveButton = screen.getByRole('button', {name: 'Save & authorize'});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(saveButton).toBeEnabled();
    expect(closeButton).toBeEnabled();
  });

  test('should provide the correct status', async () => {
    const resourceType = 'connections';
    const resourceId = '3487fgc';
    const KEY = `${resourceType}-${resourceId}`;
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.asyncTask[KEY] = { status: 'loading' };
    });
    await initOAuthAndCancel({resourceType, resourceId}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Authorizing...'});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(saveButton).toBeDisabled();
    expect(closeButton).toBeDisabled();
  });

  test('should be able to close or save & authorize', async () => {
    const onCancel = jest.fn();
    const formKey = 'connections-123';
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[formKey] = {
        isValid: true,
        fields: {
          tempField: {
            value: '123',
          },
        },
      };
    });

    await initOAuthAndCancel({onCancel, formKey}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Save & authorize'});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    await userEvent.click(closeButton);
    expect(onCancel).toHaveBeenCalledTimes(1);
    await userEvent.click(saveButton);
    expect(mockHandleSave).toHaveBeenCalledTimes(1);
  });
});

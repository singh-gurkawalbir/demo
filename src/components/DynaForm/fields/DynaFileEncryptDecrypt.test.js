
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import DynaFileEncryptDecrypt from './DynaFileEncryptDecrypt';

const onFieldChange = jest.fn();

describe('dynaFileEncryptDecrypt tests', () => {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      connections: [{
        _id: '_conn1',
        pgp: {privateKey: '_privateKeyEncr'},
      }],
    };
  });

  test('should able to test DynaFileEncryptDecrypt with connection having privatekey', async () => {
    const props = {
      connectionId: '_conn1', type: '', id: '_id', onFieldChange,
    };

    await renderWithProviders(<DynaFileEncryptDecrypt {...props} />, {initialStore});
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onFieldChange).toHaveBeenNthCalledWith(1, '_id', undefined, true);
    expect(onFieldChange).toHaveBeenNthCalledWith(2, '_id', true);
  });
  test('should able to test DynaFileEncryptDecrypt without connection having any key', async () => {
    const props = {
      connectionId: '_conn2', type: '', id: '_id', onFieldChange,
    };

    await onFieldChange.mockClear();
    await renderWithProviders(<DynaFileEncryptDecrypt {...props} />, {initialStore});
    expect(onFieldChange).toHaveBeenNthCalledWith(1, '_id', false, true);
  });
});

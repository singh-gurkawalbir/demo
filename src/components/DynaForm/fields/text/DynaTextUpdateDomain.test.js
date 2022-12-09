/* global describe, test, jest, expect, afterEach */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';
import DynaTextUpdateDomain from './DynaTextUpdateDomain';

const mockChange = jest.fn();
const props = {formKey: '_formKey', id: '_id', onFieldChange: mockChange};

async function initDynaTextUpdateDomain(props, value = 'sandbox', touched = true) {
  const initialStore = reduxStore;

  initialStore.getState().session.form = {
    _formKey: {
      fields: {
        environment: touched ? {value, touched} : undefined,
      },
    },
  };

  return renderWithProviders(<DynaTextUpdateDomain {...props} />, { initialStore });
}
describe('DynaTextUpdateDomain tests', () => {
  afterEach(() => {
    mockChange.mockClear();
  });
  test('Should able to test DynaTextUpdateDomain in Sandbox', async () => {
    await initDynaTextUpdateDomain(props);
    userEvent.type(screen.getByRole('textbox'), 'top');
    expect(mockChange).toHaveBeenNthCalledWith(1, '_id', 'api.demo');
    expect(mockChange).toHaveBeenNthCalledWith(2, '_id', 't');
    expect(mockChange).toHaveBeenNthCalledWith(3, '_id', 'o');
    expect(mockChange).toHaveBeenNthCalledWith(4, '_id', 'p');
  });
  test('Should able to test DynaTextUpdateDomain in production', async () => {
    await initDynaTextUpdateDomain(props, 'production');
    userEvent.type(screen.getByRole('textbox'), 'top');
    expect(mockChange).toHaveBeenNthCalledWith(1, '_id', 'api');
  });
  test('Should able to test DynaTextUpdateDomain with touched false', async () => {
    await initDynaTextUpdateDomain(props, '', false);
    userEvent.type(screen.getByRole('textbox'), 'top');
    expect(mockChange).not.toHaveBeenNthCalledWith(1, '_id', 'api');
  });
});


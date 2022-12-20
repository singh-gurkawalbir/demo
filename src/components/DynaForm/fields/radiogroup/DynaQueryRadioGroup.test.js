/* global describe, test, expect, jest */
import React from 'react';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';
import DynaQueryRadioGroup from './DynaQueryRadioGroup';

const onFieldChange = jest.fn();

async function initDynaQueryRadioGroup(props, lastFieldUpdated = '') {
  const initialStore = reduxStore;

  initialStore.getState().session.form = {
    _formKey: {
      lastFieldUpdated,
    },
  };

  return renderWithProviders(<DynaQueryRadioGroup {...props} />, {initialStore});
}
describe('DynaQueryRadioGroup tests', () => {
  test('Should able to test DynaQueryRadioGroup with COMPOSITE method and field rdbms.query1', async () => {
    const props = {
      value: 'COMPOSITE', formKey: '_formKey', onFieldChange, touched: true,
    };

    await initDynaQueryRadioGroup(props, 'rdbms.query1');
    expect(onFieldChange).toHaveBeenNthCalledWith(1, 'rdbms.queryInsert', undefined, true);
    expect(onFieldChange).toHaveBeenNthCalledWith(2, 'rdbms.queryUpdate', undefined, true);
  });
  test('Should able to test DynaQueryRadioGroup with INSERT method and field rdbms.queryInsert', async () => {
    const props = {
      value: 'INSERT', formKey: '_formKey', onFieldChange, touched: true,
    };

    await onFieldChange.mockClear();
    await initDynaQueryRadioGroup(props, 'rdbms.queryInsert');
    expect(onFieldChange).toHaveBeenNthCalledWith(1, 'rdbms.query1', undefined, true);
  });
  test('Should able to test DynaQueryRadioGroup with UPDATE method and field rdbms.query1', async () => {
    const props = {
      value: 'UPDATE', formKey: '_formKey', onFieldChange, touched: true,
    };

    await onFieldChange.mockClear();
    await initDynaQueryRadioGroup(props, 'rdbms.query2');
    expect(onFieldChange).toHaveBeenNthCalledWith(1, 'rdbms.query2', undefined, true);
  });
  test('Should able to test DynaQueryRadioGroup with undefined method', async () => {
    const props = {
      formKey: '_formKey', onFieldChange, touched: true,
    };

    await onFieldChange.mockClear();
    await initDynaQueryRadioGroup(props, 'rdbms.queryUpdate');
    expect(onFieldChange).not.toHaveBeenNthCalledWith(1, 'rdbms.query2', undefined, true);
  });
  test('Should able to test DynaQueryRadioGroup with invalid formKey', async () => {
    const props = {
      formKey: '_Key', onFieldChange,
    };

    await onFieldChange.mockClear();
    await initDynaQueryRadioGroup(props);
    expect(onFieldChange).not.toHaveBeenNthCalledWith(1, 'rdbms.query2', undefined, true);
  });
});

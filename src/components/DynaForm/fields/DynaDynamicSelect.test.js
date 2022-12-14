/* global describe, test, expect, jest */
import React from 'react';
import { reduxStore, renderWithProviders } from '../../../test/test-utils';
import DynaDynamicSelect from './DynaDynamicSelect';

const onFieldChange = jest.fn();

describe('DynaDynamicSelect tests', () => {
  test('Should able to test DynaDynamicSelect ', async () => {
    const props = {
      formKey: '_formKey', onFieldChange, id: '_id', optionsMap: {}, dependentFieldId: '_fieldId',
    };
    const initialStore = reduxStore;

    initialStore.getState().session.form = {
      _formKey: {
        fields: {
          _fieldId: { value: 'dependentFieldIdValue'},
        },
      },
    };
    const {store, utils} = await renderWithProviders(<DynaDynamicSelect {...props} />, {initialStore});

    store.getState().session.form._formKey.fields._fieldId.value = 'changedValue';
    await renderWithProviders(<DynaDynamicSelect {...props} />, {initialStore: store, renderFun: utils.rerender});
    expect(onFieldChange).toHaveBeenCalledWith('_id', '', true);
  });
});

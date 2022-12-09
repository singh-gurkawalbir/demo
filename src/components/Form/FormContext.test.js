/* global describe, expect, test */
import React from 'react';
import { renderWithProviders, reduxStore } from '../../test/test-utils';
import useFormContext from './FormContext';

function initUseFormContext(formKey, initialStore) {
  let val;
  const DummyComponent = () => {
    val = useFormContext(formKey);

    return <div>Hello</div>;
  };

  renderWithProviders(<DummyComponent />, {initialStore});

  return val;
}

describe('tests for useFormContext hook', () => {
  test('should return the form state of a form with a given form key', () => {
    const formKey = 'connection-123';
    const initialStore = reduxStore;
    const sampleForm = {
      parentContext: {
        resourceId: '123',
      },
      type: 'csv',
    };

    initialStore.getState().session.form[formKey] = sampleForm;
    const formState = initUseFormContext(formKey, initialStore);

    expect(formState).toEqual(sampleForm);
  });
});

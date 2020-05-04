/* global describe,test,expect,beforeAll,jest ,afterAll */

import { render, fireEvent, cleanup } from '@testing-library/react';
import { createStore } from 'redux';
import reducer from '../../../reducers';
import { Component, reduxWrappedComponent } from './form.test';

describe('options handler', () => {
  const onFormChange = jest.fn();
  const fieldsMeta = {
    fieldMap: {
      field1: {
        id: 'FIELD1',
        name: 'prop1',
        type: 'text',
        defaultValue: 'testField1',
      },
      field2: {
        id: 'FIELD2',
        name: 'prop2',
        type: 'select',

        refreshOptionsOnChangesTo: ['FIELD1'],
      },
      field3: {
        id: 'FIELD3',
        name: 'prop3',
        type: 'text',
        defaultValue: 'testField3',
      },
    },

    layout: { fields: ['field1', 'field2', 'field3'] },
  };
  // eslint-disable-next-line no-unused-vars
  const optionsHandler = jest.fn((fieldId, fields, parentContext) => {
    const options = [
      {
        items: [
          {
            label: 'A',
            value: '1',
          },
          {
            label: 'B',
            value: '2',
          },
        ],
      },
    ];

    return options;
  });
  const formKey = 123;
  let store;
  let queryByDisplayValue;

  beforeAll(() => {
    // build up the state
    store = createStore(reducer, {
      user: { profile: { name: 'profile 1' } },
    });

    ({ queryByDisplayValue } = render(
      reduxWrappedComponent({
        Component,
        store,
        componentProps: {
          formKey,
          fieldsMeta,
          onChange: onFormChange,
          optionsHandler,
        },
      })
    ));
  });

  afterAll(() => {
    cleanup();
  });
  test('options handler is called initially for each field', () => {
    expect(optionsHandler.mock.calls.length).toBe(3); // Called for each field
  });

  test('options handler is called again when trigger field is updated', () => {
    const firstFieldEle = queryByDisplayValue('testField1');

    fireEvent.change(firstFieldEle, {
      target: {
        value: 'test1',
      },
    });

    expect(optionsHandler.mock.calls.length).toBe(4);
  });

  test('options handler is NOT called again if a non trigger field is changed', () => {
    const thirdFieldEle = queryByDisplayValue('testField3');

    fireEvent.change(thirdFieldEle, {
      target: {
        value: 'test2',
      },
    });
    expect(optionsHandler.mock.calls.length).toBe(4);
  });
});

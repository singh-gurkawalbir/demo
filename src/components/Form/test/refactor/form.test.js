/* global describe,test,expect,afterEach ,beforeEach */

import { MuiThemeProvider } from '@material-ui/core';
import { cleanup, render, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import useForm from '../../';
import reducer, * as selectors from '../../../../reducers';
import themeProvider from '../../../../theme/themeProvider';
import FormFragment from '../../FormFragment';
import { getCorrespondingFieldMap } from '../../../DynaForm/DynaFormGenerator';

// fireEvent
// Ok, so here's what your tests might look like

// this is a handy function that I would utilize for any component
// that relies on the router being in context

// This functional component creates a dummy redux state
// and wraps out custom component with react router

const theme = themeProvider();

function reduxWrappedComponent({ Component, store, componentProps }) {
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <Component {...componentProps} />
      </MuiThemeProvider>
    </Provider>
  );
}

describe('validation warnings', () => {
  const fieldsMeta = {
    fieldMap: {
      field1: {
        id: 'FIELD1',
        type: 'text',
        name: 'field1',
        defaultValue: 'test',
        label: 'field1',
        validWhen: {
          matchesRegEx: {
            pattern: '^[\\d]+$',
            message: 'Numbers only',
          },
        },
      },

      validField: {
        id: 'FIELD2',
        type: 'text',
        name: 'field2',
        defaultValue: '123',
        label: 'field2',
        validWhen: {
          matchesRegEx: {
            pattern: '^[\\d]+$',
            message: 'Numbers only',
          },
        },
      },
    },

    layout: { fields: ['field1', 'validField'] },
  };

  afterEach(() => {
    cleanup();
  });

  describe('shown validation errors immediately', () => {
    // developer state
    const store = createStore(reducer, {
      user: { profile: { name: 'profile 1' } },
    });
    const Component = hookProps => {
      const formKey = useForm({
        ...hookProps,
        fieldsMeta,
        showValidationBeforeTouched: true,
      });

      if (!formKey) return null;

      return (
        <FormFragment
          defaultFields={getCorrespondingFieldMap(
            fieldsMeta.layout.fields,
            fieldsMeta.fieldMap
          )}
          formKey={formKey}
        />
      );
    };

    test('should show only one warning when FIELD1 is invalid', () => {
      const { queryAllByText } = render(
        reduxWrappedComponent({
          Component,
          store,
          componentProps: { formKey: null },
        })
      );
      const errorMsg = queryAllByText('Numbers only');

      expect(errorMsg).toBeTruthy();

      expect(errorMsg.length).toBe(1);
    });
    test('should show that the field FIELD1 state is invalid and the FIELD2 state is valid', () => {
      render(
        reduxWrappedComponent({
          Component,
          store,
          componentProps: { formKey: 123 },
        })
      );

      const formState = selectors.getFormState(store.getState(), 123);
      const { FIELD1, FIELD2 } = formState.fields;

      expect(FIELD1.isValid).toBe(false);
      expect(FIELD2.isValid).toBe(true);
      expect(formState.isValid).toBe(false);
    });
  });
  describe('shown validation errors when form is touched', () => {
    // developer state
    const store = createStore(reducer, {
      user: { profile: { name: 'profile 1' } },
    });
    const Component = hookProps => {
      const formKey = useForm({
        ...hookProps,
        fieldsMeta,
      });

      if (!formKey) return null;

      return (
        <FormFragment
          defaultFields={getCorrespondingFieldMap(
            fieldsMeta.layout.fields,
            fieldsMeta.fieldMap
          )}
          formKey={formKey}
        />
      );
    };

    const formKey = '123';
    let queryAllByText;
    let debug;
    let queryByDisplayValue;

    beforeEach(() => {
      ({ queryAllByText, debug, queryByDisplayValue } = render(
        reduxWrappedComponent({
          Component,
          store,
          componentProps: { formKey },
        })
      ));
    });
    test('should show no warnings when field is invalid', () => {
      const errorMsg = queryAllByText('Numbers only');

      expect(errorMsg.length).toBe(0);
    });
    test('should show that the field FIELD1 and FIELD2 state is valid initially,after a touch is simulated should we show that field error', () => {
      const formState = selectors.getFormState(store.getState(), formKey);
      const { FIELD1, FIELD2 } = formState.fields;

      expect(FIELD1.isValid).toBe(true);
      expect(FIELD2.isValid).toBe(true);

      // form state should be still valid
      expect(formState.isValid).toBe(false);

      let errorMsg = queryAllByText('Numbers only');

      expect(errorMsg.length).toBe(0);

      const ele = queryByDisplayValue('test');

      // feeding a non number again
      fireEvent.change(ele, {
        target: {
          value: 'test1',
        },
      });

      debug();

      expect(queryByDisplayValue('test1')).toBeTruthy();

      errorMsg = queryAllByText('Numbers only');

      expect(errorMsg.length).toBe(1);
    });
  });
});

/* global describe,test,expect,afterEach */

import { MuiThemeProvider } from '@material-ui/core';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import useForm from '../../';
import reducer, * as selectors from '../../../../reducers';
import themeProvider from '../../../../theme/themeProvider';
import FormFragment from '../../FormFragment';

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

  describe('shown immediately', () => {
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
          defaultFields={fieldsMeta.layout.fields}
          formKey={formKey}
        />
      );
    };

    test('should show only one warning when FIELD1 is invalid', () => {
      const { getAllByText, debug } = render(
        reduxWrappedComponent({
          Component,
          store,
          componentProps: { formKey: null },
        })
      );

      debug();
      const errorMsg = getAllByText('Numbers only');

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

      expect(formState.fields).toBe({});
      //   selecto;
    });
  });
});

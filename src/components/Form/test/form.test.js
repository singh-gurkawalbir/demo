/* eslint-disable jest/no-export */

import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import { fireEvent, render, configure } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import useForm from '..';
import actions from '../../../actions';
import reducer, { selectors } from '../../../reducers';
import themeProvider from '../../../theme/themeProvider';
import { message } from '../../../utils/messageStore';
import FormGenerator from '../../DynaForm/DynaFormGenerator';

// fireEvent
// Ok, so here's what your tests might look like

// this is a handy function that I would utilize for any component
// that relies on the router being in context

// This functional component creates a dummy redux state
// and wraps out custom component with react router

const theme = themeProvider();

configure({ testIdAttribute: 'data-test' });

export function reduxWrappedComponent({ Component, store, componentProps }) {
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <Component {...componentProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
}

export const Component = hookProps => {
  const { fieldMeta } = hookProps;
  const formKey = useForm(hookProps);

  if (!formKey) return null;

  return <FormGenerator {...fieldMeta} formKey={formKey} />;
};

describe('validation warnings', () => {
  const fieldMeta = {
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

  describe('shown validation errors immediately', () => {
    // developer state
    const store = createStore(reducer, {
      user: { profile: { name: 'profile 1' } },
    });

    test('should show only one warning when FIELD1 is invalid', () => {
      const { queryAllByText } = render(
        reduxWrappedComponent({
          Component,
          store,
          componentProps: {
            formKey: null,
            fieldMeta,
            showValidationBeforeTouched: true,
          },
        })
      );
      const errorMsg = queryAllByText('Numbers only');

      expect(errorMsg).toBeTruthy();

      expect(errorMsg).toHaveLength(1);
    });
    test('should show that the field FIELD1 state is invalid and the FIELD2 state is valid', () => {
      render(
        reduxWrappedComponent({
          Component,
          store,
          componentProps: {
            formKey: 123,
            fieldMeta,
            showValidationBeforeTouched: true,
          },
        })
      );

      const formState = selectors.formState(store.getState(), 123);
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
    const formKey = '123';
    let queryAllByText;
    let queryByDisplayValue;

    beforeEach(() => {
      ({ queryAllByText, queryByDisplayValue } = render(
        reduxWrappedComponent({
          Component,
          store,
          componentProps: { formKey, fieldMeta },
        })
      ));
    });
    test('should show no warnings when field is invalid', () => {
      const errorMsg = queryAllByText('Numbers only');

      expect(errorMsg).toHaveLength(0);
    });
    test('should show that the field FIELD1 and FIELD2 state is valid initially,after a touch is simulated should we show that field error', () => {
      const formState = selectors.formState(store.getState(), formKey);
      const { FIELD1, FIELD2 } = formState.fields;

      expect(FIELD1.isValid).toBe(true);
      expect(FIELD2.isValid).toBe(true);

      // form state should be still valid
      expect(formState.isValid).toBe(false);

      let errorMsg = queryAllByText('Numbers only');

      expect(errorMsg).toHaveLength(0);

      const ele = queryByDisplayValue('test');

      // feeding a non number again
      fireEvent.change(ele, {
        target: {
          value: 'test1',
        },
      });

      expect(queryByDisplayValue('test1')).toBeTruthy();

      errorMsg = queryAllByText('Numbers only');

      expect(errorMsg).toHaveLength(1);
    });
  });
});

describe('visible behavior', () => {
  const formKey = '123';
  let store;
  const fieldMeta = {
    fieldMap: {
      visibleField: {
        id: 'FIELD1',
        type: 'text',
        name: 'field1',
        defaultValue: 'test',
        label: 'field1',
        visibleWhen: [{ field: 'FIELD2', is: ['standard'] }],
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

    layout: { fields: ['visibleField', 'validField'] },
  };
  let queryByDisplayValue;

  beforeEach(() => {
    // build up the state
    store = createStore(reducer, {
      user: { profile: { name: 'profile 1' } },
    });

    ({ queryByDisplayValue } = render(
      reduxWrappedComponent({
        Component,
        store,
        componentProps: { formKey, fieldMeta },
      })
    ));
  });
  test('visibleField should be initially invisible since it does not meet its visible expression criteria', () => {
    // find a field with that default value
    const formState = selectors.formState(store.getState(), '123');

    expect(formState.fields.FIELD1.visible).toBe(false);
    expect(queryByDisplayValue('test')).not.toBeTruthy();
  });

  test('visibleField should be visible after it visible expression criteria', () => {
    // find a field with that default value
    const ele = queryByDisplayValue('123');

    fireEvent.change(ele, {
      target: {
        value: 'standard',
      },
    });
    expect(queryByDisplayValue('test')).toBeTruthy();
  });

  test('visibleField should be again invisible after it visible expression criteria is not met', () => {
    let ele = queryByDisplayValue('123');

    // make it visible first
    fireEvent.change(ele, {
      target: {
        value: 'standard',
      },
    });
    expect(queryByDisplayValue('test')).toBeTruthy();

    ele = queryByDisplayValue('standard');
    // making it invisible
    fireEvent.change(ele, {
      target: {
        value: 'something else',
      },
    });
    expect(queryByDisplayValue('test')).not.toBeTruthy();
  });
});

describe('required behavior', () => {
  const formKey = '123';
  let store;
  const fieldMeta = {
    fieldMap: {
      requiredField: {
        id: 'FIELD1',
        type: 'text',
        name: 'field1',
        defaultValue: 'test',
        label: 'field1',
        requiredWhen: [{ field: 'FIELD2', is: ['standard'] }],
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

    layout: { fields: ['requiredField', 'validField'] },
  };
  let queryByDisplayValue;

  beforeEach(() => {
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
          fieldMeta,
          showValidationBeforeTouched: true,
        },
      })
    ));
  });

  test('requiredField should be initially not required since it does not meet its requiredWhen expression criteria', () => {
    // find a field with that default value
    const formState = selectors.formState(store.getState(), '123');

    expect(formState.fields.FIELD1.required).toBe(false);
    expect(queryByDisplayValue(message.REQUIRED_MESSAGE)).not.toBeTruthy();
  });

  test('requiredField should be required after it requiredWhen expression criteria is met', () => {
    // find a field with that default value

    const ele = queryByDisplayValue('123');

    fireEvent.change(ele, {
      target: {
        value: 'standard',
      },
    });

    const formState = selectors.formState(store.getState(), '123');

    expect(formState.fields.FIELD1.required).toBe(true);

    // figure out why its not working
    // expect(queryByDisplayValue('A value must be provided')).toBeTruthy();
  });

  test('requiredField should be again not required after it required expression criteria is not met', () => {
    // make it required first

    let ele = queryByDisplayValue('123');

    fireEvent.change(ele, {
      target: {
        value: 'standard',
      },
    });
    const formState = selectors.formState(store.getState(), '123');

    expect(formState.fields.FIELD1.required).toBe(true);

    ele = queryByDisplayValue('standard');

    // make it not required
    fireEvent.change(ele, {
      target: {
        value: 'something else',
      },
    });
    expect(queryByDisplayValue(message.REQUIRED_MESSAGE)).not.toBeTruthy();
  });
});

describe('changing form value prop', () => {
  const fieldMeta = {
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
    },

    layout: { fields: ['field1'] },
  };

  describe('form touched behavior', () => {
    const formKey = '123';
    let store;

    beforeEach(() => {
      // build up the state
      store = createStore(reducer, {
        user: { profile: { name: 'profile 1' } },
      });

      render(
        reduxWrappedComponent({
          Component,
          store,
          componentProps: { formKey, fieldMeta },
        })
      );
    });

    test('field has not been touched', () => {
      const formState = selectors.formState(store.getState(), 123);

      expect(formState.fields.FIELD1.touched).toBe(false);
    });

    test('field should NOT be touched after focus', () => {
      // they are no components implementing this function
      // have to verify through a state update...can be pushed to a reducer

      store.dispatch(actions.form.fieldFocus(formKey)('FIELD1'));
      const formState = selectors.formState(store.getState(), formKey);

      expect(formState.fields.FIELD1.touched).toBe(false);
    });

    test('field should be touched after blur', () => {
      // they are no components implementing this function
      // have to verify through a state update...can be pushed to a reducer test
      store.dispatch(actions.form.fieldBlur(formKey)('FIELD1'));
      const formState = selectors.formState(store.getState(), formKey);

      expect(formState.fields.FIELD1.touched).toBe(true);
    });
  });
});

describe('various layout specific behavior', () => {
  describe('collapse component', () => {
    describe('expand behavior', () => {
      const formKey = '123';
      let store;
      let queryAllByText;
      let queryByDisplayValue;
      const fieldMeta = {
        fieldMap: {
          FIELD1: {
            id: 'FIELD1',
            type: 'text',
            name: 'field1',
            defaultValue: 'test',
            label: 'field1',
            requiredWhen: [{ field: 'FIELD2', is: ['standard'] }],
          },

          FIELD2: {
            id: 'FIELD2',
            type: 'text',
            name: 'field2',
            defaultValue: 'abc',
            label: 'field2',
            validWhen: {
              matchesRegEx: {
                pattern: '^[\\d]+$',
                message: 'Numbers only',
              },
            },
          },
        },

        layout: {
          type: 'collapse',
          fields: ['FIELD1'],
          containers: [{ label: 'expansion panel1', fields: ['FIELD2'] }],
        },
      };

      beforeEach(() => {
        // build up the state

        store = createStore(reducer, {
          user: { profile: { name: 'profile 1' } },
        });

        ({ queryByDisplayValue, queryAllByText } = render(
          reduxWrappedComponent({
            Component,
            store,
            componentProps: {
              formKey,
              fieldMeta,
              showValidationBeforeTouched: true,
            },
          })
        ));
      });

      test('the expansion panel should be expanded since invalid field has not met its validWhen criteria', () => {
        expect(queryByDisplayValue('abc')).toBeTruthy();
      });

      // TODO:try testing the toggle behavior of expansion panel
      // could not do that since the component does not unmount of close
      test('the expansion panel should should continue to be in an expanded state and not collapse when its validWhen condition its met', () => {
        const field2Ele = queryByDisplayValue('abc');
        const errorMsg = queryAllByText('Numbers only');

        expect(errorMsg).toHaveLength(1);
        // feeding a non number again

        fireEvent.change(field2Ele, {
          target: {
            value: '123',
          },
        });

        expect(queryByDisplayValue('123')).toBeTruthy();

        const errorMsgAfterNumberSet = queryAllByText('Numbers only');

        expect(errorMsgAfterNumberSet).toHaveLength(0);
      });
    });
    describe('visible behavior', () => {
      const formKey = '123';
      let store;
      let queryByTestId;
      let queryByDisplayValue;
      const fieldMeta = {
        fieldMap: {
          FIELD1: {
            id: 'FIELD1',
            type: 'text',
            name: 'field1',
            defaultValue: 'test',
            label: 'field1',
          },

          FIELD2: {
            id: 'FIELD2',
            type: 'text',
            name: 'field2',
            defaultValue: 'abc',
            label: 'field2',
            visibleWhen: [{ field: 'FIELD1', is: ['test'] }],
          },
        },

        layout: {
          type: 'collapse',
          fields: ['FIELD1'],
          containers: [{ label: 'expansion panel1', fields: ['FIELD2'] }],
        },
      };

      beforeEach(() => {
        // build up the state

        store = createStore(reducer, {
          user: { profile: { name: 'profile 1' } },
        });

        ({ queryByDisplayValue, queryByTestId } = render(
          reduxWrappedComponent({
            Component,
            store,
            componentProps: {
              formKey,
              fieldMeta,
              showValidationBeforeTouched: true,
            },
          })
        ));
      });

      test('fIELD2 should be visible since it meets its visibleWhen criteria', () => {
        expect(queryByDisplayValue('abc')).toBeTruthy();
      });

      test('fIELD2 expansion panel should be invisible when its visibleWhen criteria is not met', () => {
        const field1Ele = queryByDisplayValue('test');
        // feeding a non number again

        fireEvent.change(field1Ele, {
          target: {
            value: '123',
          },
        });

        expect(queryByDisplayValue('123')).toBeTruthy();

        expect(queryByDisplayValue('abc')).not.toBeTruthy();

        expect(queryByTestId('expansion panel1')).not.toBeTruthy();
      });
      test('fIELD2 expansion panel should be visible when its visibleWhen criteria is met', () => {
        let field1Ele = queryByDisplayValue('test');
        // feeding a non number again

        fireEvent.change(field1Ele, {
          target: {
            value: '123',
          },
        });

        expect(queryByDisplayValue('123')).toBeTruthy();
        field1Ele = queryByDisplayValue('123');
        // feeding a non number again

        fireEvent.change(field1Ele, {
          target: {
            value: 'test',
          },
        });

        expect(queryByDisplayValue('test')).toBeTruthy();

        expect(queryByDisplayValue('abc')).toBeTruthy();

        expect(queryByTestId('expansion panel1')).toBeTruthy();
      });
    });
  });
});

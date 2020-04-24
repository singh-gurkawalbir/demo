/* global describe, test, expect, beforeAll */
import actions from '../../../actions';
import forms from './';

describe('reducer expression test cases', () => {
  const formKey = '123';

  describe('validation expression test case', () => {
    describe('shown validation errors immediately', () => {
      let formState;
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

          field2: {
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

        layout: { fields: ['field1', 'field2'] },
      };

      beforeAll(() => {
        formState = forms(
          undefined,
          actions.form.formInit(formKey, {
            fieldsMeta,
            showValidationBeforeTouched: true,
          })
        );
      });
      test('should evaluate the validation expression because of the showValidationBeforeTouched flag and should show both the field as invalid', () => {
        // associated form State
        const { FIELD1, FIELD2 } = formState[formKey].fields;

        expect(FIELD1.isValid).toBe(false);
        expect(FIELD2.isValid).toBe(false);
        expect(formState[formKey].isValid).toBe(false);
      });

      test('should show no warnings for FIELD1 and FIELD2 when we fullfil both of their validWhen criteria', () => {
        const nextFormState = forms(
          formState,
          actions.form.field.onFieldChange(formKey)('FIELD1', '456')
        );

        // verify FIELD2 maintains the same instance since FIELD2 was unaffected from FIELD1 on change
        expect(formState[formKey].fields.FIELD2).toBe(
          nextFormState[formKey].fields.FIELD2
        );

        formState = forms(
          nextFormState,
          actions.form.field.onFieldChange(formKey)('FIELD2', '236')
        );
        const { FIELD1, FIELD2 } = formState[formKey].fields;

        expect(FIELD1.isValid).toBe(true);
        expect(FIELD2.isValid).toBe(true);
        expect(formState[formKey].isValid).toBe(true);
      });

      test('should show again FIELD1 is errored when its validWhen criteria is not met and the form state should be errored ', () => {
        formState = forms(
          formState,
          actions.form.field.onFieldChange(formKey)('FIELD1', 'some text value')
        );
        const { FIELD1, FIELD2 } = formState[formKey].fields;

        expect(FIELD1.isValid).toBe(false);
        expect(FIELD2.isValid).toBe(true);
        expect(formState[formKey].isValid).toBe(false);
      });
    });
    describe('shown validation errors only for fields touched', () => {
      let formState;
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

      beforeAll(() => {
        formState = forms(
          undefined,
          actions.form.formInit(formKey, {
            fieldsMeta,
          })
        );
      });
      test('should show that all fields are valid since no fields have been touched', () => {
        // associated form State
        const { FIELD1, FIELD2 } = formState[formKey].fields;

        expect(FIELD1.isValid).toBe(true);
        expect(FIELD2.isValid).toBe(true);
        expect(formState[formKey].isValid).toBe(false);
      });

      test('should show that field1 is invalid since its been touched with an invalid value', () => {
        // touching the field with a text
        const nextFormState = forms(
          formState,
          actions.form.field.onFieldChange(formKey)('FIELD1', 'some value')
        );

        // verify FIELD2 maintains the same instance since FIELD2 was unaffected from FIELD1 on change
        expect(formState[formKey].fields.FIELD2).toBe(
          nextFormState[formKey].fields.FIELD2
        );

        formState = nextFormState;
        const { FIELD1, FIELD2 } = formState[formKey].fields;

        expect(FIELD1.isValid).toBe(false);
        expect(FIELD2.isValid).toBe(true);
        expect(formState[formKey].isValid).toBe(false);
      });

      test('should show no warnings when we fullfil again FIELD1 validWhen criteria', () => {
        formState = forms(
          formState,
          actions.form.field.onFieldChange(formKey)('FIELD1', '123')
        );
        const { FIELD1, FIELD2 } = formState[formKey].fields;

        expect(FIELD1.isValid).toBe(true);
        expect(FIELD2.isValid).toBe(true);
        expect(formState[formKey].isValid).toBe(true);
      });
    });
  });
  // couldn't apply verify new field instances behaviour for both required and visible test suite since any change should affect both the fields
  describe('required expression test case', () => {
    let formState;
    const fieldsMeta = {
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
        },
      },

      layout: { fields: ['requiredField', 'validField'] },
    };

    beforeAll(() => {
      formState = forms(
        undefined,
        actions.form.formInit(formKey, {
          fieldsMeta,
        })
      );
    });

    test('requiredField should be initially not required since it does not meet its requiredWhen expression criteria', () => {
      const { FIELD1 } = formState[formKey].fields;

      expect(FIELD1.required).toBe(false);
    });

    test('requiredField should be required after its requiredWhen expression criteria is met ', () => {
      formState = forms(
        formState,
        actions.form.field.onFieldChange(formKey)('FIELD2', 'standard')
      );

      const { FIELD1, FIELD2 } = formState[formKey].fields;

      expect(FIELD2.value).toBe('standard');

      expect(FIELD1.required).toBe(true);
    });

    test('requiredField should be again not required after its required expression criteria is not met ', () => {
      // find a field with that default value
      formState = forms(
        formState,
        actions.form.field.onFieldChange(formKey)('FIELD2', 'some other value')
      );

      const { FIELD1, FIELD2 } = formState[formKey].fields;

      expect(FIELD2.value).toBe('some other value');

      expect(FIELD1.required).toBe(false);
    });
  });

  describe('visible expression test case', () => {
    let formState;
    const fieldsMeta = {
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
        },
      },

      layout: { fields: ['visibleField', 'validField'] },
    };

    beforeAll(() => {
      formState = forms(
        undefined,
        actions.form.formInit(formKey, {
          fieldsMeta,
        })
      );
    });

    test('visibleField should be initially not visible since it does not meet its visibleWhen expression criteria', () => {
      const { FIELD1 } = formState[formKey].fields;

      expect(FIELD1.visible).toBe(false);
    });

    test('visibleField should be visible after its visibleWhen expression criteria is met ', () => {
      formState = forms(
        formState,
        actions.form.field.onFieldChange(formKey)('FIELD2', 'standard')
      );

      const { FIELD1, FIELD2 } = formState[formKey].fields;

      expect(FIELD2.value).toBe('standard');

      expect(FIELD1.visible).toBe(true);
    });

    test('visibleField should be again not visible after its visible expression criteria is not met ', () => {
      // find a field with that default value
      formState = forms(
        formState,
        actions.form.field.onFieldChange(formKey)('FIELD2', 'some other value')
      );

      const { FIELD1, FIELD2 } = formState[formKey].fields;

      expect(FIELD2.value).toBe('some other value');

      expect(FIELD1.visible).toBe(false);
    });
  });

  describe('default disabled behavior', () => {
    const supportedExpression = {
      visible: 'visible',
      required: 'required',
      disabled: 'defaultDisabled',
    };

    Object.keys(supportedExpression).forEach(expression => {
      test(`the default expression state for ${expression} should be true`, () => {
        const fieldsMeta = {
          fieldMap: {
            field: {
              id: 'FIELD1',
              type: 'text',
              name: 'field1',
              defaultValue: 'test',
              label: 'field1',
            },
          },

          layout: { fields: ['field'] },
        };

        fieldsMeta.fieldMap.field[supportedExpression[expression]] = true;

        const formState = forms(
          undefined,
          actions.form.formInit(formKey, {
            fieldsMeta,
          })
        );
        const { FIELD1 } = formState[formKey].fields;

        expect(FIELD1[expression]).toEqual(true);
      });
    });
  });

  describe('force field state behavior', () => {
    let formState;
    const fieldsMeta = {
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
        },
      },

      layout: { fields: ['visibleField', 'validField'] },
    };

    beforeAll(() => {
      formState = forms(
        undefined,
        actions.form.formInit(formKey, {
          fieldsMeta,
        })
      );
    });
    test("FIELD1 should be invisible because it hasn't meet its visible criteria", () => {
      const { FIELD1 } = formState[formKey].fields;

      expect(FIELD1.visible).toBe(false);
    });
    test('FIELD1 should be visible since we force it to take a field state', () => {
      formState = forms(
        formState,
        actions.form.field.forceFieldState(formKey)('FIELD1', true)
      );
      const { FIELD1 } = formState[formKey].fields;

      expect(FIELD1.visible).toBe(true);
    });
    test('FIELD1 should continue to remain to visible even if its dependent criteria has been met', () => {
      // this should make field1 be invisible but it will state its previous state since we have forced it
      formState = forms(
        formState,
        actions.form.field.onFieldChange(formKey)('FIELD2', 'some other value')
      );
      const { FIELD1 } = formState[formKey].fields;

      expect(FIELD1.visible).toBe(true);
    });
    test('FIELD1 should be invisible and its visible state computation should kick start after we clear the force computation and the dependant criteria has been met', () => {
      // this should make field1 be invisible but it will state its previous state since we have forced it
      formState = forms(
        formState,
        actions.form.field.clearForceFieldState(formKey)('FIELD1')
      );
      formState = forms(
        formState,
        actions.form.field.onFieldChange(formKey)('FIELD2', 'some other value1')
      );
      const { FIELD1 } = formState[formKey].fields;

      expect(FIELD1.visible).toBe(false);
    });
  });
});

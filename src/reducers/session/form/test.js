/* global describe, test, expect, beforeAll */
import actions from '../../../actions';
import forms, {selectors} from '.';

describe('reducer expression test cases', () => {
  const formKey = '123';
  const remountKey = '';

  describe('validation expression test case', () => {
    describe('shown validation errors immediately', () => {
      let formState;
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
          actions.form.init(formKey, remountKey, {
            fieldMeta,
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
          actions.form.fieldChange(formKey)('FIELD1', '456')
        );

        // verify FIELD2 maintains the same instance since FIELD2 was unaffected from FIELD1 on change
        expect(formState[formKey].fields.FIELD2).toBe(
          nextFormState[formKey].fields.FIELD2
        );

        formState = forms(
          nextFormState,
          actions.form.fieldChange(formKey)('FIELD2', '236')
        );
        const { FIELD1, FIELD2 } = formState[formKey].fields;

        expect(FIELD1.isValid).toBe(true);
        expect(FIELD2.isValid).toBe(true);
        expect(formState[formKey].isValid).toBe(true);
      });

      test('should show again FIELD1 is errored when its validWhen criteria is not met and the form state should be errored ', () => {
        formState = forms(
          formState,
          actions.form.fieldChange(formKey)('FIELD1', 'some text value')
        );
        const { FIELD1, FIELD2 } = formState[formKey].fields;

        expect(FIELD1.isValid).toBe(false);
        expect(FIELD2.isValid).toBe(true);
        expect(formState[formKey].isValid).toBe(false);
      });
    });
    describe('shown validation errors only for fields touched', () => {
      let formState;
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

      beforeAll(() => {
        formState = forms(
          undefined,
          actions.form.init(formKey, remountKey, {
            fieldMeta,
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
          actions.form.fieldChange(formKey)('FIELD1', 'some value')
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
          actions.form.fieldChange(formKey)('FIELD1', '123')
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
        },
      },

      layout: { fields: ['requiredField', 'validField'] },
    };

    beforeAll(() => {
      formState = forms(
        undefined,
        actions.form.init(formKey, remountKey, {
          fieldMeta,
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
        actions.form.fieldChange(formKey)('FIELD2', 'standard')
      );

      const { FIELD1, FIELD2 } = formState[formKey].fields;

      expect(FIELD2.value).toBe('standard');

      expect(FIELD1.required).toBe(true);
    });

    test('requiredField should be again not required after its required expression criteria is not met ', () => {
      // find a field with that default value
      formState = forms(
        formState,
        actions.form.fieldChange(formKey)('FIELD2', 'some other value')
      );

      const { FIELD1, FIELD2 } = formState[formKey].fields;

      expect(FIELD2.value).toBe('some other value');

      expect(FIELD1.required).toBe(false);
    });
  });

  describe('visible expression test case', () => {
    let formState;
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
        },
      },

      layout: { fields: ['visibleField', 'validField'] },
    };

    beforeAll(() => {
      formState = forms(
        undefined,
        actions.form.init(formKey, remountKey, {
          fieldMeta,
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
        actions.form.fieldChange(formKey)('FIELD2', 'standard')
      );

      const { FIELD1, FIELD2 } = formState[formKey].fields;

      expect(FIELD2.value).toBe('standard');

      expect(FIELD1.visible).toBe(true);
    });

    test('visibleField should be again not visible after its visible expression criteria is not met ', () => {
      // find a field with that default value
      formState = forms(
        formState,
        actions.form.fieldChange(formKey)('FIELD2', 'some other value')
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
        const fieldMeta = {
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

        fieldMeta.fieldMap.field[supportedExpression[expression]] = true;

        const formState = forms(
          undefined,
          actions.form.init(formKey, remountKey, {
            fieldMeta,
          })
        );
        const { FIELD1 } = formState[formKey].fields;

        expect(FIELD1[expression]).toEqual(true);
      });
    });
  });

  describe('force field state behavior', () => {
    describe('visible behavior ', () => {
      let formState;
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
          },
        },

        layout: { fields: ['visibleField', 'validField'] },
      };

      beforeAll(() => {
        formState = forms(
          undefined,
          actions.form.init(formKey, remountKey, {
            fieldMeta,
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
          actions.form.forceFieldState(formKey)('FIELD1', {visible: true})
        );
        const { FIELD1 } = formState[formKey].fields;

        expect(FIELD1.visible).toBe(true);
      });
      test('FIELD1 should continue to remain to visible even if its dependent criteria has been met', () => {
        // this should make field1 be invisible but it will hold its previous visible state since we have forced it
        formState = forms(
          formState,
          actions.form.fieldChange(formKey)('FIELD2', 'some other value')
        );
        const { FIELD1 } = formState[formKey].fields;

        expect(FIELD1.visible).toBe(true);
      });
      test('FIELD1 should be invisible and its visible state computation should kick start after we clear the force computation', () => {
        // this should make field1 be invisible but it will state its previous state since we have forced it
        formState = forms(
          formState,
          actions.form.clearForceFieldState(formKey)('FIELD1')
        );
        // assert visible state computation is restored back to normal

        expect(formState[formKey].fields.FIELD1.visible).toBe(false);
      });

      test('FIELD1 computation should continue to work as normal', () => {
        // lets meet its visible criteria of FIELD1 and assert its visible
        formState = forms(
          formState,
          actions.form.fieldChange(formKey)('FIELD2', 'standard')
        );
        expect(formState[formKey].fields.FIELD1.visible).toBe(true);
      });
    });

    describe('valid behavior', () => {
      let formState;
      const fieldMeta = {
        fieldMap: {
          field1: {
            id: 'FIELD1',
            type: 'text',
            name: 'field1',
            defaultValue: '123',
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

      beforeAll(() => {
        formState = forms(
          undefined,
          actions.form.init(formKey, remountKey, {
            fieldMeta,
            showValidationBeforeTouched: true,
          })
        );
      });

      test('FIELD1 should be valid because it has met its validWhen criteria', () => {
        const { FIELD1 } = formState[formKey].fields;

        expect(FIELD1.isValid).toBe(true);
      });

      test('FIELD1 should be invalid because the field state has been forced', () => {
        formState = forms(
          formState,
          actions.form.forceFieldState(formKey)(
            'FIELD1', {
              isValid: false,
              errorMessages: 'some error',
            }

          )
        );
        const { FIELD1 } = formState[formKey].fields;

        expect(FIELD1.isValid).toBe(false);

        expect(FIELD1.errorMessages).toBe('some error');
      });

      test('FIELD1 should be invalid even after its validWhen criteria has been met', () => {
        formState = forms(
          formState,
          actions.form.fieldChange(formKey)('FIELD1', '123')
        );
        const { FIELD1 } = formState[formKey].fields;

        expect(FIELD1.isValid).toBe(false);

        expect(FIELD1.errorMessages).toBe('some error');
      });

      test('FIELD1 validWhen should kick start again after we clear the force computaion', () => {
        formState = forms(
          formState,
          actions.form.clearForceFieldState(formKey)('FIELD1')
        );
        formState = forms(
          formState,
          actions.form.fieldChange(formKey)('FIELD1', '235')
        );
        const { FIELD1 } = formState[formKey].fields;

        expect(FIELD1.isValid).toBe(true);
        expect(FIELD1.errorMessages).toBe('');
      });
    });
  });
});

describe('selectors test cases', () => {
  const remountKey = '';

  const initialState = {
    '3-4': {
      fields: {},
    },
  };
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
  const formKey = '1-2';
  const formState = forms(
    initialState,
    actions.form.init(formKey, remountKey, {
      fieldMeta,
      parentContext: {
        resourceType: 'exports',
        resourceId: 'someId',
      },
      showValidationBeforeTouched: true,
    })
  );

  describe('formState', () => {
    test('should pick up formState correctly for a existing form state', () => {
      expect(selectors.formState(formState, '3-4')).toEqual({fields: {}});
    });

    test('should pick up null for a non existing form state', () => {
      expect(selectors.formState(formState, 'someotherOne')).toEqual(null);
    });
  });

  describe('formParentContext', () => {
    test('should pick up formParentContext correctly for a existing form state', () => {
      expect(selectors.formParentContext(formState, '1-2')).toEqual({
        resourceType: 'exports',
        resourceId: 'someId',
      });
    });

    test('should return null for a non existing form parent context state', () => {
      expect(selectors.formParentContext(formState, 'someotherOne')).toEqual(null);
    });
  });
  describe('formParentContext', () => {
    test('should pick up formParentContext correctly for a existing form state', () => {
      expect(selectors.formParentContext(formState, '1-2')).toEqual({
        resourceType: 'exports',
        resourceId: 'someId',
      });
    });

    test('should return null for a non existing form state', () => {
      expect(selectors.formParentContext(formState, 'someotherOne')).toEqual(null);
    });
  });
  describe('formFieldState', () => {
    test('should pick up a fieldState for a form correctly', () => {
      // check it if that fieldState exists
      expect(selectors.fieldState(formState, formKey, 'FIELD1')).toBeTruthy();
    });

    test('should pick up null for a non existing field state', () => {
      expect(selectors.fieldState(formState, formKey, 'FIELD3')).toEqual(null);
    });
  });
  describe('isActionButtonVisible', () => {
    const fieldMeta = {
      fieldMap: {
        field1: {
          id: 'FIELD1',
          type: 'text',
          name: 'field1',
          defaultValue: 'test',
          label: 'field1',
        },

        field2: {
          id: 'FIELD2',
          type: 'text',
          name: 'field2',
          defaultValue: 'abc',
          label: 'field2',
        },
      },

      layout: { fields: ['field1', 'field2'] },
    };
    const formKey = '1-2';
    const formState = forms(
      initialState,
      actions.form.init(formKey, remountKey, {
        fieldMeta,
        showValidationBeforeTouched: true,
      })
    );

    test('should return false for a non existing form', () => {
      expect(selectors.isActionButtonVisible(formState, 'someFormKey', {
        visibleWhen: [
          {field: 'FIELD2', is: ['def']},
        ],
      })).toBe(false);
    });

    test('should return false for an invisible field', () => {
      expect(selectors.isActionButtonVisible(formState, formKey, {
        visibleWhen: [
          {field: 'FIELD2', is: ['def']},
        ],
      })).toBe(false);
    });
    test('should return true for a visible field', () => {
      const formStateFullFilledRule = forms(
        formState,
        actions.form.fieldChange(formKey)('FIELD2', 'def')
      );

      expect(selectors.isActionButtonVisible(formStateFullFilledRule, formKey, {
        visibleWhen: [
          {field: 'FIELD2', is: ['def']},
        ],
      })).toBe(true);
    });
  });

  describe('isAnyFieldVisibleForMetaForm', () => {
    const fieldMeta = {
      fieldMap: {
        FIELD1: {
          id: 'FIELD1',
          type: 'text',
          name: 'field1',
          defaultValue: 'test',
          label: 'field1',
          visibleWhen: [
            {field: 'FIELD2', is: ['abc']},
          ],
        },

        FIELD2: {
          id: 'FIELD2',
          type: 'text',
          name: 'field2',
          defaultValue: 'abc',
          label: 'field2',
        },
      },

      layout: { fields: ['FIELD1', 'FIELD2'] },
    };
    const formKey = '1-2';
    const formState = forms(
      initialState,
      actions.form.init(formKey, remountKey, {
        fieldMeta,
        showValidationBeforeTouched: true,
      })
    );

    const subSegmentMeta = {
      fieldMap: {
        FIELD1: {
          id: 'FIELD1',
          type: 'text',
          name: 'FIELD1',
          defaultValue: 'test',
          label: 'field1',
          visibleWhen: [
            {field: 'FIELD2', is: ['abc']},
          ],
        },
      },
      layout: {
        fields: ['FIELD1'],
      },
    };

    test('should return true when the given metadata segement is visible', () => {
      expect(selectors
        .isAnyFieldVisibleForMetaForm(formState, formKey, subSegmentMeta))
        .toBe(true);
    });
    test('should return false when the given metadata segement is invisible', () => {
      const updatedFormState = forms(
        formState,
        actions.form.fieldChange(formKey)('FIELD2', '456')

      );

      expect(selectors
        .isAnyFieldVisibleForMetaForm(updatedFormState, formKey, subSegmentMeta))
        .toBe(false);
    });
  });
  describe('isExpansionPanelRequiredForMetaForm', () => {
    const fieldMeta = {
      fieldMap: {
        FIELD1: {
          id: 'FIELD1',
          type: 'text',
          name: 'field1',
          defaultValue: 'testsdd',
          label: 'field1',
          visibleWhen: [
            {field: 'FIELD2', is: ['abc']},
          ],
          requiredWhen: [
            {field: 'FIELD1', is: ['test']},
          ],
        },

        FIELD2: {
          id: 'FIELD2',
          type: 'text',
          name: 'field2',
          defaultValue: 'abc',
          label: 'field2',
        },
      },

      layout: { fields: ['FIELD1', 'FIELD2'] },
    };
    const formKey = '1-2';
    const formState = forms(
      initialState,
      actions.form.init(formKey, remountKey, {
        fieldMeta,
        showValidationBeforeTouched: true,
      })
    );

    const subSegmentMeta = {
      fieldMap: {
        FIELD1: {
          id: 'FIELD1',
          type: 'text',
          name: 'field1',
          defaultValue: 'testsdd',
          label: 'field1',
          visibleWhen: [
            {field: 'FIELD2', is: ['abc']},
          ],
          requiredWhen: [
            {field: 'FIELD1', is: ['test']},
          ],
        },
      },
      layout: {
        fields: ['FIELD1'],
      },
    };

    test('should return false when the given metadata segement is visible and required', () => {
      expect(selectors
        .isExpansionPanelRequiredForMetaForm(formState, formKey, subSegmentMeta))
        .toBe(false);
    });
    test('should return true when the given metadata segement is required', () => {
      const updatedFormState = forms(
        formState,
        actions.form.fieldChange(formKey)('FIELD1', 'test')

      );

      expect(selectors
        .isExpansionPanelRequiredForMetaForm(updatedFormState, formKey, subSegmentMeta))
        .toBe(true);
    });
    test('should return false when the given metadata segement is required but invisible', () => {
      const updatedFormState = forms(
        formState,
        actions.form.fieldChange(formKey)('FIELD2', 'fdfdf')

      );

      expect(selectors
        .isExpansionPanelRequiredForMetaForm(updatedFormState, formKey, subSegmentMeta))
        .toBe(false);
    });
  });

  describe('isExpansionPanelErroredForMetaForm', () => {
    const fieldMeta = {
      fieldMap: {
        FIELD1: {
          id: 'FIELD1',
          type: 'text',
          name: 'field1',
          defaultValue: 'testsdd',
          label: 'field1',
          validWhen: {
            matchesRegEx: {
              pattern: '^[\\d]+$',
              message: 'Numbers only',
            },
          },
        },

        FIELD2: {
          id: 'FIELD2',
          type: 'text',
          name: 'field2',
          defaultValue: 'abc',
          label: 'field2',
        },
      },

      layout: { fields: ['FIELD1', 'FIELD2'] },
    };
    const formKey = '1-2';
    const formState = forms(
      initialState,
      actions.form.init(formKey, remountKey, {
        fieldMeta,
        showValidationBeforeTouched: true,
      })
    );

    const subSegmentMeta = {
      fieldMap: {
        FIELD1: {
          id: 'FIELD1',
          type: 'text',
          name: 'field1',
          defaultValue: 'testsdd',
          label: 'field1',
          validWhen: {
            matchesRegEx: {
              pattern: '^[\\d]+$',
              message: 'Numbers only',
            },
          },
        },
      },
      layout: {
        fields: ['FIELD1'],
      },
    };

    test('should return false when the given metadata segement is visible and required', () => {
      expect(selectors
        .isExpansionPanelErroredForMetaForm(formState, formKey, subSegmentMeta))
        .toBe(true);
    });
    test('should return true when the given metadata segement is required', () => {
      const updatedFormState = forms(
        formState,
        actions.form.fieldChange(formKey)('FIELD1', '124')

      );

      expect(selectors
        .isExpansionPanelErroredForMetaForm(updatedFormState, formKey, subSegmentMeta))
        .toBe(false);
    });
  });

  describe('isAnyFieldTouchedForMetaForm', () => {
    const fieldMeta = {
      fieldMap: {
        FIELD1: {
          id: 'FIELD1',
          type: 'text',
          name: 'field1',
          defaultValue: 'testsdd',
          label: 'field1',
          validWhen: {
            matchesRegEx: {
              pattern: '^[\\d]+$',
              message: 'Numbers only',
            },
          },
        },

        FIELD2: {
          id: 'FIELD2',
          type: 'text',
          name: 'field2',
          defaultValue: 'abc',
          label: 'field2',
        },
      },

      layout: { fields: ['FIELD1', 'FIELD2'] },
    };
    const formKey = '1-2';
    const formState = forms(
      initialState,
      actions.form.init(formKey, remountKey, {
        fieldMeta,
        showValidationBeforeTouched: true,
      })
    );

    const subSegmentMeta = {
      fieldMap: {
        FIELD1: {
          id: 'FIELD1',
          type: 'text',
          name: 'field1',
          defaultValue: 'testsdd',
          label: 'field1',
          validWhen: {
            matchesRegEx: {
              pattern: '^[\\d]+$',
              message: 'Numbers only',
            },
          },
        },
      },
      layout: {
        fields: ['FIELD1'],
      },
    };

    test('should return false when the given metadata segement is not touched', () => {
      expect(selectors
        .isAnyFieldTouchedForMetaForm(formState, formKey, subSegmentMeta))
        .toBe(false);
    });
    test('should return true when the given metadata segement is touched', () => {
      const updatedFormState = forms(
        formState,
        actions.form.fieldChange(formKey)('FIELD1', '124')

      );

      expect(selectors
        .isAnyFieldTouchedForMetaForm(updatedFormState, formKey, subSegmentMeta))
        .toBe(true);
    });
  });
});

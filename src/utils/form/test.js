/* eslint-disable camelcase */
import { deepClone } from 'fast-json-patch/lib/core';
import {
  evaluateAllRules,
  evaluateRule,
  evaluateSomeRules,
  isDisabled,
  isRequired,
  isVisible,
  processFields,
  registerFields,
  shouldOmitFieldValue,
  getTouchedStateForField,
  setOptionsInFieldInState,
  calculateFormValue,
  updateFieldValue,
  joinDelimitedValue,
  getMissingItems,
  determineChangedValues,
  getFirstErroredFieldId,
} from '.';
import {
  shouldOptionsBeRefreshed,
  getFirstDefinedValue,
  splitDelimitedValue,
  fieldDefIsValidUpdated,
} from './field';

// eslint-disable-next-line jest/no-export
export const createField = field => {
  const {
    id = '',
    name = '',
    type = '',
    placeholder = '',
    value = undefined,
    visible = true,
    required = false,
    disabled = false,
    visibleWhen = [],
    visibleWhenAll = [],
    requiredWhen = [],
    requiredWhenAll = [],
    disabledWhen = [],
    disabledWhenAll = [],
    validWhen = {},
    isValid = true,
    errorMessages = '',
    touched = false,
  } = field;

  return {
    id,
    name,
    type,
    placeholder,
    value,
    visible,
    required,
    disabled,
    visibleWhen,
    visibleWhenAll,
    requiredWhen,
    requiredWhenAll,
    disabledWhen,
    disabledWhenAll,
    isValid,
    validWhen,
    errorMessages,
    touched,
  };
};

const field1 = createField({
  id: 'one',
  name: 'name',
  value: 'value',
});

describe('shouldOptionsBeRefreshed', () => {
  const optionsShouldNotRefresh = {
    id: 'OPTIONS_SHOULD_NOT_CHANGE',
    name: 'a',
    type: 'select',
    options: [
      {
        items: ['1'],
      },
    ],
  };
  const optionsShouldBeRefreshed = {
    id: 'OPTIONS_SHOULD_REFRESH',
    name: 'c',
    type: 'select',
    options: [
      {
        items: ['1'],
      },
    ],
    refreshOptionsOnChangesTo: ['FAKE', 'TRIGGER', 'COUNTERFEIT'],
  };

  test('options should not be refreshed unless requested', () => {
    expect(
      shouldOptionsBeRefreshed({
        lastFieldUpdated: 'TRIGGER',
        field: optionsShouldNotRefresh,
      })
    ).toBe(false);
  });

  test('options should not be refreshed unless last field change is trigger', () => {
    expect(
      shouldOptionsBeRefreshed({
        lastFieldUpdated: 'NOPE',
        field: optionsShouldBeRefreshed,
      })
    ).toBe(false);
  });

  test('options should refrehs when last field changed is a trigger', () => {
    expect(
      shouldOptionsBeRefreshed({
        lastFieldUpdated: 'TRIGGER',
        field: optionsShouldBeRefreshed,
      })
    ).toBe(true);
  });

  test('returns false when last field changed is undefined', () => {
    expect(
      shouldOptionsBeRefreshed({
        field: optionsShouldBeRefreshed,
      })
    ).toBe(false);
  });
});

describe('registerFields', () => {
  const field1 = createField({
    id: 'a',
    name: 'a',
    type: 'text',
  });
  const field2 = createField({
    id: 'b',
    name: 'b',
    type: 'text',
  });
  const field3 = createField({
    id: 'a',
    name: 'c',
    type: 'text',
  });
  const fieldMap = { field1, field2, field3 };

  // when registering the order of values may affect which field to register
  test('fields with duplicate IDs are filtered out', () => {
    const registeredFields = registerFields(fieldMap, {});

    expect(Object.values(registeredFields)).toHaveLength(2);
    expect(registeredFields.a).toBeTruthy();
    expect(registeredFields.b).toBeTruthy();
  });
});

describe('fieldDefIsValidUpdated', () => {
  test('field is valid when the form does not contain a field with the same id', () => {
    expect(fieldDefIsValidUpdated(field1, {})).toBe(true);
  });

  test('field is not valid when form already contains a field with the same id', () => {
    expect(fieldDefIsValidUpdated(field1, {[field1.id]: field1})).toBe(false);
  });
});

describe('evaluateRule', () => {
  test('evaluting a rule with no arguments', () => {
    expect(evaluateRule()).toBe(true);
  });

  test("successful 'is' rule", () => {
    expect(
      evaluateRule({
        field: 'one',
        rule: {
          is: [true],
        },
        targetValue: true,
      })
    ).toBe(true);
  });

  test("failing 'is' rule", () => {
    expect(
      evaluateRule(
        {
          field: 'one',
          is: [false],
        },
        true
      )
    ).toBe(false);
  });

  test("successful 'isNot' rule", () => {
    expect(
      evaluateRule(
        {
          field: 'one',
          isNot: [true],
        },
        false
      )
    ).toBe(true);
  });

  test("failing 'isNot' rule", () => {
    expect(
      evaluateRule(
        {
          field: 'one',
          isNot: [false],
        },
        false
      )
    ).toBe(false);
  });

  test("successful combined 'is' and isNot' rule", () => {
    expect(
      evaluateRule(
        {
          field: 'onee',
          is: [true],
          isNot: [false],
        },
        true
      )
    ).toBe(true);
  });

  test("failing combined 'is' and isNot' rule", () => {
    expect(
      evaluateRule(
        {
          field: 'one',
          is: [true],
          isNot: [false],
        },
        false
      )
    ).toBe(false);
  });

  // NOTE: This is one option for allowing form builder to construct rules, but is harder to implement
  test('works with complex objects', () => {
    expect(
      evaluateRule(
        {
          field: 'one',
          is: [{ value: 'bob' }],
          isNot: [{ value: 'ted' }],
        },
        'bob'
      )
    ).toBe(true);
  });
});

describe('rule evaluation', () => {
  // Declare some rules to test...
  const aIs1 = { field: 'a', is: ['1'] };
  const bIs2 = { field: 'b', is: ['2'] };
  const cIs3 = { field: 'c', is: ['3'] };
  const dIs4 = { field: 'd', is: ['4'] };
  const eIs5 = { field: 'e', is: ['5'] };

  const aIs1_or_bIs2_AND_cIs3_or_dIs4 = {
    AND: [
      {OR: [aIs1, bIs2]},
      {OR: [cIs3, dIs4]},
    ],
  };
  // Create some fields to be tested (fieldC is expected to fail)...
  const fieldA = createField({ id: 'A', name: 'a', value: '1' });
  const fieldB = createField({ id: 'B', name: 'b', value: '2' });
  const fieldC = createField({ id: 'C', name: 'c', value: 'fail' });
  const fieldD = createField({ id: 'D', name: 'd', value: '4'});
  const fieldE = createField({ id: 'E', name: 'e', value: 'fail' });

  describe('evaluateAllRules', () => {
    test('should default result(true) when there are rules of invalid signature', () => {
      const rules = [{someUnknownProp: 'd'}];
      const fieldsById = {};

      expect(
        evaluateAllRules({ rules, fieldsById })
      ).toBe(true);
    });
    test('should return default result when there are no rules provided', () => {
      const rules = [];
      const fieldsById = {};

      expect(
        evaluateAllRules({ rules, fieldsById, defaultResult: false })
      ).toBe(false);
    });
    test('passes when there are no rules provided', () => {
      const rules = [];
      const fieldsById = {};

      expect(
        evaluateAllRules({ rules, fieldsById, defaultResult: true })
      ).toBe(true);
    });

    test('fails when one rule fails', () => {
      const rules = [aIs1, bIs2, cIs3];
      const fieldsById = {
        a: fieldA,
        b: fieldB,
        c: fieldC,
      };

      expect(
        evaluateAllRules({ rules, fieldsById, defaultResult: true })
      ).toBe(false);
    });

    test('passes when all rules pass', () => {
      const rules = [aIs1, bIs2];
      const fieldsById = {
        a: fieldA,
        b: fieldB,
        c: fieldC,
      };

      expect(
        evaluateAllRules({ rules, fieldsById, defaultResult: true })
      ).toBe(true);
    });

    test('passes when all rules pass of combinations1', () => {
      const rules = [{
        AND: [
          {OR: [aIs1, bIs2]},
          {OR: [cIs3, dIs4]},
        ],
      }];
      const fieldsById = {
        a: fieldA,
        b: fieldB,
        c: fieldC,
        d: fieldD,
        e: fieldE,
      };

      expect(
        evaluateAllRules({ rules, fieldsById, defaultResult: false })
      ).toBe(true);
    });

    test('passes when all rules pass of combinations2', () => {
      const rules = [{
        OR: [
          {OR: [aIs1, bIs2]},
          {AND: [cIs3, dIs4]},
        ],
      }];
      const fieldsById = {
        a: fieldA,
        b: fieldB,
        c: fieldC,
        d: fieldD,
        e: fieldE,
      };

      expect(
        evaluateAllRules({ rules, fieldsById, defaultResult: false })
      ).toBe(true);
    });

    test('passes when all rules pass of combinations4', () => {
      const rules = [{
        OR: [
          {AND: [aIs1, bIs2]},
          {AND: [cIs3, dIs4]},
        ],
      }];
      const fieldsById = {
        a: fieldA,
        b: fieldB,
        c: fieldC,
        d: fieldD,
        e: fieldE,
      };

      expect(
        evaluateAllRules({ rules, fieldsById, defaultResult: false })
      ).toBe(true);
    });

    test('passes when all rules pass of combinations4 duplicate', () => {
      const rules = [{
        AND: [
          {AND: [aIs1, bIs2]},
          {OR: [cIs3, dIs4]},
        ],
      }];
      const fieldsById = {
        a: fieldA,
        b: fieldB,
        c: fieldC,
        d: fieldD,
        e: fieldE,
      };

      expect(
        evaluateAllRules({ rules, fieldsById, defaultResult: false })
      ).toBe(true);
    });

    test('passes when all rules pass of combinations3', () => {
      const rules = [aIs1_or_bIs2_AND_cIs3_or_dIs4];
      const fieldsById = {
        a: fieldA,
        b: fieldB,
        c: fieldC,
        d: fieldD,
        e: fieldE,
      };

      expect(
        evaluateAllRules({ rules, fieldsById, defaultResult: true })
      ).toBe(true);
      expect(
        evaluateAllRules({ rules, fieldsById, defaultResult: false })
      ).toBe(true);
      expect(
        evaluateAllRules({ rules: [{
          AND: [
            {OR: [aIs1, bIs2]},
            {OR: [cIs3, eIs5]},
          ],
        }],
        fieldsById,
        defaultResult: true})
      ).toBe(false);
    });
  });

  describe('evaluateSomeRules', () => {
    test('should default result(true) when there are rules of invalid signature', () => {
      const rules = [{someUnknownProp: 'd'}];
      const fieldsById = {};

      expect(
        evaluateSomeRules({ rules, fieldsById })
      ).toBe(true);
    });
    test('should return defaultResult when there are no rules provided', () => {
      const rules = [];
      const fieldsById = {};

      expect(
        evaluateSomeRules({ rules, fieldsById, defaultResult: false })
      ).toBe(false);
    });
    test('passes when there are no rules provided', () => {
      const rules = [];
      const fieldsById = {};

      expect(
        evaluateSomeRules({ rules, fieldsById, defaultResult: true })
      ).toBe(true);
    });
    test('fails when all rules fail', () => {
      const rules = [cIs3];
      const fieldsById = {
        c: fieldC,
      };

      expect(
        evaluateSomeRules({ rules, fieldsById, defaultResult: true })
      ).toBe(false);
    });

    test('passes when some rules pass but some fail', () => {
      const rules = [aIs1, bIs2, cIs3];
      const fieldsById = {
        a: fieldA,
        b: fieldB,
        c: fieldC,
      };

      expect(
        evaluateSomeRules({ rules, fieldsById, defaultResult: true })
      ).toBe(true);
    });

    test('passes when all rules pass', () => {
      const rules = [aIs1, bIs2];
      const fieldsById = {
        a: fieldA,
        b: fieldB,
        c: fieldC,
      };

      expect(
        evaluateSomeRules({ rules, fieldsById, defaultResult: true })
      ).toBe(true);
    });
  });

  describe('isVisible', () => {
    const field = {
      ...createField({
        id: 'test',
        name: 'test',
        value: 'bob',
      }),
    };
    const fieldsById = {
      test: field,
      a: fieldA,
      b: fieldB,
      c: fieldC,
    };

    test('returns true when visibleWhen rule is true', () => {
      const testField = { ...field, visibleWhen: [aIs1] };

      expect(isVisible(testField, fieldsById)).toBe(true);
    });
    test('return false when visibleWhen rule is false', () => {
      const testField = { ...field, visibleWhen: [cIs3] };

      expect(isVisible(testField, fieldsById)).toBe(false);
    });
    test('returns true when visibleWhenAll rule is true', () => {
      const testField = { ...field, visibleWhenAll: [aIs1, bIs2] };

      expect(isVisible(testField, fieldsById)).toBe(true);
    });
    test('return false when visibleWhenAll rule is false', () => {
      const testField = { ...field, visibleWhenAll: [aIs1, cIs3] };

      expect(isVisible(testField, fieldsById)).toBe(false);
    });

    describe('should AND both the default rule and expression', () => {
      const inputs = [
        ['should return true when defaultVisible is true and expression rule is true',
          {visibleWhenAll: [aIs1, bIs2], defaultVisible: true}, true],
        ['should return false when defaultVisible is true and expression rule is false',
          {visibleWhenAll: [aIs1, bIs2], defaultVisible: false}, false],
        ['should return false when defaultVisible is false and when no expresssion is provided ',
          {visibleWhenAll: [aIs1, bIs2], defaultVisible: false}, false],
        ['should return the default result that visible is true when no expresssion is provided ',
          {}, true],
      ];

      test.each(inputs)('%s', (testName, conditions, result) => {
        const testField = { ...field, ...conditions};

        expect(isVisible(testField, fieldsById)).toBe(result);
      });
    });
  });

  describe('isRequired', () => {
    const field = {
      ...createField({
        id: 'test',
        name: 'test',
        value: 'bob',
      }),
    };
    const fieldsById = {
      test: field,
      a: fieldA,
      b: fieldB,
      c: fieldC,
    };

    test('returns true when requiredWhen rule is true', () => {
      const testField = { ...field, requiredWhen: [aIs1] };

      expect(isRequired(testField, fieldsById)).toBe(true);
    });
    test('return false when requiredWhen rule is false', () => {
      const testField = { ...field, requiredWhen: [cIs3] };

      expect(isRequired(testField, fieldsById)).toBe(false);
    });
    test('returns true when requiredWhenAll rule is true', () => {
      const testField = { ...field, requiredWhenAll: [aIs1, bIs2] };

      expect(isRequired(testField, fieldsById)).toBe(true);
    });
    test('return false when requiredWhenAll rule is false', () => {
      const testField = { ...field, requiredWhenAll: [aIs1, cIs3] };

      expect(isRequired(testField, fieldsById)).toBe(false);
    });
    describe('should AND both the default rule and expression', () => {
      const inputs = [
        ['should return true when defaultRequired is true and expression rule is true',
          {requiredWhenAll: [aIs1, bIs2], defaultRequired: true}, true],
        ['should return false when defaultRequired is true and expression rule is false',
          {requiredWhenAll: [aIs1, bIs2], defaultRequired: false}, false],
        ['should return false when defaultRequired is false and when no expresssion is provided ',
          {requiredWhenAll: [aIs1, bIs2], defaultRequired: false}, false],
        ['should return the default result that required is false when no expresssion is provided ',
          {}, false],
      ];

      test.each(inputs)('%s', (testName, conditions, result) => {
        const testField = { ...field, ...conditions};

        expect(isRequired(testField, fieldsById)).toBe(result);
      });
    });
  });

  describe('isDisabled', () => {
    const field = {
      ...createField({
        id: 'test',
        name: 'test',
        value: 'bob',
      }),
    };
    const fieldsById = {
      test: field,
      a: fieldA,
      b: fieldB,
      c: fieldC,
    };

    test('returns true when disableWhen rule is true', () => {
      const testField = { ...field, disabledWhen: [aIs1] };

      expect(isDisabled(testField, fieldsById)).toBe(true);
    });
    test('return false when disableWhen rule is false', () => {
      const testField = { ...field, disabledWhen: [cIs3] };

      expect(isDisabled(testField, fieldsById)).toBe(false);
    });
    test('returns true when disableWhenAll rule is true', () => {
      const testField = { ...field, disabledWhenAll: [aIs1, bIs2] };

      expect(isDisabled(testField, fieldsById)).toBe(true);
    });
    test('return false when disableWhenAll rule is false', () => {
      const testField = { ...field, disabledWhenAll: [aIs1, cIs3] };

      expect(isDisabled(testField, fieldsById)).toBe(false);
    });
    describe('should AND both the default rule and expression', () => {
      const inputs = [
        ['should return true when defaultDisabled is true and expression rule is true',
          {disabledWhenAll: [aIs1, bIs2], defaultDisabled: true}, true],
        ['should return false when defaultDisabled is true and expression rule is false',
          {disabledWhenAll: [aIs1, bIs2], defaultDisabled: false}, false],
        ['should return false when defaultDisabled is false and when no expresssion is provided ',
          {disabledWhenAll: [aIs1, bIs2], defaultDisabled: false}, false],
        ['should return the default result that visible is true when no expresssion is provided ',
          {}, false],
      ];

      test.each(inputs)('%s', (testName, conditions, result) => {
        const testField = { ...field, ...conditions};

        expect(isDisabled(testField, fieldsById)).toBe(result);
      });
    });
  });
});

describe('processFields', () => {
  const triggerField = createField({
    id: 'triggerField',
    name: 'triggerField',
    value: 'test',
  });
  const triggerField2 = createField({
    id: 'triggerField2',
    name: 'triggerField2',
    value: 'check',
  });
  const shouldBeVisible = createField({
    id: 'shouldBeVisible',
    name: 'shouldBeVisible',
    visibleWhen: [
      {
        field: 'triggerField',
        is: ['test'],
      },
      {
        field: 'triggerField2',
        is: ['wtf'],
      },
    ],
  });
  const shouldBeHidden = createField({
    id: 'shouldBeHidden',
    name: 'shouldBeHidden',
    visibleWhen: [
      {
        field: 'triggerField',
        isNot: ['test'],
      },
    ],
  });
  const shouldBeVisible_All = createField({
    id: 'shouldBeVisible_All',
    name: 'shouldBeVisible_All',
    visibleWhenAll: [
      {
        field: 'triggerField',
        is: ['test'],
      },
      {
        field: 'triggerField2',
        is: ['check'],
      },
    ],
  });
  const shouldBeHidden_All = createField({
    id: 'shouldBeHidden_All',
    name: 'shouldBeHidden_All',
    visibleWhenAll: [
      {
        field: 'triggerField',
        is: ['test'],
      },
      {
        field: 'triggerField2',
        is: ['moo'],
      },
    ],
  });
  const shouldBeRequired = createField({
    id: 'shouldBeRequired',
    name: 'shouldBeRequired',
    requiredWhen: [
      {
        field: 'triggerField',
        is: ['test'],
      },
    ],
  });
  const shouldBeOptional = createField({
    id: 'shouldBeOptional',
    name: 'shouldBeOptional',
    requiredWhen: [
      {
        field: 'triggerField',
        isNot: ['test'],
      },
    ],
  });
  const shouldBeRequired_All = createField({
    id: 'shouldBeRequired_All',
    name: 'shouldBeRequired_All',
    requiredWhenAll: [
      {
        field: 'triggerField',
        is: ['test'],
      },
      {
        field: 'triggerField2',
        is: ['check'],
      },
    ],
  });
  const shouldBeOptional_All = createField({
    id: 'shouldBeOptional_All',
    name: 'shouldBeOptional_All',
    requiredWhenAll: [
      {
        field: 'triggerField',
        is: ['woof'],
      },
      {
        field: 'triggerField2',
        is: ['check'],
      },
    ],
  });
  const shouldBeDisabled = createField({
    id: 'shouldBeDisabled',
    name: 'shouldBeDisabled',
    disabledWhen: [
      {
        field: 'triggerField',
        is: ['test'],
      },
    ],
  });
  const shouldBeEnabled = createField({
    id: 'shouldBeEnabled',
    name: 'shouldBeEnabled',
    disabledWhen: [
      {
        field: 'triggerField',
        isNot: ['test'],
      },
    ],
  });
  const shouldBeDisabled_All = createField({
    id: 'shouldBeDisabled_All',
    name: 'shouldBeDisabled_All',
    disabledWhenAll: [
      {
        field: 'triggerField',
        is: ['test'],
      },
      {
        field: 'triggerField2',
        is: ['check'],
      },
    ],
  });
  const shouldBeEnabled_All = createField({
    id: 'shouldBeEnabled_All',
    name: 'shouldBeEnabled_All',
    disabledWhenAll: [
      {
        field: 'triggerField',
        isNot: ['test'],
      },
      {
        field: 'triggerField2',
        is: ['check'],
      },
    ],
  });
  const fields = {
    triggerField,
    triggerField2,
    shouldBeVisible,
    shouldBeHidden,
    shouldBeRequired,
    shouldBeOptional,
    shouldBeDisabled,
    shouldBeEnabled,
    shouldBeVisible_All,
    shouldBeHidden_All,
    shouldBeRequired_All,
    shouldBeOptional_All,
    shouldBeDisabled_All,
    shouldBeEnabled_All,
  };
  const mutatedReference = deepClone(fields);

  processFields(mutatedReference, false, false);
  const processedFieldsById = mutatedReference;

  test('field should be visible', () => {
    expect(processedFieldsById.shouldBeVisible.visible).toBe(true);
  });
  test('field should be hidden', () => {
    expect(processedFieldsById.shouldBeHidden.visible).toBe(false);
  });
  test('field should be visible (when all rules pass)', () => {
    expect(processedFieldsById.shouldBeVisible_All.visible).toBe(true);
  });
  test('field should be hidden (when one rule fails)', () => {
    expect(processedFieldsById.shouldBeHidden_All.visible).toBe(false);
  });
  test('field should be required', () => {
    expect(processedFieldsById.shouldBeRequired.required).toBe(true);
  });
  test('field should be optional', () => {
    expect(processedFieldsById.shouldBeOptional.required).toBe(false);
  });
  test('field should be required (when all rules pass)', () => {
    expect(processedFieldsById.shouldBeRequired_All.required).toBe(true);
  });
  test('field should be optional (when one rule fails)', () => {
    expect(processedFieldsById.shouldBeOptional_All.required).toBe(false);
  });
  test('field should be disabled', () => {
    expect(processedFieldsById.shouldBeDisabled.disabled).toBe(true);
  });
  test('field should be enabled', () => {
    expect(processedFieldsById.shouldBeEnabled.disabled).toBe(false);
  });
  test('field should be disabled (when all rules pass)', () => {
    expect(processedFieldsById.shouldBeDisabled_All.disabled).toBe(true);
  });
  test('field should be enabled (when one rule fails)', () => {
    expect(processedFieldsById.shouldBeEnabled_All.disabled).toBe(false);
  });

  test('all fields should be disabled when form is disabled', () => {
    const mutatedReference = deepClone(fields);

    processFields(mutatedReference, true, false);
    const processedFieldsById = mutatedReference;

    expect(processedFieldsById.shouldBeVisible.disabled).toBe(true);
    expect(processedFieldsById.shouldBeHidden.disabled).toBe(true);
    expect(processedFieldsById.shouldBeRequired.disabled).toBe(true);
    expect(processedFieldsById.shouldBeOptional.disabled).toBe(true);
  });
});

describe('shouldOmitFieldValue', () => {
  const baseField = {
    id: 'TEST',
    value: 'foo',
    name: 'test',
    type: 'text',
  };

  test('value should be omitted when hidden', () => {
    const field = {
      ...baseField,
      omitWhenHidden: true,
      visible: false,
    };

    expect(shouldOmitFieldValue(field)).toBe(true);
  });
  test('value should be included when visible', () => {
    const field = {
      ...baseField,
      omitWhenHidden: true,
      visible: true,
    };

    expect(shouldOmitFieldValue(field)).toBe(false);
  });
  test('value should be ommitted when value matches', () => {
    const field = {
      ...baseField,
      omitWhenValueIs: ['foo'],
    };

    expect(shouldOmitFieldValue(field)).toBe(true);
  });
  test('value should be included when value does not match', () => {
    const field = {
      ...baseField,
      omitWhenValueIs: ['wrong'],
    };

    expect(shouldOmitFieldValue(field)).toBe(false);
  });
});

describe('calculateFormValue', () => {
  const baseField = {
    id: 'TEST',
    value: 'foo',
    name: 'test',
    type: 'text',
  };
  const field1 = {
    ...baseField,
    id: 'field1',
    omitWhenHidden: true,
    visible: false,
  };
  const field2 = {
    ...baseField,
    id: 'field2',
    name: 'test2',
    value: 'bar',
  };
  const field3 = {
    ...baseField,
    id: 'field3',
    name: 'test3',
    value: 'bob',
  };
  const field4 = {
    ...baseField,
    id: 'field4',
    name: 'test3',
    value: 'ted',
  };
  const field5 = {
    ...baseField,
    id: 'field5',
    name: 'test.dot.notation',
    value: 'ted',
  };
  const fieldToTrim = {
    ...baseField,
    id: 'fieldToTrim',
    name: 'testTrim',
    value: '     trimmed     ',
    trimValue: true,
  };
  const value = calculateFormValue(
    Object.values({ field1, field2, field3, field4 })
  );

  test('two field values should be omitted', () => {
    expect(Object.keys(value)).toHaveLength(2);
  });
  test('hidden field value should not be included', () => {
    expect(value.test).toBeUndefined();
  });
  test('normal value should be included', () => {
    expect(value.test2).toBe('bar');
  });
  test('last field wins', () => {
    expect(value.test3).toBe('ted');
  });

  test('dot-notation names can be provided', () => {
    const value = calculateFormValue([field5]);

    expect(value.test.dot.notation).toBe('ted');
  });

  test('get added and removed values', () => {
    const field1 = {
      ...baseField,
      id: 'field1',
      defaultValue: '1,2,3',
      value: ['2', '4', '5'], // HERE BE DRAGONS - will the new value really always be an array?
      valueDelimiter: ',',
      useChangesAsValues: true,
    };
    const value = calculateFormValue(Object.values({ field1 }));

    expect(value.test_added).toBe('4,5');
    expect(value.test_removed).toBe('1,3');
  });

  // eslint-disable-next-line jest/no-commented-out-tests
  // test("dot-notation values setting", () => {
  //   const field1 = {
  //     name: "some.nested.prop",
  //     ...baseField,
  //     value: "foo"
  //   };
  //   const value = calculateFormValue([field1]);
  //   expect(value.some.nested.prop).toEqual("foo");
  // });

  test('field value can be trimmed', () => {
    const value = calculateFormValue(Object.values({ fieldToTrim }));

    expect(value.testTrim).toBe('trimmed');
  });
});

describe('updateFieldValue', () => {
  const A = {
    id: 'A',
    name: 'a',
    type: 'text',
    value: 'baa',
  };
  const B = {
    id: 'B',
    name: 'b',
    type: 'text',
    value: 'moo',
  };
  const C = {
    id: 'C',
    name: 'c',
    type: 'text',
    value: 'woof',
  };
  const fieldsById = deepClone({ A, B, C });

  updateFieldValue(fieldsById.B, 'oink');

  test('field is updated with new value', () => {
    expect(fieldsById.B.value).toBe('oink');
  });
});

describe('joinDelimitedValue', () => {
  test('join with commas', () => {
    expect(joinDelimitedValue([1, 2, 3], ',')).toBe('1,2,3');
  });

  test('leave non-array values as-id', () => {
    expect(joinDelimitedValue('test', ',')).toBe('test');
  });
});

describe('splitDelimitedValue', () => {
  test('split on commas', () => {
    // NOTE: Always becomes an array of strings
    //       Is this worth parsing?
    expect(splitDelimitedValue('1,2,3', ',')).toEqual(['1', '2', '3']);
  });

  test('create an array from an non-delimited value', () => {
    expect(splitDelimitedValue('test', ',')).toEqual(['test']);
  });

  test('leave value as is if no delimiter provided', () => {
    expect(splitDelimitedValue('test')).toBe('test');
  });

  test('array value remain unchanged', () => {
    expect(splitDelimitedValue(['one', 'two'], ',')).toEqual(['one', 'two']);
  });
});

describe('getMissingItems', () => {
  test('a is missing from [b,c] but is in [a,b,c]', () => {
    expect(getMissingItems(['b', 'c'], ['a', 'b', 'c'])).toEqual(['a']);
  });
});

describe('determineChangedValues', () => {
  const field = {
    id: 'TEST',
    name: 'foo',
    type: 'text',
    value: ['a', 'c', 'e', 'f'],
    defaultValue: ['a', 'b', 'c', 'd'],
  };
  const changes = determineChangedValues(field);

  test('output structure is correct', () => {
    expect(changes).toHaveLength(2);
    expect(changes[0].name).toBe('foo_added');
    expect(changes[1].name).toBe('foo_removed');
  });
  test('e and f were added', () => {
    expect(changes[0].value).toEqual(['e', 'f']);
  });
  test('b and d were removed', () => {
    expect(changes[1].value).toEqual(['b', 'd']);
  });
});

describe('getFirstDefinedValue', () => {
  test('boolean', () => {
    expect(getFirstDefinedValue(undefined, undefined, false, true)).toBe(
      false
    );
  });
  test('number', () => {
    expect(getFirstDefinedValue(undefined, 0, 10)).toBe(0);
  });
});

describe('default value handling', () => {
  const WITH_DEFAULT = {
    id: 'WITH_DEFAULT',
    name: 'test',
    type: 'text',
    defaultValue: 'bob',
  };
  let field;

  beforeEach(() => {
    field = deepClone({ WITH_DEFAULT });
  });
  test('default value is assigned to value', () => {
    processFields(field, false, false);

    expect(field.WITH_DEFAULT.value).toBe('bob');
  });
  test('Value takes precedence over defaultValue', () => {
    field.WITH_DEFAULT.value = 'ted';
    processFields(field, false, false);

    expect(field.WITH_DEFAULT.value).toBe('ted');
  });

  test('Falsy value takes precedence over defaultValue', () => {
    field.WITH_DEFAULT.value = false;
    processFields(field, false, false);

    expect(field.WITH_DEFAULT.value).toBe(false);
  });
});

describe('trimming behaviour', () => {
  const value = '   foo     ';
  const TO_BE_TRIMMED = {
    id: 'TO_BE_TRIMMED',
    name: 'test',
    type: 'text',
    value,
    trimValue: true,
  };

  test('leading and trailing whitespace is NOT removed from when processed', () => {
    const fields = deepClone({ TO_BE_TRIMMED });

    processFields(fields, false, false);
    const trimmedField = fields.TO_BE_TRIMMED;

    expect(trimmedField.value).toEqual(value);
  });
});

describe('setOptionsInFieldInState', () => {
  const field1 = createField({
    id: 'a',
    name: 'a',
    type: 'text',
  });
  const field2 = createField({
    id: 'b',
    name: 'b',
    type: 'text',
  });
  const field3 = createField({
    id: 'c',
    name: 'c',
    type: 'text',
  });
  const fields = [field1, field2, field3];
  const state = {
    fields,
    value: {},
    isValid: true,
    defaultFields: [],
    disabled: false,
    showValidationBeforeTouched: false,
  };
  const options = [
    {
      items: ['one', 'two', 'three'],
    },
  ];
  const updatedState = setOptionsInFieldInState(state, field2, options);

  test('leaves fields in state with the correct length', () => {
    expect(updatedState.fields).toHaveLength(3);
  });

  test('leaves fields in state in the same order', () => {
    expect(updatedState.fields[0].id).toBe('a');
    expect(updatedState.fields[1].id).toBe('b');
    expect(updatedState.fields[2].id).toBe('c');
  });

  test('assigns options to teh correct field', () => {
    expect(updatedState.fields[0].options).toBeUndefined();
    expect(updatedState.fields[1].options).toBe(options);
    expect(updatedState.fields[2].options).toBeUndefined();
  });

  test('assigns pending options as undefined', () => {
    expect(updatedState.fields[1].pendingOptions).toBeUndefined();
  });
});

describe('getTouchedStateForField', () => {
  test('returns false on reset when touched is true', () => {
    expect(getTouchedStateForField(true, true)).toBe(false);
  });
  test('returns false on reset when touched is false', () => {
    expect(getTouchedStateForField(false, true)).toBe(false);
  });
  test('returns false with no reset when touched is false', () => {
    expect(getTouchedStateForField(false, false)).toBe(false);
  });
  test('returns true with no reset when touched is true', () => {
    expect(getTouchedStateForField(true, false)).toBe(true);
  });
});

describe('getFirstErroredFieldId', () => {
  test('should return undefined incase of invalid form state', () => {
    expect(getFirstErroredFieldId()).toBeUndefined();
    expect(getFirstErroredFieldId(null)).toBeUndefined();
    expect(getFirstErroredFieldId({ fieldMeta: {}})).toBeUndefined();
  });
  test('should return undefined if the form has no errored field', () => {
    const field1 = createField({
      id: 'a',
      name: 'a',
      type: 'text',
    });
    const field2 = createField({
      id: 'b',
      name: 'b',
      type: 'text',
    });
    const field3 = createField({
      id: 'c',
      name: 'c',
      type: 'text',
    });
    const state = {
      fields: { a: field1, b: field2, c: field3 },
      fieldMeta: {
        layout: {
          type: 'collapse',
          containers: [
            {
              collapsed: true,
              fields: ['a', 'b', 'c'],
            },
          ],
        }},
      isValid: true,
      showValidationBeforeTouched: false,
    };

    expect(getFirstErroredFieldId(state)).toBeUndefined();
  });
  test('should return the first fieldId in layout order that is errored in the form state', () => {
    const field1 = createField({
      id: 'a',
      name: 'a',
      type: 'text',
    });
    const field2 = createField({
      id: 'b',
      name: 'b',
      type: 'text',
      isValid: false,
    });
    const field3 = createField({
      id: 'c',
      name: 'c',
      type: 'text',
      isValid: false,
    });
    const state = {
      fields: { a: field1, b: field2, c: field3 },
      fieldMeta: {
        layout: {
          type: 'collapse',
          containers: [
            {
              collapsed: true,
              fields: ['a', 'b', 'c'],
            },
          ],
        }},
      isValid: false,
      showValidationBeforeTouched: true,
    };

    expect(getFirstErroredFieldId(state)).toBe('b');
  });
});


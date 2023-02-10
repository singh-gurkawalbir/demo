/* eslint-disable no-unused-vars */
import {
  comparedTo,
  fallsWithinNumericalRange,
  findFieldsToCompareTo,
  getDefaultNumericalRangeErrorMessages,
  hasValue,
  isBigger,
  isNotValue,
  isValue,
  lengthIsGreaterThan,
  lengthIsLessThan,
  matchesRegEx,
  validateField,
  isLonger,
} from '.';
import messageStore from '../../messageStore';
import { createField } from '../test';
import { allAreTrue, noneAreTrue, someAreTrue } from './validator';

const field1 = createField({
  id: 'one',
  name: 'name',
  value: 'value',
});

describe('validateField', () => {
  test('visible, optional field is always valid', () => {
    const testField = {
      ...field1,
      visible: true,
      required: false,
    };

    validateField(testField, [testField], true);
    expect(testField.isValid).toBe(true);
  });

  test('visible, required field with empty string value is valid', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: '',
    };

    validateField(testField, [testField], true);
    expect(testField.isValid).toBe(false);
  });

  test('visible, required field with numberical value 0 is valid', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: 0,
    };

    validateField(testField, [testField], true);
    expect(testField.isValid).toBe(true);
  });

  test('visible, required field with false value is valid', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: false,
    };

    validateField(testField, [testField], true);
    expect(testField.isValid).toBe(true);
  });

  test('visible, required field with string value is valid', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: 'test',
    };

    validateField(testField, [testField], true);
    expect(testField.isValid).toBe(true);
  });

  test('visible, required field with empty array value is invalid', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: [],
    };

    validateField(testField, [testField], true);
    expect(testField.isValid).toBe(false);
  });

  test('visible, required field with populated array value is valid', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: [1],
    };

    validateField(testField, [testField], true);
    expect(testField.isValid).toBe(true);
  });

  test('visible, required field with missing data shows custom message', () => {
    const errorMessage = "Where's my data?";
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: '',
      missingValueMessage: errorMessage,
    };

    validateField(testField, [testField], true);

    expect(testField.isValid).toBe(false);
    expect(testField.errorMessages).toBe(errorMessage);
  });

  test('using validation handler reporting invalid', () => {
    const testField = {
      ...field1,
      visible: true,
    };
    const validationHandler = (field, fields) => 'Fail';

    validateField(testField, [testField], true, validationHandler);
    expect(testField.isValid).toBe(false);
  });

  test('using validation handler reporting valid', () => {
    const testField = {
      ...field1,
      visible: true,
    };
    const validationHandler = (field, fields) => null;

    validateField(testField, [testField], true, validationHandler);
    expect(testField.isValid).toBe(true);
  });

  test('validation of trimmed and required field with whitespace value is false', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: '     ',
      trimValue: true,
    };

    validateField(testField, [testField], true);

    expect(testField.isValid).toBe(false);
  });

  test('validation of untrimmed and required field with whitespace value is true', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: '     ',
    };

    validateField(testField, [testField], true);

    expect(testField.isValid).toBe(true);
  });

  test('field is only discretely invalid if not touched', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: '',
      touched: false,
    };

    validateField(testField, [testField], false);

    expect(testField.isValid).toBe(true);
    expect(testField.isDiscretelyInvalid).toBe(true);
    expect(testField.errorMessages).toBe('');
  });

  test('field is invalid when touched', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: '',
      touched: true,
    };

    validateField(testField, [testField], false);

    expect(testField.isValid).toBe(false);
    expect(testField.isDiscretelyInvalid).toBe(true);
    expect(testField.errorMessages).toBe(messageStore('REQUIRED_MESSAGE'));
  });

  test('field validation rules not processed without value', () => {
    const testField = {
      ...field1,
      visible: true,
      required: false,
      value: '',
      touched: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\d]+$',
          message: 'Length can only be in whole numbers',
        },
      },
    };

    validateField(testField, [testField], true);

    expect(testField.isValid).toBe(true);
    expect(testField.isDiscretelyInvalid).toBe(false);
  });
});

describe('lengthIsGreaterThan validator', () => {
  test('with valid value', () => {
    expect(
      lengthIsGreaterThan({
        value: 'test',
        length: 3,
        message: 'Fail',
      })
    ).toBeUndefined();
  });

  test('with invvalid value', () => {
    expect(
      lengthIsGreaterThan({
        value: 'te',
        length: 3,
        message: 'Fail',
      })
    ).toBe('Fail');
  });
});

describe('lengthIsLessThan validator', () => {
  test('with valid value', () => {
    expect(
      lengthIsLessThan({
        value: 'te',
        length: 3,
        message: 'Fail',
      })
    ).toBeUndefined();
  });

  test('with invvalid value', () => {
    expect(
      lengthIsLessThan({
        value: 'test',
        length: 3,
        message: 'Fail',
      })
    ).toBe('Fail');
  });
});

describe('matchesRegEx validator', () => {
  test('fails when letters provided for numbers only pattern', () => {
    expect(
      matchesRegEx({ value: '12a3', pattern: '^[\\d]+$', message: 'Fail' })
    ).toBe('Fail');
  });

  test('succeeds when numbers provided for numbers only pattern', () => {
    expect(
      matchesRegEx({ value: '1234', pattern: '^[\\d]+$', message: 'Fail' })
    ).toBeUndefined();
  });
});

describe('getDefaultNumericalRangeErrorMessages', () => {
  test('for min and max', () => {
    expect(getDefaultNumericalRangeErrorMessages(1, 5)).toBe(
      'Value cannot be less than 1 or greater than 5'
    );
  });
  test('for just min', () => {
    expect(getDefaultNumericalRangeErrorMessages(1)).toBe(
      'Value cannot be less than 1'
    );
  });
  test('for just max', () => {
    expect(getDefaultNumericalRangeErrorMessages(undefined, 5)).toBe(
      'Value cannot be greater than 5'
    );
  });
});

describe('fallsWithinNumericalRange', () => {
  test('fails when given a non-numerical number', () => {
    expect(
      fallsWithinNumericalRange({ value: 'abc', min: 5, message: 'Fail' })
    ).toBe('Fail');
  });
  test('fails when given a non-numerical string with leading numbers', () => {
    expect(
      fallsWithinNumericalRange({ value: '123abc', min: 5, message: 'Fail' })
    ).toBe('Fail');
  });
  test('succeeds with just a max', () => {
    expect(
      fallsWithinNumericalRange({
        value: '5',
        min: 1,
        message: 'Fail',
      })
    ).toBeUndefined();
  });

  test('fails with just a min', () => {
    expect(
      fallsWithinNumericalRange({
        value: 6,
        max: 10,
        message: 'Fail',
      })
    ).toBeUndefined();
  });

  test('succeeds with null', () => {
    expect(
      fallsWithinNumericalRange({
        value: null,
        min: 0,
        max: 5,
        message: 'Fail',
      })
    ).toBeUndefined();
  });
  test('succeeds with string null', () => {
    expect(
      fallsWithinNumericalRange({
        value: 'null',
        min: 0,
        max: 5,
        message: 'Fail',
      })
    ).toBe('Fail');
  });

  test('succeeds with undefined', () => {
    expect(
      fallsWithinNumericalRange({
        value: undefined,
        min: 0,
        max: 5,
        message: 'Fail',
      })
    ).toBeUndefined();
  });

  test('fails with whitespace', () => {
    expect(
      fallsWithinNumericalRange({
        value: '       ',
        min: 10,
        message: 'Fail',
      })
    ).toBe('Fail');
  });

  test('fails with just a max', () => {
    expect(
      fallsWithinNumericalRange({
        value: 6,
        max: 5,
        message: 'Fail',
      })
    ).toBe('Fail');
  });

  test('succeeds with empty string', () => {
    expect(
      fallsWithinNumericalRange({
        value: '',
        min: 0,
        max: 5,
        message: 'Fail',
      })
    ).toBeUndefined();
  });

  test('succeeds with null duplicate', () => {
    expect(
      fallsWithinNumericalRange({
        value: null,
        min: 0,
        max: 5,
        message: 'Fail',
      })
    ).toBeUndefined();
  });
  test('succeeds with string null duplicate', () => {
    expect(
      fallsWithinNumericalRange({
        value: null,
        min: 0,
        max: 5,
        message: 'Fail',
      })
    ).toBeUndefined();
  });

  test('succeeds with undefined duplicate', () => {
    expect(
      fallsWithinNumericalRange({
        value: undefined,
        min: 0,
        max: 5,
        message: 'Fail',
      })
    ).toBeUndefined();
  });

  test('fails with whitespace duplicate', () => {
    expect(
      fallsWithinNumericalRange({
        value: '',
        min: 0,
        max: 5,
        message: 'Fail',
      })
    ).toBeUndefined();
  });
});

describe('isBigger', () => {
  const fieldOne = createField({
    id: 'ONE',
    name: 'one',
    value: '5',
  });

  test('number strings are parsed to numbers', () => {
    expect(isBigger('6', fieldOne)).toBe(true);
  });

  test('returns false if one field has a non-numeric string value', () => {
    fieldOne.value = 'bob';
    expect(isBigger(2, fieldOne)).toBe(false);
  });

  test('numbers are correctly handled - 6 is bigger than 5', () => {
    fieldOne.value = 5;
    expect(isBigger(6, fieldOne)).toBe(true);
  });

  test('numbers are correctly handled - 2 is not bigger than 5', () => {
    fieldOne.value = 5;
    expect(isBigger(2, fieldOne)).toBe(false);
  });
});

describe('isLonger', () => {
  const field = createField({
    id: 'ONE',
    name: 'one',
    value: 'a value',
  });

  test('null value is never longer', () => {
    expect(isLonger(null, field)).toBe(false);
  });

  test('undefined field values are never shorter', () => {
    field.value = undefined;
    expect(isLonger('bob', field)).toBe(false);
  });

  test('numbers are converted to strings', () => {
    field.value = 'bob';
    expect(isLonger(1234, field)).toBe(true);
  });

  test('string values are compared correctly - 1234 is longer than bob', () => {
    expect(isLonger('1234', field)).toBe(true);
  });

  test('string values are compared correctly - 12 is not longer than bob', () => {
    expect(isLonger('12', field)).toBe(false);
  });
});

describe('comparedTo', () => {
  const bigField = createField({
    id: 'BIGGEST',
    name: 'big',
    value: 500,
  });
  const smallField = createField({
    id: 'SMALLEST',
    name: 'small',
    value: 10,
  });
  const longField = createField({
    id: 'LONGEST',
    name: 'long',
    value: 'Really, really long',
  });
  const shortField = createField({
    id: 'SHORTEST',
    name: 'short',
    value: 'short',
  });
  const allFields = [bigField, smallField, longField, shortField];

  test('finds available fields', () => {
    expect(
      findFieldsToCompareTo(['BIGGEST', 'NOPE', 'SHORTEST', 'NAH'], allFields)
    ).toMatchSnapshot();
  });

  test('150 is not bigger than BIGGEST field', () => {
    expect(
      comparedTo({
        value: 150,
        fields: ['BIGGEST'],
        allFields,
        is: 'BIGGER',
        message: 'Fail',
      })
    ).toBe('Fail');
  });

  test('600 is bigger than BIGGEST field', () => {
    expect(
      comparedTo({
        value: 600,
        fields: ['BIGGEST'],
        allFields,
        is: 'BIGGER',
        message: 'Fail',
      })
    ).toBeUndefined();
  });

  test('150 is not smaller than SMALLEST field', () => {
    expect(
      comparedTo({
        value: 150,
        fields: ['SMALLEST'],
        allFields,
        is: 'SMALLER',
        message: 'Fail',
      })
    ).toBe('Fail');
  });

  test('5 is smaller than SMALLEST field', () => {
    expect(
      comparedTo({
        value: 5,
        fields: ['SMALLEST'],
        allFields,
        is: 'SMALLER',
        message: 'Fail',
      })
    ).toBeUndefined();
  });

  test("'bob' is not longer than LONGEST field", () => {
    expect(
      comparedTo({
        value: 'bob',
        fields: ['LONGEST'],
        allFields,
        is: 'LONGER',
        message: 'Fail',
      })
    ).toBe('Fail');
  });

  test("'sizeable' is longer than SHORTEST field", () => {
    expect(
      comparedTo({
        value: 'sizeable',
        fields: ['SHORTEST'],
        allFields,
        is: 'LONGER',
        message: 'Fail',
      })
    ).toBeUndefined();
  });

  test("'medium' is not shorter than SHORTEST field", () => {
    expect(
      comparedTo({
        value: 'medium',
        fields: ['SHORTEST'],
        allFields,
        is: 'SHORTER',
        message: 'Fail',
      })
    ).toBe('Fail');
  });

  test("'bob' is shorter than SHORTEST field", () => {
    expect(
      comparedTo({
        value: 'bob',
        fields: ['SHORTEST'],
        allFields,
        is: 'SHORTER',
        message: 'Fail',
      })
    ).toBeUndefined();
  });
});

describe('isValue', () => {
  test('matching value does not cause error', () => {
    expect(
      isValue({
        value: 'bob',
        values: ['bob', 'ted', 'geoff'],
        message: 'Fail',
      })
    ).toBeUndefined();
  });

  test('non-matching value causes error', () => {
    expect(
      isValue({
        value: 'sally',
        values: ['bob', 'ted', 'geoff'],
        message: 'Fail',
      })
    ).toBe('Fail');
  });
});

describe('validator', () => {
  const fieldA = createField({
    id: 'fieldA',
    name: 'fieldA',
    value: 'a',
  });
  const fieldB = createField({
    id: 'fieldB',
    name: 'fieldB',
    value: 'b',
  });

  describe('someAreTrue', () => {
    test('when both field conditions are not met return errored message', () => {
      const inValidSomeAreTrueField = {
        message: 'some error',
        conditions: [
          {
            field: 'fieldA',
            is: {
              values: ['someValue'],
            },
          },
          {
            field: 'fieldB',
            is: {
              values: ['someValue'],
            },
          },
        ],
      };

      expect(someAreTrue({allFields: [fieldA, fieldB], ...inValidSomeAreTrueField})).toBe('some error');
    });
    test('when atleast one field condition is met do not return errored message', () => {
      const validSomeAreTrueField = {
        message: 'some error',
        conditions: [
          {
            field: 'fieldA',
            // lets
            is: {
              values: ['a'],
            },
          },
          {
            field: 'fieldB',
            is: {
              values: ['some value'],
            },
          },
        ],
      };

      expect(someAreTrue({allFields: [fieldA, fieldB], ...validSomeAreTrueField})).toBeUndefined();
    });
  });
  describe('noneAreTrue', () => {
    test('when both field conditions are not met return undefined', () => {
      const inValidSomeAreTrueField = {
        message: 'some error',
        conditions: [
          {
            field: 'fieldA',
            is: {
              values: ['someValue'],
            },
          },
          {
            field: 'fieldB',
            is: {
              values: ['someValue'],
            },
          },
        ],
      };

      expect(noneAreTrue({allFields: [fieldA, fieldB], ...inValidSomeAreTrueField})).toBeUndefined();
    });
    test('when atleast one field condition is met return errored message', () => {
      const validSomeAreTrueField = {
        message: 'some error',
        conditions: [
          {
            field: 'fieldA',
            // lets
            is: {
              values: ['a'],
            },
          },
          {
            field: 'fieldB',
            is: {
              values: ['someValue'],
            },
          },
        ],
      };

      expect(noneAreTrue({allFields: [fieldA, fieldB], ...validSomeAreTrueField})).toBe('some error');
    });
  });
  describe('allAreTrue', () => {
    test('when both field conditions are met return undefined', () => {
      const inValidSomeAreTrueField = {
        message: 'some error',
        conditions: [
          {
            field: 'fieldA',
            is: {
              values: ['a'],
            },
          },
          {
            field: 'fieldB',
            is: {
              values: ['b'],
            },
          },
        ],
      };

      expect(allAreTrue({allFields: [fieldA, fieldB], ...inValidSomeAreTrueField})).toBeUndefined();
    });
    test('when atleast one field condition is not met return errored message', () => {
      const validSomeAreTrueField = {
        message: 'some error',
        conditions: [
          {
            field: 'fieldA',
            // lets
            is: {
              values: ['a'],
            },
          },
          {
            field: 'fieldB',
            is: {
              values: ['someValue'],
            },
          },
        ],
      };

      expect(allAreTrue({allFields: [fieldA, fieldB], ...validSomeAreTrueField})).toBe('some error');
    });
  });
});

describe('isNotValue', () => {
  test('matching value causes error', () => {
    expect(
      isNotValue({
        value: 'bob',
        values: ['bob', 'ted', 'geoff'],
        message: 'Fail',
      })
    ).toBe('Fail');
  });

  test('non-matching value returns undefined', () => {
    expect(
      isNotValue({
        value: 'sally',
        values: ['bob', 'ted', 'geoff'],
        message: 'Fail',
      })
    ).toBeUndefined();
  });
});

describe('hasValue', () => {
  test('string', () => {
    expect(hasValue('value')).toBe(true);
  });

  test('array', () => {
    expect(hasValue([1, 2])).toBe(true);
  });

  test('true', () => {
    expect(hasValue(true)).toBe(true);
  });

  test('false', () => {
    expect(hasValue(false)).toBe(true);
  });

  test('empty array', () => {
    expect(hasValue([])).toBe(false);
  });

  test('empty string', () => {
    expect(hasValue('')).toBe(false);
  });

  test('undefined', () => {
    expect(hasValue(undefined)).toBe(false);
  });

  test('null', () => {
    expect(hasValue(null)).toBe(false);
  });
});

/* global describe,test,expect */

import { shouldOptionsBeRefreshed } from './field';
import { registerFields } from '.';

const createField = field => {
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

    expect(Object.values(registeredFields).length).toEqual(2);
    expect(registeredFields.a).toBeTruthy();
    expect(registeredFields.b).toBeTruthy();
  });
});

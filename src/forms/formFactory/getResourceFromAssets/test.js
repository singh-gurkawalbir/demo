/* global describe, test, expect, jest */
import {getAmalgamatedOptionsHandler} from '.';

jest.mock('../../definitions/index', () => ({
  __esModule: true,
  default: {
    someResourceType: {
      subForms: {
        someSubform: {
          fieldMap: {
            someField: {
              fieldId: 'someField',
              someProp: 'foo',
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
            },
            'custom.Field': {
              fieldId: 'custom.Field',
              someProp: 'faa',
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
            },
          },
          layout: {
            fields: ['someField', 'custom.Field'],
          },
        },
        subFormFieldsWithFuncs: {
          fieldMap: {
            someField: {
              fieldId: 'someField',
              someProp: 'foo',
              someFunc: val => val,
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
            },
          },
          layout: {
            fields: ['someField'],
          },
        },
        common: {
          fieldMap: {
            someField: {
              fieldId: 'someField',
              someProp: 'foo',
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
            },
          },
          layout: {
            fields: ['someField'],
          },
        },
        bunchOfFieldsWithoutfieldMap: {
          layout: {
            fields: ['bunchOfFieldsWithoutfieldMap'],
          },
        },
        bunchOfFieldsWithoutLayoutFields: {
          fieldMap: {
            someField: {
              fieldId: 'someField',
              someProp: 'foo',
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
            },
          },
        },
        bunchOffieldsWithOptionsHanlders: {
          optionsHandler: (fieldId, fields) => {
            if (fieldId === 'someField') {
              return fields.find(field => field.id === 'someField').value;
            }
          },
          fieldMap: {
            someField: {
              fieldId: 'someField',
              someProp: 'foo',
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
            },
          },
          layout: {
            fields: ['someField'],
          },
        },
      },
    },
  },
}));

jest.mock('../../fieldDefinitions/index', () => ({
  __esModule: true,
  default: {
    someResourceType: {
      someField: {},
      exportData: {},
      'file.decompressFiles': {},
      'custom.Field': {},
    },
  },
}));

describe('form factory options handler amalgamation getAmalgamatedOptionsHandler', () => {
  test('should club options handlers both in the root metadata as well within the containers', () => {
    const resourceType = 'someResourceType';
    // metadata with a form visibility rule
    const testMeta = {
      optionsHandler: fieldId => {
        if (fieldId === 'anotherFieldId') {
          return 'someValue';
        }
      },
      fieldMap: {
        bunchOffieldsWithOptionsHanlders: {
          formId: 'bunchOffieldsWithOptionsHanlders',
          visibleWhenAll: [{ field: 'someOtherField', is: ['foo'] }],
        },
      },
    };
    const amalgamatedOptionsHandlers = getAmalgamatedOptionsHandler(
      testMeta,
      resourceType
    );

    // checking for the optionsHandler within the meta
    expect(amalgamatedOptionsHandlers('anotherFieldId')).toEqual('someValue');
    expect(
      amalgamatedOptionsHandlers('someField', [
        { id: 'someField', value: 'hi' },
      ])
    ).toEqual('hi');
  });
});
describe('form factory options handler amalgamation getAmalgamatedOptionsHandler', () => {
  test('should club options handlers both in the root metadata as well within the containers', () => {
    const resourceType = 'someResourceType';
    // metadata with a form visibility rule
    const testMeta = {
      optionsHandler: fieldId => {
        if (fieldId === 'anotherFieldId') {
          return 'someValue';
        }
      },
      fieldMap: {
        bunchOffieldsWithOptionsHanlders: {
          formId: 'bunchOffieldsWithOptionsHanlders',
          visibleWhenAll: [{ field: 'someOtherField', is: ['foo'] }],
        },
      },
    };
    const amalgamatedOptionsHandlers = getAmalgamatedOptionsHandler(
      testMeta,
      resourceType
    );

    // checking for the optionsHandler within the meta
    expect(amalgamatedOptionsHandlers('anotherFieldId')).toEqual('someValue');
    expect(
      amalgamatedOptionsHandlers('someField', [
        { id: 'someField', value: 'hi' },
      ])
    ).toEqual('hi');
  });
});

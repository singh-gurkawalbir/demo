/* global describe, test, expect, jest */

import getFieldsWithoutFuncs from '.';

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

describe('getFieldsWithoutFuncs ', () => {
  test('should apply all default fields and exclude any function props', () => {
    const resourceType = 'someResourceType';
    const resource = {};
    const testMeta = {
      fieldMap: {
        common: {
          formId: 'common',
          visibleWhenAll: [{ field: 'someOtherField', is: ['foo'] }],
        },
        exportData: { fieldId: 'exportData', someFuncProp: a => a },
      },
      layout: {
        type: 'tab||col||collapse',
        containers: [
          {
            label: 'optional some label or tab name',
            fields: ['common', 'exportData'],
          },
        ],
      },
    };
    const val = getFieldsWithoutFuncs(
      testMeta,
      resource,
      resourceType
    );
    const expectedfieldMap = {
      exportData: {
        defaultValue: '',
        fieldId: 'exportData',
        helpKey: 'someResourceType.exportData',
        id: 'exportData',
        name: '/exportData',
        resourceId: undefined,
        resourceType: 'someResourceType',
      },
      someField: {
        defaultValue: '',
        fieldId: 'someField',
        helpKey: 'someResourceType.someField',
        id: 'someField',
        name: '/someField',
        resourceId: undefined,
        resourceType: 'someResourceType',
        someProp: 'foo',
        visibleWhenAll: [
          {
            field: 'fieldA',
            is: ['someValue'],
          },
          {
            field: 'someOtherField',
            is: ['foo'],
          },
        ],
      },
    };

    expect(val.fieldMap).toEqual(expectedfieldMap);

    expect(val.extractedInitFunctions.exportData.someFuncProp('xyz')).toEqual(
      'xyz'
    );
  });
  test('should extract all function props and tie it the corresponding field reference', () => {
    const resourceType = 'someResourceType';
    const resource = {};
    const testMeta = {
      fieldMap: {
        common: {
          formId: 'common',
          visibleWhenAll: [{ field: 'someOtherField', is: ['foo'] }],
        },
        exportData: { fieldId: 'exportData', someFuncProp: a => a },
      },
      layout: {
        type: 'tab||col||collapse',
        containers: [
          {
            label: 'optional some label or tab name',
            fields: ['common', 'exportData'],
          },
          // either or containers or fields
        ],
      },
    };
    const val = getFieldsWithoutFuncs(
      testMeta,
      resource,
      resourceType
    );

    // TODO: is there any matcher for type function...that would be better than using anything

    expect(val.extractedInitFunctions).toEqual({
      exportData: {
        someFuncProp: expect.anything(),
      },
    });
    // trying to assert that the function works as expected
    expect(val.extractedInitFunctions.exportData.someFuncProp('xyz')).toEqual(
      'xyz'
    );
  });
});


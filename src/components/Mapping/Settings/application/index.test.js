
import resourceSettings from '.';

describe('getMetaData function Test cases', () => {
  test('should pass the initial render with default values', async () => {
    const response = resourceSettings.getMetaData({
      value: {},
      importResource: {},
    });

    expect(response).toEqual({});
  });

  const adaptorTypes = ['HTTPImport', 'RESTImport', 'NetSuiteDistributedImport', 'SalesforceImport', 'RDBMSImport', 'AS2Import', 'S3Import'];

  adaptorTypes.forEach(element => {
    test(`should pass the initial render with ${element} adaptorType`, async () => {
      const response = resourceSettings.getMetaData({
        value: {
          isNotEditable: true,
        },
        isCategoryMapping: true,
        importResource: {
          adaptorType: element,
          http: {
            type: element === 'RESTImport' ? 'file' : '',
          },
        },
      });

      expect(response).not.toEqual({});
    });
  });
});

describe('should pass the initial render without useAsAnInitializeValue test', () => {
  test('should pass the initial render without useAsAnInitializeValue', async () => {
    const response = resourceSettings.getMetaData({
      value: {
        isNotEditable: true,
        generate: 'generate',
      },
      isCategoryMapping: true,
      importResource: {
        adaptorType: 'NetSuiteDistributedImport',
      },
    });

    expect(response).not.toEqual({});
  });
});

describe('getFormattedValue test cases', () => {
  const actions = ['useEmptyString', 'useNull', 'default', 'dummyValues'];

  actions.forEach(eachAction => {
    test(`should pass the initial render with hardCoded action ${eachAction}`, async () => {
      const response = resourceSettings.getFormattedValue({
        generate: 'generate',
        extract: '{{extract}}',
        lookup: 'lookup',
      }, {
        dataType: 'date', // date
        isKey: 'isKey',
        useFirstRow: 'useFirstRow',
        fieldMappingType: 'hardCoded', // hardCoded, standard, multifield, lookup
        discardIfEmpty: 'discardIfEmpty',
        useAsAnInitializeValue: 'useAsAnInitializeValue',
        immutable: 'immutable',
        hardcodedAction: eachAction, // useEmptyString, useNull, default
        conditionalWhen: 'lookup_empty',
        hardcodedDefault: 'jk',
      });

      expect(response).not.toEqual({});
    });

    test(`should pass the initial render with standard with action ${eachAction}`, async () => {
      const response = resourceSettings.getFormattedValue({
        generate: 'generate',
        extract: '{{extract}}',
        lookup: 'lookup',
      }, {
        dataType: 'date', // date
        isKey: 'isKey',
        useFirstRow: 'useFirstRow',
        fieldMappingType: 'standard', // hardCoded, standard, multifield, lookup
        discardIfEmpty: 'discardIfEmpty',
        useAsAnInitializeValue: 'useAsAnInitializeValue',
        immutable: 'immutable',
        standardAction: eachAction, // useEmptyString, useNull, default
        extractDateFormat: 'MM/DD/YYYY',
        extractDateTimezone: 'G',
        generateDateFormat: 'MM/DD/YYYY',
        generateDateTimezone: 'K',
      });

      expect(response).not.toEqual({});
    });
  });

  test('should pass the initial render with standard with date format', async () => {
    const response = resourceSettings.getFormattedValue({
      generate: 'generate',
      extract: '{{extract}}',
      lookup: 'lookup',
    }, {
      dataType: 'date', // date
      isKey: 'isKey',
      useFirstRow: 'useFirstRow',
      fieldMappingType: 'standard', // hardCoded, standard, multifield, lookup
      discardIfEmpty: 'discardIfEmpty',
      useAsAnInitializeValue: 'useAsAnInitializeValue',
      immutable: 'immutable',
      standardAction: 'useEmptyString', // useEmptyString, useNull, default
    });

    expect(response).not.toEqual({});
  });

  test('should pass the initial render with hardCoded action hardcodedDefault with hardcodedAction', async () => {
    const response = resourceSettings.getFormattedValue({
      generate: 'generate',
      extract: 'extract',
      lookup: 'lookup',
    }, {
      dataType: undefined, // date
      isKey: 'isKey',
      useFirstRow: 'useFirstRow',
      fieldMappingType: 'hardCoded', // hardCoded, standard, multifield, lookup
      discardIfEmpty: 'discardIfEmpty',
      useAsAnInitializeValue: 'useAsAnInitializeValue',
      immutable: 'immutable',
      hardcodedAction: 'default',
      hardcodedDefault: [],
    });

    expect(response).not.toEqual({});
  });

  test('should pass the initial render with hardCoded action hardcodedDefault', async () => {
    const response = resourceSettings.getFormattedValue({
      generate: 'generate',
      extract: 'extract',
      lookup: 'lookup',
    }, {
      fieldMappingType: 'hardCoded', // hardCoded, standard, multifield, lookup
      conditionalWhen: 'dummy_data',
      useAsAnInitializeValue: 'useAsAnInitializeValue',
      hardcodedDefault: [],
    });

    expect(response).not.toEqual({});
  });

  test('should pass the initial render with hardCoded action hardcodedDefault with invalid hardcodedDefault', async () => {
    const response = resourceSettings.getFormattedValue({
      generate: 'generate',
      extract: 'extract',
      lookup: 'lookup',
    }, {
      dataType: 'dataType', // date
      fieldMappingType: 'hardCoded', // hardCoded, standard, multifield, lookup
      discardIfEmpty: 'discardIfEmpty',
      immutable: 'immutable',
      hardcodedDefault: 'jsdnj',
    });

    expect(response).not.toEqual({});
  });

  test('should pass the initial render with hardCoded action hardcodedDefault without hardcodedDefault and hardcodedAction', async () => {
    const response = resourceSettings.getFormattedValue({
      generate: 'generate',
      extract: 'extract',
      lookup: 'lookup',
    }, {
      dataType: 'dataType', // date
      isKey: 'isKey',
      useFirstRow: 'useFirstRow',
      fieldMappingType: 'hardCoded', // hardCoded, standard, multifield, lookup
      discardIfEmpty: 'discardIfEmpty',
      useAsAnInitializeValue: 'useAsAnInitializeValue',
      immutable: 'immutable',
    });

    expect(response).not.toEqual({});
  });

  test('should pass the initial render with multifield', async () => {
    const response = resourceSettings.getFormattedValue({
      generate: 'generate',
      extract: '{{extract}}',
      lookup: 'lookup',
    }, {
      dataType: 'dataType', // date
      isKey: 'isKey',
      useFirstRow: 'useFirstRow',
      fieldMappingType: 'multifield', // hardCoded, standard, multifield, lookup
      discardIfEmpty: 'discardIfEmpty',
      useAsAnInitializeValue: 'useAsAnInitializeValue',
      immutable: 'immutable',
    });

    expect(response).not.toEqual({});
  });

  test('should pass the initial render with static lookup', async () => {
    const response = resourceSettings.getFormattedValue({
      generate: 'generate',
      extract: '{{extract}}',
      lookup: [{
        name: 'name',
      }],
    }, {
      dataType: 'dataType', // date
      _mode: 'static',
      _mapList: [{
        import: 'import',
        export: 'export',
      }, {
        export: 'export_1',
      }],
      name: 'name',
      fieldMappingType: 'lookup', // hardCoded, standard, multifield, lookup
      discardIfEmpty: 'discardIfEmpty',
      useAsAnInitializeValue: 'useAsAnInitializeValue',
    });

    expect(response).not.toEqual({});
  });

  test('should pass the initial render with static lookup without _mapList', async () => {
    const response = resourceSettings.getFormattedValue({
      generate: 'generate',
      extract: '{{extract}}',
      lookup: [{
        name: 'name',
      }],
    }, {
      dataType: 'dataType', // date
      _mode: 'static',
      name: 'name',
      useFirstRow: 'useFirstRow',
      fieldMappingType: 'lookup', // hardCoded, standard, multifield, lookup
      discardIfEmpty: 'discardIfEmpty',
      useAsAnInitializeValue: 'useAsAnInitializeValue',
    });

    expect(response).not.toEqual({});
  });

  test('should pass the initial render with static lookup error usecase', async () => {
    const response = resourceSettings.getFormattedValue({
      generate: 'generate',
      extract: '{{extract}}',
      lookup: [{
        name: 'name',
      }],
    }, {
      dataType: 'dataType', // date
      _mode: 'static',
      _mapList: [{}],
      name: 'name',
      fieldMappingType: 'lookup', // hardCoded, standard, multifield, lookup
      discardIfEmpty: 'discardIfEmpty',
      useAsAnInitializeValue: 'useAsAnInitializeValue',
    });

    expect(response).toEqual({
      errorMessage: 'You need to map at least one value.',
    });
  });

  const lookupActions = ['disallowFailure', 'useEmptyString', 'useNull', 'useDefaultOnMultipleMatches', 'default'];

  lookupActions.forEach(eachAction => {
    test(`should pass the initial render with dynamic lookup action ${eachAction}`, async () => {
      const response = resourceSettings.getFormattedValue({
        generate: 'generate',
        extract: '{{extract}}',
        lookup: [{
          name: 'name',
        }],
      }, {
        dataType: 'dataType', // date
        _mode: 'dynamic',
        fieldMappingType: 'lookup', // hardCoded, standard, multifield, lookup
        discardIfEmpty: 'discardIfEmpty',
        useAsAnInitializeValue: 'useAsAnInitializeValue',
        immutable: 'immutable',
        lookupAction: eachAction,
      });

      expect(response).not.toEqual({});
    });
  });
});

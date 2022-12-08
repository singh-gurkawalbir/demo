/* global describe, test, expect */
import ftpMappingSettings from './ftp';
import httpMappingSettings from './http';
import application from '.';

function getParams(importResource) {
  return {
    node: {},
    flowId: 'someflowId',
    lookups: [],
    importResource,
  };
}

function formattedSettings(formVal) {
  const {settings} = application.getFormattedValue({}, formVal, {});

  return settings;
}

describe('Mapper2 setting form metadata test case', () => {
  test('should verify the metadata for various adaptor type', () => {
    let metadata;
    const restImportWithTypeFile = getParams({adaptorType: 'RESTImport', http: {type: 'file'}});

    metadata = application.getMetaData(restImportWithTypeFile);

    expect(JSON.stringify(metadata)).toEqual(JSON.stringify(ftpMappingSettings.getMetaData(restImportWithTypeFile)));

    const restImportWithOutTypeFile = getParams({adaptorType: 'RESTImport'});

    metadata = application.getMetaData(restImportWithOutTypeFile);
    expect(JSON.stringify(metadata)).toEqual(JSON.stringify(httpMappingSettings.getMetaData(restImportWithTypeFile)));

    const httpImportWithOutTypeFile = getParams({adaptorType: 'HTTPImport'});

    metadata = application.getMetaData(restImportWithOutTypeFile);
    expect(JSON.stringify(metadata)).toEqual(JSON.stringify(httpMappingSettings.getMetaData(httpImportWithOutTypeFile)));

    const httpImportWithTypeFile = getParams({adaptorType: 'HTTPImport', http: {type: 'file'}});

    metadata = application.getMetaData(httpImportWithTypeFile);
    expect(JSON.stringify(metadata)).toEqual(JSON.stringify(ftpMappingSettings.getMetaData(httpImportWithTypeFile)));
    const as2Import = getParams({adaptorType: 'AS2Import'});

    metadata = application.getMetaData(as2Import);
    expect(JSON.stringify(metadata)).toEqual(JSON.stringify(ftpMappingSettings.getMetaData(as2Import)));
    const s3Import = getParams({adaptorType: 'AS2Import'});

    metadata = application.getMetaData(s3Import);
    expect(JSON.stringify(metadata)).toEqual(JSON.stringify(ftpMappingSettings.getMetaData(s3Import)));
    const ftpImport = getParams({adaptorType: 'AS2Import'});

    metadata = application.getMetaData(ftpImport);
    expect(JSON.stringify(metadata)).toEqual(JSON.stringify(ftpMappingSettings.getMetaData(ftpImport)));
  });
  test('should show default value for fieldMappingType standard', () => {
    const emptyStringAction = formattedSettings({fieldMappingType: 'standard', standardAction: 'useEmptyString'});

    expect(emptyStringAction.default).toBe('');
    const nullAction = formattedSettings({fieldMappingType: 'standard', standardAction: 'useNull'});

    expect(nullAction.default).toBe(null);
    const defaultAction = formattedSettings({fieldMappingType: 'standard', standardAction: 'default', default: 'someDefaultValue'});

    expect(defaultAction.default).toBe('someDefaultValue');
    const defaultActionWithDataTypeBool = formattedSettings({fieldMappingType: 'standard', dataType: 'boolean', standardAction: 'default', boolDefault: 'someBoolDefaultValue'});

    expect(defaultActionWithDataTypeBool.default).toBe('someBoolDefaultValue');
    const discardIfEmptyAction = formattedSettings({fieldMappingType: 'standard', standardAction: 'discardIfEmpty'});

    expect(discardIfEmptyAction.conditional.when).toBe('extract_not_empty');
  });
  test('should show default value for fieldMappingType hardcoded', () => {
    const emptyStringAction = formattedSettings({fieldMappingType: 'hardCoded', hardcodedAction: 'useEmptyString'});

    expect(emptyStringAction.hardCodedValue).toBe('');
    const nullAction = formattedSettings({fieldMappingType: 'hardCoded', hardcodedAction: 'useNull'});

    expect(nullAction.hardCodedValue).toBe(null);
    const defaultAction = formattedSettings({fieldMappingType: 'hardCoded', hardcodedAction: 'default', hardcodedDefault: 'someHardcodeDefaultValue'});

    expect(defaultAction.hardCodedValue).toBe('someHardcodeDefaultValue');
    const defaultArrayAction = formattedSettings({fieldMappingType: 'hardCoded', hardcodedAction: 'default', hardcodedDefault: ['value1', 'value2']});

    expect(defaultArrayAction.hardCodedValue).toBe('value1,value2');
    const defaultActionWithDataTypeBool = formattedSettings({fieldMappingType: 'hardCoded', dataType: 'boolean', hardcodedAction: 'default', boolHardcodedDefault: 'someBoolDefaultValue'});

    expect(defaultActionWithDataTypeBool.hardCodedValue).toBe('someBoolDefaultValue');
    const discardIfEmptyAction = formattedSettings({fieldMappingType: 'hardCoded', hardcodedAction: 'discardIfEmpty'});

    expect(discardIfEmptyAction.conditional.when).toBe('extract_not_empty');
  });
  test('should show default value for fieldMappingType multifield', () => {
    const emptyStringAction = formattedSettings({fieldMappingType: 'multifield', multifieldAction: 'useEmptyString'});

    expect(emptyStringAction.default).toBe('');
    const nullAction = formattedSettings({fieldMappingType: 'multifield', multifieldAction: 'useNull'});

    expect(nullAction.default).toBe(null);
    const defaultAction = formattedSettings({fieldMappingType: 'multifield', multifieldAction: 'default', multifieldDefault: 'someDefaultValue'});

    expect(defaultAction.default).toBe('someDefaultValue');
    const defaultActionWithDataTypeBool = formattedSettings({fieldMappingType: 'multifield', dataType: 'boolean', multifieldAction: 'default', boolMultifieldDefault: 'someBoolDefaultValue'});

    expect(defaultActionWithDataTypeBool.default).toBe('someBoolDefaultValue');
    const discardIfEmptyAction = formattedSettings({fieldMappingType: 'multifield', multifieldAction: 'discardIfEmpty'});

    expect(discardIfEmptyAction.conditional.when).toBe('extract_not_empty');
  });
  test('should return the value for various actions when copy source is yes', () => {
    const useNullAction = formattedSettings({objectAction: 'useNull', copySource: 'yes'});

    expect(useNullAction.default).toBe(null);
    const discardIfEmpty = formattedSettings({objectAction: 'discardIfEmpty', copySource: 'yes'});

    expect(discardIfEmpty.conditional.when).toBe('extract_not_empty');
  });
  test('should check the formatted params for  dynamic look up', () => {
    const epmtyString = application.getFormattedValue(
      {},
      {name: 'lookupName', _mode: 'dynamic', _relativeURI: 'URI', _extract: 'extract', _body: 'body content', lookupAction: 'useEmptyString', fieldMappingType: 'lookup', conditionalWhen: 'somecondition'},
      {});

    expect(epmtyString.settings.lookupName).toEqual('lookupName');
    expect(epmtyString.settings.conditional.when).toEqual('somecondition');
    expect(epmtyString.updatedLookup.allowFailures).toBe(true);
    expect(epmtyString.updatedLookup.default).toBe('');
    const useNull = application.getFormattedValue(
      {},
      {name: 'lookupName', _mode: 'dynamic', _relativeURI: 'URI', _extract: 'extract', _body: 'body content', lookupAction: 'useNull', fieldMappingType: 'lookup', conditionalWhen: 'somecondition'},
      {});

    expect(useNull.updatedLookup.default).toBe(null);
    const defaultAction = application.getFormattedValue(
      {},
      {lookupDefault: 'defaultValue', name: 'lookupName', _mode: 'dynamic', _relativeURI: 'URI', _body: 'body content', lookupAction: 'default', fieldMappingType: 'lookup', conditionalWhen: 'somecondition'},
      {});

    expect(defaultAction.updatedLookup.default).toBe('defaultValue');
    const discardIfEmpty = application.getFormattedValue(
      {},
      {name: 'lookupName', _mode: 'dynamic', _relativeURI: 'URI', _extract: 'extract', _body: 'body content', lookupAction: 'discardIfEmpty', fieldMappingType: 'lookup'},
      {});

    expect(discardIfEmpty.settings.conditional.when).toBe('extract_not_empty');
    const disallowFailure = application.getFormattedValue(
      {},
      {name: 'lookupName', _mode: 'dynamic', _relativeURI: 'URI', _extract: 'extract', _body: 'body content', lookupAction: 'disallowFailure', fieldMappingType: 'lookup'},
      {});

    expect(disallowFailure.updatedLookup.allowFailures).toBe(false);
  });
  test('should check the formatted params for static look up', () => {
    const noMapping = application.getFormattedValue(
      {},
      {name: 'lookupName', _mode: 'static', _mapList: [], fieldMappingType: 'lookup'},
      {});

    expect(noMapping.errorMessage).toBe('You need to map at least one value.');
    const duplicateMap = application.getFormattedValue(
      {},
      {name: 'lookupName', _mode: 'static', _mapList: [{import: 'v1', export: 'v'}, {import: 'v2', export: 'v'}], fieldMappingType: 'lookup'},
      {});

    expect(duplicateMap.errorMessage).toBe('You cannot have duplicate source field values: v');
    const lookupMap = application.getFormattedValue(
      {},
      {name: 'lookupName', _mode: 'static', _mapList: [{import: 'v1', export: 'v3'}, {import: 'v2', export: 'v4'}], fieldMappingType: 'lookup'},
      {});

    expect(lookupMap.updatedLookup.map).toEqual({ v3: 'v1', v4: 'v2' });
  });
});

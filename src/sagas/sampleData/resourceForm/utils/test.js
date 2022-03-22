/* global describe, test */

import { select, call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { selectors } from '../../../../reducers';
import { getResource } from '../../../resources';
import {
  _fetchResourceInfoFromFormKey,
  extractFileSampleDataProps,
  executeTransformationRules,
  executeJavascriptHook,
  _hasSampleDataOnResource,
} from '.';
import { evaluateExternalProcessor } from '../../../editor';
import {
  constructResourceFromFormValues,
  constructSuiteScriptResourceFromFormValues,
} from '../../../utils';

const formKey = 'form-123';
const formState = { value: {} };
const parentContext = {
  resourceId: '123',
  resourceType: 'exports',
  flowId: 'flow-123',
};

describe('resource form sample data util saga test cases', () => {
  describe('_fetchResourceInfoFromFormKey saga', () => {
    test('should return object with empty resource incase of invalid formKey', () => expectSaga(_fetchResourceInfoFromFormKey, {})
      .returns({ formState: null, resourceObj: {} })
      .run());
    test('should return a merged object consisting of parent form info and also resource object', () => {
      const resource = {
        _id: '123',
        adaptorType: 'RESTExport',
      };
      const output = {
        resourceObj: resource,
        formState,
        resourceId: '123',
        resourceType: 'exports',
        flowId: 'flow-123',
      };

      return expectSaga(_fetchResourceInfoFromFormKey, { formKey })
        .provide([
          [select(selectors.formState, formKey), formState],
          [select(selectors.formParentContext, formKey), parentContext],
          [call(constructResourceFromFormValues, {
            formValues: {},
            resourceId: '123',
            resourceType: 'exports',
          }), resource],
        ])
        .returns(output)
        .run();
    });
    test('should return suitescript resource info incase of parent context with ssLinkedConnectionId ', () => {
      const ssResource = {
        _id: '123',
        adaptorType: 'NetsuiteExport',
      };
      const ssParentContext = {
        ...parentContext,
        ssLinkedConnectionId: 'con-123',
        integrationId: 'i-1',
      };
      const output = {
        resourceObj: ssResource,
        formState,
        resourceId: '123',
        resourceType: 'exports',
        flowId: 'flow-123',
        ssLinkedConnectionId: 'con-123',
        integrationId: 'i-1',
      };

      return expectSaga(_fetchResourceInfoFromFormKey, { formKey })
        .provide([
          [select(selectors.formState, formKey), formState],
          [select(selectors.formParentContext, formKey), ssParentContext],
          [call(constructSuiteScriptResourceFromFormValues, {
            formValues: {},
            resourceId: '123',
            resourceType: 'exports',
            ssLinkedConnectionId: 'con-123',
            integrationId: 'i-1',
          }), {export: ssResource}],
        ])
        .returns(output)
        .run();
    });
  });
  describe('_hasSampleDataOnResource saga', () => {
    test('should return false if the resource does not have sampleData', () => expectSaga(_hasSampleDataOnResource, { formKey })
      .provide([
        [call(_fetchResourceInfoFromFormKey, { formKey }), {}],
      ])
      .returns(false)
      .run());
    test('should return false if the file type of the resource\'s sample data does not match with file type of the current unsaved resource file type', () => {
      const resource = {
        file: {
          type: 'json',
        },
        sampleData: { test: 5 },
      };
      const formInfo = {
        resourceObj: {
          file: {
            type: 'csv',
          },
          sampleData: "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE↵C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0",
        },
        resourceId: 'id-123',
        resourceType: 'exports',
      };

      return expectSaga(_hasSampleDataOnResource, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), formInfo],
          [select(selectors.resource, 'exports', 'id-123'), resource],
        ])
        .returns(false)
        .run();
    });
    test('should return true if the resource has sample data and the file type matches the unsaved one', () => {
      const resource = {
        file: {
          type: 'csv',
        },
        sampleData: "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE↵C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0",
      };
      const formInfo = {
        resourceObj: {
          file: {
            type: 'csv',
          },
          sampleData: "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE↵C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0",
        },
        resourceId: 'id-123',
        resourceType: 'exports',
      };

      return expectSaga(_hasSampleDataOnResource, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), formInfo],
          [select(selectors.resource, 'exports', 'id-123'), resource],
        ])
        .returns(true)
        .run();
    });
    test('should return true if the file definition types are a match for the resource\'s file type which has sample data', () => {
      const resource = {
        file: {
          type: 'filedefinition',
        },
        sampleData: { test: 5 },
      };
      const formInfo = {
        resourceObj: {
          file: {
            type: 'delimited/edifact',
          },
          sampleData: { test: 5 },
        },
        resourceId: 'id-123',
        resourceType: 'exports',
      };

      return expectSaga(_hasSampleDataOnResource, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), formInfo],
          [select(selectors.resource, 'exports', 'id-123'), resource],
        ])
        .returns(true)
        .run();
    });
  });

  describe('extractFileSampleDataProps saga', () => {
    test('should return expected sample data props for all file types other than file defs by fetching necessary info from state', () => {
      const formInfo = {
        resourceObj: {
          file: {
            type: 'csv',
          },
        },
        resourceId: 'id-123',
        resourceType: 'exports',
      };
      const uploadedFileObj = {
        file: "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE↵C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0",
      };
      const output = {
        sampleData: uploadedFileObj.file,
        isNewSampleData: true,
        parserOptions: {
          rowsToSkip: undefined,
          trimSpaces: undefined,
          columnDelimiter: undefined,
          hasHeaderRow: undefined,
          rowDelimiter: undefined,
          sortByFields: [],
          groupByFields: [],
        },
      };

      return expectSaga(extractFileSampleDataProps, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), formInfo],
          [select(selectors.getUploadedFile, 'id-123-uploadFile'), uploadedFileObj],
        ])
        .returns(output)
        .run();
    });
    test('should handle file type csv incase of suitescript as ss resource does not have file type', () => {
      const formInfo = {
        resourceObj: {
          type: 'ftp',
          file: {},
        },
        ssLinkedConnectionId: 'conn-123',
        resourceId: 'id-123',
        resourceType: 'exports',
      };
      const uploadedFileObj = {
        file: "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE↵C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0",
      };
      const output = {
        sampleData: uploadedFileObj.file,
        isNewSampleData: true,
        parserOptions: {
          rowsToSkip: undefined,
          trimSpaces: undefined,
          columnDelimiter: undefined,
          hasHeaderRow: undefined,
          rowDelimiter: undefined,
          sortByFields: [],
          groupByFields: [],
        },
      };

      return expectSaga(extractFileSampleDataProps, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), formInfo],
          [select(selectors.getUploadedFile, 'id-123-uploadFile'), uploadedFileObj],
        ])
        .returns(output)
        .run();
    });

    test('should return file definitions related data using file definition selectors ', () => {
      const formInfo = {
        resourceObj: {
          file: {
            type: 'filedefinition',
          },
        },
        resourceId: 'id-123',
        resourceType: 'exports',
      };
      const rule = {
        name: '84 Lumber 810',
        description: 'Invoice',
        sampleData: 'ISA*02*SW810 *00* *01*84EXAMPLE *12',
        rules: [{
          maxOccurrence: 1,
          skipRowSuffix: true,
        }],
      };
      const output = {
        sampleData: rule.sampleData,
        parserOptions: rule,
        fileProps: {
          rule: undefined,
          sortByFields: [],
          groupByFields: [],
        },
      };
      const options = {
        format: 'edix12',
        definitionId: '123',
      };

      return expectSaga(extractFileSampleDataProps, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), formInfo],
          [select(selectors.fieldState, formKey, 'file.filedefinition.rules'), { value: rule, options }],
          [select(selectors.fileDefinitionSampleData, {
            userDefinitionId: undefined,
            resourceType: 'exports',
            options: { ...options, resourcePath: undefined },
          }), { sampleData: rule.sampleData }],
        ])
        .returns(output)
        .run();
    });
    test('should return isNewSampleData  false if the resource has sample data and no new data has been uploaded by the user', () => {
      const formInfo = {
        resourceObj: {
          file: {
            type: 'csv',
          },
          sampleData: "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE↵C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0",
        },
        resourceId: 'id-123',
        resourceType: 'exports',
      };
      const output = {
        sampleData: formInfo.resourceObj.sampleData,
        fileProps: {},
        parserOptions: {
          rowsToSkip: undefined,
          trimSpaces: undefined,
          columnDelimiter: undefined,
          hasHeaderRow: undefined,
          rowDelimiter: undefined,
          sortByFields: [],
          groupByFields: [],
        },
      };

      return expectSaga(extractFileSampleDataProps, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), formInfo],
          [call(_hasSampleDataOnResource, { formKey }), true],
        ])
        .returns(output)
        .run();
    });
    test('should return empty object if no case is fulfilled and there is no sample data to show', () => {
      const formInfo = {
        resourceObj: {
          file: {
            type: 'csv',
          },
        },
        resourceId: 'id-123',
        resourceType: 'exports',
      };

      return expectSaga(extractFileSampleDataProps, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), formInfo],
        ])
        .returns({})
        .run();
    });
  });
  describe('executeTransformationRules saga', () => {
    test('should return no rules prop if there are no rules configured', () => {
      const test1 = expectSaga(executeTransformationRules, {})
        .returns({ hasNoRulesToProcess: true})
        .run();
      const test2 = expectSaga(executeTransformationRules, { transform: { type: 'expression', expression: {}}})
        .returns({ hasNoRulesToProcess: true})
        .run();
      const test3 = expectSaga(executeTransformationRules, { transform: { type: 'script', script: {}}})
        .returns({ hasNoRulesToProcess: true})
        .run();

      return test1 && test2 && test3;
    });
    test('should make transform processor call and return output of transformation for type expression', () => {
      const transform = {
        type: 'expression',
        expression: {
          rules: [[{ extract: 'active', generate: 'Active'}]],
          version: '1',
        },
      };
      const sampleData = { active: 'yes' };
      const output = { Active: 'yes'};

      expectSaga(executeTransformationRules, { transform, sampleData })
        .provide([
          [matchers.call.fn(evaluateExternalProcessor), { data: [output]}],
        ])
        .returns({ data: output })
        .run();
    });
    test('should make javascript processor call and return the output of the same for type script', () => {
      const transform = {
        type: 'script',
        script: {
          _scriptId: 'script-123',
          function: 'transform',
        },
      };
      const sampleData = { active: 'yes' };
      const output = { Active: 'yes'};

      expectSaga(executeTransformationRules, { transform, sampleData })
        .provide([
          [matchers.call.fn(evaluateExternalProcessor), { data: output}],
        ])
        .returns({ data: output })
        .run();
    });

    test('should return just empty object incase of an error in the processor', () => {
      const transform = {
        type: 'expression',
        expression: {
          rules: [[{ extract: 'active', generate: 'Active'}]],
          version: '1',
        },
      };
      const sampleData = { active: 'yes' };
      const error = { error: 'processor error' };

      expectSaga(executeTransformationRules, { transform, sampleData })
        .provide([
          [matchers.call.fn(evaluateExternalProcessor), { error }],
        ])
        .returns({})
        .run();
    });
  });
  describe('executeJavascriptHook saga', () => {
    test('should return no rules prop if there is no hook configured', () => {
      const test1 = expectSaga(executeJavascriptHook, {})
        .returns({ hasNoRulesToProcess: true})
        .run();
      const test2 = expectSaga(executeJavascriptHook, { hook: {}})
        .returns({ hasNoRulesToProcess: true})
        .run();

      return test1 && test2;
    });
    test('should make processor call and return output of hook', () => {
      const hook = {
        _scriptId: 'id-123',
        function: 'preSavePage',
      };
      const script = { _id: 'id-234', function: '', content: '' };
      const sampleData = { active: 'yes' };
      const output = { active: 'yes', newProp: '' };

      return expectSaga(executeJavascriptHook, { hook, sampleData })
        .provide([
          [call(getResource, {
            resourceType: 'scripts',
            id: hook._scriptId,
          }), script],
          [matchers.call.fn(evaluateExternalProcessor), { data: { data: [output] } }],
        ])
        .returns({ data: output })
        .run();
    });
    test('should return just empty object incase of an error in the processor', () => {
      const hook = {
        _scriptId: 'id-123',
        function: 'preSavePage',
      };
      const script = { _id: 'id-234', function: '', content: '' };
      const sampleData = { active: 'yes' };
      const error = { error: 'processor error' };

      return expectSaga(executeJavascriptHook, { hook, sampleData })
        .provide([
          [call(getResource, {
            resourceType: 'scripts',
            id: hook._scriptId,
          }), script],
          [matchers.call.fn(evaluateExternalProcessor), { error }],
        ])
        .returns({})
        .run();
    });
  });
});

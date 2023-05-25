/* eslint-disable jest/no-conditional-in-test */
/* eslint-disable jest/valid-expect-in-promise */

import { advanceTo, clear } from 'jest-date-mock';
import { select, call, put } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { selectors } from '../../reducers';
import { constructResourceFromFormValues } from '../utils';
import { getResource, commitStagedChanges } from '../resources';
import {
  extractResourcePath,
  invokeProcessor,
  requestPreview,
  evaluateExternalProcessor,
  save,
  autoEvaluateProcessor,
  autoEvaluateProcessorWithCancel,
  refreshHelperFunctions,
  requestEditorSampleData,
  initSampleData,
  initEditor,
  toggleEditorVersion,
  getFlowSampleData,
} from '.';
import { requestResourceFormSampleData } from '../sampleData/resourceForm';
import { requestSampleData } from '../sampleData/flows';
import { apiCallWithRetry } from '../index';
import { APIException } from '../api/requestInterceptors/utils';
import processorLogic from '../../reducers/session/editors/processorLogic';
import errorMessageStore from '../../utils/errorStore';

const editorId = 'httpbody';

describe('editor sagas', () => {
  describe('invokeProcessor saga', () => {
    test('should add options in the body and make api call if processor is handlebars', () => {
      const body = {rule: '{{abc}}'};
      const editorState = {
        formKey: 'new-123',
        fieldId: 'http.body',
        resourceId: 'res-123',
        resourceType: 'exports',
      };
      const resource = {
        _id: 'res-123',
        adaptorType: 'FTPExport',
        _connectionId: 'conn-123',
      };
      const connection = {
        _id: 'conn-123',
        type: 'ftp',
      };
      const expectedBody = {
        rule: '{{abc}}',
        options: {
          connection,
          export: resource,
          fieldPath: 'http.body',
          timezone: 'Asia/Calcutta',
        },
      };

      expectSaga(invokeProcessor, { editorId, processor: 'handlebars', body })
        .provide([
          [matchers.call.fn(apiCallWithRetry), undefined],
          [select(selectors.userTimezone), 'Asia/Calcutta'],
          [select(selectors.editor, editorId), editorState],
          [matchers.call.fn(constructResourceFromFormValues), resource],
          [select(selectors.resource, 'connections', 'conn-123'), connection],
        ])
        .call.fn(apiCallWithRetry, {
          path: '/processors/handlebars',
          opts: {
            method: 'POST',
            body: expectedBody,
          },
          hidden: true })
        .run();
    });
    test('should add modelMetadata in the options if processor is handlebars and supports default data for sql editors', () => {
      const body = {rule: '{{abc}}',
        data: {
          data: {
            id: 123,
          },
        }};
      const editorState = {
        formKey: 'new-123',
        fieldId: 'rdbms.query',
        resourceId: 'res-123',
        resourceType: 'imports',
        supportsDefaultData: true,
        defaultData: JSON.stringify({
          id: {
            default: '',
          },
          name: {
            default: 'default name',
          },
        }, null, 2),
      };
      const resource = {
        _id: 'res-123',
        adaptorType: 'RDBMSImport',
        _connectionId: 'conn-123',
      };
      const connection = {
        _id: 'conn-123',
        type: 'rdbms',
      };
      const expectedBody = {
        rule: '{{abc}}',
        data: {
          data: {
            id: 123,
          },
        },
        options: {
          connection,
          import: resource,
          fieldPath: 'rdbms.query',
          modelMetadata: {
            id: {
              default: '',
            },
            name: {
              default: 'default name',
            },
          },
          timezone: null,
        },
      };

      expectSaga(invokeProcessor, { editorId, processor: 'handlebars', body })
        .provide([
          [matchers.call.fn(apiCallWithRetry), undefined],
          [select(selectors.userTimezone), null],
          [select(selectors.editor, editorId), editorState],
          [matchers.call.fn(constructResourceFromFormValues), resource],
          [select(selectors.resource, 'connections', 'conn-123'), connection],
        ])
        .call(apiCallWithRetry, {
          path: '/processors/handlebars',
          opts: {
            method: 'POST',
            body: expectedBody,
          },
          hidden: true })
        .run();
    });
    test('should set correct request body and make api call if processor is mapperProcessor for mappings editor type', () => {
      const editorState = {
        resourceId: 'res-123',
        flowId: 'flow-123',
        resourceType: 'imports',
        data: '[{"id": "123"}]',
        editorType: 'mappings',
      };
      const importRes = {
        _id: 'res-123',
        adaptorType: 'FTPImport',
        _connectionId: 'conn-123',
        file: {type: 'csv'},
      };
      const exportRes = {
        _id: 'exp-123',
        adaptorType: 'NetSuiteExport',
        _connectionId: 'conn-456',
        netsuite: {type: 'search'},
      };
      const mappings = [{
        extract: 'id',
        generate: 'id',
        key: '17RxsaFmJW',
      }];

      const expectedBody = {
        rules: {
          rules: [{
            fields: [],
            lists: [
              {generate: '',
                fields: [
                  {
                    extract: '*.id',
                    generate: 'id',
                    key: '17RxsaFmJW',
                  },
                ],
              },
            ],
            lookups: [],
          }],
        },
        data: [[{id: '123'}]],
        options: {},
      };

      expectSaga(invokeProcessor, { editorId, processor: 'mapperProcessor' })
        .provide([
          [matchers.call.fn(apiCallWithRetry), undefined],
          [select(selectors.mapping), {mappings, lookups: []}],
          [select(selectors.editor, editorId), editorState],
          [select(selectors.resource, 'imports', 'res-123'), importRes],
          [select(selectors.firstFlowPageGenerator, 'flow-123'), exportRes],
        ])
        .call(apiCallWithRetry, {
          path: '/processors/mapperProcessor',
          opts: {
            method: 'POST',
            body: expectedBody,
          },
          hidden: true })
        .run();
    });
    test('should take mapping preview received action if preview data is requested and return the mappings preview state for ns or sf mappings', () => {
      const editorState = {
        resourceId: 'res-123',
        flowId: 'flow-123',
        resourceType: 'imports',
        data: '[{"id": "123"}]',
        editorType: 'mappings',
        mappingPreviewType: 'salesforce',
      };
      const importRes = {
        _id: 'res-123',
        adaptorType: 'FTPImport',
        _connectionId: 'conn-123',
        file: {type: 'csv'},
      };
      const exportRes = {
        _id: 'exp-123',
        adaptorType: 'NetSuiteExport',
        _connectionId: 'conn-456',
        netsuite: {type: 'search'},
      };
      const mappings = [{
        extract: 'id',
        generate: 'id',
        key: '17RxsaFmJW',
      }];

      expectSaga(invokeProcessor, { editorId, processor: 'mapperProcessor' })
        .provide([
          [matchers.call.fn(apiCallWithRetry), undefined],
          [select(selectors.mapping), {mappings, lookups: [], preview: {data: 'some data', status: 'requested'}}],
          [select(selectors.editor, editorId), editorState],
          [select(selectors.resource, 'imports', 'res-123'), importRes],
          [select(selectors.firstFlowPageGenerator, 'flow-123'), exportRes],
          [matchers.take([
            actionTypes.MAPPING.PREVIEW_RECEIVED,
            actionTypes.MAPPING.PREVIEW_FAILED,
          ]), actionTypes.MAPPING.PREVIEW_RECEIVED],
        ])
        .returns({data: 'some data', status: 'requested'})
        .run();
    });
    test('should return the mappings preview state for ns or sf mappings if preview mappings call is successful/failed', () => {
      const editorState = {
        resourceId: 'res-123',
        flowId: 'flow-123',
        resourceType: 'imports',
        data: '[{"id": "123"}]',
        editorType: 'mappings',
        mappingPreviewType: 'salesforce',
      };
      const importRes = {
        _id: 'res-123',
        adaptorType: 'FTPImport',
        _connectionId: 'conn-123',
        file: {type: 'csv'},
      };
      const exportRes = {
        _id: 'exp-123',
        adaptorType: 'NetSuiteExport',
        _connectionId: 'conn-456',
        netsuite: {type: 'search'},
      };
      const mappings = [{
        extract: 'id',
        generate: 'id',
        key: '17RxsaFmJW',
      }];

      expectSaga(invokeProcessor, { editorId, processor: 'mapperProcessor' })
        .provide([
          [matchers.call.fn(apiCallWithRetry), undefined],
          [select(selectors.mapping), {mappings, lookups: [], preview: {data: 'some data', status: 'success'}}],
          [select(selectors.editor, editorId), editorState],
          [select(selectors.resource, 'imports', 'res-123'), importRes],
          [select(selectors.firstFlowPageGenerator, 'flow-123'), exportRes],
        ])
        .returns({data: 'some data', status: 'success'})
        .run() &&
        expectSaga(invokeProcessor, { editorId, processor: 'mapperProcessor' })
          .provide([
            [matchers.call.fn(apiCallWithRetry), undefined],
            [select(selectors.mapping), {mappings, lookups: [], preview: {data: 'some data', status: 'failed'}}],
            [select(selectors.editor, editorId), editorState],
            [select(selectors.resource, 'imports', 'res-123'), importRes],
            [select(selectors.firstFlowPageGenerator, 'flow-123'), exportRes],
          ])
          .returns({data: 'some data', status: 'failed'})
          .run();
    });
    test('should set correct request body and make api call if processor is mapperProcessor for mappings editor type with lookups', () => {
      const editorState = {
        resourceId: 'res-123',
        flowId: 'flow-123',
        resourceType: 'imports',
        data: '[{"id": "123"}]',
        editorType: 'mappings',
      };
      const importRes = {
        _id: 'res-123',
        adaptorType: 'FTPImport',
        _connectionId: 'conn-123',
        file: {type: 'csv'},
      };
      const exportRes = {
        _id: 'exp-123',
        adaptorType: 'NetSuiteExport',
        _connectionId: 'conn-456',
        netsuite: {type: 'search'},
      };
      const mappings = [{
        extract: 'id',
        generate: 'id',
        key: '17RxsaFmJW',
        lookupName: 'test-lookup',
      }];
      const lookups = [
        {
          allowFailures: false,
          isConditionalLookup: false,
          map: {nnn: '444',
            yyy: '888'},
          name: 'test-lookup',
        },
      ];

      const expectedBody = {
        rules: {
          rules: [{
            fields: [],
            lists: [
              {generate: '',
                fields: [
                  {
                    extract: '*.id',
                    generate: 'id',
                    key: '17RxsaFmJW',
                    lookupName: 'test-lookup',
                  },
                ],
              },
            ],
            lookups: [
              {
                allowFailures: false,
                isConditionalLookup: false,
                map: {nnn: '444',
                  yyy: '888'},
                name: 'test-lookup',
              },
            ],
          }],
        },
        data: [[{id: '123'}]],
        options: {},
      };

      expectSaga(invokeProcessor, { editorId, processor: 'mapperProcessor' })
        .provide([
          [matchers.call.fn(apiCallWithRetry), undefined],
          [select(selectors.mapping), {mappings, lookups}],
          [select(selectors.editor, editorId), editorState],
          [select(selectors.resource, 'imports', 'res-123'), importRes],
          [select(selectors.firstFlowPageGenerator, 'flow-123'), exportRes],
        ])
        .call(apiCallWithRetry, {
          path: '/processors/mapperProcessor',
          opts: {
            method: 'POST',
            body: expectedBody,
          },
          hidden: true })
        .run();
    });
    test('should set correct request body and make api call if processor is mapperProcessor for responseMappings editor type', () => {
      const editorState = {
        resourceId: 'res-123',
        flowId: 'flow-123',
        resourceType: 'imports',
        data: '[{"id": "123"}]',
        editorType: 'responseMappings',
      };
      const mappings = [{
        extract: 'id',
        generate: 'id',
        key: '17RxsaFmJW',
      }];

      const expectedBody = {
        rules: {
          rules: [{
            fields: [{extract: 'id', generate: 'id'}],
            lists: [],
          }],
        },
        data: [[{id: '123'}]],
        options: {},
      };

      expectSaga(invokeProcessor, { editorId, processor: 'mapperProcessor' })
        .provide([
          [matchers.call.fn(apiCallWithRetry), undefined],
          [select(selectors.responseMapping), {mappings}],
          [select(selectors.editor, editorId), editorState],
        ])
        .call(apiCallWithRetry, {
          path: '/processors/mapperProcessor',
          opts: {
            method: 'POST',
            body: expectedBody,
          },
          hidden: true })
        .run();
    });
    test('should set correct request body and make api call if processor is mapperProcessor for mappings editor type and v2 mappings exist', () => {
      const editorState = {
        resourceId: 'res-123',
        flowId: 'flow-123',
        resourceType: 'imports',
        data: '[{"id": "123"}]',
        editorType: 'mappings',
      };
      const importRes = {
        _id: 'res-123',
        adaptorType: 'HTTPImport',
        _connectionId: 'conn-123',
      };
      const connRes = {
        _id: 'conn-123',
        type: 'http',
      };
      const mappings = [{
        extract: 'id',
        generate: 'id',
        key: '17RxsaFmJW',
      }];
      const v2TreeData = [{
        generate: 'new-obj',
        dataType: 'object',
        extract: 'parents',
      }];

      const expectedBody = {
        rules: {
          rules: [{
            mappings: [{
              generate: 'new-obj',
              dataType: 'object',
              extract: 'parents',
              status: 'Active',
              sourceDataType: 'string',
              description: undefined,
              extractDateFormat: undefined,
              extractDateTimezone: undefined,
              generateDateFormat: undefined,
              generateDateTimezone: undefined,
              hardCodedValue: undefined,
              lookupName: undefined,
              default: undefined,
              conditional: {when: undefined},
            }],
            lookups: [],
          }],
        },
        data: [[{id: '123'}]],
        options: {
          connection: connRes,
          _flowId: 'flow-123',
          import: importRes,
          _integrationId: 'in-123',
        },
      };

      expectSaga(invokeProcessor, { editorId, processor: 'mapperProcessor' })
        .provide([
          [matchers.call.fn(apiCallWithRetry), undefined],
          [select(selectors.mapping), {v2TreeData, mappings, lookups: []}],
          [select(selectors.editor, editorId), editorState],
          [select(selectors.resource, 'imports', 'res-123'), importRes],
          [select(selectors.resource, 'flows', 'flow-123'), {_id: 'flow-123', _integrationId: 'in-123'}],
          [select(selectors.resource, 'connections', 'conn-123'), connRes],
        ])
        .call(apiCallWithRetry, {
          path: '/processors/mapperProcessor',
          opts: {
            method: 'POST',
            body: expectedBody,
          },
          hidden: true })
        .run();
    });
    test('should make api call with passed arguments', () => {
      const body = 'somebody';

      expectSaga(invokeProcessor, { processor: 'transform', body })
        .provide([
          [matchers.call.fn(apiCallWithRetry), undefined],
        ])
        .call.fn(apiCallWithRetry, {
          path: '/processors/transform',
          opts: {
            method: 'POST',
            body,
          },
          hidden: true })
        .run();
    });
  });
  describe('requestPreview saga', () => {
    test('should do nothing if no editor exists with given id', () => expectSaga(requestPreview, { id: editorId})
      .provide([
        [select(selectors.editor, editorId), undefined],
      ])
      .returns(undefined)
      .run());
    test('should dispatch validation failure action when editor has validation errors.', () => {
      const editor = {
        id: editorId,
        editorType: 'handlebars',
        formKey: 'new-123',
      };

      expectSaga(requestPreview, { id: editorId})
        .provide([
          [select(selectors.editor, editorId), editor],
        ])
        .put(actions.editor.validateFailure(editorId, {dataError: 'Must provide some sample data.'}))
        .returns(undefined)
        .run();
    });
    test('should call invokeProcessor saga when skipPreview is not set', () => {
      const editor = {
        id: editorId,
        editorType: 'handlebars',
        formKey: 'new-123',
        data: '{"id": "999"}',
        rule: '{{id}}',
      };

      expectSaga(requestPreview, { id: editorId})
        .provide([
          [select(selectors.editor, editorId), editor],
        ])
        .call(invokeProcessor, {
          editorId,
          processor: 'handlebars',
          body: {
            rules: { strict: false, template: '{{id}}' },
            data: {id: '999'},
          } })
        .run();
    });
    test('should dispatch preview failed action if invokeProcessor throws exception and has a valid json message', () => {
      const editor = {
        id: editorId,
        editorType: 'handlebars',
        formKey: 'new-123',
        data: '{"id": "999"}',
        rule: '{{id}}',
      };

      expectSaga(requestPreview, { id: editorId})
        .provide([
          [select(selectors.editor, editorId), editor],
          [call(invokeProcessor, {
            editorId,
            processor: 'handlebars',
            body: {
              rules: { strict: false, template: '{{id}}' },
              data: {id: '999'},
            } }), throwError(new APIException({
            status: 401,
            message: '{"message":"invalid processor", "code":"code"}',
          }))],
        ])
        .put(actions.editor.previewFailed(editorId, {errorMessage: ['Message: invalid processor'], errorLine: undefined, errSourceProcessor: undefined }))
        .run();
    });
    test('should dispatch preview failed action with details of error', () => {
      const editor = {
        id: editorId,
        editorType: 'handlebars',
        formKey: 'new-123',
        data: '{"id": "999"}',
        rule: '{{id}}',
      };

      const error = {
        message: 'Failed validation',
        code: 'code',
        details: [{
          message: 'Min. length is invalid',
        }, {
          message: 'Max. length is invalid',
        }],
      };
      const expectedError = ['1: Min. length is invalid\n2: Max. length is invalid'];

      expectSaga(requestPreview, { id: editorId})
        .provide([
          [select(selectors.editor, editorId), editor],
          [call(invokeProcessor, {
            editorId,
            processor: 'handlebars',
            body: {
              rules: { strict: false, template: '{{id}}' },
              data: {id: '999'},
            } }), throwError(new APIException({
            status: 401,
            message: JSON.stringify(error),
          }))],
        ])
        .put(actions.editor.previewFailed(editorId, {errorMessage: expectedError, errorLine: undefined, errSourceProcessor: undefined }))
        .run();
    });
    test('should dispatch preview response action with the final result if invokeProcesor succeeds', () => {
      const editor = {
        id: editorId,
        editorType: 'handlebars',
        formKey: 'new-123',
        data: '{"id": "999"}',
        rule: '{{id}}',
      };

      expectSaga(requestPreview, { id: editorId})
        .provide([
          [select(selectors.editor, editorId), editor],
          [call(invokeProcessor, {
            editorId,
            processor: 'handlebars',
            body: {
              rules: { strict: false, template: '{{id}}' },
              data: {id: '999'},
            } }), '999'],
        ])
        .not.put(actions.editor.previewFailed(editorId))
        .put(actions.editor.previewResponse(editorId, '999'))
        .run();
    });
    test('should validate mappings and call invokeProcessor saga when skipPreview is not set', () => {
      const editor = {
        id: editorId,
        editorType: 'mappings',
        formKey: 'new-123',
        data: '{"id": "999"}',
        rule: '{{id}}',
      };
      const mappings = [{extract: 'e1', generate: 'g1', lookupName: 'l1'}];

      expectSaga(requestPreview, { id: editorId})
        .provide([
          [select(selectors.editor, editorId), editor],
          [select(selectors.mapping), {mappings}],
          [call(invokeProcessor, {
            editorId,
            processor: 'mapperProcessor',
            body: {} }), {data: [{mappedObject: 'test'}]}],
        ])
        .not.put(actions.editor.previewFailed(editorId))
        .put(actions.editor.previewResponse(editorId, { data: 'test' }))
        .run();
    });
    test('should validate mappings and dispatch request preview action when mappingPreviewType is salesforce and call invokeProcessor saga', () => {
      const editor = {
        id: editorId,
        editorType: 'mappings',
        formKey: 'new-123',
        data: '{"id": "999"}',
        rule: '{{id}}',
        mappingPreviewType: 'salesforce',
      };
      const mappings = [{extract: 'e1', generate: 'g1', lookupName: 'l1'}];

      expectSaga(requestPreview, { id: editorId})
        .provide([
          [select(selectors.editor, editorId), editor],
          [select(selectors.mapping), {mappings}],
          [call(invokeProcessor, {
            editorId,
            processor: 'mapperProcessor',
            body: {} }), {data: [{mappedObject: 'test'}]}],
        ])
        .put(actions.mapping.requestPreview(editorId))
        .not.put(actions.editor.previewFailed(editorId))
        .put(actions.editor.previewResponse(editorId, { data: [{mappedObject: 'test'}] }))
        .run();
    });
    test('should validate mappings and dispatch preview failed action when mappingPreviewType is salesforce or netsuite if previewMapping saga returns errors', () => {
      const editor = {
        id: editorId,
        editorType: 'mappings',
        formKey: 'new-123',
        data: '{"id": "999"}',
        rule: '{{id}}',
        mappingPreviewType: 'salesforce',
      };
      const mappings = [{extract: 'e1', generate: 'g1', lookupName: 'l1'}];

      expectSaga(requestPreview, { id: editorId})
        .provide([
          [select(selectors.editor, editorId), editor],
          [select(selectors.mapping), {mappings}],
          [call(invokeProcessor, {
            editorId,
            processor: 'mapperProcessor',
            body: {} }), {errors: [{errors: 'test'}]}],
        ])
        .put(actions.mapping.requestPreview(editorId))
        .put(actions.editor.previewFailed(editorId, { errorMessage: 'Message: [{"errors":"test"}]', errSourceProcessor: undefined }))
        .run();
    });
    test('should validate mappings and dispatch request preview action when mappingPreviewType is netsuite and call invokeProcessor saga', () => {
      const result = {
        data: {
          data: {
            returnedObjects: {
              jsObjects: {
                data: [
                  {
                    celigoIsElement: true,
                    data: {
                      nlobjFieldIds: {
                        companyname: '123',
                        phone: '234',
                        fax: '123',
                        custentity51: '123',
                      },
                      nlobjSublistIds: {},
                    },
                  },
                ],
              },
              mappingErrors: [],
            },
          },
        },
      };
      const expectedOutput = {
        data: {
          nlobjFieldIds: {
            companyname: '123',
            phone: '234',
            fax: '123',
            custentity51: '123',
          },
          nlobjSublistIds: {},
        },
      };
      const editor = {
        id: editorId,
        editorType: 'mappings',
        formKey: 'new-123',
        data: '{"id": "999"}',
        rule: '{{id}}',
        mappingPreviewType: 'netsuite',
      };
      const mappings = [{extract: 'e1', generate: 'g1', lookupName: 'l1'}];

      expectSaga(requestPreview, { id: editorId})
        .provide([
          [select(selectors.editor, editorId), editor],
          [select(selectors.mapping), {mappings, isNSAssistantFormLoaded: true}],
          [call(invokeProcessor, {
            editorId,
            processor: 'mapperProcessor',
            body: {} }), result],
        ])
        .put(actions.mapping.requestPreview(editorId))
        .not.put(actions.editor.previewFailed(editorId))
        .put(actions.editor.previewResponse(editorId, expectedOutput))
        .run();
    });
    test('should dispatch validate failure if mappings are not valid', () => {
      const editor = {
        id: editorId,
        editorType: 'mappings',
        formKey: 'new-123',
        data: '{"id": "999"}',
        rule: '{{id}}',
      };
      const mappings = [{generate: 'g1'}];

      expectSaga(requestPreview, { id: editorId})
        .provide([
          [select(selectors.editor, editorId), editor],
          [select(selectors.mapping), {mappings}],
        ])
        .put(actions.editor.validateFailure(editorId, {ruleError: errorMessageStore('MAPPER1_MISSING_EXTRACT', {fields: 'g1'})}))
        .run();
    });
  });
  describe('evaluateExternalProcessor saga', () => {
    test('should do nothing if processor data is undefined', () => expectSaga(evaluateExternalProcessor, {})
      .not.call.fn(invokeProcessor)
      .returns(undefined)
      .run());
    test('should return violations if there are any', () => {
      const processorData = {
        editorType: 'handlebars',
        rule: ['id'],
      };

      expectSaga(evaluateExternalProcessor, {processorData})
        .not.call.fn(invokeProcessor)
        .returns({violations: {dataError: 'Must provide some sample data.'}})
        .run();
    });
    test('should return error if invokeProcessor call throws exception', () => {
      const processorData = {
        editorType: 'handlebars',
        data: '{"name": "Bob"}',
        rule: ['id'],
      };

      expectSaga(evaluateExternalProcessor, {processorData})
        .provide([
          [matchers.call.fn(invokeProcessor), throwError(new APIException({
            status: 401,
            message: 'some message',
          }))],
        ])
        .call.fn(invokeProcessor)
        .returns({ error: new APIException({
          status: 401,
          message: 'some message',
        })})
        .run();
    });
    test('should call invokeProcessor and not return error if there is no error from the call', () => {
      const processorData = {
        editorType: 'handlebars',
        data: '{"name": "Bob"}',
        rule: ['id'],
      };

      expectSaga(evaluateExternalProcessor, {processorData})
        .provide([
          [matchers.call.fn(invokeProcessor), ''],
        ])
        .call.fn(invokeProcessor)
        .returns('')
        .run();
    });
  });
  describe('save saga', () => {
    let editor;
    let patches;

    beforeEach(() => {
      patches = {
        foregroundPatches: [
          {
            patch: [{ op: 'replace', path: '/somepath', value: 'some value' }],
            resourceType: 'imports',
            resourceId: '999',
          },
          {
            patch: [{ op: 'replace', path: '/otherpath', value: 'other value' }],
            resourceType: 'scripts',
            resourceId: '777',
          },
          {
            patch: [{ op: 'replace', path: '/path', value: 'value' }],
            resourceType: 'exports',
            resourceId: '444',
          },
        ],
        backgroundPatches: [
          {
            patch: [{ op: 'replace', path: '/connection', value: 'some value' }],
            resourceType: 'connections',
            resourceId: '111',
          },
        ],
      };
      editor = { id: editorId, editorType: 'handlebars', fieldId: 'http.body', formKey: 'new-123' };
    });

    test('should do nothing if no editor exists with given id', async () => {
      const { effects } = await expectSaga(save, { id: editorId })
        .provide([[select(selectors.editor, editorId), undefined]])
        .returns(undefined)
        .run();

      expect(effects.call).toBeUndefined();
      expect(effects.put).toBeUndefined();
    });
    test('should call requestPreview when previewOnSave is true and dispatch save failed action in case preview fails', () => {
      const editor = { editorType: 'settingsForm', previewOnSave: true };

      expectSaga(save, { id: editorId })
        .provide([
          [select(selectors.editor, editorId), editor],
          [matchers.call.fn(requestPreview), { error: 'some error' }],
        ])
        .call.fn(requestPreview)
        .put(actions.editor.saveFailed(editorId))
        .run();
    });
    test('should not call requestPreview when previewOnSave is false', () => expectSaga(save, { id: editorId })
      .provide([
        [select(selectors.editor, editorId), editor],
      ])
      .not.call.fn(requestPreview)
      .run());

    test('should dispatch save failed action when preSaveValidate returned error', () => {
      editor.onSave = () => {};
      const preSaveValidate = () => ({saveError: true, message: 'save failed error'});

      processorLogic.preSaveValidate = jest.fn().mockImplementationOnce(() => preSaveValidate);

      expectSaga(save, { id: editorId })
        .provide([
          [select(selectors.editor, editorId), editor],
        ])
        .put(actions.editor.saveFailed(editorId, 'save failed error'))
        .run();
    });
    test('should call onSave handler when present in editor state and dispatch save complete action after foreground patches are run', async () => {
      editor.onSave = jest.fn().mockImplementationOnce(() => 'does some on save');
      processorLogic.getPatchSet = jest.fn().mockImplementationOnce(() => patches);

      const { effects } = await expectSaga(save, { id: editorId })
        .provide([
          [select(selectors.editor, editorId), editor],
          [matchers.call.fn(commitStagedChanges), undefined],
        ])
        .not.put(actions.editor.saveFailed(editorId))
        .run();

      expect(editor.onSave.mock.calls).toHaveLength(1);

      // since there are 3 foreground patches, total call to commitStagedChanges would be 3
      expect(effects.call).toHaveLength(3);
      expect(effects.put).toHaveLength(5);
      // 4th action would be editor savecomplete, after first 3 for foreground patchStaged
      expect(effects.put[3]).toEqual(put(actions.editor.saveComplete(editorId)));
    });
    test('should dispatch save failed action if no patch sets are given and onSave handler is also undefined', () => {
      processorLogic.getPatchSet = jest.fn().mockImplementationOnce(() => null);

      expectSaga(save, { id: editorId })
        .provide([
          [select(selectors.editor, editorId), editor],
        ])
        .put(actions.editor.saveFailed(editorId))
        .run();
    }
    );

    test('should dispatch save complete action if no foreground patch exists', async () => {
      delete patches.foregroundPatches;
      processorLogic.getPatchSet = jest.fn().mockImplementationOnce(() => patches);

      const { effects } = await expectSaga(save, { id: editorId })
        .provide([
          [select(selectors.editor, editorId), editor],
        ])
        .not.call.fn(commitStagedChanges)
        .put(actions.editor.saveComplete(editorId))
        .run();

      expect(effects.call).toBeUndefined();
    });

    test('should not dispatch save complete action if ANY foregound patch fails', async () => {
      processorLogic.getPatchSet = jest.fn().mockImplementationOnce(() => patches);
      const { effects } = await expectSaga(save, { id: editorId })
        .provide([
          [select(selectors.editor, editorId), editor],
          [
            matchers.call(commitStagedChanges, {
              resourceType: 'imports',
              id: '999',
              context: undefined,
              options: undefined,
            }),
            undefined,
          ],
          [
            call(commitStagedChanges, {
              resourceType: 'scripts',
              id: '777',
              context: undefined,
              options: undefined,
            }),
            { error: 'some error' },
          ],
        ])
        .put(actions.editor.saveFailed(editorId))
        .not.put(actions.editor.saveComplete(editorId))
        .run();

      // 2nd call for 'scripts' patch will fail, hence the 3rd commit call should not happen
      expect(effects.call).toHaveLength(2);
    });

    test('should dispatch save complete action only if ALL foregound patches succeed', async () => {
      processorLogic.getPatchSet = jest.fn().mockImplementationOnce(() => patches);
      const { effects } = await expectSaga(save, { id: editorId })
        .provide([
          [select(selectors.editor, editorId), editor],
          [matchers.call.fn(commitStagedChanges), undefined],
        ])
        .not.put(actions.editor.saveFailed(editorId))
        .run();

      // since there are 3 foreground patches, total call to commitStagedChanges would be 3
      expect(effects.call).toHaveLength(3);
      expect(effects.put).toHaveLength(5);
      // 4th action would be editor savecomplete, after first 3 for foreground patchStaged
      expect(effects.put[3]).toEqual(put(actions.editor.saveComplete(editorId)));
    });

    test('should not dispatch save failed action even if background patches fail', async () => {
      processorLogic.getPatchSet = jest.fn().mockImplementationOnce(() => patches);
      const { effects } = await expectSaga(save, { id: editorId })
        .provide([
          [select(selectors.editor, editorId), editor],
          [matchers.call.fn(commitStagedChanges), undefined],
          [
            call(commitStagedChanges, {
              resourceType: 'connections',
              id: '111',
            }),
            { error: 'some error' },
          ],
        ])
        .not.put(actions.editor.saveFailed(editorId))
        .run();

      // since there are 3 foreground patches, total call to commitStagedChanges would be 3
      expect(effects.call).toHaveLength(3);

      // Note: if any effects' assertion(non-negated) is done while calling expectSaga API, then the returned Promise
      // contains that many less count of the effects
      // for eg, if we also add assertion in expectSaga like .put(actions.editor.saveComplete(id)), then effects.put
      // will have a length of 5, not 6 as we have already asserted one action
      expect(effects.put).toHaveLength(5);
      expect(effects.put[4]).toEqual(
        put(actions.resource.patchAndCommitStaged('connections', '111', [{op: 'replace', path: '/connection', value: 'some value'}]))
      );
    });
  });
  describe('autoEvaluateProcessor saga', () => {
    test('should do nothing if no editor exists with given id', () => expectSaga(autoEvaluateProcessor, { id: editorId})
      .provide([
        [select(selectors.editor, editorId), undefined],
      ])
      .not.put(actions.editor.previewRequest(editorId))
      .returns(undefined)
      .run());

    test('should do nothing if editor exists but auto evaluate is off.', () => expectSaga(autoEvaluateProcessor, { id: editorId})
      .provide([
        [select(selectors.editor, editorId), {autoEvaluate: false}],
      ])
      .not.put(actions.editor.previewRequest(editorId))
      .returns(undefined)
      .run());
    test('should add delay of 500ms and then disptach previewRequest action', () => {
      const editor = {
        id: editorId,
        editorType: 'handlebars',
        formKey: 'new-123',
        autoEvaluate: true,
      };

      expectSaga(autoEvaluateProcessor, { id: editorId})
        .provide([
          [select(selectors.editor, editorId), editor],
        ])
        .delay(500)
        .put(actions.editor.previewRequest(editorId))
        .run(500); // increasing the default saga timeout to 500 (from 250)
    });
  });
  describe('refreshHelperFunctions saga', () => {
    process.env.HELPER_FUNCTIONS_INTERVAL_UPDATE = 1;
    const localStorage = {
      setItem: jest.fn(),
      getItem: jest.fn(),
    };

    Object.defineProperty(window, 'localStorage', { value: localStorage });
    beforeEach(() => {
      clear();
    });

    test('should dispatch update helper functions action when local storage already contains helper functions', () => {
      advanceTo(1234); // reset to date time.
      const mockHelperFunctions = ['add', 'substract'];

      // setting a threshold interval to not cause an update
      process.env.HELPER_FUNCTIONS_INTERVAL_UPDATE = 500;

      localStorage.getItem = jest.fn().mockImplementationOnce(() =>
        JSON.stringify({
          updateTime: 1000,
          helperFunctions: mockHelperFunctions,
        })
      );

      expectSaga(refreshHelperFunctions)
        .not.call.fn(getResource)
        .put(actions.editor.updateHelperFunctions(mockHelperFunctions))
        .run();
    });
    test('should create a new helperFunction instance when there isn\'t any in the local storage', () => {
      localStorage.getItem = jest.fn().mockImplementationOnce(() => null);
      const someDateEpoch = 1234;

      advanceTo(someDateEpoch); // reset to date time.

      const mockHelperResp = {
        handlebars: { helperFunctions: ['add', 'uri'] },
      };

      expectSaga(refreshHelperFunctions)
        .provide([
          [call(getResource, {
            resourceType: 'processors',
            message: 'Getting Helper functions',
          }), mockHelperResp],
        ])
        .put(actions.editor.updateHelperFunctions(['add', 'uri']))
        .run();

      expect(localStorage.setItem).toBeCalledWith(
        'helperFunctions',
        JSON.stringify({
          updateTime: someDateEpoch,
          helperFunctions: mockHelperResp.handlebars.helperFunctions,
        })
      );
    });

    test('should check the updateTime in the localStorage for the helper Function to detemine if the helperFunctions need to be updated, lets consider the scenario where the update interval is larger', () => {
      const recentDateEpoch = 1100;
      const olderDateEpoch = 1000;
      const mockHelperFunctions = ['add', 'substract'];

      // setting a threshold interval to not cause an update
      process.env.HELPER_FUNCTIONS_INTERVAL_UPDATE = 200;

      localStorage.getItem = jest.fn().mockImplementationOnce(() =>
        JSON.stringify({
          updateTime: olderDateEpoch,
          helperFunctions: mockHelperFunctions,
        })
      );
      // advance the time to be less than the interval
      advanceTo(recentDateEpoch);

      expectSaga(refreshHelperFunctions)
        .not.call.fn(getResource)
        .put(actions.editor.updateHelperFunctions(mockHelperFunctions))
        .run();
    });

    test('should check the updateTime in the localStorage for the helper Function to determine if the helperFunctions need to be updated, lets consider the scenario where the update interval is smaller', () => {
      const recentDateEpoch = 1100;
      const olderDateEpoch = 1000;

      // setting a threshold interval to cause an update
      process.env.HELPER_FUNCTIONS_INTERVAL_UPDATE = 50;
      const mockHelperResp = {
        handlebars: { helperFunctions: ['add', 'abs'] },
      };

      localStorage.getItem = jest.fn().mockImplementationOnce(() =>
        JSON.stringify({
          updateTime: olderDateEpoch,
          helperFunctions: ['add', 'abs'],
        })
      );

      // advance the time to sufficiently exceed the interval
      advanceTo(recentDateEpoch);

      expectSaga(refreshHelperFunctions)
        .provide([
          [call(getResource, {
            resourceType: 'processors',
            message: 'Getting Helper functions',
          }), mockHelperResp],
        ])
        .put(actions.editor.updateHelperFunctions(['add', 'abs']))
        .run();

      expect(localStorage.setItem).toBeCalledWith(
        'helperFunctions',
        JSON.stringify({
          updateTime: recentDateEpoch,
          helperFunctions: mockHelperResp.handlebars.helperFunctions,
        })
      );
    });
    test('should exit gracefully when the getResource api call fails and should not dispatch update helper function action', () => {
      localStorage.getItem = jest.fn().mockImplementationOnce(() => null);

      expectSaga(refreshHelperFunctions)
        .provide([
          [call(getResource, {
            resourceType: 'processors',
            message: 'Getting Helper functions',
          }), undefined],
        ])
        .not.put(actions.editor.updateHelperFunctions(['add', 'abs']))
        .run();
    });
  });
  describe('requestEditorSampleData saga', () => {
    const resourceId = 'res-123';
    const flowId = 'flow-123';

    test('should do nothing if editor does not exist', () => expectSaga(requestEditorSampleData, { id: editorId })
      .provide([
        [select(selectors.editor, editorId), undefined],
      ])
      .returns(undefined)
      .run());
    test('should return empty data object if resource type is apis', () => {
      const editor = {
        id: 'script',
        editorType: 'javascript',
        resourceType: 'apis',
        resourceId,
        insertStubKey: 'handleRequest',
      };

      expectSaga(requestEditorSampleData, { id: 'script' })
        .provide([
          [select(selectors.editor, 'script'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
        ])
        .returns({data: {}})
        .run();
    });
    test('should return default sample data when stage is contentBasedFlowRouter', () => {
      const editor = {
        id: 'as2content',
        editorType: 'javascript',
        resourceType: 'connections',
        resourceId,
        formKey: 'new-123',
        insertStubKey: 'contentBasedFlowRouter',
        stage: 'contentBasedFlowRouter',
      };

      expectSaga(requestEditorSampleData, { id: 'as2content' })
        .provide([
          [select(selectors.editor, 'as2content'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
        ])
        .returns({
          data: {
            httpHeaders: {
              'as2-from': 'OpenAS2_appA',
              'as2-to': 'OpenAS2_appB',
            },
            mimeHeaders: {
              'content-type': 'application/edi-x12',
              'content-disposition': 'Attachment; filename=rfc1767.dat',
            },
            rawMessageBody: 'sample message',
          },
        })
        .run();
    });
    test('should call fileSampleData selector and return data when editor type is csv or xml parser', () => {
      const editor = {
        id: 'filexml',
        editorType: 'xmlParser',
        flowId,
        resourceType: 'exports',
        resourceId,
        fieldId: 'file.xml',
        formKey: 'new-123',
      };

      expectSaga(requestEditorSampleData, { id: 'filexml' })
        .provide([
          [select(selectors.editor, 'filexml'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.select.selector(selectors.fileSampleData), '<xml>some data</xml>'],
        ])
        .select(selectors.fileSampleData, { resourceId, resourceType: 'exports', fileType: 'xml', ssLinkedConnectionId: undefined})
        .returns({ data: '<xml>some data</xml>'})
        .run();
    });
    test('should return empty object if editor type is structuredFileGenerator or structuredFileParser', () => {
      const editor = {
        id: 'filefiledefinition',
        editorType: 'structuredFileGenerator',
        flowId,
        resourceType: 'imports',
        resourceId,
        fieldId: 'file.filedefinition',
        formKey: 'new-123',
      };

      expectSaga(requestEditorSampleData, { id: 'filefiledefinition' })
        .provide([
          [select(selectors.editor, 'filefiledefinition'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
        ])
        .returns({})
        .run();
    });
    test('should call requestResourceFormSampleData for standalone export and get preSavePageHook stage data for dataURITemplate/traceKeyTemplate field', () => {
      const editor = {
        id: 'dataURITemplate',
        editorType: 'handlebars',
        resourceType: 'exports',
        resourceId,
        fieldId: 'dataURITemplate',
        formKey: 'new-123',
      };

      expectSaga(requestEditorSampleData, { id: 'dataURITemplate' })
        .provide([
          [select(selectors.editor, 'dataURITemplate'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(requestResourceFormSampleData)],
          [matchers.select.selector(selectors.getResourceSampleDataWithStatus), { data: {name: 'Bob'} }],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true}],
          [matchers.call.fn(apiCallWithRetry), {context: {record: {name: 'Bob'}}, templateVersion: 2}],
        ])
        .call(requestResourceFormSampleData, { formKey: editor.formKey, options: { executeProcessors: true } })
        .returns({data: { record: {name: 'Bob'} }, templateVersion: 2})
        .run();
    });
    test('should call getFlowSampleData and get responseMappingExtract ( output of preSavePage hook ) stage data for dataURI/traceKeyTemplate field', () => {
      const editor = {
        id: 'traceKeyTemplate',
        editorType: 'handlebars',
        flowId,
        resourceType: 'exports',
        resourceId,
        fieldId: 'traceKeyTemplate',
        stage: 'responseMappingExtract',
        formKey: 'new-123',
      };

      expectSaga(requestEditorSampleData, { id: 'traceKeyTemplate' })
        .provide([
          [select(selectors.editor, 'traceKeyTemplate'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(getFlowSampleData), {name: 'Bob'}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true}],
          [matchers.call.fn(apiCallWithRetry), {context: {record: {name: 'Bob'}}, templateVersion: 2}],
        ])
        .call(getFlowSampleData, {flowId, resourceId, resourceType: 'exports', stage: 'responseMappingExtract', formKey: 'new-123'})
        .returns({data: { record: {name: 'Bob'} }, templateVersion: 2})
        .run();
    });
    test('should call getFlowSampleData and get responseMappingExtract ( output of preSavePage hook ) stage data for webhook.successBody field', () => {
      const editor = {
        id: 'webhook.successBody',
        editorType: 'handlebars',
        flowId,
        resourceType: 'exports',
        resourceId,
        fieldId: 'webhook.successBody',
        stage: 'responseMappingExtract',
        formKey: 'new-123',
      };

      expectSaga(requestEditorSampleData, { id: 'webhook.successBody' })
        .provide([
          [select(selectors.editor, 'webhook.successBody'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(getFlowSampleData), {name: 'Bob'}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true}],
          [matchers.call.fn(apiCallWithRetry), {context: {record: {name: 'Bob'}}, templateVersion: 2}],
        ])
        .call(getFlowSampleData, {flowId, resourceId, resourceType: 'exports', stage: 'responseMappingExtract', formKey: 'new-123'})
        .returns({data: { record: {name: 'Bob'} }, templateVersion: 2})
        .run();
    });
    test('should call requestResourceFormSampleData incase of http/rest resource when paging is configured', () => {
      const editor = {
        id: 'restrelativeuri',
        editorType: 'handlebars',
        flowId,
        resourceType: 'exports',
        resourceId,
        fieldId: 'http.relativeURI',
        formKey: 'new-123',
      };

      const resource = {
        _id: resourceId,
        http: {
          paging: {
            method: 'relativeuri',
          },
        },
      };
      const formValues = [];

      expectSaga(requestEditorSampleData, { id: 'restrelativeuri' })
        .provide([
          [select(selectors.editor, 'restrelativeuri'), editor],
          [select(selectors.formState, 'new-123'), { value: formValues}],
          [matchers.call.fn(constructResourceFromFormValues), resource],
          [matchers.call.fn(requestResourceFormSampleData), {}],
          [matchers.call.fn(requestSampleData), {}],
          [matchers.call.fn(apiCallWithRetry), {}],
        ])
        .call(requestResourceFormSampleData, { formKey: editor.formKey, options: { executeProcessors: false } })
        .returns({data: undefined, templateVersion: undefined})
        .run();
    });
    test('should reload sample data and call requestSampleData if no sample data exists in the state', () => {
      const editor = {
        id: 'tx-123',
        editorType: 'flowTransform',
        flowId,
        resourceType: 'imports',
        resourceId,
        stage: 'transform',
      };

      expectSaga(requestEditorSampleData, { id: 'tx-123' })
        .provide([
          [select(selectors.editor, 'tx-123'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(getFlowSampleData), {}],
          [matchers.call.fn(apiCallWithRetry), {}],
        ])
        .call(getFlowSampleData, {flowId, routerId: undefined, resourceId, resourceType: 'imports', stage: 'transform', editorId: 'tx-123'})
        .run();
    });
    test('should not make apiCallWithRetry if BE does not support the editor', () => {
      const editor = {
        id: 'tx-123',
        editorType: 'flowTransform',
        flowId,
        resourceType: 'imports',
        resourceId,
        stage: 'transform',
      };

      expectSaga(requestEditorSampleData, { id: 'tx-123' })
        .provide([
          [select(selectors.editor, 'tx-123'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(requestSampleData), {}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: false}],
        ])
        .call(getFlowSampleData, {flowId, routerId: undefined, resourceId, resourceType: 'imports', stage: 'transform', editorId: 'tx-123'})
        .not.call.fn(apiCallWithRetry)
        .run();
    });
    test('should make apiCallWithRetry call with correct request body and dispatch sample data failed action if api threw error', () => {
      const editor = {
        id: 'eFilter',
        editorType: 'exportFilter',
        flowId,
        resourceType: 'exports',
        resourceId,
        stage: 'exportFilter',
      };

      expectSaga(requestEditorSampleData, { id: 'eFilter' })
        .provide([
          [select(selectors.editor, 'eFilter'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(getFlowSampleData), {}],
          [matchers.call.fn(apiCallWithRetry), throwError(new APIException({
            status: 401,
            message: '{"message":"invalid processor", "code":"code"}',
          }))],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true, sampleData: {name: 'Bob'}}],
        ])
        .call(getFlowSampleData, {flowId, routerId: undefined, resourceId, resourceType: 'exports', stage: 'exportFilter', editorId: 'eFilter'})
        .call.fn(apiCallWithRetry)
        .put(actions.editor.sampleDataFailed('eFilter', '{"message":"invalid processor", "code":"code"}'))
        .run();
    });
    test('should make apiCallWithRetry call with correct request body and not dispatch sample data failed action if api call was a success', () => {
      const editor = {
        id: 'eFilter',
        editorType: 'exportFilter',
        flowId,
        resourceType: 'exports',
        resourceId,
        stage: 'exportFilter',
      };

      expectSaga(requestEditorSampleData, { id: 'eFilter' })
        .provide([
          [select(selectors.editor, 'eFilter'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(getFlowSampleData), {}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true, sampleData: {name: 'Bob'}}],
          [matchers.call.fn(apiCallWithRetry), {context: {record: {name: 'Bob'}}, templateVersion: 2}],
        ])
        .call(getFlowSampleData, {flowId, routerId: undefined, resourceId, resourceType: 'exports', stage: 'exportFilter', editorId: 'eFilter'})
        .call.fn(apiCallWithRetry)
        .not.put(actions.editor.sampleDataFailed('eFilter', '{"message":"invalid processor", "code":"code"}'))
        .returns({ data: { record: { name: 'Bob' } }, templateVersion: 2 })
        .run();
    });
    test('should make /getContext api call with flow and integration id', () => {
      const editor = {
        id: 'eFilter',
        editorType: 'exportFilter',
        flowId,
        resourceType: 'exports',
        resourceId,
        stage: 'exportFilter',
      };

      expectSaga(requestEditorSampleData, { id: 'eFilter' })
        .provide([
          [select(selectors.editor, 'eFilter'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.select.selector(selectors.getSampleDataContext), {data: {id: 999}, status: 'received'}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true}],
          [matchers.call.fn(apiCallWithRetry), {context: {record: {id: 999}}, templateVersion: 2}],
          [select(selectors.resource, 'flows', flowId), {_integrationId: 'Integration-1234'}],
        ])
        .call(apiCallWithRetry, {
          path: '/processors/handleBar/getContext',
          opts: {
            method: 'POST',
            body: {
              sampleData: {id: 999},
              templateVersion: undefined,
              flowId,
              integrationId: 'Integration-1234',
              export: { oneToMany: false },
              fieldPath: 'filter',
            },
          },
          message: 'Loading',
          hidden: false,
        })
        .not.put(actions.editor.sampleDataFailed('eFilter', '{"message":"invalid processor", "code":"code"}'))
        .returns({ data: { record: {id: 999}}, templateVersion: 2 })
        .run();
    });

    test('should make /getContext api call when integration id is none', () => {
      const editor = {
        id: 'eFilter',
        editorType: 'exportFilter',
        flowId,
        resourceType: 'exports',
        resourceId,
        stage: 'exportFilter',
        _integrationId: 'none',
      };

      expectSaga(requestEditorSampleData, { id: 'eFilter' })
        .provide([
          [select(selectors.editor, 'eFilter'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.select.selector(selectors.getSampleDataContext), {data: {id: 999}, status: 'received'}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true}],
          [matchers.call.fn(apiCallWithRetry), {context: {record: {id: 999}}, templateVersion: 2}],
          [select(selectors.resource, 'flows', flowId), {}],
        ])
        .call(apiCallWithRetry, {
          path: '/processors/handleBar/getContext',
          opts: {
            method: 'POST',
            body: {
              sampleData: {id: 999},
              templateVersion: undefined,
              flowId,
              integrationId: undefined,
              export: { oneToMany: false },
              fieldPath: 'filter',
            },
          },
          message: 'Loading',
          hidden: false,
        })
        .not.put(actions.editor.sampleDataFailed('eFilter', '{"message":"invalid processor", "code":"code"}'))
        .returns({ data: { record: {id: 999}}, templateVersion: 2 })
        .run();
    });
    test('should not call getFlowSampleData and also sampleDataWrapper selector for csv generator return data as is', () => {
      const editor = {
        id: 'filecsv',
        editorType: 'csvGenerator',
        flowId,
        resourceType: 'imports',
        resourceId,
        formKey: 'new-123',
        fieldId: 'file.csv',
      };

      expectSaga(requestEditorSampleData, { id: 'filecsv' })
        .provide([
          [select(selectors.editor, 'filecsv'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true, sampleData: {name: 'Bob'}}],
          [matchers.call.fn(apiCallWithRetry), {context: {record: {name: 'Bob'}}, templateVersion: 2}],
        ])
        .not.call.fn(getFlowSampleData)
        .call.fn(apiCallWithRetry)
        .not.select.selector(selectors.sampleDataWrapper)
        .returns({ data: { record: { name: 'Bob' } }, templateVersion: 2 })
        .run();
    });
    test('should not call sampleDataWrapper selector for importMappingExtract stage and return data as is', () => {
      const editor = {
        id: 'salesforceid',
        editorType: 'salesforceLookupFilter',
        flowId,
        resourceType: 'imports',
        resourceId,
        stage: 'importMappingExtract',
        formKey: 'new-123',
        fieldId: 'whereclause',
      };

      expectSaga(requestEditorSampleData, { id: 'salesforceid' })
        .provide([
          [select(selectors.editor, 'salesforceid'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(getFlowSampleData), {}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: false, sampleData: {name: 'Bob'}}],
        ])
        .call(getFlowSampleData, {flowId, resourceId, resourceType: 'imports', stage: 'importMappingExtract', formKey: 'new-123' })
        .not.call.fn(apiCallWithRetry)
        .not.select.selector(selectors.sampleDataWrapper)
        .returns({ data: { name: 'Bob' }, templateVersion: undefined })
        .run();
    });
    test('should call sampleDataWrapper selector to wrap the data with context and then return the data', () => {
      const editor = {
        id: 'tx-123',
        editorType: 'flowTransform',
        flowId,
        resourceType: 'exports',
        resourceId,
        stage: 'transform',
      };

      expectSaga(requestEditorSampleData, { id: 'tx-123' })
        .provide([
          [select(selectors.editor, 'tx-123'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.select.selector(selectors.getSampleDataContext), {data: {id: 999}}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: false}],
          [matchers.select.selector(selectors.sampleDataWrapper), {data: {record: {id: 999}, lastExportDateTime: 1089}}],
        ])
        .not.call.fn(apiCallWithRetry)
        .select.selector(selectors.sampleDataWrapper)
        .returns({ data: { record: { id: 999 }, lastExportDateTime: 1089 }, templateVersion: undefined })
        .run();
    });
    test('should make /getContext api call correctly for connection type when it has no flow context', () => {
      const editor = {
        id: 'httppingbody',
        editorType: 'handlebars',
        resourceType: 'connections',
        resourceId,
        stage: 'flowInput',
        fieldId: 'http.ping.body',
      };

      expectSaga(requestEditorSampleData, { id: 'httppingbody' })
        .provide([
          [select(selectors.editor, 'httppingbody'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true}],
          [matchers.call.fn(apiCallWithRetry), {context: {connection: {name: 'HTTP connection'}}}],
        ])
        .call(apiCallWithRetry, {
          path: '/processors/handleBar/getContext',
          opts: {
            method: 'POST',
            body: {
              flowId: undefined,
              integrationId: undefined,
              type: 'connection',
              connection: {_userId: undefined},
              fieldPath: 'http.ping.body',
            },
          },
          message: 'Loading',
          hidden: false,
        })
        .returns({ data: {connection: {name: 'HTTP connection'}}, templateVersion: undefined })
        .run();
    });
    test('should make /getContext api call correctly for connection type when it has flow context', () => {
      const editor = {
        id: 'httppingbody',
        editorType: 'handlebars',
        flowId,
        resourceType: 'connections',
        resourceId,
        stage: 'flowInput',
        fieldId: 'http.ping.body',
        parentId: '789',
        parentType: 'exports',
      };

      expectSaga(requestEditorSampleData, { id: 'httppingbody' })
        .provide([
          [select(selectors.editor, 'httppingbody'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true}],
          [matchers.call.fn(apiCallWithRetry), {context: {connection: {name: 'HTTP connection'}}}],
          [select(selectors.resource, 'flows', flowId), {_integrationId: 'integration-1234'}],
          [select(selectors.ownerUserId), 'userId-999'],
        ])
        .call(apiCallWithRetry, {
          path: '/processors/handleBar/getContext',
          opts: {
            method: 'POST',
            body: {
              flowId,
              integrationId: 'integration-1234',
              exportId: '789',
              type: 'connection',
              connection: {_userId: 'userId-999'},
              fieldPath: 'http.ping.body',
            },
          },
          message: 'Loading',
          hidden: false,
        })
        .returns({ data: {connection: {name: 'HTTP connection'}}, templateVersion: undefined })
        .run();
    });
    test('should add uiContext in the request body when the field type is from mappings', () => {
      const editor = {
        id: 'expression',
        editorType: 'handlebars',
        flowId,
        resourceType: 'imports',
        resourceId,
        stage: 'importMappingExtract',
        fieldId: 'expression',
      };

      expectSaga(requestEditorSampleData, { id: 'expression' })
        .provide([
          [select(selectors.editor, 'expression'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.select.selector(selectors.getSampleDataContext), {data: {id: 999}, status: 'received'}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true, isMapperField: true}],
          [matchers.call.fn(apiCallWithRetry), {context: {record: {id: 999}}, templateVersion: 2}],
          [select(selectors.resource, 'flows', flowId), {_integrationId: 'Integration-1234'}],
        ])
        .call(apiCallWithRetry, {
          path: '/processors/handleBar/getContext',
          opts: {
            method: 'POST',
            body: {
              sampleData: {id: 999},
              templateVersion: undefined,
              flowId,
              integrationId: 'Integration-1234',
              import: { oneToMany: false },
              fieldPath: 'expression',
              uiContext: 'mapper2_0',
            },
          },
          message: 'Loading',
          hidden: false,
        })
        .returns({ data: { record: {id: 999}}, templateVersion: 2 })
        .run();
    });
    test('should add mapper2_0 in the request body when the field type is from mappings and row has parent extracts', () => {
      const editor = {
        id: 'expression',
        editorType: 'handlebars',
        flowId,
        resourceType: 'imports',
        resourceId,
        stage: 'importMappingExtract',
        fieldId: 'expression',
        mapper2RowKey: 'c2',
      };

      expectSaga(requestEditorSampleData, { id: 'expression' })
        .provide([
          [select(selectors.editor, 'expression'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.select.selector(selectors.getSampleDataContext), {data: {id: 999}, status: 'received'}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true, isMapperField: true}],
          [matchers.call.fn(apiCallWithRetry), {context: {record: {id: 999}}, templateVersion: 2}],
          [select(selectors.resource, 'flows', flowId), {_integrationId: 'Integration-1234'}],
          [select(selectors.mapping), {
            v2TreeData: [
              {
                key: 'k1',
                extractsArrayHelper: [{extract: '$.siblings[*]'}],
                dataType: 'objectarray',
                children: [{
                  key: 'c1',
                  extractsArrayHelper: [{extract: '$.siblings.children[*]'}],
                  parentKey: 'k1',
                  parentExtract: '$.siblings[*]',
                  dataType: 'objectarray',
                  children: [{
                    key: 'c2',
                    extract: '$.siblings.children.qty',
                    parentExtract: '$.siblings.children[*]',
                    parentKey: 'c1',
                    dataType: 'string',
                  }],
                }],
              },
            ]}],
        ])
        .call(apiCallWithRetry, {
          path: '/processors/handleBar/getContext',
          opts: {
            method: 'POST',
            body: {
              sampleData: {id: 999},
              templateVersion: undefined,
              flowId,
              integrationId: 'Integration-1234',
              import: { oneToMany: false },
              fieldPath: 'expression',
              uiContext: 'mapper2_0',
              mapper2_0: {
                arrayExtracts: ['$.siblings[*]', '$.siblings.children[*]'],
                outputFormat: 'RECORD',
              },
            },
          },
          message: 'Loading',
          hidden: false,
        })
        .returns({ data: { record: {id: 999}}, templateVersion: 2 })
        .run();
    });
    test('should add mapper2_0 in the request body when the field type is from mappings and output format is rows', () => {
      const editor = {
        id: 'expression',
        editorType: 'handlebars',
        flowId,
        resourceType: 'imports',
        resourceId,
        stage: 'importMappingExtract',
        fieldId: 'expression',
        mapper2RowKey: 'k1',
      };

      expectSaga(requestEditorSampleData, { id: 'expression' })
        .provide([
          [select(selectors.editor, 'expression'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.select.selector(selectors.getSampleDataContext), {data: {id: 999}, status: 'received'}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true, isMapperField: true}],
          [matchers.call.fn(apiCallWithRetry), {context: {record: {id: 999}}, templateVersion: 2}],
          [select(selectors.resource, 'flows', flowId), {_integrationId: 'Integration-1234'}],
          [select(selectors.mapping), {
            isGroupedOutput: true,
            v2TreeData: [
              {
                key: 'k1',
                extract: '$.siblings',
                generate: 'siblings',
                dataType: 'string',
              },
            ]}],
        ])
        .call(apiCallWithRetry, {
          path: '/processors/handleBar/getContext',
          opts: {
            method: 'POST',
            body: {
              sampleData: {id: 999},
              templateVersion: undefined,
              flowId,
              integrationId: 'Integration-1234',
              import: { oneToMany: false },
              fieldPath: 'expression',
              uiContext: 'mapper2_0',
              mapper2_0: {
                outputFormat: 'ROWS',
              },
            },
          },
          message: 'Loading',
          hidden: false,
        })
        .returns({ data: { record: {id: 999}}, templateVersion: 2 })
        .run();
    });
  });
  describe('initSampleData saga', () => {
    test('should do nothing if editor does not exist', () => expectSaga(initSampleData, { id: editorId })
      .provide([
        [select(selectors.editor, editorId), undefined],
      ])
      .not.call(refreshHelperFunctions)
      .not.call(autoEvaluateProcessorWithCancel, { id: editorId })
      .returns(undefined)
      .run());
    test('should dispatch data received action if editor has data', () => {
      const editor = {
        id: 'httpbody',
        fieldId: 'http.body',
        editorType: 'handlebars',
        sampleDataStatus: 'received',
        data: '{"id": "999"}',
      };

      expectSaga(initSampleData, { id: editorId })
        .provide([
          [select(selectors.editor, editorId), editor],
          [call(refreshHelperFunctions), undefined],
        ])
        .not.call.fn(requestEditorSampleData)
        .put(actions.editor.sampleDataReceived(editorId, '{"id": "999"}')
        )
        .call(refreshHelperFunctions)
        .call(autoEvaluateProcessorWithCancel, { id: editorId })
        .run();
    });
    test('should call requestEditorSampleData and then dispatch data received action if editor has undefined sampleDataStatus with no data', () => {
      const editor = {
        id: 'httpbody',
        fieldId: 'http.body',
        editorType: 'handlebars',
      };

      expectSaga(initSampleData, { id: editorId })
        .provide([
          [select(selectors.editor, editorId), editor],
          [call(requestEditorSampleData, {id: editorId}), {data: '{"id": "999"}', templateVersion: 2}],
          [call(refreshHelperFunctions), undefined],
        ])
        .call(requestEditorSampleData, {id: editorId})
        .put(actions.editor.sampleDataReceived(editorId, '{"id": "999"}', 2)
        )
        .call(refreshHelperFunctions)
        .call(autoEvaluateProcessorWithCancel, { id: editorId })
        .run();
    });
    test('should call requestEditorSampleData and then dispatch data received action if editor has sampleDataStatus as requested', () => {
      const editor = {
        id: 'httpbody',
        fieldId: 'http.body',
        editorType: 'handlebars',
        sampleDataStatus: 'requested',
      };

      expectSaga(initSampleData, { id: editorId })
        .provide([
          [select(selectors.editor, editorId), editor],
          [call(requestEditorSampleData, {id: editorId}), {data: '{"id": "999"}', templateVersion: 2}],
          [call(refreshHelperFunctions), undefined],
        ])
        .call(requestEditorSampleData, {id: editorId})
        .put(actions.editor.sampleDataReceived(editorId, '{"id": "999"}', 2)
        )
        .call(refreshHelperFunctions)
        .call(autoEvaluateProcessorWithCancel, { id: editorId })
        .run();
    });
  });
  describe('initEditor saga', () => {
    test('should dispatch init complete action with state options and call initSampleData', () => {
      const options = {
        resourceId: 'res-123',
        flowId: 'flow-123',
        stage: 'filter',
      };
      const expectedOptions = {
        editorType: 'filter',
        resourceId: 'res-123',
        flowId: 'flow-123',
        stage: 'filter',
        fieldId: '',
        autoEvaluate: false,
        layout: 'compact',
        sampleDataStatus: 'requested',
      };

      expectSaga(initEditor, { id: editorId, editorType: 'filter', options })
        .provide([
          [matchers.call.fn(initSampleData), undefined],
        ])
        .run()
        .then(result => {
          const { effects } = result;

          expect(effects.put).toHaveLength(1);
          expect(effects.call).toEqual(expect.arrayContaining([call(initSampleData, { id: editorId })]));

          expect(effects.put[0]).toHaveProperty('payload.action.options', expectedOptions);
        });
    });
    test('should correctly update options if editor supports init logic and dispatch init complete action', () => {
      const id = 'filecsv';
      const options = {
        resourceId: 'res-123',
        resourceType: 'imports',
        flowId: 'flow-123',
        stage: 'flowInput',
        fieldId: 'file.csv',
        formKey: 'new-123',
      };
      const expectedOptions = {
        editorType: 'csvParser',
        resourceId: 'res-123',
        resourceType: 'imports',
        flowId: 'flow-123',
        stage: 'flowInput',
        fieldId: 'file.csv',
        formKey: 'new-123',
        layout: 'compact',
        autoEvaluate: true,
        sampleDataStatus: 'requested',
        rule: {
          multipleRowsPerRecord: false,
          trimSpaces: true,
          groupByFields: [],
          sortByFields: [],
        },
        originalRule: {
          multipleRowsPerRecord: false,
          trimSpaces: true,
          groupByFields: [],
          sortByFields: [],
        },
      };

      expectSaga(initEditor, { id, editorType: 'csvParser', options })
        .provide([
          [select(selectors.fieldState, 'new-123', 'file.csv'), {}],
          [select(selectors.formState, 'new-123'), {fieldMap: {}}],
          [matchers.call.fn(initSampleData), undefined],
          [matchers.call.fn(constructResourceFromFormValues), {}],
        ])
        .run()
        .then(result => {
          const { effects } = result;

          expect(effects.put).toHaveLength(1);
          expect(effects.call).toEqual(expect.arrayContaining([call(initSampleData, { id })]));

          expect(effects.put[0]).toHaveProperty('payload.action.options', expectedOptions);
        });
    });

    test('should correctly update init options if editor type is handlebars or sql and dispatch init complete action', () => {
      const id = 'query';
      const options = {
        resourceId: 'res-123',
        resourceType: 'imports',
        flowId: 'flow-123',
        stage: 'flowInput',
        rule: '{{query}}',
        fieldId: 'query',
        formKey: 'new-123',
      };
      const expectedOptions = {
        editorType: 'sql',
        resourceId: 'res-123',
        resourceType: 'imports',
        flowId: 'flow-123',
        stage: 'flowInput',
        rule: '{{query}}',
        originalRule: '{{query}}',
        fieldId: 'query',
        formKey: 'new-123',
        layout: 'compact',
        sampleDataStatus: 'requested',
        supportsDefaultData: true,
        editorSupportsV1V2data: false,
        resultMode: 'text',
      };

      expectSaga(initEditor, { id, editorType: 'sql', options })
        .provide([
          [select(selectors.fieldState, 'new-123', 'query'), {}],
          [select(selectors.formState, 'new-123'), {fieldMap: {}}],
          [matchers.call.fn(initSampleData), undefined],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.select.selector(selectors.resource), {}],
          [matchers.select.selector(selectors.isPageGenerator), false],
        ])
        .run()
        .then(result => {
          const { effects } = result;

          expect(effects.put).toHaveLength(1);
          expect(effects.call).toEqual(expect.arrayContaining([call(initSampleData, { id })]));

          expect(effects.put[0]).toHaveProperty('payload.action.options', expectedOptions);
        });
    });
    test('should correctly update init options if editor type is settingsForm and dispatch init complete action', () => {
      const id = 'settings';
      const options = {
        resourceId: 'res-123',
        resourceType: 'imports',
        flowId: 'flow-123',
        stage: 'flowInput',
        fieldId: 'settings',
        formKey: 'new-123',
      };
      const expectedOptions = {
        editorType: 'settingsForm',
        resourceId: 'res-123',
        resourceType: 'imports',
        flowId: 'flow-123',
        stage: 'flowInput',
        fieldId: 'settings',
        formKey: 'new-123',
        layout: 'jsonFormBuilder',
        autoEvaluate: true,
        sampleDataStatus: 'requested',
        insertStubKey: 'formInit',
        activeProcessor: 'json',
        data: {
          fieldMap: {},
          layout: {
            fields: [],
          },
        },
        originalData: {
          fieldMap: {},
          layout: {
            fields: [],
          },
        },
        rule: {
          script: {
            entryFunction: 'formInit',
            fetchScriptContent: true,
          },
        },
        originalRule: {
          script: {
            entryFunction: 'formInit',
            fetchScriptContent: true,
          },
        },
        settingsFormPatchPath: '/settingsForm',
        resourceDocs: {
          parentResource: {},
          resource: null,
        },
      };

      expectSaga(initEditor, { id, editorType: 'settingsForm', options })
        .provide([
          [select(selectors.fieldState, 'new-123', 'settings'), {}],
          [select(selectors.formState, 'new-123'), {fieldMap: {}}],
          [matchers.call.fn(initSampleData), undefined],
          [matchers.call.fn(constructResourceFromFormValues), {}],
        ])
        .run()
        .then(result => {
          const { effects } = result;

          expect(effects.put).toHaveLength(1);
          expect(effects.call).toEqual(expect.arrayContaining([call(initSampleData, { id })]));

          expect(effects.put[0]).toHaveProperty('payload.action.options', expectedOptions);
        });
    });
    test('should correctly update init options with flow grouping sections if editor type is settingsForm and dispatch init complete action', () => {
      const id = 'settings';
      const options = {
        sectionId: 'Cus-1234567',
        resourceId: 'res-123',
        resourceType: 'imports',
        flowId: 'flow-123',
        stage: 'flowInput',
        fieldId: 'settings',
        formKey: 'new-123',
        integrationId: 'intId',
      };
      const integrationAllSections = {
        allSections: [
          {settingsForm: {}, title: 'General', sectionId: 'general'},
          { title: 'Customers', sectionId: 'Cus-1234567', settingsForm: {} },
        ],
      };
      const expectedOptions = {
        editorType: 'settingsForm',
        resourceId: 'res-123',
        resourceType: 'imports',
        flowId: 'flow-123',
        stage: 'flowInput',
        fieldId: 'settings',
        formKey: 'new-123',
        layout: 'jsonFormBuilder',
        integrationId: 'intId',
        sectionId: 'Cus-1234567',
        autoEvaluate: true,
        sampleDataStatus: 'requested',
        insertStubKey: 'formInit',
        activeProcessor: 'json',
        data: {
          fieldMap: {},
          layout: {
            fields: [],
          },
        },
        originalData: {
          fieldMap: {},
          layout: {
            fields: [],
          },
        },
        rule: {
          script: {
            entryFunction: 'formInit',
            fetchScriptContent: true,
          },
        },
        originalRule: {
          script: {
            entryFunction: 'formInit',
            fetchScriptContent: true,
          },
        },
        settingsFormPatchPath: '/flowGroupings/0/settingsForm',
        resourceDocs: {
          parentResource: {},
          resource: null,
        },
        flowGrouping: { title: 'Customers', sectionId: 'Cus-1234567', settingsForm: {} },
      };

      expectSaga(initEditor, { id, editorType: 'settingsForm', options })
        .provide([
          [select(selectors.fieldState, 'new-123', 'settings'), {}],
          [select(selectors.formState, 'new-123'), {fieldMap: {}}],
          [select(selectors.getAllSections, 'integrations', 'intId'), integrationAllSections],
          [matchers.call.fn(initSampleData), undefined],
          [matchers.call.fn(constructResourceFromFormValues), {}],
        ])
        .run()
        .then(result => {
          const { effects } = result;

          expect(effects.put).toHaveLength(1);
          expect(effects.call).toEqual(expect.arrayContaining([call(initSampleData, { id })]));

          expect(effects.put[0]).toHaveProperty('payload.action.options', expectedOptions);
        });
    });
    test('should correctly update init options with resource and license docs if editor type is settingsForm and dispatch init complete action', () => {
      const id = 'settings';
      const options = {
        sectionId: 'Cus-1234567',
        resourceId: 'intId',
        resourceType: 'integrations',
        flowId: 'flow-123',
        stage: 'flowInput',
        fieldId: 'settings',
        formKey: 'new-123',
        integrationId: 'intId',
      };
      const integrationAllSections = {
        allSections: [
          {settingsForm: {}, title: 'General', sectionId: 'general'},
          { title: 'Customers', sectionId: 'Cus-1234567', settingsForm: {} },
        ],
      };
      const expectedData = {
        resource: {
          name: 'Customers',
          _id: 'Cus-1234567',
          settingsForm: {
            form: {
              fieldMap: {},
              layout: {
                fields: [],
              },
            }}},
        parentResource: {
          name: 'Resource name',
          _parentId: 'parentId',

          _connectorId: 'connId',

        },
        grandParentResource: {
          name: 'Parent Resource name',
        },
        license: {
          _integrationId: 'intId',
          name: 'license',
        },
        parentLicense: {},
        sandbox: false,
      };
      const expectedOptions = {
        editorType: 'settingsForm',
        resourceId: 'intId',
        resourceType: 'integrations',
        flowId: 'flow-123',
        stage: 'flowInput',
        fieldId: 'settings',
        formKey: 'new-123',
        layout: 'scriptFormBuilder',
        integrationId: 'intId',
        sectionId: 'Cus-1234567',
        autoEvaluate: true,
        sampleDataStatus: 'requested',
        insertStubKey: 'formInit',
        activeProcessor: 'script',
        data: JSON.stringify(expectedData, null, 2),
        originalData: JSON.stringify(expectedData, null, 2),
        rule: {
          script: {
            entryFunction: 'formInit',
            fetchScriptContent: true,
            scriptId: '888',
          },
        },
        originalRule: {
          script: {
            entryFunction: 'formInit',
            fetchScriptContent: true,
            scriptId: '888',
          },
        },
        settingsFormPatchPath: '/flowGroupings/0/settingsForm',
        resourceDocs: {
          license: {
            _integrationId: 'intId',
            name: 'license',
          },
          parentResource: {
            name: 'Parent Resource name',
          },
          resource: {
            _connectorId: 'connId',
            _parentId: 'parentId',
            name: 'Resource name',
          },
        },
        flowGrouping: { title: 'Customers', sectionId: 'Cus-1234567', settingsForm: {} },
      };

      expectSaga(initEditor, { id, editorType: 'settingsForm', options })
        .provide([
          [select(selectors.fieldState, 'new-123', 'settings'), {}],
          [select(selectors.formState, 'new-123'), {fieldMap: {}}],
          [select(selectors.getSectionMetadata, 'integrations', 'intId', 'Cus-1234567'), {settingsForm: {init: {_scriptId: '888'}}}],
          [select(selectors.getAllSections, 'integrations', 'intId'), integrationAllSections],
          [matchers.call.fn(initSampleData), undefined],
          [select(selectors.resource, 'integrations', 'intId'), {name: 'Resource name', _parentId: 'parentId', _connectorId: 'connId'}],

          [matchers.call.fn(constructResourceFromFormValues), {name: 'Resource name', _parentId: 'parentId', _connectorId: 'connId'}],
          [select(selectors.resource, 'integrations', 'parentId'), {name: 'Parent Resource name'}],
          [select(selectors.licenses), [{_integrationId: 'intId', name: 'license'}]],
        ])
        .run()
        .then(result => {
          const { effects } = result;

          expect(effects.put).toHaveLength(1);
          expect(effects.call).toEqual(expect.arrayContaining([call(initSampleData, { id })]));

          expect(effects.put[0]).toHaveProperty('payload.action.options', expectedOptions);
        });
    });
    test('should correctly update init options if editor type is structuredFileGenerator/structuredFileParser and dispatch init complete action', () => {
      const id = 'filefiledefinition';
      const options = {
        resourceId: 'res-123',
        resourceType: 'imports',
        flowId: 'flow-123',
        stage: 'flowInput',
        rule: '{{query}}',
        fieldId: 'file.filedefinition',
        formKey: 'new-123',
      };
      const expectedOptions = {
        editorType: 'structuredFileParser',
        resourceId: 'res-123',
        resourceType: 'imports',
        flowId: 'flow-123',
        stage: 'flowInput',
        fieldId: 'file.filedefinition',
        formKey: 'new-123',
        layout: 'compact',
        autoEvaluate: true,
        data: 'some data',
        originalData: 'some data',
        rule: 'some rule',
        originalRule: 'some rule',
        sampleDataStatus: 'requested',
        groupByFields: [],
        sortByFields: [],
      };

      expectSaga(initEditor, { id, editorType: 'structuredFileParser', options })
        .provide([
          [select(selectors.fieldState, 'new-123', 'query'), {}],
          [select(selectors.formState, 'new-123'), {fieldMap: {}}],
          [matchers.call.fn(initSampleData), undefined],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [select(selectors.fieldState, 'new-123', 'file.filedefinition'), {}],
          [select(selectors.formState, 'new-123'), {fieldMap: {}}],
          [matchers.select.selector(selectors.fileDefinitionSampleData), {sampleData: 'some data', rule: 'some rule'}],
        ])
        .run()
        .then(result => {
          const { effects } = result;

          expect(effects.put).toHaveLength(1);
          expect(effects.call).toEqual(expect.arrayContaining([call(initSampleData, { id })]));

          expect(effects.put[0]).toHaveProperty('payload.action.options', expectedOptions);
        });
    });
    test('should correctly update init options with context if editor type is javascript and dispatch init complete action', () => {
      const id = 'preMapscript';
      const options = {
        resourceId: 'res-123',
        resourceType: 'imports',
        flowId: 'flow-123',
        stage: 'preMap',
        rule: {},
      };
      const expectedOptions = {
        editorType: 'javascript',
        autoEvaluate: false,
        layout: 'compact',
        resourceId: 'res-123',
        resourceType: 'imports',
        flowId: 'flow-123',
        stage: 'preMap',
        rule: {
          entryFunction: 'preMap',
          fetchScriptContent: true,
        },
        originalRule: {
          entryFunction: 'preMap',
          fetchScriptContent: true,
        },
        insertStubKey: 'preMap',
        sampleDataStatus: 'requested',
        context: { context: 'hook' },
        fieldId: '',
      };

      expectSaga(initEditor, { id, editorType: 'javascript', options })
        .provide([
          [matchers.call.fn(initSampleData), undefined],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [select(selectors.getScriptContext, {
            flowId: 'flow-123',
            contextType: 'hook',
            resourceType: options.resourceType,
            resourceId: options.resourceId,
          }), {context: 'hook'}],
        ])
        .run()
        .then(result => {
          const { effects } = result;

          expect(effects.put).toHaveLength(1);
          expect(effects.call).toEqual(expect.arrayContaining([call(initSampleData, { id })]));

          expect(effects.put[0]).toHaveProperty('payload.action.options', expectedOptions);
        });
    });
  });
  describe('toggleEditorVersion saga', () => {
    test('should not dispatch data received action if editor data does not exist', () => expectSaga(toggleEditorVersion, { id: editorId, version: 2 })
      .provide([
        [call(requestEditorSampleData, {id: editorId, requestedTemplateVersion: 2}), undefined],
      ])
      .call(requestEditorSampleData, {id: editorId, requestedTemplateVersion: 2})
      .not.put(actions.editor.sampleDataReceived(editorId, '{"name": "Bob"}', 2))
      .run());
    test('should call requestEditorSampleData and dispatch data received action', () => expectSaga(toggleEditorVersion, { id: editorId, version: 2 })
      .provide([
        [call(requestEditorSampleData, {id: editorId, requestedTemplateVersion: 2}), {data: '{"name": "Bob"}', templateVersion: 2}],
      ])
      .call(requestEditorSampleData, {id: editorId, requestedTemplateVersion: 2})
      .put(actions.editor.sampleDataReceived(editorId, '{"name": "Bob"}', 2))
      .run());
  });
});

describe('editor utils', () => {
  describe('extractResourcePath util', () => {
    test('should return initialResourcePath if no value is passed', () => {
      expect(extractResourcePath(null, '/initial')).toBe('/initial');
    });
    test('should return the resourcePath present inside value if passed', () => {
      const value = {
        id: 'file.csv',
        disabled: false,
        resourcePath: '/path',
      };

      expect(extractResourcePath(value, '/initial')).toBe('/path');
      expect(extractResourcePath({}, '/initial')).toBeUndefined();
    });
  });
});

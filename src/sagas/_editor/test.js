/* global describe, test, beforeEach, expect, jest */

import { advanceTo, clear } from 'jest-date-mock';
import { select, call, put } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../../actions';
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
} from '.';
import { requestExportSampleData } from '../sampleData/exports';
import { requestSampleData } from '../sampleData/flows';
import { apiCallWithRetry } from '../index';
import { APIException } from '../api';
import processorLogic from '../../reducers/session/_editors/processorLogic';

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

      return expectSaga(invokeProcessor, { editorId, processor: 'handlebars', body })
        .provide([
          [matchers.call.fn(apiCallWithRetry), undefined],
          [select(selectors.userTimezone), 'Asia/Calcutta'],
          [select(selectors._editor, editorId), editorState],
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
        defaultData: JSON.stringify({data: {
          id: {
            default: '',
          },
          name: {
            default: 'default name',
          },
        }}, null, 2),
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

      return expectSaga(invokeProcessor, { editorId, processor: 'handlebars', body })
        .provide([
          [matchers.call.fn(apiCallWithRetry), undefined],
          [select(selectors.userTimezone), null],
          [select(selectors._editor, editorId), editorState],
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
    test('should make api call with passed arguments', () => {
      const body = 'somebody';

      return expectSaga(invokeProcessor, { processor: 'transform', body })
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
        [select(selectors._editor, editorId), undefined],
      ])
      .returns(undefined)
      .run());
    test('should dispatch validation failure action when editor has validation errors.', () => {
      const editor = {
        id: editorId,
        editorType: 'handlebars',
        formKey: 'new-123',
      };

      return expectSaga(requestPreview, { id: editorId})
        .provide([
          [select(selectors._editor, editorId), editor],
        ])
        .put(actions._editor.validateFailure(editorId, {dataError: 'Must provide some sample data.'}))
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

      return expectSaga(requestPreview, { id: editorId})
        .provide([
          [select(selectors._editor, editorId), editor],
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

      return expectSaga(requestPreview, { id: editorId})
        .provide([
          [select(selectors._editor, editorId), editor],
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
        .put(actions._editor.previewFailed(editorId, {errorMessage: ['Message: invalid processor'], errorLine: undefined }))
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

      return expectSaga(requestPreview, { id: editorId})
        .provide([
          [select(selectors._editor, editorId), editor],
          [call(invokeProcessor, {
            editorId,
            processor: 'handlebars',
            body: {
              rules: { strict: false, template: '{{id}}' },
              data: {id: '999'},
            } }), '999'],
        ])
        .not.put(actions._editor.previewFailed(editorId))
        .put(actions._editor.previewResponse(editorId, '999'))
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

      return expectSaga(evaluateExternalProcessor, {processorData})
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

      return expectSaga(evaluateExternalProcessor, {processorData})
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

      return expectSaga(evaluateExternalProcessor, {processorData})
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
        .provide([[select(selectors._editor, editorId), undefined]])
        .returns(undefined)
        .run();

      expect(effects.call).toBeUndefined();
      expect(effects.put).toBeUndefined();
    });
    test('should call requestPreview when previewOnSave is true and dispatch save failed action in case preview fails', () => {
      const editor = { editorType: 'settingsForm', previewOnSave: true };

      return expectSaga(save, { id: editorId })
        .provide([
          [select(selectors._editor, editorId), editor],
          [matchers.call.fn(requestPreview), { error: 'some error' }],
        ])
        .call.fn(requestPreview)
        .put(actions._editor.saveFailed(editorId))
        .run();
    });
    test('should not call requestPreview when previewOnSave is false', () => expectSaga(save, { id: editorId })
      .provide([
        [select(selectors._editor, editorId), editor],
      ])
      .not.call.fn(requestPreview)
      .run());

    test('should dispatch save failed action when preSaveValidate returned error', () => {
      editor.onSave = () => {};
      const preSaveValidate = () => ({saveError: true, message: 'save failed error'});

      processorLogic.preSaveValidate = jest.fn().mockImplementationOnce(() => preSaveValidate);

      return expectSaga(save, { id: editorId })
        .provide([
          [select(selectors._editor, editorId), editor],
        ])
        .put(actions._editor.saveFailed(editorId, 'save failed error'))
        .run();
    });
    test('should call onSave handler when present in editor state and dispatch save complete action after foreground patches are run', async () => {
      editor.onSave = jest.fn().mockImplementationOnce(() => 'does some on save');
      processorLogic.getPatchSet = jest.fn().mockImplementationOnce(() => patches);

      const { effects } = await expectSaga(save, { id: editorId })
        .provide([
          [select(selectors._editor, editorId), editor],
          [matchers.call.fn(commitStagedChanges), undefined],
        ])
        .not.put(actions._editor.saveFailed(editorId))
        .run();

      expect(editor.onSave.mock.calls.length).toBe(1);

      // since there are 3 foreground patches, total call to commitStagedChanges would be 3
      expect(effects.call).toHaveLength(3);
      expect(effects.put).toHaveLength(6);
      // 4th action would be editor savecomplete, after first 3 for foreground patchStaged
      expect(effects.put[3]).toEqual(put(actions._editor.saveComplete(editorId)));
    });
    test('should dispatch save failed action if no patch sets are given and onSave handler is also undefined', () => {
      processorLogic.getPatchSet = jest.fn().mockImplementationOnce(() => null);

      return expectSaga(save, { id: editorId })
        .provide([
          [select(selectors._editor, editorId), editor],
        ])
        .put(actions._editor.saveFailed(editorId))
        .run();
    }
    );

    test('should dispatch save complete action if no foreground patch exists', async () => {
      delete patches.foregroundPatches;
      processorLogic.getPatchSet = jest.fn().mockImplementationOnce(() => patches);

      const { effects } = await expectSaga(save, { id: editorId })
        .provide([
          [select(selectors._editor, editorId), editor],
        ])
        .not.call.fn(commitStagedChanges)
        .put(actions._editor.saveComplete(editorId))
        .run();

      expect(effects.call).toBeUndefined();
    });

    test('should not dispatch save complete action if ANY foregound patch fails', async () => {
      processorLogic.getPatchSet = jest.fn().mockImplementationOnce(() => patches);
      const { effects } = await expectSaga(save, { id: editorId })
        .provide([
          [select(selectors._editor, editorId), editor],
          [
            matchers.call(commitStagedChanges, {
              resourceType: 'imports',
              id: '999',
              scope: 'value',
              context: undefined,
            }),
            undefined,
          ],
          [
            call(commitStagedChanges, {
              resourceType: 'scripts',
              id: '777',
              scope: 'value',
              context: undefined,
            }),
            { error: 'some error' },
          ],
        ])
        .put(actions._editor.saveFailed(editorId))
        .not.put(actions._editor.saveComplete(editorId))
        .run();

      // 2nd call for 'scripts' patch will fail, hence the 3rd commit call should not happen
      expect(effects.call).toHaveLength(2);
    });

    test('should dispatch save complete action only if ALL foregound patches succeed', async () => {
      processorLogic.getPatchSet = jest.fn().mockImplementationOnce(() => patches);
      const { effects } = await expectSaga(save, { id: editorId })
        .provide([
          [select(selectors._editor, editorId), editor],
          [matchers.call.fn(commitStagedChanges), undefined],
        ])
        .not.put(actions._editor.saveFailed(editorId))
        .run();

      // since there are 3 foreground patches, total call to commitStagedChanges would be 3
      expect(effects.call).toHaveLength(3);
      expect(effects.put).toHaveLength(6);
      // 4th action would be editor savecomplete, after first 3 for foreground patchStaged
      expect(effects.put[3]).toEqual(put(actions._editor.saveComplete(editorId)));
    });

    test('should not dispatch save failed action even if background patches fail', async () => {
      processorLogic.getPatchSet = jest.fn().mockImplementationOnce(() => patches);
      const { effects } = await expectSaga(save, { id: editorId })
        .provide([
          [select(selectors._editor, editorId), editor],
          [matchers.call.fn(commitStagedChanges), undefined],
          [
            call(commitStagedChanges, {
              resourceType: 'connections',
              id: '111',
              scope: 'value',
            }),
            { error: 'some error' },
          ],
        ])
        .not.put(actions._editor.saveFailed(editorId))
        .run();

      // since there are 3 foreground patches, total call to commitStagedChanges would be 3
      expect(effects.call).toHaveLength(3);

      // Note: if any effects' assertion(non-negated) is done while calling expectSaga API, then the returned Promise
      // contains that many less count of the effects
      // for eg, if we also add assertion in expectSaga like .put(actions.editor.saveComplete(id)), then effects.put
      // will have a length of 5, not 6 as we have already asserted one action
      expect(effects.put).toHaveLength(6);
      expect(effects.put[5]).toEqual(
        put(actions.resource.commitStaged('connections', '111', 'value'))
      );
    });
  });
  describe('autoEvaluateProcessor saga', () => {
    test('should do nothing if no editor exists with given id', () => expectSaga(autoEvaluateProcessor, { id: editorId})
      .provide([
        [select(selectors._editor, editorId), undefined],
      ])
      .not.call(requestPreview, { id: editorId })
      .returns(undefined)
      .run());

    test('should do nothing if editor exists but auto evaluate is off.', () => expectSaga(autoEvaluateProcessor, { id: editorId})
      .provide([
        [select(selectors._editor, editorId), {autoEvaluate: false}],
      ])
      .not.call(requestPreview, { id: editorId })
      .returns(undefined)
      .run());
    test('should add delay of 500ms and then call requestPreview', () => {
      const editor = {
        id: editorId,
        editorType: 'handlebars',
        formKey: 'new-123',
        autoEvaluate: true,
      };

      return expectSaga(autoEvaluateProcessor, { id: editorId})
        .provide([
          [select(selectors._editor, editorId), editor],
        ])
        .delay(500)
        .call(requestPreview, { id: editorId })
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

      return expectSaga(refreshHelperFunctions)
        .not.call.fn(getResource)
        .put(actions._editor.updateHelperFunctions(mockHelperFunctions))
        .run();
    });
    test('should create a new helperFunction instance when there isn\'t any in the local storage ', () => {
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
        .put(actions._editor.updateHelperFunctions(['add', 'uri']))
        .run();

      expect(localStorage.setItem).toBeCalledWith(
        'helperFunctions',
        JSON.stringify({
          updateTime: someDateEpoch,
          helperFunctions: mockHelperResp.handlebars.helperFunctions,
        })
      );
    });

    test('should check the updateTime in the localStorage for the helper Function to detemine if the helperFunctions need to be updated, lets consider the scenario where the update interval is larger ', () => {
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

      return expectSaga(refreshHelperFunctions)
        .not.call.fn(getResource)
        .put(actions._editor.updateHelperFunctions(mockHelperFunctions))
        .run();
    });

    test('should check the updateTime in the localStorage for the helper Function to determine if the helperFunctions need to be updated, lets consider the scenario where the update interval is smaller ', () => {
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
        .put(actions._editor.updateHelperFunctions(['add', 'abs']))
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

      return expectSaga(refreshHelperFunctions)
        .provide([
          [call(getResource, {
            resourceType: 'processors',
            message: 'Getting Helper functions',
          }), undefined],
        ])
        .not.put(actions._editor.updateHelperFunctions(['add', 'abs']))
        .run();
    });
  });
  describe('requestEditorSampleData saga', () => {
    const resourceId = 'res-123';
    const flowId = 'flow-123';

    test('should do nothing if editor does not exist', () => expectSaga(requestEditorSampleData, { id: editorId })
      .provide([
        [select(selectors._editor, editorId), undefined],
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

      return expectSaga(requestEditorSampleData, { id: 'script' })
        .provide([
          [select(selectors._editor, 'script'), editor],
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

      return expectSaga(requestEditorSampleData, { id: 'as2content' })
        .provide([
          [select(selectors._editor, 'as2content'), editor],
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

      return expectSaga(requestEditorSampleData, { id: 'filexml' })
        .provide([
          [select(selectors._editor, 'filexml'), editor],
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

      return expectSaga(requestEditorSampleData, { id: 'filefiledefinition' })
        .provide([
          [select(selectors._editor, 'filefiledefinition'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
        ])
        .returns({})
        .run();
    });
    test('should call requestExportSampleData and get preview stage data for dataURITemplate field', () => {
      const editor = {
        id: 'dataURITemplate',
        editorType: 'handlebars',
        flowId,
        resourceType: 'exports',
        resourceId,
        fieldId: 'dataURITemplate',
        formKey: 'new-123',
      };

      return expectSaga(requestEditorSampleData, { id: 'dataURITemplate' })
        .provide([
          [select(selectors._editor, 'dataURITemplate'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(requestExportSampleData)],
          [matchers.call.fn(requestSampleData), {}],
          [matchers.call.fn(apiCallWithRetry), {}],
        ])
        .call(requestExportSampleData, { resourceId, resourceType: 'exports', values: undefined })
        .returns({data: undefined, templateVersion: undefined})
        .run();
    });
    test('should call requestExportSampleData and get preview stage data for traceKeyTemplate field', () => {
      const editor = {
        id: 'traceKeyTemplate',
        editorType: 'handlebars',
        flowId,
        resourceType: 'exports',
        resourceId,
        fieldId: 'traceKeyTemplate',
        formKey: 'new-123',
      };

      return expectSaga(requestEditorSampleData, { id: 'traceKeyTemplate' })
        .provide([
          [select(selectors._editor, 'traceKeyTemplate'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(requestExportSampleData)],
          [matchers.call.fn(requestSampleData), {}],
          [matchers.call.fn(apiCallWithRetry), {}],
        ])
        .call(requestExportSampleData, { resourceId, resourceType: 'exports', values: undefined })
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

      return expectSaga(requestEditorSampleData, { id: 'tx-123' })
        .provide([
          [select(selectors._editor, 'tx-123'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(requestSampleData), {}],
          [matchers.call.fn(apiCallWithRetry), {}],
        ])
        .call(requestSampleData, {flowId, resourceId, resourceType: 'imports', stage: 'transform'})
        .returns({data: undefined, templateVersion: undefined})
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

      return expectSaga(requestEditorSampleData, { id: 'tx-123' })
        .provide([
          [select(selectors._editor, 'tx-123'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(requestSampleData), {}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: false}],
        ])
        .call(requestSampleData, {flowId, resourceId, resourceType: 'imports', stage: 'transform'})
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

      return expectSaga(requestEditorSampleData, { id: 'eFilter' })
        .provide([
          [select(selectors._editor, 'eFilter'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(requestSampleData), {}],
          [matchers.call.fn(apiCallWithRetry), throwError(new APIException({
            status: 401,
            message: '{"message":"invalid processor", "code":"code"}',
          }))],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true, sampleData: {name: 'Bob'}}],
        ])
        .call(requestSampleData, {flowId, resourceId, resourceType: 'exports', stage: 'exportFilter'})
        .call.fn(apiCallWithRetry)
        .put(actions._editor.sampleDataFailed('eFilter', '{"message":"invalid processor", "code":"code"}'))
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

      return expectSaga(requestEditorSampleData, { id: 'eFilter' })
        .provide([
          [select(selectors._editor, 'eFilter'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(requestSampleData), {}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true, sampleData: {name: 'Bob'}}],
          [matchers.call.fn(apiCallWithRetry), {context: {record: {name: 'Bob'}}, templateVersion: 2}],
        ])
        .call(requestSampleData, {flowId, resourceId, resourceType: 'exports', stage: 'exportFilter'})
        .call.fn(apiCallWithRetry)
        .not.put(actions._editor.sampleDataFailed('eFilter', '{"message":"invalid processor", "code":"code"}'))
        .returns({ data: { record: { name: 'Bob' } }, templateVersion: 2 })
        .run();
    });
    test('should make /getContext api call call with flow and integration id', () => {
      const editor = {
        id: 'eFilter',
        editorType: 'exportFilter',
        flowId,
        resourceType: 'exports',
        resourceId,
        stage: 'exportFilter',
      };

      return expectSaga(requestEditorSampleData, { id: 'eFilter' })
        .provide([
          [select(selectors._editor, 'eFilter'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.select.selector(selectors.getSampleDataContext), {data: {id: 999}}],
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
              export: {},
              fieldPath: 'filter',
            },
          },
          message: 'Loading',
          hidden: false,
        })
        .not.put(actions._editor.sampleDataFailed('eFilter', '{"message":"invalid processor", "code":"code"}'))
        .returns({ data: { record: {id: 999}}, templateVersion: 2 })
        .run();
    });
    test('should not call sampleDataWrapper selector for csv generator and filters stage and return data as is', () => {
      const editor = {
        id: 'filecsv',
        editorType: 'csvGenerator',
        flowId,
        resourceType: 'imports',
        resourceId,
        stage: 'flowInput',
        formKey: 'new-123',
        fieldId: 'file.csv',
      };

      return expectSaga(requestEditorSampleData, { id: 'filecsv' })
        .provide([
          [select(selectors._editor, 'filecsv'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(requestSampleData), {}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: true, sampleData: {name: 'Bob'}}],
          [matchers.call.fn(apiCallWithRetry), {context: {record: {name: 'Bob'}}, templateVersion: 2}],
        ])
        .call(requestSampleData, {flowId, resourceId, resourceType: 'imports', stage: 'flowInput'})
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

      return expectSaga(requestEditorSampleData, { id: 'salesforceid' })
        .provide([
          [select(selectors._editor, 'salesforceid'), editor],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [matchers.call.fn(requestSampleData), {}],
          [matchers.select.selector(selectors.shouldGetContextFromBE), {shouldGetContextFromBE: false, sampleData: {name: 'Bob'}}],
        ])
        .call(requestSampleData, {flowId, resourceId, resourceType: 'imports', stage: 'importMappingExtract'})
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

      return expectSaga(requestEditorSampleData, { id: 'tx-123' })
        .provide([
          [select(selectors._editor, 'tx-123'), editor],
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
  });
  describe('initSampleData saga', () => {
    test('should do nothing if editor does not exist', () => expectSaga(initSampleData, { id: editorId })
      .provide([
        [select(selectors._editor, editorId), undefined],
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

      return expectSaga(initSampleData, { id: editorId })
        .provide([
          [select(selectors._editor, editorId), editor],
          [call(refreshHelperFunctions), undefined],
        ])
        .not.call.fn(requestEditorSampleData)
        .put(actions._editor.sampleDataReceived(editorId, '{"id": "999"}')
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

      return expectSaga(initSampleData, { id: editorId })
        .provide([
          [select(selectors._editor, editorId), editor],
          [call(requestEditorSampleData, {id: editorId}), {data: '{"id": "999"}', templateVersion: 2}],
          [call(refreshHelperFunctions), undefined],
        ])
        .call(requestEditorSampleData, {id: editorId})
        .put(actions._editor.sampleDataReceived(editorId, '{"id": "999"}', 2)
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

      return expectSaga(initSampleData, { id: editorId })
        .provide([
          [select(selectors._editor, editorId), editor],
          [call(requestEditorSampleData, {id: editorId}), {data: '{"id": "999"}', templateVersion: 2}],
          [call(refreshHelperFunctions), undefined],
        ])
        .call(requestEditorSampleData, {id: editorId})
        .put(actions._editor.sampleDataReceived(editorId, '{"id": "999"}', 2)
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

      return expectSaga(initEditor, { id: editorId, editorType: 'filter', options })
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
        },
        originalRule: {
          multipleRowsPerRecord: false,
          trimSpaces: true,
        },
      };

      return expectSaga(initEditor, { id, editorType: 'csvParser', options })
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

      return expectSaga(initEditor, { id, editorType: 'sql', options })
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
        previewOnSave: true,
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
            entryFunction: 'main',
            fetchScriptContent: true,
          },
        },
        originalRule: {
          script: {
            entryFunction: 'main',
            fetchScriptContent: true,
          },
        },
        settingsFormPatchPath: '/settingsForm',
        resourceDocs: {
          parentResource: {},
          resource: null,
        },
      };

      return expectSaga(initEditor, { id, editorType: 'settingsForm', options })
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
        previewOnSave: true,
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
            entryFunction: 'main',
            fetchScriptContent: true,
          },
        },
        originalRule: {
          script: {
            entryFunction: 'main',
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

      return expectSaga(initEditor, { id, editorType: 'settingsForm', options })
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
        previewOnSave: true,
        sampleDataStatus: 'requested',
        insertStubKey: 'formInit',
        activeProcessor: 'script',
        data: JSON.stringify(expectedData, null, 2),
        originalData: {
          fieldMap: {},
          layout: {
            fields: [],
          },
        },
        rule: {
          script: {
            entryFunction: 'main',
            fetchScriptContent: true,
            scriptId: '888',
          },
        },
        originalRule: {
          script: {
            entryFunction: 'main',
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

      return expectSaga(initEditor, { id, editorType: 'settingsForm', options })
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
      };

      return expectSaga(initEditor, { id, editorType: 'structuredFileParser', options })
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

      return expectSaga(initEditor, { id, editorType: 'javascript', options })
        .provide([
          [matchers.call.fn(initSampleData), undefined],
          [matchers.call.fn(constructResourceFromFormValues), {}],
          [select(selectors.getScriptContext, {flowId: 'flow-123', contextType: 'hook'}), {context: 'hook'}],
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
      .not.put(actions._editor.sampleDataReceived(editorId, '{"name": "Bob"}', 2))
      .run());
    test('should call requestEditorSampleData and dispatch data received action', () => expectSaga(toggleEditorVersion, { id: editorId, version: 2 })
      .provide([
        [call(requestEditorSampleData, {id: editorId, requestedTemplateVersion: 2}), {data: '{"name": "Bob"}', templateVersion: 2}],
      ])
      .call(requestEditorSampleData, {id: editorId, requestedTemplateVersion: 2})
      .put(actions._editor.sampleDataReceived(editorId, '{"name": "Bob"}', 2))
      .run());
  });
});

describe('editor utils', () => {
  describe('extractResourcePath util', () => {
    test('should return initialResourcePath if no value is passed', () => {
      expect(extractResourcePath(null, '/initial')).toEqual('/initial');
    });
    test('should return the resourcePath present inside value if passed', () => {
      const value = {
        id: 'file.csv',
        disabled: false,
        resourcePath: '/path',
      };

      expect(extractResourcePath(value, '/initial')).toEqual('/path');
      expect(extractResourcePath({}, '/initial')).toBeUndefined();
    });
  });
});

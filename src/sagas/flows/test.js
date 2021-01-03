/* global describe, test, expect */
import { call, select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import { selectors } from '../../reducers/index';
import { JOB_TYPES, JOB_STATUS, EMPTY_RAW_DATA } from '../../utils/constants';
import { run, runDataLoader, getLastExportDateTime } from '.';
import { uploadRawData } from '../uploadFile';
import { fileTypeToApplicationTypeMap } from '../../utils/file';
import { SCOPES } from '../resourceForm';

describe('run saga', () => {
  const flowId = 'f1';
  const flowResource = { _id: flowId, _integrationId: 'i1' };

  test('should call latestFlowJobs on successful api call in case of EM 2.0 ', () => {
    const response = { _jobId: 'j1', something: 'some thing' };

    return expectSaga(run, { flowId })
      .provide([
        [matchers.call.fn(apiCallWithRetry), response],
        [select(selectors.isOwnerUserInErrMgtTwoDotZero), true],
        [select(selectors.resource, 'flows', flowId), flowResource],
      ])
      .put(actions.flow.runRequested(flowId))
      .call.fn(apiCallWithRetry)
      .put(actions.errorManager.latestFlowJobs.request({ flowId }))
      .run();
  });

  test('should update job with received response on successful api call ', () => {
    const response = { _jobId: 'j1', something: 'some thing' };

    return expectSaga(run, { flowId })
      .provide([
        [matchers.call.fn(apiCallWithRetry), response],
        [select(selectors.isOwnerUserInErrMgtTwoDotZero), false],
        [select(selectors.resource, 'flows', flowId), flowResource],
      ])
      .put(actions.flow.runRequested(flowId))
      .call.fn(apiCallWithRetry)
      .put(
        actions.job.receivedFamily({
          job: {
            ...response,
            _id: response._jobId,
            _flowId: flowId,
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.QUEUED,
            _integrationId: 'i1',
          },
        })
      )
      .put(actions.job.requestInProgressJobStatus())
      .run();
  });

  test('should handle api error properly', () => {
    const saga = run({ flowId });

    saga.next();
    expect(saga.next(flowResource).value).toEqual(
      select(selectors.resource, 'flows', flowId)
    );

    const { path, opts } = getRequestOptions(actionTypes.FLOW.RUN, {
      resourceId: flowId,
    });

    expect(saga.next(flowResource).value).toEqual(
      call(apiCallWithRetry, { path, opts })
    );
    expect(saga.throw(new Error()).value).toEqual(true);
    expect(saga.next().done).toEqual(true);
  });
});

describe('runDataLoader saga', () => {
  test('should do nothing incase of invalid flowId/ flow with no page generators', () => {
    const test1 = expectSaga(runDataLoader, { flowId: 'INVALID_FLOW_ID' })
      .provide([
        [select(selectors.resource, 'flows', 'INVALID_FLOW_ID'), null],
      ])
      .not.call.fn(uploadRawData)
      .not.call.fn(run)
      .run();
    const flow = {
      _id: 'flow-123',
      pageGenerators: [],
      pageProcessors: [{ type: 'import', _importId: 'import-123'}],
    };
    const test2 = expectSaga(runDataLoader, { flowId: 'flow-123' })
      .provide([
        [select(selectors.resource, 'flows', 'flow-123'), flow],
      ])
      .not.call.fn(uploadRawData)
      .not.call.fn(run)
      .run();

    return test1 && test2;
  });
  test('should do nothing if the PG is not a Data loader type', () => {
    const flowId = 'flow-123';
    const flow = {
      _id: flowId,
      pageGenerators: [{ _exportId: 'export-123'}],
      pageProcessors: [{ type: 'import', _importId: 'import-123'}],
    };
    const restExport = {
      _id: 'export-123',
      adaptorType: 'RESTExport',
      name: 'test',
    };

    return expectSaga(runDataLoader, { flowId })
      .provide([
        [select(selectors.resource, 'flows', flowId), flow],
        [select(selectors.resource, 'exports', 'export-123'), restExport],
      ])
      .not.call.fn(uploadRawData)
      .not.call.fn(run)
      .run();
  });
  test('should do nothing if there is no file content and also no rawData to run the flow', () => {
    const flowId = 'flow-123';
    const flow = {
      _id: flowId,
      pageGenerators: [{ _exportId: 'export-123'}],
      pageProcessors: [{ type: 'import', _importId: 'import-123'}],
    };
    const dlExport = {
      _id: 'export-123',
      type: 'simple',
      name: 'test',
    };
    const options = {
      isDataLoader: true,
      runKey: undefined,
    };

    return expectSaga(runDataLoader, { flowId, fileContent: undefined })
      .provide([
        [select(selectors.resource, 'flows', flowId), flow],
        [select(selectors.resource, 'exports', 'export-123'), dlExport],
      ])
      .not.call.fn(uploadRawData)
      .not.call.fn(run)
      .not.put(actions.flow.run({ flowId, options }))
      .run();
  });
  test('should uploadRawData with file content and dispatch run action with received runKey', () => {
    const flowId = 'flow-123';
    const flow = {
      _id: flowId,
      pageGenerators: [{ _exportId: 'export-123'}],
      pageProcessors: [{ type: 'import', _importId: 'import-123'}],
    };
    const fileContent = `CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM
    C1000010839|Sato|12S000357CS
    C1000010839|Unitech|1400-900035G`;

    const dlExport = {
      _id: 'export-123',
      type: 'simple',
      name: 'test',
      file: {
        type: 'csv',
      },
    };
    const runKey = 'run1234';
    const options = {
      isDataLoader: true,
      runKey,
    };

    return expectSaga(runDataLoader, { flowId, fileContent, fileType: 'csv', fileName: 'test.csv' })
      .provide([
        [select(selectors.resource, 'flows', flowId), flow],
        [select(selectors.resource, 'exports', 'export-123'), dlExport],
        [call(uploadRawData, {
          file: fileContent,
          fileName: 'test.csv',
          fileType: fileTypeToApplicationTypeMap.csv,
        }), runKey],
      ])
      .call.fn(uploadRawData)
      .put(actions.flow.run({ flowId, options }))
      .run();
  });
  test('should uploadRawData with stringified file content incase of json file type and dispatch run action with received runKey', () => {
    const flowId = 'flow-123';
    const flow = {
      _id: flowId,
      pageGenerators: [{ _exportId: 'export-123'}],
      pageProcessors: [{ type: 'import', _importId: 'import-123'}],
    };
    const fileContent = { test: 5 };
    const dlExport = {
      _id: 'export-123',
      type: 'simple',
      name: 'test',
      file: {
        type: 'json',
      },
    };
    const runKey = 'run1234';
    const options = {
      isDataLoader: true,
      runKey,
    };

    return expectSaga(runDataLoader, { flowId, fileContent, fileType: 'json', fileName: 'test.json' })
      .provide([
        [select(selectors.resource, 'flows', flowId), flow],
        [select(selectors.resource, 'exports', 'export-123'), dlExport],
        [call(uploadRawData, {
          file: JSON.stringify(fileContent),
          fileName: 'test.json',
          fileType: fileTypeToApplicationTypeMap.json,
        }), runKey],
      ])
      .call.fn(uploadRawData)
      .put(actions.flow.run({ flowId, options }))
      .run();
  });
  test('should call run saga with rawData key and then remove rawData from the Data loader export', () => {
    const flowId = 'flow-123';
    const _exportId = 'export-123';
    const flow = {
      _id: flowId,
      pageGenerators: [{ _exportId }],
      pageProcessors: [{ type: 'import', _importId: 'import-123'}],
    };
    const rawData = 'rawData1234';
    const dlExport = {
      _id: _exportId,
      type: 'simple',
      name: 'test',
      file: {
        type: 'json',
      },
      rawData,
    };
    const options = {
      isDataLoader: true,
      runKey: rawData,
    };
    const patchSet = [
      {
        op: 'replace',
        path: '/rawData',
        value: EMPTY_RAW_DATA,
      },
    ];

    return expectSaga(runDataLoader, { flowId, fileType: 'json', fileName: 'test.json' })
      .provide([
        [select(selectors.resource, 'flows', flowId), flow],
        [select(selectors.resource, 'exports', 'export-123'), dlExport],
      ])
      .call(run, { flowId, options })
      .put(actions.resource.patchStaged(_exportId, patchSet, SCOPES.VALUE))
      .put(actions.resource.commitStaged('exports', _exportId, SCOPES.VALUE))
      .run();
  });
});

describe('getLastExportDateTime saga', () => {
  test('should invoke lastExportDateTime Api and dispatch receivedLastExportDateTime with the response on success', () => {
    const flowId = 'flow-123';
    const response = {
      lastExportDateTime: 'lastExportDateTime',
    };

    return expectSaga(getLastExportDateTime, { flowId })
      .provide([
        [call(apiCallWithRetry, {
          path: `/flows/${flowId}/lastExportDateTime`,
          opts: {
            method: 'GET',
          },
        }), response],
      ])
      .put(actions.flow.receivedLastExportDateTime(flowId, response))
      .run();
  });
  test('should invoke lastExportDateTime Api and dispatch apiFailure action with error and receivedLastExportDateTime without response ', () => {
    const flowId = 'flow-123';
    const error = {
      message: 'error occurred',
    };
    const path = `/flows/${flowId}/lastExportDateTime`;

    return expectSaga(getLastExportDateTime, { flowId })
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts: {
            method: 'GET',
          },
        }), throwError(error)],
      ])
      .put(actions.api.failure(path, 'GET', error?.message, false))
      .put(actions.flow.receivedLastExportDateTime(flowId, undefined))
      .run();
  });
});


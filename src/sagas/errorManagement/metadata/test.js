/* global expect,describe, test */
import { expectSaga } from 'redux-saga-test-plan';
import { createMockTask } from '@redux-saga/testing-utils';
import { select, call, delay, put, fork, take, cancel } from 'redux-saga/effects';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import {
  updateRetryData,
  _requestRetryStatus,
  requestRetryData,
  requestFilterMetadata,
  requestErrorHttpDocument,
  downloadBlobDocument,
  downloadRetryData,
  _pollForRetryStatus,
  startPollingForRetryStatus,
} from './index';
import { selectors } from '../../../reducers';
import { getMockHttpErrorDoc } from '../../../utils/errorManagement';
import openExternalUrl from '../../../utils/window';

const flowId = 'flow-123';
const resourceId = 'id-123';
const retryId = 'retry-123';

describe('EM2.0 metadata sagas', () => {
  describe('requestRetryData saga', () => {
    test('should invoke retryData api with passed retryId and dispatch received with retryData on success', () => {
      const retryData = {
        data: { test: 5},
        stage: 'page_processor_import',
        traceKey: 2345,
      };

      return expectSaga(requestRetryData, { flowId, resourceId, retryId })
        .provide([
          [call(apiCallWithRetry, {
            path: `/flows/${flowId}/${resourceId}/${retryId}/data`,
            opts: {
              method: 'GET',
            },
          }), retryData],
        ])
        .put(actions.errorManager.retryData.received({
          flowId,
          resourceId,
          retryId,
          retryData,
        }))
        .run();
    });
    test('should ignore when api call fails and error status is invalid/no need to handle saga level (<400 or >500)', () => {
      const errorMessage = { message: 'Invalid id' };
      const error = { status: 500, message: errorMessage};

      return expectSaga(requestRetryData, { flowId, resourceId, retryId })
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .not.put(actions.errorManager.retryData.received({
          flowId,
          resourceId,
          retryId,
          retryData: undefined,
        }))
        .not.put(actions.errorManager.retryData.receivedError({
          flowId,
          resourceId,
          retryId,
          error: undefined,
        }))
        .run();
    });
    test('should dispatch receivedError incase of valid error status on api call failure', () => {
      const errorMessage = { code: 422, message: 'unprocessable entity' };
      const error = { status: 422, message: JSON.stringify(errorMessage) };

      return expectSaga(requestRetryData, { flowId, resourceId, retryId })
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .not.put(actions.errorManager.retryData.received({
          flowId,
          resourceId,
          retryId,
          retryData: undefined,
        }))
        .put(actions.errorManager.retryData.receivedError({
          flowId,
          resourceId,
          retryId,
          error: errorMessage,
        }))
        .run();
    });
  });
  describe('updateRetryData saga', () => {
    test('should merge retryData Object with the passed retryData to be updated and invoke update api ', () => {
      const previousRetryDataObj = {
        data: { test: 5},
        stage: 'page_processor_import',
        traceKey: 2345,
      };
      const updatedRetryData = { newTest: 20 };
      const updatedRetryDataInfo = {
        ...previousRetryDataObj,
        data: updatedRetryData,
      };

      return expectSaga(updateRetryData, { flowId, resourceId, retryId, retryData: updatedRetryData, test: true })
        .provide([
          [select(selectors.retryDataContext, retryId), { data: previousRetryDataObj }],
          [matchers.call.fn(apiCallWithRetry), undefined],
        ])
        .put(actions.errorManager.retryData.received({
          flowId,
          resourceId,
          retryId,
          retryData: updatedRetryDataInfo,
        }))
        .run();
    });
    test('should dispatch receivedError incase of valid error status on api call failure', () => {
      const previousRetryDataObj = {
        data: { test: 5},
        stage: 'page_processor_import',
        traceKey: 2345,
      };
      const updatedRetryData = { newTest: 20 };
      const errorMessage = { code: 422, message: 'unprocessable entity' };
      const error = { status: 422, message: JSON.stringify(errorMessage) };

      return expectSaga(updateRetryData, { flowId, resourceId, retryId, retryData: updatedRetryData })
        .provide([
          [select(selectors.retryDataContext, retryId), { data: previousRetryDataObj }],
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .not.put(actions.errorManager.retryData.received({
          flowId,
          resourceId,
          retryId,
          retryData: undefined,
        }))
        .put(actions.errorManager.retryData.receivedError({
          flowId,
          resourceId,
          retryId,
          error: errorMessage,
        }))
        .run();
    });
    test('should ignore when api call fails and error status is invalid/no need to handle saga level (<400 or >500)', () => {
      const previousRetryDataObj = {
        data: { test: 5},
        stage: 'page_processor_import',
        traceKey: 2345,
      };
      const updatedRetryData = { newTest: 20 };
      const error = { status: 500, message: 'Invalid id' };

      return expectSaga(updateRetryData, { flowId, resourceId, retryId, retryData: updatedRetryData })
        .provide([
          [select(selectors.retryDataContext, retryId), { data: previousRetryDataObj }],
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .not.put(actions.errorManager.retryData.received({
          flowId,
          resourceId,
          retryId,
          retryData: undefined,
        }))
        .not.put(actions.errorManager.retryData.receivedError({
          flowId,
          resourceId,
          retryId,
          error: undefined,
        }))
        .run();
    });
  });
  describe('_requestRetryStatus saga', () => {
    test('should invoke api call with exports/imports resourceType based on the passed resourceId ', () => {
      const exportPath = `/jobs?_flowId=${flowId}&type=retry&status=queued&status=running&_exportId=${resourceId}`;
      const importPath = `/jobs?_flowId=${flowId}&type=retry&status=queued&status=running&_importId=${resourceId}`;
      const pendingJobs = [];

      const test1 = expectSaga(_requestRetryStatus, { flowId, resourceId })
        .provide([
          [call(apiCallWithRetry, {
            path: exportPath,
            opts: {
              method: 'GET',
            },
            hidden: true,
          }), pendingJobs],
        ])
        .put(actions.errorManager.retryStatus.received({ flowId, resourceId, status: undefined }))
        .run();

      const test2 = expectSaga(_requestRetryStatus, { flowId, resourceId })
        .provide([
          [select(selectors.resource, 'imports', resourceId), { _id: 'id1', name: 'test import' }],
          [call(apiCallWithRetry, {
            path: importPath,
            opts: {
              method: 'GET',
            },
            hidden: true,
          }), pendingJobs],
        ])
        .put(actions.errorManager.retryStatus.received({ flowId, resourceId, status: undefined }))
        .run();

      return test1 && test2;
    });
    test('should do nothing if the api call fails', () => {
      const errorMessage = { code: 422, message: 'unprocessable entity' };
      const error = { status: 422, message: JSON.stringify(errorMessage) };

      return expectSaga(_requestRetryStatus, { flowId, resourceId })
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .not.put(actions.errorManager.retryStatus.received({ flowId, resourceId, status: undefined }))
        .not.put(actions.errorManager.retryStatus.stopPoll())
        .run();
    });
    test('should dispatch status as in progress if the api returns list of in progress retry jobs running', () => {
      const exportPath = `/jobs?_flowId=${flowId}&type=retry&status=queued&status=running&_exportId=${resourceId}`;
      const pendingJobs = [
        { _jobId: '1234' },
        { _jobId: '5678' },
      ];
      const updatedStatus = 'inProgress';

      return expectSaga(_requestRetryStatus, { flowId, resourceId })
        .provide([
          [call(apiCallWithRetry, {
            path: exportPath,
            opts: {
              method: 'GET',
            },
            hidden: true,
          }), pendingJobs],
        ])
        .put(actions.errorManager.retryStatus.received({ flowId, resourceId, status: updatedStatus }))
        .run();
    });
    test('should not dispatch stop polling retry status action if there are in progress retry jobs', () => {
      const exportPath = `/jobs?_flowId=${flowId}&type=retry&status=queued&status=running&_exportId=${resourceId}`;
      const pendingJobs = [
        { _jobId: '1234' },
        { _jobId: '5678' },
      ];

      return expectSaga(_requestRetryStatus, { flowId, resourceId })
        .provide([
          [call(apiCallWithRetry, {
            path: exportPath,
            opts: {
              method: 'GET',
            },
            hidden: true,
          }), pendingJobs],
        ])
        .not.put(actions.errorManager.retryStatus.stopPoll())
        .run();
    });
    test('should dispatch status as completed if the previous status is in progress and there are no retry jobs running any more', () => {
      const exportPath = `/jobs?_flowId=${flowId}&type=retry&status=queued&status=running&_exportId=${resourceId}`;
      const pendingJobs = [];
      const updatedStatus = 'completed';

      return expectSaga(_requestRetryStatus, { flowId, resourceId })
        .provide([
          [select(selectors.retryStatus, flowId, resourceId), 'inProgress'],
          [call(apiCallWithRetry, {
            path: exportPath,
            opts: {
              method: 'GET',
            },
            hidden: true,
          }), pendingJobs],
        ])
        .put(actions.errorManager.retryStatus.received({ flowId, resourceId, status: updatedStatus }))
        .run();
    });
    test('should dispatch stop polling retry status action if there are no retry jobs running', () => {
      const exportPath = `/jobs?_flowId=${flowId}&type=retry&status=queued&status=running&_exportId=${resourceId}`;
      const pendingJobs = [];
      const updatedStatus = 'completed';

      return expectSaga(_requestRetryStatus, { flowId, resourceId })
        .provide([
          [select(selectors.retryStatus, flowId, resourceId), 'inProgress'],
          [call(apiCallWithRetry, {
            path: exportPath,
            opts: {
              method: 'GET',
            },
            hidden: true,
          }), pendingJobs],
        ])
        .put(actions.errorManager.retryStatus.received({ flowId, resourceId, status: updatedStatus }))
        .put(actions.errorManager.retryStatus.stopPoll())
        .run();
    });
    test('should dispatch status undefined if there is no previous status and no in progress retry jobs ', () => {
      const exportPath = `/jobs?_flowId=${flowId}&type=retry&status=queued&status=running&_exportId=${resourceId}`;
      const pendingJobs = [];

      return expectSaga(_requestRetryStatus, { flowId, resourceId })
        .provide([
          [call(apiCallWithRetry, {
            path: exportPath,
            opts: {
              method: 'GET',
            },
            hidden: true,
          }), pendingJobs],
        ])
        .put(actions.errorManager.retryStatus.received({ flowId, resourceId, status: undefined }))
        .run();
    });
  });
  describe('requestFilterMetadata saga', () => {
    test('should invoke metadata api and dispatch filters received action', () => {
      const mockMetadata = {
        filters: [{
          name: 'source',
          enums: ['internal', 'application', 'connection'],
        },
        {
          name: 'classification',
          enums: ['connection', 'duplicate', 'governance'],
        }],
      };

      return expectSaga(requestFilterMetadata)
        .provide([
          [call(apiCallWithRetry, {
            path: '/errors/filterMetadata',
            opts: {
              method: 'GET',
            },
          }), mockMetadata],
        ])
        .put(actions.errorManager.filterMetadata.received(mockMetadata.filters))
        .run();
    });
    test('should do nothing incase of api failure', () => {
      const errorMessage = { code: 422, message: 'unprocessable entity' };
      const error = { status: 422, message: JSON.stringify(errorMessage) };

      return expectSaga(requestFilterMetadata)
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .not.put(actions.errorManager.filterMetadata.received(undefined))
        .run();
    });
  });
  describe('requestErrorHttpDocument saga', () => {
    const reqAndResKey = 'key-123';

    test('should invoke api to get http document and the response is dispatched as a received action on success', () => {
      const mockResponse = getMockHttpErrorDoc();

      return expectSaga(requestErrorHttpDocument, { flowId, resourceId, reqAndResKey })
        .provide([
          [call(apiCallWithRetry, {
            path: `/flows/${flowId}/${resourceId}/requests/${reqAndResKey}`,
            opts: {
              method: 'GET',
            },
            hidden: true,
          }), mockResponse],
        ])
        .put(actions.errorManager.errorHttpDoc.received(reqAndResKey, mockResponse))
        .run();
    });
    test('should invoke api and dispatch error action on failure', () => {
      const errorMessage = {errors: [{ message: 'S3 key is expired' }]};
      const error = { status: 402, message: JSON.stringify(errorMessage) };

      return expectSaga(requestErrorHttpDocument, { flowId, resourceId, reqAndResKey })
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .put(actions.errorManager.errorHttpDoc.error(reqAndResKey, errorMessage.errors[0].message))
        .not.put(actions.errorManager.errorHttpDoc.received(reqAndResKey, undefined))
        .run();
    });
  });
  describe('downloadBlobDocument saga', () => {
    const reqAndResKey = 'blob-123';

    test('should make api call and do nothing if the response does not contain signedURL', () => expectSaga(downloadBlobDocument, { flowId, resourceId, reqAndResKey })
      .provide([
        [call(apiCallWithRetry, {
          path: `/flows/${flowId}/${resourceId}/requests/${reqAndResKey}/files/signedURL`,
          opts: {
            method: 'GET',
          },
          hidden: true,
        }), {}],
      ])
      .not.call.fn(openExternalUrl)
      .run());
    test('should make api call and do nothing if the api call fails', () => expectSaga(downloadBlobDocument, { flowId, resourceId, reqAndResKey })
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError({ status: 500, message: 'invalid id'})],
      ])
      .not.call.fn(openExternalUrl)
      .run());
    test('should make api call and call openExternalURL with the signedURL from the response', () => {
      const response = { signedURL: 'https://www.samplesignedurl.com/s3/asdfg'};

      expectSaga(downloadBlobDocument, { flowId, resourceId, reqAndResKey })
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
        ])
        .call(openExternalUrl, { url: response.signedURL })
        .run();
    });
  });
  describe('downloadRetryData saga', () => {
    const retryDataKey = 'id-123';

    test('should make api call to download retry data and do nothing if the response does not contain signedURL', () => expectSaga(downloadRetryData, { flowId, resourceId, retryDataKey })
      .provide([
        [call(apiCallWithRetry, {
          path: `/flows/${flowId}/${resourceId}/${retryDataKey}/signedURL`,
          opts: {
            method: 'GET',
          },
          hidden: true,
        }), {}],
      ])
      .not.call.fn(openExternalUrl)
      .run());
    test('should make api call to download retry data and do nothing if the api call fails', () => expectSaga(downloadRetryData, { flowId, resourceId, retryDataKey })
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError({ status: 500, message: 'invalid id'})],
      ])
      .not.call.fn(openExternalUrl)
      .run());
    test('should make api call to download retry data and call openExternalURL with the signedURL from the response', () => {
      const response = { signedURL: 'https://www.samplesignedurl.com/s3/retryData'};

      expectSaga(downloadRetryData, { flowId, resourceId, retryDataKey })
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
        ])
        .call(openExternalUrl, { url: response.signedURL })
        .run();
    });
  });
  describe('_pollForRetryStatus saga', () => {
    test('should dispatch request action and call _requestRetryStatus after 5 seconds delay continuously', () => {
      const saga = _pollForRetryStatus({ flowId, resourceId });

      expect(saga.next().value).toEqual(put(actions.errorManager.retryStatus.request({ flowId, resourceId })));
      expect(saga.next().value).toEqual(call(_requestRetryStatus, { flowId, resourceId }));
      expect(saga.next().value).toEqual(delay(5000));

      expect(saga.next().done).toEqual(false);
    });
  });
  describe('startPollingForRetryStatus saga', () => {
    test('should fork _pollForRetryStatus, waits for STOP_POLL action and then cancels _pollForRetryStatus', () => {
      const mockTask = createMockTask();

      const saga = startPollingForRetryStatus({flowId, resourceId});

      expect(saga.next().value).toEqual(fork(_pollForRetryStatus, {flowId, resourceId}));

      expect(saga.next(mockTask).value).toEqual(take(actionTypes.ERROR_MANAGER.RETRY_STATUS.STOP_POLL));
      expect(saga.next({type: actionTypes.ERROR_MANAGER.RETRY_STATUS.STOP_POLL}).value).toEqual(cancel(mockTask));
      expect(saga.next().done).toEqual(true);
    });
  });
});


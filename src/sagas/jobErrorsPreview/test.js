/* global describe, test */

import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { call } from 'redux-saga/effects';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { requestJobErrorPreview } from '.';
import { uploadRawData } from '../uploadFile';

describe('requestJobErrorPreview saga', () => {
  test('should dispatch received preview action when job errors preview call is successful', () => {
    const jobId = 'j1';
    const errorFile = {};
    const errorFileId = 'ef1';
    const previewData = {numSuccess: 1};

    return expectSaga(requestJobErrorPreview, { jobId, errorFile })
      .provide([[call(uploadRawData, {
        file: errorFile,
        fileType: 'application/csv',
      }), errorFileId],
      [call(apiCallWithRetry, {
        path: '/jobs/j1/jobErrorFile/preview?runKey=ef1',
        opts: { method: 'GET' },
        message: 'Loading',
      }), previewData]])
      .put(
        actions.job.processedErrors.receivedPreview({
          jobId,
          previewData,
          errorFileId,
        })
      )
      .run();
  });

  test('should dispatch preview error action when job errors preview call fails', () => {
    const jobId = 'j1';
    const errorFile = {};
    const errorFileId = 'ef1';
    const previewError = 'Preview error';
    const error = new Error('error');

    return expectSaga(requestJobErrorPreview, { jobId, errorFile })
      .provide([[call(uploadRawData, {
        file: errorFile,
        fileType: 'application/csv',
      }), errorFileId],
      [call(apiCallWithRetry, {
        path: '/jobs/j1/jobErrorFile/preview?runKey=ef1',
        opts: { method: 'GET' },
        message: 'Loading',
      }), throwError(error)]])
      .put(
        actions.job.processedErrors.previewError({
          jobId,
          error: previewError,
        })
      )
      .run();
  });
});


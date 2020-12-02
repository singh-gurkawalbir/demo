/* global describe, test */

import { expectSaga } from 'redux-saga-test-plan';
// import { throwError } from 'redux-saga-test-plan/providers';
import { call } from 'redux-saga/effects';
// import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../../../actions';
import { apiCallWithRetry } from '../../index';
import { deleteFlow} from '.';

describe('deleteFlow saga', () => {
  test.only('should dispatch resource deleted action when delete flow call is successful', () => {
    const ssLinkedConnectionId = 'c1';
    const integrationId = 'i1';
    const flowId = 're1';
    const requestOptions = {
      path: '/suitescript/connections/c1/integrations/i1/flows/1?type=REALTIME_EXPORT',
      opts: {
        method: 'DELETE',
      },
    };

    return expectSaga(deleteFlow, { ssLinkedConnectionId, integrationId, _id: flowId })
      .provide([[call(apiCallWithRetry, requestOptions), {}]])
      .put(
        actions.suiteScript.resource.deleted('flows', flowId, ssLinkedConnectionId)
      )
      .run();
  });

  /* test('should dispatch preview error action when job errors preview call fails', () => {
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
  }); */
});


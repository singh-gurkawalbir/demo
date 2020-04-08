import { call, takeEvery, put } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { uploadRawData } from '../uploadFile';
import { apiCallWithRetry } from '../index';

function* requestJobErrorPreview({ jobId, errorFile }) {
  // fetches s3 run key for the error file once stored
  const runKey = yield call(uploadRawData, {
    file: errorFile,
    fileType: 'application/csv',
  });

  try {
    const previewData = yield call(apiCallWithRetry, {
      path: `/jobs/${jobId}/jobErrorFile/preview?runKey=${runKey}`,
      opts: { method: 'GET' },
      message: ' Fetching Preview for Job Errors',
    });

    yield put(
      actions.job.processedErrors.receivedPreview({
        jobId,
        previewData,
        s3Key: runKey,
      })
    );
  } catch (e) {
    yield put(
      actions.job.processedErrors.previewError({
        jobId,
        error: 'Preview error',
      })
    );
  }
}

export default [
  takeEvery(actionTypes.JOB.ERROR.PREVIEW.REQUEST, requestJobErrorPreview),
];

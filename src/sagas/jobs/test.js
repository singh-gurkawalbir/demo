/* global describe, test, expect */

import { call } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import { downloadDiagnosticsFile } from './';

describe('downloadDiagnosticsFile saga', () => {
  test('abc', () => {
    const jobId = 'something';
    const saga = downloadDiagnosticsFile({ jobId });
    const { path, opts } = getRequestOptions(
      actionTypes.JOB.REQUEST_DIAGNOSTICS_FILE_URL,
      { resourceId: jobId }
    );

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts,
      })
    );
    expect(saga.next().done).toEqual(true);
  });
});

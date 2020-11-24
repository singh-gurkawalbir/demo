/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('jobErrorsPreview reducer', () => {
  test('should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const originalState = {i2: {status: 'received', data: []}};
    const newState = reducer(originalState, unknownAction);

    expect(newState).toEqual(originalState);
  });
  describe('requestPreview action', () => {
    test('should not alter state if invalid job id is passed.', () => {
      const originalState = {j2: {status: 'requested', previewData: [], errorFileId: 'ef1'}};
      const newState = reducer(originalState,
        actions.job.processedErrors.requestPreview({})
      );

      expect(newState).toEqual(originalState);
    });
    test('should set requested property on the corresponding job.', () => {
      const jobId = 'j1';
      const originalState = {j2: {status: 'requested', previewData: [], errorFileId: 'ef1'}};
      const expectedState = {j1: {status: 'requested'}, j2: {status: 'requested', previewData: [], errorFileId: 'ef1'}};
      const newState = reducer(originalState,
        actions.job.processedErrors.requestPreview({jobId})
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('receivedPreview action', () => {
    test('should set requested property on the corresponding job.', () => {
      const jobId = 'j1';
      const previewData = {p1: 1};
      const errorFileId = 'ef2';
      const originalState = {j2: {status: 'requested', previewData: [], errorFileId: 'ef1'}};
      const expectedState = {j1: {status: 'received', previewData, errorFileId}, j2: {status: 'requested', previewData: [], errorFileId: 'ef1'}};
      const newState = reducer(originalState,
        actions.job.processedErrors.receivedPreview({jobId, previewData, errorFileId})
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('errorPreview action', () => {
    test('should set error property on the corresponding job.', () => {
      const jobId = 'j1';
      const error = 'some error';
      const originalState = {j2: {status: 'requested', previewData: [], errorFileId: 'ef1'}};
      const expectedState = {j1: {status: 'error', error}, j2: {status: 'requested', previewData: [], errorFileId: 'ef1'}};
      const newState = reducer(originalState,
        actions.job.processedErrors.previewError({jobId, error})
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('clearPreview action', () => {
    test('should clear entry on the corresponding job.', () => {
      const jobId = 'j1';
      const error = 'some error';
      const originalState = {j1: {status: 'error', error}, j2: {status: 'requested', previewData: [], errorFileId: 'ef1'}};
      const expectedState = {j2: {status: 'requested', previewData: [], errorFileId: 'ef1'}};
      const newState = reducer(originalState,
        actions.job.processedErrors.clearPreview(jobId)
      );

      expect(newState).toEqual(expectedState);
    });
  });
});

describe('jobErrorsPreview selectors', () => {
  test('should return empty object when state is undefined', () => {
    expect(selectors.getJobErrorsPreview(undefined)).toEqual({});
  });
  test('should return jobErrorsPreview for valid state', () => {
    const jobId = 'j1';
    const previewData = {p1: 1};
    const originalState = {j2: {status: 'requested', previewData: [], errorFileId: 'ef1'}};
    const expectedData = {j1: {status: 'received', previewData}, j2: {status: 'requested', previewData: [], errorFileId: 'ef1'}};
    const newState = reducer(originalState,
      actions.job.processedErrors.receivedPreview({jobId, previewData})
    );

    expect(selectors.getJobErrorsPreview(newState, jobId)).toEqual(expectedData[jobId]);
  });
});

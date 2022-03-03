/* global describe, test, beforeAll, afterAll */
import { throwError } from 'redux-saga-test-plan/providers';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { apiCallWithRetry } from '../index';
import { uploadFile, previewZip, processFile, configureFileReader } from '.';
import actions from '../../actions';
import messageStore from '../../constants/messages';
import {
  getCsvFromXlsx,
} from '../../utils/file';

describe('uploadFile saga', () => {
  const resourceId = '123';
  const resourceType = 'templates';
  const fileType = 'application/zip';
  const file = { _id: '456', name: 'someFile' };
  const response = { signedURL: 'someURL', runKey: 'runKey' };

  // This is the part where we mock `fetch`
  const unmockedFetch = global.fetch;

  beforeAll(() => {
    global.fetch = () =>
      Promise.resolve({});
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });
  test('should succeed on successful api call', () => expectSaga(uploadFile, { resourceType, resourceId, fileType, file })
    .provide([[matchers.call.fn(apiCallWithRetry), response]])
    .call.fn(apiCallWithRetry)
    .returns('runKey')
    .run());
  test('should handle api error properly', () => {
    const error = new Error('error');

    return expectSaga(uploadFile, { resourceType, resourceId, fileType, file })
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
      ])
      .call.fn(apiCallWithRetry)
      .returns(undefined)
      .run();
  });
});

describe('previewZip saga', () => {
  const fileType = 'application/zip';
  const file = { _id: '456', name: 'someFile' };
  const runKey = '1234';
  const components = [
    {
      model: 'something',
      _id: '111',
    },
    {
      model: 'something',
      _id: '222',
    },
  ];

  test('should succeed on successful api call', () => expectSaga(previewZip, { file, fileType})
    .provide([[matchers.call.fn(apiCallWithRetry), components],
      [matchers.call.fn(uploadFile), runKey]])
    .call.fn(uploadFile)
    .call.fn(apiCallWithRetry)
    .put(actions.template.receivedPreview(components, runKey, true))
    .run());
  test('should handle api error properly', () => {
    const error = new Error('error');

    return expectSaga(previewZip, { file, fileType})
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
        [matchers.call.fn(uploadFile), runKey],
      ])
      .call.fn(uploadFile)
      .call.fn(apiCallWithRetry)
      .run();
  });
  test('should handle api error if exception is thrown on uploadFile call', () => {
    const error = new Error('error');

    return expectSaga(previewZip, { file, fileType})
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
        [matchers.call.fn(uploadFile), throwError(error)],
      ])
      .call.fn(uploadFile)
      .run();
  });
});

describe('processFile saga', () => {
  const fileType = 'csv';
  const file = {
    name: 'certificate',
    size: 500,
    type: 'text/plain',
    webkitRelativePath: '',
  };
  const file1 = {
    name: 'certificate',
    size: 50000000000,
    type: 'text/plain',
    webkitRelativePath: '',
  };
  const xlsxFile = {
    name: 'certificate',
    size: 500,
    type: 'application/vnd.ms-excel',
    webkitRelativePath: '',
  };
  const jsonFile = '';
  const fileProps = {};
  const fileId = 'field1';
  const fileContent = { test: 5 };

  test('should be able to dispatch processedFile if valid file is uploaded', () => expectSaga(processFile, { fileId, file, fileType, fileProps})
    .provide([[matchers.call.fn(configureFileReader), fileContent]])
    .call.fn(configureFileReader)
    .put(
      actions.file.processedFile({
        fileId,
        file: fileContent,
        fileProps: { name: file.name, size: file.size, fileType, rawFile: file },
      })
    )
    .run());
  test('should be able to dispatch processError if invalid json file uploaded', () => expectSaga(processFile, { fileId, file: jsonFile, fileType: 'json', fileProps})
    .provide([[matchers.call.fn(configureFileReader), {}]])
    .call.fn(configureFileReader)
    .put(
      actions.file.processError({
        fileId,
        error: 'Please select valid JSON file',
      })
    )
    .run());
  test('should be able to dispatch processError if invalid xlsx file uploaded', () => expectSaga(processFile, { fileId, file: xlsxFile, fileType: 'xlsx', fileProps})
    .provide([[matchers.call.fn(configureFileReader), {}],
      [matchers.call.fn(getCsvFromXlsx), {error: 'Invalid xlsx file'}]])
    .call.fn(configureFileReader)
    .call.fn(getCsvFromXlsx)
    .put(
      actions.file.processError({
        fileId,
        error: 'Invalid xlsx file',
      })
    )
    .run());
  test('should be able to dispatch processError if file size exceeds', () => expectSaga(processFile, { fileId, file: file1, fileType, fileProps})
    .provide([[matchers.call.fn(configureFileReader), fileContent]])
    .put(actions.file.processError({ fileId, error: messageStore('FILE_SIZE_EXCEEDED') }))
    .run());
});

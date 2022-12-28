
import { throwError } from 'redux-saga-test-plan/providers';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { apiCallWithRetry } from '../index';
import { uploadFile, previewZip, processFile, configureFileReader, uploadRawData } from '.';
import actions from '../../actions';
import {
  getCsvFromXlsx,
} from '../../utils/file';
import errorMessageStore from '../../utils/errorStore';

describe('uploadFile saga', () => {
  const resourceId = '123';
  const resourceType = 'templates';
  const fileType = 'application/zip';
  const file = { _id: '456', name: 'someFile' };
  const fileName = 'testfile';
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
  test('should succeed on successful api call and return runKey', () => expectSaga(uploadFile, { resourceType, resourceId, fileType, file })
    .provide([[matchers.call.fn(apiCallWithRetry), response]])
    .call.fn(apiCallWithRetry)
    .returns('runKey')
    .run());
  test('should update the headers correctly if fileName exists and succeed on successful api call', () => expectSaga(uploadFile, { resourceType, resourceId, fileType, file, fileName })
    .provide([[matchers.call.fn(apiCallWithRetry), response]])
    .call.fn(apiCallWithRetry)
    .returns('runKey')
    .run());
  test('should handle api error properly', () => {
    const error = new Error('error');

    expectSaga(uploadFile, { resourceType, resourceId, fileType, file })
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
      ])
      .call.fn(apiCallWithRetry)
      .returns(undefined)
      .run();
  });
});

describe('uploadRawData saga', () => {
  const fileType = 'application/zip';
  const file = { _id: '456', name: 'someFile' };
  const runKey = '1234';

  test('should call uploadFile saga', () => expectSaga(uploadRawData, {file, fileType})
    .provide([
      [matchers.call.fn(uploadFile), runKey]])
    .call.fn(uploadFile)
    .returns(runKey)
    .run());

  test('should handle api error if exception is thrown on uploadFile call', () => {
    const error = new Error('error');

    expectSaga(uploadRawData, { file, fileType})
      .provide([
        [matchers.call.fn(uploadFile), throwError(error)],
      ])
      .call.fn(uploadFile)
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

    expectSaga(previewZip, { file, fileType})
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

    expectSaga(previewZip, { file, fileType})
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
  const validJson = '{"name": "test"}';

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
  test('should be able to dispatch processedFile if valid json file uploaded', () => expectSaga(processFile, { fileId, file: jsonFile, fileType: 'json', fileProps})
    .provide([[matchers.call.fn(configureFileReader), validJson]])
    .call.fn(configureFileReader)
    .put(
      actions.file.processedFile({
        fileId,
        file: {name: 'test'},
        fileProps: { name: undefined, size: undefined, fileType: 'json', rawFile: '' },
      }))
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
    .put(actions.file.processError({ fileId, error: errorMessageStore('FILE_SIZE_EXCEEDED') }))
    .run());
});

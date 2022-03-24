import { call, takeEvery, put } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import {
  getFileReaderOptions,
  getCsvFromXlsx,
  getJSONContentFromString,
  getUploadedFileStatus,
} from '../../utils/file';

export function* uploadFile({
  resourceType,
  resourceId,
  fileType,
  file,
  fileName,
  uploadPath,
}) {
  const path =
    uploadPath ||
    `/${resourceType}/${resourceId}/upload/signedURL?file_type=${fileType}`;

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      message: 'Getting signed URL for file upload',
    });
    const headers = {
      'Content-Type': fileType,
      'x-amz-server-side-encryption': 'AES256',
    };

    if (fileName) {
      headers['Content-Disposition'] = `attachment;filename=${encodeURIComponent(fileName)}`;
    }

    yield fetch(response.signedURL, {
      method: 'PUT',
      headers,
      body: file,
    });

    return response.runKey;
  } catch (e) {
    return undefined;
  }
}

export function* uploadRawData({
  file,
  fileName = 'file.txt',
  fileType = 'application/text',
}) {
  const uploadPath = `/s3SignedURL?file_name=${encodeURIComponent(fileName)}&file_type=${fileType}`;

  try {
    const runKey = yield call(uploadFile, { file, fileType, fileName, uploadPath });

    return runKey;
  } catch (e) {
    // @TODO handle error
  }
}

export function* previewZip({ file, fileType = 'application/zip' }) {
  const uploadPath = `/s3SignedURL?file_name=${encodeURIComponent(file.name)}&file_type=${fileType}`;
  let runKey;

  try {
    runKey = yield call(uploadFile, { file, fileType, uploadPath });
    const previewPath = `/integrations/template/preview?runKey=${runKey}`;
    const components = yield call(apiCallWithRetry, {
      path: previewPath,
      message: 'Loading',
    });

    yield put(actions.template.receivedPreview(components, runKey, true));
  } catch (e) {
    yield put(actions.template.failedPreview(runKey));
  }
}

// TODO @Raghu - Check for other file reader apis which suites better if any
export function configureFileReader(file, fileType) {
  const fileReaderOptions = getFileReaderOptions(fileType);

  // wrapped inside promise to handle the file content returned after onload callback
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);

    if (fileReaderOptions.readAsArrayBuffer) {
      // Incase of xlsx file
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
}

/*
 * Reads and processes the uploaded file based on file type and saves fileContent/error on state
 * For xlsx file , content gets converted to 'csv' before parsing to verify valid xlsx file
 * For JSON file, content should be parsed from String to JSON
 * @param fileProps contains any additional properties needed to be passed related to the uploaded file
 */
export function* processFile({ fileId, file, fileType, fileProps = {} }) {
  const { error } = getUploadedFileStatus(file, fileType, fileProps);
  const { name, size } = file;

  if (error) {
    return yield put(actions.file.processError({ fileId, error }));
  }

  let fileContent = yield call(configureFileReader, file, fileType);

  if (['xlsx', 'json'].includes(fileType)) {
    let out;

    if (fileType === 'json') {
      out = getJSONContentFromString(fileContent);
    } else {
      out = yield call(getCsvFromXlsx, fileContent);
    }
    if (out.error) {
      return yield put(actions.file.processError({ fileId, error: out.error }));
    }
    if (fileType === 'json') {
      fileContent = out.data;
    }
  }

  yield put(
    actions.file.processedFile({
      fileId,
      file: fileContent,
      fileProps: { name, size, fileType, rawFile: file },
    })
  );
}

export const uploadFileSagas = [
  takeEvery(actionTypes.FILE.UPLOAD, uploadFile),
  takeEvery(actionTypes.FILE.PREVIEW_ZIP, previewZip),
  takeEvery(actionTypes.FILE.PROCESS, processFile),
];

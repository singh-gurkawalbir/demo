import { select, call } from 'redux-saga/effects';
import { apiCallWithRetry } from '../index';
import { userProfile } from '../../reducers';

function postData({ url = '', data = {}, method, headers }) {
  return fetch(url, {
    method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers,
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(data),
  });
}

export default function* uploadFileToS3({
  file,
  fileName = 'file.txt',
  fileType = 'application/text',
}) {
  const url = `/s3SignedURL?file_name=${fileName}&file_type=${fileType}`;

  try {
    const signedUrlOptions = yield apiCallWithRetry({
      path: url,
      opts: {
        method: 'GET',
      },
    });
    const { signedURL, runKey } = signedUrlOptions;
    const data = file;
    const headers = { 'Content-Type': fileType };

    if (signedURL.indexOf('x-amz-server-side-encryption=AES256') > -1) {
      headers['x-amz-server-side-encryption'] = 'AES256';
    }

    yield call(postData, {
      url: signedURL,
      data,
      method: 'PUT',
      headers,
    });
    const profile = yield select(userProfile);

    return profile._id + runKey;
  } catch (e) {
    // @TODO handle error
  }
}

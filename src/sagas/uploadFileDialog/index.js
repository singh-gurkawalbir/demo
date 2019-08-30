// import { call, takeEvery, put } from 'redux-saga/effects';
// import actionTypes from '../../actions/types';
// import actions from '../../actions';
// import { apiCallWithRetry } from '../index';

// export function* uploadFile({ resourceType, resourceId, file }) {
//   const path = `/templates/${id}/download/signedURL`;
//   let response;

//   try {
//     response = yield call(apiCallWithRetry, {
//       path,
//       message: 'Downloading zip',
//     });
//   } catch (e) {}
// }

// export const uploadFileSagas = [takeEvery(actionTypes.FILE.UPLOAD, uploadFile)];

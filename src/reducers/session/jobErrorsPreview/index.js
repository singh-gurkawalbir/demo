import produce from 'immer';
import actionTypes from '../../../actions/types';

export default function (state = {}, action) {
  const { type, jobId, previewData, error, errorFileId } = action;

  return produce(state, draft => {
    if (!type || !jobId) return draft;

    switch (type) {
      case actionTypes.JOB.ERROR.PREVIEW.REQUEST:
        draft[jobId] = {
          status: 'requested',
        };
        break;

      case actionTypes.JOB.ERROR.PREVIEW.RECEIVED:
        draft[jobId] = {
          status: 'received',
          previewData,
          errorFileId,
        };
        break;
      case actionTypes.JOB.ERROR.PREVIEW.ERROR:
        draft[jobId] = {
          status: 'error',
          error,
        };
        break;
      case actionTypes.JOB.ERROR.PREVIEW.CLEAR:
        delete draft[jobId];
        break;
      default:
    }
  });
}

export const selectors = {};

selectors.getJobErrorsPreview = (state, jobId) => state[jobId];

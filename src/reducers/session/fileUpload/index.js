import produce from 'immer';
import actionTypes from '../../../actions/types';

export default function(state = {}, action) {
  const { type, fileId, file, error, props = {} } = action;

  return produce(state, draft => {
    if (!type || !fileId) return draft;

    switch (type) {
      case actionTypes.FILE.PROCESS:
        draft[fileId] = {
          status: 'requested',
        };
        break;

      case actionTypes.FILE.PROCESSED:
        draft[fileId] = {
          status: 'received',
          file,
          ...props,
        };
        break;
      case actionTypes.FILE.PROCESS_ERROR:
        draft[fileId] = {
          status: 'error',
          error,
        };
        break;
      case actionTypes.FILE.RESET:
        delete draft[fileId];
        break;
      default:
    }
  });
}

export const getUploadedFile = (state, fileId) => state[fileId];

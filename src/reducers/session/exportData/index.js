import produce from 'immer';
import actionTypes from '../../../actions/types';

const EMPTY_OBJECT = {};
const reset = (draft, id) => {
  draft[id] = draft[id] || {};
  draft[id].data = [];
  draft[id].status = '';
  delete draft[id].error;
};

export default function(state = {}, action) {
  const { type, kind, identifier, data, error } = action;
  const id = typeof identifier !== 'string' ? String(identifier) : identifier;

  return produce(state, draft => {
    if (!type || !kind || !id) return;

    switch (type) {
      case actionTypes.EXPORTDATA.REQUEST:
        reset(draft, id);
        draft[id].status = 'requested';
        break;
      case actionTypes.EXPORTDATA.RECEIVED:
        reset(draft, id);
        draft[id].status = 'received';
        draft[id].data = data;
        break;
      case actionTypes.EXPORTDATA.ERROR_RECEIVED:
        reset(draft, id);
        draft[id].status = 'error';
        draft[id].error = error;
        break;
      default:
    }
  });
}

export const exportData = (state, identifier) => {
  const id = typeof identifier !== 'string' ? String(identifier) : identifier;

  return (state && state[id]) || EMPTY_OBJECT;
};

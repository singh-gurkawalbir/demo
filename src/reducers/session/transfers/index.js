import { each } from 'lodash';
import produce from 'immer';
import actionTypes from '../../../actions/types';

let emptyArray = [];

export default function reducer(state = {}, action) {
  const { response, error, type } = action;

  switch (type) {
    case actionTypes.TRANSFER.RECEIVED_PREVIEW:
      return produce(state, draft => {
        draft.transfer = {
          response,
          error,
        };
      });

    case actionTypes.TRANSFER.CLEAR_PREVIEW:
      return produce(state, draft => {
        draft.transfer = undefined;
      });

    default:
      return state;
  }
}

// #region PUBLIC SELECTORS
function parsePreviewResponse(res) {
  emptyArray = [];
  each(res, (v, t) => {
    each(res[t], d => {
      if (d && d._id) {
        emptyArray.push({
          type: t,
          _id: d._id,
          name: d.name,
        });
      }
    });
  });

  return emptyArray;
}

let error;

export function getPreviewData(state) {
  if (!state || !state.transfer) {
    return null;
  }

  if (state.transfer.response) {
    return {
      response: parsePreviewResponse(state.transfer.response),
    };
  }

  try {
    error = JSON.parse(state.transfer.error.message).errors[0].message;
  } catch (ex) {
    error = 'Preview Failed';
  }

  return {
    error,
  };
}

// #endregion

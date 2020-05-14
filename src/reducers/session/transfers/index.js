import { each } from 'lodash';
import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';

const emptyArray = [];

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
  const response = Array.from(emptyArray);

  each(res, (v, t) => {
    each(res[t], d => {
      if (d && d._id) {
        response.push({
          type: t,
          _id: d._id,
          name: d.name,
        });
      }
    });
  });

  return response.length > 0 ? response : emptyArray;
}

let error;

export const getPreviewData = createSelector(
  state => state && state.transfer,
  transfer => {
    if (!transfer) {
      return null;
    }

    if (transfer.response) {
      return {
        response: parsePreviewResponse(transfer.response),
      };
    }

    try {
      error = JSON.parse(transfer.error.message).errors[0].message;
    } catch (ex) {
      error = 'Preview Failed';
    }

    return {
      error,
    };
  }
);

// #endregion

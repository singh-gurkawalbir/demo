import _ from 'lodash';
import actionTypes from '../../../actions/types';

export default function reducer(state = {}, action) {
  const { response, error, type } = action;
  let newState;

  switch (type) {
    case actionTypes.TRANSFER.UPDATE_PREVIEW:
      newState = {
        ...state,
        transfer: {
          response,
          error,
        },
      };

      return newState;
    case actionTypes.TRANSFER.CLEAR_PREVIEW:
      newState = {
        ...state,
        transfer: undefined,
      };

      return newState;
    default:
      return state;
  }
}

// #region PUBLIC SELECTORS
function parsePreviewResponse(res) {
  const toReturn = [];

  _.each(res, (v, t) => {
    _.each(res[t], d => {
      if (d && d._id) {
        toReturn.push({
          type: t,
          _id: d._id,
          name: d.name,
        });
      }
    });
  });

  return toReturn;
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

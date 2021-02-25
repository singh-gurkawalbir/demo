import produce from 'immer';
import actionTypes from '../../../actions/types';

const emptyObj = {};

export default function reducer(state = {}, action) {
  const { type, name, filter } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.CLEAR_FILTER:
        if (name === 'jobs' && draft[name]) {
          const { status } = draft[name];

          draft[name] = { status };
        } else {
          delete draft[name];
        }
        break;

      case actionTypes.PATCH_FILTER:
        if (!draft[name]) draft[name] = {};

        // more finer level updates to a draft can result in more efficient state update
        Object.keys(filter).forEach(key => {
          draft[name][key] = filter[key];
        });

        break;

      default:
        break;
    }
  });
}

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.filter = (state, name) => (state && state[name]) || emptyObj;
// #endregion

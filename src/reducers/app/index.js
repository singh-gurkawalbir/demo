import actionTypes from '../../actions/types';

export default function(state = { count: 1 }, action) {
  switch (action.type) {
    case actionTypes.RELOAD_APP: {
      const { count } = state;
      const newCount = count + 1;

      return { count: newCount };
    }

    default: {
      return state;
    }
  }
}

export function reloadCount(state) {
  return state && state.count;
}

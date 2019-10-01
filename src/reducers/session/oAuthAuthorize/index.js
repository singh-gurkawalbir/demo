import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, connectionId } = action;

  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.CONNECTION.AUTHORIZED:
        if (!draft[connectionId]) draft[connectionId] = {};
        draft[connectionId].authorized = true;
        break;
    }
  });
};

export function isAuthorized(state, connectionId) {
  return !!((state || {})[connectionId] || {}).authorized;
}

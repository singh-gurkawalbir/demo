import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, resourceId } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.HTTP_CONNECTORS.RESOURCE_FORM.SWITCH_VIEW: {
        if (!draft[resourceId]) {
          draft[resourceId] = { view: false };
        }
        draft[resourceId].view = !draft[resourceId].view;
        break;
      }
      case actionTypes.HTTP_CONNECTORS.RESOURCE_FORM.CLEAR:
        delete draft[resourceId];
        break;
      default:
        return state;
    }
  });
};

export const selectors = {};

selectors.isHttpConnectorParentFormView = (state, resourceId) => {
  if (!state || !resourceId || !state[resourceId]) {
    return false;
  }

  return !!state[resourceId].view;
};


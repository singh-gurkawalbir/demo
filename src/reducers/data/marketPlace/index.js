import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, connectors, templates } = action;

  if (!type) {
    return state;
  }

  return produce(state, d => {
    const draft = d;

    switch (type) {
      case actionTypes.MARKETPLACE.CONNECTORS_RECEIVED:
        draft.connectors = connectors || [];
        break;

      case actionTypes.MARKETPLACE.TEMPLATES_RECEIVED:
        draft.templates = templates || [];
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS

export function connectors(state) {
  if (!state) {
    return [];
  }

  return state.connectors || [];
}

export function templates(state) {
  if (!state) {
    return [];
  }

  return state.templates || [];
}

// #endregion

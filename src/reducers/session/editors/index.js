import actionTypes from '../../../actions/types';

export default function reducer(state = {}, action) {
  const { type, processor, id, rules, data, result, error } = action;
  let newState;

  switch (type) {
    case actionTypes.EDITOR_INIT:
      newState = Object.assign({}, state);

      newState[id] = {
        processor,
        rules,
        data,
        defaultRules: rules,
        defaultData: data,
        lastChange: Date.now(),
      };

      return newState;

    case actionTypes.EDITOR_RESET:
      newState = Object.assign({}, state);
      newState[id] = { ...newState[id], lastChange: Date.now() };
      newState[id].rules = newState[id].defaultRules;
      newState[id].data = newState[id].defaultData;
      delete newState[id].error;
      delete newState[id].result;

      return newState;

    case actionTypes.EDITOR_RULE_CHANGE:
      newState = Object.assign({}, state);
      newState[id] = { ...newState[id], rules, lastChange: Date.now() };

      return newState;

    case actionTypes.EDITOR_DATA_CHANGE:
      newState = Object.assign({}, state);
      newState[id] = { ...newState[id], data, lastChange: Date.now() };

      return newState;

    case actionTypes.EDITOR_EVALUATE_RESPONSE:
      newState = Object.assign({}, state);
      newState[id] = { ...newState[id], result };
      delete newState[id].error;

      return newState;

    case actionTypes.EDITOR_EVALUATE_FAILURE:
      newState = Object.assign({}, state);
      newState[id] = { ...newState[id], error };
      delete newState[id].result;

      return newState;

    default:
      return state;
  }
}

// #region PUBLIC SELECTORS
export function editor(state, id) {
  if (!state) {
    return {};
  }

  return state[id] || {};
}

export function editorProcessorOptions(state, id) {
  if (!state || !state[id]) {
    return {};
  }

  const { processor, rules, data } = state[id];

  switch (processor) {
    case 'handlebars':
      return {
        processor,
        options: {
          rules: { strict: false, template: rules },
          data: JSON.parse(data),
        },
      };

    default:
      return { processor, rules, data };
  }
}
// #endregion

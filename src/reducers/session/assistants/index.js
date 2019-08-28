import actionTypes from '../../../actions/types';

export default (state = { rest: {}, http: {} }, action) => {
  const { type } = action;

  if (!type) {
    return state;
  }

  if (type === actionTypes.ASSISTANT_METADATA.RECEIVED) {
    const { adaptorType, assistant, metadata } = action;

    if (!state[adaptorType]) {
      return state;
    }

    return {
      ...state,
      [adaptorType]: { ...state[adaptorType], [assistant]: metadata },
    };
  }

  return state;
};

export function assistantData(state, { adaptorType, assistant }) {
  if (!state || !state[adaptorType] || !state[adaptorType][assistant]) {
    return undefined;
  }

  return state[adaptorType][assistant];
}

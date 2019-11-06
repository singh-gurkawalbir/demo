import actionTypes from '../../../actions/types';

export default function reducer(state = {}, action) {
  const { type, tempId, id, resourceReferences } = action;
  let newState;

  switch (type) {
    case actionTypes.RESOURCE.CREATED:
      newState = { ...state, [tempId]: id };

      return newState;
    case actionTypes.RESOURCE.REFERENCES_RECEIVED:
      newState = { ...state, references: resourceReferences };

      return newState;
    case actionTypes.RESOURCE.REFERENCES_CLEAR:
      newState = { ...state };
      delete newState.references;

      return newState;

    default:
      return state;
  }
}

// #region PUBLIC SELECTORS
export function createdResourceId(state, tempId) {
  if (!state) {
    return;
  }

  return state[tempId];
}

export function resourceReferences(state) {
  if (!state || !state.references) {
    return null;
  }

  const { references } = state;
  const referencesArray = [];

  Object.keys(references).forEach(type =>
    references[type].forEach(refObj => {
      referencesArray.push({
        resourceType: type,
        id: refObj.id,
        name: refObj.name,
      });
    })
  );

  return referencesArray;
}
// #endregion

import actionTypes from '../../../../actions/types';

export default (state = [], action) => {
  const { type, resourceType, collection } = action;

  if (
    type === actionTypes.RESOURCE.RECEIVED_COLLECTION &&
    resourceType === 'ashares'
  ) {
    return collection ? [...collection] : [];
  }

  return state;
};

// #region PUBLIC SELECTORS

// #endregion

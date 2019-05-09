import actionTypes from '../../../../actions/types';
import { USER_ACCESS_LEVELS } from '../../../../utils/constants';

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

export function list(state) {
  if (!state || !state.length) {
    return [];
  }

  const aShares = state.map(share => ({
    ...share,
    accessLevel: share.accessLevel || USER_ACCESS_LEVELS.TILE,
  }));

  return aShares;
}

// #endregion

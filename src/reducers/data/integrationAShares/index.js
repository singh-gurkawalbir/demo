import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, resourceType, collection } = action;

  if (!resourceType) {
    return state;
  }

  switch (type) {
    case actionTypes.RESOURCE.RECEIVED_COLLECTION: {
      if (
        resourceType.startsWith('integrations/') &&
        resourceType.endsWith('/ashares')
      ) {
        const integrationId = resourceType
          .replace('integrations/', '')
          .replace('/ashares', '');

        return { ...state, [integrationId]: collection || [] };
      }

      return state;
    }

    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function integrationUsers(state, integrationId) {
  return state ? state[integrationId] : undefined;
}
// #endregion

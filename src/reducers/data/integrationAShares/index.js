import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, resourceType, collection } = action;

  if (!resourceType) {
    return state;
  }

  if (type !== actionTypes.RESOURCE.RECEIVED_COLLECTION) {
    return state;
  }

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
};

// #region PUBLIC SELECTORS
export function integrationUsers(state, integrationId) {
  return state ? state[integrationId] : undefined;
}
// #endregion

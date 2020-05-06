import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, resourceType, collection } = action;

  return produce(state, draft => {
    if (!resourceType && type !== actionTypes.RESOURCE.RECEIVED_COLLECTION) {
      return;
    }

    if (
      resourceType.startsWith('integrations/') &&
      resourceType.endsWith('/ashares')
    ) {
      const integrationId = resourceType
        .replace('integrations/', '')
        .replace('/ashares', '');

      draft[integrationId] = collection || [];
    }
  });
};

// #region PUBLIC SELECTORS
export function integrationUsers(state, integrationId) {
  return state ? state[integrationId] : undefined;
}
// #endregion

import actionTypes from '../actions/types';

export default function getRequestOptions(action, { resourceId } = {}) {
  switch (action) {
    case actionTypes.USER_CREATE:
      return { path: '/invite', opts: { method: 'POST' } };
    case actionTypes.USER_UPDATE:
      return { path: `/ashares/${resourceId}`, opts: { method: 'PUT' } };
    case actionTypes.USER_DELETE:
      return { path: `/ashares/${resourceId}`, opts: { method: 'DELETE' } };
    case actionTypes.USER_DISABLE:
      return {
        path: `/ashares/${resourceId}/disable`,
        opts: { method: 'PUT' },
      };
    case actionTypes.USER_MAKE_OWNER:
      return { path: '/transfers/invite', opts: { method: 'POST' } };
    default:
      return {};
  }
}

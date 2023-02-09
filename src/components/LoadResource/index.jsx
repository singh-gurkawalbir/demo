import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { STANDALONE_INTEGRATION } from '../../constants';

export default function LoadResource({ children, resourceType, resourceId, spinner }) {
  const dispatch = useDispatch();
  const resource = useSelector(state => {
    if (resourceId) {
      return selectors.resource(state, resourceType, resourceId);
    }

    return null;
  }, shallowEqual);

  useEffect(() => {
    if (resourceId && !resource && resourceId !== STANDALONE_INTEGRATION.id) {
      dispatch(actions.resource.request(resourceType, resourceId));
    }
  }, [dispatch, resource, resourceId, resourceType]);

  if ((resourceId && resource) || !resourceId || resourceId === STANDALONE_INTEGRATION.id) {
    return children || null;
  }

  return spinner || null;
}

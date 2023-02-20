import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { STANDALONE_INTEGRATION } from '../../constants';

export default function LoadResource({ children, resourceType, resourceId, spinner }) {
  const dispatch = useDispatch();
  const resource = useSelector(state => !!selectors.resource(state, resourceType, resourceId));

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

import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import { selectors } from '../../reducers';

export default function LoadResource({ children, resourceType, resourceId, spinner }) {
  const dispatch = useDispatch();
  const resource = useSelector(state => {
    if (resourceId) {
      return selectors.resource(state, resourceType, resourceId);
    }

    return null;
  }, shallowEqual);

  useEffect(() => {
    if (resourceId && !resource) {
      dispatch(actions.resource.request('integrations', resourceId));
    }
  }, [dispatch, resource, resourceId]);

  if ((resourceId && resource) || !resourceId) {
    return children || null;
  }

  return spinner || null;
}

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';

export default function CloneCrumb({ resourceId, resourceType }) {
  const dispatch = useDispatch();
  const resource = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)
  );

  useEffect(() => {
    if (!resource) {
      dispatch(actions.resource.request(resourceType, resourceId));
    }
  }, [dispatch, resource, resourceId, resourceType]);

  return resource ? resource.name : MODEL_PLURAL_TO_LABEL[resourceType];
}

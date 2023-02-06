import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../../reducers';
import actions from '../../actions';
import { isNewId, RESOURCES_WITH_UI_FIELDS } from '../../utils/resource';

export default function useLoadUIFields({ flowId, resourceId, resourceType }) {
  // given flow id check for resource in flowResources
  const flowResourcesStatus = useSelector(state => selectors.flowResourcesStatus(state, flowId));
  const dispatch = useDispatch();
  const resourceUIFields = useSelector(state => selectors.resourceUIFields(state, resourceId));
  const hasUIFieldsDependency = !isNewId(resourceId) && RESOURCES_WITH_UI_FIELDS.includes(resourceType);

  useEffect(() => {
    if (flowId && !flowResourcesStatus && !isNewId(flowId)) {
      // dispatch action to load resources
      dispatch(actions.uiFields.requestFlowLevel(flowId));
    }
  }, [dispatch, flowId, flowResourcesStatus]);

  useEffect(() => {
    if (!flowId && hasUIFieldsDependency && !resourceUIFields) {
      // dispatch action to load resource
      dispatch(actions.resource.request(resourceType, resourceId));
    }
  }, [dispatch, flowId, resourceId, resourceType, resourceUIFields, hasUIFieldsDependency]);

  if (!hasUIFieldsDependency) {
    // Incase of other resource types, we don't need to load the resource UI fields
    return true;
  }

  return !!resourceUIFields;
}

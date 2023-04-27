import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectors } from '../../reducers';
import actions from '../../actions';
import { isNewId, RESOURCES_WITH_UI_FIELDS } from '../../utils/resource';
import { isNestedDrawer } from '../../components/drawer/Resource/Panel';

export default function useLoadUIFields({ flowId, resourceId, resourceType }) {
  const dispatch = useDispatch();
  const location = useLocation();

  // nested drawer indicates, it has a parent resource, hence this is not a flow resource
  // so fetch the resource UI fields at resource level instead of flow level
  const hasParentResource = isNestedDrawer(location?.pathname);

  // selectors for flow level and resource ui fields
  const flowResourcesStatus = useSelector(state => selectors.flowResourcesStatus(state, flowId));
  const resourceUIFields = useSelector(state => selectors.resourceUIFields(state, resourceId));

  const hasUIFieldsDependency = !isNewId(resourceId) && RESOURCES_WITH_UI_FIELDS.includes(resourceType);

  useEffect(() => {
    if (flowId && !flowResourcesStatus && !isNewId(flowId)) {
      // dispatch action to load resources
      dispatch(actions.uiFields.requestFlowLevel(flowId));
    }
  }, [dispatch, flowId, flowResourcesStatus]);

  useEffect(() => {
    if ((!flowId || hasParentResource) && hasUIFieldsDependency && !resourceUIFields) {
      // dispatch action to load resource
      dispatch(actions.resource.request(resourceType, resourceId));
    }
  }, [dispatch, flowId, resourceId, resourceType, resourceUIFields, hasUIFieldsDependency, hasParentResource]);

  if (!hasUIFieldsDependency) {
    // Incase of other resource types, we don't need to load the resource UI fields
    return true;
  }

  return !!resourceUIFields;
}

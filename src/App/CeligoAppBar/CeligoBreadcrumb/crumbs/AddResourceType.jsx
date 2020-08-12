import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';

/*
 * Deals with labelling different resource types
 * Gets derived resource label based on flowId and resourceId/resourceType
 */
export default function AddResourceTypeCrumb({
  id: resourceId,
  resourceType,
  flowId,
}) {
  const resourceLabel = useSelector(state =>
    selectors.getCustomResourceLabel(state, {
      resourceType,
      resourceId,
      flowId,
    })
  );

  if (['accesstokens', 'connectors', 'apis'].includes(resourceType)) {
    return `Create ${resourceLabel}`;
  }

  return `Create ${resourceLabel.toLowerCase()}`;
}

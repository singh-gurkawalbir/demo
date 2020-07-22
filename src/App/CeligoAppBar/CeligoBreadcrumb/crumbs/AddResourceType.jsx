import { useSelector } from 'react-redux';
import { getCustomResourceLabel } from '../../../../reducers';

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
    getCustomResourceLabel(state, {
      resourceType,
      resourceId,
      flowId,
    })
  );
  if (resourceType === 'accesstokens') {
    return `Create ${resourceLabel}`;
  }

  return `Create ${resourceLabel.toLowerCase()}`;
}

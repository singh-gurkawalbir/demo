import { useSelector } from 'react-redux';
import { getCustomResourceLabel } from '../../../../reducers';
import { isNewId } from '../../../../utils/resource';

/*
 * Deals with labelling different resource types
 * Gets derived resource label based on flowId and resourceId/resourceType
 */
export default function EditResourceTypeCrumb({
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
  const action = isNewId(resourceId) ? 'Add' : 'Edit';
  if (resourceType === 'accesstokens') {
    return `${action} ${resourceLabel}`;
  }

  return `${action} ${resourceLabel.toLowerCase()}`;
}

import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
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
    selectors.getCustomResourceLabel(state, {
      resourceType,
      resourceId,
      flowId,
    })
  );
  const action = isNewId(resourceId) ? 'Add' : 'Edit';

  if (['accesstokens', 'connectors', 'apis'].includes(resourceType)) {
    return `${action} ${resourceLabel}`;
  }

  return `${action} ${resourceLabel.toLowerCase()}`;
}

import { useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';

/*
 * Deals with labelling different resource types
 * Only case we handle is when resource is a lookup , we determine the same with passed flow id and show accordingly
 * In all other cases, we just show the passed resourceType
 */
export default function EditResourceTypeCrumb({
  id: resourceId,
  resourceType,
  flowId,
}) {
  const isLookup = useSelector(state =>
    selectors.isLookUpExport(state, { resourceType, resourceId, flowId })
  );

  return `Edit ${isLookup ? 'Lookup' : MODEL_PLURAL_TO_LABEL[resourceType]}`;
}

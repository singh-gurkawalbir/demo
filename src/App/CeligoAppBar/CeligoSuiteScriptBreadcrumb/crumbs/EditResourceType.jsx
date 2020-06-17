/*
 * Deals with labelling different resource types
 * Gets derived resource label based on flowId and resourceId/resourceType
 */
export default function EditResourceTypeCrumb({
  resourceType,
}) {
  const resourceLabel = resourceType.replace('s', '');

  return `Edit ${resourceLabel}`;
}

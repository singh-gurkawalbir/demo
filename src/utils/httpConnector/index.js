import { layoutHasField } from '../form/metadata';

export function isValidDisplayAfterRef(refId, refMetadata) {
  const { layout, fieldMap } = refMetadata;

  if (!layout) {
    return !!fieldMap[refId];
  }

  return layoutHasField(layout, refId);
}

export function getHelpKey(resourceType, id) {
  return `${resourceType}.${id}`;
}

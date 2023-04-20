import { layoutHasField, getFieldIdsInLayoutOrder, removeFieldFromLayout } from '../form/metadata';
import customCloneDeep from '../customCloneDeep';

export function isValidDisplayAfterRef(refId, refMetadata) {
  const { layout, fieldMap } = refMetadata;

  if (!layout) {
    return !!fieldMap[refId];
  }

  return layoutHasField(layout, refId);
}

export function getMetadataWithFilteredDisplayRef(resourceMetadata, csMetadata) {
  const { fieldMap = {}, layout } = csMetadata || {};
  const fieldsList = layout ? getFieldIdsInLayoutOrder(layout) : Object.keys(fieldMap);

  // if the metadata has displayAfter and ref is valid , remove from cs fields
  const validDisplayAfterFieldIds = fieldsList.filter(fieldId => {
    const field = fieldMap[fieldId];

    if (!field.displayAfter) return false;

    const index = field.displayAfter?.indexOf('.');
    const displayAfterRef = field.displayAfter?.substr(index + 1);

    return isValidDisplayAfterRef(displayAfterRef, resourceMetadata);
  });

  const updatedFieldMetadata = customCloneDeep(csMetadata);

  validDisplayAfterFieldIds.forEach(fieldId => {
    // remove field from form metadata

    if (!updatedFieldMetadata.layout) {
      delete updatedFieldMetadata.fieldMap[fieldId];
    } else {
      removeFieldFromLayout(updatedFieldMetadata.layout, fieldId);
    }
  });

  return updatedFieldMetadata;
}

export function getHelpKey(resourceType, id) {
  return `${resourceType}.${id}`;
}

export function getEndPointMetadata(connectorMetadata = {}, resourceId, operationId) {
  if (!resourceId || !operationId) return;

  const resourceMetadata = connectorMetadata.resources?.find(resource => resource._id === resourceId);

  if (!resourceMetadata) return;

  return resourceMetadata.endpoints?.find(operation => operation.id === operationId);
}

export function getEndPointCustomSettings(connectorMetadata = {}, resourceId, operationId) {
  const endPointMetadata = getEndPointMetadata(connectorMetadata, resourceId, operationId);

  return endPointMetadata?.settingsForm;
}
